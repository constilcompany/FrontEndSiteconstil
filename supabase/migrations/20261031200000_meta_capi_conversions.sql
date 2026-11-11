BEGIN;

-- ============================================================================
-- META CAPI CONVERSIONS & ATOMIC DEDUPLICATION SETUP (V3 - COOLDOWN & UNIQUE KEY)
-- ============================================================================
-- Project: avppbvsxayehguepyjkb (CONSTIL Production)
-- ============================================================================

-- 1. Create table if it does not exist with base structure
CREATE TABLE IF NOT EXISTS public.meta_capi_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversion_key TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_id UUID NOT NULL
);

-- 2. Add all necessary columns additively in case table pre-existed with older schema
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS claim_token UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'claiming';
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0;
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.meta_capi_conversions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 3. Ensure unique constraint specifically on conversion_key exists (verifies single-column unique index)
DO $$
DECLARE
    v_has_unique_key BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM pg_index i
        JOIN pg_attribute a 
          ON a.attrelid = i.indrelid 
         AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = 'public.meta_capi_conversions'::regclass
          AND i.indisunique = TRUE
          AND a.attname = 'conversion_key'
          AND array_length(i.indkey, 1) = 1
    ) INTO v_has_unique_key;

    IF NOT v_has_unique_key THEN
        ALTER TABLE public.meta_capi_conversions 
        ADD CONSTRAINT meta_capi_conversions_conversion_key_unique UNIQUE (conversion_key);
    END IF;
END $$;

-- 4. Create Indexes idempotently
CREATE UNIQUE INDEX IF NOT EXISTS idx_meta_capi_conversions_key ON public.meta_capi_conversions(conversion_key);
CREATE INDEX IF NOT EXISTS idx_meta_capi_conversions_status ON public.meta_capi_conversions(status);
CREATE INDEX IF NOT EXISTS idx_meta_capi_conversions_token ON public.meta_capi_conversions(claim_token);

