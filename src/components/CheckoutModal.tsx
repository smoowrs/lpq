import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from './Icons';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { trackInitiateCheckout, trackPurchase, trackAddPaymentInfo, trackLead } from '../services/facebookPixel';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://auth.connectacademy.com.br';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeWZ6cGppdmVzcmJjeGlsbXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTE1ODUsImV4cCI6MjA4NjIyNzU4NX0.4q3uB1PrFPbaH4lunmQ6wZU0jNABg2D0i45JRHXo_K0';

async function invokeFn(fnName: string, body: any, token: string): Promise<any> {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(body),
    });
    return res.json();
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51Q50BUCWGI5d7s18Jd0BDDrzEC1zsFjNuUdD2l1kpKYNQLk3RhvT1y4GvDfRWqr06ANPDgKh0NeTsIOw0jhaHWW600HjVSKT37');

/* ─── STRIPE CARD FORM ─────────────────────────────────────────── */
const StripeForm = ({ plan, onCancel, onSuccess, isSetupIntent }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const hasFiredAddPaymentInfo = React.useRef(false);

    const handlePaymentElementChange = () => {
        if (!hasFiredAddPaymentInfo.current) {
            hasFiredAddPaymentInfo.current = true;
            try { trackAddPaymentInfo(plan?.label || plan?.id || 'unknown'); } catch {}
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !agreedToTerms) return;
        setLoading(true);
        const confirmParams = { return_url: window.location.origin + window.location.pathname };
        let error;
        if (isSetupIntent) {
            const result = await stripe.confirmSetup({ elements, confirmParams, redirect: 'if_required' });
            error = result.error;
        } else {
            const result = await stripe.confirmPayment({ elements, confirmParams, redirect: 'if_required' });
            error = result.error;
        }
        if (error) { toast.error(error.message || 'Erro no pagamento'); }
        else { onSuccess(); }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement
                onChange={handlePaymentElementChange}
                options={{
                    layout: 'tabs',
                    wallets: { applePay: 'never', googlePay: 'never' },
                    link: { email: 'never' },
                    terms: { card: 'never' }
                }}
            />

            <label className="flex items-start gap-3 cursor-pointer py-1">
                <div className="relative flex items-center shrink-0 mt-0.5">
                    <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-200 transition-all checked:bg-[#2934FF] checked:border-[#2934FF]"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <Icons.Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5" />
                </div>
                <span className="text-[12px] text-slate-400 leading-snug">
                    Ao fornecer os seus dados, você permite que a Stripe faça a cobrança no seu cartão de acordo com os seus termos.
                </span>
            </label>

            <button
                type="submit"
                disabled={loading || !stripe || !agreedToTerms}
                className="w-full h-14 bg-[#A3AFFF] hover:bg-[#8F9FFF] text-white rounded-xl font-bold text-base transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
            >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Comprar <Icons.ArrowRight className="w-4 h-4" /></>}
            </button>
        </form>
    );
};

/* ─── APPLE PAY HANDLER ─────────────────────────────────────────── */
const ApplePayHandler = ({ paymentRequest, stripePromise, fetchSecret, onSuccess }: any) => {
    useEffect(() => {
        if (!paymentRequest) return;
        const handlePaymentMethod = async (ev: any) => {
            try {
                const stripe = await stripePromise;
                if (!stripe) throw new Error("Stripe not init");
                const secret = await fetchSecret(ev.payerEmail, ev.payerName);
                if (!secret) throw new Error("Falha ao gerar o token de pagamento.");
                const confirmFn = secret.startsWith('seti_') ? stripe.confirmCardSetup.bind(stripe) : stripe.confirmCardPayment.bind(stripe);
                const { error } = await confirmFn(secret, { payment_method: ev.paymentMethod.id });
                if (error) { ev.complete('fail'); toast.error(error.message || 'Erro no pagamento'); }
                else { ev.complete('success'); onSuccess(); }
            } catch (err: any) { ev.complete('fail'); toast.error(err.message || 'Erro inesperado'); }
        };
        paymentRequest.on('paymentmethod', handlePaymentMethod);
        return () => { paymentRequest.off?.('paymentmethod', handlePaymentMethod); };
    }, [paymentRequest]);
    return null;
};

