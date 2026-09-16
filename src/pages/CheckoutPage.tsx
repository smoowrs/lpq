import React, { useEffect, useState } from 'react';
import { CheckoutModal } from '../components/CheckoutModal';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() { if (this.state.hasError) return <div style={{padding:40,color:'red',background:'#fff'}}>{String(this.state.error)}</div>; return this.props.children; }
}


const PLANS = [
  { id: 'starter', label: 'STARTER', emoji: '🌎', period: '3 MESES DE ACESSO', periodLabel: 'trimestre', priceOriginal: 'R$ 97,00', price: 'R$ 67,90', installment: 'ou 12x de R$ 7,66', priceEU: '€ 16,00', cta: 'Comprar agora', ctaHref: '', highlight: false, free: false, desc: 'Acesso essencial para começar suas importações.', included: [], excluded: [], prices: { BR: { annual: '67.90' }, EU: { annual: '16.00' } }, region: 'BR' },
  { id: 'pro', label: 'PRO', emoji: '🌎', period: '1 ANO DE ACESSO', periodLabel: 'ano', priceOriginal: 'R$ 197,00', price: 'R$ 137,90', installment: 'ou 12x de R$ 14,91', priceEU: '€ 32,00', cta: 'Comprar agora', ctaHref: '', highlight: true, free: false, desc: 'O plano intermediário para quem busca variedade e ferramentas de IA.', included: [], excluded: [], prices: { BR: { annual: '137.90' }, EU: { annual: '32.00' } }, region: 'BR' },
  { id: 'elite', label: 'ELITE', emoji: '👑', period: 'ACESSO VITALÍCIO', periodLabel: 'único', priceOriginal: 'R$ 389,00', price: 'R$ 272,30', installment: 'ou 12x de R$ 29,47', priceEU: '€ 62,00', cta: 'Comprar agora', ctaHref: '', highlight: false, free: false, desc: 'Acesso total e suporte prioritário para escala máxima.', included: [], excluded: [], prices: { BR: { annual: '272.30' }, EU: { annual: '62.00' } }, region: 'BR' },
];

export function CheckoutPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  useEffect(() => {
    const errHandler = (e: any) => setErrorMsg(e.message || String(e));
    window.addEventListener("error", errHandler);
    return () => window.removeEventListener("error", errHandler);
  }, []);

  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('checkout');
    const regionParam = (params.get('region') || 'BR').toUpperCase();
    if (planId) {
      const found = PLANS.find(p => p.id === planId.toLowerCase());
      if (found) {
        const hasDiscount = !!localStorage.getItem('connect-wheel:connect-roleta-oficial:result');
        const isBR = regionParam !== 'EU';
        const applyDiscount = hasDiscount && isBR;
        
        let p = { ...found, region: regionParam };
        
        // Define original vs discounted prices
        if (p.id === 'starter') {
            p.prices = { BR: { annual: applyDiscount ? '67.90' : '97.00' }, EU: { annual: '16.00' } };
            p.price = applyDiscount ? 'R$ 67,90' : 'R$ 97,00';
            p.installment = applyDiscount ? 'ou 12x de R$ 7,34' : 'ou 12x de R$ 10,48';
            p.priceOriginal = 'R$ 97,00';
        } else if (p.id === 'pro') {
            p.prices = { BR: { annual: applyDiscount ? '137.90' : '197.00' }, EU: { annual: '32.00' } };
            p.price = applyDiscount ? 'R$ 137,90' : 'R$ 197,00';
            p.installment = applyDiscount ? 'ou 12x de R$ 14,92' : 'ou 12x de R$ 21,31';
            p.priceOriginal = 'R$ 197,00';
        } else if (p.id === 'elite') {
            p.prices = { BR: { annual: applyDiscount ? '272.30' : '389.00' }, EU: { annual: '62.00' } };
            p.price = applyDiscount ? 'R$ 272,30' : 'R$ 389,00';
            p.installment = applyDiscount ? 'ou 12x de R$ 29,47' : 'ou 12x de R$ 42,09';
            p.priceOriginal = 'R$ 389,00';
        }
        
        // If not discounted, don't show the original price badge trick
        if (!applyDiscount) {
            delete p.priceOriginal;
        }

        setPlan(p);
      }
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
      {errorMsg && <div style={{position:"fixed",top:0,left:0,zIndex:9999,background:"red",color:"white",padding:20,width:"100%"}}>{errorMsg}</div>}
      <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />
      <ErrorBoundary>
        <CheckoutModal
        plan={plan}
        onClose={() => { window.location.href = '/'; }}
        onSuccess={() => { window.location.href = '/'; }}
      />
      </ErrorBoundary>
    </>
  );
}
