import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2 } from 'lucide-react';
import React from 'react';

interface RastreioProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
  trackingStages: any[];
  trackingStep: number;
}

export default function Rastreio({ t, scrollToPlanos, trackingStages, trackingStep }: RastreioProps) {
  return (
    <section id="rastreio" className="py-32 px-6 relative overflow-hidden order-8 md:order-none">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#2b34f5]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#582ef5]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col justify-center min-h-[500px] md:min-h-[580px] lg:min-h-[620px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#582ef5]/15 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2b34f5]/10 rounded-full blur-3xl opacity-30" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t.rastreio.status}</h3>
                </div>
                <div className="px-5 py-2 bg-[#582ef5] text-white rounded-xl text-[10px] md:text-[11px] font-extrabold border border-white/20 uppercase tracking-widest shadow-[0_0_25px_rgba(88,46,245,0.4)] animate-pulse">
                  {t.rastreio.moving}
                </div>
              </div>

              <div className="space-y-8">
                {trackingStages.map((stage, index) => {
                  const isActive = index <= trackingStep;
                  const isCurrent = index === trackingStep;
                  return (
                    <div key={index} className="flex gap-6 relative">
                      {index < trackingStages.length - 1 && (
                        <div className={`absolute left-[15px] top-10 bottom-[-32px] w-[2px] ${isActive ? 'bg-[#582ef5]' : 'bg-white/10'}`} />
                      )}
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-700 ${isActive ? 'bg-[#582ef5] text-white shadow-[0_0_25px_rgba(88,46,245,0.5)]' : 'bg-white/5 text-gray-600 border border-white/10'
                        }`}>
                        {stage.icon}
                      </div>
                      <div className={`pt-1 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                        <p className={`text-[15px] md:text-[17px] font-bold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{t.rastreio.stages[index].title}</p>
                        <p className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-1 font-medium italic opacity-80">
                          <Clock className="w-3.5 h-3.5" /> {t.rastreio.stages[index].time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 md:order-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
            <Package className="w-3.5 h-3.5 text-[#582ef5]" />
            <span className="text-gray-300 uppercase tracking-wider">{t.rastreio.tag}</span>
          </div>
          <h2 className="text-[28px] md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            {/* Versão Desktop */}
            <span className="hidden md:block">
              {t.rastreio.title1} <br />
              <span className="text-gradient-ai">{t.rastreio.title2}</span>
            </span>
            {/* Versão Mobile */}
            <span className="md:hidden block whitespace-nowrap text-[26px]">
              {t.rastreio.titleMob}
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed">
            {t.rastreio.desc}
          </p>
          <ul className="space-y-4 mb-10">
            {t.rastreio.items.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-[#582ef5]/20 flex items-center justify-center border border-[#582ef5]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#582ef5]" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <motion.button
            whileHover="hover"
            initial="initial"
            whileTap={{ scale: 0.95 }}
            onClick={scrollToPlanos}
            className="btn-primary px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 group"
          >
            {t.rastreio.btn}
            <motion.div variants={{ initial: { x: 0 }, hover: { x: 3 } }}>
              <Package className="w-4 h-4" strokeWidth={2.5} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
