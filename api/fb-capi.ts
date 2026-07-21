import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// ── Helpers ────────────────────────────────────────────────────────────────

/** SHA-256 + trim + lowercase conforme exigido pela FB CAPI */
const hash = (val?: string): string | undefined => {
    if (!val) return undefined;
    return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
};

/** Extrai o primeiro IP de x-forwarded-for (Vercel pode passar lista separada por vírgula) */
const extractIp = (header: string | string[] | undefined, fallback: string): string => {
    if (!header) return fallback;
    const raw = Array.isArray(header) ? header[0] : header;
    return raw.split(',')[0].trim() || fallback;
};

/** Valida e retorna o fbc apenas se o formato estiver correto e dentro de 90 dias */
const isValidFbc = (val?: string): string | undefined => {
    if (!val) return undefined;
    try {
        const decoded = decodeURIComponent(val);
        const parts = decoded.split('.');
        if (parts.length === 4) {
            const creationTime = parseInt(parts[2], 10);
            if (!isNaN(creationTime) && Date.now() - creationTime < 90 * 24 * 60 * 60 * 1000) {
                return decoded;
            }
            return undefined; // expirado
        }
        return decoded;
    } catch { return undefined; }
};

/** Normaliza número de telefone para E.164 — suporta BR (+55) e Europa */
const normalizePhone = (phone: string, country = 'br'): string => {
    const digits = phone.replace(/\D/g, '');
    // Se já tem código de país (ex: 5511...) ou é europeu, não adiciona 55
    if (digits.startsWith('55') && digits.length >= 12) return `+${digits}`; // BR
    if (country === 'br') return `+55${digits}`;
    // Para Europa: país já deve ter código incluso (ex: 351..., 34..., 33...)
    return digits.startsWith('+') ? digits : `+${digits}`;
};

/** Detecta país pelo header Accept-Language quando não enviado pelo browser */
const detectCountryFromHeader = (acceptLang?: string): string => {
    if (!acceptLang) return 'br';
    // Ex: "pt-BR,pt;q=0.9,en;q=0.8" → "br"
    const match = acceptLang.match(/[a-z]{2}-([A-Z]{2})/i);
    if (match) return match[1].toLowerCase();
    const langMap: Record<string, string> = {
        pt: 'br', en: 'us', es: 'es', fr: 'fr', de: 'de', it: 'it'
    };
    const lang = acceptLang.split(',')[0].split('-')[0].toLowerCase();
    return langMap[lang] || 'br';
};

// ── Pixels ─────────────────────────────────────────────────────────────────

const PIXELS = [
    {
        id: '1207575821540865',
        token: 'EAAS7kp2xCx4BRBTk467uOi1z3dKIwBYIZAZCfsT86cZB8tduuY2v5nMDRlaZA4m4p2xZB6KYKi50ZC61HX3t61aEKjU232ufAKsMh0NvXfWhXfP7DhE8ZB3Gs5UBVrYBoy6ySrpvoCZATmdIRVjbmr4oqEZB9jZBiTFNJfNJCZAZBMXZBqjqejZCR8eEgMSDxZAtWF07V7y8gZDZD',
    },
    {
        id: '858214503944051',
        token: 'EAANFZBUOf5McBR8HTcMcbAwIzsuXy8ZCud7dD3ZAVxJIUGbTNLvSH3O80TrkRMRv7m49ZAHzaCk27ZAwJSwZCDp4xuJQMxNDCkOCno0eQ3FEHzGngUyS9oHQtFfRk1G5qk4NKW1AShp8rnN64ZAUYLI2Eco0BT7QgReWvlJ5wPzoU8OnNh50HXSaDkUE0MYzh0UWwZDZD',
    },
];

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const {
        eventName,
        eventId,
        eventSourceUrl,
        fbp,
        fbc,
        clientData,
        userData,
        testEventCode,
    } = request.body;

    // ── IP real do cliente ─────────────────────────────────────────────────
    const clientIp = extractIp(
        request.headers['x-forwarded-for'] || request.headers['x-real-ip'],
        request.socket?.remoteAddress || ''
    );

    // ── fbc validado ───────────────────────────────────────────────────────
    const rawFbc = fbc || request.cookies?.['_fbc'] || request.cookies?.fbc;
    const finalFbc = isValidFbc(rawFbc);

    // ── fbp ────────────────────────────────────────────────────────────────
    const finalFbp = fbp || request.cookies?.['_fbp'] || request.cookies?.fbp;

    // ── País: browser envia, senão detecta pelo Accept-Language ───────────
    const country = userData?.country || detectCountryFromHeader(
        Array.isArray(request.headers['accept-language'])
            ? request.headers['accept-language'][0]
            : request.headers['accept-language']
    );

    // ── external_id: FB prefere array de hashes ────────────────────────────
    const rawExternalId = userData?.external_id || userData?.cpf?.replace(/[^\d]/g, '');
    const hashedExternalId = rawExternalId ? hash(rawExternalId) : undefined;

    // ── Normalização e hash do telefone ────────────────────────────────────
    let hashedPhone: string | undefined;
    if (userData?.phone) {
        try {
            const normalized = normalizePhone(userData.phone, country);
            hashedPhone = hash(normalized);
        } catch { /* silent */ }
    }

    // ── Monta user_data com todos os sinais disponíveis ───────────────────
    const user_data: Record<string, unknown> = {
        client_ip_address: clientIp,
        client_user_agent: request.headers['user-agent'] || '',
        ...(finalFbp                  ? { fbp: finalFbp }                      : {}),
        ...(finalFbc                  ? { fbc: finalFbc }                      : {}),
        ...(hashedExternalId          ? { external_id: [hashedExternalId] }    : {}), // array
        ...(userData?.email           ? { em: [hash(userData.email)]  }        : {}), // array
        ...(userData?.firstName       ? { fn: hash(userData.firstName) }       : {}),
        ...(userData?.lastName        ? { ln: hash(userData.lastName)  }       : {}),
        ...(hashedPhone               ? { ph: [hashedPhone]            }       : {}), // array
        ...(country                   ? { country: hash(country)       }       : {}),
        ...(userData?.locale          ? { ct: undefined }                      : {}), // placeholder
    };

    // ── Payload de evento ──────────────────────────────────────────────────
    const eventPayload = {
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
        data: [
            {
                event_name: eventName || 'PageView',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_id: eventId,
                event_source_url: eventSourceUrl,
                user_data,
                custom_data: clientData || {},
            },
        ],
    };

    // Remove chaves com valor undefined
    eventPayload.data[0].user_data = Object.fromEntries(
        Object.entries(user_data).filter(([, v]) => v !== undefined)
    );

    // ── Envia para todos os pixels em paralelo (allSettled = falha isolada) ─
    try {
        const results = await Promise.allSettled(
            PIXELS.map(async pixel => {
                const res = await fetch(
                    `https://graph.facebook.com/v22.0/${pixel.id}/events?access_token=${pixel.token}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(eventPayload),
                    }
                );
                const json = await res.json();
                if (!res.ok) console.error(`CAPI pixel ${pixel.id} error:`, json);
                return { pixelId: pixel.id, ...json };
            })
        );

        const data = results.map(r =>
            r.status === 'fulfilled' ? r.value : { error: (r as any).reason?.message }
        );

        return response.status(200).json({ pixels: data });
    } catch (error) {
        console.error('FB CAPI Fatal:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
