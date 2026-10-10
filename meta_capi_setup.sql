BEGIN;

-- META CAPI SETUP WITH ATOMIC SHARED RATE LIMITING (TRUE FIXED-WINDOW)
-- ---------------------------------------------------------
-- This migration is strictly safe for production.
-- It preserves existing data, NEVER deletes records, and wraps in a transaction.
-- ---------------------------------------------------------

-- 1. Create table IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.meta_capi_rate_limits (
    ip_address INET PRIMARY KEY,
    request_count INT NOT NULL DEFAULT 1,
    last_request_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Safe Migration Block (Migrate from TEXT to INET safely inside the transaction)
DO $$ 
DECLARE
    col_type TEXT;
    rec RECORD;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'meta_capi_rate_limits'
      AND column_name = 'ip_address';

    -- If the column was historically created as TEXT, cast it to INET
    IF col_type = 'text' OR col_type = 'character varying' THEN
        
        -- Loop through records to strictly validate INET casts natively, 
        -- bypassing the need for temporary functions completely.
        FOR rec IN SELECT ip_address FROM public.meta_capi_rate_limits
        LOOP
            BEGIN
                PERFORM rec.ip_address::INET;
            EXCEPTION WHEN invalid_text_representation THEN
                -- If invalid data exists, abort the migration with an informative error!
                -- Because this is in a transaction, everything rolls back seamlessly.
                RAISE EXCEPTION 'Migration halted safely: Found invalid IP address that cannot be cast to INET: "%"', rec.ip_address;
            END;
        END LOOP;
        
        -- Since all data is valid, safely alter the column type
        ALTER TABLE public.meta_capi_rate_limits 
        ALTER COLUMN ip_address TYPE INET USING ip_address::INET;
        
    END IF;
END $$;

-- 3. Secure the table (Prevent direct access from APIs)
REVOKE ALL ON public.meta_capi_rate_limits FROM PUBLIC;
REVOKE ALL ON public.meta_capi_rate_limits FROM anon;
REVOKE ALL ON public.meta_capi_rate_limits FROM authenticated;
GRANT ALL ON public.meta_capi_rate_limits TO service_role;
GRANT ALL ON public.meta_capi_rate_limits TO postgres;

-- 4. Create atomic, concurrency-safe RPC
CREATE OR REPLACE FUNCTION public.check_meta_capi_rate_limit(
    client_ip TEXT,
    max_requests INT,
    window_seconds INT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '' -- Secure search_path to prevent malicious overrides
AS $$
DECLARE
    is_allowed BOOLEAN;
    parsed_ip INET;
BEGIN
    -- Explicit NULL & Bounds Rejection
    IF client_ip IS NULL OR trim(client_ip) = '' THEN
        RAISE EXCEPTION 'client_ip cannot be null or empty';
    END IF;
    IF max_requests IS NULL OR max_requests <= 0 THEN
        RAISE EXCEPTION 'max_requests must be a strictly positive integer';
    END IF;
    IF window_seconds IS NULL OR window_seconds <= 0 THEN
        RAISE EXCEPTION 'window_seconds must be a strictly positive integer';
    END IF;

    -- Validate IP Address format natively via PostgreSQL INET casting
    BEGIN
        parsed_ip := client_ip::INET;
    EXCEPTION WHEN invalid_text_representation THEN
        RAISE EXCEPTION 'Invalid IP address format: %', client_ip;
    END;

    -- Atomic UPSERT using ON CONFLICT row locking
    -- Implements a TRUE Fixed-Window by ONLY updating the timestamp when the window expires
    INSERT INTO public.meta_capi_rate_limits AS t (ip_address, request_count, last_request_time)
    VALUES (parsed_ip, 1, NOW())
    ON CONFLICT (ip_address) DO UPDATE
    SET 
        request_count = CASE 
            WHEN NOW() >= t.last_request_time + (window_seconds * INTERVAL '1 second') THEN 1
            ELSE t.request_count + 1
        END,
        last_request_time = CASE 
            -- Update timestamp ONLY if a new window starts
            WHEN NOW() >= t.last_request_time + (window_seconds * INTERVAL '1 second') THEN NOW()
            -- Otherwise, strictly preserve the original window start time!
            ELSE t.last_request_time
        END
    RETURNING (request_count <= max_requests) INTO is_allowed;

    RETURN is_allowed;
END;
$$;

-- 5. Secure the RPC (Revoke execution from frontend, grant only to backend service_role)
REVOKE ALL ON FUNCTION public.check_meta_capi_rate_limit(TEXT, INT, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_meta_capi_rate_limit(TEXT, INT, INT) FROM anon;
REVOKE ALL ON FUNCTION public.check_meta_capi_rate_limit(TEXT, INT, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_meta_capi_rate_limit(TEXT, INT, INT) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_meta_capi_rate_limit(TEXT, INT, INT) TO postgres;

COMMIT;
