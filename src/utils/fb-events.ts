import { supabase } from '../services/supabase';

// ── Helpers ────────────────────────────────────────────────────────────────

/** ID anônimo persistente — mantém continuidade entre sessões */
const getExternalId = (): string => {
    let extId = localStorage.getItem('fb_ext_id');
    if (!extId) {
        extId = 'ext_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('fb_ext_id', extId);
    }
    return extId;
};

/** Detecta país pelo locale do browser (ISO 3166-1 alpha-2, minúsculo) */
const detectCountry = (): string => {
    const lang = navigator.language || 'pt-BR';
    // Ex: "pt-BR" → "br" | "pt-PT" → "pt" | "en-US" → "us" | "fr-FR" → "fr"
    const parts = lang.split('-');
    if (parts.length >= 2) return parts[1].toLowerCase();
    // Fallback por idioma
    const map: Record<string, string> = { pt: 'br', en: 'us', es: 'es', fr: 'fr', de: 'de' };
    return map[parts[0].toLowerCase()] || 'br';
};

/** Lê cookie pelo nome */
const getCookie = (name: string): string | undefined => {
    const m = document.cookie.match(new RegExp('(?:^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
    return m ? decodeURIComponent(m[1]) : undefined;
};

/**
 * Garante que o fbp sempre existe — lê o cookie oficial do SDK (_fbp),
 * se não disponível (script adiado ainda não rodou), gera seguindo o
 * formato exato do Facebook: fb.{version}.{creationTime_ms}.{randomUint32}
 * e persiste no localStorage para consistência entre eventos da sessão.
 */
const getOrCreateFbp = (): string => {
    // 1. Prefere o cookie oficial criado pelo SDK
    const sdkFbp = getCookie('_fbp');
    if (sdkFbp) {
        localStorage.setItem('fb_fbp', sdkFbp);
        return sdkFbp;
    }

    // 2. Usa o que persistimos antes (garante consistência na sessão)
    const stored = localStorage.getItem('fb_fbp');
    if (stored) return stored;

    // 3. Gera sintético no formato oficial: fb.1.{timestamp}.{random_uint32}
    const randomUint32 = Math.floor(Math.random() * 4294967296); // 2^32
    const synthetic = `fb.1.${Date.now()}.${randomUint32}`;
    localStorage.setItem('fb_fbp', synthetic);
    return synthetic;
};

/** Persiste o fbclid como _fbc no sessionStorage para reter entre páginas */
const getFbc = (): string | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');

    if (fbclid) {
        // Formato correto: fb.{version}.{creationTime}.{fbclid}
        const fbc = `fb.1.${Date.now()}.${fbclid}`;
        sessionStorage.setItem('_fbc_persist', fbc);
        return fbc;
    }

    // Tenta cookie oficial primeiro, depois sessionStorage (persistido antes)
    return getCookie('_fbc') || sessionStorage.getItem('_fbc_persist') || undefined;
};

// ── Tracker Principal ──────────────────────────────────────────────────────

export const trackFBEvent = async (eventName: string, eventData: any = {}, userData?: any) => {
    // 1. Event ID único — chave da deduplicação browser ↔ CAPI
    const eventId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 2. Dados base do usuário
    let enrichedUserData: any = {
        external_id: getExternalId(),
        country: detectCountry(),
        locale: navigator.language || 'pt-BR',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(userData || {}),
    };

    // 3. Enriquecer com dados da sessão Supabase (email, nome)
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            enrichedUserData.external_id = session.user.id;
            enrichedUserData.email       = session.user.email;
            const meta = session.user.user_metadata;
            if (meta?.full_name) {
                const parts = meta.full_name.trim().split(/\s+/);
                enrichedUserData.firstName = parts[0];
                if (parts.length > 1) enrichedUserData.lastName = parts.slice(1).join(' ');
            }
            if (meta?.phone) enrichedUserData.phone = meta.phone;
        }
    } catch (_) { /* silent */ }

    // 4. Browser Pixel — advanced matching + deduplication via eventID
    if (typeof window !== 'undefined' && (window as any).fbq) {
        // Advanced matching: passa dados conhecidos para o fbq melhorar a correspondência
        const advancedMatch: Record<string, string> = {};
        if (enrichedUserData.email)     advancedMatch['em'] = enrichedUserData.email;
        if (enrichedUserData.phone)     advancedMatch['ph'] = enrichedUserData.phone;
        if (enrichedUserData.firstName) advancedMatch['fn'] = enrichedUserData.firstName;
        if (enrichedUserData.lastName)  advancedMatch['ln'] = enrichedUserData.lastName;
        if (enrichedUserData.country)   advancedMatch['country'] = enrichedUserData.country;

        // Reinit com advanced matching quando tivermos dados (aumenta match quality browser side)
        if (Object.keys(advancedMatch).length > 0) {
            (window as any).fbq('init', '1207575821540865', advancedMatch);
            (window as any).fbq('init', '858214503944051',  advancedMatch);
        }

        (window as any).fbq('track', eventName, eventData, { eventID: eventId });
    }

    // 5. CAPI — server-side (maior contribuição para o match quality score)
    try {
        const fbc = getFbc();
        const fbp = getOrCreateFbp(); // sempre presente — sintético se SDK ainda não criou o cookie

        const urlParams = new URLSearchParams(window.location.search);
        let testEventCode = urlParams.get('test_event_code') || sessionStorage.getItem('fb_test_event_code') || undefined;
        if (urlParams.get('test_event_code')) {
            sessionStorage.setItem('fb_test_event_code', urlParams.get('test_event_code')!);
        }

        // Disparo sem await para não bloquear a UI
        fetch('/api/fb-capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventName,
                eventId,
                eventSourceUrl: window.location.href,
                fbp,
                fbc,
                clientData: eventData,
                userData: enrichedUserData,
                testEventCode,
            }),
        }).catch(e => console.error(`CAPI Error (${eventName}):`, e));
    } catch (e) {
        console.error(`CAPI Prep Error (${eventName}):`, e);
    }
};
