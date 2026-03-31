import { motion } from 'motion/react';
import { ChevronDown, Globe, PlayCircle } from 'lucide-react';
import React from 'react';

type Language = 'pt' | 'pt-PT' | 'en' | 'es' | 'fr';

const flags: Record<Language, string> = {
  pt: "🇧🇷",
  'pt-PT': "🇵🇹",
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷"
};

interface NavbarProps {
  t: any;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLangMenuOpen: boolean;
  setIsLangMenuOpen: (open: boolean) => void;
  langMenuRef: React.RefObject<HTMLDivElement | null>;
  scrollToPlanos: (e?: React.MouseEvent) => void;
}

export default function Navbar({ 
  t, 
  language, 
  setLanguage, 
  isLangMenuOpen, 
  setIsLangMenuOpen, 
  langMenuRef,
  scrollToPlanos 
}: NavbarProps) {
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between relative gap-4">

        {/* Coluna 1: Logo (Desktop) / Idioma (Mobile) */}
        <div className="flex items-center justify-start z-30 min-w-max">
          {/* Logo Desktop */}
          <div className="hidden lg:block">
            <a href="/" className="relative block group">
              <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />
              <img 
                src="https://i.postimg.cc/t4CHMJzj/brancalogo.png" 
                alt="Connect Academy" 
                className="h-9 relative z-10 transition-transform duration-500 group-hover:scale-105" 
                loading="eager"
                decoding="async"
              />
            </a>
          </div>

          {/* Menu de Idioma Mobile */}
          <div className="flex lg:hidden items-center">
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangMenuOpen(!isLangMenuOpen);
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all text-xs font-bold"
              >
                <span>{flags[language]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-12 left-0 w-32 bg-[#0d0d0d] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {(Object.keys(flags) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        language === lang ? 'bg-[#582ef5] text-white' : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <span>{flags[lang]} {lang.toUpperCase()}</span>
                      {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna 2: Center - Nav Links (Desktop) / Logo (Mobile Center) */}
        <div className="flex items-center justify-center flex-1">
          {/* Menu Desktop (Centralizado) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-full text-[13px] font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all relative group"
              >
                {link.name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#582ef5] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Logo Mobile (Centro) */}
          <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
            <img 
              src="https://i.postimg.cc/t4CHMJzj/brancalogo.png" 
              alt="Logo" 
              className="h-6 object-contain" 
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* Coluna 3: Right - Auth/Language (Desktop) / Play (Mobile) */}
        <div className="flex items-center justify-end z-30 min-w-max">
          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Selector Desktop (Select-like) */}
            <div className="relative group" ref={langMenuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangMenuOpen(!isLangMenuOpen);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-[13px] font-bold"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-12 right-0 w-36 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">{t.nav.selectLang}</div>
                  {(Object.keys(flags) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                        language === lang ? 'bg-[#582ef5]/10 text-[#582ef5]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <span className="text-lg leading-none">{flags[lang]}</span>
                      <span className="uppercase">{lang}</span>
                      {language === lang && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#582ef5] shadow-[0_0_10px_rgba(88,46,245,1)]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={scrollToPlanos}
              className="px-6 py-2.5 rounded-xl bg-white text-black text-[13px] font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              {t.nav.start}
            </button>
          </div>

          {/* Botão de Estudar Mobile (Representado por ícone ou texto curto) */}
          <div className="lg:hidden">
            <button 
              onClick={scrollToPlanos}
              className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg shadow-white/5 active:scale-90 transition-transform"
            >
              <PlayCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
