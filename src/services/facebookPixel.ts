// Facebook Pixel Event Helpers
// Pixel ID: 1207575821540865

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const fbq = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
};

/** Disparo padrão de PageView (já feito no index.html, mas pode chamar em SPAs) */
export const trackPageView = () => {
  fbq('track', 'PageView');
};

/** Quando o usuário visualiza um plano / abre o checkout */
export const trackViewContent = (planName: string, value: number, currency = 'BRL') => {
  fbq('track', 'ViewContent', {
    content_name: planName,
    content_category: 'Plano',
    value,
    currency,
  });
};

/** Quando o usuário clica em "Assinar" / inicia o checkout */
export const trackInitiateCheckout = (planName: string, value: number, currency = 'BRL') => {
  fbq('track', 'InitiateCheckout', {
    content_name: planName,
    value,
    currency,
    num_items: 1,
  });
};

/** Quando o usuário adiciona info de pagamento (CPF + concordou) */
export const trackAddPaymentInfo = (planName: string) => {
  fbq('track', 'AddPaymentInfo', {
    content_name: planName,
  });
};

/** Quando o pagamento é APROVADO */
export const trackPurchase = (planName: string, value: number, currency = 'BRL', orderId?: string) => {
  fbq('track', 'Purchase', {
    value,
    currency,
    content_name: planName,
    content_type: 'product',
    ...(orderId ? { order_id: orderId } : {}),
  });
};

/** Quando o usuário completa o cadastro (SignUp) */
export const trackCompleteRegistration = (method = 'email') => {
  fbq('track', 'CompleteRegistration', {
    method,
  });
};

/** Quando o usuário faz login */
export const trackLead = (planName?: string) => {
  fbq('track', 'Lead', {
    ...(planName ? { content_name: planName } : {}),
  });
};
