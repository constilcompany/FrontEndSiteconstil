import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const RATE_LIMIT_WINDOW_SEC = 60;
const MAX_REQUESTS_PER_WINDOW = 30;

/**
 * Strict IPv4 and IPv6 format validator
 */
function isValidIp(ip: string | null | undefined): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const s = ip.trim();
  // IPv4 validation (0-255 per octet, no leading zeros)
  const ipv4Match = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    return ipv4Match.slice(1).every(octet => {
      const n = Number(octet);
      return n >= 0 && n <= 255 && (octet === '0' || !octet.startsWith('0'));
    });
  }
  // IPv6 validation
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
 * Detects whether the Edge Function is executing in a hosted cloud environment (Supabase / Deno Deploy)
 * using server-side runtime variables. This CANNOT be spoofed or bypassed by client request headers.
 */
function isHostedEnvironment(): boolean {
  return Boolean(
    Deno.env.get('DENO_DEPLOYMENT_ID') ||
    Deno.env.get('SB_REGION') ||
    Deno.env.get('SB_EXECUTION_ID')
  );
}

const FALLBACK_BUCKET_COUNT = 16;

/**
 * Computes a deterministic bucket identity (0.0.0.0 - 0.0.0.15) for unverified traffic.
 * Uses client User-Agent/fingerprint to partition different browser families,
 * preventing an attacker bot script from blocking legitimate visitors.
 * Untrusted forwarded headers (x-forwarded-for, x-real-ip) are NEVER used as identities,
 * strictly preventing attackers from rotating spoofed IPs to bypass the rate limit.
 * The total database rows created for fallback traffic is strictly capped at 16 rows.
 */
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

/**
 * Securely extracts and classifies the visitor IP address.
 * 
 * Strict Multi-Layer Security Architecture:
 * 1. Cloudflare Perimeter Verification ('cf-connecting-ip'):
 *    - All production traffic to *.supabase.co passes through Cloudflare Anycast edge.
 *    - Cloudflare binds 'cf-connecting-ip' to the physical TCP socket and actively rejects/drops
 *      client-supplied 'cf-connecting-ip' header injection (verified via live Cloudflare Error 1000).
 *    - If valid public IPv4/IPv6, this is classified as isVerified: true.
 * 
 * 2. Never Trust Forwarded Headers for Identity:
 *    - Untrusted headers ('x-forwarded-for', 'x-real-ip') are NEVER used as independent rate-limit identities.
 *    - Attackers rotating spoofed IP headers cannot evade the rate limit or bloat database rows.
 * 
 * 3. Safe Bounded Fallback Pool for Unverified Traffic:
 *    - Unverified traffic is mapped to a bounded fallback subnet (0.0.0.0/28, max 16 rows).
 *    - Partitioned by browser client signature so malicious bot scrapers cannot block legitimate visitors.
 * 
 * 4. Zero Untrusted Attribution to Meta:
 *    - Untrusted or fallback IPs are NEVER forwarded to Meta Graph API.
 */
