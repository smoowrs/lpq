import { motion } from 'motion/react';
import { Package, ArrowRight } from 'lucide-react';
import React from 'react';

interface ProdutosProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Produtos({ t, scrollToPlanos }: ProdutosProps) {
  return (
    <section id="produtos" className="pt-24 md:pt-32 pb-12 md:pb-32 relative overflow-hidden bg-black border-t border-white/5 order-4 md:order-none">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Layer de Fundo: Cards Espalhados */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center md:justify-end md:pr-12 lg:pr-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative w-full md:w-1/2 h-full flex items-center justify-center perspective-[2500px]"
        >
          {[
            { img: "https://i.postimg.cc/DZ1c1XRC/connect_ai_1774345789074.webp", x: -140, y: -120, r: -15, s: 0.95, z: 10 },
            { img: "https://i.postimg.cc/d1G9Gyg2/connect_ai_1774346079071.webp", x: 120, y: -180, r: 10, s: 1.05, z: 40 },
            { img: "https://i.postimg.cc/C1b4bq9m/connect_ai_1774346157539.webp", x: -60, y: 180, r: 12, s: 1.1, z: 35 },
            { img: "https://i.postimg.cc/fWjKLYcN/connect_ai_1774346252722.jpg", x: 200, y: 140, r: -8, s: 0.85, z: 8 },
            { img: "https://i.postimg.cc/yd0T0Z2L/connect_ai_1774346417447.webp", x: -260, y: 60, r: -22, s: 1.05, z: 12 },
            { img: "https://i.postimg.cc/yxByjNH4/connect_ai_1774346485902.jpg", x: 240, y: -40, r: 18, s: 1.0, z: 4 },
            { img: "https://i.postimg.cc/Y03fswr6/connect_ai_1774346610865.jpg", x: -40, y: -240, r: 5, s: 0.8, z: 1 },
            { img: "https://i.postimg.cc/nrkYPtF3/connect_ai_1774346674187.jpg", x: 100, y: 50, r: -10, s: 0.85, z: 2 },
            { img: "https://i.postimg.cc/PJ4zRkX2/connect_ai_1774346817363.jpg", x: 0, y: -30, r: 0, s: 0.95, z: 3 },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 50 }}
              whileInView={{ opacity: 1, x: card.x, y: card.y, rotate: card.r, scale: card.s }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 1.2, type: "spring", stiffness: 35, damping: 15 }}
              className="absolute w-24 sm:w-28 md:w-44 lg:w-48 aspect-[3/4.2] rounded-[1.25rem] md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] bg-[#0d0d0d]"
              style={{ zIndex: card.z }}
            >
              <img src={card.img} className="w-full h-full object-cover brightness-50 md:brightness-100" alt="" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/60 via-transparent to-transparent opacity-60 md:opacity-40 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-20 pointer-events-none opacity-95 md:opacity-90 md:hidden" />
          <div className="absolute inset-0 bg-[#582ef5]/5 rounded-full blur-[150px] -z-10" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30 flex flex-col md:grid md:grid-cols-2 items-center justify-center md:justify-between min-h-[500px] md:min-h-0">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start w-full max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
              <Package className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300 uppercase tracking-wider">{t.produtos.tag}</span>
            </div>
            <h2 className="text-[28px] md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 md:mb-8 leading-[1.05] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
              {t.produtos.title1} <br />
              <span className="text-gradient-ai">{t.produtos.title2}</span>
            </h2>
            <p className="hidden md:block text-sm md:text-lg text-gray-300 md:text-gray-400 mb-10 leading-relaxed max-w-md text-left drop-shadow-lg">
              {t.produtos.desc}
            </p>
            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={scrollToPlanos}
              className="btn-primary w-full max-w-[340px] py-4 text-[13px] sm:text-[15px] font-bold flex items-center justify-center gap-2 group mx-auto md:mx-0 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300"
            >
              {t.produtos.btn}
              <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
        <div className="hidden md:block" />
      </div>
    </section>
  );
}
