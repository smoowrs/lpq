import type { VercelRequest, VercelResponse } from '@vercel/node';

// Appmax chama este endpoint quando PIX é pago (e outros eventos de pagamento)
// Configurar em: Appmax Dashboard → Configurações → Webhooks/Postbacks
// URL: https://connectacademy.com.br/api/appmax-webhook

const SUPABASE_URL = 'https://bfyfzpjivesrbcxilmzd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Status que indicam pagamento aprovado (Appmax usa vários nomes)
const APPROVED_STATUSES = new Set([
  'pagamento_confirmado', 'pago', 'paid', 'aprovado',
  'approved', 'integralizado', 'sucesso', 'captured', 'completed',
]);

// Extrai dados do payload (estrutura varia por versão da API Appmax)
function extractFromPayload(body: any) {
  const order = body?.data?.order || body?.order || body?.data || body;
  const orderId = String(order?.id || body?.id || body?.order_id || '').trim() || null;
  const rawStatus = order?.status || order?.payment_status || order?.order_status || body?.status || body?.event || '';
  const status = String(rawStatus).toLowerCase().trim();
  const customer = order?.customer || order?.buyer || body?.customer || {};
  const email = customer?.email || order?.email || body?.email || '';
  const name = `${customer?.firstname || customer?.first_name || ''} ${customer?.lastname || customer?.last_name || ''}`.trim()
    || customer?.name || order?.name || '';
  const products: any[] = order?.products || order?.items || body?.products || [];
  const planSku = products[0]?.sku || products[0]?.product_id || '';
  return { orderId, status, email, name, planSku };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Appmax faz GET para verificar URL ativa
  if (req.method === 'GET') return res.status(200).json({ ok: true, service: 'appmax-webhook' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body: any;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { body = req.body; }

  console.log('[appmax-webhook] Raw payload:', JSON.stringify(body));
  const { orderId, status, email, name, planSku } = extractFromPayload(body);
  console.log(`[appmax-webhook] orderId=${orderId} status="${status}" email="${email}" plan="${planSku}"`);

  if (!APPROVED_STATUSES.has(status)) {
    console.log(`[appmax-webhook] Ignorando status "${status}"`);
    return res.status(200).json({ ok: true, ignored: true, status });
  }

  if (!orderId) {
    console.error('[appmax-webhook] Sem orderId');
    return res.status(200).json({ ok: true, warning: 'sem orderId' });
  }

  try {
    const headers = {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };

    // Busca intent pelo orderId
    const intentRes = await fetch(
      `${SUPABASE_URL}/rest/v1/payment_intents?select=id,status,user_id,guest_email,guest_name,plan_id,billing_cycle&external_id=eq.${orderId}`,
      { headers }
    );
    const intents: any[] = await intentRes.json();
    const intent = Array.isArray(intents) ? intents[0] : null;

    // Idempotência — já estava aprovado
    if (intent?.status === 'approved') {
      console.log(`[appmax-webhook] Intent ${orderId} já aprovado — skip`);
      return res.status(200).json({ ok: true, already_activated: true });
    }

    // Atualiza status no DB
    await fetch(`${SUPABASE_URL}/rest/v1/payment_intents?external_id=eq.${orderId}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ status: 'approved' }),
    });

    const finalEmail = intent?.guest_email || email || null;
    const finalName  = intent?.guest_name  || name  || null;
    const finalPlan  = intent?.plan_id     || planSku || null;
    const userId     = intent?.user_id     || null;

    if (!finalEmail && !userId) {
      console.error('[appmax-webhook] Sem email nem userId para ativar');
      return res.status(200).json({ ok: true, warning: 'sem dados de usuario' });
    }
    if (!finalPlan) {
      console.error('[appmax-webhook] Sem plan_id');
      return res.status(200).json({ ok: true, warning: 'sem plan_id' });
    }

    console.log(`[appmax-webhook] Ativando: email=${finalEmail} plan=${finalPlan}`);
    const activateRes = await fetch(`${SUPABASE_URL}/functions/v1/activate-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
      body: JSON.stringify({
        plan: finalPlan, email: finalEmail, name: finalName, userId,
        billingCycle: intent?.billing_cycle || 'annual',
        sendEmail: true, grantCredits: true,
      }),
    });
    const activateBody = await activateRes.json();
    console.log('[appmax-webhook] activate-user:', JSON.stringify(activateBody));

    if (activateBody?.userId && !userId) {
      await fetch(`${SUPABASE_URL}/rest/v1/payment_intents?external_id=eq.${orderId}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ user_id: activateBody.userId }),
      });
    }

    return res.status(200).json({ ok: true, activated: true, orderId, email: finalEmail, plan: finalPlan });
  } catch (err: any) {
    console.error('[appmax-webhook] Erro:', err.message);
    return res.status(200).json({ ok: true, error: err.message }); // 200 para Appmax não retentar
  }
}
