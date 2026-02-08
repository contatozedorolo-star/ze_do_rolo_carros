import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const buildWelcomeHtml = (name: string): string => {
  const displayName = name || "Novo Usuário";
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F97316, #EA580C);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                🚗 Zé do Rolo
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
                O portal de trocas e vendas de veículos
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#18181b;font-size:22px;font-weight:700;">
                Bem-vindo(a), ${displayName}! 🎉
              </h2>
              <p style="margin:0 0 24px;color:#52525b;font-size:15px;line-height:1.6;">
                Sua conta no <strong>Zé do Rolo</strong> foi criada com sucesso. Agora você faz parte da maior comunidade de trocas e vendas de veículos!
              </p>

              <!-- Features -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 16px;background-color:#FFF7ED;border-radius:10px;margin-bottom:12px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;font-size:22px;">📋</td>
                        <td>
                          <strong style="color:#18181b;font-size:14px;">Anuncie seus veículos</strong>
                          <p style="margin:4px 0 0;color:#71717a;font-size:13px;">Cadastre carros, motos, caminhões, tratores e muito mais.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:14px 16px;background-color:#FFF7ED;border-radius:10px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;font-size:22px;">🔄</td>
                        <td>
                          <strong style="color:#18181b;font-size:14px;">Troque com segurança</strong>
                          <p style="margin:4px 0 0;color:#71717a;font-size:13px;">Envie e receba propostas de troca direto pela plataforma.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:14px 16px;background-color:#FFF7ED;border-radius:10px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;font-size:22px;">🤖</td>
                        <td>
                          <strong style="color:#18181b;font-size:14px;">Assistente Zé IA</strong>
                          <p style="margin:4px 0 0;color:#71717a;font-size:13px;">Use nosso assistente inteligente para tirar dúvidas e encontrar veículos.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://zedorolo.lovable.app/veiculos" 
                       style="display:inline-block;background:linear-gradient(135deg,#F97316,#EA580C);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                      Explorar Veículos →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;color:#a1a1aa;font-size:13px;line-height:1.5;text-align:center;">
                Se você não criou esta conta, pode ignorar este e-mail com segurança.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;">
                © 2026 Zé do Rolo — Todos os direitos reservados.
              </p>
              <p style="margin:6px 0 0;color:#a1a1aa;font-size:12px;">
                Você recebeu este e-mail porque se cadastrou em 
                <a href="https://zedorolo.lovable.app" style="color:#F97316;text-decoration:none;">zedorolo.lovable.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
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

    const { email, name }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Sending welcome email to: ${email} (name: ${name})`);

    const html = buildWelcomeHtml(name);

    const emailResponse = await resend.emails.send({
      from: "Zé do Rolo <onboarding@resend.dev>",
      to: [email],
      subject: "🚗 Bem-vindo ao Zé do Rolo! Sua conta foi criada",
      html,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending welcome email:", errorMessage);
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
