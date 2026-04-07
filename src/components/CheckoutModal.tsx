import React, { useState, useEffect, useRef } from 'react';
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

// ── Tabela de parcelas exatas da Appmax por plano ──
const INSTALLMENTS: Record<string, { value: string; total: string }[]> = {
    starter: [
        { value: '58,20', total: '58,20' },
        { value: '30,84', total: '61,68' },
        { value: '21,14', total: '63,42' },
        { value: '16,29', total: '65,16' },
        { value: '13,38', total: '66,90' },
        { value: '11,44', total: '68,64' },
        { value: '10,05', total: '70,38' },
        { value: '9,02',  total: '72,12' },
        { value: '8,21',  total: '73,86' },
        { value: '7,56',  total: '75,60' },
        { value: '7,03',  total: '77,34' },
        { value: '6,59',  total: '79,08' },
        { value: '6,22',  total: '80,82' },
        { value: '5,90',  total: '82,56' },
        { value: '5,62',  total: '84,30' },
        { value: '5,38',  total: '86,04' },
        { value: '5,16',  total: '87,78' },
        { value: '4,97',  total: '89,52' },
        { value: '4,80',  total: '91,26' },
        { value: '4,65',  total: '93,00' },
        { value: '4,51',  total: '94,74' },
    ],
    pro: [
        { value: '118,20', total: '118,20' },
        { value: '62,05',  total: '124,09' },
        { value: '42,34',  total: '127,03' },
        { value: '32,49',  total: '129,97' },
        { value: '26,58',  total: '132,92' },
        { value: '22,64',  total: '135,86' },
        { value: '19,83',  total: '138,80' },
        { value: '17,72',  total: '141,75' },
        { value: '16,08',  total: '144,69' },
        { value: '14,76',  total: '147,63' },
        { value: '13,69',  total: '150,57' },
        { value: '12,79',  total: '153,52' },
        { value: '12,04',  total: '156,46' },
        { value: '11,39',  total: '159,40' },
        { value: '10,82',  total: '162,35' },
        { value: '10,33',  total: '165,29' },
        { value: '9,90',   total: '168,23' },
        { value: '9,51',   total: '171,18' },
        { value: '9,16',   total: '174,12' },
        { value: '8,85',   total: '177,06' },
        { value: '8,57',   total: '180,01' },
    ],
    elite: [
        { value: '233,40', total: '233,40' },
        { value: '122,51', total: '245,02' },
        { value: '83,61',  total: '250,83' },
        { value: '64,16',  total: '256,65' },
        { value: '52,49',  total: '262,46' },
        { value: '44,71',  total: '268,27' },
        { value: '39,15',  total: '274,08' },
        { value: '34,99',  total: '279,89' },
        { value: '31,74',  total: '285,70' },
        { value: '29,15',  total: '291,52' },
        { value: '27,03',  total: '297,33' },
        { value: '25,26',  total: '303,14' },
        { value: '23,77',  total: '308,95' },
        { value: '22,48',  total: '314,76' },
        { value: '21,37',  total: '320,57' },
        { value: '20,40',  total: '326,39' },
        { value: '19,54',  total: '332,20' },
        { value: '18,78',  total: '338,01' },
        { value: '18,10',  total: '343,82' },
        { value: '17,48',  total: '349,63' },
        { value: '16,93',  total: '355,44' },
    ],
};

async function invokeFn(fnName: string, body: any, token: string | null): Promise<any> {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(body),
    });
    return res.json();
}

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    'pk_live_51Q50BUCWGI5d7s18Jd0BDDrzEC1zsFjNuUdD2l1kpKYNQLk3RhvT1y4GvDfRWqr06ANPDgKh0NeTsIOw0jhaHWW600HjVSKT37'
);

