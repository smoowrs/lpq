import { motion } from 'motion/react';
import { 
  Package, Sparkles, Users, ShieldCheck, 
  ArrowRight, PlayCircle, Menu, CheckCircle2,
  Clock, MapPin, Globe
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
    <div className="min-h-screen bg-black text-[#F5F5F7] selection:bg-white/20">

      {/* ─── NAV (novo design) ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between relative">
          
          {/* Lado esquerdo: Desktop = Logo, Mobile = Idioma */}
          <div className="flex-[0.5] sm:flex-1 flex items-center justify-start lg:hidden">
            {/* Mobile Idioma Toggle (Quadrado) */}
            <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-[14px] hover:bg-white/10 transition-colors">
              🇧🇷
            </button>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-start">
            <img
              src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
              alt="Asas de Importação"
              className="h-6 md:h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Centro: Desktop = Links, Mobile = Logo */}
          <div className="hidden lg:flex flex-[2] items-center justify-center gap-8 text-[15px] font-medium text-gray-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#rastreio" className="hover:text-white transition-colors">Rastreio</a>
            <a href="#comunidade" className="hover:text-white transition-colors">Comunidade</a>
          </div>

          <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <img
              src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
              alt="Asas de Importação"
              className="h-5 sm:h-6 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Direito: CTAs */}
          <div className="flex-[2] sm:flex-1 flex items-center justify-end">
            <div className="hidden lg:flex items-center gap-4">
              <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
                Entrar
              </button>
              <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary px-5 py-2.5 text-[15px]">
                Criar conta grátis
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-1 sm:gap-1.5">
              <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="text-[11px] sm:text-[12px] font-medium text-gray-300 hover:text-white transition-colors px-1 sm:px-1.5 py-1 whitespace-nowrap">
                Entrar
              </button>
              <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px] whitespace-nowrap">
                Criar conta
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="pt-20 pb-20 px-6 relative overflow-hidden border-b border-white/5 min-h-[85vh] flex flex-col items-center justify-start">
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 w-full mt-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(88,46,245,0.15)]">
              <Sparkles className="w-3 h-3 text-[#582ef5]" />
              <span className="text-gray-200">A revolução da importação com IA</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
              A 1ª Rede Social <br />
              <span className="text-gradient-ai">do importador</span>
            </h1>
          </motion.div>

          {/* Video + Ambilight */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-4xl mx-auto mb-10"
          >
            {/* Ambilight blobs — 4 cantos, ciclando cores independentemente */}
            <div className="absolute -inset-6 z-0 pointer-events-none">
              {/* Top-left */}
              <div className="ambilight-tl absolute top-0 left-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
              {/* Top-right */}
              <div className="ambilight-tr absolute top-0 right-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
              {/* Bottom-left */}
              <div className="ambilight-bl absolute bottom-0 left-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
              {/* Bottom-right */}
              <div className="ambilight-br absolute bottom-0 right-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
            </div>

            {/* Video card */}
            <div className="relative z-10 w-full md:w-[90%] mx-auto bg-[#0a0a0a] rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(88,46,245,0.2)] overflow-hidden p-1 md:p-2">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                <iframe 
                  src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=79d4adef-2ea8-45f0-8ed4-bdfb4a2d954b" 
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-xs md:text-sm text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Crie sua conta grátis e acesse as aulas, rastreio em tempo real, IA para geração de imagens e o Minerador — uma IA que te ajuda com suas declarações evitando taxas abusivas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary w-full sm:w-auto px-8 py-4 text-sm font-bold flex items-center justify-center gap-2">
              Criar conta grátis
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-secondary w-full sm:w-auto px-8 py-4 text-sm font-medium flex items-center justify-center gap-2 rounded-lg">
              <PlayCircle className="w-5 h-5" />
              Ver como funciona
            </button>
          </motion.div>
        </div>
      </section>
      {/* ─── COMUNIDADE ────────────────────────────────────────── */}
      <section id="comunidade" className="pt-24 md:pt-32 pb-4 md:pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10">
          
          {/* Texto (Esquerda) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative z-20 text-left md:pr-10 pb-16 md:pb-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-6 backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300">Comunidade</span>
            </div>
            
            <h2 className="text-[34px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              A Primeira <br />
              <span className="text-gradient-ai">Rede Social</span><br />
              do Importador
            </h2>
            
            <p className="text-[15px] sm:text-base md:text-lg text-gray-400 mb-8 leading-relaxed w-[65%] md:w-full">
              Você não precisa empreender sozinho. No nosso espaço, você troca informações de valores com outros importadores, compartilha seu progresso e cresce junto com a comunidade.
            </p>
            
            <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary w-[fit-content] px-8 py-4 text-sm font-bold flex items-center justify-center">
              Testar comunidade
            </button>
          </motion.div>

          {/* Celular Flutuante (Mockup iPhone 16 Pro Frontal - Menor) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="absolute -right-4 md:right-auto bottom-[10px] md:bottom-auto md:relative w-[55%] sm:w-[45%] md:w-1/2 flex justify-end z-20"
          >
            {/* O Container do celular como imagem transparente já exportada */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full flex justify-end drop-shadow-2xl"
            >
               <img 
                 src="https://i.postimg.cc/3RkrkCVn/phones.png"
                 alt="App Comunidade"
                 className="w-full max-w-[260px] md:max-w-[340px] object-contain drop-shadow-[0_0_60px_rgba(88,46,245,0.3)]"
               />
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* ─── AULAS PASSO A PASSO ────────────────────────────────── */}
      <section id="aulas" className="py-20 md:py-32 px-6 relative overflow-hidden border-t border-white/5 bg-[#04050D]">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
              <PlayCircle className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300 uppercase tracking-wider">Aulas passo a passo</span>
            </div>
            <h2 className="text-[34px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Aprenda, <span className="text-gradient-ai">Economize e Lucre</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl">
              Do zero absoluto ao avançado. Módulos completos focados em resultados reais e economia máxima nas suas importações.
            </p>
          </motion.div>

          {/* Carrossel de Aulas */}
          <div className="relative group">
            {/* Sombeamento de borda para scroll */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#04050D] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#04050D] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
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
                  className="min-w-[165px] md:min-w-[280px] aspect-[9/16] rounded-2xl md:rounded-[2rem] overflow-hidden relative group/card snap-start shadow-xl border border-white/5 bg-white/[0.02]"
                >
                  <img src={aula.img} alt={aula.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover/card:opacity-60 transition-opacity duration-500" />
                  
                  {/* Overlay Info */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-500">
                     <span className="text-[10px] md:text-sm font-bold text-[#582ef5] uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#582ef5] animate-pulse" />
                        Aula Disponível
                     </span>
                     <h4 className="text-lg md:text-xl font-bold text-white leading-tight">{aula.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* ─── O MINERADOR ────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-black to-[#050505] border-t border-white/5">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#582ef5]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-[0_0_50px_rgba(88,46,245,0.15)] overflow-hidden">
               <img 
                 src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJzeHd3YTZlbTVhd2x5dHB2eTRtaHR3am5sajFqNW55OWxoMXhmYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S5Itfetiqrv3emmx8h/giphy.gif"
                 alt="O Mineradorzinho"
                 className="w-full h-full object-contain rounded-xl"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-[#582ef5]/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#582ef5]/10 border border-[#582ef5]/20 text-xs font-semibold mb-5 backdrop-blur-md text-[#582ef5] tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>O MINERADOR</span>
             </div>
             
             <h2 className="text-[32px] md:text-5xl font-bold tracking-tight mb-6">
               <span className="text-white">O Assistente</span> <span className="text-gradient-ai">com IA</span>
             </h2>

             <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
               Uma inteligência artificial que te ajuda a encontrar os melhores produtos, preços e a declarar evitando taxas abusivas.
             </p>
          </motion.div>
          
        </div>
      </section>

      {/* ─── CONNECT AI / IMAGE CAROUSEL ──────────────────────── */}
      <section className="py-24 md:py-32 border-t border-white/5 bg-black overflow-hidden relative">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 mb-16 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300">Connect AI</span>
            </div>
            <h2 className="text-[34px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Crie imagens que <br />
              <span className="text-gradient-ai">vendem mais.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Com o uso da Connect AI você transforma fotos simples de fornecedores em imagens que realmente geram interesse e um visual incrível na sua loja.
            </p>
            <ul className="space-y-4 mb-10">
              {['Imagens em 4K', 'Menos de 30s', 'Alta Conversão'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#582ef5]/20 flex items-center justify-center border border-[#582ef5]/30 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#582ef5]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary px-8 py-4 text-sm font-bold">
              Testar Connect AI
            </button>
          </motion.div>
        </div>

        <div className="flex gap-6 animate-marquee">
          {[...carouselImages, ...carouselImages].map((img, index) => (
            <div key={index} className="flex-shrink-0 w-48 md:w-64 aspect-square rounded-2xl overflow-hidden border border-white/10 relative group">
              <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#582ef5]" /> Connect AI
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRACKING SECTION ─────────────────────────────────── */}
      <section id="rastreio" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#2b34f5]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#582ef5]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-6 backdrop-blur-md">
              <Package className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300">Logística Inteligente</span>
            </div>
            <h2 className="text-[34px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Rastreio em <br />
              <span className="text-gradient-ai">Tempo Real.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
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
            <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary px-8 py-4 text-sm font-bold">
              Testar rastreio grátis
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#582ef5]/10 to-black pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2b34f5]/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-[40px] md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Pronto para <br className="md:hidden" />
            <span className="text-gradient-ai">decolar?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de importadores que já estão lucrando com o Asas de Importação.
          </p>
          <button onClick={() => window.location.href = 'https://app.connectacademy.com.br'} className="btn-primary px-10 py-5 text-lg font-semibold flex items-center justify-center gap-2 mx-auto shadow-[0_0_40px_rgba(88,46,245,0.4)]">
            Criar conta grátis agora
            <ArrowRight className="w-5 h-5" />
          </button>
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
