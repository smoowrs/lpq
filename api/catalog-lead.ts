import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
);

const hash = (val?: string) =>
  val ? crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex') : undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body ?? {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ error: 'invalid email' });

  const emailClean = String(email).trim().toLowerCase();
  const abGroup = Math.random() < 0.5 ? 'A' : 'B';

  // 1. Salva no Supabase (mesma tabela que NovaPage usa)
  try {
    await supabase.from('landing_leads').insert({
      email: emailClean,
      source: 'portal_catalog_modal',
      page_url: req.headers.referer ?? 'connectacademy.com.br',
      ab_group: abGroup,
    });
  } catch { /* non-blocking */ }

  // 2. FB CAPI — dispara evento Lead para os dois pixels (BR + EU)
  const pixelIds = ['1207575821540865', '858214503944051'];
  const accessToken = process.env.FB_PIXEL_TOKEN;
  const ip = (req.headers['x-forwarded-for'] as string ?? '').split(',')[0].trim() || '0.0.0.0';
  const ua = req.headers['user-agent'] ?? '';

  if (accessToken) {
    for (const pixelId of pixelIds) {
      try {
        await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [{
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              event_source_url: `https://connectacademy.com.br`,
              user_data: {
                em: [hash(emailClean)],
                client_ip_address: ip,
                client_user_agent: ua,
              },
              custom_data: { content_name: 'catalog_portal' },
            }],
          }),
        });
      } catch { /* non-blocking */ }
    }
  }

  return res.status(200).json({ ok: true });
}
