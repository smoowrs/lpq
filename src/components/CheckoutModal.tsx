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
        if (error) {
            toast.error(error.message || 'Erro no pagamento');
        } else {
            onSuccess();
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <PaymentElement
                onChange={handlePaymentElementChange}
                options={{
                    layout: 'tabs',
                    wallets: { applePay: 'never', googlePay: 'never' },
                    link: { email: 'never' },
                    terms: { card: 'never' }
                }}
            />

            {/* Terms */}
            <label className="flex items-center gap-3 cursor-pointer py-1">
                <div className="relative flex items-center shrink-0">
                    <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 transition-all checked:bg-[#2934FF] checked:border-[#2934FF]"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <Icons.Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5" />
                </div>
                <span className="text-[12px] text-slate-500 leading-snug">
                    Ao fornecer os seus dados, você permite que a Stripe faça a cobrança no seu cartão de acordo com os seus termos.
                </span>
            </label>

            <button
                type="submit"
                disabled={loading || !stripe || !agreedToTerms}
                className="w-full h-[54px] bg-[#4D5BFF] hover:bg-[#3A48FF] text-white rounded-2xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4D5BFF]/20"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>Comprar <Icons.ArrowRight className="w-4 h-4" /></>
                )}
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
                
                // Pass payer info derived from Apple Pay to the backend if needed
                const secret = await fetchSecret(ev.payerEmail, ev.payerName);
                if (!secret) throw new Error("Falha ao gerar o token de pagamento.");
                
                const confirmFn = secret.startsWith('seti_')
                    ? stripe.confirmCardSetup.bind(stripe)
                    : stripe.confirmCardPayment.bind(stripe);
                const { error } = await confirmFn(secret, { payment_method: ev.paymentMethod.id });
                if (error) { ev.complete('fail'); toast.error(error.message || 'Erro no pagamento'); }
                else { ev.complete('success'); onSuccess(); }
            } catch (err: any) {
                ev.complete('fail');
                toast.error(err.message || 'Erro inesperado');
            }
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
        if (!cpf.replace(/\D/g, '')) { toast.error('Informe seu CPF para continuar'); return; }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && (!guestEmail || !guestName)) { toast.error('Informe seu nome e e-mail'); return; }
        setLoading(true); setError(null);
        try {
            const res = await fetch(`${SUPABASE_URL}/functions/v1/gerar-pix`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ plan, cpf, userId: session?.user?.id, email: guestEmail, name: guestName, coupon: couponCode || undefined }),
            });
            const responseText = await res.text();
            if (!res.ok) {
                const errBody = (() => { try { return JSON.parse(responseText); } catch { return {}; } })();
                throw new Error(`Erro ${res.status}: ${errBody?.message || errBody?.error || responseText}`);
            }
            const data = JSON.parse(responseText);
            if (data?.error) throw new Error(data.error);
            setPixData(data);
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido');
            toast.error("Erro ao gerar PIX: " + (err.message || 'Erro desconhecido'));
        } finally { setLoading(false); }
    };

    const checkPaymentStatus = async () => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || SUPABASE_ANON_KEY;
            const res = await fetch(`${SUPABASE_URL}/functions/v1/check-pix-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
                body: JSON.stringify({ id: pixData?.id }),
            });
            const data = await res.json();
            if (data?.status === 'approved') { onSuccess(); return true; }
            return false;
        } catch { return false; }
    };

    const copyPix = () => {
        if (pixData?.payload) {
            navigator.clipboard.writeText(pixData.payload);
            setCopiedMessage(true);
            setTimeout(() => setCopiedMessage(false), 2000);
        }
    };

    const qrCodeImg = pixData?.qrCode ||
        (pixData?.payload ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.payload)}` : null);

    if (loading) return (
        <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-[#4D5BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Gerando QR Code...</p>
        </div>
    );

    if (error) return (
        <div className="py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <Icons.X className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-slate-800 font-bold text-sm mb-1">Erro ao gerar PIX</p>
            <p className="text-slate-500 text-xs mb-4">{error}</p>
            <button onClick={handleGeneratePix} className="px-5 py-2.5 bg-[#4D5BFF] text-white rounded-xl font-bold text-sm">Tentar Novamente</button>
        </div>
    );

    if (pixData) return (
        <div className="space-y-5 text-center">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 inline-block mx-auto shadow-sm">
                {qrCodeImg
                    ? <img src={qrCodeImg} alt="PIX QR Code" className="w-44 h-44" />
                    : <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">QR indisponível</div>
                }
            </div>
            <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Código PIX Copia e Cola</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2 items-center relative overflow-hidden">
                    <p className="text-[10px] text-slate-700 truncate text-left flex-1 font-mono">{pixData.payload}</p>
                    <button onClick={copyPix} className="p-1.5 bg-[#4D5BFF] text-white rounded-lg hover:bg-[#3A48FF] transition-colors shrink-0">
                        <Icons.Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedMessage && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex items-center gap-2 text-[#4D5BFF] font-black text-[10px] uppercase tracking-widest">
                                <Icons.Check className="w-4 h-4" />
                                <span>Código Pix Copiado!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-emerald-700">Aguardando Pagamento</span>
                </div>
                <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-100">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            {/* PIX info card */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <Icons.Pix className="w-9 h-9 object-contain" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-slate-900">PIX</h4>
                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                        O acesso será liberado instantaneamente após a confirmação do pagamento.
                    </p>
                </div>
            </div>

            {/* CPF */}
            <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">CPF do Titular</label>
                <input
                    type="text"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-base text-slate-900 placeholder-slate-400 focus:border-[#4D5BFF] focus:ring-2 focus:ring-[#4D5BFF]/10 outline-none transition-all"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                />
            </div>

            {/* Terms */}
            <label className="flex items-center gap-3 cursor-pointer py-1">
                <div className="relative flex items-center shrink-0">
                    <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 transition-all checked:bg-[#2934FF] checked:border-[#2934FF]"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <Icons.Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5" />
                </div>
                <span className="text-[12px] text-slate-500 leading-snug">
                    Ao fornecer os seus dados, você permite que realizemos a cobrança de acordo com os nossos termos.
                </span>
            </label>

            <button
                onClick={handleGeneratePix}
                disabled={loading || !agreedToTerms}
                className="w-full h-[54px] bg-[#4D5BFF] hover:bg-[#3A48FF] text-white rounded-2xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4D5BFF]/20"
            >
                Pagar Agora <Icons.ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

/* ─── APPMAX CC (12x) ──────────────────────────────────────────── */
const AppmaxCCPayment = ({ plan, onSuccess }: any) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ card_number: '', card_name: '', card_expiry: '', card_cvv: '', cpf: '', installments: '12' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProcessPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreedToTerms) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Você precisa estar logado');
            const data = await invokeFn('process-appmax-cc', { plan, paymentData: formData }, session.access_token);
            if (data?.error) throw new Error(data.error || 'Erro ao processar cartão');
            if (data?.success) { toast.success('Pagamento processado!'); onSuccess(); }
            else throw new Error(data?.message || 'Falha no processamento');
        } catch (err: any) {
            toast.error(err.message || 'Erro ao processar pagamento');
        } finally { setLoading(false); }
    };

    const inputClass = "w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-base text-slate-900 placeholder-slate-400 focus:border-[#4D5BFF] focus:ring-2 focus:ring-[#4D5BFF]/10 outline-none transition-all";
    const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleProcessPayment} className="space-y-4">
            <div>
                <label className={labelClass}>Nome no Cartão</label>
                <input name="card_name" required className={inputClass} placeholder="Como está no cartão" value={formData.card_name} onChange={handleInputChange} />
            </div>
            <div>
                <label className={labelClass}>CPF do Titular</label>
                <input name="cpf" required className={inputClass} placeholder="000.000.000-00" value={formData.cpf} onChange={handleInputChange} />
            </div>
            <div>
                <label className={labelClass}>Número do Cartão</label>
                <input name="card_number" required className={inputClass} placeholder="0000 0000 0000 0000" value={formData.card_number} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Validade</label>
                    <input name="card_expiry" required className={inputClass} placeholder="MM/AA" value={formData.card_expiry} onChange={handleInputChange} />
                </div>
                <div>
                    <label className={labelClass}>CVV</label>
                    <input name="card_cvv" required className={inputClass} placeholder="000" value={formData.card_cvv} onChange={handleInputChange} />
                </div>
            </div>
            <div>
                <label className={labelClass}>Parcelas</label>
                <select name="installments" className={inputClass} value={formData.installments} onChange={handleInputChange}>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}x de R$ {(parseFloat(plan.prices.BR.annual.replace(',', '.')) / (i + 1)).toFixed(2).replace('.', ',')}</option>
                    ))}
                </select>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center mt-0.5 shrink-0">
                    <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 transition-all checked:bg-[#2934FF] checked:border-[#2934FF]"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <Icons.Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5" />
                </div>
                <span className="text-[12px] text-slate-500 leading-snug">Concordo com os Termos de Serviço.</span>
            </label>

            <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full h-[54px] bg-[#4D5BFF] hover:bg-[#3A48FF] text-white rounded-2xl font-bold text-base transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-[#4D5BFF]/20"
            >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Comprar <Icons.ArrowRight className="w-4 h-4" /></>}
            </button>
        </form>
    );
};

