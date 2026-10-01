import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, email, phoneNumber, message, companyName } = await req.json()
    const safePhoneNumber = phoneNumber || "N/A";

    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEYnew") || Deno.env.get("SENDGRID_API_KEY");
    if (!sendgridApiKey) {
      console.error("Missing SendGrid API Key secret!");
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500, headers: corsHeaders });
    }

    // 1. Insert into Supabase database (optional but recommended)
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      )
      
      await supabaseClient.from('contact_messages').insert([
        { first_name: firstName, last_name: lastName, email, phone_number: safePhoneNumber, message, company_name: companyName }
      ])
    } catch (dbError) {
      console.log("Error inserting into DB (table might not exist yet):", dbError)
    }

    // 2. Send email using SendGrid
    let emailResponse = null;
    
    const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sendgridApiKey}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: "marketing@constil.com"
              }
            ],
            subject: "New Contact Form Inquiry from Constil Website"
          }
        ],
        from: {
          email: "support@constil.com"
        },
        reply_to: {
          email: email
        },
        content: [
          {
            type: "text/html",
            value: `
              <p><strong>Full Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Company Name:</strong> ${companyName}</p>
              <p><strong>Email Address:</strong> ${email}</p>
              <p><strong>Phone Number:</strong> ${safePhoneNumber}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `
          }
        ]
      }),
    })

    if (!sgResponse.ok) {
      const errText = await sgResponse.text();
      console.error("SendGrid failed with status:", sgResponse.status, errText);
      return new Response(JSON.stringify({ error: errText }), { status: sgResponse.status, headers: corsHeaders });
    }

    if (sgResponse.status === 202) {
      emailResponse = { success: true };
    } else {
      console.error("SendGrid returned non-202 success status:", sgResponse.status);
      return new Response(JSON.stringify({ error: "Unexpected SendGrid status" }), { status: 500, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ success: true, email: emailResponse }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
