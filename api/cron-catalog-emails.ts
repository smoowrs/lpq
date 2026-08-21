import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = 'https://bfyfzpjivesrbcxilmzd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/catalog-welcome-email`;
const CRON_SECRET = process.env.CRON_SECRET || '';

// ─── Horário de Brasília (UTC-3) ──────────────────────────────────────────────
function getBrtHour(): number {
  const nowUtc = new Date();
  const brtOffset = -3 * 60; // UTC-3 em minutos
  const brtMs = nowUtc.getTime() + brtOffset * 60 * 1000;
  return new Date(brtMs).getUTCHours();
}

// ─── A/B config ───────────────────────────────────────────────────────────────
const AB_DELAYS: Record<string, number> = {
  A: 24 * 60 * 60 * 1000, // Grupo A: envia 24h depois
  B: 48 * 60 * 60 * 1000, // Grupo B: envia 48h depois
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Segurança
  const authHeader = req.headers['authorization'] || '';
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ─── Janela de envio: 19h–21h horário de Brasília ─────────────────────────
  const brtHour = getBrtHour();
  if (brtHour < 19 || brtHour >= 21) {
    console.log(`[cron-catalog-emails] Fora da janela. Hora BRT: ${brtHour}h. Janela: 19h–21h.`);
    return res.status(200).json({
      skipped: true,
      reason: `Fora da janela 19h–21h BRT (atual: ${brtHour}h)`,
      processed: 0,
    });
  }

  console.log(`[cron-catalog-emails] Dentro da janela. Hora BRT: ${brtHour}h. Processando A/B...`);

  try {
    const now = Date.now();
    const headers = {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };

    // ── Busca leads de cada grupo com o delay correto ──────────────────────
    const allLeads: { id: string; email: string; ab_group: string }[] = [];

    for (const [group, delayMs] of Object.entries(AB_DELAYS)) {
      const cutoff = new Date(now - delayMs).toISOString();
      // Leads que: não receberam email + são do grupo + passaram o delay mínimo
      const url = `${SUPABASE_URL}/rest/v1/landing_leads` +
        `?select=id,email,ab_group` +
        `&email_sent=is.false` +
        `&ab_group=eq.${group}` +
        `&created_at=lt.${cutoff}`;

      const r = await fetch(url, { headers });
      if (r.ok) {
        const rows = await r.json();
        allLeads.push(...rows);
        console.log(`[cron-catalog-emails] Grupo ${group}: ${rows.length} lead(s) elegíveis`);
      } else {
        console.error(`[cron-catalog-emails] Erro ao buscar grupo ${group}:`, await r.text());
      }
    }

    if (allLeads.length === 0) {
      return res.status(200).json({ processed: 0, brtHour, message: 'Nenhum lead elegível agora' });
    }

    // ── Envia emails individualmente ───────────────────────────────────────
    const results = await Promise.allSettled(
      allLeads.map(async (lead) => {
        const r = await fetch(EDGE_FN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
          body: JSON.stringify({ email: lead.email, lead_id: lead.id, ab_group: lead.ab_group }),
        });
        const json = await r.json();
        console.log(`[cron] ${lead.ab_group} | ${lead.email}:`, JSON.stringify(json));
        return { lead_id: lead.id, email: lead.email, group: lead.ab_group, ...json };
      })
    );

    return res.status(200).json({
      processed: allLeads.length,
      brtHour,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { error: (r as any).reason?.message }),
    });

  } catch (err: any) {
    console.error('[cron-catalog-emails] Fatal:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
