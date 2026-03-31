import { motion } from 'motion/react';
import { ArrowRight, Play, Star } from 'lucide-react';
import React from 'react';

interface HeroProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Hero({ t, scrollToPlanos }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-16 overflow-hidden order-1 md:order-none">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[800px] bg-gradient-to-br from-[#582ef5]/10 via-transparent to-transparent opacity-80 pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#2b34f5]/5 rounded-full blur-[100px] pointer-events-none animate-pulse [animation-delay:1s]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold mb-8 md:mb-10 backdrop-blur-xl group hover:border-[#582ef5]/30 transition-all cursor-default"
          >
            <div className="w-2 h-2 rounded-full bg-[#582ef5] animate-ping" />
            <span className="text-gray-300 uppercase tracking-widest">{t.hero.badge}</span>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-black text-white">+1,200 ALUNOS</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-[36px] min-[400px]:text-[48px] sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[1] md:leading-[0.9] text-white drop-shadow-2xl flex flex-col items-center"
          >
            <span className="mb-2 md:mb-4">{t.hero.title1}</span>
            <span className="text-gradient-ai flex items-center gap-4">
              {t.hero.title2}
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="hidden sm:block"
              >
                ✨
              </motion.div>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-sm md:text-xl text-gray-400 max-w-2xl mb-12 md:mb-16 leading-relaxed font-medium px-4"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 md:gap-6 w-full max-w-md md:max-w-none justify-center"
          >
            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={scrollToPlanos}
              className="btn-primary w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 text-base md:text-lg font-black flex items-center justify-center gap-3 group rounded-[1.25rem] md:rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.4)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative z-10">{t.hero.btnPrimary}</span>
              <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }} className="relative z-10">
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </motion.div>
            </motion.button>

            <button className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 text-base md:text-lg font-black flex items-center justify-center gap-3 text-white border border-white/10 rounded-[1.25rem] md:rounded-2xl hover:bg-white/5 transition-all backdrop-blur-md active:scale-95">
              <Play className="w-5 h-5 fill-white" />
              {t.hero.btnSecondary}
            </button>
          </motion.div>

          {/* Mobile Hero Visual Detail */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="md:hidden mt-20 relative w-full flex justify-center"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 h-32 -top-16" />
          </motion.div>
        </div>
      </div>

      {/* Decorative Gradients for Bottom Hero */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
