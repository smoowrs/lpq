
import { supabase } from '../services/supabase';

export const trackFBEvent = async (eventName: string, eventData: any = {}, userData?: any) => {
  // 1. Gerar ID de evento único para deduplicação
  const eventId = Date.now() + Math.random().toString(36).substring(2);

  // Auto-enrich userData with Supabase Session if available (Massive Match Quality Boost)
  let enrichedUserData = { ...(userData || {}) };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && !enrichedUserData.email) {

      enrichedUserData.email = session.user.email;
      if (session.user.user_metadata?.full_name && !enrichedUserData.firstName) {
        const parts = session.user.user_metadata.full_name.split(' ');
        enrichedUserData.firstName = parts[0];
        if (parts.length > 1) {
          enrichedUserData.lastName = parts.slice(1).join(' ');
        }
      }
    }
  } catch (err) { /* silent fail on session fetch */ }

  const hasUserData = Object.keys(enrichedUserData).length > 0;

  // 2. Enviar evento via Browser (Pixel)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    // fbq('track', eventName, payload, options)
    (window as any).fbq('track', eventName, eventData, { eventID: eventId });
  }

  // 3. Enviar evento via Server (CAPI)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFbclid = urlParams.get('fbclid');
    let testEventCode = urlParams.get('test_event_code');
    
    if (testEventCode) {
      sessionStorage.setItem('fb_test_event_code', testEventCode);
    } else {
      testEventCode = sessionStorage.getItem('fb_test_event_code');
    }

    let fbc = undefined;

    if (urlFbclid) {
      fbc = `fb.1.${Date.now()}.${urlFbclid}`;
    } else {
      const fbcMatch = document.cookie.match(/(^|;)\s*_fbc\s*=\s*([^;]+)/);
      if (fbcMatch) {
        const cookieFbc = decodeURIComponent(fbcMatch[2]);
        const parts = cookieFbc.split('.');
        if (parts.length === 4) {
          const creationTime = parseInt(parts[2], 10);
          const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
          if (Date.now() - creationTime < ninetyDaysMs) {
            fbc = cookieFbc;
          }
        } else {
          fbc = cookieFbc;
        }
      }
    }

    const fbpMatch = document.cookie.match(/(^|;)\s*_fbp\s*=\s*([^;]+)/);
    const fbp = fbpMatch ? decodeURIComponent(fbpMatch[2]) : undefined;

    await fetch('/api/fb-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        fbp,
        fbc,
        clientData: eventData,
        userData: hasUserData ? enrichedUserData : undefined,
        testEventCode
      })
    });
  } catch (e) {
    console.error(`Error sending CAPI event ${eventName}:`, e);
  }
};
