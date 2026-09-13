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
import { trackGoogleAdsPurchase } from '../services/googleAds';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bfyfzpjivesrbcxilmzd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeWZ6cGppdmVzcmJjeGlsbXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTE1ODUsImV4cCI6MjA4NjIyNzU4NX0.4q3uB1PrFPbaH4lunmQ6wZU0jNABg2D0i45JRHXo_K0';

// ── Tabela de parcelas Appmax — 30% off + juros repassados ao comprador ──
// Calculado com base nos multiplicadores originais escalados para os novos preços:
// Starter: 67,90 (antes 58,20) | Pro: 137,90 (antes 118,20) | Elite: 272,30 (antes 233,40)
const INSTALLMENTS: Record<string, { value: string; total: string }[]> = {
    starter: [
        { value: '67,90',  total: '67,90'  }, // 1x  sem juros
        { value: '35,95',  total: '71,90'  }, // 2x
        { value: '24,61',  total: '73,82'  }, // 3x
        { value: '18,98',  total: '75,90'  }, // 4x
        { value: '15,57',  total: '77,84'  }, // 5x
        { value: '13,32',  total: '79,91'  }, // 6x
        { value: '11,70',  total: '81,88'  }, // 7x
        { value: '10,49',  total: '83,90'  }, // 8x
        { value: '9,55',   total: '85,98'  }, // 9x
        { value: '8,80',   total: '88,00'  }, // 10x
        { value: '8,18',   total: '89,94'  }, // 11x
        { value: '7,66',   total: '91,88'  }, // 12x
    ],
    pro: [
        { value: '137,90',  total: '137,90'  }, // 1x  sem juros
        { value: '72,31',   total: '144,62'  }, // 2x
        { value: '49,35',   total: '148,04'  }, // 3x
        { value: '37,86',   total: '151,46'  }, // 4x
        { value: '30,99',   total: '154,95'  }, // 5x
        { value: '26,38',   total: '158,28'  }, // 6x
        { value: '23,12',   total: '161,82'  }, // 7x
        { value: '20,65',   total: '165,20'  }, // 8x
        { value: '18,74',   total: '168,62'  }, // 9x
        { value: '17,21',   total: '172,08'  }, // 10x
        { value: '15,96',   total: '175,54'  }, // 11x
        { value: '14,91',   total: '178,90'  }, // 12x
    ],
    elite: [
        { value: '272,30',  total: '272,30'  }, // 1x  sem juros
        { value: '142,81',  total: '285,61'  }, // 2x
        { value: '97,48',   total: '292,44'  }, // 3x
        { value: '74,81',   total: '299,24'  }, // 4x
        { value: '61,21',   total: '306,05'  }, // 5x
        { value: '52,12',   total: '312,75'  }, // 6x
        { value: '45,66',   total: '319,62'  }, // 7x
        { value: '40,78',   total: '326,26'  }, // 8x
        { value: '37,00',   total: '333,01'  }, // 9x
        { value: '33,99',   total: '339,90'  }, // 10x
        { value: '31,53',   total: '346,81'  }, // 11x
        { value: '29,49',   total: '353,83'  }, // 12x
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

function getTrackingData() {
    const params = new URLSearchParams(window.location.search);
    const tracking: any = {};
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'xcod', 'sck', 'src'];
    
    keys.forEach(key => {
        const val = params.get(key);
        if (val) tracking[key] = val;
    });

    try {
        // Enforce lowercase keys for consistency if needed, but Appmax/UTMify usually expect these
        keys.forEach(key => {
            if (!tracking[key]) {
                const lsVal = localStorage.getItem(key);
                if (lsVal) tracking[key] = lsVal;
            }
        });

        // Add Facebook fbp and fbc from cookies
        const fbp = document.cookie.match(/(^|;)\s*_fbp\s*=\s*([^;]+)/);
        if (fbp) tracking.fbp = decodeURIComponent(fbp[2]);

        const fbc = document.cookie.match(/(^|;)\s*_fbc\s*=\s*([^;]+)/);
        if (fbc) tracking.fbc = decodeURIComponent(fbc[2]);

    } catch (e) {
        console.error('Error getting tracking data:', e);
    }

    return Object.keys(tracking).length > 0 ? tracking : undefined;
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
                const parts = guestName?.split(' ') || [];
                trackAddPaymentInfo(plan?.label || plan?.id || 'unknown', {
                    email: guestEmail,
                    firstName: parts[0] || '',
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <PaymentElement
                onChange={handlePaymentElementChange}
                options={{
                    layout: 'tabs',
                    wallets: { applePay: 'never', googlePay: 'never' },
                    link: { email: 'never' },
                    terms: { card: 'never' },
                }}
            />
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{ width: '16px', height: '16px', marginTop: '2px' }}
                />
                <span style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Ao fornecer os seus dados, você permite que a Stripe faça a cobrança no seu cartão de acordo com os seus termos.
                </span>
            </label>
            <button
                type="submit"
                disabled={loading || !stripe || !agreedToTerms}
                style={{
                    width: '100%', padding: '18px', background: (loading || !stripe || !agreedToTerms) ? '#94a3b8' : '#254bff',
                    color: '#fff', borderRadius: '14px', fontSize: '17px', fontWeight: '700', border: 'none', cursor: (loading || !stripe || !agreedToTerms) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Processando...' : 'Comprar →'}
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

    if (!canPay) return null;

    return (
        <button
            onClick={handleClick}
            style={{
                flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#000', borderRadius: '12px', border: isActive ? '2px solid #254bff' : '1px solid #e2e8f0', cursor: 'pointer'
            }}
        >
            <img
                src="https://i.postimg.cc/YS7x3Xjp/5977576_2.png"
                style={{ height: '28px', filter: 'invert(1)' }}
                alt="Apple Pay"
            />
        </button>
    );
};

/* ─── PIX PAYMENT ─────────────────────────────────────────────── */
const PixPayment = ({ plan, onSuccess, guestEmail, guestName, guestPhone, orderBump, orderBumpPrice }: any) => {
    const [pixData, setPixData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [cpf, setCpf] = useState('');
    const [copiedMessage, setCopiedMessage] = useState(false);
    const hasFiredAddPaymentInfo = useRef(false);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Formata visualmente: 000.000.000-00
        const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
        let formatted = digits;
        if (digits.length > 9) {
            formatted = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6, 9) + '-' + digits.slice(9);
        } else if (digits.length > 6) {
            formatted = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6);
        } else if (digits.length > 3) {
            formatted = digits.slice(0, 3) + '.' + digits.slice(3);
        }
        setCpf(formatted);
        if (!hasFiredAddPaymentInfo.current && digits.length > 0) {
            hasFiredAddPaymentInfo.current = true;
            try { 
                const parts = guestName?.split(' ') || [];
                trackAddPaymentInfo('PIX', {
                    email: guestEmail,
                    firstName: parts[0] || '',
                    phone: guestPhone?.replace(/\D/g, '')
                }); 
            } catch {}
        }
    };

    useEffect(() => {
        if (!pixData) return;
        // Para quando o tempo expirar (timeLeft <= 0)
        if (timeLeft <= 0) return;
        const statusInterval = setInterval(checkPaymentStatus, 3000); // 3s para detecção mais rápida
        const timerInterval = setInterval(() => setTimeLeft(t => {
            if (t <= 1) {
                clearInterval(statusInterval); // Para o polling ao expirar
                clearInterval(timerInterval);
            }
            return Math.max(0, t - 1);
        }), 1000);
        return () => { clearInterval(statusInterval); clearInterval(timerInterval); };
    }, [pixData, timeLeft <= 0]); // Re-roda se pixData muda ou expirou

    const handleGeneratePix = async () => {
        if (!agreedToTerms) {
            toast.error('Aceite os termos para continuar');
            return;
        }
        const cleanCpf = cpf.replace(/\D/g, '');
        if (!cleanCpf || cleanCpf.length < 11) {
            toast.error('Informe um CPF válido (11 dígitos)');
            return;
        }
        if (!guestEmail || !guestEmail.includes('@')) {
            toast.error('Email inválido. Volte e preencha seus dados');
            return;
        }
        // Calcula o valor correto a cobrar no PIX
        const basePriceNum = parseFloat(
            (plan.prices?.BR?.annual || plan.prices?.[plan.region]?.annual || '0').replace(',', '.')
        );
        const totalAmount = basePriceNum + (orderBump ? (orderBumpPrice || 0) : 0);
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
                body: JSON.stringify({
                    plan,
                    amount: totalAmount,
                    cpf: cleanCpf,
                    email: guestEmail,
                    name: guestName,
                    phone: guestPhone,
                    tracking: getTrackingData(),
                    orderBump: orderBump || false,
                    orderBumpPrice: orderBump ? orderBumpPrice : 0,
                }),
            });
            const data = await res.json();
            if (data?.error || data?.message?.toLowerCase().includes('error')) throw new Error(data.error || data.message);
            if (!data?.payload && !data?.qr_code) throw new Error('PIX não gerado. Tente novamente.');
            setPixData(data);
        } catch (err: any) {
            toast.error(err?.message || 'Erro ao gerar PIX. Tente novamente.');
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
                // email + name sent as fallback in case payment_intents doesn't have guest_email
                body: JSON.stringify({ id: pixData?.id, email: guestEmail, name: guestName }),
            });
            const data = await res.json();
            const status = (data?.status || '').toLowerCase();
            if (['approved', 'paid', 'completed', 'authorized'].includes(status)) onSuccess();
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
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
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
                disabled={loading}
                className="w-full h-14 bg-[#4D5BFF] hover:bg-[#3D4AE5] text-white rounded-2xl font-bold text-base transition-all disabled:opacity-60 shadow-lg shadow-[#4D5BFF]/20"
            >
                {loading ? 'Gerando...' : 'Gerar QR Code PIX'}
            </button>
        </div>
    );
};

