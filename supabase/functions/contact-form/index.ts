import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, email, message, companyName } = await req.json()

    // 1. Insert into Supabase database (optional but recommended)
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      )
      
      await supabaseClient.from('contact_messages').insert([
        { first_name: firstName, last_name: lastName, email, message, company_name: companyName }
      ])
    } catch (dbError) {
      console.log("Error inserting into DB (table might not exist yet):", dbError)
    }

    // 2. Send email using SendGrid
    let emailResponse = null;
    if (SENDGRID_API_KEY) {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SENDGRID_API_KEY}`,
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
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>User Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              `
            }
          ]
        }),
      })

      if (!res.ok) {
        const data = await res.text()
        throw new Error(data)
      }
      emailResponse = { success: true }
    } else {
      console.log("No SENDGRID_API_KEY found, skipping email notification.")
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
