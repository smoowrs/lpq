
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = "EAAS7kp2xCx4BRBTk467uOi1z3dKIwBYIZAZCfsT86cZB8tduuY2v5nMDRlaZA4m4p2xZB6KYKi50ZC61HX3t61aEKjU232ufAKsMh0NvXfWhXfP7DhE8ZB3Gs5UBVrYBoy6ySrpvoCZATmdIRVjbmr4oqEZB9jZBiTFNJfNJCZAZBMXZBqjqejZCR8eEgMSDxZAtWF07V7y8gZDZD";
  const pixelId = "1207575821540865";

  const { eventName, eventId, eventSourceUrl, clientData } = request.body;

  const eventData = {
    data: [
      {
        event_name: eventName || 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: eventId,
        event_source_url: eventSourceUrl,
        user_data: {
          client_ip_address: request.headers['x-forwarded-for'] || request.socket.remoteAddress,
          client_user_agent: request.headers['user-agent'],
          ...clientData
        }
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