/* ─── APPMAX CC ─────────────────────────────────────────────────── */
const AppmaxCCPayment = ({ plan, onSuccess, region, guestEmail, guestName, guestPhone, orderBump, orderBumpPrice, onInstallmentChange }: any) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ card_number: '', card_name: '', card_expiry: '', card_cvv: '', cpf: '', installments: '1', country: 'BR' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const hasFiredAddPaymentInfo = useRef(false);

    const planInstallments = INSTALLMENTS[plan.id] || [];

    // Recalculate installment values if order bump is active
    const adjustedInstallments = planInstallments.map((inst: any, i: number) => {
        if (!orderBump || !orderBumpPrice) return inst;
        const n = i + 1;
        const baseValue = parseFloat(inst.value.replace(',', '.'));
        const baseTotal = parseFloat(inst.total.replace(',', '.'));
        const newValue = (baseValue + orderBumpPrice / n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const newTotal = (baseTotal + orderBumpPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return { value: newValue, total: newTotal };
    });

    const selectedIdx = parseInt(formData.installments) - 1;
    const selectedInfo = adjustedInstallments[selectedIdx];

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
        
        if (!hasFiredAddPaymentInfo.current && formatted.length > 0) {
            hasFiredAddPaymentInfo.current = true;
            try {
                const parts = guestName?.split(' ') || [];
                trackAddPaymentInfo(plan?.label || plan?.id || 'Appmax CC', {
                    email: guestEmail,
                    firstName: parts[0] || '',
                    phone: guestPhone?.replace(/\D/g, '')
                });
            } catch {}
        }

        if (name === 'installments' && onInstallmentChange) {
            const idx = parseInt(value) - 1;
            onInstallmentChange(adjustedInstallments[idx] || null, parseInt(value));
        }
    };

    const handleProcessPayment = async (e: any) => {
        e.preventDefault();
        if (!agreedToTerms) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            // Calculate the total amount WITH interest from the installments table
            // so the buyer pays the interest, not the seller
            const instIdx = parseInt(formData.installments) - 1;
            const instInfo = adjustedInstallments[instIdx];
            // PT-BR format: dots are thousands separators, comma is decimal → "1.234,56" → 1234.56
            const totalWithInterest = instInfo
                ? parseFloat(instInfo.total.replace(/\./g, '').replace(',', '.'))
                : undefined;

            const data = await invokeFn('process-appmax-cc', { 
                plan, 
                paymentData: { ...formData, email: guestEmail, name: guestName, phone: guestPhone?.replace(/\D/g, '') },
                tracking: getTrackingData(),
                orderBump: orderBump || false,
                orderBumpPrice: orderBump ? orderBumpPrice : 0,
                // Send total WITH interest so Appmax charges the buyer correctly
                amount: totalWithInterest,
            }, session?.access_token || null);
            if (data?.success) onSuccess();
            else throw new Error(data?.error || data?.message || 'Erro ao processar pagamento');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', boxSizing: 'border-box' as const };
    const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' };

    return (
        <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label style={labelStyle}>NÚMERO DO CARTÃO</label>
                <input
                    name="card_number"
                    type="tel"
                    inputMode="numeric"
                    placeholder="1234 1234 1234 1234"
                    required
                    style={inputStyle}
                    value={formData.card_number}
                    onChange={handleInputChange}
                    maxLength={19}
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>NOME NO CARTÃO</label>
                    <input
                        name="card_name"
                        placeholder="Nome impresso"
                        required
                        style={inputStyle}
                        value={formData.card_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label style={labelStyle}>CPF DO TITULAR</label>
                    <input
                        name="cpf"
                        type="tel"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        required
                        style={inputStyle}
                        value={formData.cpf}
                        onChange={handleInputChange}
                        maxLength={14}
                    />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>DATA DE VALIDADE</label>
                    <input
                        name="card_expiry"
                        type="tel"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        required
                        style={inputStyle}
                        value={formData.card_expiry}
                        onChange={handleInputChange}
                        maxLength={5}
                    />
                </div>
                <div>
                    <label style={labelStyle}>CÓDIGO (CVC)</label>
                    <input
                        name="card_cvv"
                        type="tel"
                        inputMode="numeric"
                        placeholder="123"
                        required
                        style={inputStyle}
                        value={formData.card_cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                    />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>PARCELAS</label>
                    <select name="installments" style={{...inputStyle, appearance: 'auto'}} value={formData.installments} onChange={handleInputChange}>
                        {adjustedInstallments.map((inst: any, i: number) => {
                            const n = i + 1;
                            return (
                                <option key={n} value={n}>
                                    {n}x de R$ {inst.value}
                                </option>
                            );
                        })}
                        {adjustedInstallments.length === 0 && Array.from({ length: 21 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}x</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>PAÍS</label>
                    <select name="country" style={{...inputStyle, appearance: 'auto'}} value={formData.country} onChange={handleInputChange}>
                        <option value="BR">Brasil</option>
                        <option value="US">Estados Unidos</option>
                        <option value="PT">Portugal</option>
                    </select>
                </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginTop: '4px' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px' }} checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
                <span style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Ao fornecer os seus dados, você permite que a Appmax realize a cobrança no seu cartão.
                </span>
            </label>

            <button
                type="submit"
                disabled={loading || !agreedToTerms}
                style={{
                    width: '100%', background: (!agreedToTerms || loading) ? '#94a3b8' : '#254bff', color: '#fff', borderRadius: '14px', padding: '18px', fontSize: '17px', fontWeight: '700', border: 'none', cursor: (!agreedToTerms || loading) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Processando...' : 'Comprar →'}
            </button>
        </form>
    );
};

/* ─── ORDER SUMMARY SECTION ────────────────────────────────────── */
const OrderSummary = ({ plan, region, priceStr, totalPriceStr, orderBump, monthly12x, currencySymbol, planDisplayName, selectedInstallment, planAccessDuration, oldPriceStr }: any) => {
    const displayPrice = orderBump ? totalPriceStr : priceStr;
    const showDiscount = region === 'BR' && !plan.free && oldPriceStr && !orderBump;
    return (
        <div className="w-full bg-white border-b border-slate-100">
            <div className="flex items-center gap-3 px-5 py-3">
                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                    <img src="https://i.postimg.cc/Cx0Wn1pW/drone.webp" alt="Plano" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">RESUMO DO PEDIDO</p>
                    <p className="text-[16px] font-black text-slate-900 leading-tight">{planDisplayName}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{planAccessDuration}{orderBump ? ' + Networking' : ''}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    {showDiscount && (
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] text-slate-400 line-through font-medium">{currencySymbol} {oldPriceStr}</span>
                            <span className="text-[9px] font-black text-white bg-emerald-500 rounded-full px-1.5 py-0.5 leading-none">30% OFF</span>
                        </div>
                    )}
                    <span className="text-[17px] font-black text-slate-900 transition-all duration-300">{currencySymbol} {displayPrice}</span>
                    {!orderBump && region === 'BR' && <span className="text-[10px] text-slate-400 font-medium opacity-90 mt-0.5">Ou 12x de {currencySymbol} {monthly12x}</span>}
                    {orderBump && <span className="text-[10px] text-emerald-600 font-black mt-0.5">Inclui Grupo de Networking</span>}
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
    const [selectedInstallment, setSelectedInstallment] = useState<{ n: number; info: { value: string; total: string } | null }>({ n: 1, info: region === 'BR' ? (INSTALLMENTS[plan.id]?.[0] || null) : null });
    const [orderBump, setOrderBump] = useState(false);
    const showOrderBump = region === 'BR' && ['starter', 'pro'].includes(plan.id?.toLowerCase());
    const ORDER_BUMP_PRICE = 49.90;
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const priceNum = parseFloat((plan.prices?.[region]?.annual || '0').replace(',', '.'));
    const priceStr = priceNum.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const totalPriceNum = priceNum + (orderBump ? ORDER_BUMP_PRICE : 0);
    const totalPriceStr = totalPriceNum.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    // Preço original antes do desconto (ex: "R$ 97,00" → "97,00")
    const oldPriceStr = region === 'BR' && plan.priceOriginal
        ? plan.priceOriginal.replace('R$ ', '').replace('R$', '').trim()
        : null;
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
        const purchaseCurrency = region === 'EU' ? 'EUR' : 'BRL';
        const purchaseValue = totalPriceNum;

        // trackPurchase → trackFBEvent:
        //   1. Dispara fbq('track','Purchase') SINCRONAMENTE (antes de qualquer await)
        //   2. Envia CAPI com o MESMO eventId → deduplicação correta no Facebook
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const nameParts = guestName?.trim().split(/\s+/) || [];
        trackPurchase(plan.label || plan.id, purchaseValue, purchaseCurrency, orderId, {
            email: guestEmail,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            phone: guestPhone?.replace(/\D/g, '') || '',
        });
        trackGoogleAdsPurchase(purchaseValue, purchaseCurrency);
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
                    billingCycle: plan.billingCycle,
                    // sendEmail:true — safety net: garante email caso server-side falhe
                    // activate-user não duplica para usuários criados há menos de 2min
                    sendEmail: true,
                    // grantCredits:false — créditos já concedidos por process-appmax-cc/check-pix-status
                    grantCredits: false,
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
        setMounted(true);
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
                    amount: parseFloat((plan.prices?.[region]?.annual || '0').replace(',', '.')),
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
        const nameParts = guestName?.split(' ') || [];
        trackLead(plan.label || plan.id, priceNum, region === 'EU' ? 'EUR' : 'BRL', {
            email: guestEmail,
            firstName: nameParts[0] || '',
            phone: guestPhone.replace(/\D/g, ''),
        });
        setStep(2);
    };

    if (!mounted) return null;

    const BG = '#F7F8FC';
    const BLUE = '#254bff';
    const planEmoji = plan.id === 'elite' ? '👑' : plan.id === 'pro' ? '🌎' : '🌎';
    const stepEyebrow = step === 1 ? '01 / VAMOS NOS CONHECER' : '02 / QUASE LÁ';
    const stepHeading = step === 1 ? 'Seu próximo passo.' : 'Do seu jeito.';
    const stepSub = step === 1
        ? 'Crie sua conta para entrar no universo Connect.'
        : 'Escolha como deseja pagar e comece seu próximo capítulo.';

    const userInitials = guestName.trim().split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || '??';

    return createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: BG, display: 'flex', flexDirection: 'column', overflowY: 'auto', fontFamily: 'system-ui,-apple-system,sans-serif', color: '#0f172a' }}>

            {/* Payment approved overlay */}
            {isPaymentApproved && (
                <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, marginBottom: 24 }}>
                        <img src="https://i.postimg.cc/8CypNtWj/IMG-3409.gif" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Success" />
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px' }}>Pagamento Aprovado!</h2>
                    <p style={{ fontSize: 14, color: '#64748b', maxWidth: 280, lineHeight: 1.6, margin: '0 0 24px' }}>
                        Seu acesso ao Connect Academy foi liberado. Verifique seu e-mail.
                    </p>
                </div>
            )}

            {/* ── HEADER ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #EAECF0', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 20 }}>
                <button onClick={() => { window.location.href = '/#planos'; }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14 }}>
                    ← Voltar
                </button>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <img src="/portal/assets/logo.png" alt="Connect Academy" style={{ height: 28, width: 'auto', display: 'block' }} />
                </div>
                <div style={{ width: 32 }} />
            </div>

            {/* ── BANNER ── */}
            <div style={{ margin: '16px 16px 0', borderRadius: 12, overflow: 'hidden', height: 140, background: '#0a0a1a', position: 'relative', flexShrink: 0 }}>
                <img src="/portal/assets/banner-checkout.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', opacity: 0.6 }} />
                <div style={{ position: 'absolute', inset: 0, padding: '20px 22px' }}>
                    <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 8px' }}>O PRIMEIRO PASSO É SEU.</p>
                    <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.1, fontFamily: "'Bricolage Grotesque',system-ui" }}>
                        Seu próximo<br /><em style={{ fontStyle: 'italic', fontWeight: 700 }}>capítulo.</em>
                    </h2>
                </div>
            </div>

            {/* ── ORDER SUMMARY CARD ── */}
            <div style={{ margin: '12px 16px 0', background: '#fff', borderRadius: 16, border: '1px solid #E8EAF0', padding: '14px 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>RESUMO DO PEDIDO</span>
                    {region === 'BR' && <span style={{ background: '#EEF2FF', color: BLUE, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>30% OFF</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 54, height: 54, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                        {planEmoji}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Plano</div>
                        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque',system-ui", lineHeight: 1.1 }}>
                            {(plan.label || '').replace(/[🥇🌏🪙💙]/g, '').trim()}<span style={{ color: BLUE }}>.</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>• {planAccessDuration}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {region === 'BR' && oldPriceStr && <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through', marginBottom: 2 }}>R$ {oldPriceStr}</div>}
                        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{currencySymbol} {orderBump ? totalPriceStr : priceStr}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid #F1F3F7', fontSize: 12, color: '#94a3b8' }}>
                    <span style={{ fontStyle: 'italic' }}>
                        {plan.id === 'starter' ? 'Um novo começo, do seu jeito.' : plan.id === 'pro' ? 'O melhor custo-benefício.' : 'Acesso total para sempre.'}
                    </span>
                    {region === 'BR' && <span>Ou 12x de R$ {monthly12x}</span>}
                </div>
            </div>

            {/* ── STEP INDICATOR ── */}
            {!isAuthenticated && (
                <div style={{ margin: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: step === 1 ? BLUE : '#e2e8f0', color: step === 1 ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                            {step > 1 ? '✓' : '1'}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: step === 1 ? BLUE : '#94a3b8', whiteSpace: 'nowrap' }}>Crie sua conta</span>
                    </div>
                    <div style={{ flex: 1, height: 2, background: '#e2e8f0', margin: '0 8px 16px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: step === 2 ? BLUE : '#e2e8f0', color: step === 2 ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>2</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: step === 2 ? BLUE : '#94a3b8' }}>Pagamento</span>
                    </div>
                </div>
            )}

            {/* ── CONTENT AREA ── */}
            <div style={{ maxWidth: 480, width: '100%', margin: '0 auto', padding: '20px 16px 40px', flex: 1 }}>

                {/* Sem texto de prévia */}

                {/* Step eyebrow + heading */}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#94a3b8', margin: '0 0 6px', textTransform: 'uppercase' }}>{stepEyebrow}</p>
                <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 6px', fontFamily: "'Bricolage Grotesque',system-ui", letterSpacing: '-0.02em', lineHeight: 1.1 }}>{stepHeading}</h1>
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px' }}>{stepSub}</p>

                {/* ══ STEP 1 ══ */}
                {step === 1 && !isAuthenticated && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Name */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Seu nome completo</label>
                            <input
                                type="text"
                                placeholder="Seu nome"
                                value={guestName}
                                onChange={e => setGuestName(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', fontSize: 16, outline: 'none', background: '#fff' }}
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Seu e-mail</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={guestEmail}
                                onChange={e => setGuestEmail(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', fontSize: 16, outline: 'none', background: '#fff' }}
                            />
                        </div>
                        {/* WhatsApp */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Seu WhatsApp</label>
                            <div style={{ display: 'flex', border: '1.5px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', borderRight: '1px solid #E2E8F0', color: '#64748b', fontSize: 14, whiteSpace: 'nowrap', gap: 6 }}>
                                    {region === 'EU' ? '🇵🇹 +351' : '🇧🇷 +55'}
                                </div>
                                <input
                                    type="tel"
                                    placeholder={region === 'EU' ? '912 345 678' : '(11) 99999-9999'}
                                    value={guestPhone}
                                    onChange={e => {
                                        const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                                        let masked = digits;
                                        if (region !== 'EU') {
                                            if (digits.length > 6) masked = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
                                            else if (digits.length > 2) masked = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
                                            else if (digits.length > 0) masked = `(${digits}`;
                                        }
                                        setGuestPhone(masked);
                                    }}
                                    style={{ flex: 1, border: 'none', padding: '14px 16px', fontSize: 16, outline: 'none', background: 'transparent' }}
                                    maxLength={16}
                                />
                            </div>
                        </div>

                        {/* Info box */}
                        <div style={{ background: '#EEF2FF', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 18, flexShrink: 0 }}>✉</span>
                            <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                                Depois do pagamento, você recebe um <strong>e-mail com seus dados de acesso</strong> para definir sua senha. Simples assim.
                            </p>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleStep1Continue}
                            style={{ width: '100%', padding: '18px', background: BLUE, color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                            Continuar para Pagamento →
                        </button>
                        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', margin: 0 }}>Falta só mais um passo para começar.</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png" alt="Formas de pagamento" style={{ height: 20, opacity: 0.4, filter: 'grayscale(1)' }} />
                        </div>
                    </div>
                )}

                {/* ══ STEP 2 ══ */}
                {(step === 2 || isAuthenticated) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* User card (if guest, show edit option) */}
                        {!isAuthenticated && guestName && (
                            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8EAF0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: BLUE, flexShrink: 0 }}>
                                    {userInitials}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{guestName}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>{guestEmail}</div>
                                </div>
                                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BLUE, fontSize: 13, fontWeight: 600 }}>Editar</button>
                            </div>
                        )}

                        {/* Order bump */}
                        {showOrderBump && (
                            <label htmlFor="order-bump-checkbox" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 14, border: `2px solid ${orderBump ? BLUE : '#E2E8F0'}`, background: orderBump ? '#EEF2FF' : '#fff', cursor: 'pointer' }}>
                                <div style={{ position: 'relative', flexShrink: 0, marginTop: 2 }}>
                                    <input id="order-bump-checkbox" type="checkbox" checked={orderBump} onChange={e => setOrderBump(e.target.checked)} style={{ width: 18, height: 18, accentColor: BLUE, cursor: 'pointer' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>UMA CONEXÃO A MAIS</span>
                                        <span style={{ fontSize: 13, fontWeight: 700 }}>+R$49,90</span>
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>Grupo de Networking exclusivo no WhatsApp</p>
                                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>Além do aplicativo, participe do grupo exclusivo de Networking. Converse diretamente e diariamente com quem está no mesmo caminho que você.</p>
                                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                                        <span style={{ fontSize: 12, color: BLUE, fontWeight: 600, cursor: 'pointer' }}>Adicionar ao pedido</span>
                                    </div>
                                </div>
                            </label>
                        )}

                        {/* Payment method selector */}
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Como você prefere pagar?</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    onClick={() => setMethod(region === 'EU' ? 'cc' : 'cc_appmax')}
                                    style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, border: `2px solid ${(method === 'cc_appmax' || method === 'cc') ? BLUE : '#E2E8F0'}`, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: (method === 'cc_appmax' || method === 'cc') ? BLUE : '#64748b' }}
                                >
                                    Cartão
                                </button>
                                {region === 'BR' && (
                                    <button
                                        onClick={() => setMethod('pix')}
                                        style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, border: `2px solid ${method === 'pix' ? BLUE : '#E2E8F0'}`, background: '#fff', cursor: 'pointer' }}
                                    >
                                        <Icons.Pix style={{ height: 14, width: 'auto', maxWidth: 44, display: 'block' }} />
                                    </button>
                                )}
                                <ApplePayButton plan={plan} priceNum={totalPriceNum} region={region} guestEmail={guestEmail} guestName={guestName} onSuccess={handleLocalSuccess} isActive={method === 'apple_pay'} onClick={() => setMethod('apple_pay')} />
                            </div>
                        </div>

                        {/* Payment form */}
                        <div>
                            {method === 'cc_appmax' ? (
                                <AppmaxCCPayment
                                    plan={plan} onSuccess={handleLocalSuccess} region={region}
                                    guestEmail={guestEmail} guestName={guestName} guestPhone={guestPhone}
                                    orderBump={orderBump} orderBumpPrice={ORDER_BUMP_PRICE}
                                    onInstallmentChange={(info: any, n: number) => setSelectedInstallment({ n, info })}
                                />
                            ) : method === 'cc' ? (
                                clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: BLUE, borderRadius: '12px', fontSizeBase: '14px' } } }}>
                                        <StripeForm plan={plan} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} guestPhone={guestPhone} />
                                    </Elements>
                                ) : (
                                    <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                        <div style={{ width: 32, height: 32, border: `3px solid ${BLUE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
                                        <p style={{ fontSize: 12, color: '#94a3b8' }}>Iniciando checkout seguro...</p>
                                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                                    </div>
                                )
                            ) : method === 'pix' ? (
                                <PixPayment plan={plan} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} guestPhone={guestPhone} orderBump={orderBump} orderBumpPrice={ORDER_BUMP_PRICE} />
                            ) : null}
                        </div>

                        {/* Order total */}
                        {(method === 'cc_appmax' || method === 'cc' || method === 'pix') && (
                            <div style={{ borderTop: '1px solid #F1F3F7', paddingTop: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontSize: 13, color: '#64748b' }}>{planAccessDuration}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{currencySymbol} {priceStr}</span>
                                </div>
                                {orderBump && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, color: '#64748b' }}>
                                        <span>Grupo Networking</span>
                                        <span>R$ 49,90</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600 }}>Total do pedido</div>
                                        {region === 'BR' && oldPriceStr && (
                                            <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>De R$ {oldPriceStr}</div>
                                        )}
                                        {region === 'BR' && (method === 'cc_appmax' || method === 'cc') && (
                                            <div style={{ fontSize: 12, color: '#64748b' }}>
                                                Ou {selectedInstallment.n}x de R$ {selectedInstallment.info?.value || monthly12x}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque',system-ui" }}>{currencySymbol} {orderBump ? totalPriceStr : priceStr}</div>
                                </div>
                            </div>
                        )}
                        {/* Logos de cartão na aba pagamento */}
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                            <img src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png" alt="Formas de pagamento" style={{ height: 20, opacity: 0.35, filter: 'grayscale(1)' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── FOOTER BAR ── */}
            <div style={{ background: '#fff', borderTop: '1px solid #EAECF0', padding: '14px 20px', flexShrink: 0, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                    © 2026 Connect Academy Ltda.<br />
                    <span style={{ fontSize: 10 }}>Todos os direitos reservados · CNPJ: 44.292.841/0001-85</span>
                </p>
            </div>
        </div>,
        document.body
    );
};