/* ─── STRIPE CARD FORM ─────────────────────────────────────────── */
const StripeForm = ({ plan, onSuccess, isSetupIntent, guestEmail, guestName, guestPhone }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const hasFiredAddPaymentInfo = useRef(false);

    const handlePaymentElementChange = (e: any) => {
        if (!hasFiredAddPaymentInfo.current && e.complete) {
            hasFiredAddPaymentInfo.current = true;
            try { 
                trackAddPaymentInfo(plan?.label || plan?.id || 'unknown', {
                    email: guestEmail,
                    firstName: guestName?.split(' ')[0],
                    phone: guestPhone?.replace(/\D/g, '')
                }); 
            } catch {}
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !agreedToTerms) return;
        setLoading(true);

        const confirmParams = {
            return_url: window.location.origin + window.location.pathname,
            payment_method_data: {
                billing_details: {
                    email: guestEmail,
                    name: guestName
                }
            }
        };

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
        <form onSubmit={handleSubmit} className="space-y-5">
            <PaymentElement
                onChange={handlePaymentElementChange}
                options={{
                    layout: 'tabs',
                    wallets: { applePay: 'never', googlePay: 'never' },
                    link: { email: 'never' },
                    terms: { card: 'never' },
                }}
            />
            <label className="flex items-start gap-3 cursor-pointer py-1">
                <div className="relative flex items-center shrink-0 mt-0.5">
                    <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-200 transition-all checked:bg-[#4D5BFF] checked:border-[#4D5BFF]"
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
                className="w-full h-14 bg-[#A3AFFF] hover:bg-[#8F9FFF] text-white rounded-2xl font-bold text-base transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
                {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <>Comprar <Icons.ArrowRight className="w-4 h-4" /></>}
            </button>
        </form>
    );
};

/* ─── APPLE PAY NATIVE ─────────────────────────────────────────── */
const ApplePayButton = ({
    plan, priceNum, region, guestEmail, guestName, onSuccess, isActive, onClick,
}: any) => {
    const paymentRequestRef = useRef<any>(null);
    const [canPay, setCanPay] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const setup = async () => {
            const stripe = await stripePromise;
            if (!stripe || cancelled) return;

            const pr = stripe.paymentRequest({
                country: region === 'EU' ? 'PT' : 'BR',
                currency: region === 'EU' ? 'eur' : 'brl',
                total: {
                    label: plan.label || 'Connect Academy',
                    amount: Math.round(priceNum * 100),
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            const result = await pr.canMakePayment();
            if (cancelled) return;
            if (result?.applePay || result?.googlePay) {
                setCanPay(true);
                paymentRequestRef.current = pr;

                pr.on('paymentmethod', async (ev: any) => {
                    try {
                        const { data: { session } } = await supabase.auth.getSession();
                        const data = await invokeFn('create-stripe-payment-intent', {
                            planId: plan.id,
                            email: ev.payerEmail || guestEmail,
                            amount: priceNum.toFixed(2).replace('.', ','),
                            region,
                        }, session?.access_token || 'null');

                        if (!data?.clientSecret) throw new Error('Falha ao gerar token de pagamento.');

                        const { error: confirmError } = await stripe.confirmCardPayment(
                            data.clientSecret,
                            { payment_method: ev.paymentMethod.id },
                            { handleActions: false }
                        );

                        if (confirmError) {
                            ev.complete('fail');
                            toast.error(confirmError.message || 'Erro no pagamento');
                        } else {
                            ev.complete('success');
                            onSuccess();
                        }
                    } catch (err: any) {
                        ev.complete('fail');
                        toast.error(err.message || 'Erro inesperado');
                    }
                });
            }
        };
        setup();
        return () => { cancelled = true; };
    }, [priceNum]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick(); // mark as active method
        if (paymentRequestRef.current) {
            paymentRequestRef.current.show();
        } else {
            toast.error('Apple Pay não disponível neste dispositivo.');
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex-1 h-12 flex items-center justify-center bg-black rounded-xl transition-opacity hover:opacity-90 ${isActive ? 'ring-2 ring-[#4D5BFF]' : ''}`}
        >
            <img
                src="https://i.postimg.cc/YS7x3Xjp/5977576_2.png"
                className="h-7 brightness-0 invert"
                alt="Apple Pay"
            />
        </button>
    );
};

/* ─── PIX PAYMENT ─────────────────────────────────────────────── */
const PixPayment = ({ plan, onSuccess, guestEmail, guestName, guestPhone }: any) => {
    const [pixData, setPixData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [cpf, setCpf] = useState('');
    const [copiedMessage, setCopiedMessage] = useState(false);
    const hasFiredAddPaymentInfo = useRef(false);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(e.target.value);
        if (!hasFiredAddPaymentInfo.current && e.target.value.length > 0) {
            hasFiredAddPaymentInfo.current = true;
            try { 
                trackAddPaymentInfo('PIX', {
                    email: guestEmail,
                    firstName: guestName?.split(' ')[0],
                    phone: guestPhone?.replace(/\D/g, '')
                }); 
            } catch {}
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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ plan, cpf, email: guestEmail, name: guestName, phone: guestPhone }),
            });
            const data = await res.json();
            if (data?.error) throw new Error(data.error);
            setPixData(data);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async () => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const res = await fetch(`${SUPABASE_URL}/functions/v1/check-pix-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionData?.session?.access_token || SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ id: pixData?.id }),
            });
            const data = await res.json();
            if (data?.status === 'approved') onSuccess();
        } catch {}
    };

    if (loading) return (
        <div className="py-12 text-center animate-pulse">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-xs">Gerando QR Code...</p>
        </div>
    );

    if (pixData) return (
        <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 inline-block mx-auto shadow-sm">
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.payload)}`}
                    alt="PIX"
                    className="w-44 h-44"
                />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 items-center relative">
                <p className="text-[11px] text-slate-500 truncate text-left flex-1 font-mono">{pixData.payload}</p>
                <button
                    onClick={() => { navigator.clipboard.writeText(pixData.payload); setCopiedMessage(true); setTimeout(() => setCopiedMessage(false), 2000); }}
                    className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                >
                    <Icons.Copy className="w-4 h-4" />
                </button>
                {copiedMessage && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl text-[#4D5BFF] font-bold text-xs">
                        Copiado!
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Aguardando pagamento... {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
        </div>
    );

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">CPF do Titular</label>
                <input
                    type="text"
                    className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 text-base text-slate-900 outline-none focus:border-[#4D5BFF] transition-all font-medium placeholder:text-slate-300"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                />
            </div>
            <label className="flex items-start gap-3 cursor-pointer py-1">
                <div className="relative flex items-center shrink-0 mt-0.5">
                    <input type="checkbox" className="peer h-4 w-4 appearance-none rounded border border-slate-200 checked:bg-[#4D5BFF] transition-all" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
                    <Icons.Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity" />
                </div>
                <span className="text-[12px] text-slate-400 leading-snug">Concordo com os termos do serviço e políticas de privacidade.</span>
            </label>
            <button
                onClick={handleGeneratePix}
                disabled={loading || !agreedToTerms}
                className="w-full h-14 bg-[#4D5BFF] hover:bg-[#3D4AE5] text-white rounded-2xl font-bold text-base transition-all disabled:opacity-40 shadow-lg shadow-[#4D5BFF]/20"
            >
                {loading ? 'Gerando...' : 'Gerar QR Code PIX'}
            </button>
        </div>
    );
};

/* ─── APPMAX CC ─────────────────────────────────────────────────── */
const AppmaxCCPayment = ({ plan, onSuccess, region, guestEmail, guestName, guestPhone, onInstallmentChange }: any) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ card_number: '', card_name: '', card_expiry: '', card_cvv: '', cpf: '', installments: '1', country: 'BR' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const planInstallments = INSTALLMENTS[plan.id] || [];
    const selectedIdx = parseInt(formData.installments) - 1;
    const selectedInfo = planInstallments[selectedIdx];

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        let formatted = value;

        if (name === 'card_expiry') {
            const digits = value.replace(/\D/g, '').slice(0, 4);
            if (digits.length >= 3) {
                formatted = digits.slice(0, 2) + '/' + digits.slice(2);
            } else if (digits.length === 2 && formData.card_expiry.length === 1) {
                formatted = digits + '/';
            } else {
                formatted = digits;
            }
        } else if (name === 'card_number') {
            const digits = value.replace(/\D/g, '').slice(0, 16);
            formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
        } else if (name === 'cpf') {
            const digits = value.replace(/\D/g, '').slice(0, 11);
            if (digits.length <= 3) formatted = digits;
            else if (digits.length <= 6) formatted = digits.slice(0, 3) + '.' + digits.slice(3);
            else if (digits.length <= 9) formatted = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6);
            else formatted = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6, 9) + '-' + digits.slice(9);
        }

        setFormData(p => ({ ...p, [name]: formatted }));
        if (name === 'installments' && onInstallmentChange) {
            const idx = parseInt(value) - 1;
            onInstallmentChange(INSTALLMENTS[plan.id]?.[idx] || null, parseInt(value));
        }
    };

    const handleProcessPayment = async (e: any) => {
        e.preventDefault();
        if (!agreedToTerms) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await invokeFn('process-appmax-cc', { 
                plan, 
                paymentData: { ...formData, email: guestEmail, name: guestName, phone: guestPhone } 
            }, session?.access_token || null);
            if (data?.success) onSuccess();
            else throw new Error(data?.message || 'Erro ao processar pagamento');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full h-14 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-700 outline-none focus:border-[#4D5BFF] transition-all placeholder:text-slate-300";
    const labelStyle = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

    return (
        <form onSubmit={handleProcessPayment} className="space-y-4 animate-in fade-in duration-300">
            {/* Card number */}
            <div>
                <label className={labelStyle}>NÚMERO DO CARTÃO</label>
                <div className="relative">
                    <input
                        name="card_number"
                        placeholder="1234 1234 1234 1234"
                        required
                        className={`${inputStyle} pr-24`}
                        value={formData.card_number}
                        onChange={handleInputChange}
                        maxLength={19}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {/* Visa */}
                        <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                            <text x="6" y="17" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="white" letterSpacing="0.5">VISA</text>
                        </svg>
                        {/* Mastercard */}
                        <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="34" height="24" rx="4" fill="#252525"/>
                            <circle cx="13" cy="12" r="7" fill="#EB001B"/>
                            <circle cx="21" cy="12" r="7" fill="#F79E1B"/>
                            <path d="M17 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 17 6.8z" fill="#FF5F00"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Name on card & CPF */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelStyle}>NOME NO CARTÃO</label>
                    <input
                        name="card_name"
                        placeholder="Nome impresso"
                        required
                        className={inputStyle}
                        value={formData.card_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className={labelStyle}>CPF DO TITULAR</label>
                    <input
                        name="cpf"
                        placeholder="000.000.000-00"
                        required
                        className={inputStyle}
                        value={formData.cpf}
                        onChange={handleInputChange}
                        maxLength={14}
                    />
                </div>
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelStyle}>DATA DE VALIDADE</label>
                    <input
                        name="card_expiry"
                        placeholder="MM/AA"
                        required
                        className={inputStyle}
                        value={formData.card_expiry}
                        onChange={handleInputChange}
                        maxLength={5}
                        inputMode="numeric"
                    />
                </div>
                <div>
                    <label className={labelStyle}>CÓDIGO (CVC)</label>
                    <div className="relative">
                        <input
                            name="card_cvv"
                            placeholder="123"
                            required
                            className={`${inputStyle} pr-10`}
                            value={formData.card_cvv}
                            onChange={handleInputChange}
                            maxLength={4}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                            <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
                                <rect x="0.5" y="0.5" width="21" height="14" rx="2" stroke="currentColor"/>
                                <rect y="3" width="22" height="3" fill="currentColor" opacity="0.25"/>
                                <rect x="3" y="9" width="8" height="2" rx="1" fill="currentColor" opacity="0.4"/>
                                <text x="13.5" y="12" fontSize="5" fill="currentColor" fontWeight="bold">123</text>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Installments & Country */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelStyle}>PARCELAS</label>
                    <div className="relative">
                        <select name="installments" className={`${inputStyle} appearance-none pr-10`} value={formData.installments} onChange={handleInputChange}>
                            {planInstallments.map((inst, i) => {
                                const n = i + 1;
                                return (
                                    <option key={n} value={n}>
                                        {n}x de R$ {inst.value}
                                    </option>
                                );
                            })}
                            {planInstallments.length === 0 && Array.from({ length: 21 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}x</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className={labelStyle}>PAÍS</label>
                    <div className="relative">
                        <select name="country" className={`${inputStyle} appearance-none pr-10`} value={formData.country} onChange={handleInputChange}>
                            <option value="BR">Brasil</option>
                            <option value="US">Estados Unidos</option>
                            <option value="PT">Portugal</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer py-1">
                <div className="relative flex items-center shrink-0 mt-0.5">
                    <input type="checkbox" className="peer h-4 w-4 appearance-none rounded border border-slate-200 checked:bg-[#4D5BFF] transition-all" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
                    <Icons.Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity" />
                </div>
                <span className="text-[11px] text-slate-400 leading-snug">
                    Ao fornecer os seus dados, você permite que a <strong>Appmax</strong> realize a cobrança no seu cartão de acordo com os <a href="https://appmax.com.br/termos-de-uso" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600 transition-colors">Termos de Uso da Appmax</a>.
                </span>
            </label>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className={`w-full h-14 text-white rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    agreedToTerms
                        ? 'bg-[#4D5BFF] hover:bg-[#3D4AE5] shadow-lg shadow-[#4D5BFF]/30 scale-[1.01]'
                        : 'bg-[#A3AFFF] opacity-60 cursor-not-allowed'
                }`}
            >
                {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <>Comprar <Icons.ArrowRight className="w-4 h-4" /></>}
            </button>
        </form>
    );
};

/* ─── ORDER SUMMARY SECTION ────────────────────────────────────── */
const OrderSummary = ({ plan, priceStr, monthly12x, currencySymbol, planPeriodLabel, planDisplayName, selectedInstallment, planAccessDuration }: any) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="w-full bg-white border-b border-slate-100">
            {/* Toggle */}
            <div className="flex justify-center py-2.5">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest"
                >
                    OCULTAR DETALHES
                    <Icons.ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} />
                </button>
            </div>

            {/* Collapsible product row */}
            <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-32' : 'max-h-0'}`}>
                <div className="flex items-center gap-3 px-5 pb-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <img src="https://i.postimg.cc/Cx0Wn1pW/drone.webp" alt="Plano" className="w-10 h-10 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">RESUMO DO PEDIDO</p>
                        <p className="text-[16px] font-black text-slate-900 leading-tight">{planDisplayName}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">{planAccessDuration}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md font-black border border-emerald-200 uppercase tracking-wide">40% OFF</span>
                            <span className="text-[9px] text-[#4D5BFF] font-black uppercase tracking-wide">{planPeriodLabel}</span>
                        </div>
                        <span className="text-[17px] font-black text-slate-900">{currencySymbol} {priceStr}</span>
                        <span className="text-[10px] text-slate-400 font-medium opacity-90 mt-0.5">Ou 12x de {currencySymbol} {monthly12x}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

