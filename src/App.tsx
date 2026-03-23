import { motion } from 'motion/react';
import { 
  Package, Sparkles, Users, ShieldCheck, 
  ArrowRight, CheckCircle2,
  Clock, MapPin, Menu, Search
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

  const stats = [
    { value: "+30.000 clientes", desc: "Entre lojistas, empresas e importadores" },
    { value: "+30 recursos", desc: "Para aumentar a eficiência da sua operação" },
    { value: "+40% economia", desc: "Evitando taxas abusivas na declaração" },
  ];

  return (
    <div className="min-h-screen bg-[#04050D] font-sans selection:bg-blue-500/30 text-white">

      {/* ─── NAV ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
          <img
            src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
            alt="Asas de Importação"
            className="h-6 md:h-8 object-contain"
            referrerPolicy="no-referrer"
          />

          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#A0A0A8]">
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#rastreio" className="hover:text-white transition-colors">Rastreio</a>
            <a href="#comunidade" className="hover:text-white transition-colors">Comunidade</a>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button className="text-[15px] font-medium text-[#A0A0A8] hover:text-white transition-colors px-4 py-2">
              Entrar
            </button>
            <button className="btn-primary px-5 py-2.5 text-[15px]">
              Começar teste grátis
            </button>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <button className="text-[13px] font-medium text-[#A0A0A8] hover:text-white transition-colors px-2 py-1.5">
              Entrar
            </button>
            <button className="btn-primary px-3.5 py-2 text-[13px]">
              Começar
            </button>
            <button className="btn-secondary p-2.5 ml-1">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO — Video Background ──────────────────────────── */}
      {/* ─── HERO — Vídeo fullscreen + texto bottom-left ──────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "92vh", minHeight: "520px", maxHeight: "900px" }}>

        {/* VÍDEO FULLSCREEN — cobre toda a section */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=79d4adef-2ea8-45f0-8ed4-bdfb4a2d954b"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: "177.78vh",
              height: "56.25vw",
              minWidth: "100%",
              minHeight: "100%",
            }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* ── OVERLAYS — apenas bordas, centro livre ────────── */}
        {/* Topo escuro (cobertura da nav) */}
        <div className="absolute top-0 left-0 right-0 h-40 z-10 bg-gradient-to-b from-[#04050D] via-[#04050D]/60 to-transparent pointer-events-none" />
        {/* Baixo — escurece para o texto e faz fade para a próxima seção */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 z-10 bg-gradient-to-t from-[#04050D] via-[#04050D]/70 to-transparent pointer-events-none" />
        {/* Esquerda — ajuda leitura do texto */}
        <div className="absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-r from-[#04050D]/80 via-[#04050D]/20 to-transparent pointer-events-none" />
        {/* Direita — fade sutil */}
        <div className="absolute inset-y-0 right-0 w-1/4 z-10 bg-gradient-to-l from-[#04050D]/50 to-transparent pointer-events-none" />

        {/* ── CONTEÚDO — canto inferior esquerdo ──────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 max-w-[1400px] mx-auto px-4 md:px-8 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-5 border border-white/15 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-[#4354FF]" />
              Para uso pessoal ou revenda
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.10] mb-6 text-white drop-shadow-lg">
              A 1ª Rede Social de<br />
              Importadores e<br />
              empreendedores
            </h1>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary px-7 py-4 text-[15px] w-full sm:w-auto">
                Começar teste grátis
              </button>
              <button className="btn-secondary px-7 py-4 text-[15px] w-full sm:w-auto">
                Saiba mais
              </button>
            </div>
          </motion.div>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-[#04050D] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-white/5">
          {stats.map((s, i) => (
            <div key={i} className="md:pl-8 first:pl-0">
              <p className="text-2xl md:text-3xl font-semibold text-white mb-1">{s.value}</p>
              <p className="text-sm text-[#A0A0A8]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONNECT AI / IMAGE CAROUSEL ──────────────────────── */}
      <section className="py-24 md:py-32 bg-[#06071A] border-b border-white/5 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#06071A] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#06071A] to-transparent z-10 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-14 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-5 border border-[#4354FF]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#4354FF]" />
              CONNECT AI
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.10] mb-5">
              Crie imagens que <span className="text-[#4354FF]">vendem mais.</span>
            </h2>
            <p className="text-[17px] text-[#A0A0A8] font-light mb-8 leading-relaxed">
              Com a Connect AI você transforma fotos de fornecedores em visuais incríveis que geram interesse e convertem na sua loja.
            </p>
            <ul className="space-y-3 mb-10">
              {['Imagens em 4K', 'Processo em menos de 30s', 'Alta taxa de conversão'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#C4C4CC] text-[15px]">
                  <div className="w-5 h-5 rounded-full bg-[#4354FF]/10 flex items-center justify-center border border-[#4354FF]/30 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-[#4354FF]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary px-7 py-3 text-sm">
              Testar Connect AI
            </button>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="flex gap-4 animate-marquee">
          {[...carouselImages, ...carouselImages].map((img, index) => (
            <div key={index} className="flex-shrink-0 w-44 md:w-60 aspect-square rounded-2xl overflow-hidden glass-card relative group">
              <img
                src={img}
                alt={`Produto ${index}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4354FF]" /> Connect AI
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRACKING SECTION ─────────────────────────────────── */}
      <section id="rastreio" className="py-24 md:py-32 px-4 md:px-8 relative overflow-hidden bg-[#04050D]">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#4354FF]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2E33FF]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4354FF]/8 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Status do Pedido</h3>
                    <p className="text-sm text-[#A0A0A8] mt-1">Código: BR987654321CN</p>
                  </div>
                  <div className="px-3 py-1.5 bg-[#4354FF]/10 text-[#4354FF] border border-[#4354FF]/20 rounded-md text-xs font-semibold">
                    Em trânsito
                  </div>
                </div>

                <div className="space-y-7">
                  {trackingStages.map((stage, index) => {
                    const isActive = index <= trackingStep;
                    const isCurrent = index === trackingStep;
                    return (
                      <div key={index} className="flex gap-4 relative">
                        {index < trackingStages.length - 1 && (
                          <div className={`absolute left-[15px] top-8 bottom-[-28px] w-[2px] transition-colors duration-500 ${isActive ? 'bg-[#4354FF]' : 'bg-white/10'}`} />
                        )}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 border ${
                          isActive
                            ? 'bg-[#4354FF] text-white border-[#4354FF] shadow-[0_0_14px_rgba(67,84,255,0.5)]'
                            : 'bg-[#0A0C1B] text-gray-500 border-white/15'
                        }`}>
                          {stage.icon}
                        </div>
                        <div className={`pt-1 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-35'}`}>
                          <p className={`font-medium text-[15px] ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{stage.title}</p>
                          <p className="text-[13px] text-[#A0A0A8] flex items-center gap-1.5 mt-1.5">
                            <Clock className="w-3.5 h-3.5" /> {stage.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-5 border border-[#4354FF]/30">
              <Package className="w-3.5 h-3.5 text-[#4354FF]" />
              LOGÍSTICA INTELIGENTE
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.10] mb-5">
              Rastreio em <br />
              <span className="text-[#4354FF]">Tempo Real.</span>
            </h2>
            <p className="text-[17px] text-[#A0A0A8] font-light mb-8 leading-relaxed max-w-xl">
              Nosso sistema se conecta diretamente com transportadoras internacionais e Correios para te dar atualizações precisas e automáticas.
            </p>
            <ul className="space-y-4 mb-10">
              {['Notificações push a cada movimentação', 'Previsão de entrega com IA', 'Alerta automático de taxas'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#C4C4CC] text-[15px]">
                  <div className="w-6 h-6 rounded-full bg-[#4354FF]/10 flex items-center justify-center border border-[#4354FF]/30 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4354FF]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary px-7 py-3 text-sm">
              Testar rastreio grátis
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#06071A] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-12 md:p-20 border border-[#4354FF]/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#4354FF]/4 rounded-3xl" />
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white relative z-10">
            Pronto para decolar?
          </h2>
          <p className="text-lg text-[#A0A0A8] mb-10 max-w-2xl mx-auto font-light relative z-10">
            Junte-se a milhares de importadores que já estão lucrando com o Asas de Importação.
          </p>
          <button className="btn-primary px-10 py-4 text-base shadow-[0_4px_30px_rgba(67,84,255,0.5)] relative z-10">
            Criar conta grátis agora
          </button>
        </div>
      </section>

      {/* ─── FOOTER ORIGINAL ──────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#04050D]">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center">
            <img
              src="https://i.postimg.cc/DZcqskjG/IMG_3713_3.png"
              alt="Drone Connect Academy"
              className="h-8 object-contain"
              referrerPolicy="no-referrer"
            />
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
