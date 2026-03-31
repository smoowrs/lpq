import { motion } from 'motion/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import React from 'react';

interface ConnectAIProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function ConnectAI({ t, scrollToPlanos }: ConnectAIProps) {
  return (
    <section id="ai" className="pt-8 pb-24 md:py-32 border-t border-white/5 bg-black overflow-hidden relative order-9 md:order-none">
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Esquerda: Conteúdo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300 uppercase tracking-wider">{t.connectAI.tag}</span>
            </div>
            <h2 className="text-[28px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              {/* Versão Desktop */}
              <span className="hidden md:block">
                {t.connectAI.title1} <br />
                <span className="text-gradient-ai">{t.connectAI.title2}</span>
              </span>
              {/* Versão Mobile */}
              <span className="md:hidden block">
                {t.connectAI.title1} <br />
                <span className="text-gradient-ai">{t.connectAI.title2}</span>
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-md">
              {t.connectAI.desc}
            </p>
            <ul className="space-y-4 mb-10">
              {t.connectAI.items.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-[#582ef5]/20 flex items-center justify-center border border-[#582ef5]/30 shrink-0">
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
              className="btn-primary px-8 py-4 text-sm font-bold flex items-center justify-center gap-3 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.3)] transition-all duration-300"
            >
              {t.connectAI.btn}
              <motion.div variants={{ initial: { x: 0 }, hover: { rotate: 15, scale: 1.2 } }}>
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Direita: Pilha de Imagens 3D Original (Connect AI) */}
          <div className="relative h-[250px] sm:h-[350px] md:h-[600px] flex items-center justify-center mt-4 md:mt-24 perspective-[1500px]">
            <div className="relative w-full h-full scale-[0.65] sm:scale-80 md:scale-100 origin-top-left md:origin-center -translate-y-8 sm:-translate-y-10 md:translate-y-0 translate-x-4 md:translate-x-0">
              {[
                { img: "https://i.postimg.cc/TwNgxsJ0/076f0c2f-8200-4570-b72a-822c7df16a62.png", id: "001" },
                { img: "https://i.postimg.cc/Q8mqS415/08446b2c-a24e-46c6-8601-56f1da7ac6df.png", id: "002" },
                { img: "https://i.postimg.cc/6Wt0rJ2N/0a2ce7ac-acba-43b6-8dc3-aa8cff090ab8.png", id: "003" },
                { img: "https://i.postimg.cc/Q8mqS41F/2687e321-b162-46e1-89c0-d00081ad55d5.png", id: "004" },
                { img: "https://i.postimg.cc/cxhcT9wX/63495536-d73c-4923-9bb0-f2f1fbbc0a0e.png", id: "005" },
                { img: "https://i.postimg.cc/rVMJ1X0y/6d4fba9a-9563-4b8d-ac09-0a8a9eed8971.png", id: "006" }
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 200, y: 100, rotateX: 0, rotateY: 0 }}
                  whileInView={{
                    opacity: 1,
                    x: idx * 45,
                    y: idx * -20,
                    rotateX: 10,
                    rotateY: -25
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 1, type: "spring", stiffness: 50 }}
                  className="absolute w-40 md:w-56 lg:w-64 aspect-[3/4.5] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform hover:z-50 hover:scale-105 duration-500 group/card-3d bg-[#0d0d0d]"
                  style={{
                    zIndex: idx,
                    transformStyle: "preserve-3d",
                    left: `${idx * 10}%`,
                    top: `${40 - (idx * 5)}%`
                  }}
                >
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 opacity-60 group-hover/card-3d:opacity-100 transition-opacity">
                    <span className="text-[9px] font-mono font-bold text-white tracking-tighter bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/5">
                      {card.id}
                    </span>
                  </div>
                  <img src={card.img} alt={`Connect AI ${card.id}`} className="w-full h-full object-cover brightness-90 group-hover/card-3d:brightness-110 transition-all" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
