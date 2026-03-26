
export const trackFBEvent = async (eventName: string, eventData: any = {}) => {
  // 1. Gerar ID de evento único para deduplicação
  const eventId = Date.now() + Math.random().toString(36).substring(2);

  // 2. Enviar evento via Browser (Pixel)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData, { eventID: eventId });
  }

  // 3. Enviar evento via Server (CAPI)
  try {
    await fetch('/api/fb-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        clientData: eventData
      })
    });
  } catch (e) {
    console.error(`Error sending CAPI event ${eventName}:`, e);
  }
};
