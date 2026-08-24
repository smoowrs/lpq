import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = 'https://bfyfzpjivesrbcxilmzd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/catalog-welcome-email`;
const CRON_SECRET = process.env.CRON_SECRET || '';

// Envia email 30 minutos após cadastro, sem restrição de horário
const DELAY_MS = 30 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers['authorization'] || '';
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const cutoff = new Date(Date.now() - DELAY_MS).toISOString();
    const headers = {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };

    // Leads que ainda não receberam email e cadastraram há mais de 30min
    const url = `${SUPABASE_URL}/rest/v1/landing_leads` +
      `?select=id,email,ab_group` +
      `&email_sent=is.false` +
      `&created_at=lt.${cutoff}` +
      `&order=created_at.asc` +
      `&limit=50`;

    const r = await fetch(url, { headers });
    if (!r.ok) {
      const err = await r.text();
      console.error('[cron-catalog-emails] Erro ao buscar leads:', err);
      return res.status(500).json({ error: err });
    }

    const leads: { id: string; email: string; ab_group: string }[] = await r.json();
    console.log(`[cron-catalog-emails] ${leads.length} lead(s) elegível(s) (30min+, email_sent=false)`);

    if (leads.length === 0) {
      return res.status(200).json({ processed: 0, message: 'Nenhum lead elegível agora' });
    }

    const results = await Promise.allSettled(
      leads.map(async (lead) => {
        const r = await fetch(EDGE_FN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
          body: JSON.stringify({ email: lead.email, lead_id: lead.id, ab_group: lead.ab_group }),
        });
        const json = await r.json();
        console.log(`[cron] ${lead.email}:`, JSON.stringify(json));
        return { lead_id: lead.id, email: lead.email, ...json };
      })
    );

    return res.status(200).json({
      processed: leads.length,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { error: (r as any).reason?.message }),
    });

  } catch (err: any) {
    console.error('[cron-catalog-emails] Fatal:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
