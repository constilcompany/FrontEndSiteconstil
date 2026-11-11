import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RATE_LIMIT_WINDOW_SEC = 60;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_REGISTRATION_WINDOW_SEC = 3600; // 60 minutes for newly completed registration
const CONVERSION_LOCK_TIMEOUT_SEC = 60;   // 60 seconds atomic lease timeout

// Approved production domains (Strict exact match)
const ALLOWED_PRODUCTION_ORIGINS = [
  'https://constil.com',
  'https://www.constil.com',
  'https://app.constil.com'
];

const ALLOWED_PRODUCTION_HOSTNAMES = [
  'constil.com',
  'www.constil.com',
  'app.constil.com'
];

// Tier 1: Client Intent Events (Can be dispatched by public browser sessions via Anon key)
const CLIENT_INTENT_EVENTS = [
  'PageView',
  'ViewContent',
  'Lead',
  'signup_started',
  'blueprint_upload_started',
  'generate_estimate_clicked',
  'estimate_failed'
];

// Tier 2: Verified Conversion Milestones (REJECTS browser sessions; requires trusted server credentials + DB validation)
const VERIFIED_CONVERSION_MILESTONES = [
  'CompleteRegistration',
  'blueprint_uploaded',
  'estimate_generated'
];

const ALL_ALLOWED_EVENTS = [...CLIENT_INTENT_EVENTS, ...VERIFIED_CONVERSION_MILESTONES];

const SHA256_HEX_REGEX = /^[0-9a-f]{64}$/i;

async function sha256Hex(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Normalizes and SHA-256 hashes customer information according to Meta CAPI specification.
 * Never forwards raw PII.
 */
async function normalizeAndHashCustomerField(
  value: unknown,
  type: 'em' | 'ph' | 'fn' | 'ln'
): Promise<string | undefined> {
  if (typeof value !== 'string') return undefined;
  const raw = value.trim();
  if (!raw) return undefined;

  // Already a valid SHA-256 hex string? Return lowercase
  if (SHA256_HEX_REGEX.test(raw)) {
    return raw.toLowerCase();
  }

  let normalized = '';
  switch (type) {
    case 'em': {
      normalized = raw.toLowerCase();
      // Basic check for email shape
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return undefined; // Invalid email, never forward raw
      }
      break;
    }
    case 'ph': {
      // Remove all non-digits
      const digitsOnly = raw.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        return undefined; // Too short for a valid phone number
      }
      // US 10-digit number without country code
      normalized = digitsOnly.length === 10 ? '1' + digitsOnly : digitsOnly;
      break;
    }
    case 'fn':
    case 'ln': {
      // Lowercase, remove whitespace and special symbols/punctuation
      normalized = raw.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
      if (!normalized) return undefined;
      break;
    }
  }

  return await sha256Hex(normalized);
}

/**
 * Standards-Compliant RFC 4122 §4.3 UUIDv5 Implementation
 * Uses SHA-1 digest over a 16-byte binary namespace UUID and UTF-8 name bytes.
 * Namespace: RFC 4122 DNS Namespace (6ba7b810-9dad-11d1-80b4-00c04fd430c8)
 */
const RFC4122_DNS_NAMESPACE_BYTES = new Uint8Array([
  0x6b, 0xa7, 0xb8, 0x10, 0x9d, 0xad, 0x11, 0xd1,
  0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8
]);

