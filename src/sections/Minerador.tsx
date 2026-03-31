import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import React from 'react';

interface MineradorProps {
  t: any;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Minerador({ t, scrollToPlanos }: MineradorProps) {
  return (
    <section id="minerador" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-3 md:order-none">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

        {/* Coluna esquerda: Título, Descrição e Botão (No mobile, engloba tudo) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#582ef5]/10 border border-[#582ef5]/20 text-xs font-semibold mb-6 backdrop-blur-md text-[#582ef5] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.minerador.tag}</span>
            </div>

            <h2 className="text-[28px] md:text-5xl lg:text-[72px] font-black tracking-tighter mb-4 lg:mb-1 leading-[1] text-white">
              {/* Versão Desktop */}
              <span className="hidden md:block">
                {t.minerador.title1} <br />
                <span className="text-gradient-ai">{t.minerador.title2}</span>
              </span>
              {/* Versão Mobile (1 linha) */}
              <span className="md:hidden block whitespace-nowrap text-[26px]">
                {t.minerador.title1} <span className="text-gradient-ai">{t.minerador.title2}</span>
              </span>
            </h2>

            <p className="text-sm md:text-base text-gray-400 mb-8 max-w-xl leading-relaxed lg:mx-0">
              {t.minerador.desc}
            </p>

            {/* Chat Mockup Mobile Sandwich (Apenas Mobile: Entre Descrição e Botão) */}
            <div className="flex lg:hidden w-full justify-center my-4 relative z-10">
              <div className="relative bg-[#0d0d0d] rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-[340px] text-left scale-95 transform-gpu">
                {/* Header do Chat */}
                <div className="bg-white/5 border-b border-white/5 p-4 flex items-center justify-between backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#582ef5]/20 flex items-center justify-center overflow-hidden border border-[#582ef5]/30">
                        <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJzeHd3YTZlbTVhd2x5dHB2eTRtaHR3am5sajFqNW55OWxoMXhmYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S5Itfetiqrv3emmx8h/giphy.gif" alt="Minerador" className="w-8 h-8 object-contain" loading="lazy" decoding="async" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-white leading-none mb-1">O Minerador 💙</h4>
                      <p className="text-[10px] text-green-500 font-medium">{t.minerador.chat.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                </div>

                {/* Corpo do Chat */}
                <div className="p-5 space-y-6">
                  {/* Pergunta do User */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-col items-end"
                  >
                    <div className="bg-[#582ef5] text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-lg font-medium">
                      {t.minerador.chat.q}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1.5 mr-1 font-medium italic">Enviado agora</span>
                  </motion.div>

                  {/* Status Digitando (Visual antes da resposta) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: [0, 1, 0] }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="flex items-center gap-1.5 ml-2"
                  >
                    <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </motion.div>

                  {/* Resposta do Minerador */}
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                    className="flex flex-col items-start"
                  >
                    <div className="bg-white/10 text-gray-200 px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[90%] leading-relaxed border border-white/5 backdrop-blur-md text-left">
                      {t.minerador.chat.a}
                    </div>
                  </motion.div>

                  {/* Product Card Result */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 3, type: "spring", stiffness: 100, damping: 15 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 backdrop-blur-xl hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="w-20 sm:w-24 h-20 sm:h-24 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
                      <img src="https://i.postimg.cc/d1G9Gyg2/connect_ai_1774346079071.webp" alt="iPhone 17" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center text-left">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-tight">iPhone 17 Pro Max</h5>
                        <span className="bg-green-500/10 text-green-500 text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-bold border border-green-500/20">VERIFICADO</span>
                      </div>
                      <div className="flex items-end gap-2 mb-2 sm:mb-3">
                        <span className="text-sm sm:text-lg font-black text-white">R$7.600</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-500 line-through mb-0.5 sm:mb-1">R$11.900</span>
                      </div>
                      <button className="w-full py-1.5 sm:py-2 bg-[#582ef5] text-white text-[9px] sm:text-[11px] font-black rounded-lg hover:bg-[#4c25e6] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#582ef5]/20">
                        {t.minerador.chat.btn} <ArrowRight className="w-3 h-3" strokeWidth={3} />
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Barra de Input Fake */}
                <div className="bg-white/5 border-t border-white/5 p-4 flex items-center gap-3">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-gray-500 text-[10px] sm:text-xs text-left">
                    {t.minerador.chat.input}
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#582ef5] flex items-center justify-center shadow-lg shadow-[#582ef5]/20">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={scrollToPlanos}
              className="btn-primary w-full md:w-auto px-10 py-5 text-base font-bold flex items-center justify-center gap-2 group rounded-[1.25rem] md:rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.3)] mt-4 lg:mt-0"
            >
              {t.minerador.btn}
              <Sparkles className="w-5 h-5 fill-white/20" strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>

        {/* Coluna direita: Mockup do Chat (Apenas Desktop) */}
        <div className="hidden lg:flex w-1/2 justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#0d0d0d] rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-lg"
          >
            {/* Header do Chat */}
            <div className="bg-white/5 border-b border-white/5 p-4 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#582ef5]/20 flex items-center justify-center overflow-hidden border border-[#582ef5]/30">
                    <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJzeHd3YTZlbTVhd2x5dHB2eTRtaHR3am5sajFqNW55OWxoMXhmYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S5Itfetiqrv3emmx8h/giphy.gif" alt="Minerador" className="w-8 h-8 object-contain" loading="lazy" decoding="async" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white leading-none mb-1">O Minerador 💙</h4>
                  <p className="text-[10px] text-green-500 font-medium">{t.minerador.chat.status}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Corpo do Chat */}
            <div className="p-5 space-y-6">
              {/* Pergunta do User */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-end"
              >
                <div className="bg-[#582ef5] text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-lg">
                  {t.minerador.chat.q}
                </div>
                <span className="text-[10px] text-gray-500 mt-1.5 mr-1 font-medium italic">Enviado agora</span>
              </motion.div>

              {/* Resposta do Minerador */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col items-start"
              >
                <div className="bg-white/10 text-gray-200 px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[90%] leading-relaxed border border-white/5 backdrop-blur-md text-left">
                  {t.minerador.chat.a}
                </div>
              </motion.div>

              {/* Product Card Result */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 backdrop-blur-xl hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
                  <img src="https://i.postimg.cc/d1G9Gyg2/connect_ai_1774346079071.webp" alt="iPhone 17" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
                </div>
                <div className="flex-1 flex flex-col justify-center text-left">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-tight">iPhone 17 Pro Max</h5>
                    <span className="bg-green-500/10 text-green-500 text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-bold border border-green-500/20">VERIFICADO</span>
                  </div>
                  <div className="flex items-end gap-2 mb-2 sm:mb-3">
                    <span className="text-sm sm:text-lg font-black text-white">R$7.600</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 line-through mb-0.5 sm:mb-1">R$11.900</span>
                  </div>
                  <button className="w-full py-1.5 sm:py-2 bg-[#582ef5] text-white text-[9px] sm:text-[11px] font-black rounded-lg hover:bg-[#4c25e6] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#582ef5]/20">
                    {t.minerador.chat.btn} <ArrowRight className="w-3 h-3" strokeWidth={3} />
                  </button>
                </div>
              </motion.div>

              {/* Status Digitando */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>

            {/* Barra de Input Fake */}
            <div className="bg-white/5 border-t border-white/5 p-4 flex items-center gap-3">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-gray-500 text-[10px] sm:text-xs text-left">
                {t.minerador.chat.input}
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#582ef5] flex items-center justify-center shadow-lg shadow-[#582ef5]/20">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
