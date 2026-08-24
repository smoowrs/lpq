import type { VercelRequest, VercelResponse } from '@vercel/node';

// Cron de recuperação: roda a cada hora
// Busca payment_intents PIX com status != 'approved' criados há mais de 15 min
// Verifica na Appmax se foram pagos e ativa os que estavam pendentes

const SUPABASE_URL = 'https://bfyfzpjivesrbcxilmzd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APPMAX_TOKEN = process.env.APPMAX_API_TOKEN || '';

const APPROVED_STATUSES = new Set([
  'pagamento_confirmado', 'pago', 'paid', 'aprovado',
  'approved', 'integralizado', 'sucesso', 'captured', 'completed',
]);

async function checkAppmaxStatus(orderId: string): Promise<string> {
  try {
    const r = await fetch(`https://api.appmax.com.br/v2/order/${orderId}?access_token=${APPMAX_TOKEN}`);
    const j = await r.json();
    const raw = j?.data?.status || j?.data?.payment_status || j?.data?.order_status || j?.status || '';
    return String(raw).toLowerCase().trim();
  } catch {
    return '';
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    // Busca intents PIX (method=pix) não aprovados criados há pelo menos 15 minutos
    const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const url = `${SUPABASE_URL}/rest/v1/payment_intents` +
      `?select=id,external_id,status,guest_email,guest_name,plan_id,billing_cycle,user_id` +
      `&method=eq.pix` +
      `&status=neq.approved` +
      `&created_at=lt.${cutoff}` +
      `&order=created_at.desc` +
      `&limit=50`;

    const r = await fetch(url, { headers });
    const pendingIntents: any[] = await r.json();

    if (!Array.isArray(pendingIntents) || pendingIntents.length === 0) {
      return res.status(200).json({ ok: true, checked: 0, recovered: 0, message: 'Nenhum intent PIX pendente' });
    }

    console.log(`[pix-recovery] Verificando ${pendingIntents.length} intents pendentes...`);

    const results = [];
    for (const intent of pendingIntents) {
      const appmaxStatus = await checkAppmaxStatus(intent.external_id);
      console.log(`[pix-recovery] Intent ${intent.external_id}: appmax="${appmaxStatus}"`);

      if (!APPROVED_STATUSES.has(appmaxStatus)) {
        results.push({ id: intent.external_id, status: appmaxStatus, recovered: false });
        continue;
      }

      // Pagamento confirmado na Appmax mas não ativado — recupera agora
      console.log(`[pix-recovery] RECUPERANDO intent ${intent.external_id} (status appmax: ${appmaxStatus})`);

      // Atualiza status no DB
      await fetch(`${SUPABASE_URL}/rest/v1/payment_intents?id=eq.${intent.id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status: 'approved' }),
      });

      const finalEmail = intent.guest_email || null;
      const finalPlan  = intent.plan_id || null;
      const userId     = intent.user_id || null;

      if ((finalEmail || userId) && finalPlan) {
        const activateRes = await fetch(`${SUPABASE_URL}/functions/v1/activate-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
          body: JSON.stringify({
            plan: finalPlan, email: finalEmail, name: intent.guest_name, userId,
            billingCycle: intent.billing_cycle || 'annual',
            sendEmail: true, grantCredits: true,
          }),
        });
        const activateBody = await activateRes.json();
        console.log(`[pix-recovery] activate-user result for ${intent.external_id}:`, JSON.stringify(activateBody));
        results.push({ id: intent.external_id, appmaxStatus, recovered: true, activateResult: activateBody });
      } else {
        results.push({ id: intent.external_id, appmaxStatus, recovered: false, reason: 'sem email ou plan_id' });
      }
    }

    const recovered = results.filter(r => r.recovered).length;
    return res.status(200).json({ ok: true, checked: pendingIntents.length, recovered, results });

  } catch (err: any) {
    console.error('[pix-recovery] Erro:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
