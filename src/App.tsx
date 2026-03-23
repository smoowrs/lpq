import { motion } from 'motion/react';
import { 
  Menu, PlayCircle, Users, CheckCircle2,
  Clock, MapPin, ShieldCheck, Box, MessageSquare,
  ArrowRight, UploadCloud, MonitorPlay, Infinity, Settings
} from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const [trackingStep, setTrackingStep] = useState(0);

  const stats = [
    { value: "+30.000", label: "clientes", desc: "Entre logistas, importadores e dropshippers", icon: <Users className="w-5 h-5" /> },
    { value: "+30 recursos", label: "", desc: "Para aumentar a eficiência e segurança na importação", icon: <Settings className="w-5 h-5" /> },
    { value: "+40% economia", label: "", desc: "ComIA que evita taxas abusivas na declaração", icon: <ShieldCheck className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <img src="https://i.postimg.cc/t4CHMJzj/brancalogo.png" alt="Asas de Importação" className="h-6 md:h-8 object-contain" referrerPolicy="no-referrer" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-300">
            <a href="#solucoes" className="hover:text-white transition-colors flex items-center gap-1">Soluções <span className="text-xs">▼</span></a>
            <a href="#recursos" className="hover:text-white transition-colors flex items-center gap-1">Recursos <span className="text-xs">▼</span></a>
            <a href="#comunidade" className="hover:text-white transition-colors flex items-center gap-1">Comunidade <span className="text-xs">▼</span></a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
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
              Começar agora
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

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 relative border-b border-white/5 bg-[#04050D]">
        
        {/* Abstract Background Elements (Subtle Neon Blues) */}
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-[#4354FF]/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#2E33FF]/10 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="max-w-[1400px] mx-auto min-h-[60vh] flex flex-col justify-center relative z-10">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-6 border border-[#4354FF]/30">
                <Users className="w-3.5 h-3.5 text-[#4354FF]" />
                PARA EMPRESAS E IMPORTADORES
              </div>
              
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.15] text-white">
                A solução mais completa de <br className="hidden md:block" />
                <span className="text-[#4354FF]">importação e logística</span>
              </h1>
              
              <p className="text-[17px] text-[#A1A1A8] mb-10 leading-relaxed font-light">
                Importe, proteja e avalie suas remessas com inteligência artificial — tudo em um só lugar com rastreamento preciso.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary px-8 py-4 text-base w-full sm:w-auto text-center">
                  Começar teste grátis
                </button>
                <button className="btn-secondary px-8 py-4 text-base w-full sm:w-auto text-center hover:bg-white/5 transition-colors">
                  Saiba mais
                </button>
              </div>
            </motion.div>

            {/* Split Screen Image Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-white/5"
            >
              <div className="absolute inset-0 grid grid-cols-2">
                <div className="bg-black/40 border-r border-white/5 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F4C] to-black opacity-60"></div>
                  <img src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800" alt="Logistics" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" />
                </div>
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Person" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04050D] via-transparent to-transparent opacity-80" />
                </div>
              </div>
              {/* Pagination simulation */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section below Hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/5">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-400 mb-2">
                  {stat.icon}
                  {stat.desc && <span className="text-sm font-medium leading-tight">{stat.desc}</span>}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-semibold text-white">{stat.value}</span>
                  <span className="text-gray-400 font-medium">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature Section 2 - Matching the Image references */}
      <section className="py-24 px-4 md:px-8 bg-[#04050D]">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="mb-16 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-6 border border-[#4354FF]/30 mx-auto md:mx-0">
              <UploadCloud className="w-3.5 h-3.5 text-[#4354FF]" />
              ASAS PARA VOCÊ
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
              Soluções para todos os públicos
            </h2>
            <p className="text-lg text-[#A1A1A8] max-w-2xl font-light mx-auto md:mx-0">
              Desde pequenos importadores até grandes distribuidoras operando o braço logístico como o pilar central de seus negócios digitais.
            </p>
          </div>

          {/* Large Card Layout */}
          <div className="glass-card rounded-3xl overflow-hidden p-1 flex flex-col md:flex-row relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4354FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-6 w-fit border border-[#4354FF]/30">
                <MonitorPlay className="w-3.5 h-3.5 text-[#4354FF]" />
                IMPORTADORES
              </div>
              <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4">Conecte e Escale</h3>
              <p className="text-[#A1A1A8] text-base md:text-lg mb-8 font-light">
                Controle os processos, rastreie em tempo real e integre IA para otimizar conversões, declarando o imposto corretamente para não ser taxado.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <div className="glass-pill px-4 py-3 rounded-lg text-sm text-gray-300 font-medium hover:bg-white/5 transition-colors cursor-pointer border-white/10">
                  RASTREIO GLOBAL
                </div>
                <div className="glass-pill px-4 py-3 rounded-lg text-sm text-gray-300 font-medium hover:bg-white/5 transition-colors cursor-pointer border-white/10">
                  MINERADOR DE DICAS
                </div>
                <div className="glass-pill px-4 py-3 rounded-lg text-sm text-gray-300 font-medium hover:bg-white/5 transition-colors cursor-pointer border-white/10">
                  CONNECT AI
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative min-h-[300px] md:min-h-full overflow-hidden rounded-r-2xl border-l border-white/5">
               <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" alt="Tech Setup" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#04050D]/50 to-[#04050D]"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Section 3 - Highlight Migration / Upload */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#04050D] to-[#0A0D26] relative border-t border-white/5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4354FF]/50 to-transparent"></div>
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass-pill text-[11px] font-semibold text-gray-300 tracking-wider mb-6 border border-[#4354FF]/30">
              <Infinity className="w-3.5 h-3.5 text-[#4354FF]" />
              INTEGRAÇÃO RÁPIDA
            </div>
            
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Migração facilitada para<br className="hidden md:block"/> acelerar seus resultados
            </h2>
            
            <p className="text-lg text-[#A1A1A8] max-w-2xl mx-auto font-light mb-16">
              Vindo de outra plataforma? Use nossa extensão para importar seus dados para a Asas em minutos, e economize horas de trabalho manual.
            </p>

            <div className="relative w-full max-w-5xl mx-auto glass-card rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-2 md:p-4">
               <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" alt="Dashboard" className="w-full h-auto rounded-xl opacity-90 mix-blend-lighten" />
               {/* Overlay elements like in image 3 */}
               <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-12 h-12 md:w-16 md:h-16 bg-[#4354FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(67,84,255,0.6)] animate-bounce cursor-pointer">
                 <MessageSquare className="w-6 h-6 text-white" />
               </div>
            </div>
        </div>
      </section>

      {/* Footer minimal style */}
      <footer className="py-12 px-8 bg-[#04050D] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#A1A1A8]">
            <img src="https://i.postimg.cc/t4CHMJzj/brancalogo.png" alt="Logo" className="h-6" referrerPolicy="no-referrer" />
            <p>© 2026 Asas de Importação. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            </div>
        </div>
      </footer>

    </div>
  );
}