-- 5. Row Level Security & Role Grants
ALTER TABLE public.meta_capi_conversions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.meta_capi_conversions FROM PUBLIC;
GRANT ALL ON public.meta_capi_conversions TO postgres;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON public.meta_capi_conversions FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        REVOKE ALL ON public.meta_capi_conversions FROM authenticated;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        GRANT SELECT, INSERT, UPDATE ON public.meta_capi_conversions TO service_role;
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- RPC: claim_meta_capi_conversion
-- Atomically claims a milestone conversion lease. Generates a new claim_token.
-- Enforces retry cooldown & bounded retries for failed/uncertain states.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_meta_capi_conversion(
    p_conversion_key TEXT,
    p_event_name TEXT,
    p_event_id UUID,
    p_lock_timeout_seconds INT DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_record RECORD;
    v_new_token UUID := gen_random_uuid();
    v_now TIMESTAMPTZ := NOW();
BEGIN
    IF p_conversion_key IS NULL OR length(trim(p_conversion_key)) = 0 THEN
        RAISE EXCEPTION 'conversion_key cannot be null or empty';
    END IF;
    IF p_event_name IS NULL OR length(trim(p_event_name)) = 0 THEN
        RAISE EXCEPTION 'event_name cannot be null or empty';
    END IF;
    IF p_event_id IS NULL THEN
        RAISE EXCEPTION 'event_id cannot be null';
    END IF;

    INSERT INTO public.meta_capi_conversions AS c (
        conversion_key,
        event_name,
        event_id,
        claim_token,
        status,
        claimed_at,
        created_at,
        updated_at
    )
    VALUES (
        p_conversion_key,
        p_event_name,
        p_event_id,
        v_new_token,
        'claiming',
        v_now,
        v_now,
        v_now
    )
    ON CONFLICT (conversion_key) DO UPDATE
    SET 
        status = CASE 
            -- Expired in-flight claim (> lock timeout)
            WHEN c.status = 'claiming' AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second') THEN 'claiming'
            -- Recovery from failed or uncertain status with mandatory cooldown and retry bound (< 5 retries)
            WHEN c.status IN ('failed', 'uncertain') 
                 AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second') 
                 AND c.retry_count < 5 THEN 'claiming'
            ELSE c.status
        END,
        claim_token = CASE 
            WHEN (c.status = 'claiming' AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second'))
                 OR (c.status IN ('failed', 'uncertain') AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second') AND c.retry_count < 5)
            THEN v_new_token
            ELSE c.claim_token
        END,
        claimed_at = CASE 
            WHEN (c.status = 'claiming' AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second'))
                 OR (c.status IN ('failed', 'uncertain') AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second') AND c.retry_count < 5)
            THEN v_now
            ELSE c.claimed_at
        END,
        retry_count = CASE 
            WHEN (c.status = 'claiming' AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second'))
                 OR (c.status IN ('failed', 'uncertain') AND v_now >= c.claimed_at + (p_lock_timeout_seconds * INTERVAL '1 second') AND c.retry_count < 5)
            THEN c.retry_count + 1
            ELSE c.retry_count
        END,
        updated_at = v_now
    RETURNING c.id, c.status, c.event_id, c.claim_token, c.claimed_at, c.delivered_at, c.retry_count, (xmax = 0) AS is_new_insert
    INTO v_record;

    -- Brand new insert: claim acquired
    IF v_record.is_new_insert THEN
        RETURN jsonb_build_object(
            'claimed', TRUE,
            'claim_token', v_record.claim_token,
            'status', 'claiming',
            'event_id', v_record.event_id,
            'is_duplicate', FALSE
        );
    END IF;

    -- Already delivered: permanently deduplicated
    IF v_record.status = 'delivered' THEN
        RETURN jsonb_build_object(
            'claimed', FALSE,
            'claim_token', NULL,
            'status', 'delivered',
            'event_id', v_record.event_id,
            'is_duplicate', TRUE,
            'delivered_at', v_record.delivered_at
        );
    END IF;

    -- Re-claimed expired lease or retry after cooldown
    IF v_record.status = 'claiming' AND v_record.claim_token = v_new_token THEN
        RETURN jsonb_build_object(
            'claimed', TRUE,
            'claim_token', v_record.claim_token,
            'status', 'claiming',
            'event_id', v_record.event_id,
            'is_duplicate', FALSE,
            'is_recovery', TRUE,
            'retry_count', v_record.retry_count
        );
    END IF;

    -- If in cooldown or retry exhausted
    IF v_record.status IN ('failed', 'uncertain') THEN
        RETURN jsonb_build_object(
            'claimed', FALSE,
            'claim_token', NULL,
            'status', 'retry_cooldown',
            'event_id', v_record.event_id,
            'is_duplicate', TRUE,
            'retry_count', v_record.retry_count
        );
    ELSE
        -- Active lease held by another worker
        RETURN jsonb_build_object(
            'claimed', FALSE,
            'claim_token', NULL,
            'status', 'in_flight',
            'event_id', v_record.event_id,
            'is_duplicate', TRUE
        );
    END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- RPC: finalize_meta_capi_conversion
-- Requires matching conversion_key, claim_token, and status = 'claiming'.
-- Prevents stale/expired workers from overwriting newer retries.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.finalize_meta_capi_conversion(
    p_conversion_key TEXT,
    p_claim_token UUID,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_rows_updated INT;
BEGIN
    IF p_status NOT IN ('delivered', 'failed', 'uncertain') THEN
        RAISE EXCEPTION 'Invalid status: %. Must be delivered, failed, or uncertain', p_status;
    END IF;

    UPDATE public.meta_capi_conversions
    SET 
        status = p_status,
        delivered_at = CASE WHEN p_status = 'delivered' THEN NOW() ELSE delivered_at END,
        error_message = p_error_message,
        updated_at = NOW()
    WHERE conversion_key = p_conversion_key
      AND claim_token = p_claim_token
      AND status = 'claiming';

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    IF v_rows_updated = 1 THEN
        RETURN jsonb_build_object('success', TRUE, 'finalized_status', p_status);
    ELSE
        RETURN jsonb_build_object(
            'success', FALSE, 
            'warning', 'STALE_LEASE_IGNORED',
            'message', 'Row was not updated because claim_token was superseded or state already transitioned.'
        );
    END IF;
END;
$$;

-- Secure execution permissions
REVOKE ALL ON FUNCTION public.claim_meta_capi_conversion(TEXT, TEXT, UUID, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_meta_capi_conversion(TEXT, TEXT, UUID, INT) TO postgres;

REVOKE ALL ON FUNCTION public.finalize_meta_capi_conversion(TEXT, UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finalize_meta_capi_conversion(TEXT, UUID, TEXT, TEXT) TO postgres;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON FUNCTION public.claim_meta_capi_conversion(TEXT, TEXT, UUID, INT) FROM anon;
        REVOKE ALL ON FUNCTION public.finalize_meta_capi_conversion(TEXT, UUID, TEXT, TEXT) FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        REVOKE ALL ON FUNCTION public.claim_meta_capi_conversion(TEXT, TEXT, UUID, INT) FROM authenticated;
        REVOKE ALL ON FUNCTION public.finalize_meta_capi_conversion(TEXT, UUID, TEXT, TEXT) FROM authenticated;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        GRANT EXECUTE ON FUNCTION public.claim_meta_capi_conversion(TEXT, TEXT, UUID, INT) TO service_role;
        GRANT EXECUTE ON FUNCTION public.finalize_meta_capi_conversion(TEXT, UUID, TEXT, TEXT) TO service_role;
    END IF;
END $$;

COMMIT;
