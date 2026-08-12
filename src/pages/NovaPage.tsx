import React, { useState, useEffect } from 'react';
import { CheckoutModal } from '../components/CheckoutModal';

/* ─── Brand ─────────────────────────────────────────── */
const B = '#4C35E8';          // Connect blue-purple
const B2 = '#2518B8';         // darker shade
const BL = '#EEF0FF';         // very light blue tint

/* ─── Plans ─────────────────────────────────────────── */
const PLANS = [
  {
    id: 'starter', label: 'Starter', emoji: '🪙',
    period: 'Trimestral', price: 'R$ 58,20', sub: '≈ R$ 19/mês',
    cta: 'Começar',  highlight: false,
    perks: ['3 meses de acesso', 'Minerador IA', '+30M produtos', 'Seguro de envio', 'Rastreio real-time', 'Comunidade'],
    prices: { BR: { annual: '58.20' } }, region: 'BR',
  },
  {
    id: 'pro', label: 'Pro', emoji: '💙',
    period: 'Anual', price: 'R$ 118,20', sub: '≈ R$ 9,85/mês',
    cta: 'Começar',  highlight: true,
    perks: ['12 meses de acesso', 'Minerador IA', '+30M produtos', 'Seguro de envio', 'Rastreio real-time', 'Comunidade', 'Gerador de imagens IA'],
    prices: { BR: { annual: '118.20' } }, region: 'BR',
  },
  {
    id: 'elite', label: 'Elite', emoji: '🥇',
    period: 'Vitalício', price: 'R$ 233,40', sub: 'Pague uma vez',
    cta: 'Começar',  highlight: false,
    perks: ['Acesso vitalício', 'Minerador IA', '+30M produtos', 'Seguro de envio', 'Rastreio real-time', 'Comunidade', 'Gerador de imagens IA', 'Suporte prioritário'],
    prices: { BR: { annual: '233.40' } }, region: 'BR',
  },
];

const FAQS = [
  { q: 'Preciso ter CNPJ para importar?', a: 'Não. Qualquer pessoa física pode importar pela Connect Academy. Sem burocracia alfandegária do lado do cliente.' },
  { q: 'Tem quantidade mínima para comprar?', a: 'Não. Você pode comprar a partir de 1 unidade diretamente das fábricas parceiras.' },
  { q: 'O que é o Minerador?', a: 'Nossa IA exclusiva que pesquisa produtos, calcula impostos reais, verifica fornecedores e elimina burocracias alfandegárias.' },
  { q: 'E se meu produto se perder ou for roubado?', a: 'Todos os envios incluem seguro de envio. Em caso de extravio, roubo ou dano, reembolso em até 24h.' },
  { q: 'Qual o prazo de entrega?', a: 'Brasil: até 15 dias via Envio Aéreo Expresso. Europa: até 6 dias úteis. Rastreio em tempo real incluído.' },
  { q: 'Posso cancelar quando quiser?', a: 'Starter e Pro têm acesso pelo período contratado. O Elite é vitalício — pague uma vez e tenha acesso para sempre.' },
];

/* ─── FAQ Card ───────────────────────────────────────── */
function FaqCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(v => !v)}
      style={{
        background: open ? '#fff' : '#F7F7F8',
        border: open ? `1.5px solid ${B}40` : '1.5px solid #F0F0F2',
        borderRadius: 20,
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#0a0a0a', lineHeight: 1.4, margin: 0, flex: 1 }}>{q}</p>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: open ? B : '#EEEEF2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'all 0.2s',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M7 2v10M2 7h10" stroke={open ? '#fff' : '#555'} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {open && (
        <p style={{ marginTop: 12, marginBottom: 0, fontSize: 14, color: '#555', lineHeight: 1.65 }}>{a}</p>
      )}
    </div>
  );
}

/* ─── Languages ──────────────────────────────────────── */
const LANGS = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Brasil' },
  { code: 'pt-PT', flag: '🇵🇹', label: 'Portugal' },
  { code: 'en-US', flag: '🇺🇸', label: 'Estados Unidos' },
  { code: 'es',    flag: '🇪🇸', label: 'Espanha' },
  { code: 'de-CH', flag: '🇨🇭', label: 'Suíça' },
  { code: 'en-CA', flag: '🇨🇦', label: 'Canadá' },
];

