import { motion } from 'motion/react';
import { Factory, ArrowRight } from 'lucide-react';
import React from 'react';

interface FabricasProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Fabricas({ t, scrollToPlanos }: FabricasProps) {
  return (
    <section id="fabricas" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-6 md:order-none">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 lg:gap-32">

          {/* Informações (Esquerda no Desktop) */}
          <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start w-full max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
                <Factory className="w-3.5 h-3.5 text-[#582ef5]" />
                <span className="text-gray-300 uppercase tracking-wider">{t.fabricas.tag}</span>
              </div>

              <h2 className="text-[28px] md:text-[40px] lg:text-[52px] font-bold tracking-tighter mb-8 leading-[1.1] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                {/* Versão Desktop */}
                <span className="hidden md:block">
                  {t.fabricas.title1} <br />
                  {t.fabricas.title2} <br />
                  <span className="text-gradient-ai">{t.fabricas.title3}</span>
                </span>
                {/* Versão Mobile (2 linhas) */}
                <span className="md:hidden text-center md:text-left block">
                  {t.fabricas.titleMob1} <br />
                  <span className="text-gradient-ai">{t.fabricas.titleMob2}</span>
                </span>
              </h2>

              <p className="hidden md:block text-sm md:text-lg text-gray-300 md:text-gray-400 mb-6 md:mb-10 leading-relaxed max-w-md font-medium">
                {t.fabricas.desc}
              </p>

              {/* Imagem (Apenas Mobile: Entre Descrição e Botão) */}
              <div className="flex md:hidden w-full justify-center my-4 relative z-10">
                <img
                  src="https://i.postimg.cc/nLX55SV5/product.webp"
                  alt="Fábricas Mobile"
                  className="w-full max-w-[280px] sm:max-w-[340px] drop-shadow-xl z-10"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <motion.button
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.95 }}
                onClick={scrollToPlanos}
                className="btn-primary w-full max-w-[340px] py-4 text-[13px] sm:text-[15px] font-bold flex items-center justify-center gap-2 group mx-auto md:mx-0 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 mt-2 md:mt-0"
              >
                {t.fabricas.btn}
                <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>

          {/* Imagem (Apenas Desktop: Direita) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:flex flex-col w-[45%] justify-center items-start order-1 md:order-2"
          >
            <div className="relative">
              <img
                src="https://i.postimg.cc/nLX55SV5/product.webp"
                alt="Fábricas"
                className="w-full max-w-none lg:w-[560px] relative z-10"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
