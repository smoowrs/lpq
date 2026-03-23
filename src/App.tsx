import { motion } from 'motion/react';
import { 
  Package, Sparkles, Users, ShieldCheck, 
  ArrowRight, PlayCircle, Menu, CheckCircle2,
  Clock, MapPin, Search, Bot, MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function App() {
  const [trackingStep, setTrackingStep] = useState(0);

  // Simulate tracking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Carousel Images (Simulating Connect AI generated images)
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

  // Stats
  const stats = [
    { value: "+30.000 clientes", desc: "Entre lojistas, empresas e criadores", icon: <Users className="w-5 h-5" /> },
    { value: "+30 recursos", desc: "Para aumentar a eficiência da sua operação", icon: <Package className="w-5 h-5" /> },
    { value: "+40% economia", desc: "No longo prazo evitando taxas abusivas", icon: <ShieldCheck className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#04050D] font-sans selection:bg-blue-500/30 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <img src="https://i.postimg.cc/t4CHMJzj/brancalogo.png" alt="Asas de Importação" className="h-6 md:h-8 object-contain" referrerPolicy="no-referrer" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-300">
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#rastreio" className="hover:text-white transition-colors">Rastreio</a>
            <a href="#comunidade" className="hover:text-white transition-colors">Comunidade</a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <img src="https://flagcdn.com/br.svg" alt="BR" className="w-5 rounded-[2px]" />
              <span className="text-xs text-gray-300">▼</span>
            </div>
            <button className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
              Entrar
            </button>
            <button className="btn-primary px-6 py-2.5 text-[15px]">
              Começar teste grátis
            </button>
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden flex items-center gap-3">
             <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-2">
              Entrar
            </button>
            <button className="btn-primary px-4 py-2 text-sm">
              Começar
            </button>
            <button className="btn-secondary p-2 flex items-center justify-center">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Carousel/Banner style) */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 relative border-b border-white/5">
        
        <div className="max-w-[1400px] mx-auto pt-8">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-6 border border-[#4354FF]/30">
                <Users className="w-3.5 h-3.5 text-[#4354FF]" />
                PARA EMPRESAS & IMPORTADORES
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-[1.10]">
                A solução mais completa em <br/>
                importação
              </h1>
              
              <p className="text-[17px] text-[#A1A1A8] mb-10 leading-relaxed font-light">
                Importe, proteja e avalie suas remessas com inteligência artificial — tudo em um só lugar com rastreamento preciso.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button className="btn-primary px-8 py-4 text-base w-full sm:w-auto text-center">
                  Começar teste grátis
                </button>
                <button className="btn-secondary px-8 py-4 text-base w-full sm:w-auto text-center hover:bg-white/5 transition-colors">
                  Saiba mais
                </button>
              </div>

            </motion.div>

            {/* Right Video Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(67,84,255,0.15)] overflow-hidden"
            >
              <div className="relative w-full aspect-video bg-black">
                <iframe 
                  src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=79d4adef-2ea8-45f0-8ed4-bdfb4a2d954b" 
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>

          </div>

          <div className="flex justify-center gap-2 mt-12 mb-12">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-10 border-t border-white/5">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4354FF]/10 flex items-center justify-center border border-[#4354FF]/20 shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-semibold text-white mb-1">{stat.value}</h4>
                  <p className="text-sm text-gray-400 font-medium">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Infinite Carousel Section / Connect AI */}
      <section className="py-24 md:py-32 border-y border-white/5 bg-[#0A0C1B] overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#0A0C1B] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#0A0C1B] to-transparent z-10 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-16 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-6 border border-[#4354FF]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#4354FF]" />
              CONNECT AI
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight mb-6 leading-[1.10]">
              Crie imagens que <br />
              <span className="text-[#4354FF]">vendem mais.</span>
            </h2>
            <p className="text-[17px] text-[#A1A1A8] font-light mb-8 leading-relaxed">
              Com o uso da Connect AI você transforma fotos simples de fornecedores em imagens que realmente geram interesse e um visual incrível na sua loja.
            </p>
            <ul className="space-y-4 mb-10">
              {['Imagens em 4K', 'Menos de 30s', 'Alta Conversão'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#4354FF]/10 flex items-center justify-center border border-[#4354FF]/30 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4354FF]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary px-8 py-3 text-sm">
              Testar Connect AI
            </button>
          </motion.div>
        </div>

        <div className="flex gap-6 animate-marquee mt-8">
          {[...carouselImages, ...carouselImages].map((img, index) => (
            <div key={index} className="flex-shrink-0 w-48 md:w-64 aspect-square rounded-2xl overflow-hidden glass-card relative group p-1">
              <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover transition-transform duration-500 rounded-xl group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 rounded-xl">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#4354FF]" /> Connect AI
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Tracking Section */}
      <section id="rastreio" className="py-24 md:py-32 px-4 md:px-8 relative overflow-hidden bg-[#04050D]">
        
        {/* Glows */}
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#4354FF]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2E33FF]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4354FF]/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Status do Pedido</h3>
                    <p className="text-sm text-gray-400 mt-1">Código: BR987654321CN</p>
                  </div>
                  <div className="px-4 py-1.5 bg-[#4354FF]/10 text-[#4354FF] border border-[#4354FF]/20 rounded-md text-xs font-semibold">
                    Em trânsito
                  </div>
                </div>

                <div className="space-y-8">
                  {trackingStages.map((stage, index) => {
                    const isActive = index <= trackingStep;
                    const isCurrent = index === trackingStep;
                    
                    return (
                      <div key={index} className="flex gap-4 relative">
                        {/* Line connector */}
                        {index < trackingStages.length - 1 && (
                          <div className={`absolute left-[15px] top-8 bottom-[-32px] w-[2px] ${isActive ? 'bg-[#4354FF]' : 'bg-white/10'}`} />
                        )}
                        
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 border ${
                          isActive ? 'bg-[#4354FF] text-white border-[#4354FF] shadow-[0_0_15px_rgba(67,84,255,0.4)]' : 'bg-[#0A0C1B] text-gray-500 border-white/20'
                        }`}>
                          {stage.icon}
                        </div>
                        
                        <div className={`pt-1 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                          <p className={`font-medium ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{stage.title}</p>
                          <p className="text-[13px] text-gray-500 flex items-center gap-1.5 mt-1.5">
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-6 border border-[#4354FF]/30">
              <Package className="w-3.5 h-3.5 text-[#4354FF]" />
              LOGÍSTICA INTELIGENTE
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight mb-6 leading-[1.10]">
              Rastreio em <br />
              <span className="text-[#4354FF]">Tempo Real.</span>
            </h2>
            <p className="text-[17px] text-[#A1A1A8] font-light mb-8 leading-relaxed max-w-xl">
              Nosso sistema se conecta diretamente com as transportadoras internacionais e Correios para te dar atualizações precisas e automáticas.
            </p>
            <ul className="space-y-4 mb-10">
              {['Notificações push a cada movimentação', 'Previsão de entrega com IA', 'Alerta automático de taxas'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#4354FF]/10 flex items-center justify-center border border-[#4354FF]/30 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4354FF]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary px-8 py-3 text-sm">
              Testar rastreio grátis
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden border-t border-white/5 bg-[#090B1A]">
        <div className="max-w-4xl mx-auto text-center relative z-10 p-10 md:p-20 glass-card rounded-3xl border border-[#4354FF]/20">
          <div className="absolute top-0 right-0 w-full h-full bg-[#4354FF]/5 rounded-3xl blur-3xl" />
          
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white relative z-10">
            Pronto para decolar?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto relative z-10 font-light">
            Junte-se a milhares de importadores que já estão lucrando com o Asas de Importação.
          </p>
          <div className="relative z-10">
            <button className="btn-primary px-10 py-4 text-base shadow-[0_4px_30px_rgba(67,84,255,0.6)]">
              Criar conta grátis agora
            </button>
          </div>
        </div>
      </section>

      {/* Footer Original */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#04050D]">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center gap-6">
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
