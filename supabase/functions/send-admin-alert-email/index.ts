import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AdminAlertRequest {
  alert_type: "kyc_pending" | "vehicle_pending";
  user_name: string;
  user_email: string;
  vehicle_title?: string;
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

    const { alert_type, user_name, user_email, vehicle_title }: AdminAlertRequest = await req.json();

    console.log(`Sending admin alert email - type: ${alert_type}, user: ${user_name} (${user_email}), vehicle: ${vehicle_title || "N/A"}`);

    const adminEmail = "contatozedorolo@gmail.com";

    const emailResponse = await resend.emails.send({
      from: "Zé do Rolo Sistema <sistema@zedorolo.com>",
      to: [adminEmail],
      subject: alert_type === "kyc_pending"
        ? "🔔 Nova verificação KYC pendente — Zé do Rolo"
        : "🔔 Novo anúncio pendente — Zé do Rolo",
      // @ts-ignore - Resend template support
      template: {
        id: "alerta-admin-pendencia",
        variables: {
          alert_type: alert_type,
          user_name: user_name || "Usuário",
          user_email: user_email || "",
          vehicle_title: vehicle_title || "",
        },
      },
    });

    console.log("Admin alert email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending admin alert email:", errorMessage);
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
