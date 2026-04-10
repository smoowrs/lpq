
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const hash = (val?: string) => {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
};

const isValidFbc = (val?: string) => {
  if (!val) return undefined;
  const decoded = decodeURIComponent(val);
  const parts = decoded.split('.');
  if (parts.length === 4) {
    const creationTime = parseInt(parts[2], 10);
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    if (Date.now() - creationTime < ninetyDaysMs) {
      return decoded;
    }
    return undefined;
  }
  return decoded;
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = "EAAS7kp2xCx4BRBTk467uOi1z3dKIwBYIZAZCfsT86cZB8tduuY2v5nMDRlaZA4m4p2xZB6KYKi50ZC61HX3t61aEKjU232ufAKsMh0NvXfWhXfP7DhE8ZB3Gs5UBVrYBoy6ySrpvoCZATmdIRVjbmr4oqEZB9jZBiTFNJfNJCZAZBMXZBqjqejZCR8eEgMSDxZAtWF07V7y8gZDZD";
  const pixelId = "1207575821540865";

  const { eventName, eventId, eventSourceUrl, fbp, fbc, clientData, userData, testEventCode } = request.body;

  const rawFbc = fbc || request.cookies?._fbc || request.cookies?.fbc;
  const finalFbc = isValidFbc(rawFbc);

  const eventData = {
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
    data: [
      {
        event_name: eventName || 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: eventId,
        event_source_url: eventSourceUrl,
        user_data: {
          client_ip_address: request.headers['x-forwarded-for'] || request.socket?.remoteAddress || '',
          client_user_agent: request.headers['user-agent'] || '',
          fbp: fbp || request.cookies?._fbp || request.cookies?.fbp,
          ...(finalFbc ? { fbc: finalFbc } : {}),
          ...(userData?.email ? { em: hash(userData.email) } : {}),
          ...(userData?.firstName ? { fn: hash(userData.firstName) } : {}),
          ...(userData?.lastName ? { ln: hash(userData.lastName) } : {}),
          ...(userData?.cpf ? { external_id: hash(userData.cpf.replace(/[^\d]/g, '')) } : {}),
          ...(userData?.phone ? (() => {
            // Normalize to E.164 format: +55XXXXXXXXXXX
            const digits = userData.phone.replace(/\D/g, '');
            const e164 = digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
            return { ph: hash(e164) };
          })() : {}),
        },
        custom_data: clientData || {},
      }
    ]
  };

  try {
    const fbResponse = await fetch(`https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const result = await fbResponse.json();
    return response.status(200).json(result);
  } catch (error) {
    console.error('FB CAPI Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
