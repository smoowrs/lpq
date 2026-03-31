import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';

interface FAQProps {
  t: any;
}

export default function FAQ({ t }: FAQProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 }
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-black relative overflow-hidden border-t border-white/5 order-11 md:order-none">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-[#582ef5]" />
            <span className="text-gray-300 uppercase tracking-wider">{t.faq.title}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            {t.faq.subtitle}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 ${openFaq === idx ? 'bg-white/5 border-white/20' : 'bg-[#0a0a0a] border-white/5 hover:border-white/10'}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className={`font-bold transition-colors ${openFaq === idx ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-white' : 'text-gray-600'}`} />
              </button>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Suporte */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#582ef5]/10 to-[#2b34f5]/5 border border-[#582ef5]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#582ef5] flex items-center justify-center shadow-lg shadow-[#582ef5]/20">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold text-white mb-1">{t.faq.supportTitle}</h4>
              <p className="text-xs text-gray-400">{t.faq.supportDesc}</p>
            </div>
          </div>
          <a
            href="https://wa.me/5562996163351"
            className="px-6 py-3 bg-white text-black text-sm font-black rounded-xl hover:scale-105 transition-transform"
          >
            {t.faq.supportBtn}
          </a>
        </div>
      </div>
    </section>
  );
}