async function generateDeterministicEventId(name: string): Promise<string> {
  const nameBytes = new TextEncoder().encode(name);
  const combined = new Uint8Array(RFC4122_DNS_NAMESPACE_BYTES.length + nameBytes.length);
  combined.set(RFC4122_DNS_NAMESPACE_BYTES, 0);
  combined.set(nameBytes, RFC4122_DNS_NAMESPACE_BYTES.length);

  const hashBuffer = await crypto.subtle.digest('SHA-1', combined);
  const hashBytes = new Uint8Array(hashBuffer);

  // Set RFC 4122 version 5 (0b0101 in high nibble of octet 6)
  hashBytes[6] = (hashBytes[6] & 0x0f) | 0x50;
  // Set RFC 4122 variant 1 (0b10 in high bits of octet 8)
  hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80;

  const hex = Array.from(hashBytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Strict IPv4 and IPv6 format validator
 */
function isValidIp(ip: string | null | undefined): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const s = ip.trim();
  const ipv4Match = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    return ipv4Match.slice(1).every(octet => {
      const n = Number(octet);
      return n >= 0 && n <= 255 && (octet === '0' || !octet.startsWith('0'));
    });
  }
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
  return ipv6Regex.test(s);
}

/**
 * Checks if an IP is private, loopback, or link-local
 */
function isPrivateOrGatewayIp(ip: string): boolean {
  if (!isValidIp(ip)) return true;
  const s = ip.trim();
  if (s === '127.0.0.1' || s === '::1' || s === 'localhost') return true;
  if (s.startsWith('0.') || s.startsWith('10.') || s.startsWith('192.168.') || s.startsWith('169.254.')) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(s)) return true;
  if (/^(fc|fd|fe80)/i.test(s)) return true;
  return false;
}

/**
 * Detects whether execution is in a hosted cloud environment (Supabase / Deno Deploy)
 */
function isHostedEnvironment(): boolean {
  return Boolean(
    Deno.env.get('DENO_DEPLOYMENT_ID') ||
    Deno.env.get('SB_REGION') ||
    Deno.env.get('SB_EXECUTION_ID')
  );
}

const FALLBACK_BUCKET_COUNT = 16;

function getFallbackRateLimitIp(req: Request): string {
  const ua = req.headers.get('user-agent') || 'unspecified-client';
  let hash = 0;
  for (let i = 0; i < ua.length; i++) {
    hash = ((hash << 5) - hash) + ua.charCodeAt(i);
    hash |= 0;
  }
  const bucketIndex = Math.abs(hash) % FALLBACK_BUCKET_COUNT;
  return `0.0.0.${bucketIndex}`;
}

interface ClientIpResult {
  ip: string;
  isVerified: boolean;
}

function getTrustedClientIp(req: Request): ClientIpResult {
  const isHosted = isHostedEnvironment();
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  const isLocalOrigin = !isHosted && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));

  const cfConnectingIp = req.headers.get('cf-connecting-ip')?.trim();

  // In hosted cloud environments (Supabase/Deno Deploy behind Cloudflare),
  // Cloudflare sets cf-connecting-ip at the network perimeter.
  if (isHosted && cfConnectingIp && isValidIp(cfConnectingIp) && !isPrivateOrGatewayIp(cfConnectingIp)) {
    return { ip: cfConnectingIp, isVerified: true };
  }

  // In local development or untrusted environments, caller-controlled headers are NOT labeled as verified
  if (isLocalOrigin) {
    return { ip: '127.0.0.1', isVerified: false };
  }

  const fallbackIp = getFallbackRateLimitIp(req);
  return { ip: fallbackIp, isVerified: false };
}

/**
 * Exact-Origin Validation
 */
