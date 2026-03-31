import { motion } from 'motion/react';
import { PlayCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import React from 'react';

interface AulasProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Aulas({ t, scrollToPlanos }: AulasProps) {
  return (
    <section id="aulas" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-5 md:order-none">

      {/* --- CARDS MOBILE (Apenas Mobile - No topo antes do texto) --- */}
      <div className="md:hidden relative w-full h-[320px] mb-12 flex items-center justify-center overflow-hidden">
        <div className="relative w-full flex items-center justify-center scale-75 origin-center">
          {[
            { img: "https://i.postimg.cc/bwhjVVkb/brands_wnba_3.jpg", id: "01", x: -80, y: -40, rot: -10 },
            { img: "https://i.postimg.cc/T36XNNgg/brands_wnba_19_2.jpg", id: "02", x: 60, y: -20, rot: 10 },
            { img: "https://i.postimg.cc/bwhjVVkn/brands_wnba_18_2.jpg", id: "03", x: -100, y: 80, rot: -15 },
            { img: "https://i.postimg.cc/x12SppM3/brands_wnba_20_2.jpg", id: "04", x: -10, y: 30, rot: 5 },
            { img: "https://i.postimg.cc/FH4QCC3B/brands_wnba_21_3.jpg", id: "05", x: 90, y: 70, rot: 8 },
            { img: "https://i.postimg.cc/0ysqXXDh/brands_wnba_22_2.jpg", id: "06", x: -30, y: 140, rot: -5 }
          ].map((aula, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 50, rotateZ: 0 }}
              whileInView={{ opacity: 1, scale: 1, x: aula.x, y: aula.y, rotateZ: aula.rot }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.04,
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="absolute w-36 aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/20 bg-black"
              style={{
                zIndex: idx,
                willChange: "transform, opacity"
              }}
            >
              <img src={aula.img} alt={`Aula ${aula.id}`} className="w-full h-full object-cover brightness-90" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </motion.div>
          ))}
        </div>
        {/* Glow escuro para o texto ler bem no mobile (Ajustado para mais visibilidade) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10 pointer-events-none opacity-70" />
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
      </div>

      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto relative z-20 flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-20 items-center justify-center min-h-[400px] md:min-h-0">

        {/* CARDS (Apenas Desktop - Lado Esquerdo da Grid) */}
        <div className="hidden md:flex relative z-0 md:z-auto pointer-events-none md:pointer-events-auto inset-0 md:inset-auto h-full items-center justify-center order-2 md:order-1 perspective-[2000px] py-10 md:py-20 md:h-[750px] lg:h-[800px] overflow-hidden md:overflow-visible">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[150px] rounded-full bg-[#582ef5]/10" />
            <div className="absolute top-0 left-0 w-64 h-64 blur-[100px] rounded-full bg-[#582ef5]/15 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-64 h-64 blur-[100px] rounded-full bg-[#2b34f5]/15 animate-pulse [animation-delay:1s]" />
          </div>

          <div className="relative w-full h-full flex items-center justify-center md:scale-100 scale-90 sm:scale-100">
            {[
              { img: "https://i.postimg.cc/bwhjVVkb/brands_wnba_3.jpg", id: "01", x: -140, y: -180, rot: -15, z: 0 },
              { img: "https://i.postimg.cc/T36XNNgg/brands_wnba_19_2.jpg", id: "02", x: 120, y: -140, rot: 15, z: 20 },
              { img: "https://i.postimg.cc/bwhjVVkn/brands_wnba_18_2.jpg", id: "03", x: -180, y: 40, rot: -25, z: 40 },
              { img: "https://i.postimg.cc/x12SppM3/brands_wnba_20_2.jpg", id: "04", x: -20, y: -20, rot: 5, z: 60 },
              { img: "https://i.postimg.cc/FH4QCC3B/brands_wnba_21_3.jpg", id: "05", x: 160, y: 60, rot: 10, z: 80 },
              { img: "https://i.postimg.cc/0ysqXXDh/brands_wnba_22_2.jpg", id: "06", x: -60, y: 220, rot: -5, z: 100 }
            ].map((aula, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5, x: 0, y: 100, rotateZ: 0 }}
                whileInView={{ opacity: 1, scale: 1, x: aula.x, y: aula.y, rotateZ: aula.rot, rotateX: 10, rotateY: idx % 2 === 0 ? -15 : 15, z: aula.z }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 1.5, type: "spring", stiffness: 35, damping: 15 }}
                whileHover={{ scale: 1.1, z: 200, rotateZ: 0, rotateX: 0, rotateY: 0, transition: { duration: 0.3 } }}
                className="absolute w-28 sm:w-36 md:w-52 lg:w-56 aspect-[9/16] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.8)] cursor-pointer group/card-aula bg-black"
                style={{ zIndex: idx, transformStyle: "preserve-3d" }}
              >
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="text-[10px] font-black text-white bg-[#582ef5] px-2.5 py-1 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(88,46,245,0.5)]">M{aula.id}</span>
                </div>
                <img src={aula.img} alt={`Aula ${aula.id}`} className="w-full h-full object-cover brightness-50 md:brightness-90 group-hover/card-aula:brightness-110 transition-all duration-500" loading="lazy" decoding="async" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl md:rounded-[2.5rem] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 md:from-black/80 via-transparent to-transparent opacity-80 md:opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/card-aula:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-30 order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left py-10 md:py-0 w-full lg:max-w-xl mx-auto md:mx-0 drop-shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
            <PlayCircle className="w-3.5 h-3.5 text-[#582ef5]" />
            <span className="text-gray-300 uppercase tracking-wider">{t.aulas.tag}</span>
          </div>
          <h2 className="text-[28px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-8 leading-[1.1] drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
            {/* Versão Desktop */}
            <span className="hidden md:block">
              {t.aulas.title1} <br />
              <span className="text-gradient-ai">{t.aulas.title2}</span>
            </span>
            {/* Versão Mobile (1 linha) */}
            <span className="md:hidden block whitespace-nowrap text-[26px]">
              {t.aulas.titleMob}
            </span>
          </h2>
          <p className="hidden md:block text-sm md:text-base text-gray-400 mb-8 md:mb-10 leading-relaxed max-w-md drop-shadow-lg">
            {t.aulas.desc}
          </p>

          <ul className="hidden md:block space-y-5 mb-12 w-full max-w-sm drop-shadow-2xl">
            {t.aulas.items.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-gray-200 md:text-gray-300 font-bold md:font-medium">
                <div className="w-6 h-6 rounded-full bg-[#582ef5]/40 md:bg-[#582ef5]/20 flex items-center justify-center border border-[#582ef5]/50 md:border-[#582ef5]/30 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white md:text-[#582ef5]" />
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
            className="btn-primary w-full max-w-[340px] md:w-auto px-10 py-4 md:py-5 text-[13px] sm:text-[15px] md:text-base font-bold flex items-center justify-center gap-3 group rounded-full md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 pointer-events-auto"
          >
            {t.aulas.btn}
            <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