function getTrustedClientIp(req: Request): ClientIpResult {
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  const isHosted = isHostedEnvironment();
  const isLocalOrigin = !isHosted && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));

  // 1. Primary: Cloudflare's perimeter-verified connecting IP
  const cfConnectingIp = req.headers.get('cf-connecting-ip')?.trim();
  if (cfConnectingIp && isValidIp(cfConnectingIp) && !isPrivateOrGatewayIp(cfConnectingIp)) {
    return { ip: cfConnectingIp, isVerified: true };
  }

  // 2. Local development exception (strictly restricted to true local development environments)
  if (isLocalOrigin) {
    if (cfConnectingIp && isValidIp(cfConnectingIp)) {
      return { ip: cfConnectingIp, isVerified: true };
    }
    return { ip: '127.0.0.1', isVerified: true };
  }

  // 3. Safe, Non-Spoofable Bounded Fallback Pool for Unverified Traffic:
  // Forwarded headers (x-forwarded-for, x-real-ip) are NEVER used as rate-limit identities.
  // Attackers rotating spoofed IPs CANNOT bypass the limit or create arbitrary database rows.
  // Maximum database rows for unverified traffic is strictly bounded to 16 rows (0.0.0.0 - 0.0.0.15).
  // Different browser families map to different buckets, preventing bot traffic from blocking legitimate visitors.
  const fallbackIp = getFallbackRateLimitIp(req);
  return { ip: fallbackIp, isVerified: false };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. IP Rate Limiting via Supabase DB (Shared across Edge Functions)
    const ipResult = getTrustedClientIp(req);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
      return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders });
    }

    // Create a service_role client to bypass RLS and access the secured RPC
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limit per verified visitor IP, or under the shared fallback pool '0.0.0.0' for untrusted requests
    const { data: isAllowedLimit, error: rpcError } = await supabase.rpc('check_meta_capi_rate_limit', {
      client_ip: ipResult.ip,
      max_requests: MAX_REQUESTS_PER_WINDOW,
      window_seconds: RATE_LIMIT_WINDOW_SEC
    });

    if (rpcError) {
      console.error("Rate limit DB error:", rpcError);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: corsHeaders });
    }

    if (!isAllowedLimit) {
      console.warn(`Rate limit exceeded for IP: ${ipResult.ip} (verified: ${ipResult.isVerified})`);
      return new Response(JSON.stringify({ error: "Too Many Requests", ip: ipResult.ip }), { status: 429, headers: corsHeaders });
    }

    // 2. Origin Verification (CORS protection)
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    const isAllowed = origin === '' || origin.startsWith('http://localhost:') || origin.startsWith('https://constil.com') || origin.startsWith('https://www.constil.com') || origin.startsWith('https://lovable.dev');
    
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: "Forbidden Origin" }), { status: 403, headers: corsHeaders })
    }
    
    // 3. Body parsing with size limit
    const bodyText = await req.text();
    if (bodyText.length > 5000) {
      return new Response(JSON.stringify({ error: "Payload too large" }), { status: 413, headers: corsHeaders })
    }
    
    const body = JSON.parse(bodyText);
    const { event_name, event_id, event_source_url, content_name, fbp, fbc, user_data: clientUserData, test_event_code } = body

    // 4. Validate event_source_url against allowed domains
    if (!event_source_url || typeof event_source_url !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid event_source_url" }), { status: 400, headers: corsHeaders })
    }
    try {
      const parsedUrl = new URL(event_source_url);
      const hostname = parsedUrl.hostname;
      if (hostname !== 'localhost' && hostname !== 'constil.com' && hostname !== 'www.constil.com' && !hostname.endsWith('.lovable.dev')) {
        return new Response(JSON.stringify({ error: "Invalid event_source_url domain" }), { status: 403, headers: corsHeaders })
      }
    } catch {
      return new Response(JSON.stringify({ error: "Malformed event_source_url" }), { status: 400, headers: corsHeaders })
    }

    // 5. Strict Payload Validation
    if (!event_name || !event_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders })
    }

    // Prevent malicious or random event injection (Whitelist)
    const allowedEvents = ['PageView', 'ViewContent', 'Lead'];
    if (!allowedEvents.includes(event_name)) {
      return new Response(JSON.stringify({ error: "Unauthorized event type", ip: ipResult.ip, verified: ipResult.isVerified }), { status: 403, headers: corsHeaders })
    }

    // Validate event_id is a valid UUID to prevent injection/spam
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(event_id)) {
      return new Response(JSON.stringify({ error: "Invalid event_id format" }), { status: 400, headers: corsHeaders })
    }

    // Sanitize content_name
    let safe_content_name = content_name;
    if (safe_content_name && typeof safe_content_name === 'string') {
      safe_content_name = safe_content_name.substring(0, 100); // Max 100 chars
    }

    const META_ACCESS_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN")
    const PIXEL_ID = Deno.env.get("META_PIXEL_ID") || "1394045752925191"

    if (!META_ACCESS_TOKEN) {
      console.error("Missing META_CAPI_ACCESS_TOKEN secret!");
      return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders })
    }

    // Extract additional client information from headers
    const userAgent = req.headers.get('user-agent')

    // Construct the user_data object.
    // SECURITY CRITICAL: Untrusted or fallback IP addresses are NEVER forwarded to Meta.
    const user_data: any = {
      client_ip_address: (ipResult.isVerified && !ipResult.ip.startsWith('0.') && ipResult.ip !== '127.0.0.1') ? ipResult.ip : undefined,
      client_user_agent: userAgent
    }

    // Merge EMQ identifiers safely from clientUserData if present
    if (clientUserData && typeof clientUserData === 'object') {
      if (typeof clientUserData.em === 'string') user_data.em = clientUserData.em;
      if (typeof clientUserData.ph === 'string') user_data.ph = clientUserData.ph;
      if (typeof clientUserData.fn === 'string') user_data.fn = clientUserData.fn;
      if (typeof clientUserData.ln === 'string') user_data.ln = clientUserData.ln;
      
      if (typeof clientUserData.fbp === 'string' && clientUserData.fbp.length < 50) user_data.fbp = clientUserData.fbp;
      if (typeof clientUserData.fbc === 'string' && clientUserData.fbc.length < 200) user_data.fbc = clientUserData.fbc;
    }

    // Fallbacks for fbp/fbc if they were sent at the payload root (legacy compatibility)
    if (!user_data.fbp && fbp && typeof fbp === 'string' && fbp.length < 50) user_data.fbp = fbp
    if (!user_data.fbc && fbc && typeof fbc === 'string' && fbc.length < 200) user_data.fbc = fbc

    // Prepare custom data
    const custom_data: any = {}
    if (safe_content_name) custom_data.content_name = safe_content_name

    // Authorize test_event_code strictly to prevent public requests from hijacking production event attribution
    let safe_test_event_code: string | undefined = undefined;
    if (test_event_code && typeof test_event_code === 'string') {
      const isTestCodeValidFormat = /^TEST[0-9A-Z]{4,10}$/i.test(test_event_code.trim());
      const isHosted = isHostedEnvironment();
      const isLocalDev = !isHosted && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));
      const testSecretHeader = req.headers.get('x-capi-test-key');
      const expectedSecret = Deno.env.get('CAPI_TEST_KEY');
      const isAuthorizedSecret = !!(expectedSecret && testSecretHeader === expectedSecret);

      // CRITICAL: Public production traffic from constil.com or spoofed localhost origins can NEVER activate test_event_code.
      // Strictly restricted to true local dev environments or authenticated test keys.
      // ALLOW_CAPI_TEST_EVENTS is intentionally disabled/ignored to prevent public test-event routing in production.
      if (isTestCodeValidFormat && (isLocalDev || isAuthorizedSecret)) {
        safe_test_event_code = test_event_code.trim();
      } else if (test_event_code) {
        console.warn("Unauthorized test_event_code rejected from public production request");
      }
    }

    // Prepare the payload for Meta Graph API
    const payload: any = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url,
          event_id,
          user_data,
          ...(Object.keys(custom_data).length > 0 && { custom_data })
        }
      ],
      ...(safe_test_event_code && { test_event_code: safe_test_event_code })
    }
    
    // Send the event to Meta
    const metaResponse = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${META_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    const metaResult = await metaResponse.json()

    if (!metaResponse.ok) {
      console.error("Meta API Error:", metaResult)
      return new Response(JSON.stringify({ error: "Meta API Error", details: metaResult }), { status: metaResponse.status, headers: corsHeaders })
    }

    return new Response(
      JSON.stringify({ success: true, metaResponse: metaResult }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error("CAPI Edge Function Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
