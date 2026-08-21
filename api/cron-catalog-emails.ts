import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = 'https://bfyfzpjivesrbcxilmzd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/catalog-welcome-email`;
const CRON_SECRET = process.env.CRON_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Segurança: só aceita se vier com o secret correto
  const authHeader = req.headers['authorization'] || '';
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Busca leads que:
    // - foram criados há pelo menos 3 horas
    // - ainda não receberam o email (email_sent = false ou null)
    const query = `${SUPABASE_URL}/rest/v1/landing_leads?select=id,email&email_sent=is.false&created_at=lt.${new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()}`;

    const leadsRes = await fetch(query, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!leadsRes.ok) {
      const err = await leadsRes.text();
      console.error('[cron-catalog-emails] Supabase query error:', err);
      return res.status(500).json({ error: 'Failed to query leads', detail: err });
    }

    const leads: { id: string; email: string }[] = await leadsRes.json();
    console.log(`[cron-catalog-emails] Found ${leads.length} lead(s) to email`);

    const results = await Promise.allSettled(
      leads.map(async (lead) => {
        const r = await fetch(EDGE_FN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ email: lead.email, lead_id: lead.id }),
        });
        const json = await r.json();
        console.log(`[cron-catalog-emails] ${lead.email}:`, JSON.stringify(json));
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
