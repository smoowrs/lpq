import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Map plan ids to AI credit grant amounts
const PLAN_CREDITS: Record<string, number> = {
    starter: 5,
    pro: 10,
    elite: 20,
    vitalicio: 20,
}

// Plan display names for email
const PLAN_NAMES: Record<string, string> = {
    starter: 'Starter',
    pro: 'Pro',
    elite: 'Elite Vitalício',
    vitalicio: 'Elite Vitalício',
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Sends a welcome/access email to the user with a magic link to set their password.
 * Uses Supabase's admin generateLink to create a secure "recovery" (password reset) link.
 */
async function sendAccessEmail(supabase: any, email: string, name: string, planId: string): Promise<void> {
    const planName = PLAN_NAMES[planId] || planId

    try {
        // Generate a password recovery / magic link so user can set their password
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
                redirectTo: 'https://app.connectacademy.com.br/auth/callback',
            },
        })

        if (linkError) {
            console.error('[activate-user] generateLink error:', linkError.message)
            // Fall through — still activate the user even if email fails
            return
        }

        const accessLink = linkData?.properties?.action_link || linkData?.action_link

        if (!accessLink) {
            console.error('[activate-user] generateLink returned no action_link')
            return
        }

        const firstName = name?.split(' ')[0] || 'aluno'

        // Use Supabase's built-in SMTP to send email via admin API
        // We send via a custom fetch to the Resend/SMTP configured on Supabase
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        const SMTP_FROM = Deno.env.get('SMTP_FROM_EMAIL') || 'nao-responda@connectacademy.com.br'

        if (RESEND_API_KEY) {
            // Send via Resend API
            const emailBody = buildEmailHtml(firstName, planName, accessLink)
            const emailRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `Connect Academy <${SMTP_FROM}>`,
                    to: [email],
                    subject: `🎉 Seu acesso ao Connect Academy (Plano ${planName}) está pronto!`,
                    html: emailBody,
                }),
            })

            const emailResult = await emailRes.json()
            console.log('[activate-user] Resend email result:', JSON.stringify(emailResult))
        } else {
            // Fallback: use Supabase built-in email by triggering a password recovery
            // This sends the standard Supabase recovery email with the link
            const { error: pwErr } = await supabase.auth.admin.inviteUserByEmail(email, {
                data: { plan: planId, name },
                redirectTo: 'https://app.connectacademy.com.br/auth/callback',
            })
            if (pwErr) {
                console.error('[activate-user] inviteUserByEmail fallback error:', pwErr.message)
            } else {
                console.log('[activate-user] Invite email sent via Supabase to', email)
            }
        }
    } catch (err: any) {
        // Never throw — email is best-effort, user must be activated regardless
        console.error('[activate-user] sendAccessEmail error (non-fatal):', err.message)
    }
}

