import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

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

    // 2. Send email using Resend
    let emailResponse = null;
    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Constil Contact Form <onboarding@resend.dev>", // Replace with your verified domain
          to: "marketing@constil.com",
          subject: `New Contact Form Submission from ${firstName} ${lastName}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data))
      emailResponse = data
    } else {
      console.log("No RESEND_API_KEY found, skipping email notification.")
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