function isExactAllowedOrigin(targetUrlOrOrigin: string | null, isHosted: boolean): boolean {
  if (!targetUrlOrOrigin) return true; // Direct backend server-to-server calls without origin header
  try {
    const url = new URL(targetUrlOrOrigin);
    const exactOrigin = url.origin;
    const hostname = url.hostname;

    if (ALLOWED_PRODUCTION_ORIGINS.includes(exactOrigin)) {
      return true;
    }

    if (!isHosted && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Origin-Aware CORS Headers (No Wildcards)
 */
function getCorsHeaders(req: Request, isHosted: boolean): Record<string, string> {
  const originHeader = req.headers.get('origin');
  const refererHeader = req.headers.get('referer');
  const originToCheck = originHeader || refererHeader;
  const isAllowed = isExactAllowedOrigin(originToCheck, isHosted);

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-capi-internal-token, x-capi-test-key',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };

  if (isAllowed && originHeader) {
    headers['Access-Control-Allow-Origin'] = originHeader;
  }

  return headers;
}

interface MilestoneValidationResult {
  valid: boolean;
  error?: string;
  canonicalId?: string;
}

/**
 * Checks authoritative stored marketing consent directly in Supabase Auth & user profile.
 * Never trusts a caller-supplied boolean alone.
 */
async function checkAuthoritativeStoredConsent(
  supabaseAdmin: any,
  userId: string
): Promise<{ granted: boolean; reason?: string }> {
  // 1. Check auth.users user_metadata / raw_user_meta_data
  const { data: userData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (authError || !userData?.user) {
    return { granted: false, reason: `Authoritative consent check failed: User '${userId}' does not exist in auth.users.` };
  }

  const meta = userData.user.user_metadata || userData.user.raw_user_meta_data || {};
  if (meta.marketing_consent === true || meta.consent === true || meta.marketing === true) {
    return { granted: true };
  }

  // 2. Check public.profiles table if present
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('marketing_consent, cookie_preferences')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile) {
    if (profile.marketing_consent === true) return { granted: true };
    if (profile.cookie_preferences && typeof profile.cookie_preferences === 'object') {
      if (profile.cookie_preferences.advertising === true || profile.cookie_preferences.marketing === true) {
        return { granted: true };
      }
    }
  }

  return {
    granted: false,
    reason: `Authoritative consent check failed: User '${userId}' does not have affirmative marketing consent in stored account records.`
  };
}

/**
 * Authoritative Backend Milestone Validation
 * Validates against authoritative database and S3 records in Supabase/PostgreSQL.
 */
async function validateAuthoritativeMilestone(
  eventName: string,
  body: any,
  supabaseAdmin: any
): Promise<MilestoneValidationResult> {
  const milestoneData = body.milestone_data || {};
  const recordId = milestoneData.record_id || body.record_id;

  switch (eventName) {
    case 'CompleteRegistration': {
      const userId = recordId || milestoneData.user_id || body.user_id;
      if (!userId || typeof userId !== 'string') {
        return { valid: false, error: "Missing required 'user_id' in milestone_data for CompleteRegistration." };
      }

      // Query Supabase Auth admin API to verify user exists
      const { data: userData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (authError || !userData?.user) {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' does not exist in auth.users.` };
      }

      // Date validation & future timestamp check
      const rawCreatedAt = userData.user.created_at;
      if (!rawCreatedAt || typeof rawCreatedAt !== 'string') {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' created_at is missing or invalid.` };
      }

      const createdAtMs = Date.parse(rawCreatedAt);
      if (isNaN(createdAtMs)) {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' created_at ('${rawCreatedAt}') is an invalid date.` };
      }

      const nowMs = Date.now();
      // Reject future timestamps (allow max 60s for server clock skew)
      if (createdAtMs > nowMs + 60000) {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' created_at ('${rawCreatedAt}') is in the future.` };
      }

      // Confirm user is newly registered (within 60-minute window)
      const ageSeconds = (nowMs - createdAtMs) / 1000;
      if (ageSeconds > MAX_REGISTRATION_WINDOW_SEC) {
        return { 
          valid: false, 
          error: `Authoritative validation failed: User '${userId}' was created at ${rawCreatedAt} (${Math.round(ageSeconds / 60)} minutes ago), exceeding the 60-minute window for newly completed registration.` 
        };
      }

      // Verify authoritative stored marketing consent in auth.users / profiles
      const consentResult = await checkAuthoritativeStoredConsent(supabaseAdmin, userId);
      if (!consentResult.granted) {
        return { valid: false, error: consentResult.reason };
      }

      return { valid: true, canonicalId: userId };
    }

    case 'blueprint_uploaded': {
      const exactPdfKey = milestoneData.pdf_key || milestoneData.file_path || recordId;
      const userId = milestoneData.user_id || body.user_id;

      if (!exactPdfKey || typeof exactPdfKey !== 'string') {
        return { valid: false, error: "Missing required 'pdf_key' in milestone_data for blueprint_uploaded." };
      }
      if (!userId || typeof userId !== 'string') {
        return { valid: false, error: "Missing required 'user_id' in milestone_data for blueprint_uploaded ownership verification." };
      }

      // Strict format: blueprints/{userId}/{timestamp}_{random}.pdf
      const keyPattern = /^blueprints\/[0-9a-f-]{36}\/\d+_[0-9a-zA-Z-]+\.pdf$/;
      if (!keyPattern.test(exactPdfKey)) {
        return { valid: false, error: `Authoritative validation failed: '${exactPdfKey}' does not match required exact S3 blueprint key format.` };
      }

      // Key path must contain the exact user_id
      const expectedPrefix = `blueprints/${userId}/`;
      if (!exactPdfKey.startsWith(expectedPrefix)) {
        return { valid: false, error: `Authoritative validation failed: Blueprint ownership mismatch. Key does not belong to user '${userId}'.` };
      }

      // Verify exact record in pdf_jobs backend table with ownership and verified S3 upload
      const { data: jobRecord } = await supabaseAdmin
        .from('pdf_jobs')
        .select('id, pdf_key, user_id, userid, detail')
        .eq('pdf_key', exactPdfKey)
        .maybeSingle();

      if (!jobRecord) {
        return { valid: false, error: `Authoritative validation failed: Exact blueprint key '${exactPdfKey}' was not confirmed in backend records.` };
      }

      const recordUserId = jobRecord.user_id || jobRecord.userid;
      if (recordUserId !== userId) {
        return { valid: false, error: `Authoritative validation failed: Blueprint record belongs to user '${recordUserId}', not '${userId}'.` };
      }

      // Confirm upload verification: either job detail contains payload_hash (set by atomic upload procedure)
      // or milestone explicitly affirms upload_verified
      const detail = jobRecord.detail || {};
      const hasVerifiedUpload = Boolean(detail.payload_hash || detail.idempotency_key || milestoneData.upload_verified === true);
      if (!hasVerifiedUpload) {
        return { valid: false, error: `Authoritative validation failed: Blueprint '${exactPdfKey}' does not have verified S3 upload record.` };
      }

      // Verify authoritative stored marketing consent for this user
      const consentResult = await checkAuthoritativeStoredConsent(supabaseAdmin, userId);
      if (!consentResult.granted) {
        return { valid: false, error: consentResult.reason };
      }

      return { valid: true, canonicalId: exactPdfKey };
    }

    case 'estimate_generated': {
      const jobId = recordId || milestoneData.job_id || milestoneData.estimate_id;
      const expectedUserId = milestoneData.user_id || body.user_id;

      if (!jobId || typeof jobId !== 'string') {
        return { valid: false, error: "Missing required 'job_id' in milestone_data for estimate_generated." };
      }
      if (!expectedUserId || typeof expectedUserId !== 'string') {
        return { valid: false, error: "Missing required 'user_id' in milestone_data for estimate_generated." };
      }

      // Query authoritative pdf_jobs table
      const { data: job, error: jobErr } = await supabaseAdmin
        .from('pdf_jobs')
        .select('id, status, user_id, userid, detail')
        .eq('id', jobId)
        .maybeSingle();

      if (jobErr || !job) {
        return { valid: false, error: `Authoritative validation failed: Estimation job '${jobId}' does not exist in pdf_jobs.` };
      }

      // 1. Verify job belongs strictly to expected user
      const actualJobUserId = job.user_id || job.userid;
      if (actualJobUserId !== expectedUserId) {
        return { 
          valid: false, 
          error: `Authoritative validation failed: Estimation job '${jobId}' belongs to user '${actualJobUserId}', not '${expectedUserId}'.` 
        };
      }

      // 2. Require application successful completion status strictly ('done')
      const rawStatus = (job.status || '').trim().toLowerCase();
      if (rawStatus !== 'done') {
        return { 
          valid: false, 
          error: `Authoritative validation failed: Estimation job '${jobId}' has status '${job.status}'. Only application successful completion status ('done') is accepted.` 
        };
      }

      // 3. Verify detail payload is populated (proving AI estimation result actually saved)
      if (!job.detail || (typeof job.detail === 'object' && Object.keys(job.detail).length === 0)) {
        return {
          valid: false,
          error: `Authoritative validation failed: Estimation job '${jobId}' status is 'done' but has empty detail payload.`
        };
      }

      // 4. Verify authoritative stored marketing consent for this user
      const consentResult = await checkAuthoritativeStoredConsent(supabaseAdmin, expectedUserId);
      if (!consentResult.granted) {
        return { valid: false, error: consentResult.reason };
      }

      return { valid: true, canonicalId: jobId };
    }

    default:
      return { valid: true };
  }
}

serve(async (req) => {
  const isHosted = isHostedEnvironment();
  const corsHeaders = getCorsHeaders(req, isHosted);

  // 1. Handle CORS Preflight Requests (Origin-Aware)
  if (req.method === 'OPTIONS') {
    const originHeader = req.headers.get('origin');
    if (originHeader && !corsHeaders['Access-Control-Allow-Origin']) {
      return new Response(JSON.stringify({ error: "Forbidden Origin" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only POST is permitted
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // 2. Strict Exact-Origin Verification for POST requests
    const originHeader = req.headers.get('origin');
    const refererHeader = req.headers.get('referer');
    if ((originHeader || refererHeader) && !isExactAllowedOrigin(originHeader || refererHeader, isHosted)) {
      return new Response(JSON.stringify({ error: "Forbidden Origin" }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. IP Rate Limiting via Supabase DB (Shared across Edge Functions)
    const ipResult = getTrustedClientIp(req);
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
      return new Response(JSON.stringify({ error: "Server Configuration Error" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: isAllowedLimit, error: rpcError } = await supabase.rpc('check_meta_capi_rate_limit', {
      client_ip: ipResult.ip,
      max_requests: MAX_REQUESTS_PER_WINDOW,
      window_seconds: RATE_LIMIT_WINDOW_SEC
    });

    if (rpcError) {
      console.error("Rate limit DB error:", rpcError);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!isAllowedLimit) {
      console.warn(`Rate limit exceeded for IP: ${ipResult.ip} (verified: ${ipResult.isVerified})`);
      return new Response(JSON.stringify({ error: "Too Many Requests", ip: ipResult.ip }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 4. Body Parsing with Size Limit
    const bodyText = await req.text();
    if (bodyText.length > 5000) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let body: any;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return new Response(JSON.stringify({ error: "Malformed JSON payload" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { 
      event_name, 
      event_id: clientEventId, 
      event_source_url, 
      content_name, 
      fbp, 
      fbc, 
      user_data: clientUserData, 
      test_event_code,
      consent,
      has_consent,
      opt_out,
      data_processing_options,
      data_processing_options_country,
      data_processing_options_state
    } = body;

    // 5. Explicit Verifiable Marketing Consent Enforcement
    // Missing or non-affirmative consent MUST NOT silently authorize marketing tracking.
    const isAffirmativeConsent = (
      consent === true ||
      has_consent === true ||
      body.marketing_consent === true ||
      body.user_consent === true
    );

    if (!isAffirmativeConsent || opt_out === true || consent === false || has_consent === false) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          skipped: true, 
          reason: "Explicit marketing consent not confirmed. Marketing tracking skipped." 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 6. Strict Payload Validation
    if (!event_name) {
      return new Response(JSON.stringify({ error: "Missing required field: event_name" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Event Whitelist Enforcement
    if (!ALL_ALLOWED_EVENTS.includes(event_name)) {
      return new Response(JSON.stringify({ error: "Unauthorized event type", event: event_name }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let canonicalMilestoneId: string | undefined = undefined;
    let milestoneKey: string | undefined = undefined;
    let effectiveEventId: string = clientEventId;
    let claimToken: string | undefined = undefined;

    // 7. Trusted Server-Side Authorization for Conversion Milestones
    // CRITICAL: Authenticated user sessions are EXPLICITLY REJECTED as sufficient authorization.
    // Only trusted server-side services providing securely stored credentials can dispatch milestone conversions.
    if (VERIFIED_CONVERSION_MILESTONES.includes(event_name)) {
      const internalSecret = Deno.env.get('CAPI_INTERNAL_SECRET');
      const incomingInternalToken = req.headers.get('x-capi-internal-token');
      const authHeader = req.headers.get('Authorization') || '';

      const isInternalSecretValid = Boolean(internalSecret && incomingInternalToken && incomingInternalToken === internalSecret);
      const isServiceRoleValid = Boolean(supabaseServiceKey && authHeader === `Bearer ${supabaseServiceKey}`);

      if (!isInternalSecretValid && !isServiceRoleValid) {
        console.warn(`Unauthorized conversion milestone attempt: '${event_name}' rejected. Caller lacked trusted server-side credentials.`);
        return new Response(
          JSON.stringify({
            error: "Forbidden: Verified conversion milestones can only be dispatched by trusted server-side services with authoritative backend credentials.",
            event: event_name
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 8. Authoritative Backend Milestone Validation
      const validation = await validateAuthoritativeMilestone(event_name, body, supabase);
      if (!validation.valid) {
        console.warn(`Conversion milestone rejected by authoritative data check: ${validation.error}`);
        return new Response(
          JSON.stringify({
            error: validation.error,
            event: event_name
          }),
          {
            status: 422,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      canonicalMilestoneId = validation.canonicalId!;
      milestoneKey = `${event_name}:${canonicalMilestoneId}`;

      // 9. Deterministic event_id Generation for Verified Milestones (RFC 4122 §4.3 UUIDv5)
      effectiveEventId = await generateDeterministicEventId(milestoneKey);

      // 10. FAIL-CLOSED Atomic Database Conversion Claiming
      // Strictly requires database confirmation with active claim_token before dispatching to Meta
      const { data: claimResult, error: claimErr } = await supabase.rpc('claim_meta_capi_conversion', {
        p_conversion_key: milestoneKey,
        p_event_name: event_name,
        p_event_id: effectiveEventId,
        p_lock_timeout_seconds: CONVERSION_LOCK_TIMEOUT_SEC
      });

      if (claimErr) {
        console.error("Critical: claim_meta_capi_conversion RPC failed:", claimErr);
        return new Response(
          JSON.stringify({
            error: "Database lock error: Failed to claim milestone conversion atomically.",
            details: claimErr.message
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (!claimResult || typeof claimResult !== 'object') {
        console.error("Critical: Unexpected null/invalid claim response from database.");
        return new Response(
          JSON.stringify({ error: "Database lock error: Empty claim result received." }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // If duplicate or currently in-flight, immediately prevent duplicate dispatch
      if (claimResult.is_duplicate) {
        return new Response(
          JSON.stringify({
            success: true,
            deduplicated: true,
            status: claimResult.status,
            event_id: claimResult.event_id || effectiveEventId,
            message: `Milestone '${event_name}' already processed or currently in-flight (idempotent duplicate prevented).`
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // FAIL-CLOSED: Claim must be explicitly granted with valid claim_token
      if (!claimResult.claimed || !claimResult.claim_token) {
        console.error("Critical: Database denied claim without duplicate flag:", claimResult);
        return new Response(
          JSON.stringify({ error: "Conversion claim denied by database lock engine." }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      claimToken = claimResult.claim_token;
    } else {
      // For Client Intent Events (PageView, Lead, etc.), validate clientEventId is supplied
      if (!effectiveEventId) {
        return new Response(JSON.stringify({ error: "Missing required field: event_id" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 11. Validate event_source_url Protocol and Exact Hostname
    if (!event_source_url || typeof event_source_url !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid event_source_url" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    try {
      const parsedUrl = new URL(event_source_url);
      const protocol = parsedUrl.protocol;
      const hostname = parsedUrl.hostname;

      const isAllowedProtocol = protocol === 'https:' || (!isHosted && protocol === 'http:');
      const isAllowedHost = ALLOWED_PRODUCTION_HOSTNAMES.includes(hostname) ||
        (!isHosted && (hostname === 'localhost' || hostname === '127.0.0.1'));

      if (!isAllowedProtocol || !isAllowedHost) {
        return new Response(JSON.stringify({ error: "Forbidden event_source_url: protocol or hostname not permitted" }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch {
      return new Response(JSON.stringify({ error: "Malformed event_source_url" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 12. Validate event_id Format (Strict UUID format)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(effectiveEventId)) {
      return new Response(JSON.stringify({ error: "Invalid event_id format: must be valid UUID" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let safe_content_name = content_name;
    if (safe_content_name && typeof safe_content_name === 'string') {
      safe_content_name = safe_content_name.substring(0, 100);
    }

    const META_ACCESS_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN");
    const PIXEL_ID = Deno.env.get("META_PIXEL_ID") || "1394045752925191";

    if (!META_ACCESS_TOKEN) {
      console.error("Missing META_CAPI_ACCESS_TOKEN secret!");
      return new Response(JSON.stringify({ error: "Server Configuration Error" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userAgent = req.headers.get('user-agent');

    // SECURITY CRITICAL: Untrusted or fallback IPs are NEVER forwarded to Meta Graph API
    // Only verified public IPs from hosted environments are forwarded
    const user_data: any = {
      client_ip_address: (isHosted && ipResult.isVerified && !ipResult.ip.startsWith('0.') && !isPrivateOrGatewayIp(ipResult.ip)) ? ipResult.ip : undefined,
      client_user_agent: userAgent
    };

    // PRIVACY CRITICAL: Normalize and SHA-256 hash customer identifiers. Never forward raw PII!
    if (clientUserData && typeof clientUserData === 'object') {
      const emHashed = await normalizeAndHashCustomerField(clientUserData.em, 'em');
      if (emHashed) user_data.em = emHashed;

      const phHashed = await normalizeAndHashCustomerField(clientUserData.ph, 'ph');
      if (phHashed) user_data.ph = phHashed;

      const fnHashed = await normalizeAndHashCustomerField(clientUserData.fn, 'fn');
      if (fnHashed) user_data.fn = fnHashed;

      const lnHashed = await normalizeAndHashCustomerField(clientUserData.ln, 'ln');
      if (lnHashed) user_data.ln = lnHashed;
      
      if (typeof clientUserData.fbp === 'string' && clientUserData.fbp.length < 50) user_data.fbp = clientUserData.fbp;
      if (typeof clientUserData.fbc === 'string' && clientUserData.fbc.length < 200) user_data.fbc = clientUserData.fbc;
    }

    if (!user_data.fbp && fbp && typeof fbp === 'string' && fbp.length < 50) user_data.fbp = fbp;
    if (!user_data.fbc && fbc && typeof fbc === 'string' && fbc.length < 200) user_data.fbc = fbc;

    const custom_data: any = {};
    if (safe_content_name) custom_data.content_name = safe_content_name;

    let safe_test_event_code: string | undefined = undefined;
    if (test_event_code && typeof test_event_code === 'string') {
      const isTestCodeValidFormat = /^TEST[0-9A-Z]{4,10}$/i.test(test_event_code.trim());
      const isLocalDev = !isHosted && (originHeader?.startsWith('http://localhost:') || originHeader?.startsWith('http://127.0.0.1:'));
      const testSecretHeader = req.headers.get('x-capi-test-key');
      const expectedSecret = Deno.env.get('CAPI_TEST_KEY');
      const isAuthorizedSecret = !!(expectedSecret && testSecretHeader === expectedSecret);

      if (isTestCodeValidFormat && (isLocalDev || isAuthorizedSecret)) {
        safe_test_event_code = test_event_code.trim();
      } else if (test_event_code) {
        console.warn("Unauthorized test_event_code rejected from request");
      }
    }

    const payload: any = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url,
          event_id: effectiveEventId,
          user_data,
          ...(Object.keys(custom_data).length > 0 && { custom_data }),
          ...(Array.isArray(data_processing_options) && { 
            data_processing_options,
            data_processing_options_country: typeof data_processing_options_country === 'number' ? data_processing_options_country : 0,
            data_processing_options_state: typeof data_processing_options_state === 'number' ? data_processing_options_state : 0
          })
        }
      ],
      ...(safe_test_event_code && { test_event_code: safe_test_event_code })
    };
    
    // 13. Dispatch to Meta Graph API
    let metaResponse: Response;
    let metaResult: any;

    try {
      metaResponse = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${META_ACCESS_TOKEN}`
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000)
      });
      metaResult = await metaResponse.json();
    } catch (fetchErr: any) {
      // Network timeout / connection reset: Outcome is UNCERTAIN (do not assume definitely failed or delivered)
      if (claimToken && milestoneKey) {
        const { error: finErr } = await supabase.rpc('finalize_meta_capi_conversion', {
          p_conversion_key: milestoneKey,
          p_claim_token: claimToken,
          p_status: 'uncertain',
          p_error_message: `Network timeout / abort: ${fetchErr.message}`
        });
        if (finErr) console.error("Finalize uncertain RPC error:", finErr);
      }
      throw fetchErr;
    }

    // If Meta returns an explicit non-OK HTTP status (e.g. 400 Bad Request, 500 Server Error)
    if (!metaResponse.ok) {
      if (claimToken && milestoneKey) {
        const { error: finErr } = await supabase.rpc('finalize_meta_capi_conversion', {
          p_conversion_key: milestoneKey,
          p_claim_token: claimToken,
          p_status: 'failed',
          p_error_message: JSON.stringify(metaResult)
        });
        if (finErr) console.error("Finalize failed RPC error:", finErr);
      }
      console.error("Meta API Error:", metaResult);
      return new Response(JSON.stringify({ error: "Meta API Error", details: metaResult }), {
        status: metaResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 14. Finalize Delivery State to 'delivered'
    // REFUSE UNCONDITIONAL SUCCESS if database finalization fails!
    if (claimToken && milestoneKey) {
      const { data: finResult, error: finErr } = await supabase.rpc('finalize_meta_capi_conversion', {
        p_conversion_key: milestoneKey,
        p_claim_token: claimToken,
        p_status: 'delivered',
        p_error_message: null
      });

      if (finErr || !finResult?.success) {
        const errMsg = finErr ? finErr.message : (finResult?.message || "Failed to finalize delivery state in database");
        console.error("Critical: Meta accepted conversion, but database finalization failed:", { finErr, finResult });
        return new Response(
          JSON.stringify({ 
            success: false, 
            meta_accepted: true,
            db_finalized: false,
            warning: "META_ACCEPTED_BUT_DB_FINALIZE_FAILED",
            error: `Meta accepted conversion event, but database finalization failed: ${errMsg}`,
            event_id: effectiveEventId,
            metaResponse: metaResult 
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, metaResponse: metaResult, event_id: effectiveEventId }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("CAPI Edge Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