function buildEmailHtml(firstName: string, planName: string, accessLink: string): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu acesso ao Connect Academy</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4D5BFF 0%,#7B87FF 100%);padding:40px 40px 36px;text-align:center;">
              <img src="https://i.postimg.cc/Wz5JsrXh/LOGONE_2.png" alt="Connect Academy" style="height:36px;width:auto;margin-bottom:20px;" />
              <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0;letter-spacing:-0.5px;">Pagamento Confirmado! 🎉</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:10px 0 0;">Seu Plano <strong>${planName}</strong> está ativo</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#374151;margin:0 0 16px;">Olá, <strong>${firstName}</strong>! 👋</p>
              <p style="font-size:15px;color:#6b7280;line-height:1.6;margin:0 0 28px;">
                Seu pagamento foi aprovado e seu acesso ao <strong style="color:#4D5BFF;">Connect Academy</strong> com o <strong>Plano ${planName}</strong> já está liberado.
              </p>

              <!-- Plan badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f1ff;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">PLANO ATIVO</p>
                    <p style="margin:0;font-size:22px;font-weight:800;color:#4D5BFF;">Plano ${planName}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <p style="font-size:15px;color:#374151;margin:0 0 20px;font-weight:600;">Para acessar a plataforma, clique no botão abaixo e defina sua senha:</p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${accessLink}" style="display:inline-block;background:linear-gradient(135deg,#4D5BFF,#7B87FF);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:12px;letter-spacing:0.02em;">
                      Acessar minha conta →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0 0 24px;">
                Ou copie e cole este link no seu navegador:<br/>
                <span style="color:#4D5BFF;word-break:break-all;font-size:11px;">${accessLink}</span>
              </p>

              <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;" />

              <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0;">
                Este link expira em <strong>24 horas</strong>. Se você não solicitou este acesso, ignore este e-mail.<br/><br/>
                Qualquer dúvida, entre em contato pelo Instagram <strong>@connectacademy.br</strong> ou pelo suporte na plataforma.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="font-size:12px;color:#9ca3af;margin:0;">
                © ${new Date().getFullYear()} Connect Academy · Todos os direitos reservados<br/>
                <a href="https://app.connectacademy.com.br" style="color:#4D5BFF;text-decoration:none;">app.connectacademy.com.br</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const body = await req.json()
        const { plan, billingCycle, userId, email, name, grantCredits = true, sendEmail = true } = body

        if (!plan) throw new Error("'plan' é obrigatório")
        if (!userId && !email) throw new Error("'userId' ou 'email' é obrigatório")

        let targetUserId = userId
        let isNewUser = false

        // Look up by email if userId not provided
        if (!targetUserId && email) {
            // listUsers is the correct admin API — getUserByEmail doesn't exist in this SDK version
            const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
            const existingUser = listErr ? null : users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())

            if (!existingUser) {
                // User does NOT exist — create them
                console.log(`[activate-user] User ${email} not found. Creating account...`)

                const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
                    email,
                    email_confirm: true, // mark email as confirmed immediately
                    user_metadata: {
                        full_name: name || email.split('@')[0],
                        plan,
                    },
                })

                if (createErr) {
                    // If "User already registered" race condition, retry listUsers
                    if (createErr.message?.toLowerCase().includes('already') || createErr.message?.toLowerCase().includes('registered')) {
                        const { data: { users: retryUsers } } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
                        const retryUser = retryUsers?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
                        if (retryUser) {
                            targetUserId = retryUser.id
                        } else {
                            throw new Error(`Erro ao criar usuário: ${createErr.message}`)
                        }
                    } else {
                        throw new Error(`Erro ao criar usuário: ${createErr.message}`)
                    }
                } else {
                    targetUserId = newUser.user.id
                    isNewUser = true
                    console.log(`[activate-user] New user created: ${email} → ${targetUserId}`)
                }
            } else {
                targetUserId = existingUser.id
                console.log(`[activate-user] Existing user found: ${email} → ${targetUserId}`)
            }
        }

        // ── CREDIT PACKAGE (cred_10, cred_20, cred_40) ──
        if (plan.startsWith('cred_')) {
            const creditsToAdd = parseInt(plan.split('_')[1], 10)
            if (isNaN(creditsToAdd) || creditsToAdd <= 0) throw new Error(`Pacote de créditos inválido: ${plan}`)

            const { data: profile } = await supabase.from('profiles')
                .select('ai_credits')
                .eq('id', targetUserId)
                .single()

            const newTotal = (profile?.ai_credits || 0) + creditsToAdd

            const { error } = await supabase.from('profiles')
                .update({ ai_credits: newTotal, updated_at: new Date().toISOString() })
                .eq('id', targetUserId)

            if (error) throw error

            console.log(`[activate-user] Added ${creditsToAdd} credits to user ${targetUserId}, new total: ${newTotal}`)

            return new Response(JSON.stringify({
                success: true,
                userId: targetUserId,
                plan,
                creditsAdded: creditsToAdd,
                newTotal,
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            })
        }

        // ── SUBSCRIPTION PLAN ──
        // IMPORTANT: Use fixed plan-specific durations — do NOT rely on billingCycle.
        // This prevents the bug where billingCycle defaults to 'monthly' and plans
        // expire after only 30 days.
        //   starter   = 90 days
        //   pro       = 365 days
        //   elite     = permanent (year 2999)
        //   vitalicio = permanent (year 2999)
        const endDate = new Date()
        if (plan === 'vitalicio' || plan === 'elite') {
            endDate.setFullYear(2999, 11, 31)
        } else if (plan === 'starter') {
            endDate.setDate(endDate.getDate() + 90)
        } else if (plan === 'pro') {
            endDate.setDate(endDate.getDate() + 365)
        } else {
            // Fallback for unknown future plans — use billingCycle
            const cycle = billingCycle || 'monthly'
            if (cycle === 'annual') {
                endDate.setFullYear(endDate.getFullYear() + 1)
            } else {
                endDate.setMonth(endDate.getMonth() + 1)
            }
        }

        const updatePayload: any = {
            plan,
            billing_cycle: billingCycle || 'annual',
            subscription_end_at: endDate.toISOString(),
            yupoo_access: true,
            updated_at: new Date().toISOString(),
        }

        if (name) updatePayload.name = name
        if (email) updatePayload.email = email

        if (grantCredits && PLAN_CREDITS[plan] !== undefined && PLAN_CREDITS[plan] > 0) {
            const { data: profile } = await supabase.from('profiles')
                .select('ai_credits')
                .eq('id', targetUserId)
                .single()
            updatePayload.ai_credits = (profile?.ai_credits || 0) + PLAN_CREDITS[plan]
        }

        // Use upsert to ensure the profile exists and is updated
        const { error: upsertError } = await supabase.from('profiles').upsert({
            id: targetUserId,
            ...updatePayload
        }, { onConflict: 'id' })

        if (upsertError) throw upsertError

        console.log(`[activate-user] Plan '${plan}' activated for user ${targetUserId} until ${endDate.toISOString()}`)

        // Send access email — for new users (just created) OR when explicitly requested
        // Always send for new users; for existing users only if sendEmail flag is true
        if (email && (isNewUser || sendEmail)) {
            const displayName = name || email.split('@')[0]
            console.log(`[activate-user] Sending access email to ${email} (isNewUser=${isNewUser})`)
            await sendAccessEmail(supabase, email, displayName, plan)
        }

        return new Response(JSON.stringify({
            success: true,
            userId: targetUserId,
            plan,
            isNewUser,
            subscriptionEndAt: endDate.toISOString(),
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    } catch (err: any) {
        console.error("[activate-user] Error:", err.message)
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }
})
