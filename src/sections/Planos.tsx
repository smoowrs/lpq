import { motion } from 'motion/react';
import { ShieldCheck, Package, CheckCircle2 } from 'lucide-react';
import React from 'react';

interface PlanosProps {
  t: any;
  billingCycle: 'monthly' | 'annual';
  setBillingCycle: (value: 'monthly' | 'annual') => void;
  region: string | null;
  handlePlanClick: (planId: string) => void;
}

export default function Planos({ t, billingCycle, setBillingCycle, region, handlePlanClick }: PlanosProps) {
  return (
    <section id="planos" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-10 md:order-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#582ef5]/10 border border-[#582ef5]/20 text-xs font-semibold mb-6 backdrop-blur-md text-[#582ef5] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.planos.tag}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 text-white">
            {t.planos.title}
          </h2>

          {/* Toggles Container */}
          <div className="flex flex-col items-center gap-4">
            {/* Billing Toggle */}
            <div className="bg-[#111] p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 shadow-2xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t.planos.monthly}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t.planos.annual}
                <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black">{t.planos.annualOff}</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {[
            { id: 'free', data: t.planos.free, color: '#444', secondary: '#222' },
            { id: 'starter', data: t.planos.starter, color: '#aaa', secondary: '#555' },
            { id: 'pro', data: t.planos.pro, color: '#582ef5', secondary: '#2b34f5' },
            { id: 'elite', data: t.planos.elite, color: '#f59e0b', secondary: '#d97706' }
          ].map((plan, idx) => {
            const isBrasil = region === 'brasil';
            const isAnnual = billingCycle === 'annual';
            const priceAvailable = plan.id === 'free' ? '0' : (isBrasil 
                ? (isAnnual ? (plan.id === 'starter' ? '14,95' : plan.id === 'pro' ? '29,95' : '49,95') : (plan.data.monthlyPrice || plan.data.price))
                : (isAnnual ? (plan.id === 'starter' ? '59,40' : plan.id === 'pro' ? '119,40' : '239,40') : (plan.id === 'starter' ? '9,90' : plan.id === 'pro' ? '19,90' : '39,90')));
            
            const [whole, cents] = priceAvailable.includes(',') ? priceAvailable.split(',') : [priceAvailable, '00'];
            const period = isBrasil ? plan.data.period : (isAnnual ? '/ ano' : '/ mês');

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group h-full flex flex-col p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden ${plan.id === 'pro' ? 'ring-2 ring-[#582ef5]/30' : ''}`}
              >
                {/* Accent Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: plan.color }} />

                {/* Icon - hidden for free plan */}
                {plan.id !== 'free' && (
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-xl">
                    <Package className="w-6 h-6" style={{ color: plan.color }} />
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:scale-105 transition-transform origin-left" style={{ color: plan.id === 'free' ? 'white' : plan.color }}>{plan.data.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium min-h-[40px]">{plan.data.desc}</p>
                </div>

                {/* Price - hidden for free plan */}
                {plan.id !== 'free' && (
                  <div className="mb-8">
                    {!isBrasil && isAnnual && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-500 line-through">
                          € {plan.id === 'starter' ? '118,80' : plan.id === 'pro' ? '238,80' : '478,80'}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-black">
                          -50%
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <div className="flex flex-col">
                        {isBrasil && isAnnual && (
                          <span className="text-xs font-black text-[#582ef5] leading-none mb-1">12X</span>
                        )}
                        <span className="text-xs font-black text-gray-400 leading-none">{isBrasil ? 'R$' : '€'}</span>
                      </div>
                      <span className="text-[44px] font-black tracking-tighter text-white leading-none">
                        {whole}
                      </span>
                      {cents !== '00' && (
                        <span className="text-[20px] font-black text-white/50 leading-none self-end pb-1">,{cents}</span>
                      )}
                      <span className="text-sm font-bold text-gray-500 self-end pb-1">
                        {!isBrasil && isAnnual ? '/ano' : plan.data.period}
                      </span>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4 mb-10 flex-1">
                  {plan.data.items.map((feature: any, i: number) => (
                    <div key={i} className={`flex items-start gap-3 text-sm ${feature.bold ? 'text-white font-bold' : 'text-gray-400'}`}>
                      <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handlePlanClick(plan.id)}
                  className={`w-full py-5 rounded-2xl font-black text-sm transition-all duration-300 relative overflow-hidden group/btn ${plan.id === 'pro'
                      ? 'bg-white text-black hover:scale-[1.02] shadow-[0_20px_40px_rgba(255,255,255,0.1)]'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                    }`}
                >
                  <span className="relative z-10">{plan.id === 'free' ? t.planos.ctaFree : t.planos.cta}</span>
                  {plan.id === 'pro' && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer"
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
