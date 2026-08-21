import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildEmailHtml(firstName: string): string {
  const appUrl = "https://app.connectacademy.com.br/cadastro";
  const name = firstName && firstName.length > 1 ? firstName : "importador";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu acesso demo de 10 dias esta liberado!</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4C35E8 0%,#7B5CE7 60%,#9B7CF8 100%);padding:48px 40px 44px;text-align:center;">
            <img src="https://i.postimg.cc/Wz5JsrXh/LOGONE_2.png" alt="Connect Academy" style="height:34px;width:auto;margin-bottom:24px;display:block;margin-left:auto;margin-right:auto;" />
            <div style="display:inline-block;background:rgba(255,255,255,0.18);border-radius:99px;padding:6px 18px;margin-bottom:16px;">
              <span style="color:rgba(255,255,255,0.95);font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Acesso Exclusivo</span>
            </div>
            <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;letter-spacing:-0.5px;line-height:1.2;">
              Voce ganhou 10 dias de<br/>acesso demo gratis! 🎉
            </h1>
            <p style="color:rgba(255,255,255,0.80);font-size:15px;margin:14px 0 0;line-height:1.5;">A rede social dos importadores te espera</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:44px 44px 0;">
            <p style="font-size:16px;color:#111827;margin:0 0 18px;font-weight:600;">Ola, ${name}! 👋</p>
            <p style="font-size:15px;color:#4B5563;line-height:1.7;margin:0 0 28px;">
              Enquanto voce estava explorando nosso catalogo, a gente decidiu ir alem:<br/><br/>
              <strong style="color:#4C35E8;">liberamos um acesso demo de 10 dias completo</strong> para voce conhecer o Connect Academy por dentro — sem pagar nada agora.
            </p>
            <!-- Feature cards -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td style="padding:0 0 12px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3FF;border-radius:14px;border-left:4px solid #4C35E8;">
                  <tr><td style="padding:16px 20px;">
                    <p style="margin:0;font-size:14px;color:#111827;font-weight:700;">🔍 +30 milhoes de produtos</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">Direto de 1.500 fabricas e fornecedores da China — com precos que os outros nao mostram.</p>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td style="padding:0 0 12px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3FF;border-radius:14px;border-left:4px solid #4C35E8;">
                  <tr><td style="padding:16px 20px;">
                    <p style="margin:0;font-size:14px;color:#111827;font-weight:700;">🤖 Minerador IA</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">A inteligencia artificial que analisa e sugere os melhores produtos para voce importar.</p>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td style="padding:0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3FF;border-radius:14px;border-left:4px solid #4C35E8;">
                  <tr><td style="padding:16px 20px;">
                    <p style="margin:0;font-size:14px;color:#111827;font-weight:700;">🌐 Rede Social do Importador</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">Conecte-se com +28.000 importadores. Troque experiencias, tire duvidas e cresca junto.</p>
                  </td></tr>
                </table>
              </td></tr>
            </table>
            <p style="font-size:15px;color:#374151;margin:0 0 28px;line-height:1.6;">
              Aproveite os <strong>10 dias para explorar tudo</strong> e ver na pratica como o Connect Academy pode mudar a forma como voce importa.
            </p>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:0 44px 44px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:8px 0 24px;">
                <a href="${appUrl}" style="display:inline-block;background:linear-gradient(135deg,#4C35E8 0%,#7B5CE7 100%);color:#ffffff;text-decoration:none;font-size:17px;font-weight:700;padding:18px 48px;border-radius:14px;letter-spacing:0.01em;box-shadow:0 6px 24px rgba(76,53,232,0.35);">
                  Entrar no App agora →
                </a>
              </td></tr>
            </table>
            <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0 0 32px;line-height:1.6;">
              Ou acesse: <a href="${appUrl}" style="color:#4C35E8;text-decoration:none;">${appUrl}</a>
            </p>
            <!-- Urgency -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7ED;border-radius:12px;border:1px solid #FED7AA;margin-bottom:32px;">
              <tr><td style="padding:16px 20px;text-align:center;">
                <p style="margin:0;font-size:13px;color:#92400E;font-weight:600;">⏰ Seu acesso demo expira em 10 dias a partir de hoje</p>
                <p style="margin:4px 0 0;font-size:12px;color:#B45309;">Depois disso voce pode continuar com um de nossos planos a partir de R$ 67,90.</p>
              </td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #F3F4F6;margin:0 0 24px;" />
            <p style="font-size:12px;color:#9CA3AF;line-height:1.7;margin:0;text-align:center;">
              Voce recebeu este email porque se cadastrou no catalogo do Connect Academy.<br/>
              <strong>Connect Academy</strong> — CNPJ: 44.292.841/0001-95<br/>
              <a href="https://connectacademy.com.br" style="color:#4C35E8;text-decoration:none;">connectacademy.com.br</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const { email, name, test = false, lead_id } = body;
    if (!email) return new Response(JSON.stringify({ error: "email is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SMTP_FROM = Deno.env.get("SMTP_FROM_EMAIL") || "nao-responda@connectacademy.com.br";
    if (!RESEND_API_KEY) return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const firstName = name?.split(" ")[0] || "";
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Connect Academy <${SMTP_FROM}>`,
        to: [email],
        subject: "🎉 Seu acesso demo de 10 dias esta liberado!",
        html: buildEmailHtml(firstName),
      }),
    });
    const result = await emailRes.json();
    console.log("[catalog-welcome-email] Resend:", JSON.stringify(result));

    if (!test && lead_id) {
      const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await sb.from("landing_leads").update({ email_sent: true, email_sent_at: new Date().toISOString() }).eq("id", lead_id);
    }

    return new Response(JSON.stringify({ ok: true, resend: result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