/* ─── PIX PAYMENT ─────────────────────────────────────────────── */
const PixPayment = ({ plan, onSuccess, guestEmail, guestName, couponCode }: any) => {
    const [pixData, setPixData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(1800);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [cpf, setCpf] = useState('');
    const [copiedMessage, setCopiedMessage] = useState(false);
    const hasFiredAddPaymentInfo = React.useRef(false);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(e.target.value);
        if (!hasFiredAddPaymentInfo.current && e.target.value.length > 0) {
            hasFiredAddPaymentInfo.current = true;
            try { trackAddPaymentInfo('PIX'); } catch {}
        }
    };

    useEffect(() => {
        if (!pixData) return;
        const statusInterval = setInterval(checkPaymentStatus, 5000);
        const timerInterval = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
        return () => { clearInterval(statusInterval); clearInterval(timerInterval); };
    }, [pixData]);

    const handleGeneratePix = async () => {
        if (!agreedToTerms) return;
        if (!cpf.replace(/\D/g, '')) { toast.error('Informe seu CPF'); return; }
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${SUPABASE_URL}/functions/v1/gerar-pix`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY },
                body: JSON.stringify({ plan, cpf, email: guestEmail, name: guestName, coupon: couponCode || undefined }),
            });
            const data = await res.json();
            if (data?.error) throw new Error(data.error);
            setPixData(data);
        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };

    const checkPaymentStatus = async () => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const res = await fetch(`${SUPABASE_URL}/functions/v1/check-pix-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionData?.session?.access_token || SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY },
                body: JSON.stringify({ id: pixData?.id }),
            });
            const data = await res.json();
            if (data?.status === 'approved') onSuccess();
        } catch {}
    };

    if (loading) return <div className="py-12 text-center animate-pulse"><div className="w-8 h-8 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-3" /><p className="text-slate-400 text-xs">Gerando QR Code...</p></div>;

    if (pixData) return (
        <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 inline-block mx-auto shadow-sm">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.payload)}`} alt="PIX" className="w-44 h-44" />
            </div>
            <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 items-center relative group">
                    <p className="text-[11px] text-slate-500 truncate text-left flex-1 font-mono">{pixData.payload}</p>
                    <button onClick={() => { navigator.clipboard.writeText(pixData.payload); setCopiedMessage(true); setTimeout(() => setCopiedMessage(false), 2000); }} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"><Icons.Copy className="w-4 h-4" /></button>
                    {copiedMessage && <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl text-[#2934FF] font-bold text-xs">Copiado!</div>}
                </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Aguardando pagamento... {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div><label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">CPF do Titular</label><input type="text" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-5 text-base text-slate-900 outline-none focus:border-slate-300 transition-all" placeholder="000.000.000-00" value={cpf} onChange={handleCpfChange} maxLength={14} /></div>
            <label className="flex items-start gap-3 cursor-pointer py-1">
                <div className="relative flex items-center shrink-0 mt-0.5"><input type="checkbox" className="peer h-4 w-4 appearance-none rounded border border-slate-200 checked:bg-[#2934FF]" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} /><Icons.Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 left-0.5" /></div>
                <span className="text-[12px] text-slate-400 leading-snug">Concordo com os termos do Pix.</span>
            </label>
            <button onClick={handleGeneratePix} disabled={loading || !agreedToTerms} className="w-full h-14 bg-[#A3AFFF] text-white rounded-xl font-bold text-base transition-all disabled:opacity-40">Gerar PIX</button>
        </div>
    );
};

/* ─── APPMAX CC (12x) ──────────────────────────────────────────── */
const AppmaxCCPayment = ({ plan, onSuccess }: any) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ card_number: '', card_name: '', card_expiry: '', card_cvv: '', cpf: '', installments: '12' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const handleInputChange = (e: any) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleProcessPayment = async (e: any) => {
        e.preventDefault(); if (!agreedToTerms) return; setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await invokeFn('process-appmax-cc', { plan, paymentData: formData }, session?.access_token || '');
            if (data?.success) onSuccess(); else throw new Error(data?.message || 'Erro');
        } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
    };
    const inputStyle = "w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-5 text-base text-slate-900 outline-none focus:border-slate-300 transition-all";
    const labelStyle = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2";
    return (
        <form onSubmit={handleProcessPayment} className="space-y-4 animate-in fade-in duration-300">
            <div><label className={labelStyle}>Nome no Cartão</label><input name="card_name" required className={inputStyle} value={formData.card_name} onChange={handleInputChange} /></div>
            <div><label className={labelStyle}>CPF</label><input name="cpf" required className={inputStyle} value={formData.cpf} onChange={handleInputChange} /></div>
            <div><label className={labelStyle}>Parcelas</label><select name="installments" className={inputStyle} value={formData.installments} onChange={handleInputChange}>{[...Array(12)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}x de R$ {(parseFloat(plan.prices.BR.annual.replace(',', '.')) / (i + 1)).toFixed(2).replace('.', ',')}</option>))}</select></div>
            <button type="submit" disabled={loading || !agreedToTerms} className="w-full h-14 bg-[#A3AFFF] text-white rounded-xl font-bold">Comprar</button>
        </form>
    );
};