/* ─── Main ───────────────────────────────────────────── */
export const NovaPage: React.FC = () => {
  const [checkout, setCheckout] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGS[0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#0a0a0a', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        .nav-inner {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-entrar { display: inline; }
        .nav-lang-label { display: inline; }
        .nav-lang-chevron { display: inline-flex; }
        @media (max-width: 639px) {
          .nav-entrar { display: none; }
          .nav-lang-label { display: none; }
          .nav-lang-chevron { display: none; }
        }
      `}</style>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 16px' }}>
        <nav style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
          maxWidth: 1080,
          margin: '0 auto',
          padding: '10px 20px',
          transition: 'box-shadow 0.3s',
        }}>
          <div className="nav-inner">

            {/* Logo azul — canto esquerdo */}
            <img
              src="/logo-blue.png"
              alt="Connect Academy"
              style={{ height: 24, display: 'block', flexShrink: 0 }}
            />

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Entrar */}
            <a
              href="https://app.connectacademy.com.br"
              className="nav-entrar"
              style={{ fontSize: 12, fontWeight: 600, color: '#555', textDecoration: 'none', whiteSpace: 'nowrap', padding: '0 4px' }}
            >
              Entrar
            </a>

            {/* Criar conta */}
            <button
              onClick={() => setCheckout(PLANS[1])}
              style={{
                height: 34, padding: '0 14px', borderRadius: 10,
                background: `linear-gradient(135deg, ${B} 0%, ${B2} 100%)`,
                color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
                boxShadow: `0 3px 12px ${B}40`, transition: 'opacity 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Teste grátis
            </button>

            {/* Language selector */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={e => { e.stopPropagation(); setLangOpen(v => !v); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: langOpen ? '#F3F4F6' : 'transparent',
                  border: '1px solid #E5E7EB', borderRadius: 10,
                  padding: '6px 10px', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, color: '#444',
                  transition: 'background 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!langOpen) e.currentTarget.style.background = '#F9FAFB'; }}
                onMouseLeave={e => { if (!langOpen) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{selectedLang.flag}</span>
                <span className="nav-lang-label">{selectedLang.label}</span>
                <svg className="nav-lang-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M2 4l4 4 4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown */}
              {langOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#fff', border: '1px solid #E5E7EB',
                    borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    padding: '6px', minWidth: 180, zIndex: 200,
                  }}
                >
                  {LANGS.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '8px 12px', borderRadius: 9,
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: selectedLang.code === lang.code ? '#F0EEFF' : 'transparent',
                        color: selectedLang.code === lang.code ? B : '#333',
                        fontWeight: selectedLang.code === lang.code ? 700 : 500,
                        fontSize: 13, transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => { if (selectedLang.code !== lang.code) e.currentTarget.style.background = '#F9FAFB'; }}
                      onMouseLeave={e => { if (selectedLang.code !== lang.code) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: 20 }}>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {selectedLang.code === lang.code && (
                        <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7l3.5 3.5L12 3" stroke={B} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </nav>
      </div>

      {/* ═══════════════ HERO ════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>
        {/* Video background — loop silencioso */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        >
          <source src="https://res.cloudinary.com/ce70kcrk/video/upload/v1786392349/magnific_preciso-que-anime-essa-im_ovm6Fx3829.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — dark at top, heavy at bottom for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,30,0.55) 0%, rgba(10,10,30,0.35) 40%, rgba(5,5,20,0.85) 75%, rgba(5,5,20,0.98) 100%)',
        }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1080, margin: '0 auto', padding: '0 20px 72px', width: '100%' }}>
          {/* Social proof pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12,
            padding: '8px 16px', marginBottom: 28,
          }}>
            <div style={{ display: 'flex', marginRight: 2 }}>
              {['#4C35E8','#7C5CF6','#A88BF5'].map((c, i) => (
                <div key={c} style={{
                  width: 24, height: 24, borderRadius: '50%', background: c,
                  border: '2px solid rgba(255,255,255,0.3)', marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#fff',
                }}>{['A','B','C'][i]}</div>
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.1 }}>
              Usado por +28.000 importadores
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            fontSize: 'clamp(36px, 7vw, 76px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            maxWidth: 860,
          }}>
            Aprenda importar da China sem burocracias alfandegárias.
          </h1>

          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.72)', maxWidth: 560, lineHeight: 1.65, margin: '0 0 40px', fontWeight: 500 }}>
            Crie sua conta grátis e tenha acesso a +30 milhões de produtos de 1.500 fábricas, aulas exclusivas, rastreio em tempo real e ao Minerador: a IA desenvolvida pra te guiar em cada importação.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              onClick={() => setCheckout(PLANS[1])}
              style={{
                height: 56, padding: '0 40px', borderRadius: 14,
                background: '#fff', color: '#0a0a0a',
                fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)', transition: 'transform 0.15s, box-shadow 0.15s',
                minWidth: 200,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)'; }}
            >
              Começar agora
            </button>
            <button
              onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                height: 56, padding: '0 32px', borderRadius: 14,
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
                color: '#fff', fontWeight: 600, fontSize: 16,
                border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                transition: 'background 0.15s',
                minWidth: 160,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              Ver planos
            </button>
          </div>
        </div>
      </section>


      {/* ═══════════════ VSL ═════════════════════════ */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '72px 20px 0' }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: B, margin: '0 0 12px' }}>Assista esse vídeo</p>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', system-ui",
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800, color: '#0a0a0a',
            margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Conheça o App
          </h2>
        </div>
        <div style={{
          borderRadius: 24, overflow: 'hidden',
          border: '1.5px solid #E5E7EB',
          boxShadow: '0 32px 80px rgba(76,53,232,0.12), 0 8px 24px rgba(0,0,0,0.08)',
        }}>
          {/* Browser top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 16px', height: 40,
            background: '#F5F5F7', borderBottom: '1px solid #E5E7EB',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', flexShrink: 0 }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E', flexShrink: 0 }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840', flexShrink: 0 }} />
            <div style={{
              flex: 1, margin: '0 12px', height: 24, borderRadius: 6,
              background: '#fff', border: '1px solid #E0E0E5',
              display: 'flex', alignItems: 'center', paddingLeft: 10, gap: 6,
            }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1zM1 6h10M6 1c-1.5 2-2 3.5-2 5s.5 3 2 5M6 1c1.5 2 2 3.5 2 5s-.5 3-2 5" stroke="#aaa" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>connectacademy.com.br</span>
            </div>
          </div>
          {/* Video */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
            <iframe
              src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=0b95370e-45d5-40d2-9c30-5c152ac60f49"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════════════ */}
      <section style={{ borderBottom: '1px solid #F0F0F2', background: '#FAFAFB', marginTop: 72 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px 16px' }}>
          {[
            { n: '+28K', l: 'alunos importando' },
            { n: '+30M', l: 'produtos disponíveis' },
            { n: '1.500', l: 'fábricas parceiras' },
            { n: '15 dias', l: 'entrega no Brasil' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 36, fontWeight: 800, color: '#0a0a0a', margin: '0 0 4px', lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontSize: 13, color: '#888', fontWeight: 500, margin: 0 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES BENTO ═════════════ */}
      <style>{`
        .bento { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
        .b1  { grid-column: span 7; }
        .b2  { grid-column: span 5; }
        .b3  { grid-column: span 12; }
        .b4  { grid-column: span 4; }
        .b5  { grid-column: span 4; }
        .b6  { grid-column: span 4; }
        .b7  { grid-column: span 12; }
        .bcard { border-radius: 28px; padding: 36px; display: flex; flex-direction: column; }
        .bcard-dark { border-radius: 28px; padding: 40px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
        @media (max-width: 767px) {
          .bento { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .b1  { grid-column: span 2; }
          .b2  { grid-column: span 2; }
          .b3  { grid-column: span 2; }
          .b4  { grid-column: span 1; }
          .b5  { grid-column: span 1; }
          .b6  { grid-column: span 2; }
          .b7  { grid-column: span 2; }
          .bcard { padding: 24px; border-radius: 22px; }
          .bcard-dark { padding: 28px; border-radius: 22px; }
          .bcard h3, .bcard-dark h3 { font-size: 18px !important; }
          .bcard p, .bcard-dark p { font-size: 13px !important; }
        }
      `}</style>
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: B, margin: '0 0 12px' }}>Plataforma completa</p>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#0a0a0a', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Tudo num só lugar
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="bento">

          {/* 1 — Rede Social */}
          <div className="b1 bcard-dark" style={{ background: '#0A0A1A', minHeight: 280 }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
              <source src="https://res.cloudinary.com/ce70kcrk/video/upload/app.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(160deg, rgba(10,10,26,0.78) 0%, rgba(10,10,26,0.55) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.2 }}>A 1ª Rede Social do Importador 💙</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: 0 }}>
                Feed exclusivo, grupos por nicho, fornecedores compartilhados e +28.000 membros ativos.
              </p>
            </div>
            <button
              onClick={() => setCheckout(PLANS[1])}
              style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 18px', borderRadius: 12, background: `linear-gradient(135deg, ${B} 0%, ${B2} 100%)`, color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', boxShadow: `0 4px 16px ${B}50`, marginTop: 24, width: 'fit-content' }}
            >
              Testar comunidade
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* 2 — +30M Produtos */}
          <div className="b2 bcard-dark" style={{ background: '#0a0a0a', minHeight: 280, justifyContent: 'space-between' }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
              <source src="https://res.cloudinary.com/ce70kcrk/video/upload/vaievolta.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(160deg, rgba(5,5,15,0.70) 0%, rgba(5,5,15,0.55) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>+30M de Produtos</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>1.500 fábricas parceiras. Qualquer nicho, direto da fonte.</p>
            </div>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
              {['Eletrônicos', 'Moda', 'Casa', 'Beleza', '+mais'].map(t => (
                <span key={t} style={{ padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* 3 — Minerador IA */}
          <div className="b3 bcard-dark" style={{ background: '#0A0A1A' }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
              <source src="https://res.cloudinary.com/ce70kcrk/video/upload/completo.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(145deg, rgba(10,10,26,0.72) 0%, rgba(18,16,58,0.65) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${B}30`, border: `1px solid ${B}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>Minerador IA</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>Nossa IA pesquisa produtos, verifica fornecedores e calcula impostos reais.</p>
            </div>
            <div style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '6px 14px', width: 'fit-content', marginTop: 20 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>IA ativa 24/7</span>
            </div>
          </div>

          {/* 4 — Sem Mínimo */}
          <div className="b4 bcard" style={{ background: BL, border: `1.5px solid ${B}20` }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="M9 9h.01M15 15h.01"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 18, fontWeight: 800, color: B2, margin: '0 0 8px' }}>Sem Qtd. Mínima</h3>
            <p style={{ fontSize: 13, color: `${B2}90`, lineHeight: 1.55, margin: 0 }}>1 unidade para testar ou 1.000 para escalar.</p>
          </div>

          {/* 5 — Seguro */}
          <div className="b5 bcard" style={{ border: '1.5px solid #EEEEF2', background: '#fff' }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: BL, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 18, fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px' }}>Seguro Incluso</h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.55, margin: 0 }}>Reembolso em até 24h em caso de extravio ou dano.</p>
          </div>

          {/* 6 — Rastreio */}
          <div className="b6 bcard" style={{ border: '1.5px solid #EEEEF2', background: '#fff' }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: BL, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 18, fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px' }}>Rastreio Real-Time</h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.55, margin: 0 }}>Brasil em 15 dias, Europa em 6. Acompanhe no app.</p>
          </div>

          {/* 7 — Aulas */}
          <div className="b7 bcard-dark" style={{ background: '#0A0A1A' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: B, opacity: 0.15, filter: 'blur(50px)' }} />
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Aulas Exclusivas</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, margin: 0 }}>Do zero ao avançado. Aprenda a importar e montar seu negócio.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ COMO FUNCIONA ═══════════════ */}
      <section style={{ background: '#FAFAFB', borderTop: '1px solid #F0F0F2', borderBottom: '1px solid #F0F0F2', padding: '96px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: B, margin: '0 0 12px' }}>Simples assim</p>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
              3 passos para importar
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { n: '01', title: 'Crie sua conta', desc: 'Cadastro grátis em menos de 2 minutos. Acesse imediatamente aulas e plataforma completa.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
              { n: '02', title: 'Use o Minerador', desc: 'Descreva o produto. A IA encontra fornecedores, calcula custos reais e evita taxas abusivas.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
              { n: '03', title: 'Receba em casa', desc: 'Envio aéreo expresso com rastreio em tempo real e seguro incluso. Entrega em até 15 dias.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> },
            ].map((s, i) => (
              <div key={s.n} style={{ background: '#fff', borderRadius: 24, padding: '36px 32px', border: '1.5px solid #EEEEF2', position: 'relative' }}>
                <span style={{ position: 'absolute', top: 20, right: 24, fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 64, fontWeight: 800, color: '#F0F0F4', lineHeight: 1 }}>{s.n}</span>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${B}, ${B2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: `0 8px 24px ${B}40` }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 20, fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═════════════════════ */}
      <section id="precos" style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: B, margin: '0 0 12px' }}>Planos</p>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Escolha seu plano</h2>
          <p style={{ fontSize: 15, color: '#888', margin: 0, fontWeight: 500 }}>Acesso completo. Sem surpresas.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, alignItems: 'stretch' }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              borderRadius: 28,
              background: plan.highlight ? '#0D0D14' : '#fff',
              border: plan.highlight ? `1.5px solid rgba(76,53,232,0.3)` : '1.5px solid #EEEEF2',
              padding: '36px 32px',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.highlight ? `0 24px 60px rgba(76,53,232,0.25)` : 'none',
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: '#F59E0B', color: '#78350F', fontSize: 11, fontWeight: 800,
                  padding: '5px 16px', borderRadius: 999, whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>⭐ Mais Popular</div>
              )}

              {/* Period tag */}
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#aaa', margin: '0 0 6px' }}>{plan.period}</p>

              {/* Name */}
              <p style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 22, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: '0 0 24px' }}>{plan.emoji} {plan.label}</p>

              {/* Price */}
              <p style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 42, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: '0 0 4px', lineHeight: 1 }}>{plan.price}</p>
              <p style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#aaa', margin: '0 0 32px', fontWeight: 500 }}>{plan.sub}</p>

              {/* Perks */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                {plan.perks.map(p => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: plan.highlight ? 'rgba(255,255,255,0.12)' : '#F0F0F4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6l2.5 2.5 4.5-5" stroke={plan.highlight ? '#fff' : B} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.8)' : '#444', fontWeight: 500 }}>{p}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => setCheckout(plan)}
                style={{
                  width: '100%', height: 52, borderRadius: 16,
                  background: plan.highlight ? '#fff' : `linear-gradient(135deg, ${B}, ${B2})`,
                  color: plan.highlight ? '#0a0a0a' : '#fff',
                  fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                  boxShadow: plan.highlight ? 'none' : `0 8px 24px ${B}40`,
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FAQ ═════════════════════════ */}
      <section style={{ background: '#FAFAFB', borderTop: '1px solid #F0F0F2', padding: '96px 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: B, margin: '0 0 12px' }}>Dúvidas</p>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
              Perguntas frequentes
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map(f => <FaqCard key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════════ */}
      <section style={{ padding: '96px 20px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: `linear-gradient(145deg, #0A0A1A 0%, #12103A 100%)`,
          borderRadius: 36, padding: 'clamp(48px, 8vw, 80px) clamp(32px, 6vw, 80px)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -60, width: 280, height: 280, borderRadius: '50%', background: B, opacity: 0.18, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -60, width: 240, height: 240, borderRadius: '50%', background: '#7C5CF6', opacity: 0.15, filter: 'blur(70px)' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              Comece a importar hoje.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.6 }}>
              +28.000 alunos já provaram. Importar da China pode ser simples, seguro e lucrativo.
            </p>
            <button
              onClick={() => setCheckout(PLANS[1])}
              style={{
                height: 56, padding: '0 40px', borderRadius: 999,
                background: '#fff', color: '#0a0a0a',
                fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)', transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 50px rgba(0,0,0,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3)'; }}
            >
              Criar conta grátis
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ══════════════════════ */}
      <footer style={{ background: '#FAFAFB', borderTop: '1px solid #F0F0F2', padding: '48px 20px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>

          {/* Top row — logo + nav links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px 48px', justifyContent: 'space-between', marginBottom: 40 }}>

            {/* Logo + tagline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <img src="/logo-blue.png" alt="Connect Academy" style={{ height: 28, display: 'block' }} />
              <p style={{ fontSize: 13, color: '#888', margin: 0, maxWidth: 240, lineHeight: 1.6 }}>
                A plataforma completa para importar da China com segurança e sem burocracia.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Plataforma</p>
                {[
                  { label: 'Rede Social', href: 'https://app.connectacademy.com.br' },
                  { label: 'Minerador IA', href: 'https://app.connectacademy.com.br' },
                  { label: 'Aulas', href: 'https://app.connectacademy.com.br' },
                  { label: 'Rastreio', href: 'https://app.connectacademy.com.br' },
                ].map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: 13, color: '#555', textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.color = B)}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                  >{l.label}</a>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Empresa</p>
                {[
                  { label: 'Site principal', href: 'https://connectacademy.com.br' },
                  { label: 'Suporte', href: 'mailto:suporte@connectacademy.com.br' },
                  { label: 'Termos de Uso', href: 'https://connectacademy.com.br/termos-de-uso' },
                  { label: 'Política de Privacidade', href: 'https://connectacademy.com.br/politica-de-privacidade' },
                ].map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: 13, color: '#555', textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.color = B)}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                  >{l.label}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #EBEBED', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>
              © 2026 Connect Academy Ltda. Todos os direitos reservados. · CNPJ: 44.292.841/0001-95
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="https://connectacademy.com.br/termos-de-uso" style={{ fontSize: 12, color: '#bbb', textDecoration: 'none' }}>Termos</a>
              <a href="https://connectacademy.com.br/politica-de-privacidade" style={{ fontSize: 12, color: '#bbb', textDecoration: 'none' }}>Privacidade</a>
            </div>
          </div>

        </div>
      </footer>

      {checkout && <CheckoutModal plan={checkout} onClose={() => setCheckout(null)} onSuccess={() => setCheckout(null)} />}
    </div>
  );
};