/* ─── MAIN CHECKOUT COMPONENT ──────────────────────────────────── */
export const CheckoutModal = ({ plan, onClose, onSuccess }: { plan: any, onClose: () => void, onSuccess: () => void }) => {
    const isAnnual = plan.billingCycle === 'annual';
    const currencySymbol = plan.region === 'EU' ? '€' : 'R$';
    const region = plan.region || 'BR';

    const [method, setMethod] = useState<'cc' | 'pix' | 'cc_appmax' | 'apple_pay'>(plan.defaultMethod || (region === 'BR' ? 'cc_appmax' : 'cc'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [stripeError, setStripeError] = useState<string | null>(null);
    const [isPaymentApproved, setIsPaymentApproved] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(true);

    const [step, setStep] = useState<1 | 2>(1);
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmailError, setGuestEmailError] = useState('');
    const [guestNameError, setGuestNameError] = useState('');
    const [couponCode] = useState('');
    const [appliedCouponInfo, setAppliedCouponInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [paymentRequest, setPaymentRequest] = useState<any>(null);

    /* Price calculations */
    const baseTotal = plan.prices?.[region]?.annual || plan.prices?.[region]?.monthly || '0';
    const baseTotalNum = parseFloat(baseTotal.replace(',', '.'));
    const finalPriceNum = appliedCouponInfo?.percentOff ? baseTotalNum * (1 - appliedCouponInfo.percentOff / 100) : baseTotalNum;
    
    const displayPrice = finalPriceNum;
    const displayPriceStr = displayPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const monthly12x = region === 'BR' ? (finalPriceNum / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : null;

    const handleLocalSuccess = async () => {
        setIsPaymentApproved(true);
        try {
            const priceStr = baseTotal;
            const value = priceStr ? parseFloat(priceStr.replace(',', '.')) : 0;
            const userData = {
                email: guestEmail,
                firstName: guestName ? guestName.split(' ')[0] : undefined,
                lastName: guestName ? guestName.split(' ').slice(1).join(' ') : undefined,
            };
            trackPurchase(plan.label || plan.id, value, region === 'EU' ? 'EUR' : 'BRL', undefined, userData);
        } catch {}

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || SUPABASE_ANON_KEY;
            const activatePayload: any = { plan: plan.id, billingCycle: plan.billingCycle || 'monthly', grantCredits: true };
            if (session?.user?.id) { activatePayload.userId = session.user.id; }
            else { activatePayload.email = guestEmail; activatePayload.name = guestName; }
            await fetch(`${SUPABASE_URL}/functions/v1/activate-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
                body: JSON.stringify(activatePayload),
            });
        } catch {}
        onSuccess();
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
            if (session) setStep(2);
        });
        try {
            const priceStr = plan.prices?.[region]?.annual || plan.prices?.[region]?.monthly;
            const value = priceStr ? parseFloat(priceStr.replace(',', '.')) : 0;
            trackInitiateCheckout(plan.label || plan.id, value, region === 'EU' ? 'EUR' : 'BRL');
        } catch {}
    }, []);

    useEffect(() => {
        if (step === 2 && method === 'cc') { fetchClientSecret(); }
    }, [step, method]);

    // Prevent body scroll and forcefully make Safari bars white
    useEffect(() => {
        document.documentElement.classList.add('checkout-open');
        
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        let originalThemeColor: string | null = null;
        if (metaTheme) {
            originalThemeColor = metaTheme.getAttribute('content');
            metaTheme.setAttribute('content', '#ffffff');
        } else {
            metaTheme = document.createElement('meta');
            metaTheme.setAttribute('name', 'theme-color');
            metaTheme.setAttribute('content', '#ffffff');
            document.head.appendChild(metaTheme);
        }

        return () => { 
            document.documentElement.classList.remove('checkout-open');
            if (metaTheme) {
                if (originalThemeColor) metaTheme.setAttribute('content', originalThemeColor);
                else metaTheme.remove();
            }
        };
    }, []);

    // Apple Pay paymentRequest
    useEffect(() => {
        if (stripePromise) {
            stripePromise.then(stripe => {
                if (!stripe) return;
                const amountStr = plan.prices[region].annual || plan.prices[region].monthly;
                const amount = parseInt(amountStr.replace(/[.,]/g, ''));
                const pr = stripe.paymentRequest({
                    country: region === 'EU' ? 'PT' : 'BR',
                    currency: region === 'EU' ? 'eur' : 'brl',
                    total: { label: `Plano ${plan.label} - Connect Academy`, amount },
                    requestPayerName: true,
                    requestPayerEmail: true,
                });
                pr.canMakePayment().then(result => { if (result) setPaymentRequest(pr); });
            }).catch(() => {});
        }
    }, [plan]);

    const fetchClientSecret = async (emailOverride?: string | any, nameOverride?: string | any) => {
        setLoading(true); setClientSecret(null); setStripeError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const isCredits = plan.id.startsWith('cred_');
            const isOneTime = isCredits || plan.id === 'vitalicio' || plan.id === 'elite' || plan.billingCycle === 'one-time';
            const functionName = isOneTime ? 'create-stripe-payment-intent' : 'create-stripe-subscription';
            
            // Safety check: if called as event handler, arguments might be event objects
            const emailFromArg = typeof emailOverride === 'string' ? emailOverride : undefined;
            const nameFromArg = typeof nameOverride === 'string' ? nameOverride : undefined;

            // Prefer the email from overrides (e.g. Apple Pay), then the logged-in session, then the manual input
            const finalEmail = emailFromArg || session?.user?.email || guestEmail;
            const finalName = nameFromArg || session?.user?.user_metadata?.full_name || guestName || 'Usuário';

            const payload = isOneTime ? {
                planId: plan.id, 
                email: finalEmail, 
                name: finalName,
                amount: plan.prices[region].annual || plan.prices[region].monthly,
                region, coupon: couponCode || undefined
            } : {
                planId: plan.id, 
                billingCycle: plan.billingCycle, 
                trialDays: plan.trialDays,
                email: finalEmail, 
                name: finalName || finalEmail.split('@')[0], // Fallback name
                region, 
                coupon: couponCode || undefined
            };
            const data = await invokeFn(functionName, payload, session?.access_token || 'null');
            if (data?.error) throw new Error(data.error || 'Erro ao iniciar checkout');
            if (!data?.clientSecret) throw new Error('Client secret não retornado');
            setClientSecret(data.clientSecret);
            if (data?.appliedCoupon) { setAppliedCouponInfo(data.appliedCoupon); toast.success(`Cupom aplicado!`); }
            return data.clientSecret;
        } catch (err: any) {
            setStripeError(err.message || 'Erro desconhecido');
            toast.error("Erro ao iniciar checkout: " + (err.message || 'Erro desconhecido'));
            return null;
        } finally { setLoading(false); }
    };

    const handleStep1Continue = () => {
        let hasError = false;
        if (!guestName.trim() || guestName.trim().length < 2) { setGuestNameError('Informe seu nome completo'); hasError = true; } else { setGuestNameError(''); }
        if (!guestEmail.includes('@') || !guestEmail.includes('.')) { setGuestEmailError('Informe um e-mail válido'); hasError = true; } else { setGuestEmailError(''); }
        
        if (!hasError) {
            try {
                const priceStr = plan.prices?.[region]?.annual || plan.prices?.[region]?.monthly;
                const value = priceStr ? parseFloat(priceStr.replace(',', '.')) : 0;
                trackLead(plan.label || plan.id, value, region === 'EU' ? 'EUR' : 'BRL', { 
                    email: guestEmail, 
                    firstName: guestName ? guestName.split(' ')[0] : undefined 
                });
            } catch {}
            setStep(2);
        }
    };

    const billingLabelMap: Record<string, string> = {
        'trimestral': 'Trimestral',
        'annual': 'Anual',
        'one-time': 'Pagamento Único'
    };
    const billingLabel = billingLabelMap[plan.billingCycle] || 'Assinatura';

    // Strip emojis from plan label
    const cleanLabel = (plan.label || '').replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}🥇🌏🪙💙]/gu, '').trim();

    return createPortal(
        /* Fullscreen overlay — matches app style */
        <div className="fixed inset-0 z-[300] bg-white flex flex-col" style={{ overflowY: 'auto', height: '100dvh' }}>

            {/* Success Screen */}
            {isPaymentApproved && (
                <div className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 mb-6">
                        <img src="https://i.postimg.cc/8CypNtWj/IMG-3409.gif" className="w-full h-full object-contain" alt="Success" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Pagamento Aprovado!</h2>
                    <p className="text-sm text-slate-500 font-medium mb-8">
                        {!isAuthenticated
                            ? 'Sua conta foi criada! Verifique seu e-mail para obter os dados de acesso.'
                            : (plan.id.startsWith('cred_') ? 'Seus créditos foram adicionados.' : 'Sua assinatura foi ativada com sucesso!')
                        }
                    </p>
                    <button
                        onClick={() => {
                            onSuccess(); onClose();
                            if (isAuthenticated) window.location.hash = plan.id.startsWith('cred_') ? '#ai' : '#profile';
                            else window.location.hash = '#login';
                        }}
                        className="h-14 px-10 bg-[#4D5BFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {isAuthenticated ? 'Começar Agora' : 'Fazer Login'}
                    </button>
                </div>
            )}

            {/* Apple Pay handler */}
            {paymentRequest && (
                <ApplePayHandler paymentRequest={paymentRequest} stripePromise={stripePromise} fetchSecret={fetchClientSecret} onSuccess={handleLocalSuccess} />
            )}

            {/* ── STICKY HEADER ── */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
                {/* Top bar */}
                <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between relative">
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-400"
                    >
                        <Icons.ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <img 
                            src="https://i.postimg.cc/Wz5JsrXh/LOGONE_2.png" 
                            alt="Connect Academy" 
                            className="h-[22px] object-contain"
                        />
                    </div>

                </div>
            </div>

            {/* ── ORDER SUMMARY ── */}
            <div className="bg-[#F8FAFC] border-b border-slate-100">
                <div className="max-w-lg mx-auto">
                    <button
                        onClick={() => setShowOrderDetails(v => !v)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-700 transition-colors"
                    >
                        {showOrderDetails ? 'OCULTAR DETALHES' : 'MOSTRAR DETALHES'}
                        <svg className={`w-3 h-3 transition-transform ${showOrderDetails ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
                    </button>

                    {showOrderDetails && (
                        <div className="px-5 pb-5">
                            {/* Consolidated Plan & Price row */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 shadow-sm flex items-center justify-center shrink-0">
                                        <img src="https://i.postimg.cc/Cx0Wn1pW/drone.webp" alt="" className="w-8 h-8 object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">RESUMO DO PEDIDO</p>
                                        <p className="text-sm font-black text-slate-900">Plano {cleanLabel}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="bg-[#22c55e]/10 text-[#22c55e] text-[9px] px-1.5 py-0.5 rounded font-black border border-[#22c55e]/20">40% OFF</span>
                                        <span className="text-[9px] font-bold text-[#4D5BFF] uppercase tracking-wide leading-none">{billingLabel}</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-900 leading-none">{currencySymbol} {displayPriceStr}</span>
                                </div>
                            </div>

                            {region === 'BR' && method === 'cc_appmax' && monthly12x && (
                                <div className="mt-3 border-t border-slate-200/60 pt-2 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-500">Parcelamento</span>
                                    <span className="text-[11px] font-bold text-slate-900">12x {currencySymbol} {monthly12x}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-lg mx-auto px-5 pt-6 pb-6">

                    {/* Step indicator */}
                    {!isAuthenticated && (
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#4D5BFF]' : 'text-slate-400'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step > 1 ? 'border-[#4D5BFF] bg-[#4D5BFF] text-white' : step === 1 ? 'border-[#4D5BFF] bg-[#4D5BFF] text-white' : 'border-slate-200 text-slate-400'}`}>
                                    {step > 1 ? <Icons.Check className="w-3.5 h-3.5" /> : '1'}
                                </div>
                                <span className="text-sm font-semibold">Criar sua Conta</span>
                            </div>
                            <div className="flex-1 h-px bg-slate-200 mx-1" />
                            <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#4D5BFF]' : 'text-slate-400'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step === 2 ? 'border-[#4D5BFF] bg-[#4D5BFF] text-white' : 'border-slate-200 text-slate-400'}`}>
                                    2
                                </div>
                                <span className="text-sm font-semibold">Pagamento</span>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 1: IDENTIFICATION ── */}
                    {step === 1 && !isAuthenticated && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-1">Crie sua Conta</h2>
                                <p className="text-sm text-slate-500">Você receberá seus dados de acesso por e-mail.</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seu Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: João Silva"
                                        className={`w-full h-12 bg-white border rounded-xl px-4 text-base text-slate-900 placeholder-slate-400 focus:border-[#4D5BFF] focus:ring-2 focus:ring-[#4D5BFF]/10 outline-none transition-all shadow-sm ${guestNameError ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                                        value={guestName}
                                        onChange={(e) => { setGuestName(e.target.value); setGuestNameError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleStep1Continue()}
                                    />
                                    {guestNameError && <p className="text-[11px] text-red-500 mt-1 font-medium">{guestNameError}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seu E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="exemplo@email.com"
                                        className={`w-full h-12 bg-white border rounded-xl px-4 text-base text-slate-900 placeholder-slate-400 focus:border-[#4D5BFF] focus:ring-2 focus:ring-[#4D5BFF]/10 outline-none transition-all shadow-sm ${guestEmailError ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                                        value={guestEmail}
                                        onChange={(e) => { setGuestEmail(e.target.value); setGuestEmailError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleStep1Continue()}
                                    />
                                    {guestEmailError && <p className="text-[11px] text-red-500 mt-1 font-medium">{guestEmailError}</p>}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
                                <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                <p className="text-[12px] text-blue-700 leading-snug">
                                    Após o pagamento, você receberá um <strong>e-mail com seus dados de acesso</strong> para definir sua senha.
                                </p>
                            </div>

                            <button
                                onClick={handleStep1Continue}
                                className="w-full h-14 bg-[#4D5BFF] hover:bg-[#3A48FF] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#4D5BFF]/20 transition-all active:scale-[0.98]"
                            >
                                Continuar para Pagamento <Icons.ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2: PAYMENT ── */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Back button for guests */}
                            {!isAuthenticated && (
                                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 hover:text-slate-700 transition-colors -mt-2">
                                    <Icons.ChevronLeft className="w-4 h-4" /> Voltar
                                </button>
                            )}

                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-1">Método de Pagamento</h2>
                                <p className="text-sm text-slate-500">Escolha como deseja pagar.</p>
                            </div>

                            {/* Payment method tabs */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setMethod('cc'); fetchClientSecret(); }}
                                    className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-semibold border-2 ${method === 'cc' ? 'border-[#4D5BFF] text-[#4D5BFF] bg-white shadow-sm' : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'}`}
                                >
                                    <Icons.CreditCard className="w-4 h-4" />
                                    Cartão
                                </button>

                                {region === 'BR' && (
                                    <button
                                        onClick={() => setMethod('cc_appmax')}
                                        className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-semibold border-2 ${method === 'cc_appmax' ? 'border-[#4D5BFF] text-[#4D5BFF] bg-white shadow-sm' : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'}`}
                                    >
                                        <Icons.CreditCard className="w-4 h-4" />
                                        12x
                                    </button>
                                )}

                                {plan.region !== 'EU' && (
                                    <button
                                        onClick={() => setMethod('pix')}
                                        className={`flex-1 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${method === 'pix' ? 'border-[#4D5BFF] bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <Icons.Pix className="h-5 w-auto object-contain" />
                                    </button>
                                )}

                                {paymentRequest && (
                                    <button
                                        onClick={() => { setMethod('apple_pay'); paymentRequest.show(); }}
                                        className="flex-1 h-12 rounded-xl flex items-center justify-center gap-1.5 bg-black text-white font-bold text-sm transition-all hover:opacity-90 border-2 border-black"
                                    >
                                        <Icons.Apple className="w-4 h-4" />
                                        Pay
                                    </button>
                                )}
                            </div>

                            {/* Payment content area */}
                            <div>
                                {method === 'cc' ? (
                                    stripeError ? (
                                        <div className="py-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                                                <Icons.X className="w-6 h-6 text-red-500" />
                                            </div>
                                            <p className="text-slate-800 font-bold mb-1">Erro no checkout</p>
                                            <p className="text-slate-500 text-sm mb-4">{stripeError}</p>
                                            <button onClick={() => fetchClientSecret()} className="px-5 py-2.5 bg-[#4D5BFF] text-white rounded-xl font-bold text-sm">
                                                Tentar Novamente
                                            </button>
                                        </div>
                                    ) : clientSecret ? (
                                        <Elements stripe={stripePromise} options={{
                                            clientSecret,
                                            appearance: {
                                                theme: 'stripe',
                                                variables: {
                                                    colorPrimary: '#4D5BFF',
                                                    colorBackground: '#ffffff',
                                                    colorText: '#0f172a',
                                                    borderRadius: '12px',
                                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                                    spacingUnit: '4px',
                                                    fontSizeBase: '15px',
                                                },
                                                rules: {
                                                    '.Input': {
                                                        borderColor: '#e2e8f0',
                                                        padding: '12px 14px',
                                                        fontSize: '15px',
                                                        backgroundColor: '#f8fafc',
                                                        boxShadow: 'none',
                                                    },
                                                    '.Input:focus': {
                                                        borderColor: '#4D5BFF',
                                                        boxShadow: '0 0 0 3px rgba(77,91,255,0.12)',
                                                    },
                                                    '.Label': {
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.08em',
                                                        color: '#64748b',
                                                        marginBottom: '6px',
                                                    }
                                                }
                                            }
                                        }}>
                                            <StripeForm
                                                plan={plan}
                                                onCancel={onClose}
                                                onSuccess={handleLocalSuccess}
                                                isSetupIntent={clientSecret?.startsWith('seti_')}
                                            />
                                        </Elements>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <div className="w-8 h-8 border-2 border-[#4D5BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                            <p className="text-slate-500 text-sm">Carregando...</p>
                                        </div>
                                    )
                                ) : method === 'apple_pay' ? (
                                    <div className="py-12 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                                            <Icons.Apple className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-slate-900 font-bold mb-2">Aguardando Apple Pay</p>
                                        <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">
                                            Complete a transação na janela que foi aberta na sua tela.
                                        </p>
                                    </div>
                                ) : method === 'cc_appmax' ? (
                                    <AppmaxCCPayment plan={plan} onCancel={onClose} onSuccess={handleLocalSuccess} />
                                ) : (
                                    <PixPayment plan={plan} onCancel={onClose} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} couponCode={couponCode} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── FOOTER LOGOS — SCROLLABLE (Step 2 only) ── */}
                    {step === 2 && (
                        <div className="max-w-lg mx-auto px-5 flex flex-col items-center gap-2 pb-12 pt-4">
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <img
                                    src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png"
                                    alt="Payment Methods"
                                    className="h-[30px] w-auto object-contain opacity-50 grayscale"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── FIXED FOOTER LOGOS — STICKY (Step 1 only) ── */}
            {step === 1 && (
                <div className="bg-white border-t border-slate-100 py-3 scroll-hidden" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 20px))' }}>
                    <div className="max-w-lg mx-auto px-5 flex flex-col items-center gap-2">
                        <div className="flex items-center justify-center gap-4 flex-wrap mt-1">
                            <img
                                src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png"
                                alt="Payment Methods"
                                className="h-[30px] w-auto object-contain opacity-50 grayscale"
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="h-[env(safe-area-inset-bottom,40px)] bg-white w-full border-t border-slate-50 shrink-0" />
            )}
        </div>,
        document.body
    );
};
