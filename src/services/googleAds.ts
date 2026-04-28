// Google Ads Conversion Tracking
// Account ID: AW-18105360522

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/** Helper seguro para disparar eventos gtag */
function gtagSafe(...args: any[]) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag(...args);
    }
  } catch (e) {
    console.warn('[GoogleAds] gtag error:', e);
  }
}

/**
 * Dispara evento de conversão de compra no Google Ads.
 * Use na confirmação de pagamento aprovado.
 *
 * @param value    Valor da venda (ex: 137.90)
 * @param currency Moeda ISO-4217 (ex: 'BRL' ou 'EUR')
 * @param orderId  ID do pedido (opcional, melhora deduplicação)
 */
export const trackGoogleAdsPurchase = (
  value: number,
  currency = 'BRL',
  orderId?: string
) => {
  gtagSafe('event', 'conversion', {
    send_to: 'AW-18105360522/U6VlCJ3BiJ8cEIrBp7lD',
    value,
    currency,
    transaction_id: orderId || undefined,
  });
};

/**
 * Dispara evento de início de checkout (opcional — melhora Quality Score).
 */
export const trackGoogleAdsBeginCheckout = (value: number, currency = 'BRL') => {
  gtagSafe('event', 'begin_checkout', {
    send_to: 'AW-18105360522',
    value,
    currency,
  });
};
