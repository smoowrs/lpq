// Facebook Pixel Event Helpers
// Pixel ID: 1207575821540865

import { trackFBEvent } from '../utils/fb-events';

/** Disparo padrão de PageView (já feito no index.html, mas pode chamar em SPAs) */
export const trackPageView = () => {
  trackFBEvent('PageView');
};

/** Quando o usuário visualiza um plano / abre o checkout */
export const trackViewContent = (planName: string, value: number, currency = 'BRL', userData?: any) => {
  trackFBEvent('ViewContent', {
    content_name: planName,
    content_category: 'Plano',
    value,
    currency,
  }, userData);
};

/** Quando o usuário clica em "Assinar" / inicia o checkout */
export const trackInitiateCheckout = (planName: string, value: number, currency = 'BRL', userData?: any) => {
  trackFBEvent('InitiateCheckout', {
    content_name: planName,
    value,
    currency,
    num_items: 1,
  }, userData);
};

/** Quando o usuário completa o Step 1 (Lead) */
export const trackLead = (planName: string, value: number, currency = 'BRL', userData?: any) => {
  trackFBEvent('Lead', {
    content_name: planName,
    value,
    currency,
  }, userData);
};

/** Quando o usuário adiciona info de pagamento (CPF + concordou) */
export const trackAddPaymentInfo = (planName: string, userData?: any) => {
  trackFBEvent('AddPaymentInfo', {
    content_name: planName,
  }, userData);
};

/** Quando o pagamento é APROVADO */
export const trackPurchase = (planName: string, value: number, currency = 'BRL', orderId?: string, userData?: any) => {
  trackFBEvent('Purchase', {
    value,
    currency,
    content_name: planName,
    content_type: 'product',
    ...(orderId ? { order_id: orderId } : {}),
  }, userData);
};