/* ─── MAIN CHECKOUT COMPONENT ──────────────────────────────────── */
export const CheckoutModal = ({ plan, onClose, onSuccess }: { plan: any, onClose: () => void, onSuccess: () => void }) => {
    const region = plan.region || 'BR';
    const currencySymbol = region === 'EU' ? '€' : 'R$';
    const [method, setMethod] = useState<'cc' | 'pix' | 'cc_appmax' | 'apple_pay'>(region === 'BR' ? 'cc_appmax' : 'cc');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [isPaymentApproved, setIsPaymentApproved] = useState(false);
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentRequest, setPaymentRequest] = useState<any>(null);

    const priceNum = parseFloat((plan.prices?.[region]?.annual || '0').replace(',', '.'));
    const priceStr = priceNum.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const originalPriceNum = (priceNum / 0.6);
    const originalPriceStr = originalPriceNum.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const monthly12x = (priceNum / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    const handleLocalSuccess = async () => {
        setIsPaymentApproved(true);
        trackPurchase(plan.label || plan.id, priceNum, region === 'EU' ? 'EUR' : 'BRL', undefined, { email: guestEmail, firstName: guestName.split(' ')[0] });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`${SUPABASE_URL}/functions/v1/activate-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY },
                body: JSON.stringify({ plan: plan.id, email: guestEmail, name: guestName }),
            });
        } catch {}
        onSuccess();
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => { setIsAuthenticated(!!session); if (session) setStep(2); });
        trackInitiateCheckout(plan.label || plan.id, priceNum, region === 'EU' ? 'EUR' : 'BRL');
        document.documentElement.classList.add('checkout-open');
        return () => { document.documentElement.classList.remove('checkout-open'); };
    }, []);

    const fetchClientSecret = async (emailOverride?: string) => {
        setClientSecret(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await invokeFn('create-stripe-payment-intent', { planId: plan.id, email: emailOverride || session?.user?.email || guestEmail, amount: plan.prices?.[region]?.annual, region }, session?.access_token || 'null');
            setClientSecret(data.clientSecret);
        } catch {}
    };

    useEffect(() => { if (step === 2 && method === 'cc') fetchClientSecret(); }, [step, method]);

    const handleStep1Continue = () => {
        if (!guestEmail.includes('@') || !guestName.length) { toast.error('Preencha os dados'); return; }
        trackLead(plan.label || plan.id, priceNum, region === 'EU' ? 'EUR' : 'BRL', { email: guestEmail, firstName: guestName.split(' ')[0] });
        setStep(2);
    };

    return createPortal(
        <div className="fixed inset-0 z-[300] bg-white flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Left Column: Summary */}
            <div className="w-full md:w-[42%] bg-[#F9FAFB] md:bg-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col overflow-y-auto shrink-0 relative">
                <div className="p-8 md:p-20 md:mt-4">
                    <button onClick={onClose} className="mb-14 hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-semibold text-sm">
                        <Icons.ChevronLeft className="w-4 h-4 translate-y-[1px]" />
                        <span>Voltar para a plataforma</span>
                    </button>

                    <div className="flex items-center gap-4 mb-20">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm border border-slate-50 flex items-center justify-center shrink-0">
                            <img src="https://i.postimg.cc/Cx0Wn1pW/drone.webp" alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">RESUMO DO PEDIDO</p>
                                <span className="text-[9px] bg-[#E8F8F0] text-[#22c55e] px-1.5 py-0.5 rounded font-black border border-[#22c55e]/10 uppercase">40% OFF</span>
                            </div>
                            <h2 className="text-xl md:text-[28px] font-bold text-slate-900 leading-tight">Plano {plan.label.replace(/[🥇🌏🪙💙]/g, '').trim()}</h2>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Pagamento Único</span>
                            <span className="text-sm font-bold text-slate-900">Anual</span>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Total</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">OU EM ATÉ 12X</p>
                            </div>
                            <div className="text-right space-y-4">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-300 line-through mb-1">{currencySymbol} {originalPriceStr}</span>
                                    <span className="block text-2xl md:text-3xl font-bold text-slate-900 leading-none">{currencySymbol} {priceStr}</span>
                                </div>
                                <span className="block text-xl md:text-2xl font-bold text-slate-900">{currencySymbol} {monthly12x}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Checkout */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto relative min-h-0">
                {isPaymentApproved && (
                    <div className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                        <div className="w-20 h-20 mb-6"><img src="https://i.postimg.cc/8CypNtWj/IMG-3409.gif" className="w-full h-full object-contain" alt="" /></div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Aprovado!</h2>
                        <p className="text-sm text-slate-500 mb-8 max-w-xs">Conta ativada com sucesso. Verifique seu e-mail para acesso.</p>
                        <button onClick={() => { onSuccess(); onClose(); window.location.hash = '#login'; }} className="h-14 px-10 bg-[#4D5BFF] text-white rounded-xl font-bold hover:scale-105 transition-all">Começar Agora</button>
                    </div>
                )}

                <div className="w-full max-w-xl mx-auto px-6 md:px-20 py-12 md:py-24">
                    {!isAuthenticated && (
                        <div className="flex items-center justify-center gap-12 mb-16">
                            <div className={`flex items-center gap-3 ${step === 1 ? 'text-[#2934FF]' : 'text-slate-300'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step > 1 ? 'bg-slate-50 text-slate-200 border-slate-100' : step === 1 ? 'border-[#2934FF] bg-white text-[#2934FF]' : 'border-slate-100 text-slate-200'}`}>{step > 1 ? <Icons.Check className="w-4 h-4" /> : '1'}</div>
                                <span className={`text-sm font-bold ${step > 1 ? 'text-slate-300 line-through decoration-2' : ''}`}>Identificação</span>
                            </div>
                            <div className="w-12 h-[2px] bg-slate-50 rounded-full" />
                            <div className={`flex items-center gap-3 ${step === 2 ? 'text-[#2934FF]' : 'text-slate-300'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 2 ? 'border-[#2934FF] bg-[#2934FF] text-white' : 'border-slate-100 text-slate-200'}`}>2</div>
                                <span className="text-sm font-bold">Pagamento</span>
                            </div>
                        </div>
                    )}

                    {step === 1 && !isAuthenticated ? (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center md:text-left"><h2 className="text-3xl font-bold text-slate-900 mb-2">Crie sua conta</h2><p className="text-sm text-slate-500">Receba seus dados de acesso logo após a compra.</p></div>
                            <div className="space-y-6">
                                <div><label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Completo</label><input type="text" placeholder="João Silva" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-5 text-base text-slate-900 outline-none focus:border-slate-300 transition-all" value={guestName} onChange={e => setGuestName(e.target.value)} /></div>
                                <div><label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">E-mail para acesso</label><input type="email" placeholder="exemplo@email.com" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-5 text-base text-slate-900 outline-none focus:border-slate-300 transition-all" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} /></div>
                            </div>
                            <button onClick={handleStep1Continue} className="w-full h-16 bg-[#2934FF] hover:bg-[#1A25E5] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#2934FF]/10 transition-all">Próximo Passo <Icons.ArrowRight className="w-5 h-5 inline-block ml-1" /></button>
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-left"><h2 className="text-[32px] font-bold text-slate-900 mb-2">Método de Pagamento</h2><p className="text-sm text-slate-500">Escolha como deseja pagar.</p></div>
                            
                            <div className="flex gap-2.5">
                                <button onClick={() => {setMethod('cc'); fetchClientSecret();}} className={`flex-1 h-[52px] rounded-xl flex items-center justify-center gap-2 text-sm font-bold border-2 transition-all ${method === 'cc' ? 'border-[#2934FF] text-[#2934FF] bg-white' : 'border-slate-100 text-slate-400 bg-white'}`}><Icons.CreditCard className="w-4 h-4 translate-y-[-1px]" /> Cartão</button>
                                {region === 'BR' && <button onClick={() => setMethod('cc_appmax')} className={`flex-1 h-[52px] rounded-xl flex items-center justify-center gap-2 text-sm font-bold border-2 transition-all ${method === 'cc_appmax' ? 'border-[#2934FF] text-[#2934FF] bg-white' : 'border-slate-100 text-slate-400 bg-white'}`}><Icons.CreditCard className="w-4 h-4 translate-y-[-1px]" /> 12x</button>}
                                {region === 'BR' && <button onClick={() => setMethod('pix')} className={`flex-1 h-[52px] rounded-xl flex items-center justify-center border-2 transition-all ${method === 'pix' ? 'border-[#2934FF] bg-white' : 'border-slate-100 bg-white'}`}><Icons.Pix className="h-4 w-auto object-contain" /></button>}
                                <button className="flex-1 h-[52px] rounded-xl flex items-center justify-center bg-black text-white"><Icons.Apple className="w-5 h-5" /></button>
                            </div>

                            <div className="pt-2">
                                {method === 'cc' ? (
                                    clientSecret ? <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#2934FF', borderRadius: '12px' } } }}><StripeForm plan={plan} onSuccess={handleLocalSuccess} /></Elements> 
                                    : <div className="py-12 text-center animate-pulse"><div className="w-8 h-8 border-2 border-slate-100 border-t-slate-400 rounded-full animate-spin mx-auto mb-3" /><p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Preparando checkout...</p></div>
                                ) : method === 'cc_appmax' ? <AppmaxCCPayment plan={plan} onSuccess={handleLocalSuccess} /> : <PixPayment plan={plan} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} />}
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-12 grayscale opacity-40">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0"><Icons.Apple className="w-3.5 h-3.5 mt-[-2px]" /> Pay</div>
                                <Icons.CreditCard className="w-4 h-4" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Visa</span>
                                <Icons.Pix className="h-2.5 w-auto" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">G Pay</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
