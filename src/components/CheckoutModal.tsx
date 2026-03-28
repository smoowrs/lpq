import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from './Icons';
import { Button } from './UI';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { trackInitiateCheckout, trackPurchase, trackAddPaymentInfo } from '../services/facebookPixel';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://auth.connectacademy.com.br';
// JWT anon key (required for Edge Function gateway — the sb_publishable_ format is rejected)
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

const StripeForm = ({ plan, onCancel, onSuccess, isSetupIntent, paymentRequest }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !agreedToTerms) return;

        setLoading(true);
        const confirmParams = { return_url: window.location.origin + window.location.pathname };
        
        let error;
        if (isSetupIntent) {
            const result = await stripe.confirmSetup({
                elements,
                confirmParams,
                redirect: 'if_required'
            });
            error = result.error;
        } else {
             const result = await stripe.confirmPayment({
                elements,
                confirmParams,
                redirect: 'if_required'
            });
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Disable built-in wallets to avoid duplication with our custom Apple Pay tab */}
            <PaymentElement options={{
                layout: 'tabs',
                wallets: { applePay: 'never', googlePay: 'never' },
                link: { email: 'never' }
            }} />

            <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                        <input
                            type="checkbox"
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-200 transition-all checked:bg-primary checked:border-primary"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <Icons.Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5" />
                    </div>
                    <span className="text-[11px] text-slate-500 leading-tight">
                        Concordo com os <span className="underline decoration-slate-300 font-medium">Termos de Serviço</span> e a <span className="underline decoration-slate-300 font-medium">Política de Privacidade</span> da empresa <span className="text-slate-900 font-bold">Connect Academy LTDA.</span>
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={loading || !stripe || !agreedToTerms}
                    className="w-full h-[54px] bg-primary text-white rounded-xl font-black text-sm hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>Assinar <Icons.ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </form>
    );
};

