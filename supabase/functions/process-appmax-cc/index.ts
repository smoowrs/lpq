
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APPMAX_BASE = 'https://admin.appmax.com.br/api/v3'

async function appmaxPost(endpoint: string, token: string, body: any): Promise<any> {
    const ctrl = new AbortController()
    setTimeout(() => ctrl.abort(), 25000)
    const res = await fetch(`${APPMAX_BASE}${endpoint}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
            'Content-Type': 'application/json',
            'access-token': token,
        },
        body: JSON.stringify(body),
    })
    const text = await res.text()
    console.log(`Appmax ${endpoint} [${res.status}]:`, text.substring(0, 400))
    try {
        return JSON.parse(text)
    } catch {
        throw new Error(`Resposta inválida da Appmax em ${endpoint}: ${text.substring(0, 200)}`)
    }
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

        const body = await req.json()
        const { plan, paymentData, guestEmail, guestName, tracking, orderBump, orderBumpPrice } = body

        // Resolve user from Authorization JWT
        let effectiveUserId: string | null = null
        const authHeader = req.headers.get('Authorization')
        if (authHeader && authHeader !== 'Bearer null' && authHeader.length > 20) {
            const token = authHeader.replace('Bearer ', '')
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                if (payload.role === 'authenticated' && payload.sub) {
                    effectiveUserId = payload.sub
                }
            } catch { /* ignore */ }
        }

        // guestEmail/guestName may be at root OR inside paymentData (frontend sends both)
        let email = guestEmail || paymentData?.email || ''
        let name = guestName || paymentData?.name || ''
        let phone = '11999999999'
        let profile: any = null

        if (effectiveUserId) {
            const { data: p } = await supabaseClient
                .from('profiles')
                .select('email, name, phone, ai_credits')
                .eq('id', effectiveUserId)
                .single()
            if (p) {
                profile = p
                email = p.email || email
                name = p.name || name
                phone = p.phone || phone
            }

            if (!email || !name) {
                const { data: authUser } = await supabaseClient.auth.admin.getUserById(effectiveUserId)
                if (!email) email = authUser?.user?.email || ''
                if (!name) name = authUser?.user?.user_metadata?.full_name || authUser?.user?.user_metadata?.name || ''
            }
        }

        if (!email) email = paymentData?.email || 'guest@connectacademy.com.br'
        if (!name) name = paymentData?.name || 'Usuario'

        const APPMAX_TOKEN = Deno.env.get('APPMAX_API_TOKEN') || Deno.env.get('APPMAX_API_KEY')
        if (!APPMAX_TOKEN) {
            throw new Error('Token Appmax não configurado (APPMAX_API_TOKEN ausente)')
        }

        console.log(`Processing CC for plan=${plan.id} | token starts: ${APPMAX_TOKEN.substring(0, 8)}`)

        // Parse names
        const nameParts = name.trim().split(/\s+/)
        const firstname = nameParts[0] || 'Usuario'
        const lastname = nameParts.slice(1).join(' ') || 'Academy'

        // Parse phone (digits only, min 10)
        const rawPhone = (paymentData.phone || phone).replace(/\D/g, '')
        const finalPhone = rawPhone.length >= 10 ? rawPhone : '11999999999'

        // Parse CPF
        const cpf = paymentData.cpf.replace(/\D/g, '')

        // Parse card
        const cardNumber = paymentData.card_number.replace(/\s/g, '')
        const cardName = paymentData.card_name.toUpperCase()
        const expirySplit = paymentData.card_expiry.split('/')
        const cardMonth = expirySplit[0]?.trim().padStart(2, '0') || '12'
        const rawYear = expirySplit[1]?.trim() || '30'
        const cardYear = rawYear.length === 2 ? '20' + rawYear : rawYear
        const cardCvv = paymentData.card_cvv
        const installments = parseInt(paymentData.installments) || 1

        // Parse price — prefer explicit amount from frontend (already has interest + orderBump included)
        const region = plan.region || 'BR'
        let priceNum = 0
        const hasExplicitAmount = body.amount && parseFloat(String(body.amount)) > 0
        if (hasExplicitAmount) {
            // Frontend sent total-with-interest (already includes orderBump if active)
            priceNum = parseFloat(String(body.amount))
        } else {
            const rawPrice = (plan.billingCycle === 'annual'
                ? plan.prices?.[region]?.annual
                : plan.prices?.[region]?.monthly) || '0'
            priceNum = parseFloat(String(rawPrice).replace(',', '.'))
            // Only add orderBump here when falling back to base price
            if (orderBump && orderBumpPrice) {
                priceNum = priceNum + parseFloat(String(orderBumpPrice))
            }
        }

        console.log(`Card ending ${cardNumber.slice(-4)} | R$${priceNum} | ${installments}x`)

        // === STEP 1: Create customer ===
        console.log('Step 1: creating customer')
        const customerData = await appmaxPost('/customer', APPMAX_TOKEN, {
            firstname,
            lastname,
            email,
            telephone: finalPhone,
            document_number: cpf,
            postcode: '01310100',
            address_street: 'Avenida Paulista',
            address_street_number: '1000',
            address_street_district: 'Bela Vista',
            address_city: 'Sao Paulo',
            address_state: 'SP',
        })

        if (!customerData.success) {
            const errorText = customerData.text || JSON.stringify(customerData)
            if (errorText.toLowerCase().includes('cpf')) {
                throw new Error('CPF inválido. Verifique se digitou corretamente.')
            }
            throw new Error(`Appmax customer: ${errorText}`)
        }
        const customerId = customerData.data.id
        console.log('Customer created:', customerId)

        // === STEP 2: Create order ===
        console.log('Step 2: creating order for customer', customerId)
        
        const orderPayload: any = {
            customer_id: customerId,
            products: [{
                sku: String(plan.id),
                name: `Plano ${plan.label || plan.id} - Connect Academy`,
                qty: 1,
                price: priceNum,
            }],
        }
        if (tracking && Object.keys(tracking).length > 0) {
            orderPayload.tracking = tracking
        }

        const orderData = await appmaxPost('/order', APPMAX_TOKEN, orderPayload)

        if (!orderData.success) {
            throw new Error(`Appmax order: ${orderData.text || JSON.stringify(orderData)}`)
        }
        const orderId = orderData.data.id
        console.log('Order created:', orderId)

        // === STEP 3: Pay with credit card ===
        console.log('Step 3: processing credit card for order', orderId)
        const ccData = await appmaxPost('/payment/credit-card', APPMAX_TOKEN, {
            customer: { customer_id: customerId },
            cart: { order_id: orderId },
            payment: {
                CreditCard: {
                    document_number: cpf,
                    number: cardNumber,
                    name: cardName,
                    month: cardMonth,
                    year: cardYear,
                    cvv: cardCvv,
                    installments: installments,
                }
            }
        })

        console.log('CC payment result - success:', ccData.success, '| text:', ccData.text)

        if (!ccData.success) {
            let errMsg = 'Erro ao processar cartão.'
            if (ccData.data?.message && typeof ccData.data.message === 'string') {
                errMsg = ccData.data.message
            } else if (ccData.data && typeof ccData.data === 'object') {
                const vals = Object.values(ccData.data)
                const stringErrs = vals.filter(v => Array.isArray(v)).flat()
                if (stringErrs.length > 0) {
                    errMsg = stringErrs.join(' | ')
                } else if (ccData.text) {
                    errMsg = ccData.text
                }
            } else if (ccData.text) {
                errMsg = ccData.text
            } else if (ccData.message) {
                errMsg = ccData.message
            }

            if (errMsg === 'The given data failed to pass validation.') {
                errMsg = 'Verifique os dados informados do cartão.'
            }

            errMsg = errMsg.replace(/payment\. ?[Cc]redit ?[Cc]ard\./g, '')
            throw new Error(errMsg)
        }

        // Parse approval status
        const ccResult = ccData.data || ccData
        const appmaxStatus = ccResult.status || ccResult.order_status || 'processing'
        const isApproved = ['approved', 'pagamento_confirmado', 'paid', 'captured', 'Approved'].includes(String(appmaxStatus))

        console.log('Payment status:', appmaxStatus, '| Approved:', isApproved)

        // Save payment intent to DB
        await supabaseClient.from('payment_intents').insert({
            user_id: effectiveUserId,
            external_id: String(orderId),
            method: 'cc_appmax',
            status: isApproved ? 'approved' : 'pending',
            plan_id: plan.id,
            billing_cycle: plan.billingCycle || 'annual',
            amount: priceNum,
            guest_email: effectiveUserId ? null : email,
            guest_name: effectiveUserId ? null : name,
        })

        // Immediately activate plan if approved
        if (isApproved) {
            if (effectiveUserId) {
                // Logged-in user: update directly
                if (plan.id.startsWith('cred_')) {
                    const creditsToAdd = parseInt(plan.id.split('_')[1], 10)
                    if (!isNaN(creditsToAdd)) {
                        await supabaseClient
                            .from('profiles')
                            .update({ ai_credits: (profile?.ai_credits || 0) + creditsToAdd })
                            .eq('id', effectiveUserId)
                    }
                } else {
                    let initialCredits = 0;
                    let addDays = 30;

                    if (plan.id === 'starter') { initialCredits = 5; addDays = 90; }
                    else if (plan.id === 'pro') { initialCredits = 10; addDays = 365; }
                    else if (plan.id === 'elite' || plan.id === 'vitalicio') { initialCredits = 20; addDays = 36500; }

                    const endAt = new Date();
                    endAt.setDate(endAt.getDate() + addDays);

                    await supabaseClient
                        .from('profiles')
                        .update({
                            plan: plan.id,
                            ai_credits: (profile?.ai_credits || 0) + initialCredits,
                            subscription_end_at: endAt.toISOString(),
                            yupoo_access: true,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', effectiveUserId)

                    // Send confirmation email to logged-in user
                    if (email) {
                        console.log(`[process-appmax-cc] Sending access email to logged-in user ${email}, plan=${plan.id}`)
                        try {
                            await fetch(
                                `${Deno.env.get('SUPABASE_URL')}/functions/v1/activate-user`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                                        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
                                    },
                                    body: JSON.stringify({
                                        plan: plan.id,
                                        userId: effectiveUserId,
                                        email,
                                        name,
                                        grantCredits: false, // already granted above
                                        sendEmail: true,
                                    }),
                                }
                            )
                        } catch (emailErr: any) {
                            console.error('[process-appmax-cc] Email send error (non-fatal):', emailErr.message)
                        }
                    }
                }
            } else if (email) {
                // Guest user: call activate-user by email (creates user if needed + sends email)
                console.log(`Guest CC payment approved. Calling activate-user for email: ${email}, plan: ${plan.id}`)
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
                                plan: plan.id,
                                email,
                                name,
                                billingCycle: plan.billingCycle || 'annual',
                                sendEmail: true,
                            }),
                        }
                    )
                    const activateBody = await activateRes.json()
                    console.log('activate-user result:', JSON.stringify(activateBody))
                } catch (activateErr: any) {
                    console.error('Failed to call activate-user for guest:', activateErr.message)
                }
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                id: orderId,
                status: appmaxStatus,
                approved: isApproved,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        console.error('process-appmax-cc error:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
