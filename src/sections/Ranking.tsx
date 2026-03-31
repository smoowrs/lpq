import { motion } from 'motion/react';
import { Star, Crown, ArrowRight } from 'lucide-react';
import React from 'react';

interface RankingProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Ranking({ t, scrollToPlanos }: RankingProps) {
  return (
    <section id="ranking" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-7 md:order-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#582ef5]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

          {/* Texto (Esquerda no Desktop) */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 text-[#582ef5]" />
                <span className="text-gray-300 uppercase tracking-wider">{t.recompensas.tag}</span>
              </div>

              <h2 className="text-[28px] md:text-5xl lg:text-5xl font-bold tracking-tight mb-8 leading-[1.1]">
                {t.recompensas.title1}<br />
                <span className="text-gradient-ai">{t.recompensas.title2}</span>
              </h2>

              <motion.button
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.95 }}
                onClick={scrollToPlanos}
                className="btn-primary w-fit px-12 py-5 text-base font-bold flex items-center justify-center gap-3 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.2)] transition-all duration-300"
              >
                {t.recompensas.btn}
                <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                  <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>

          {/* Pódio de Ranking (Esquerda no Desktop) */}
          <div className="md:w-1/2 w-full">
            <div className="flex flex-row items-end justify-center gap-4 md:gap-8 py-6 scale-90 md:scale-100 lg:scale-110 origin-center">

              {/* 2º Lugar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-[#582ef5]/30 p-1">
                    <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover grayscale opacity-70" alt="2º Lugar" loading="lazy" decoding="async" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#1a1a1a] border-2 border-[#582ef5]/30 rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold text-gray-400">2</div>
                </div>
                <h4 className="font-bold text-sm md:text-base text-white mb-2 text-center">Gabriel</h4>
                <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] md:text-[11px] font-bold text-gray-400 mb-4 whitespace-nowrap">620 XP</div>
                <div className="w-20 md:w-24 lg:w-28 h-10 md:h-12 lg:h-16 bg-white/5 border border-white/10 rounded-t-xl flex items-center justify-center font-bold text-white/10 text-lg md:text-xl lg:text-2xl">2º</div>
              </motion.div>

              {/* 1º Lugar */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center -translate-y-4 md:-translate-y-6"
              >
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-2"
                >
                  <Crown className="w-6 h-6 md:w-8 lg:w-10 text-[#582ef5] fill-[#582ef5]/20 drop-shadow-[0_0_10px_rgba(88,46,245,0.5)]" />
                </motion.div>
                <div className="relative mb-4">
                  <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-[#582ef5] p-1 shadow-[0_0_30px_rgba(88,46,245,0.3)]">
                    <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover" alt="1º Lugar" loading="lazy" decoding="async" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-[#582ef5] border-2 border-black rounded-full flex items-center justify-center text-xs md:text-sm font-black text-white">1</div>
                </div>
                <h4 className="font-bold text-base md:text-xl lg:text-2xl text-white mb-2 text-center">Douglas</h4>
                <div className="bg-[#582ef5]/10 border border-[#582ef5]/20 px-4 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold text-[#582ef5] mb-4 shadow-lg whitespace-nowrap">850 XP</div>
                <div className="w-24 md:w-32 lg:w-36 h-20 md:h-24 lg:h-28 bg-[#582ef5]/10 border border-[#582ef5]/20 rounded-t-2xl flex items-center justify-center font-bold text-[#582ef5]/40 text-2xl md:text-3xl lg:text-4xl shadow-[inset_0_20px_50px_rgba(88,46,245,0.1)]">1º</div>
              </motion.div>

              {/* 3º Lugar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-[#582ef5]/30 p-1">
                    <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover grayscale opacity-70" alt="3º Lugar" loading="lazy" decoding="async" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#1a1a1a] border-2 border-[#582ef5]/30 rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold text-gray-400">3</div>
                </div>
                <h4 className="font-bold text-sm md:text-base text-white mb-2 text-center">Lucas</h4>
                <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] md:text-[11px] font-bold text-gray-400 mb-4 whitespace-nowrap">400 XP</div>
                <div className="w-20 md:w-24 lg:w-28 h-6 md:h-8 lg:h-10 bg-white/5 border border-white/10 rounded-t-xl flex items-center justify-center font-bold text-white/5 text-lg md:text-xl lg:text-2xl">3º</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
