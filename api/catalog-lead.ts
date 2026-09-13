import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const SUPABASE_URL = 'https://bfyfzpjivesrbcxilmzd.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const hash = (val?: string) =>
  val ? crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex') : undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body ?? {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ error: 'invalid email' });

  const emailClean = String(email).trim().toLowerCase();
  const abGroup = Math.random() < 0.5 ? 'A' : 'B';

  // 1. Salva em landing_leads via REST direto (mesmo padrão das outras APIs)
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/landing_leads`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email: emailClean,
        source: 'portal_catalog_modal',
        page_url: req.headers.referer ?? 'connectacademy.com.br',
        ab_group: abGroup,
      }),
    });
  } catch (e) {
    console.error('supabase insert error', e);
  }

  // 2. FB CAPI — Lead para os dois pixels (BR + EU)
  const accessToken = process.env.FB_PIXEL_TOKEN;
  const ip = (req.headers['x-forwarded-for'] as string ?? '').split(',')[0].trim() || '0.0.0.0';
  const ua = req.headers['user-agent'] ?? '';

  if (accessToken) {
    for (const pixelId of ['1207575821540865', '858214503944051']) {
      try {
        await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [{
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              event_source_url: 'https://connectacademy.com.br',
              user_data: {
                em: [hash(emailClean)],
                client_ip_address: ip,
                client_user_agent: ua,
              },
              custom_data: { content_name: 'catalog_portal' },
            }],
          }),
        });
      } catch {}
    }
  }

  return res.status(200).json({ ok: true });
}
