import React, { useState, useEffect } from 'react';
import { CheckoutModal } from '../components/CheckoutModal';

/* ─── Brand ─────────────────────────────────────────── */
const B = '#4C35E8';          // Connect blue-purple
const B2 = '#2518B8';         // darker shade
const BL = '#EEF0FF';         // very light blue tint

/* ─── Plans ─────────────────────────────────────────── */
const PLANS = [
  {
    id: 'experience', label: 'Experience', emoji: '💙',
    period: '', periodLabel: '',
    priceOriginal: '', price: '', installment: '',
    cta: 'Criar conta grátis', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: false, free: true,
    desc: 'Uma forma simples de conhecer a estrutura por dentro e entender se faz sentido para você antes de seguir para a experiência completa.',
    included: [], excluded: [],
    prices: { BR: { annual: '0' } }, region: 'BR',
  },
  {
    id: 'starter', label: 'STARTER', emoji: '🌎',
    period: '3 MESES DE ACESSO', periodLabel: 'trimestre',
    priceOriginal: 'R$ 97,00', price: 'R$ 67,90', installment: 'ou 12x de R$ 5,66 sem juros',
    priceEU: '€ 16,00',
    cta: 'Comprar agora', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: false, free: false,
    desc: 'Acesso essencial para começar suas importações.',
    included: [
      'Acesso às fábricas diretas na China.',
      'Roupas, Tênis, Relógios, Bonés, Óculos, Meias, Bolsas, Perfumes, Ferramentas, Pesca, Eletrônicos, Periféricos, Acessórios para celular, Iluminação, Casa e Cozinha, Decoração, Brinquedos, Papelaria, Pet, Beleza, Maquiagem, Automotivo, Esporte, Ciclismo, Fitness, Sex Shop, Joias, Jardinagem, Festa e Brindes. (Não inclui produtos Apple e nem eletrônicos)',
      'Um painel com produtos atualizados',
      'O Minerador (Inteligência artificial de buscas e perguntas).',
      'Gerador de imagens 4K (3 créditos mensais).',
      'Rastreio em tempo real de até 5 envios.',
      'Módulos de aulas exclusivas.',
      'Acesso à comunidade.',
      'Sistema Indique e Ganhe.',
    ],
    excluded: [
      'Acesso à Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global',
      'Baixar imagens ilimitadas',
      'Acesso aos marketplaces locais na China',
      'Prioridade no suporte (Topo da lista)',
      'Medalha de destaque exclusiva na comunidade',
      'Alertas e oportunidades em primeira mão',
      'Sorteios mensais e premiações',
      'Grupo de Networking no WhatsApp',
    ],
    prices: { BR: { annual: '67.90' }, EU: { annual: '16.00' } }, region: 'BR',
  },
  {
    id: 'pro', label: 'PRO', emoji: '🌎',
    period: '1 ANO DE ACESSO', periodLabel: 'ano',
    priceOriginal: 'R$ 197,00', price: 'R$ 137,90', installment: 'ou 12x de R$ 11,49 sem juros',
    priceEU: '€ 32,00',
    cta: 'Comprar agora', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: true, free: false,
    desc: 'O plano intermediário para quem busca variedade e ferramentas de IA.',
    included: [
      'Acesso à fábricas exclusivas na China.',
      'Roupas, Tênis, Relógios, Bonés, Óculos, Meias, Bolsas, Perfumes, Ferramentas, Pesca, Eletrônicos, Periféricos, Acessórios para celular, Iluminação, Casa e Cozinha, Decoração, Brinquedos, Papelaria, Pet, Beleza, Maquiagem, Automotivo, Esporte, Ciclismo, Fitness, Sex Shop, Joias, Jardinagem, Festa e Brindes. (Não inclui produtos Apple)',
      'Gerador de imagens 4K (5 créditos mensais).',
      'Inteligência Artificial o Minerador de buscas e perguntas.',
      'Acesso aos marketplaces locais na China.',
      'Rastreio em tempo real de até 10 envios.',
      'Módulos de aulas exclusivas.',
      'Acesso à comunidade.',
      'Alertas e oportunidades em primeira mão.',
      'Sorteios mensais e premiações.',
      'Sistema Indique e Ganhe.',
    ],
    excluded: [
      'Acesso à Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global',
      'Baixar imagens ilimitadas',
      'Prioridade no suporte (Topo da lista)',
      'Medalha de destaque exclusiva na comunidade',
      'Grupo de Networking no WhatsApp',
    ],
    prices: { BR: { annual: '137.90' }, EU: { annual: '32.00' } }, region: 'BR',
  },
  {
    id: 'elite', label: 'ELITE', emoji: '🏆',
    period: 'ACESSO PARA SEMPRE', periodLabel: 'vitalício',
    priceOriginal: 'R$ 380,00', price: 'R$ 266,00', installment: 'ou 12x de R$ 22,17 sem juros',
    priceEU: '€ 64,00',
    cta: 'Comprar agora', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: false, free: false,
    desc: 'Acesso total e suporte prioritário para escala máxima.',
    included: [
      'Acesso à Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global',
      'Baixar imagens ilimitadas',
      'Painel de fábricas e produtos exclusivos não divulgados publicamente.',
      'Um painel com produtos atualizados',
      'Acesso à origem de Eletrônicos, Gamer, Periféricos, Acessórios para Celular, Automotivo, Roupas, Tênis, Relógios, Perfumes, Bolsas, Joias, Óculos, Beleza, Maquiagem, Sex Shop, Fitness, Esporte, Ciclismo, Pesca, Casa e Cozinha, Decoração, Iluminação, Jardinagem, Ferramentas, Brinquedos, Papelaria, Pet, Festa e Brindes.',
      'Gerador de imagens 4K (10 créditos mensais).',
      'Inteligência Artificial o Minerador de buscas e perguntas.',
      'Acesso aos marketplaces locais na China.',
      'Sem limites de rastreios de envios.',
      'Módulos de aulas exclusivas.',
      'Acesso à comunidade.',
      'Prioridade no suporte (Topo da lista).',
      'Medalha de destaque na comunidade.',
      'Alertas e oportunidades em primeira mão.',
      'Sorteios mensais e premiações.',
      'Sistema Indique e Ganhe.',
      'Grupo de Networking no WhatsApp',
    ],
    excluded: [],
    prices: { BR: { annual: '266.00' } }, region: 'BR',
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

/* ─── Countries / Languages ─────────────────────────── */
const LANGS = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Brasil',   region: 'BR', currency: 'BRL', shipping: '15 dias', isoCountry: 'BR' },
  { code: 'pt-PT', flag: '🇵🇹', label: 'Portugal', region: 'EU', currency: 'EUR', shipping: '6 dias',  isoCountry: 'PT' },
  { code: 'es',    flag: '🇪🇸', label: 'España',   region: 'EU', currency: 'EUR', shipping: '6 días',  isoCountry: 'ES' },
  { code: 'fr',    flag: '🇫🇷', label: 'France',   region: 'EU', currency: 'EUR', shipping: '6 jours', isoCountry: 'FR' },
  { code: 'nl',    flag: '🇳🇱', label: 'Nederland',region: 'EU', currency: 'EUR', shipping: '6 dagen', isoCountry: 'NL' },
];

/* ─── Translations ───────────────────────────────────── */
const TR: Record<string, Record<string, string>> = {
  'pt-BR': {
    hero_title: 'Aprenda importar da China sem burocracias alfandegárias.',
    hero_sub: 'Crie sua conta grátis e tenha acesso a +30 milhões de produtos de 1.500 fábricas, aulas exclusivas, rastreio em tempo real e ao Minerador: a IA desenvolvida pra te guiar em cada importação.',
    hero_cta: 'Começar agora',
    hero_cta2: 'Ver planos',
    hero_badge: 'Usado por +28.000 importadores',
    nav_cta: 'Teste grátis',
    shipping_badge: '🚀 Entrega em até 15 dias no Brasil',
    try_free: 'Criar conta grátis',
    buy_now: 'Comprar agora',
  },
  'pt-PT': {
    hero_title: 'Importe da China sem burocracias alfandegárias.',
    hero_sub: 'Crie a sua conta grátis e tenha acesso a +30 milhões de produtos de 1.500 fábricas, aulas exclusivas, rastreio em tempo real e ao Minerador: a IA desenvolvida para o guiar em cada importação.',
    hero_cta: 'Começar agora',
    hero_cta2: 'Ver planos',
    hero_badge: 'Usado por +28.000 importadores',
    nav_cta: 'Teste grátis',
    shipping_badge: '🚀 Entrega em até 6 dias na Europa',
    try_free: 'Criar conta grátis',
    buy_now: 'Comprar agora',
  },
  'es': {
    hero_title: 'Importa desde China sin burocracia aduanera.',
    hero_sub: 'Crea tu cuenta gratis y accede a +30 millones de productos de 1.500 fábricas, clases exclusivas, rastreo en tiempo real y al Minerador: la IA diseñada para guiarte en cada importación.',
    hero_cta: 'Empezar ahora',
    hero_cta2: 'Ver planes',
    hero_badge: 'Usado por +28.000 importadores',
    nav_cta: 'Prueba gratis',
    shipping_badge: '🚀 Entrega en hasta 6 días en Europa',
    try_free: 'Crear cuenta gratis',
    buy_now: 'Comprar ahora',
  },
  'fr': {
    hero_title: 'Importez de Chine sans bureaucratie douanière.',
    hero_sub: 'Cr\u00e9ez votre compte gratuit et acc\u00e9dez \u00e0 +30 millions de produits de 1 500 usines, des cours exclusifs, un suivi en temps r\u00e9el et au Minerador : l\u2019IA con\u00e7ue pour vous guider dans chaque importation.',
    hero_cta: 'Commencer maintenant',
    hero_cta2: 'Voir les plans',
    hero_badge: 'Utilisé par +28 000 importateurs',
    nav_cta: 'Essai gratuit',
    shipping_badge: '🚀 Livraison en 6 jours en Europe',
    try_free: 'Créer un compte gratuit',
    buy_now: 'Acheter maintenant',
  },
  'nl': {
    hero_title: 'Importeer uit China zonder douanebureaucratie.',
    hero_sub: 'Maak een gratis account aan en krijg toegang tot +30 miljoen producten van 1.500 fabrieken, exclusieve lessen, realtime tracking en de Minerador: de AI die u begeleidt bij elke import.',
    hero_cta: 'Nu beginnen',
    hero_cta2: 'Plannen bekijken',
    hero_badge: 'Gebruikt door +28.000 importeurs',
    nav_cta: 'Gratis proberen',
    shipping_badge: '🚀 Levering binnen 6 dagen in Europa',
    try_free: 'Gratis account aanmaken',
    buy_now: 'Nu kopen',
  },
};

/* ─── Main ───────────────────────────────────────────── */
export const NovaPage: React.FC = () => {
  const [checkout, setCheckout] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGS[0]);
  const t = TR[selectedLang.code] || TR['pt-BR'];
  const isEU = selectedLang.region === 'EU';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  // Auto-detect country via IP
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const iso = data.country_code;
        const match = LANGS.find(l => l.isoCountry === iso);
        if (match) setSelectedLang(match);
      })
      .catch(() => {/* keep default BR */});
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#0a0a0a', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        .nav-inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-lang-label { display: inline; }
        .nav-lang-chevron { display: inline-flex; }
        @media (max-width: 639px) {
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

            {/* Logo — esquerda */}
            <img
              src="/logo-blue.png"
              alt="Connect Academy"
              style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block', flexShrink: 0 }}
            />

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Ícone de usuário */}
            <a
              href="https://app.connectacademy.com.br"
              title="Entrar no app"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, borderRadius: 10,
                border: '1px solid #E5E7EB',
                background: '#fff',
                flexShrink: 0, textDecoration: 'none',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </a>

            {/* Teste grátis */}
            <a
              href="#precos"
              onClick={e => { e.preventDefault(); document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                display: 'inline-flex', alignItems: 'center',
                height: 34, padding: '0 14px', borderRadius: 10,
                background: `linear-gradient(135deg, ${B} 0%, ${B2} 100%)`,
                color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
                boxShadow: `0 3px 12px ${B}40`, transition: 'opacity 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {t.nav_cta}
            </a>

            {/* Language selector */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={e => { e.stopPropagation(); setLangOpen(v => !v); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 10px',
                  background: langOpen ? '#F9FAFB' : '#fff',
                  border: '1px solid #E5E7EB', borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, color: '#444',
                  transition: 'background 0.15s, border-color 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!langOpen) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#D1D5DB'; } }}
                onMouseLeave={e => { if (!langOpen) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB'; } }}
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
          <source src="https://res.cloudinary.com/ce70kcrk/video/upload/Portugiss.mp4" type="video/mp4" />
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
            <div style={{ display: 'flex', marginRight: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.5)',
                  marginLeft: i > 0 ? -10 : 0,
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  <img src="/avatars-users.png" alt="Importador" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                </div>
              ))}
            </div>

            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.1 }}>
              {t.hero_badge}
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
            {t.hero_title}
          </h1>

          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.72)', maxWidth: 560, lineHeight: 1.65, margin: '0 0 40px', fontWeight: 500 }}>
            {t.hero_sub}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                height: 56, padding: '0 40px', borderRadius: 14,
                background: `linear-gradient(135deg, ${B} 0%, ${B2} 100%)`,
                color: '#fff',
                fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
                boxShadow: `0 4px 24px ${B}50`, transition: 'transform 0.15s, box-shadow 0.15s',
                minWidth: 200,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${B}70`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 24px ${B}50`; }}
            >
              {t.hero_cta}
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
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
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
          <div className="b1 bcard-dark" style={{ background: '#0A0A1A', minHeight: 280, overflow: 'hidden' }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, display: 'block', pointerEvents: 'none' }}>
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
              onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 18px', borderRadius: 12, background: `linear-gradient(135deg, ${B} 0%, ${B2} 100%)`, color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', boxShadow: `0 4px 16px ${B}50`, marginTop: 24, width: 'fit-content' }}
            >
              Testar comunidade
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* 2 — +30M Produtos */}
          <div className="b2 bcard-dark" style={{ background: '#0a0a0a', minHeight: 280, justifyContent: 'space-between', overflow: 'hidden' }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, display: 'block', pointerEvents: 'none' }}>
              <source src="https://res.cloudinary.com/ce70kcrk/video/upload/hf_20260812_061148_8b410879-709f-462d-8c5e-7fb743bc9351.mp4" type="video/mp4" />
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
          <div className="b3 bcard-dark" style={{ background: '#0A0A1A', overflow: 'hidden' }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, display: 'block', pointerEvents: 'none' }}>
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
          <div className="b6 bcard-dark" style={{ background: '#0A0A1A' }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', pointerEvents: 'none' }}>
              <source src="https://res.cloudinary.com/ce70kcrk/video/upload/hf_20260812_105151_3105962d-701e-4c55-ab8f-a8c47fe3ddc0.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(5,5,20,0.70) 0%, rgba(10,10,30,0.55) 100%)', borderRadius: 'inherit' }} />
            <div style={{ position: 'relative', zIndex: 1, width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
            </div>
            <h3 style={{ position: 'relative', zIndex: 1, fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Rastreio Real-Time</h3>
            <p style={{ position: 'relative', zIndex: 1, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, margin: 0 }}>Brasil em 15 dias, Europa em 6. Acompanhe no app.</p>
          </div>

          {/* 7 — Aulas */}
          <div className="b7 bcard-dark" style={{ background: '#0A0A1A' }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', pointerEvents: 'none' }}>
              <source src="https://res.cloudinary.com/ce70kcrk/video/upload/aulas.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(5,5,20,0.72) 0%, rgba(10,10,30,0.60) 100%)', borderRadius: 'inherit' }} />
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: B, opacity: 0.15, filter: 'blur(50px)' }} />
            <div style={{ position: 'relative', zIndex: 1, width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h3 style={{ position: 'relative', zIndex: 1, fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Aulas Exclusivas</h3>
            <p style={{ position: 'relative', zIndex: 1, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, margin: 0 }}>Do zero ao avançado. Aprenda a importar e montar seu negócio.</p>
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

      {/* PRICING */}
      <section id="precos" style={{ background: '#fff', padding: '96px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: B, margin: '0 0 12px' }}>Planos</p>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Escolha seu plano</h2>
            <p style={{ fontSize: 15, color: '#888', margin: 0, fontWeight: 500 }}>Acesso completo. Sem surpresas.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'start' }}>
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
                {!plan.free && (
                  <div style={{
                    position: 'absolute', top: 20, right: 20,
                    background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800,
                    padding: '3px 9px', borderRadius: 999, letterSpacing: '0.05em',
                  }}>30% OFF</div>
                )}
                {plan.period && (
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: plan.highlight ? 'rgba(255,255,255,0.4)' : B, margin: '0 0 8px' }}>{plan.period}</p>
                )}
                <p style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 22, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: '0 0 6px' }}>
                  {plan.label} {plan.emoji}
                </p>
                <p style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#888', lineHeight: 1.55, margin: '0 0 20px' }}>{plan.desc}</p>
                {!plan.free ? (
                  <div style={{ marginBottom: 24 }}>
                    {isEU ? (
                      /* Europa: preco cheio em EUR, sem desconto, sem parcelamento */
                      <p style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 38, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: '0 0 4px', lineHeight: 1 }}>
                        {plan.priceEU}
                      </p>
                    ) : (
                      <>
                        <p style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.3)' : '#bbb', textDecoration: 'line-through', margin: '0 0 2px' }}>{plan.priceOriginal}</p>
                        <p style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 38, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: '0 0 4px', lineHeight: 1 }}>
                          <span style={{ fontSize: 16, fontWeight: 600, verticalAlign: 'super' }}>R$</span>
                          {plan.price.replace('R$ ', '')}
                          <span style={{ fontSize: 13, fontWeight: 500, color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#aaa' }}>/{plan.periodLabel}</span>
                        </p>
                        <p style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.35)' : '#aaa', margin: 0 }}>{plan.installment}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontFamily: "'Bricolage Grotesque', system-ui", fontSize: 32, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: 0 }}>Grátis</p>
                  </div>
                )}
                {plan.free ? (
                  <a
                    href={plan.ctaHref}
                    style={{
                      display: 'block', textAlign: 'center',
                      width: '100%', height: 52, lineHeight: '52px',
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${B}, ${B2})`,
                      color: '#fff',
                      fontWeight: 700, fontSize: 15,
                      textDecoration: 'none',
                      boxShadow: `0 8px 24px ${B}40`,
                      marginBottom: 10,
                      transition: 'opacity 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => setCheckout(plan)}
                    style={{
                      display: 'block', textAlign: 'center',
                      width: '100%', height: 52, lineHeight: '52px',
                      borderRadius: 16,
                      background: plan.highlight ? '#fff' : `linear-gradient(135deg, ${B}, ${B2})`,
                      color: plan.highlight ? '#0a0a0a' : '#fff',
                      fontWeight: 700, fontSize: 15,
                      border: 'none', cursor: 'pointer',
                      boxShadow: plan.highlight ? 'none' : `0 8px 24px ${B}40`,
                      marginBottom: 10,
                      transition: 'opacity 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                  >
                    {plan.cta}
                  </button>
                )}
                {!plan.free && (
                  <>
                    <p style={{ fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.3)' : '#bbb', textAlign: 'center', margin: '0 0 12px' }}>Pague uma única vez, sem recorrências mensais.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                      <img src="/logos-cartao.png" alt="Formas de pagamento" style={{ height: 28, objectFit: 'contain', opacity: plan.highlight ? 0.7 : 1 }} />
                    </div>
                  </>
                )}
                {(plan.included.length > 0 || plan.excluded.length > 0) && (
                  <div style={{ borderTop: `1px solid ${plan.highlight ? 'rgba(255,255,255,0.1)' : '#F0F0F4'}`, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    {plan.included.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: plan.highlight ? 'rgba(255,255,255,0.12)' : '#F0F0F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6l2.5 2.5 4.5-5" stroke={plan.highlight ? '#fff' : B} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.75)' : '#444', lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                    {plan.excluded.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 2l6 6M8 2L2 8" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.3)' : '#ccc', lineHeight: 1.5, textDecoration: 'line-through' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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
      <section style={{ padding: 0, margin: 0 }}>
        <a
          href="https://app.connectacademy.com.br/cadastro"
          style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none' }}
        >
          <img
            src="/comece-importar.jpg"
            alt="Comece a importar hoje"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </a>
      </section>






      {/* ═══════════════ FOOTER ══════════════════════ */}
      <footer style={{ background: '#FAFAFB', borderTop: '1px solid #F0F0F2', padding: '40px 20px 28px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>

          {/* Logo + links verticais à esquerda */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginBottom: 32 }}>
            <img src="/logo-blue.png" alt="Connect Academy" style={{ height: 26, width: 'auto', objectFit: 'contain', display: 'block' }} />

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                {
                  href: 'https://instagram.com/connnectacademy',
                  label: 'Instagram',
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
                },
                {
                  href: 'https://t.me/grupoconnect',
                  label: 'Telegram',
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 5L2 12.5l7 1M21 5l-2.5 15L9 13.5M21 5L9 13.5m0 0v5.5l3.5-3"/></svg>,
                },
                {
                  href: 'https://tiktok.com/@connnectacademy',
                  label: 'TikTok',
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
                },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '1px solid #D8D8DC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#999', textDecoration: 'none',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = B; (e.currentTarget as HTMLElement).style.borderColor = B; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#999'; (e.currentTarget as HTMLElement).style.borderColor = '#D8D8DC'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <p style={{ fontSize: 12, color: '#999', margin: 0, maxWidth: 220, lineHeight: 1.55 }}>
              A plataforma completa para importar da China.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {[
                { label: 'Suporte', href: 'mailto:suporte@connectacademy.com.br' },
                { label: 'Termos de Uso', href: 'https://connectacademy.com.br/termos-de-uso' },
                { label: 'Política de Privacidade', href: 'https://connectacademy.com.br/politica-de-privacidade' },
                { label: 'Teste grátis', href: 'https://app.connectacademy.com.br/cadastro' },
                { label: 'Aplicativo', href: 'https://app.connectacademy.com.br' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: 13, color: '#666', textDecoration: 'none', fontWeight: 500, width: 'fit-content' }}
                  onMouseEnter={e => (e.currentTarget.style.color = B)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                >{l.label}</a>
              ))}
            </div>
          </div>

          {/* Divider + copyright */}
          <div style={{ borderTop: '1px solid #EBEBED', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#aaa', margin: '0 0 2px', fontWeight: 600 }}>
              © 2026 Connect Academy Ltda.
            </p>
            <p style={{ fontSize: 11, color: '#bbb', margin: 0 }}>
              Todos os direitos reservados ·{' '}
              <a href="https://cnpj.biz/44292841000195" target="_blank" rel="noopener noreferrer"
                style={{ color: '#bbb', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.color = B)}
                onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
              >CNPJ: 44.292.841/0001-95</a>
            </p>
          </div>

        </div>
      </footer>


      {checkout && <CheckoutModal plan={checkout} onClose={() => { setCheckout(null); setTimeout(() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' }), 50); }} onSuccess={() => setCheckout(null)} />}

    </div>
  );
};
