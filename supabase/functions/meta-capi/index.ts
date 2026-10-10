import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const RATE_LIMIT_WINDOW_SEC = 60;
const MAX_REQUESTS_PER_WINDOW = 30;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. IP Rate Limiting via Supabase DB (Shared across Edge Functions)
    const xRealIp = req.headers.get('x-real-ip');
    const xForwardedFor = req.headers.get('x-forwarded-for');
    
    // Secure IP Extraction:
    // 1. 'x-real-ip' is securely injected by the Supabase/Kong gateway.
    // 2. If relying on 'x-forwarded-for', we extract the LAST IP in the chain (injected by the outermost trusted proxy).
    // Extracting the first IP allows trivial client spoofing if they send their own x-forwarded-for header.
    let clientIp = 'unknown';
    if (xRealIp) {
      clientIp = xRealIp;
    } else if (xForwardedFor) {
      const parts = xForwardedFor.split(',');
      clientIp = parts[parts.length - 1].trim();
    }
    
    if (clientIp !== 'unknown') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseServiceKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
        return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders });
      }

      // Create a service_role client to bypass RLS and access the secured RPC
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: isAllowedLimit, error: rpcError } = await supabase.rpc('check_meta_capi_rate_limit', {
        client_ip: clientIp,
        max_requests: MAX_REQUESTS_PER_WINDOW,
        window_seconds: RATE_LIMIT_WINDOW_SEC
      });

      if (rpcError) {
        console.error("Rate limit DB error:", rpcError);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: corsHeaders });
      }

      if (!isAllowedLimit) {
        console.warn(`Shared Rate limit exceeded for IP: ${clientIp}`);
        return new Response(JSON.stringify({ error: "Too Many Requests" }), { status: 429, headers: corsHeaders });
      }
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
    const { event_name, event_id, event_source_url, content_name, fbp, fbc } = body

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

    // 3. Strict Payload Validation
    if (!event_name || !event_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders })
    }

    // Prevent malicious or random event injection (Whitelist)
    const allowedEvents = ['PageView', 'ViewContent'];
    if (!allowedEvents.includes(event_name)) {
      return new Response(JSON.stringify({ error: "Unauthorized event type", ip: clientIp }), { status: 403, headers: corsHeaders })
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

    // Construct the user_data object
    const user_data: any = {
      client_ip_address: clientIp !== 'unknown' ? clientIp : undefined,
      client_user_agent: userAgent
    }

    // Meta expects strict formats, only attach if valid
    if (fbp && typeof fbp === 'string' && fbp.length < 50) user_data.fbp = fbp
    if (fbc && typeof fbc === 'string' && fbc.length < 200) user_data.fbc = fbc

    // Prepare custom data
    const custom_data: any = {}
    if (safe_content_name) custom_data.content_name = safe_content_name

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
      ]
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
