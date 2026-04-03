import { supabase } from '../services/supabase';

// Helper to get or create a persistent anonymous ID for better match quality
const getExternalId = () => {
    let extId = localStorage.getItem('fb_ext_id');
    if (!extId) {
        extId = 'ext_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('fb_ext_id', extId);
    }
    return extId;
};

export const trackFBEvent = async (eventName: string, eventData: any = {}, userData?: any) => {
    // 1. Generate unique Event ID for deduplication (CRITICAL for Match Quality)
    const eventId = Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    
    // 2. Prepare Match Keys (UserData)
    // We send this to both Pixel (if possible) and CAPI
    let enrichedUserData = { 
        external_id: getExternalId(),
        ...(userData || {}) 
    };

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            enrichedUserData.external_id = session.user.id;
            enrichedUserData.email = session.user.email;
            if (session.user.user_metadata?.full_name) {
                const parts = session.user.user_metadata.full_name.split(' ');
                enrichedUserData.firstName = parts[0];
                if (parts.length > 1) enrichedUserData.lastName = parts.slice(1).join(' ');
            }
        }
    } catch (err) { /* silent */ }

    // 3. Browser Pixel (fbq) - Deduplication via eventID
    if (typeof window !== 'undefined' && (window as any).fbq) {
        // Pixel handles deduplication when the eventID matches the CAPI eventID
        (window as any).fbq('track', eventName, eventData, { eventID: eventId });
    }

    // 4. Server-Side (CAPI) - Massive Match Quality Boost
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const fbclid = urlParams.get('fbclid');
        
        // FBC (Facebook Click ID)
        let fbc = undefined;
        if (fbclid) {
            fbc = `fb.1.${Date.now()}.${fbclid}`;
        } else {
            const fbcMatch = document.cookie.match(/(^|;)\s*_fbc\s*=\s*([^;]+)/);
            if (fbcMatch) fbc = decodeURIComponent(fbcMatch[2]);
        }

        // FBP (Facebook Browser ID)
        const fbpMatch = document.cookie.match(/(^|;)\s*_fbp\s*=\s*([^;]+)/);
        const fbp = fbpMatch ? decodeURIComponent(fbpMatch[2]) : undefined;

        // Test Event Code (if debugging)
        let testEventCode = urlParams.get('test_event_code') || sessionStorage.getItem('fb_test_event_code');
        if (urlParams.get('test_event_code')) sessionStorage.setItem('fb_test_event_code', urlParams.get('test_event_code')!);

        // Send to our Edge Function (CAPI Proxy)
        await fetch('/api/fb-capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventName,
                eventId, // MUST BE IDENTICAL TO PIXEL eventID
                eventSourceUrl: window.location.href,
                fbp,
                fbc,
                clientUserAgent: navigator.userAgent,
                clientIpAddress: 'AUTO', // Handled by server or Edge function
                clientData: eventData,
                userData: enrichedUserData,
                testEventCode
            })
        });
    } catch (e) {
        console.error(`CAPI Error (${eventName}):`, e);
    }
};
