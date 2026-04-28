import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { id } = await req.json()
        const APPMAX_TOKEN = Deno.env.get('APPMAX_API_TOKEN')

        // 1. Fetch current status from Appmax first
        const response = await fetch(`https://api.appmax.com.br/v2/order/${id}?access_token=${APPMAX_TOKEN}`)
        const result = await response.json()
        console.log(`[Check-PIX] Appmax Response for ${id}:`, JSON.stringify(result))

        const appmaxStatus = (result.data?.status || result.status || result.data?.order_status || '').toLowerCase()
        const isApprovedByAppmax = result.success && (
            appmaxStatus === 'pagamento_confirmado' || 
            appmaxStatus === 'pago' || 
            appmaxStatus === 'aprovado' || 
            appmaxStatus === 'approved' ||
            appmaxStatus === 'integralizado' ||
            appmaxStatus === 'sucesso'
        )

        // ── IDEMPOTENCY: read intent status BEFORE any update ──
        // This prevents duplicate activations when check-pix-status is polled every 5 seconds.
        // We consider it "already activated" if status was ALREADY 'approved' before this poll
        // OR if user_id is already linked (meaning a previous poll already ran activate-user).
        const { data: intentBefore } = await supabaseClient
            .from('payment_intents')
            .select('status, user_id, guest_email, guest_name, plan_id, billing_cycle, id')
            .eq('external_id', String(id))
            .single()

        const wasAlreadyApproved = intentBefore?.status === 'approved'
        // For guest flows: user_id gets linked after first activation
        // For logged-in flows: user_id was set from the start, so we rely only on wasAlreadyApproved
        const isGuestAlreadyActivated = wasAlreadyApproved && !!intentBefore?.user_id && !intentBefore?.guest_email
            // ^ this means: was approved AND user_id was linked AND no guest_email (linked = activated)

        if (isApprovedByAppmax && !wasAlreadyApproved) {
            await supabaseClient
                .from('payment_intents')
                .update({ status: 'approved' })
                .eq('external_id', String(id))
            console.log(`[Check-PIX] Transitioning payment intent ${id} to approved (first time).`)
        }

        // 2. Get latest intent state from DB
        const { data: intent, error: intentError } = await supabaseClient
            .from('payment_intents')
            .select('*')
            .eq('external_id', String(id))
            .single()

        if (intentError || !intent) {
            throw new Error(`Intent ${id} não encontrado no banco de dados.`)
        }

        let status = intent.status

        // 3. Only activate on the FIRST approval transition
        // wasAlreadyApproved=false means this is the first time we see it approved
        if (status === 'approved' && !wasAlreadyApproved) {
            // Delegate entirely to activate-user which handles:
            // - user creation if not exists
            // - plan activation with correct durations
            // - welcome/access email sending
            const email = intent.guest_email
            const name = intent.guest_name
            const userId = intent.user_id

            if (userId || email) {
                console.log(`[Check-PIX] First approval — delegating to activate-user for plan=${intent.plan_id}, email=${email}, userId=${userId}`)
                try {
                    const activateRes = await fetch(
                        `${Deno.env.get('SUPABASE_URL')}/functions/v1/activate-user`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                                'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
                            },
                            body: JSON.stringify({
                                plan: intent.plan_id,
                                email,
                                name,
                                userId,
                                billingCycle: intent.billing_cycle || 'annual',
                                sendEmail: true,
                            }),
                        }
                    )
                    const activateBody = await activateRes.json()
                    console.log('[Check-PIX] activate-user result:', JSON.stringify(activateBody))

                    // If a new userId was resolved, link it to the payment intent
                    if (activateBody.userId && !userId) {
                        await supabaseClient
                            .from('payment_intents')
                            .update({ user_id: activateBody.userId })
                            .eq('id', intent.id)
                    }
                } catch (activateErr: any) {
                    console.error('[Check-PIX] activate-user call failed:', activateErr.message)
                }
            }
        } else if (status === 'approved' && wasAlreadyApproved) {
            console.log(`[Check-PIX] PIX ${id} already activated — skipping.`)
        }

        return new Response(
            JSON.stringify({ status }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )


    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
