import { motion } from './utils/motion-gsap';
import { Package, Sparkles, Users, ShieldCheck,
  ArrowRight, PlayCircle, CheckCircle2,
  Clock, MapPin, Play,
  Crown, Star, ChevronDown, Check,
  Factory, X, Globe
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { CheckoutModal } from './components/CheckoutModal';
import { trackPageView } from './services/facebookPixel';
import { trackFBEvent } from './utils/fb-events';
import { translations } from "./translations";
type Language = 'pt' | 'pt-PT' | 'en' | 'es' | 'fr';

const flags: Record<Language, string> = {
  pt: "🇧🇷",
  'pt-PT': "🇵🇹",
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷"
};

export default function App() {
  const [trackingStep, setTrackingStep] = useState(0);
  const [language, setLanguage] = useState<Language>('pt');
  const [hasDetectedRegion, setHasDetectedRegion] = useState(false);

  useEffect(() => {
    trackPageView();
  }, []);

  // Auto-detect region & language
  useEffect(() => {
    if (hasDetectedRegion) return;
    
    const detect = async () => {
      let isEurope = false;
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.continent_code === 'EU') {
          isEurope = true;
        }
      } catch (err) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && (tz.startsWith('Europe/') || tz.startsWith('Africa/'))) {
          isEurope = true;
        }
      } finally {
        const navLang = navigator.language.toLowerCase();
        
        if (isEurope) {
          setRegion('europa');
          if (navLang.startsWith('es')) setLanguage('es');
          else if (navLang.startsWith('fr')) setLanguage('fr');
          else if (navLang === 'pt-pt' || navLang === 'pt_pt') setLanguage('pt-PT');
          else setLanguage('pt');
        } else {
          setRegion('brasil');
          setLanguage('pt'); // Force BR Portuguese for everyone not strictly in Europe
        }
        
        setHasDetectedRegion(true);
      }
    };
    detect();
  }, [hasDetectedRegion]);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [region, setRegion] = useState<'brasil' | 'europa'>('brasil');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  const navLinks = [
    { name: t.nav.community, href: '#comunidade' },
    { name: "O Minerador", href: '#minerador' },
    { name: "Aulas", href: '#aulas' },
    { name: "Fábricas", href: '#fabricas' },
    { name: "Connect AI", href: '#ai' },
    { name: "Rastreio", href: '#rastreio' },
    { name: "Planos", href: '#planos' },
    { name: "Recompensas", href: '#ranking' },
  ];

  // ─── Dados estáticos fora do componente: sem recriação em cada render ───
  const trackingStages = [
    { icon: <Package className="w-4 h-4" /> },
    { icon: <MapPin className="w-4 h-4" /> },
    { icon: <ShieldCheck className="w-4 h-4" /> },
    { icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  // Fecha menu de idioma ao clicar fora (Mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToPlanos = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById('planos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Enviar evento de PageView inicial para Pixel e CAPI (Deduplicado)
    trackFBEvent('PageView');
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-[#F5F5F7] selection:bg-white/20 flex flex-col">
      <Toaster position="top-right" />
      {isCheckoutOpen && selectedPlan && (
        <CheckoutModal 
          plan={selectedPlan} 
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            // Sucesso! O modal já mostra a tela de sucesso
          }}
        />
      )}

      {/* ─── NAV ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between relative gap-4">

          {/* Coluna 1: Logo (Desktop) / Idioma (Mobile) */}
          <div className="flex items-center justify-start z-30 min-w-max">
            {/* Logo Desktop */}
            <div className="hidden lg:block">
              <img
                src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
                alt="Asas de Importação"
                className="h-10 object-contain"
                referrerPolicy="no-referrer"
                fetchpriority="high"
                width="160"
                height="40"
              />
            </div>

            {/* Mobile Idioma Selector */}
            <div className="lg:hidden relative z-50" ref={langMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangMenuOpen(!isLangMenuOpen);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all text-sm active:scale-90"
              >
                <span className="text-lg leading-none">{flags[language]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-52 bg-[#0d0d0d] border border-white/10 rounded-xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[70] animate-in fade-in zoom-in duration-200">
                  {(['pt', 'pt-PT', 'en', 'es', 'fr'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage(lang);
                        setRegion(lang === 'pt' ? 'brasil' : 'europa');
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3.5 flex items-center gap-3 text-xs hover:bg-white/5 transition-colors ${language === lang ? 'text-white font-bold bg-white/5' : 'text-gray-400'}`}
                    >
                      <span className="text-lg leading-none">{flags[lang]}</span>
                      <span className="whitespace-nowrap">{translations[lang].nav.lang}</span>
                      <div className="flex-1" />
                      {language === lang && <Check className="w-3.5 h-3.5 text-[#582ef5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna 2: Links (Desktop) / Logo (Mobile) */}
          <div className="flex items-center justify-center z-10">
            {/* Links Desktop */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[12px] xl:text-[14px] font-light tracking-wide text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Logo Mobile */}
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <img
                src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
                alt="Asas de Importação"
                className="h-6 sm:h-7 object-contain pointer-events-auto"
                referrerPolicy="no-referrer"
                fetchpriority="high"
                width="120"
                height="28"
              />
            </div>
          </div>

          {/* Coluna 3: CTAs / Idioma (Desktop) */}
          <div className="flex items-center justify-end gap-2 md:gap-4 z-30 min-w-max">
            <div className="flex items-center gap-1 sm:gap-4">
              <button
                onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                className="text-[11px] sm:text-[14px] md:text-[15px] font-bold text-gray-400 hover:text-white transition-colors px-2 py-2"
              >
                {t.nav.login}
              </button>
              <button
                onClick={scrollToPlanos}
                className="btn-primary px-3 sm:px-6 py-1.5 md:py-2.5 text-[11px] sm:text-[14px] md:text-[15px] font-bold whitespace-nowrap rounded-full md:rounded-xl shadow-lg shadow-[#582ef5]/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="hidden sm:inline">{t.nav.create}</span>
                <span className="sm:hidden">{t.nav.create_short}</span>
              </button>
            </div>

            {/* Desktop Idioma Selector (Bem na direita) */}
            <div className="hidden lg:block relative group/lang">
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-all text-white/90">
                <span className="text-lg">{flags[language]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover/lang:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-52 bg-[#0d0d0d] border border-white/10 rounded-xl py-2 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
                {(['pt', 'pt-PT', 'en', 'es', 'fr'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage(lang);
                      setRegion(lang === 'pt' ? 'brasil' : 'europa');
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-xs hover:bg-white/5 transition-colors ${language === lang ? 'text-white font-bold bg-white/5' : 'text-gray-400'}`}
                  >
                    <span className="text-lg leading-none">{flags[lang]}</span>
                    <span className="whitespace-nowrap">{translations[lang].nav.lang}</span>
                    <div className="flex-1" />
                    {language === lang && <Check className="w-3.5 h-3.5 text-[#582ef5]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="min-h-screen pt-20 pb-20 px-6 relative overflow-hidden border-b border-white/5 flex items-center justify-center">

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 relative z-10 w-full">

          {/* Lado Esquerdo (ou Mobile Top) */}
          <div className="md:w-[45%] flex flex-col items-center md:items-start text-center md:text-left w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center md:items-start"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(88,46,245,0.15)]">
                <Sparkles className="w-3 h-3 text-[#582ef5]" />
                <span className="text-gray-200">{t.hero.sparkle}</span>
              </div>

              <h1 className="text-[28px] md:text-5xl lg:text-[44px] xl:text-[56px] font-black tracking-tight mb-8 leading-[1.05] text-white">
                {/* Versão Desktop (3 linhas) */}
                <div className="hidden md:flex flex-col items-start text-white">
                  <span className="whitespace-nowrap">{t.hero.title1}</span>
                  <span className="whitespace-nowrap">{t.hero.title2}</span>
                  <span className="whitespace-nowrap">{t.hero.title3}</span>
                </div>

                {/* Versão Mobile (2 linhas) */}
                <div className="flex md:hidden flex-col items-center text-white">
                  <span className="whitespace-nowrap">{t.hero.title1}</span>
                  <span className="whitespace-nowrap">{t.hero.titleMob}</span>
                </div>
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
                      loading="eager"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[13px] sm:text-[14px] md:text-base text-gray-400 mb-10 max-w-xl leading-relaxed px-4 md:px-0 opacity-80">
                {t.hero.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToPlanos}
                  className="btn-primary px-8 py-4.5 text-[15px] sm:text-[16px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 group whitespace-nowrap rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.25)]"
                >
                  {t.hero.btnCreate}
                  <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                  </motion.div>
                </motion.button>
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToPlanos}
                  className="btn-secondary px-8 py-4.5 text-[15px] sm:text-[16px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl group whitespace-nowrap border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  {t.hero.btnWork}
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
            className="hidden md:block relative w-full md:w-[58%] mx-auto"
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
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── COMUNIDADE ────────────────────────────────────────── */}
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
                  loading="lazy"
                  decoding="async"
                  width="220"
                  height="440"
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
                  <span className="whitespace-nowrap text-white">{t.comunidade.title2}</span>
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
                  loading="lazy"
                  decoding="async"
                  width="520"
                  height="1040"
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
                <span className="whitespace-nowrap text-white">{t.comunidade.title2}</span>
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

      {/* ─── PRODUTOS ────────────────────────────────────────── */}
      <section id="produtos" className="pt-24 md:pt-32 pb-12 md:pb-32 relative overflow-hidden bg-black border-t border-white/5 order-4 md:order-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Layer de Fundo: Cards Espalhados */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center md:justify-end md:pr-12 lg:pr-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative w-full md:w-1/2 h-full flex items-center justify-center perspective-[2500px]"
          >
            {[
              { img: "https://i.postimg.cc/DZ1c1XRC/connect_ai_1774345789074.webp", x: -140, y: -120, r: -15, s: 0.95, z: 10 },
              { img: "https://i.postimg.cc/d1G9Gyg2/connect_ai_1774346079071.webp", x: 120, y: -180, r: 10, s: 1.05, z: 40 },
              { img: "https://i.postimg.cc/C1b4bq9m/connect_ai_1774346157539.webp", x: -60, y: 180, r: 12, s: 1.1, z: 35 },
              { img: "https://i.postimg.cc/fWjKLYcN/connect_ai_1774346252722.jpg", x: 200, y: 140, r: -8, s: 0.85, z: 8 },
              { img: "https://i.postimg.cc/yd0T0Z2L/connect_ai_1774346417447.webp", x: -260, y: 60, r: -22, s: 1.05, z: 12 },
              { img: "https://i.postimg.cc/yxByjNH4/connect_ai_1774346485902.jpg", x: 240, y: -40, r: 18, s: 1.0, z: 4 },
              { img: "https://i.postimg.cc/Y03fswr6/connect_ai_1774346610865.jpg", x: -40, y: -240, r: 5, s: 0.8, z: 1 },
              { img: "https://i.postimg.cc/nrkYPtF3/connect_ai_1774346674187.jpg", x: 100, y: 50, r: -10, s: 0.85, z: 2 },
              { img: "https://i.postimg.cc/PJ4zRkX2/connect_ai_1774346817363.jpg", x: 0, y: -30, r: 0, s: 0.95, z: 3 },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5, x: 0, y: 50 }}
                whileInView={{ opacity: 1, x: card.x, y: card.y, rotate: card.r, scale: card.s }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 1.2, type: "spring", stiffness: 35, damping: 15 }}
                className="absolute w-24 sm:w-28 md:w-44 lg:w-48 aspect-[3/4.2] rounded-[1.25rem] md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] bg-[#0d0d0d]"
                style={{ zIndex: card.z }}
              >
                <img src={card.img} className="w-full h-full object-cover brightness-50 md:brightness-100" alt="" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/60 via-transparent to-transparent opacity-60 md:opacity-40 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-20 pointer-events-none opacity-95 md:opacity-90 md:hidden" />
            <div className="absolute inset-0 bg-[#582ef5]/5 rounded-full blur-[150px] -z-10" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-30 flex flex-col md:flex-row items-center justify-center md:justify-between min-h-[500px] md:min-h-0">
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start w-full max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
                <Package className="w-3.5 h-3.5 text-[#582ef5]" />
                <span className="text-gray-300 uppercase tracking-wider">{t.produtos.tag}</span>
              </div>
              <h2 className="text-[28px] md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 md:mb-8 leading-[1.05] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                {t.produtos.title1} <br />
                <span className="text-white">{t.produtos.title2}</span>
              </h2>
              <p className="hidden md:block text-sm md:text-lg text-gray-300 md:text-gray-400 mb-10 leading-relaxed max-w-md text-left drop-shadow-lg">
                {t.produtos.desc}
              </p>
              <motion.button
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.95 }}
                onClick={scrollToPlanos}
                className="btn-primary w-full max-w-[340px] py-4 text-[13px] sm:text-[15px] font-bold flex items-center justify-center gap-2 group mx-auto md:mx-0 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300"
              >
                {t.produtos.btn}
                <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
          <div className="md:w-1/2 hidden md:block" />
        </div>
      </section>

      {/* ─── AULAS PASSO A PASSO ────────────────────────────────── */}
      <section id="aulas" className="py-24 md:py-32 px-6 relative overflow-hidden border-t border-white/5 bg-black order-5 md:order-none">

        {/* Layer de Fundo: Cards Espalhados (Apenas Mobile) */}
        <div className="md:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center scale-[0.7] opacity-60 transform-gpu">
            {[
              { img: "https://i.postimg.cc/bwhjVVkb/brands_wnba_3.jpg", id: "01", x: -140, y: -180, rot: -15 },
              { img: "https://i.postimg.cc/T36XNNgg/brands_wnba_19_2.jpg", id: "02", x: 120, y: -140, rot: 15 },
              { img: "https://i.postimg.cc/bwhjVVkn/brands_wnba_18_2.jpg", id: "03", x: -180, y: 40, rot: -25 },
              { img: "https://i.postimg.cc/x12SppM3/brands_wnba_20_2.jpg", id: "04", x: -20, y: -20, rot: 5 },
              { img: "https://i.postimg.cc/FH4QCC3B/brands_wnba_21_3.jpg", id: "05", x: 160, y: 60, rot: 10 },
              { img: "https://i.postimg.cc/0ysqXXDh/brands_wnba_22_2.jpg", id: "06", x: -60, y: 220, rot: -5 }
            ].map((aula, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8, x: 0, y: 40, rotateZ: 0 }}
                whileInView={{ opacity: 1, scale: 1, x: aula.x, y: aula.y, rotateZ: aula.rot }}
                viewport={{ once: true, margin: "-20px" }}
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
            <h2 className="text-[28px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-8 leading-[1.1] drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] text-white">
              {/* Versão Desktop */}
              <span className="hidden md:block">
                {t.aulas.title1} <br />
                <span className="text-white">{t.aulas.title2}</span>
              </span>
              {/* Versão Mobile (1 linha) */}
              <span className="md:hidden block whitespace-nowrap text-[26px]">
                {t.aulas.titleMob}
              </span>
            </h2>
            <p className="hidden md:block text-sm md:text-base text-gray-300 md:text-gray-400 mb-8 md:mb-10 leading-relaxed max-w-md drop-shadow-lg">
              {t.aulas.desc}
            </p>

            <ul className="hidden md:block space-y-5 mb-12 w-full max-w-sm drop-shadow-2xl">
              {t.aulas.items.map((item, i) => (
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
                    {t.fabricas.title1} {t.fabricas.title2} <br />
                    <span className="text-white">{t.fabricas.title3}</span>
                  </span>
                  {/* Versão Mobile (2 linhas) */}
                  <span className="md:hidden text-center md:text-left block">
                    {t.fabricas.titleMob1} <br />
                    <span className="text-white">{t.fabricas.titleMob2}</span>
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


      {/* ─── O MINERADOR ────────────────────────────────────────── */}
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
                <span className="hidden md:block text-white">
                  {t.minerador.title1} {t.minerador.title2}
                </span>
                {/* Versão Mobile (1 linha) */}
                <span className="md:hidden block whitespace-nowrap text-[26px]">
                  {t.minerador.title1} <span className="text-white">{t.minerador.title2}</span>
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
                          <img src="https://i.postimg.cc/8cY35tFt/freepik-enhance-14595.jpg" alt="Minerador" className="w-8 h-8 object-cover rounded-full" loading="lazy" decoding="async" />

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
                        <button className="w-full py-1.5 sm:py-2 bg-[#582ef5] text-white text-[9px] sm:text-[11px] font-black rounded-lg hover:bg-[#4c26d4] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#582ef5]/20">
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
                      <img src="https://i.postimg.cc/8cY35tFt/freepik-enhance-14595.jpg" alt="Minerador" className="w-8 h-8 object-cover rounded-full" loading="lazy" decoding="async" />

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

                {/* Typing status (fake) */}
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

      {/* ─── NÍVEIS E RECOMPENSAS ────────────────────────────────────────── */}
      <section id="ranking" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-7 md:order-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#582ef5]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

            {/* Texto (Esquerda no Desktop) */}
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center md:items-start">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-[#582ef5]" />
                  <span className="text-gray-300 uppercase tracking-wider">{t.recompensas.tag}</span>
                </div>

                <h2 className="text-[28px] md:text-6xl font-bold tracking-tighter mb-6 leading-[1.1] text-white text-center md:text-left">
                  {t.recompensas.title1} <br />
                  <span className="text-white">{t.recompensas.title2}</span>
                </h2>

                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToPlanos}
                  className="btn-primary w-fit px-12 py-5 text-base font-bold flex items-center justify-center gap-3 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.2)] transition-all duration-300"
                >
                  {t.recompensas.btn}
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
                      <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover grayscale opacity-70" alt="2º Lugar" loading="lazy" decoding="async" />
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
                      <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover" alt="1º Lugar" loading="lazy" decoding="async" />
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
                      <img src="https://i.postimg.cc/7YzQQpvt/IMG_5699_2.png" className="w-full h-full rounded-full object-cover grayscale opacity-70" alt="3º Lugar" loading="lazy" decoding="async" />
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


      {/* ─── TRACKING SECTION ─────────────────────────────────── */}
      <section id="rastreio" className="py-32 px-6 relative overflow-hidden order-8 md:order-none">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#2b34f5]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#582ef5]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col justify-center min-h-[500px] md:min-h-[580px] lg:min-h-[620px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#582ef5]/15 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2b34f5]/10 rounded-full blur-3xl opacity-30" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t.rastreio.status}</h3>
                  </div>
                  <div className="px-5 py-2 bg-[#582ef5] text-white rounded-xl text-[10px] md:text-[11px] font-extrabold border border-white/20 uppercase tracking-widest shadow-[0_0_25px_rgba(88,46,245,0.4)] animate-pulse">
                    {t.rastreio.moving}
                  </div>
                </div>

                <div className="space-y-8">
                  {trackingStages.map((stage, index) => {
                    const isActive = index <= trackingStep;
                    const isCurrent = index === trackingStep;
                    return (
                      <div key={index} className="flex gap-6 relative">
                        {index < trackingStages.length - 1 && (
                          <div className={`absolute left-[15px] top-10 bottom-[-32px] w-[2px] ${isActive ? 'bg-[#582ef5]' : 'bg-white/10'}`} />
                        )}
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-700 ${isActive ? 'bg-[#582ef5] text-white shadow-[0_0_25px_rgba(88,46,245,0.5)]' : 'bg-white/5 text-gray-600 border border-white/10'
                          }`}>
                          {stage.icon}
                        </div>
                        <div className={`pt-1 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                          <p className={`text-[15px] md:text-[17px] font-bold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{t.rastreio.stages[index].title}</p>
                          <p className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-1 font-medium italic opacity-80">
                            <Clock className="w-3.5 h-3.5" /> {t.rastreio.stages[index].time}
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
              <span className="text-gray-300 uppercase tracking-wider">{t.rastreio.tag}</span>
            </div>
            <h2 className="text-[28px] md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1] text-white">
              {/* Versão Desktop */}
              <span className="hidden md:block">
                {t.rastreio.title1} <br />
                <span className="text-white">{t.rastreio.title2}</span>
              </span>
              {/* Versão Mobile */}
              <span className="md:hidden block whitespace-nowrap text-[26px]">
                {t.rastreio.titleMob}
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed">
              {t.rastreio.desc}
            </p>
            <ul className="space-y-4 mb-10">
              {t.rastreio.items.map((item, i) => (
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
              onClick={scrollToPlanos}
              className="btn-primary px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 group"
            >
              {t.rastreio.btn}
              <motion.div variants={{ initial: { x: 0 }, hover: { x: 3 } }}>
                <Package className="w-4 h-4" strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── CONNECT AI / IMAGE CAROUSEL ──────────────────────── */}
      <section id="ai" className="pt-8 pb-24 md:py-32 border-t border-white/5 bg-black overflow-hidden relative order-9 md:order-none">
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
                <span className="text-gray-300 uppercase tracking-wider">{t.connectAI.tag}</span>
              </div>
              <h2 className="text-[28px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                {/* Versão Desktop */}
                <span className="hidden md:block">
                  {t.connectAI.title1} <br />
                  <span className="text-gradient-ai">{t.connectAI.title2}</span>
                </span>
                {/* Versão Mobile */}
                <span className="md:hidden block">
                  {t.connectAI.title1} <br />
                  <span className="text-gradient-ai">{t.connectAI.title2}</span>
                </span>
              </h2>
              <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-md">
                {t.connectAI.desc}
              </p>
              <ul className="space-y-4 mb-10">
                {t.connectAI.items.map((item, i) => (
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
                onClick={scrollToPlanos}
                className="btn-primary px-8 py-4 text-sm font-bold flex items-center justify-center gap-3 group rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.3)] transition-all duration-300"
              >
                {t.connectAI.btn}
                <motion.div variants={{ initial: { x: 0 }, hover: { rotate: 15, scale: 1.2 } }}>
                  <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Direita: Pilha de Imagens 3D Original (Connect AI) */}
            <div className="relative h-[250px] sm:h-[350px] md:h-[600px] flex items-center justify-center mt-4 md:mt-24 perspective-[1500px]">
              <div className="relative w-full h-full scale-[0.65] sm:scale-80 md:scale-100 origin-top-left md:origin-center -translate-y-8 sm:-translate-y-10 md:translate-y-0 translate-x-4 md:translate-x-0">
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
                    <img src={card.img} alt={`Connect AI ${card.id}`} className="w-full h-full object-cover brightness-90 group-hover/card-3d:brightness-110 transition-all" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLANOS DE ACESSO ─────────────────────────────────── */}
      <section id="planos" className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-10 md:order-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#582ef5]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#582ef5]/10 border border-[#582ef5]/20 text-xs font-semibold mb-6 backdrop-blur-md text-[#582ef5] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.planos.tag}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 text-white">
              {t.planos.title}
            </h2>

            {/* Toggles removidos: os planos já possuem ciclos fixos */}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {[
              { id: 'free', data: t.planos.free, color: '#444', secondary: '#222' },
              { id: 'starter', data: t.planos.starter, color: '#aaa', secondary: '#555' },
              { id: 'pro', data: t.planos.pro, color: '#582ef5', secondary: '#2b34f5' },
              { id: 'elite', data: t.planos.elite, color: '#f59e0b', secondary: '#d97706' }
            ].map((plan, idx) => {
              const isBrasil = region === 'brasil';
              
              const pricesMap: Record<string, { BR: string; EU: string; oldBR: string; oldEU: string }> = {
                free: { BR: "0", EU: "0", oldBR: "0", oldEU: "0" },
                starter: { BR: "58,20", EU: "9,60", oldBR: "97,00", oldEU: "16,00" },
                pro: { BR: "118,20", EU: "19,20", oldBR: "197,00", oldEU: "32,00" },
                elite: { BR: "233,40", EU: "38,40", oldBR: "389,00", oldEU: "64,00" }
              };
              
              const pData = pricesMap[plan.id as keyof typeof pricesMap];
              const price = isBrasil ? pData.BR : pData.EU;
              const originalPrice = isBrasil ? pData.oldBR : pData.oldEU;
              
              const [whole, cents] = price.includes(',') ? price.split(',') : [price, '00'];
              const period = plan.data.periodLabel || plan.data.period;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative group h-full flex flex-col p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden ${plan.id === 'pro' ? 'ring-2 ring-[#582ef5]/30' : ''}`}
                >
                  {/* Accent Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: plan.color }} />

                  {/* Icon - hidden for free plan */}
                  {plan.id !== 'free' && (
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-xl">
                      <Package className="w-6 h-6" style={{ color: plan.color }} />
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:scale-105 transition-transform origin-left" style={{ color: plan.id === 'free' ? 'white' : plan.color }}>{plan.data.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium min-h-[40px]">{plan.data.desc}</p>
                  </div>

                  {/* Price - hidden for free plan */}
                  {plan.id !== 'free' && (
                  <div className="mb-8 flex flex-col items-start text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-500 line-through">
                        {isBrasil ? 'R$' : '€'} {originalPrice}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wide">
                        {plan.data.discount || '40% OFF'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xs font-black text-gray-400 leading-none self-start mt-2.5">{isBrasil ? 'R$' : '€'}</span>
                      <span className="text-[44px] font-black tracking-tighter text-white leading-none">
                        {whole}
                      </span>
                      {cents !== '00' && (
                        <span className="text-[20px] font-black text-white/50 leading-none self-end pb-1">,{cents}</span>
                      )}
                      <span className="text-sm font-bold text-gray-500 self-end pb-1">
                        {period?.toLowerCase()}
                      </span>
                    </div>
                    
                    <p className="text-[10px] font-black text-[#22c55e] mt-2 uppercase tracking-wide">
                      {plan.id === 'starter' ? '3 meses de acesso' : plan.id === 'pro' ? '1 ano de acesso' : 'acesso para sempre'}
                    </p>
                  </div>
                  )}

                  {/* Features - hidden for free plan */}
                  {plan.id !== 'free' && (
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.data.items?.map((item: any, i: number) => (
                      <li key={i} className={`flex items-start gap-3 text-[11px] font-bold leading-relaxed transition-colors ${item.status ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.status ? (
                          <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: plan.color }} />
                        ) : (
                          <X className="w-4 h-4 text-red-500/50 shrink-0" />
                        )}
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  )}

                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (plan.id === 'free') {
                        window.location.href = 'https://app.connectacademy.com.br/cadastro';
                        return;
                      }
                      
                      const regionKey = region === 'brasil' ? 'BR' : 'EU';
                      
                      const cycleMap: Record<string, string> = {
                        starter: 'trimestral',
                        pro: 'annual',
                        elite: 'one-time'
                      };

                      const planInfo = {
                        id: plan.id,
                        label: plan.data.name,
                        billingCycle: cycleMap[plan.id] || 'annual',
                        region: regionKey,
                        priceValue: pData,
                        prices: {
                          BR: { monthly: pData.BR, annual: pData.BR },
                          EU: { monthly: pData.EU, annual: pData.EU }
                        },
                        trialDays: 0
                      };
                      
                      setSelectedPlan(planInfo);
                      setIsCheckoutOpen(true);
                    }}
                    className={`w-full py-4 rounded-2xl text-xs font-black tracking-widest transition-all shadow-lg ${plan.id === 'free'
                        ? 'bg-white/5 text-gray-400 border border-white/10'
                        : 'text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                      }`}
                    style={plan.id !== 'free' ? { backgroundColor: plan.color, boxShadow: `0 10px 30px ${plan.color}33` } : {}}
                  >
                    {plan.id === 'free' ? t.nav.create.toUpperCase() : t.planos.btnSelect}
                  </motion.button>
                  
                  {plan.id !== 'free' && (
                    <div className="mt-5 flex flex-col items-center gap-2.5 w-full">
                      <p className="text-[11px] font-bold text-gray-400 text-center">
                        {language.startsWith('pt') ? 'Cancele quando quiser.' : language === 'es' ? 'Cancela cuando quieras.' : language === 'fr' ? 'Annulez à tout moment.' : 'Cancel anytime.'}
                      </p>

                      <div className="flex items-center justify-center gap-4 mt-1 flex-wrap">
                        {/* VISA — bold italic blue, official style */}
                        <span className="text-[15px] font-black italic leading-none text-white" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.5px' }}>VISA</span>

                        {/* Mastercard — circles + label */}
                        <svg viewBox="0 0 38 24" className="h-[16px] w-auto">
                          <circle cx="13" cy="12" r="11" fill="#EB001B"/>
                          <circle cx="25" cy="12" r="11" fill="#F79E1B"/>
                          <path d="M19 4.8 A11 11 0 0 1 19 19.2 A11 11 0 0 1 19 4.8 Z" fill="#FF5F00"/>
                        </svg>

                        {/* Google Pay — colored G icon + white Pay */}
                        <div className="flex items-center gap-[2px]">
                          <svg viewBox="0 0 48 48" className="h-[15px] w-auto">
                            <path fill="#4285F4" d="M47.6,24.5c0-1.6-0.1-3.1-0.4-4.6H24v8.5h13.4c-0.6,2.9-2.3,5.4-4.8,7.1v5.9h7.7C44.8,37.1,47.6,31.2,47.6,24.5z"/>
                            <path fill="#34A853" d="M24,48c6.6,0,12.2-2.2,16.2-5.9l-7.7-5.9c-2.2,1.5-5,2.4-8.5,2.4c-6.5,0-12-4.4-14-10.3h-8v6.1C8.2,42.7,15.5,48,24,48z"/>
                            <path fill="#FBBC05" d="M10,28.3c-0.5-1.5-0.8-3.1-0.8-4.8s0.3-3.3,0.8-4.8v-6.1h-8C0.7,15.7,0,19.8,0,24s0.7,8.3,2,11.5L10,28.3z"/>
                            <path fill="#EA4335" d="M24,9.5c3.6,0,6.8,1.2,9.3,3.7l6.9-6.9C36.2,2.4,30.6,0,24,0C15.5,0,8.2,5.3,4,12.9l8,6.1C14,13.9,19.5,9.5,24,9.5z"/>
                          </svg>
                          <span className="text-[13px] font-medium text-white leading-none">Pay</span>
                        </div>

                        {/* Apple Pay — apple icon white + Pay white */}
                        <div className="flex items-center gap-[3px]">
                          <svg className="h-[14px] w-auto fill-white" viewBox="0 0 384 512">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 104.8-125.2-46.7-19-63.5-59-63.9-85.4zM201.2 45.4c2.8-4.6 5.3-9.4 7.3-14.4 2-5 3.6-10.2 4.8-15.6 1.1-5.3 1.7-10.8 1.9-16.3-5.2 .2-10.6 1.3-15.8 3.2-5.2 1.9-10.1 4.5-14.7 7.7-4.6 3.2-8.8 7-12.5 11.2-3.7 4.2-6.9 8.9-9.5 13.9-2.6 5-4.8 10.3-6.4 15.9-1.6 5.6-2.7 11.3-3.2 17.2 5.5-.3 11-.9 16.3-1.9 5.3-1 10.5-2.5 15.5-4.5 5-2 9.8-4.5 14.3-7.5z"/>
                          </svg>
                          <span className="text-[13px] font-medium text-white leading-none">Pay</span>
                        </div>

                        {/* Pix — Brasil only */}
                        {isBrasil && (
                          <svg viewBox="0 0 512 512" className="h-[16px] w-auto" fill="white">
                            <path d="M306.6 204.6c-12.7 0-24.6 4.9-33.6 13.9l-53.1 53.1c-4.8 4.8-12.6 4.8-17.4 0l-53.2-53.2c-9-9-20.9-13.9-33.6-13.9h-10.4l67.2-67.2c24.6-24.6 64.6-24.6 89.2 0l67.2 67.2h-22.3zM115.7 307.4c12.7 0 24.6-4.9 33.6-13.9l53.2-53.2c4.6-4.6 12.8-4.6 17.4 0l53.1 53.1c9 9 20.9 13.9 33.6 13.9h22.3l-67.2 67.2c-24.6 24.6-64.6 24.6-89.2 0l-67.2-67.2h10.4z"/>
                            <path d="M408.6 209.4l-47.4-47.4c-1.5 .6-3.1 1-4.8 1h-50c-8.3 0-16.2 3.2-22.1 9l-53.1 53.1c-9.4 9.4-24.7 9.4-34.1 0l-53.2-53.2c-5.8-5.8-13.7-9-22.1-9h-56.2c-1.7 0-3.3-.4-4.8-1L13.4 209.4c-17.9 17.9-17.9 46.9 0 64.8l47.4 47.4c1.5-.6 3.1-1 4.8-1h56.2c8.3 0 16.2-3.2 22.1-9l53.2-53.2c9.1-9.1 24.9-9.3 34.1 0l53.1 53.1c5.8 5.8 13.7 9 22.1 9h50c1.7 0 3.3 .4 4.8 1l47.4-47.4c17.9-17.9 17.9-46.9 0-64.8z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA (CUPOM DOURADO) ─────────────────────────────────── */}
      <section id="cadastro" className="py-24 md:py-32 px-6 relative overflow-hidden bg-black border-t border-white/5 order-11 md:order-none">
        {/* Efeitos de Fundo Atmosféricos */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#582ef5]/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#582ef5]/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-6 pt-16 pb-8 md:p-20 rounded-[2.5rem] md:rounded-[4rem] text-left overflow-hidden bg-[#22c55e] shadow-[0_40px_100px_rgba(34,197,94,0.3)]"
          >
            {/* Efeito de Cupom: Cortes Circulares */}
            <div className="absolute top-[12%] md:top-1/2 -left-5 md:-left-6 -translate-y-1/2 w-10 md:w-12 h-10 md:h-12 rounded-full bg-black border-r border-white/20 z-20" />
            <div className="absolute top-[12%] md:top-1/2 -right-5 md:-right-6 -translate-y-1/2 w-10 md:w-12 h-10 md:h-12 rounded-full bg-black border-l border-white/20 z-20" />

            {/* Linha de Perfuração (Horizontal no Mobile, Vertical no Desktop) */}
            <div className="absolute top-[12%] left-0 right-0 h-px border-t-2 border-dashed border-white/30 md:hidden" />
            <div className="absolute top-0 bottom-0 left-[18%] w-px border-l-2 border-dashed border-white/30 hidden md:block" />

            {/* Brilhos Internos */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 pt-8 md:pt-0 md:pl-[22%] pr-4 md:pr-12">
              <h2 className="text-[28px] md:text-4xl lg:text-6xl font-black tracking-tighter mb-5 leading-[1.1] text-white">
                <span className="block mb-1 uppercase opacity-90 sm:whitespace-nowrap">{t.cupom.title1}</span>
                <span className="block drop-shadow-xl sm:whitespace-nowrap">{t.cupom.title2}</span>
              </h2>

              <p className="text-white/80 text-sm md:text-lg mb-10 max-w-xl leading-relaxed font-medium">
                {t.cupom.desc}
              </p>

              <motion.button
                whileHover={{ scale: 1.03, y: -5 }}
                initial="initial"
                whileTap={{ scale: 0.98 }}
                onClick={scrollToPlanos}
                className="bg-white text-[#22c55e] px-12 py-5 text-base sm:text-xl font-black flex items-center justify-center gap-3 w-fit shadow-[0_20px_40px_rgba(0,0,0,0.2)] group rounded-2xl md:rounded-[1.2rem] transition-all duration-300"
              >
                {t.cupom.btn}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </motion.button>

              {/* Badges de Cupom */}
              <div className="mt-8 md:mt-12 flex flex-row items-center gap-4 md:gap-8 text-white/90">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-[7.5px] md:text-[10px] uppercase tracking-wider md:tracking-widest font-black">{t.cupom.badges[0]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-[7.5px] md:text-[10px] uppercase tracking-wider md:tracking-widest font-black">{t.cupom.badges[1]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-[7.5px] md:text-[10px] uppercase tracking-wider md:tracking-widest font-black">{t.cupom.badges[2]}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-6 order-11 md:order-none">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center">
            <img src="https://i.postimg.cc/DZcqskjG/IMG_3713_3.png" alt="Drone Connect Academy" className="h-8 object-contain" referrerPolicy="no-referrer" loading="lazy" decoding="async" width="120" height="32" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            © 2026 Connect Academy LTDA {t.footer.rights} - CNPJ:{' '}
            <a
              href="https://cnpj.biz/44292841000195"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300 transition-colors"
            >
              44.292.841/0001-95
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
