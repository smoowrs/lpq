import { motion } from 'motion/react';
import { 
  Package, Sparkles, Users, ShieldCheck, 
  ArrowRight, PlayCircle, Menu, CheckCircle2,
  Clock, MapPin, Globe, Play, Trophy,
  Crown, Star, Medal, ChevronDown, Check
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function App() {
  const [trackingStep, setTrackingStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const carouselImages = [
    "https://picsum.photos/seed/sneaker/400/400",
    "https://picsum.photos/seed/watch/400/400",
    "https://picsum.photos/seed/drone/400/400",
    "https://picsum.photos/seed/headphones/400/400",
    "https://picsum.photos/seed/camera/400/400",
    "https://picsum.photos/seed/bag/400/400",
    "https://picsum.photos/seed/glasses/400/400",
    "https://picsum.photos/seed/tech/400/400",
  ];

  const trackingStages = [
    { title: "Postado na China", time: "09:41 AM", icon: <Package className="w-4 h-4" /> },
    { title: "Chegou no Brasil", time: "14:20 PM", icon: <MapPin className="w-4 h-4" /> },
    { title: "Fiscalização Concluída", time: "10:15 AM", icon: <ShieldCheck className="w-4 h-4" /> },
    { title: "Saiu para Entrega", time: "08:30 AM", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-[#F5F5F7] selection:bg-white/20">

      {/* ─── NAV ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-[72px] grid grid-cols-3 items-center relative">
          
          {/* Lado esquerdo: Desktop = Links */}
          <div className="hidden lg:flex items-center justify-start gap-8 text-[15px] font-medium text-gray-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#rastreio" className="hover:text-white transition-colors">Rastreio</a>
            <a href="#comunidade" className="hover:text-white transition-colors">Comunidade</a>
          </div>
          
          {/* Mobile Placeholder para manter o logo no centro */}
          <div className="lg:hidden"></div>

          {/* Centro: Logo */}
          <div className="flex items-center justify-center">
            <img
              src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
              alt="Asas de Importação"
              className="h-5 sm:h-6 md:h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Direito: Idioma e CTAs */}
          <div className="flex items-center justify-end gap-2 md:gap-4 font-medium">
            {/* Idioma Selector */}
            <div className="relative group/lang">
              <button className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-sm md:text-base">
                <span className="text-lg">🇧🇷</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover/lang:text-white transition-colors" />
              </button>
              
              {/* Dropdown Falso (Visual) */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-[#0d0d0d] border border-white/10 rounded-xl py-2 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all transform scale-95 group-hover/lang:scale-100 shadow-2xl z-50">
                <button className="w-full px-4 py-2 flex items-center justify-between text-sm hover:bg-white/5 transition-colors">
                  🇺🇸 English
                </button>
                <button className="w-full px-4 py-2 flex items-center justify-between text-sm hover:bg-white/5 transition-colors text-white">
                  🇧🇷 Port (BR) <Check className="w-3.5 h-3.5 text-[#582ef5]" />
                </button>
                <button className="w-full px-4 py-2 flex items-center justify-between text-sm hover:bg-white/5 transition-colors">
                  🇪🇸 Español
                </button>
                <button className="w-full px-4 py-2 flex items-center justify-between text-sm hover:bg-white/5 transition-colors">
                  🇫🇷 Français
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-4">
              <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="text-[11px] sm:text-[14px] md:text-[15px] font-medium text-gray-300 hover:text-white transition-colors px-2 py-2">
                Entrar
              </button>
              <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary px-3 sm:px-5 py-2 md:py-2.5 text-[11px] sm:text-[14px] md:text-[15px] whitespace-nowrap">
                {/* Texto dinâmico para mobile */}
                <span className="hidden sm:inline">Criar conta grátis</span>
                <span className="sm:hidden">Criar conta</span>
              </button>
            </div>
          </div>
          
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="min-h-screen pt-20 pb-20 px-6 relative overflow-hidden border-b border-white/5 flex items-center justify-center">
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 relative z-10 w-full">
          
          {/* Lado Esquerdo (ou Mobile Top) */}
          <div className="md:w-[58%] flex flex-col items-center md:items-start text-center md:text-left w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center md:items-start"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(88,46,245,0.15)]">
                <Sparkles className="w-3 h-3 text-[#582ef5]" />
                <span className="text-gray-200">A revolução da importação com IA</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1] flex flex-col items-center md:items-start">
                <span className="whitespace-nowrap">Economize ou Lucre</span>
                <span className="text-gradient-ai whitespace-nowrap">Importando da China 💙</span>
              </h1>

              {/* Vídeo apenas no MOBILE (Entre Título e Descrição) */}
              <div className="w-full mb-10 md:hidden relative">
                <div className="absolute -inset-6 z-0 pointer-events-none opacity-50">
                  <div className="ambilight-tl absolute top-0 left-0 w-3/5 h-3/5 blur-[40px] rounded-full bg-[#582ef5]/30" />
                  <div className="ambilight-br absolute bottom-0 right-0 w-3/5 h-3/5 blur-[40px] rounded-full bg-[#4c25e6]/30" />
                </div>
                <div className="relative z-10 w-full bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-1">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe 
                      src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=79d4adef-2ea8-45f0-8ed4-bdfb4a2d954b" 
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-sm md:text-base text-gray-400 mb-10 max-w-xl leading-relaxed">
                Crie sua conta grátis e aprenda a importar da China! Tenha acesso a aulas exclusivas, rastreio em tempo real, gerador de imagens e ao Minerador: a IA desenvolvida para evitar taxas abusivas, participe de nossa comunidade de networking e utilize diversas outras ferramentas
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                  className="btn-primary px-8 py-4.5 text-[15px] sm:text-[16px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 group whitespace-nowrap rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.25)]"
                >
                  Criar conta grátis
                  <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                  </motion.div>
                </motion.button>
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                  className="btn-secondary px-8 py-4.5 text-[15px] sm:text-[16px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl group whitespace-nowrap border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  Ver como funciona
                  <Play className="w-4 h-4 fill-white text-white" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Direita: Vídeo (Desk apenas) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative w-full md:w-[42%] mx-auto"
          >
            <div className="absolute -inset-10 z-0 pointer-events-none">
              <div className="ambilight-tl absolute top-0 left-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
              <div className="ambilight-tr absolute top-0 right-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
              <div className="ambilight-bl absolute bottom-0 left-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
              <div className="ambilight-br absolute bottom-0 right-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
            </div>

            <div className="relative z-10 w-full bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-[0_0_80px_rgba(88,46,245,0.2)] overflow-hidden p-1 md:p-2">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <iframe 
                  src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=79d4adef-2ea8-45f0-8ed4-bdfb4a2d954b" 
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── COMUNIDADE ────────────────────────────────────────── */}
      <section id="comunidade" className="pt-24 md:pt-32 pb-16 md:pb-40 px-6 relative overflow-hidden bg-black">
        {/* Glow de fundo atmosférico */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#582ef5]/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10 gap-16 md:gap-12">
          
          {/* Celular (Fica em cima no Mobile, Esquerda no Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 flex justify-center md:justify-end z-20"
          >
            <div className="relative z-10 flex justify-center md:justify-end">
               <img 
                 src="https://i.postimg.cc/3RkrkCVn/phones.png"
                 alt="App Comunidade"
                 className="w-full max-w-[280px] md:max-w-[480px] object-contain"
               />
            </div>
          </motion.div>

          {/* Texto (Fica embaixo no Mobile, Direita na Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative z-20 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold mb-8 backdrop-blur-md uppercase tracking-[0.2em] text-gray-400">
              <Users className="w-3.5 h-3.5 text-[#582ef5]" />
              <span>COMUNIDADE</span>
            </div>
            
            <h2 className="text-[36px] md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05] text-white">
              A Primeira <br />
              Rede Social <br />
              do Importador
            </h2>
            
            <p className="text-sm md:text-base text-gray-400 mb-10 leading-relaxed max-w-xl opacity-80">
              Sua nova rede social, uma comunidade exclusiva para importadores e empreendedores, troque informações estratégicas, compartilhe seus resultados e evolua ao lado de quem fala a sua língua.
            </p>
            
            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
              className="btn-primary w-fit px-10 py-5 text-base font-bold flex items-center justify-center gap-3 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.3)]"
            >
              Testar comunidade
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </motion.button>
          </motion.div>
          
        </div>
      </section>

      {/* ─── O MINERADOR ────────────────────────────────────────── */}
      <section id="minerador" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          
          {/* Esquerda: Texto e CTA */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#582ef5]/10 border border-[#582ef5]/20 text-xs font-semibold mb-6 backdrop-blur-md text-[#582ef5] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>O MINERADOR</span>
              </div>
              
              <h2 className="text-[32px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                O Assistente <br className="hidden md:block" />
                <span className="text-gradient-ai">inteligente 💬</span>
              </h2>
              <p className="text-sm md:text-base text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Através de uma base de fábricas confiáveis, nossa IA garante o melhor preço entre diferentes unidades, o sistema automatiza o cálculo de tributos e a emissão de declarações, eliminando definitivamente o risco das taxas abusivas.
              </p>

              <motion.button
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                className="btn-primary px-10 py-5 text-base font-bold w-fit mx-auto lg:mx-0 flex items-center justify-center gap-2 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.3)]"
              >
                Testar Minerador Agora
                <Sparkles className="w-5 h-5 fill-white/20" strokeWidth={2.5} />
              </motion.button>
            </motion.div>
          </div>

          {/* Direita: Chat Experience Mockup */}
          <div className="lg:w-1/2 w-full max-w-xl px-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-[#0d0d0d] rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Header do Chat */}
              <div className="bg-white/5 border-b border-white/5 p-4 flex items-center justify-between backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#582ef5]/20 flex items-center justify-center overflow-hidden border border-[#582ef5]/30">
                      <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJzeHd3YTZlbTVhd2x5dHB2eTRtaHR3am5sajFqNW55OWxoMXhmYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S5Itfetiqrv3emmx8h/giphy.gif" alt="Minerador" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none mb-1">O Minerador 💙</h4>
                    <p className="text-[10px] text-green-500 font-medium">IA Online agora</p>
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
                    Preciso de link de iphone 17 pro max
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
                  <div className="bg-white/10 text-gray-200 px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[90%] leading-relaxed border border-white/5 backdrop-blur-md">
                    Encontrei fornecedores verificados com estoque disponível e envio direto! 🚀
                  </div>
                </motion.div>

                {/* Product Card Result */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 backdrop-blur-xl hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="w-24 h-24 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-white/5">
                    <img src="https://i.postimg.cc/qRvhYVzb/iphone-17-pro-finish-select-202509-6-9inch-deepblue-2.webp" alt="iPhone 17" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-xs font-bold text-white uppercase tracking-tight">iPhone 17 Pro Max</h5>
                      <span className="bg-green-500/10 text-green-500 text-[9px] px-1.5 py-0.5 rounded font-bold border border-green-500/20">VERIFICADO</span>
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-lg font-black text-white">R$7.600</span>
                      <span className="text-[10px] text-gray-500 line-through mb-1">R$11.900</span>
                    </div>
                    <button className="w-full py-2 bg-[#582ef5] text-white text-[11px] font-black rounded-lg hover:bg-[#4c25e6] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#582ef5]/20">
                      ACESSAR LINK <ArrowRight className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
                
                {/* Typing status (fake) */}
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce" />
                   <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-1.5 h-1.5 bg-[#582ef5] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>

              {/* Barra de Input Fake */}
              <div className="bg-white/5 border-t border-white/5 p-4 flex items-center gap-3">
                 <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-gray-500 text-xs text-left">
                    Pergunte ao Minerador...
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#582ef5] flex items-center justify-center shadow-lg shadow-[#582ef5]/30">
                    <ArrowRight className="w-5 h-5 text-white" />
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── NÍVEIS E RECOMPENSAS ────────────────────────────────────────── */}
      <section id="ranking" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#582ef5]/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-20">
            
            {/* Texto (Direita no Desktop) */}
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center md:items-start"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-[#582ef5]" />
                  <span className="text-gray-300 uppercase tracking-wider">Níveis e Recompensas</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight mb-8 leading-[1.1]">
                  Suba de nível e<br />
                  <span className="text-gradient-ai">ganhe prêmios</span>
                </h2>

                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                  className="btn-primary w-fit px-12 py-5 text-base font-bold flex items-center justify-center gap-3 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.2)] transition-all duration-300"
                >
                  Subir níveis
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
                      <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover grayscale opacity-70" alt="2º Lugar" />
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
                      <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover" alt="1º Lugar" />
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
                      <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover grayscale opacity-70" alt="3º Lugar" />
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

      {/* ─── AULAS PASSO A PASSO ────────────────────────────────── */}
      <section id="aulas" className="py-20 md:py-32 px-6 relative overflow-hidden border-t border-white/5 bg-[#04050D]">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
              <PlayCircle className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300 uppercase tracking-wider">Aulas passo a passo</span>
            </div>
            <h2 className="text-[28px] md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-gradient-ai">Aprenda passo a passo</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Do zero até a chegada dos seus produtos<br />
              na porta da sua casa ou da sua loja.
            </p>
          </motion.div>

          {/* Carrossel de Aulas */}
          <div className="relative group mb-12">
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
              {[
                { img: "https://i.postimg.cc/bwhjVVkb/brands_wnba_3.jpg", title: "Primeiros Passos" },
                { img: "https://i.postimg.cc/T36XNNgg/brands_wnba_19_2.jpg", title: "Endereço" },
                { img: "https://i.postimg.cc/bwhjVVkn/brands_wnba_18_2.jpg", title: "Recarga" },
                { img: "https://i.postimg.cc/x12SppM3/brands_wnba_20_2.jpg", title: "Compras" },
                { img: "https://i.postimg.cc/FH4QCC3B/brands_wnba_21_3.jpg", title: "Envios" },
                { img: "https://i.postimg.cc/0ysqXXDh/brands_wnba_22_2.jpg", title: "Rastreio" }
              ].map((aula, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[110px] md:min-w-[190px] aspect-[9/16] rounded-xl md:rounded-2xl overflow-hidden relative group/card snap-start shadow-xl border border-white/5 bg-white/[0.02]"
                >
                  <img src={aula.img} alt={aula.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-40 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </div>

          
        </div>
      </section>


      {/* ─── PRODUTOS ────────────────────────────────────────── */}
      <section id="produtos" className="pt-24 md:pt-32 pb-24 md:pb-32 px-6 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 relative z-10">
          
          {/* Esquerda: Visual (Dashboard) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 order-2 md:order-1"
            style={{ perspective: "1500px" }}
          >
            {/* Esquerda: Grid 3x3 Cinematográfico (Agora em Produtos) */}
            {/* Esquerda: Pilha de Cards 3D (Produtos - Estilo Connect AI) */}
            <div className="relative h-[450px] md:h-[650px] flex items-center justify-center -ml-12 md:-ml-40 lg:-ml-56 perspective-[2000px]">
              {[
                "https://i.postimg.cc/DZ1c1XRC/connect_ai_1774345789074.webp",
                "https://i.postimg.cc/d1G9Gyg2/connect_ai_1774346079071.webp",
                "https://i.postimg.cc/C1b4bq9m/connect_ai_1774346157539.webp",
                "https://i.postimg.cc/fWjKLYcN/connect_ai_1774346252722.jpg",
                "https://i.postimg.cc/yd0T0Z2L/connect_ai_1774346417447.webp",
                "https://i.postimg.cc/yxByjNH4/connect_ai_1774346485902.jpg",
                "https://i.postimg.cc/Y03fswr6/connect_ai_1774346610865.jpg",
                "https://i.postimg.cc/nrkYPtF3/connect_ai_1774346674187.jpg",
                "https://i.postimg.cc/PJ4zRkX2/connect_ai_1774346817363.jpg"
              ].map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -200, rotateX: 0, rotateY: 0 }}
                  whileInView={{ 
                    opacity: 1, 
                    x: idx * 56, // Mais aberto conforme solicitado
                    y: idx * -24,
                    rotateX: 10,
                    rotateY: -25
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 1, type: "spring", stiffness: 45 }}
                  className="absolute w-36 md:w-52 lg:w-64 aspect-[3/4.5] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:z-50 hover:scale-105 group/prod-card bg-[#0d0d0d]"
                  style={{ 
                    zIndex: idx,
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Label 00X */}
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 opacity-60 group-hover/prod-card:opacity-100 transition-opacity">
                    <span className="text-[8px] font-mono font-bold text-white tracking-tighter bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                      {String(idx + 1).padStart(3, '0')}
                    </span>
                  </div>

                  <img src={img} alt={`Product card ${idx}`} className="w-full h-full object-cover brightness-90 group-hover/prod-card:brightness-110 transition-all duration-500" />
                  
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </motion.div>
              ))}

              {/* Brilho Atmosférico */}
              <div className="absolute inset-0 bg-[#582ef5]/5 rounded-full blur-[140px] -z-10 translate-x-[-20%]" />
            </div>
          </motion.div>

          {/* Direita: Conteúdo e Informações */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2 md:pl-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start w-full max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
                <Package className="w-3.5 h-3.5 text-[#582ef5]" />
                <span className="text-gray-300 uppercase tracking-wider">Produtos</span>
              </div>
              
              <h2 className="text-[28px] sm:text-[36px] md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-center md:text-left w-full">
                Os melhores preços <br className="hidden md:block" />
                <span className="text-gradient-ai">produtos e qualidade.</span>
              </h2>
              
              <p className="text-sm md:text-lg text-gray-400 mb-10 leading-relaxed max-w-md text-center md:text-left">
                Tenha acesso grátis a um painel cheio<br className="hidden md:block" />
                de produtos incríveis.
              </p>

              <motion.button
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                className="btn-primary w-full max-w-[340px] py-4 text-[13px] sm:text-[15px] font-bold flex items-center justify-center gap-2 group mx-auto md:mx-0 rounded-full shadow-[0_20px_50px_rgba(88,46,245,0.2)] transition-all duration-300"
              >
                Ver produtos
                <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CONNECT AI / IMAGE CAROUSEL ──────────────────────── */}
      <section className="py-24 md:py-32 border-t border-white/5 bg-black overflow-hidden relative">
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
                <span className="text-gray-300 uppercase tracking-wider">Connect AI</span>
              </div>
              <h2 className="text-[32px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Crie imagens que <br />
                <span className="text-gradient-ai">vendem mais.</span>
              </h2>
              <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-md">
                Com o uso da Connect AI você transforma fotos simples de fornecedores em imagens que realmente geram interesse e um visual incrível na sua loja.
              </p>
              <ul className="space-y-4 mb-10">
                {['Imagens em 4K', 'Menos de 30s', 'Alta Conversão'].map((item, i) => (
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
                onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                className="btn-primary px-8 py-4 text-sm font-bold flex items-center justify-center gap-3 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.3)] transition-all duration-300"
              >
                Testar Connect AI
                <motion.div variants={{ initial: { x: 0 }, hover: { rotate: 15, scale: 1.2 } }}>
                  <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Direita: Pilha de Imagens 3D Original (Connect AI) */}
            <div className="relative h-[500px] md:h-[600px] flex items-center justify-center mt-12 md:mt-24 perspective-[1500px]">
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
      </section>

      {/* ─── TRACKING SECTION ─────────────────────────────────── */}
      <section id="rastreio" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#2b34f5]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#582ef5]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#582ef5]/15 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2b34f5]/10 rounded-full blur-3xl opacity-30" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Status do Pedido</h3>
                    <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider font-medium">Logística Connect</p>
                  </div>
                  <div className="px-4 py-1.5 bg-[#582ef5] text-white rounded-full text-[10px] font-bold border border-white/20 uppercase tracking-widest shadow-[0_0_15px_rgba(88,46,245,0.4)]">
                    Em trânsito
                  </div>
                </div>

                <div className="space-y-6">
                  {trackingStages.map((stage, index) => {
                    const isActive = index <= trackingStep;
                    const isCurrent = index === trackingStep;
                    return (
                      <div key={index} className="flex gap-5 relative">
                        {index < trackingStages.length - 1 && (
                          <div className={`absolute left-[15px] top-8 bottom-[-24px] w-[1px] ${isActive ? 'bg-[#582ef5]' : 'bg-white/10'}`} />
                        )}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-700 ${
                          isActive ? 'bg-[#582ef5] text-white shadow-[0_0_20px_rgba(88,46,245,0.6)]' : 'bg-white/5 text-gray-600 border border-white/5'
                        }`}>
                          {stage.icon}
                        </div>
                        <div className={`pt-0.5 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                          <p className={`text-[15px] font-bold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{stage.title}</p>
                          <p className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium">
                            <Clock className="w-3 h-3" /> {stage.time}
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
              <span className="text-gray-300 uppercase tracking-wider">Logística Inteligente</span>
            </div>
            <h2 className="text-[28px] md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              Rastreio em <br />
              <span className="text-gradient-ai">Tempo Real.</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed">
              Nosso sistema se conecta diretamente com as transportadoras internacionais e Correios para te dar atualizações precisas e automáticas.
            </p>
            <ul className="space-y-4 mb-10">
              {['Notificações push a cada movimentação', 'Previsão de entrega com IA', 'Alerta automático de taxas'].map((item, i) => (
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
              onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
              className="btn-primary px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 group"
            >
              Testar rastreio grátis
              <motion.div variants={{ initial: { x: 0 }, hover: { x: 3 } }}>
                <Package className="w-4 h-4" strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section id="cadastro" className="py-24 md:py-32 px-6 relative overflow-hidden bg-black border-t border-white/5">
        {/* Efeitos de Fundo */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#582ef5]/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#582ef5]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[300px] bg-[#2b34f5]/5 rounded-[100%] blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6 py-10 md:p-16 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          >
            {/* Brilho interno do cartão */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#582ef5]/20 rounded-full blur-3xl" />
            
            <h2 className="text-[22px] sm:text-[32px] md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.2]">
              REGISTRE-SE e GANHE <br />
              <span className="text-gradient-ai">R$660 em CUPONS</span>
            </h2>
            
            <p className="text-gray-400 text-sm md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Criando sua conta grátis você ganha cupons de desconto para realizar suas primeiras importação
            </p>

            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
              className="btn-primary px-10 py-5 text-[15px] sm:text-xl font-bold flex items-center justify-center gap-3 mx-auto shadow-[0_20px_50px_rgba(88,46,245,0.4)] group whitespace-nowrap"
            >
              Crie sua conta grátis
              <motion.div variants={{ initial: { x: 0 }, hover: { x: 8 } }}>
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </motion.div>
            </motion.button>

            {/* Selo de Confiança / Badges Rápidos */}
            <div className="mt-10 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               <ShieldCheck className="w-5 h-5" />
               <span className="text-[10px] uppercase tracking-widest font-bold">Acesso Seguro</span>
               <div className="w-1 h-1 rounded-full bg-white/20" />
               <Package className="w-5 h-5" />
               <span className="text-[10px] uppercase tracking-widest font-bold">Envio Direto</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center">
            <img src="https://i.postimg.cc/DZcqskjG/IMG_3713_3.png" alt="Drone Connect Academy" className="h-8 object-contain" referrerPolicy="no-referrer" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            © 2026 Connect Academy LTDA Todos os direitos reservados - CNPJ:{' '}
            <a 
              href="https://cnpj.biz/44292841000195" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-gray-300 transition-colors"
            >
              44.292.841/0001-95
            </a>
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
