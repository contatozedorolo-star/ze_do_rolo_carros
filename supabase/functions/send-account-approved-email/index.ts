import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AccountApprovedEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found in environment");
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);

    const { email, name }: AccountApprovedEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const displayName = name || "Usuário";

    console.log(`Sending account-approved email to: ${email} (name: ${displayName})`);

    const emailResponse = await resend.emails.send({
      from: "Zé do Rolo <contato@zedorolo.com>",
      to: [email],
      subject: "✅ Sua conta foi aprovada — Zé do Rolo",
      // @ts-ignore - Resend template support
      template: {
        id: "conta-aprovada",
        variables: {
          name: displayName,
        },
      },
    });

    console.log("Account approved email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending account approved email:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