/* ─── MAIN CHECKOUT COMPONENT ──────────────────────────────────── */
export const CheckoutModal = ({
    plan,
    onClose,
    onSuccess,
}: {
    plan: any;
    onClose: () => void;
    onSuccess: () => void;
}) => {
    const region = plan.region || 'BR';
    const currencySymbol = region === 'EU' ? '€' : 'R$';

    const [method, setMethod] = useState<'cc' | 'pix' | 'cc_appmax' | 'apple_pay'>(region === 'EU' ? 'cc' : 'cc_appmax');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [isPaymentApproved, setIsPaymentApproved] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState<{ n: number; info: { value: string; total: string } | null }>({ n: 1, info: INSTALLMENTS[plan.id]?.[0] || null });
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const priceNum = parseFloat((plan.prices?.[region]?.annual || '0').replace(',', '.'));
    const priceStr = priceNum.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    let monthly12x = (priceNum / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (region === 'BR' && INSTALLMENTS[plan.id]?.[11]) {
        monthly12x = INSTALLMENTS[plan.id][11].value;
    }

    const planPeriodLabel = plan.id?.toLowerCase().includes('starter')
        ? 'TRIMESTRAL'
        : plan.id?.toLowerCase().includes('pro')
            ? 'ANUAL'
            : 'VITALÍCIO';

    const planAccessDuration = plan.id?.toLowerCase().includes('starter')
        ? '3 meses de acesso'
        : plan.id?.toLowerCase().includes('pro')
            ? '1 ano de acesso'
            : 'Acesso vitalício';

    const planDisplayName = `Plano ${(plan.label?.replace(/[🥇🌏🪙💙]/g, '').split(' ')[0] || '').toUpperCase()}`;

    const handleLocalSuccess = async () => {
        setIsPaymentApproved(true);
        trackPurchase(plan.label || plan.id, priceNum, region === 'EU' ? 'EUR' : 'BRL', undefined, {
            email: guestEmail,
            firstName: guestName.split(' ')[0],
            phone: guestPhone.replace(/\D/g, ''),
        });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const finalEmail = guestEmail || session?.user?.email;
            const finalName = guestName || session?.user?.user_metadata?.full_name;

            if (!finalEmail) {
                console.error('Missing email for activation');
                return;
            }

            const res = await fetch(`${SUPABASE_URL}/functions/v1/activate-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ 
                    plan: plan.id, 
                    email: finalEmail, 
                    name: finalName,
                    billingCycle: plan.billingCycle // Include billing cycle if present
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('Activation failed:', errData);
                // Optionally show a non-blocking toast to admin/debug
            }
        } catch (err) {
            console.error('Error in handleLocalSuccess activation:', err);
        }
        setTimeout(() => { onSuccess(); onClose(); }, 2000);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
            if (session) {
                setStep(2);
                setGuestEmail(session.user.email || '');
            }
        });
        trackInitiateCheckout(plan.label || plan.id, priceNum, region === 'EU' ? 'EUR' : 'BRL');
        document.documentElement.classList.add('checkout-open');
        return () => { document.documentElement.classList.remove('checkout-open'); };
    }, []);

    const fetchClientSecret = async (emailOverride?: string) => {
        setClientSecret(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await invokeFn(
                'create-stripe-payment-intent',
                {
                    planId: plan.id,
                    email: emailOverride || session?.user?.email || guestEmail,
                    amount: plan.prices?.[region]?.annual.replace(',', '.'),
                    region,
                },
                session?.access_token || 'null'
            );
            setClientSecret(data.clientSecret);
        } catch {
            toast.error('Erro ao iniciar pagamento');
        }
    };

    useEffect(() => {
        if (step === 2 && method === 'cc') fetchClientSecret();
    }, [step, method]);

    const handleStep1Continue = () => {
        if (!guestEmail.includes('@') || !guestName.length) {
            toast.error('Preencha os dados corretamente');
            return;
        }
        trackLead(plan.label || plan.id, priceNum, region === 'EU' ? 'EUR' : 'BRL', {
            email: guestEmail,
            firstName: guestName.split(' ')[0],
            phone: guestPhone.replace(/\D/g, ''),
        });
        setStep(2);
    };

    return createPortal(
        <div className="fixed inset-0 z-[300] bg-white flex flex-col md:flex-row overflow-hidden font-sans text-slate-900">

            {/* ══════════════════════════════════════════
                DESKTOP SIDEBAR (hidden on mobile)
            ══════════════════════════════════════════ */}
            <div className="hidden md:flex md:w-[380px] lg:w-[420px] bg-white border-r border-slate-100 flex-col overflow-y-auto no-scrollbar shrink-0">
                <div className="px-12 lg:px-14 py-12 lg:py-14">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-slate-300 hover:text-slate-500 transition-colors font-black text-[11px] mb-12 uppercase tracking-tighter"
                    >
                        <Icons.ArrowLeft className="w-4 h-4" />
                        <span>Voltar plataforma</span>
                    </button>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                <img src="https://i.postimg.cc/Cx0Wn1pW/drone.webp" alt="Plano" className="w-10 h-10 object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em] mb-1">RESUMO DO PEDIDO</p>
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="text-[18px] font-black text-slate-900 leading-tight">{planDisplayName}</h2>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-black border border-emerald-100 uppercase">40% OFF</span>
                                        <span className="text-[9px] text-slate-400 font-black uppercase">{planPeriodLabel}</span>
                                    </div>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 mt-0.5">{planAccessDuration}</p>
                                <p className="text-[18px] font-black text-slate-900 mt-1">{currencySymbol} {selectedInstallment.info?.total || priceStr}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[12px] font-bold text-slate-400">Parcelamento</span>
                            <span className="text-[13px] font-black text-slate-900">{selectedInstallment.n}x {currencySymbol} {selectedInstallment.info?.value || monthly12x}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                MOBILE LAYOUT (full-screen column)
            ══════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto no-scrollbar relative min-h-0">

                {/* Payment approved overlay */}
                {isPaymentApproved && (
                    <div className="absolute inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 mb-6">
                            <img src="https://i.postimg.cc/8CypNtWj/IMG-3409.gif" className="w-full h-full object-contain" alt="Success" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Pagamento Aprovado!</h2>
                        <p className="text-[14px] text-slate-500 mb-8 max-w-[280px] leading-relaxed">
                            Seu acesso ao Connect Academy foi liberado. Verifique seu e-mail para os próximos passos.
                        </p>
                        <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#4D5BFF] animate-progress-fast" />
                        </div>
                    </div>
                )}

                {/* ─── Mobile top header (logo + back only) ─── */}
                <div className="md:hidden sticky top-0 z-20 bg-white flex items-center justify-between px-4 h-12 border-b border-slate-50">
                    <button onClick={onClose} className="p-2 -ml-2 text-slate-500 hover:text-slate-700 transition-colors">
                        <Icons.ArrowLeft className="w-5 h-5" />
                    </button>
                    <img
                        src="https://i.postimg.cc/Wz5JsrXh/LOGONE_2.png"
                        alt="Logo"
                        className="h-6 w-auto absolute left-1/2 -translate-x-1/2"
                    />
                    <div className="w-9" /> {/* spacer */}
                </div>

                {/* ─── Mobile order summary (collapsible) ─── */}
                <div className="md:hidden">
                    <OrderSummary
                        plan={plan}
                        priceStr={priceStr}
                        monthly12x={monthly12x}
                        currencySymbol={currencySymbol}
                        planPeriodLabel={planPeriodLabel}
                        planDisplayName={planDisplayName}
                        selectedInstallment={selectedInstallment}
                        planAccessDuration={planAccessDuration}
                    />
                </div>

                {/* ─── Main scrollable content ─── */}
                <div className="w-full max-w-[480px] mx-auto px-5 md:px-12 py-4 md:py-12 flex flex-col">

                    {/* Step indicator */}
                    {!isAuthenticated && (
                        <div className="flex items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black transition-all duration-300 border-2 ${
                                    step === 1
                                        ? 'bg-[#4D5BFF] border-[#4D5BFF] text-white'
                                        : 'bg-white border-slate-200 text-slate-400'
                                }`}>
                                    {step > 1 ? <Icons.Check className="w-4 h-4 text-slate-400" /> : '1'}
                                </div>
                                <span className={`text-[13px] font-bold ${step === 1 ? 'text-[#4D5BFF]' : 'text-slate-400'}`}>
                                    Criar sua Conta
                                </span>
                            </div>
                            <div className="flex-1 h-[1px] bg-slate-200 mx-3" />
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black transition-all duration-300 border-2 ${
                                    step === 2
                                        ? 'bg-[#4D5BFF] border-[#4D5BFF] text-white'
                                        : 'bg-white border-slate-200 text-slate-300'
                                }`}>
                                    2
                                </div>
                                <span className={`text-[13px] font-bold ${step === 2 ? 'text-[#4D5BFF]' : 'text-slate-300'}`}>
                                    Pagamento
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex-1">

                        {/* ══ STEP 1: Criar Conta ══ */}
                        {step === 1 && !isAuthenticated ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight mb-1">
                                        Crie sua Conta
                                    </h2>
                                    <p className="text-[14px] text-slate-400 font-medium">
                                        Você receberá seus dados de acesso por e-mail.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            SEU NOME COMPLETO
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 text-[15px] font-medium text-slate-800 outline-none focus:border-[#4D5BFF] transition-all placeholder:text-slate-300 shadow-sm"
                                            placeholder="Ex: João Silva"
                                            value={guestName}
                                            onChange={e => setGuestName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            SEU E-MAIL
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 text-[15px] font-medium text-slate-800 outline-none focus:border-[#4D5BFF] transition-all placeholder:text-slate-300 shadow-sm"
                                            placeholder="exemplo@email.com"
                                            value={guestEmail}
                                            onChange={e => setGuestEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            SEU WHATSAPP
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 text-[15px] font-medium text-slate-800 outline-none focus:border-[#4D5BFF] transition-all placeholder:text-slate-300 shadow-sm"
                                            placeholder="(11) 99999-9999"
                                            value={guestPhone}
                                            onChange={e => setGuestPhone(e.target.value)}
                                            maxLength={15}
                                        />
                                    </div>
                                </div>

                                {/* Info box */}
                                <div className="bg-[#EEF0FF] rounded-xl p-4 flex items-start gap-3 border border-[#D4D8FF]">
                                    <div className="text-[#4D5BFF] shrink-0 mt-0.5">
                                        <Icons.MessageCircle className="w-5 h-5" />
                                    </div>
                                    <p className="text-[12px] leading-relaxed text-slate-600">
                                        Após o pagamento, você receberá um{' '}
                                        <span className="font-black text-slate-800">e-mail com seus dados de acesso</span>
                                        {' '}para definir sua senha.
                                    </p>
                                </div>

                                <button
                                    onClick={handleStep1Continue}
                                    className="w-full h-14 bg-[#4D5BFF] hover:bg-[#3D4AE5] text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-[#4D5BFF]/25 transition-all flex items-center justify-center gap-2 group"
                                >
                                    Continuar para Pagamento
                                    <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Payment logos below CTA */}
                                <div className="flex items-center justify-center gap-3 pt-1">
                                    <img src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png" alt="Formas de pagamento" className="h-5 w-auto opacity-30 grayscale brightness-0" />
                                </div>
                            </div>

                        ) : (
                        /* ══ STEP 2: Pagamento ══ */
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight mb-1">
                                        Método de Pagamento
                                    </h2>
                                    <p className="text-[14px] text-slate-400 font-medium">Escolha como deseja pagar.</p>
                                </div>

                                {/* ── payment method buttons — separate, close together ── */}
                                <div className="flex gap-2">
                                    {/* Cartão */}
                                    <button
                                        onClick={() => setMethod(region === 'EU' ? 'cc' : 'cc_appmax')}
                                        className={`flex-1 h-12 flex items-center justify-center gap-1.5 rounded-xl border transition-all text-[12px] font-bold ${
                                            (method === 'cc_appmax' || method === 'cc')
                                                ? 'bg-white border-[#4D5BFF] text-[#4D5BFF] shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                        }`}
                                    >
                                        <Icons.CreditCard className="w-4 h-4" />
                                        <span>Cartão</span>
                                    </button>

                                    {/* Pix */}
                                    {region === 'BR' && (
                                        <button
                                            onClick={() => setMethod('pix')}
                                            className={`flex-1 h-12 flex items-center justify-center rounded-xl border transition-all ${
                                                method === 'pix'
                                                    ? 'bg-white border-[#4D5BFF] shadow-sm'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <Icons.Pix className={`h-4 w-auto transition-all ${method === 'pix' ? '' : 'opacity-40'}`} />
                                        </button>
                                    )}

                                    {/* Apple Pay — native sheet */}
                                    <ApplePayButton
                                        plan={plan}
                                        priceNum={priceNum}
                                        region={region}
                                        guestEmail={guestEmail}
                                        guestName={guestName}
                                        onSuccess={handleLocalSuccess}
                                        isActive={method === 'apple_pay'}
                                        onClick={() => setMethod('apple_pay')}
                                    />
                                </div>

                                {/* Payment form */}
                                <div className="mt-1">
                                    {method === 'cc_appmax' ? (
                                        <AppmaxCCPayment 
                                            plan={plan} 
                                            onSuccess={handleLocalSuccess} 
                                            region={region} 
                                            guestEmail={guestEmail} 
                                            guestName={guestName} 
                                            guestPhone={guestPhone}
                                        />
                                    ) : method === 'cc' ? (
                                        clientSecret ? (
                                            <Elements
                                                stripe={stripePromise}
                                                options={{
                                                    clientSecret,
                                                    appearance: {
                                                        theme: 'stripe',
                                                        variables: {
                                                            colorPrimary: '#4D5BFF',
                                                            borderRadius: '12px',
                                                            fontSizeBase: '14px',
                                                        },
                                                    },
                                                }}
                                            >
                                                <StripeForm plan={plan} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} guestPhone={guestPhone} />
                                            </Elements>
                                        ) : (
                                            <div className="py-12 text-center">
                                                <div className="w-8 h-8 border-2 border-slate-100 border-t-[#4D5BFF] rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    Iniciando Checkout Seguro...
                                                </p>
                                            </div>
                                        )
                                    ) : method === 'pix' ? (
                                        <PixPayment plan={plan} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} guestPhone={guestPhone} />
                                    ) : null /* apple_pay is handled natively, no extra UI */}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer logos — only on step 2 (payment) */}
                    {(step === 2 || isAuthenticated) && (
                        <div className="mt-6 pt-5 border-t border-slate-50 flex flex-col items-center">
                            <img
                                src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png"
                                alt="Pagamento seguro"
                                className="h-7 w-auto opacity-30 grayscale brightness-0"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
