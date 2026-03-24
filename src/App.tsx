import { motion } from 'motion/react';
import { 
  Package, Sparkles, Users, ShieldCheck, 
  ArrowRight, PlayCircle, Menu, CheckCircle2,
  Clock, MapPin, Globe, Play, Trophy,
  Crown, Star, Medal
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

      {/* ─── NAV (novo design) ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-[72px] lg:grid lg:grid-cols-3 flex items-center justify-between relative">
          
          {/* Lado esquerdo: Desktop = Links, Mobile = Idioma */}
          <div className="flex-[0.5] sm:flex-1 flex items-center justify-start lg:hidden">
            {/* Mobile Idioma Toggle (Quadrado) */}
            <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-[14px] hover:bg-white/10 transition-colors">
              🇧🇷
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-start gap-8 text-[15px] font-medium text-gray-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#rastreio" className="hover:text-white transition-colors">Rastreio</a>
            <a href="#comunidade" className="hover:text-white transition-colors">Comunidade</a>
          </div>

          {/* Centro: Logo (Tanto Desktop quanto Mobile) */}
          <div className="flex-1 lg:flex items-center justify-center pointer-events-none lg:pointer-events-auto">
            <img
              src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
              alt="Asas de Importação"
              className="h-5 sm:h-6 md:h-8 object-contain"
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
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 relative z-10 w-full mt-2">
          
          {/* Esquerda: Conteúdo e Ação */}
          <div className="md:w-[48%] flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(88,46,245,0.15)]">
                <Sparkles className="w-3 h-3 text-[#582ef5]" />
                <span className="text-gray-200">A revolução da importação com IA</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                A 1ª Rede Social <br />
                <span className="text-gradient-ai">do importador</span>
              </h1>
              
              <p className="text-xs md:text-base text-gray-400 mb-10 max-w-2xl leading-relaxed">
                Crie sua conta grátis e acesse as aulas, rastreio em tempo real, IA para geração de imagens e o Minerador — uma IA que te ajuda com suas declarações evitando taxas abusivas
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                  className="btn-primary px-6 sm:px-8 py-4 text-[13px] sm:text-[15px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  Criar conta grátis
                  <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </motion.div>
                </motion.button>
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                  className="btn-secondary px-6 sm:px-8 py-4 text-[13px] sm:text-[15px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg group whitespace-nowrap"
                >
                  Ver como funciona
                  <Play className="w-4 h-4 fill-white" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Direita: Vídeo + Ambilight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full md:w-[52%] mx-auto"
          >
            {/* Ambilight blobs */}
            <div className="absolute -inset-6 z-0 pointer-events-none">
              <div className="ambilight-tl absolute top-0 left-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
              <div className="ambilight-tr absolute top-0 right-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
              <div className="ambilight-bl absolute bottom-0 left-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
              <div className="ambilight-br absolute bottom-0 right-0 w-3/5 h-3/5 blur-[60px] opacity-80 rounded-full" />
            </div>

            {/* Video card */}
            <div className="relative z-10 w-full bg-[#0a0a0a] rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(88,46,245,0.2)] overflow-hidden p-1 md:p-2">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300 uppercase tracking-wider">Comunidade</span>
            </div>
            
            <h2 className="text-[28px] md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              A Primeira <br />
              <span className="text-gradient-ai">Rede Social</span><br />
              do Importador
            </h2>
            
            <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-2xl">
              Você não precisa empreender sozinho. No nosso espaço, você troca informações de valores com outros importadores, compartilha seu progresso e cresce junto com a comunidade.
            </p>
            
            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
              className="btn-primary w-fit px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 group"
            >
              Testar comunidade
              <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Celular Flutuante (Mockup iPhone 16 Pro Frontal - Menor) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="absolute right-0 md:right-auto bottom-[10px] md:bottom-auto md:relative w-[50%] sm:w-[45%] md:w-1/2 flex justify-end z-20"
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
            className="mb-10 flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
              <PlayCircle className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300 uppercase tracking-wider">Aulas passo a passo</span>
            </div>
            <h2 className="text-[28px] md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-gradient-ai">Economize ou Lucre</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Do zero até a chegada dos seus produtos<br />
              na porta da sua casa ou da sua loja.
            </p>
          </motion.div>

          {/* Carrossel de Aulas */}
          <div className="relative group mb-12">
            {/* Sombeamento de borda para scroll */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#04050D] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#04050D] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
              className="btn-primary px-8 py-4 text-sm font-bold w-fit flex items-center justify-center gap-2 group"
            >
              Aprender grátis
              <PlayCircle className="w-4 h-4" strokeWidth={2.5} />
            </motion.button>
          </motion.div>
          
        </div>
      </section>


      {/* ─── PRODUTOS ────────────────────────────────────────── */}
      <section id="produtos" className="pt-24 md:pt-32 pb-24 md:pb-32 px-6 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">
          
          {/* Esquerda: Visual (Dashboard) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 order-2 md:order-1"
            style={{ perspective: "1500px" }}
          >
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,1)] bg-white/5 backdrop-blur-sm">
                <img 
                  src="https://i.postimg.cc/9Mt8xV5t/Captura-de-Tela-2026-03-23-as-20-04-46.png"
                  alt="Painel de Produtos Integrado"
                  className="w-full h-auto object-cover [mask-image:radial-gradient(ellipse_95%_95%_at_50%_50%,#000_60%,transparent_100%)] opacity-85 group-hover:opacity-100 transition-all duration-1000 scale-100 md:scale-110 lg:scale-125"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Direita: Conteúdo e Informações */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
                <Package className="w-3.5 h-3.5 text-[#582ef5]" />
                <span className="text-gray-300 uppercase tracking-wider">Produtos</span>
              </div>
              
              <h2 className="text-[28px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Os melhores preços <br />
                <span className="text-gradient-ai">produtos e qualidade.</span>
              </h2>
              
              <p className="text-sm md:text-lg text-gray-400 mb-10 leading-relaxed max-w-md">
                Tenha acesso grátis a um painel cheio<br />
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

      {/* ─── NÍVEIS E RECOMPENSAS ────────────────────────────────────────── */}
      <section id="ranking" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#582ef5]/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
            
            {/* Esquerda: Conteúdo e Ação */}
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
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
                  className="btn-primary w-full max-w-[340px] py-5 text-[15px] font-bold flex items-center justify-center gap-3 group rounded-full shadow-[0_20px_50px_rgba(88,46,245,0.2)] transition-all duration-300"
                >
                  Subir níveis
                  <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>

            {/* Direita: Pódio de Ranking */}
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
                  initial={{ opacity: 0, y: 20 }}
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
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#582ef5]/10 border border-[#582ef5]/20 text-xs font-semibold mb-5 backdrop-blur-md text-[#582ef5] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>O MINERADOR</span>
             </div>
             
             <h2 className="text-[28px] md:text-4xl font-bold tracking-tight mb-6 leading-[1.1]">
               <span className="text-white">O Assistente</span> <span className="text-gradient-ai">com IA</span>
             </h2>

             <p className="text-sm md:text-base text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
               Uma inteligência artificial que te ajuda a encontrar os melhores produtos, preços e a declarar evitando taxas abusivas.
             </p>

             <motion.button
               whileHover="hover"
               initial="initial"
               whileTap={{ scale: 0.95 }}
               onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
               className="btn-primary px-8 py-4 text-sm font-bold w-fit mx-auto flex items-center justify-center gap-2 group"
             >
               Testar Minerador
               <Sparkles className="w-4 h-4 fill-white/20" strokeWidth={2.5} />
             </motion.button>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#582ef5]" />
              <span className="text-gray-300 uppercase tracking-wider">Connect AI</span>
            </div>
            <h2 className="text-[28px] md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              Crie imagens que <br />
              <span className="text-gradient-ai">vendem mais.</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed">
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
            <motion.button
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
              className="btn-primary px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 group"
            >
              Testar Connect AI
              <motion.div variants={{ initial: { x: 0 }, hover: { opacity: [1, 0.5, 1] } }}>
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
              </motion.div>
            </motion.button>
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