// Invisible hook: listens to Apple Pay payment events and confirms via Stripe
const ApplePayHandler = ({ paymentRequest, stripePromise, fetchSecret, onSuccess }: any) => {
    useEffect(() => {
        if (!paymentRequest) return;

        const handlePaymentMethod = async (ev: any) => {
            try {
                const stripe = await stripePromise;
                if (!stripe) throw new Error("Stripe not init");

                const secret = await fetchSecret();
                if (!secret) throw new Error("Falha ao gerar o token de pagamento.");

                const confirmFn = secret.startsWith('seti_')
                    ? stripe.confirmCardSetup.bind(stripe)
                    : stripe.confirmCardPayment.bind(stripe);

                const { error } = await confirmFn(secret, {
                    payment_method: ev.paymentMethod.id
                });

                if (error) {
                    ev.complete('fail');
                    toast.error(error.message || 'Erro no pagamento');
                } else {
                    ev.complete('success');
                    onSuccess();
                }
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

const PixPayment = ({ plan, onCancel, onSuccess, guestEmail, guestName, couponCode }: any) => {
    const [pixData, setPixData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rawDebug, setRawDebug] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(1800);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [cpf, setCpf] = useState('');
    const [copiedMessage, setCopiedMessage] = useState(false);

    useEffect(() => {
        if (!pixData) return;
        // Poll for payment approval every 5s
        const statusInterval = setInterval(checkPaymentStatus, 5000);
        // Countdown every second
        const timerInterval = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
        return () => { clearInterval(statusInterval); clearInterval(timerInterval); };
    }, [pixData]);

    const handleGeneratePix = async () => {
        if (!agreedToTerms) return;
        if (!cpf.replace(/\D/g, '')) {
            toast.error('Informe seu CPF para continuar');
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session && (!guestEmail || !guestName)) {
            toast.error('Informe seu nome e e-mail no topo do formulário');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Use the anon key as Authorization Bearer — the gateway always accepts it.
            const res = await fetch(`${SUPABASE_URL}/functions/v1/gerar-pix`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    plan,
                    cpf,
                    userId: session?.user?.id,
                    email: guestEmail,
                    name: guestName,
                    coupon: couponCode || undefined
                }),
            });

            const responseText = await res.text();
            setRawDebug(`HTTP ${res.status}: ${responseText}`);

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
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async () => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || SUPABASE_ANON_KEY;
            
            const res = await fetch(`${SUPABASE_URL}/functions/v1/check-pix-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ id: pixData?.id }),
            });
            const data = await res.json();
            if (data?.status === 'approved') {
                onSuccess();
                return true;
            } else if (data?.error) {
                // Silently skip if not found — webhook will handle it or wait for manual close
                console.log("Status check error (silenced):", data.error);
            } else {
                // Silently wait for the next check
            }
            return false;
        } catch (err: any) {
            console.error('Check status error:', err);
            toast.error("Erro ao verificar status. Tente novamente.");
            return false;
        }
    };

    const copyPix = () => {
        if (pixData?.payload) {
            navigator.clipboard.writeText(pixData.payload);
            setCopiedMessage(true);
            setTimeout(() => setCopiedMessage(false), 2000);
        }
    };

    if (loading) return (
        <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-600 font-medium text-xs">Gerando QR Code...</p>
        </div>
    );

    if (error) return (
        <div className="py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <Icons.X className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-slate-700 font-bold text-sm mb-1">Erro ao gerar PIX</p>
            <p className="text-slate-500 text-xs mb-4 break-all">{error}</p>
            {rawDebug && (
                <pre className="text-[8px] text-left bg-slate-100 rounded p-2 mb-4 overflow-auto max-h-48 text-slate-700">{rawDebug}</pre>
            )}
            <button
                onClick={handleGeneratePix}
                className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary/90 transition-colors"
            >
                Tentar Novamente
            </button>
        </div>
    );

    const qrCodeImg = pixData?.qrCode ||
        (pixData?.payload ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.payload)}` : null);

    return (
        <div className="space-y-6 text-center">
            {pixData ? (
                <>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block mx-auto shadow-sm">
                        {qrCodeImg
                            ? <img src={qrCodeImg} alt="PIX QR Code" className="w-40 h-40" />
                            : <div className="w-40 h-40 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                                <span>QR indisponível</span>
                                {rawDebug && <pre className="text-[7px] text-left bg-slate-100 rounded p-1 overflow-auto max-h-32 w-full text-slate-600 whitespace-pre-wrap break-all">{rawDebug}</pre>}
                            </div>
                        }
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                            Código PIX Copia e Cola
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-2 items-center relative overflow-hidden">
                            <p className="text-[10px] text-slate-700 truncate text-left flex-1 font-mono">
                                {pixData.payload || 'Aguardando código...'}
                            </p>
                            <button onClick={copyPix} className="p-1.5 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                                <Icons.Copy className="w-3 h-3" />
                            </button>

                            {/* Blur Overlay for Copy Success */}
                            {copiedMessage && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center animate-fade-in z-10 transition-all duration-300">
                                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                        <Icons.Check className="w-4 h-4" />
                                        <span>Código Pix Copiado!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-emerald-700">Aguardando Pagamento</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-emerald-100">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                    {/* Botão 'Já Paguei' removido a pedido do usuário */}
                </>
            ) : (
                <div className="space-y-6">
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Icons.Pix className="w-8 h-8 object-contain" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Pagamento via PIX</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            O acesso será liberado instantaneamente após a confirmação do pagamento.
                        </p>
                    </div>

                    <div className="space-y-4 text-left">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CPF do Titular</label>
                            <input
                                type="text"
                                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                maxLength={14}
                            />
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-200 transition-all checked:bg-primary checked:border-primary"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                <Icons.Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5" />
                            </div>
                            <span className="text-[11px] text-slate-500 leading-tight">
                                Concordo com os <span className="underline decoration-slate-300 font-medium">Termos de Serviço</span> e a <span className="underline decoration-slate-300 font-medium">Política de Privacidade</span> da empresa <span className="text-slate-900 font-bold">Connect Academy LTDA.</span>
                            </span>
                        </label>

                        <button
                            onClick={handleGeneratePix}
                            disabled={loading || !agreedToTerms}
                            className="w-full h-[54px] bg-primary text-white rounded-xl font-black text-sm hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            Comprar
                            <Icons.ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AppmaxCCPayment = ({ plan, onCancel, onSuccess }: any) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        card_number: '',
        card_name: '',
        card_expiry: '',
        card_cvv: '',
        cpf: '',
        installments: '12'
    });
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
            if (data?.success) {
                toast.success('Pagamento processado com sucesso!');
                onSuccess();
            } else {
                throw new Error(data?.message || 'Falha no processamento');
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro ao processar pagamento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleProcessPayment} className="space-y-4">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-left">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nome no Cartão</label>
                        <input
                            name="card_name"
                            required
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="Como está no cartão"
                            value={formData.card_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CPF do Titular</label>
                        <input
                            name="cpf"
                            required
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Número do Cartão</label>
                        <input
                            name="card_number"
                            required
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="0000 0000 0000 0000"
                            value={formData.card_number}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Validade</label>
                            <input
                                name="card_expiry"
                                required
                                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="MM/AA"
                                value={formData.card_expiry}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CVV</label>
                            <input
                                name="card_cvv"
                                required
                                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="000"
                                value={formData.card_cvv}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Parcelas</label>
                        <select
                            name="installments"
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.installments}
                            onChange={handleInputChange}
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}x de R$ {(parseFloat(plan.prices.BR.annual.replace(',', '.')) / (i + 1)).toFixed(2).replace('.', ',')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group text-left">
                    <div className="relative flex items-center mt-1">
                        <input
                            type="checkbox"
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-200 transition-all checked:bg-primary checked:border-primary"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <Icons.Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5" />
                    </div>
                    <span className="text-[11px] text-slate-500 leading-tight">
                        Concordo com os <span className="underline font-medium">Termos de Serviço</span>.
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="w-full h-[54px] bg-primary text-white rounded-xl font-black text-sm hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg flex items-center justify-center gap-2"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Finalizar Assinatura'}
                </button>
            </div>
        </form>
    );
};

export const CheckoutModal = ({ plan, onClose, onSuccess }: { plan: any, onClose: () => void, onSuccess: () => void }) => {
    const isAnnual = plan.billingCycle === 'annual';
    const currencySymbol = plan.region === 'EU' ? '€' : 'R$';
    const [method, setMethod] = useState<'cc' | 'pix' | 'cc_appmax' | 'apple_pay'>(plan.defaultMethod || (isAnnual ? 'cc_appmax' : 'cc'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [stripeError, setStripeError] = useState<string | null>(null);
    const [verificationAttempts] = useState(0);
    const [isPaymentApproved, setIsPaymentApproved] = useState(false);

    // 2-step state (declared early so handleLocalSuccess can use them in closure)
    const [step, setStep] = useState<1 | 2>(1);
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmailError, setGuestEmailError] = useState('');
    const [guestNameError, setGuestNameError] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCouponInfo, setAppliedCouponInfo] = useState<any>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [loading, setLoading] = useState(false);



    // Called immediately after Stripe/Pix confirms payment
    const handleLocalSuccess = async () => {
        setIsPaymentApproved(true);
        const isCredits = plan.id?.startsWith('cred_');

        // Facebook Pixel: Purchase event
        try {
            const region = plan.region || 'BR';
            const priceStr = plan.billingCycle === 'annual' ? plan.prices?.[region]?.annual : plan.prices?.[region]?.monthly;
            const value = priceStr ? parseFloat(priceStr.replace(',', '.')) : 0;
            trackPurchase(plan.label || plan.id, value, region === 'EU' ? 'EUR' : 'BRL');
        } catch { /* non-critical */ }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || SUPABASE_ANON_KEY;

            // Activate plan OR add credits immediately — don't wait for the webhook
            const activatePayload: any = {
                plan: plan.id,
                billingCycle: plan.billingCycle || 'monthly',
                grantCredits: true,
            };

            if (session?.user?.id) {
                activatePayload.userId = session.user.id;
            } else {
                // Guest flow — lookup by email
                activatePayload.email = guestEmail;
                activatePayload.name = guestName;
            }

            const res = await fetch(`${SUPABASE_URL}/functions/v1/activate-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify(activatePayload),
            });

            const result = await res.json();
            if (result?.success) {
                console.log('[Checkout] Activated immediately:', result);
            } else {
                console.warn('[Checkout] activate-user returned:', result);
            }
        } catch (err) {
            console.warn('[Checkout] Immediate activation failed (webhook will handle it):', err);
        } finally {
            // Always call onSuccess regardless
            onSuccess();
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
            // If already logged in, skip step 1
            if (session) setStep(2);
        });
        // Facebook Pixel: InitiateCheckout when modal opens
        try {
            const region = plan.region || 'BR';
            const priceStr = plan.billingCycle === 'annual' ? plan.prices?.[region]?.annual : plan.prices?.[region]?.monthly;
            const value = priceStr ? parseFloat(priceStr.replace(',', '.')) : 0;
            trackInitiateCheckout(plan.label || plan.id, value, region === 'EU' ? 'EUR' : 'BRL');
        } catch { /* non-critical */ }
    }, []);

    // Fetch stripe secret when entering step 2 with cc method
    useEffect(() => {
        if (step === 2 && method === 'cc') {
            fetchClientSecret();
        }
    }, [step, method]);

    const fetchClientSecret = async () => {
        setLoading(true);
        setClientSecret(null);
        setStripeError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            const isCredits = plan.id.startsWith('cred_');
            const isOneTime = isCredits || plan.id === 'vitalicio';
            const region = plan.region || 'BR';
            const functionName = isOneTime ? 'create-stripe-payment-intent' : 'create-stripe-subscription';
            const payload = isOneTime ? {
                planId: plan.id,
                email: guestEmail,
                name: guestName,
                amount: isAnnual ? plan.prices[region].annual : plan.prices[region].monthly,
                region,
                coupon: couponCode || undefined
            } : {
                planId: plan.id,
                billingCycle: plan.billingCycle,
                trialDays: plan.trialDays,
                email: guestEmail,
                name: guestName,
                region,
                coupon: couponCode || undefined
            };

            const data = await invokeFn(functionName, payload, session?.access_token || 'null');

            if (data?.error) throw new Error(data.error || 'Erro ao iniciar checkout');
            if (!data?.clientSecret) throw new Error('Client secret não retornado');
            setClientSecret(data.clientSecret);
            if (data?.appliedCoupon) {
                setAppliedCouponInfo(data.appliedCoupon);
                toast.success(`Cupom ${data.appliedCoupon.code} aplicado com sucesso!`);
            } else {
                setAppliedCouponInfo(null);
                if (couponCode) toast.error("Cupom inválido ou não encontrado.");
            }
            return data.clientSecret;
        } catch (err: any) {
            setStripeError(err.message || 'Erro desconhecido');
            toast.error("Erro ao iniciar checkout: " + (err.message || 'Erro desconhecido'));
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleStep1Continue = () => {
        let hasError = false;
        if (!guestName.trim() || guestName.trim().length < 2) {
            setGuestNameError('Informe seu nome completo');
            hasError = true;
        } else {
            setGuestNameError('');
        }
        if (!guestEmail.includes('@') || !guestEmail.includes('.')) {
            setGuestEmailError('Informe um e-mail válido');
            hasError = true;
        } else {
            setGuestEmailError('');
        }
        if (!hasError) setStep(2);
    };

    // Payment Request Button Logic
    const [paymentRequest, setPaymentRequest] = useState<any>(null);
    const [isCheckingPaymentSupport, setIsCheckingPaymentSupport] = useState(true);

    useEffect(() => {
        if (stripePromise) {
            stripePromise.then(stripe => {
                if (!stripe) { setIsCheckingPaymentSupport(false); return; }
                const region = plan.region || 'BR';
                const amountStr = plan.billingCycle === 'annual' ? plan.prices[region].annual : plan.prices[region].monthly;
                const amount = parseInt(amountStr.replace(/[.,]/g, ''));
                const pr = stripe.paymentRequest({
                    country: region === 'EU' ? 'PT' : 'BR',
                    currency: region === 'EU' ? 'eur' : 'brl',
                    total: { label: `Plano ${plan.label} - Connect Academy`, amount },
                    requestPayerName: true,
                    requestPayerEmail: true,
                });
                pr.canMakePayment().then(result => {
                    if (result) setPaymentRequest(pr);
                    setIsCheckingPaymentSupport(false);
                });
            }).catch(() => setIsCheckingPaymentSupport(false));
        }
    }, [plan]);

    // Price calculations
    const region = plan.region || 'BR';
    const annualTotal = plan.prices?.[region]?.annual || '0';
    const monthlyTotal = plan.prices?.[region]?.monthly || '0';
    const annualTotalNum = parseFloat(annualTotal.replace(',', '.'));
    const monthlyTotalNum = parseFloat(monthlyTotal.replace(',', '.'));
    
    const finalAnnualNum = appliedCouponInfo?.percentOff 
        ? annualTotalNum * (1 - appliedCouponInfo.percentOff / 100)
        : (appliedCouponInfo?.amountOff ? Math.max(0.5, annualTotalNum - appliedCouponInfo.amountOff / 100) : annualTotalNum);
        
    const finalMonthlyNum = appliedCouponInfo?.percentOff 
        ? monthlyTotalNum * (1 - appliedCouponInfo.percentOff / 100)
        : (appliedCouponInfo?.amountOff ? Math.max(0.5, monthlyTotalNum - appliedCouponInfo.amountOff / 100) : monthlyTotalNum);

    const finalAnnualStr = finalAnnualNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const finalMonthlyStr = finalMonthlyNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const monthly12x = isAnnual ? (finalAnnualNum / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : null;

    return createPortal(
         <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center sm:items-center sm:p-6 animate-fade-in">
             <div className="relative w-full sm:max-w-[480px] bg-white rounded-t-3xl sm:rounded-[2rem] shadow-2xl shadow-black/20 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-slide-up">

                 {/* Success Screen Overlay (covers everything) */}
                 {isPaymentApproved && (
                     <div className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                         <div className="w-24 h-24 mb-6 flex items-center justify-center relative">
                             <img 
                                 src="https://i.postimg.cc/8CypNtWj/IMG-3409.gif" 
                                 className="w-16 h-16 object-contain animate-bounce-in" 
                                 alt="Success" 
                             />
                         </div>

                         <h2 className="text-2xl font-black text-slate-900 mb-2">
                             Pagamento Aprovado!
                         </h2>
                         <p className="text-sm text-slate-500 font-medium mb-8">
                             {!isAuthenticated 
                                 ? 'Sua conta foi criada! Verifique seu e-mail para obter os dados de acesso.'
                                 : (plan.id.startsWith('cred_') ? 'Seus créditos foram adicionados.' : 'Sua assinatura foi ativada com sucesso!')
                             }
                         </p>
                         
                         <button 
                             onClick={() => {
                                 onSuccess(); 
                                 onClose();   
                                 if (isAuthenticated) {
                                     window.location.hash = plan.id.startsWith('cred_') ? '#ai' : '#profile';
                                 } else {
                                     window.location.hash = '#login';
                                 }
                             }}
                             className="w-full max-w-[200px] h-12 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all animate-fade-in"
                         >
                             {isAuthenticated ? 'Começar Agora' : 'Fazer Login'}
                         </button>
                     </div>
                 )}

                {/* Apple Pay invisible handler - listens & confirms payment after native sheet */}
                {paymentRequest && (
                    <ApplePayHandler
                        paymentRequest={paymentRequest}
                        stripePromise={stripePromise}
                        fetchSecret={fetchClientSecret}
                        onSuccess={handleLocalSuccess}
                    />
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                    <Icons.X className="w-5 h-5" />
                </button>

                {/* Header - Plan Info */}
                <div className="bg-gradient-to-br from-slate-50 to-white px-5 pt-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <img src="https://i.postimg.cc/Cx0Wn1pW/drone.webp" alt="" className="h-12 w-auto object-contain" />
                            <div>
                                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-0.5">Plano</p>
                                <h3 className="text-xl font-bold text-slate-900 leading-none">
                                    {plan.label}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            {isAnnual && method === 'cc_appmax' ? (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline leading-none">
                                        <span className="text-sm font-semibold text-slate-500 mr-1">12x</span>
                                        <span className="text-lg font-bold text-slate-900 leading-tight">{currencySymbol} {monthly12x}</span>
                                        <span className="text-[11px] font-normal text-slate-400 ml-1">/mês</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Ou {currencySymbol} {finalAnnualStr} à vista</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline leading-none">
                                        <span className="text-lg font-bold text-slate-900 leading-tight">{currencySymbol} {isAnnual ? finalAnnualStr : finalMonthlyStr}</span>
                                        {!isAnnual && <span className="text-[11px] font-normal text-slate-400 ml-1">/mês</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step indicator (only for guests) */}
                    {!isAuthenticated && (
                        <div className="flex items-center gap-2 mt-4">
                            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-primary' : 'text-slate-400'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${step === 1 ? 'border-primary bg-primary text-white' : 'border-primary bg-primary text-white'}`}>
                                    {step > 1 ? <Icons.Check className="w-3 h-3" /> : '1'}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wide">Criar Conta</span>
                            </div>
                            <div className="flex-1 h-px bg-slate-200 mx-1" />
                            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-primary' : 'text-slate-400'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${step === 2 ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-400'}`}>
                                    2
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wide">Pagamento</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1">

                    {/* === STEP 1: CREATE ACCOUNT === */}
                    {step === 1 && !isAuthenticated && (
                        <div className="space-y-5">
                            <div>
                                <h4 className="text-base font-bold text-slate-900 mb-1">Crie sua conta gratuitamente</h4>
                                <p className="text-[12px] text-slate-500 leading-relaxed">
                                    Você receberá seus dados de acesso por e-mail após a confirmação do pagamento.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seu Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: João Silva"
                                        className={`w-full h-12 bg-slate-50 border rounded-xl px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all ${guestNameError ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                                        value={guestName}
                                        onChange={(e) => { setGuestName(e.target.value); setGuestNameError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleStep1Continue()}
                                    />
                                    {guestNameError && <p className="text-[10px] text-red-500 mt-1 font-medium">{guestNameError}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seu E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="exemplo@email.com"
                                        className={`w-full h-12 bg-slate-50 border rounded-xl px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all ${guestEmailError ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                                        value={guestEmail}
                                        onChange={(e) => { setGuestEmail(e.target.value); setGuestEmailError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleStep1Continue()}
                                    />
                                    {guestEmailError && <p className="text-[10px] text-red-500 mt-1 font-medium">{guestEmailError}</p>}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2.5 items-start">
                                <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                <p className="text-[11px] text-blue-700 leading-snug">
                                    Após o pagamento, você receberá um <strong>e-mail com seus dados de acesso</strong> e um link para definir sua senha.
                                </p>
                            </div>

                            <button
                                onClick={handleStep1Continue}
                                className="w-full h-14 bg-primary text-white rounded-xl font-black text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                Continuar para Pagamento
                                <Icons.ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* === STEP 2: PAYMENT === */}
                    {step === 2 && (
                        <div className="space-y-5">
                            {/* Back button for guests */}
                            {!isAuthenticated && (
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors -mt-1"
                                >
                                    <Icons.ChevronLeft className="w-3.5 h-3.5" />
                                    Voltar
                                </button>
                            )}

                            {/* Payment Method Selector */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => { setMethod('cc'); fetchClientSecret(); }}
                                    className={`flex-1 h-[44px] rounded-xl flex items-center justify-center gap-1.5 transition-all font-semibold text-xs border ${method === 'cc' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'}`}
                                >
                                    <Icons.CreditCard className="w-4 h-4" />
                                    Cartão
                                </button>

                                {isAnnual && (
                                    <button
                                        onClick={() => setMethod('cc_appmax')}
                                        className={`flex-1 h-[44px] rounded-xl flex items-center justify-center gap-1.5 transition-all font-semibold text-xs border ${method === 'cc_appmax' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'}`}
                                    >
                                        <Icons.CreditCard className="w-4 h-4" />
                                        12x
                                    </button>
                                )}

                                {plan.region !== 'EU' && (
                                    <button
                                        onClick={() => setMethod('pix')}
                                        className={`flex-1 h-[44px] px-2 rounded-xl flex items-center justify-center transition-all border ${method === 'pix' ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:bg-slate-50 opacity-80'}`}
                                    >
                                        <Icons.Pix className="h-4 w-auto object-contain" />
                                    </button>
                                )}

                                {paymentRequest && (
                                    <button
                                        onClick={() => {
                                            setMethod('apple_pay');
                                            paymentRequest.show();
                                        }}
                                        className={`flex-1 h-[44px] rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm border ${
                                            method === 'apple_pay'
                                                ? 'bg-black border-black text-white'
                                                : 'bg-black border-black text-white hover:opacity-90'
                                        }`}
                                    >
                                        <Icons.Apple className="w-4 h-4" />
                                        Pay
                                    </button>
                                )}
                            </div>

                            {/* Payment Content */}
                            {method === 'cc' ? (
                                stripeError ? (
                                    <div className="py-6 text-center">
                                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                                            <Icons.X className="w-5 h-5 text-red-500" />
                                        </div>
                                        <p className="text-slate-700 font-bold text-sm mb-1">Erro no checkout</p>
                                        <p className="text-slate-500 text-xs mb-4 px-2">{stripeError}</p>
                                        <button onClick={fetchClientSecret} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary/90 transition-colors">
                                            Tentar Novamente
                                        </button>
                                    </div>
                                ) : clientSecret ? (
                                    <Elements stripe={stripePromise} options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'stripe',
                                            variables: {
                                                colorPrimary: '#2934FF',
                                                colorBackground: '#ffffff',
                                                colorText: '#1e293b',
                                                borderRadius: '8px',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                spacingUnit: '3px',
                                                fontSizeBase: '16px',
                                            },
                                            rules: {
                                                '.Input': { borderColor: '#e2e8f0', padding: '10px 12px', fontSize: '16px' },
                                                '.Label': { fontSize: '12px', fontWeight: '600', marginBottom: '4px' }
                                            }
                                        }
                                    }}>
                                        <StripeForm 
                                            plan={plan} 
                                            onCancel={onClose} 
                                            onSuccess={handleLocalSuccess} 
                                            isSetupIntent={clientSecret?.startsWith('seti_')} 
                                            paymentRequest={paymentRequest}
                                        />
                                    </Elements>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-slate-600 font-medium text-xs">Carregando...</p>
                                    </div>
                                )
                            ) : method === 'apple_pay' ? (
                                <div className="py-12 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                                        <Icons.Apple className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-slate-800 font-bold mb-1">Aguardando Pagamento</p>
                                    <p className="text-[12px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                                        Complete a transação na janela do Apple Pay / Google Pay que foi aberta na sua tela.
                                    </p>
                                </div>
                            ) : method === 'cc_appmax' ? (
                                    <AppmaxCCPayment plan={plan} onCancel={onClose} onSuccess={handleLocalSuccess} />
                                ) : (
                                    <PixPayment plan={plan} onCancel={onClose} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} couponCode={couponCode} />
                                )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-5 pt-3 pb-8 sm:pb-3 flex flex-col sm:flex-row items-center justify-center border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Icons.LockClosed className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px]">Pagamento Seguro & Criptografado</span>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
