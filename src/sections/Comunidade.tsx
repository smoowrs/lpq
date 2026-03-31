import { motion } from 'motion/react';
import { Users, ArrowRight } from 'lucide-react';
import React from 'react';

interface ComunidadeProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Comunidade({ t, scrollToPlanos }: ComunidadeProps) {
  return (
    <section id="comunidade" className="pt-24 md:pt-32 pb-16 md:pb-40 px-6 relative overflow-hidden bg-black border-t border-white/5 order-2 md:order-none">
      {/* Glow de fundo atmosférico - Apenas Desktop agora */}
      <div className="hidden md:block absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#582ef5]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* --- MOBILE LAYOUT --- */}
        <div className="md:hidden flex flex-col w-full mb-12">

          <div className="flex flex-row items-center w-full mt-4">
            {/* Lado Esquerdo: Imagem do Telefone (com animação de flutuação) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-[45%] flex relative items-center justify-center"
            >
              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="https://i.postimg.cc/3RkrkCVn/phones.png"
                alt="App Comunidade"
                className="w-[170px] xl:w-[200px] sm:w-[220px] max-w-none object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                loading="eager"
                decoding="async"
              />
              {/* Degradê para sumir suavemente na base */}
              <div className="absolute inset-x-0 -bottom-10 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
            </motion.div>

            {/* Lado Direito: Textos e Botão com animação de surgimento */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-[55%] flex flex-col pl-4"
            >
              {/* Badge no Topo Direito (agora alinhado com os textos) */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-bold mb-4 md:mb-8 backdrop-blur-md uppercase tracking-[0.2em] text-gray-400 w-fit">
                <Users className="w-3 h-3 text-[#582ef5]" />
                <span>{t.comunidade.tag}</span>
              </div>

              <h2 className="text-[26px] font-bold tracking-tighter mb-4 leading-[1.05] text-white">
                {t.comunidade.title1} <br />
                <span className="whitespace-nowrap">{t.comunidade.title2}</span>
              </h2>
              <p className="text-[11px] sm:text-[13px] text-gray-400 mb-6 leading-relaxed opacity-80">
                {t.comunidade.desc}
              </p>
              <button
                onClick={scrollToPlanos}
                className="w-full bg-[#582ef5] text-white py-3 sm:py-4 rounded-xl font-bold text-[13px] sm:text-[15px] flex items-center justify-center gap-2 hover:bg-[#4c25e6] active:scale-[0.98] transition-all"
              >
                {t.comunidade.btn}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hidden md:flex flex-row items-center justify-center gap-20">
          {/* Celular Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex w-1/2 justify-center z-20"
          >
            <div className="relative z-10 flex justify-center">
              <img
                src="https://i.postimg.cc/3RkrkCVn/phones.png"
                alt="App Comunidade"
                className="w-full max-w-[520px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                loading="eager"
                decoding="async"
              />
            </div>
          </motion.div>

          {/* Texto Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-1/2 relative z-20 flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold mb-8 backdrop-blur-md uppercase tracking-[0.2em] text-gray-400">
              <Users className="w-3.5 h-3.5 text-[#582ef5]" />
              <span>{t.comunidade.tag}</span>
            </div>

            <h2 className="text-6xl lg:text-[82px] font-bold tracking-tighter mb-8 leading-[1.05] text-white">
              {t.comunidade.title1} <br />
              <span className="whitespace-nowrap text-inherit">{t.comunidade.title2}</span>
            </h2>

            <p className="text-base text-gray-400 mb-10 leading-relaxed max-w-xl opacity-80">
              {t.comunidade.desc}
            </p>

            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={scrollToPlanos}
              className="btn-primary w-fit px-10 py-5 text-base font-bold flex items-center justify-center gap-3 group rounded-[1.25rem] md:rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.3)] mt-0"
            >
              {t.comunidade.btn}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
