import React, { useEffect, useState } from 'react';
import { CheckoutModal } from '../components/CheckoutModal';

const PLANS = [
  { id: 'starter', label: 'STARTER', emoji: '🌎', period: '3 MESES DE ACESSO', periodLabel: 'trimestre', priceOriginal: 'R$ 97,00', price: 'R$ 67,90', installment: 'ou 12x de R$ 7,66', priceEU: '€ 16,00', cta: 'Comprar agora', ctaHref: '', highlight: false, free: false, desc: 'Acesso essencial para começar suas importações.', included: [], excluded: [], prices: { BR: { annual: '67.90' }, EU: { annual: '16.00' } }, region: 'BR' },
  { id: 'pro', label: 'PRO', emoji: '🌎', period: '1 ANO DE ACESSO', periodLabel: 'ano', priceOriginal: 'R$ 197,00', price: 'R$ 137,90', installment: 'ou 12x de R$ 14,91', priceEU: '€ 32,00', cta: 'Comprar agora', ctaHref: '', highlight: true, free: false, desc: 'O plano intermediário para quem busca variedade e ferramentas de IA.', included: [], excluded: [], prices: { BR: { annual: '137.90' }, EU: { annual: '32.00' } }, region: 'BR' },
  { id: 'elite', label: 'ELITE', emoji: '👑', period: 'ACESSO VITALÍCIO', periodLabel: 'único', priceOriginal: 'R$ 389,00', price: 'R$ 272,30', installment: 'ou 12x de R$ 29,47', priceEU: '€ 62,00', cta: 'Comprar agora', ctaHref: '', highlight: false, free: false, desc: 'Acesso total e suporte prioritário para escala máxima.', included: [], excluded: [], prices: { BR: { annual: '272.30' }, EU: { annual: '62.00' } }, region: 'BR' },
];

export function CheckoutPage() {
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('checkout');
    if (planId) {
      const found = PLANS.find(p => p.id === planId.toLowerCase());
      if (found) setPlan(found);
      else window.location.href = '/';
    } else {
      window.location.href = '/';
    }
  }, []);

  if (!plan) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #254bff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />
      <CheckoutModal
        plan={plan}
        onClose={() => { window.location.href = '/'; }}
        onSuccess={() => { window.location.href = '/'; }}
      />
    </>
  );
}
