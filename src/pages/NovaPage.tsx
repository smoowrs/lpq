import React, { useState } from 'react';
import { CheckoutModal } from '../components/CheckoutModal';

/* ── Brand ─────────────────────────────────────────────── */
const BLUE = '#582ef5';
const BLUE_DARK = '#3b1fd4';
const BLUE_LIGHT = '#ede9ff';
const BLUE_MID = '#7c5cf6';

/* ── Pricing data ───────────────────────────────────────── */
const PLANS = [
  {
    id: 'starter',
    label: '🪙 Starter',
    period: 'Trimestral',
    price: 'R$ 58,20',
    monthly: 'R$ 19,40/mês',
    cta: 'Começar agora',
    highlight: false,
    perks: [
      '3 meses de acesso completo',
      'Minerador IA ilimitado',
      '+30 M produtos da China',
      'Seguro de envio incluso',
      'Rastreio em tempo real',
      'Comunidade exclusiva',
    ],
    prices: { BR: { annual: '58.20' } },
    billingCycle: 'quarterly',
    region: 'BR',
  },
  {
    id: 'pro',
    label: '💙 Pro',
    period: 'Anual',
    price: 'R$ 118,20',
    monthly: 'R$ 9,85/mês',
    cta: 'Escolher Pro',
    highlight: true,
    perks: [
      '12 meses de acesso completo',
      'Minerador IA ilimitado',
      '+30 M produtos da China',
      'Seguro de envio incluso',
      'Rastreio em tempo real',
      'Comunidade exclusiva',
      'Gerador de imagens IA',
    ],
    prices: { BR: { annual: '118.20' } },
    billingCycle: 'annual',
    region: 'BR',
  },
  {
    id: 'elite',
    label: '🥇 Elite',
    period: 'Vitalício',
    price: 'R$ 233,40',
    monthly: 'Pague uma vez',
    cta: 'Acesso vitalício',
    highlight: false,
    perks: [
      'Acesso vitalício',
      'Minerador IA ilimitado',
      '+30 M produtos da China',
      'Seguro de envio incluso',
      'Rastreio em tempo real',
      'Comunidade exclusiva',
      'Gerador de imagens IA',
      'Suporte prioritário',
    ],
    prices: { BR: { annual: '233.40' } },
    billingCycle: 'lifetime',
    region: 'BR',
  },
];

/* ── FAQ data ───────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Preciso ter CNPJ para importar?',
    a: 'Não. Qualquer pessoa física pode importar pela Connect Academy. Trabalhamos com importação pessoa física (PF), sem burocracia alfandegária do lado do cliente.',
  },
  {
    q: 'Tem quantidade mínima para comprar?',
    a: 'Não. Você pode comprar a partir de 1 unidade diretamente das fábricas parceiras. Ideal para testar produtos antes de escalar.',
  },
  {
    q: 'O que é o Minerador?',
    a: 'O Minerador é nossa IA exclusiva que pesquisa produtos, calcula impostos reais, verifica reputação de fornecedores e te orienta em cada etapa da importação — eliminando burocracias alfandegárias.',
  },
  {
    q: 'E se meu produto se perder ou for roubado?',
    a: 'Todos os envios pela Connect Academy incluem seguro de envio. Em caso de extravio, roubo ou dano, o reembolso é processado em até 24h.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Brasil: até 15 dias úteis via Envio Aéreo Expresso com rastreio em tempo real. Europa: até 6 dias úteis.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Os planos Starter e Pro têm acesso pelo período contratado (3 meses ou 12 meses). O plano Elite é vitalício — você paga uma vez e tem acesso para sempre.',
  },
];

/* ── Check Icon ─────────────────────────────────────────── */
const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={BLUE_LIGHT} />
    <path d="M5 8l2 2 4-4" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Accordion FAQ item ─────────────────────────────────── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-gray-100 last:border-0 cursor-pointer"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between py-5 gap-4">
        <span className="text-[15px] font-semibold text-gray-900 leading-snug">{q}</span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: open ? BLUE : '#f3f4f6' }}
        >
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className="transition-transform duration-200"
            style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 2v8M2 6h8" stroke={open ? '#fff' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '200px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="text-[14px] text-gray-500 leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────── */
export const NovaPage: React.FC = () => {
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null);

  const openCheckout = (plan: any) => setCheckoutPlan(plan);
  const closeCheckout = () => setCheckoutPlan(null);
  const onSuccess = () => { closeCheckout(); };

  return (
    <div className="min-h-screen bg-white font-sans antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── NAV ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <img
            src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
            alt="Connect Academy"
            className="h-7 w-auto"
            style={{ filter: 'brightness(0)' }}
          />
          <div className="flex items-center gap-3">
            <a
              href="https://app.connectacademy.com.br"
              className="hidden sm:block text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Entrar
            </a>
            <button
              onClick={() => openCheckout(PLANS[1])}
              className="h-9 px-5 rounded-full text-[13px] font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: BLUE }}
            >
              Criar conta grátis
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 text-center">
        {/* Badge pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 mb-8 bg-white shadow-sm">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: BLUE }} />
          <span className="text-[12px] font-semibold text-gray-600 tracking-wide uppercase">
            +28.000 alunos importando da China
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[42px] sm:text-[56px] md:text-[68px] font-extrabold tracking-tight leading-[1.05] text-gray-950 mb-6 mx-auto max-w-4xl"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          Importe da China{' '}
          <span
            className="relative inline-block"
            style={{
              background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            sem burocracia,
          </span>
          {' '}com seguro incluso.
        </h1>

        <p className="text-[17px] text-gray-500 leading-relaxed max-w-xl mx-auto mb-10 font-medium">
          Acesse +30 milhões de produtos de 1.500 fábricas, use a IA que elimina taxas abusivas e receba em até 15 dias — sem quantidade mínima.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <button
            onClick={() => openCheckout(PLANS[1])}
            className="h-13 px-8 py-4 rounded-2xl text-[15px] font-bold text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`, boxShadow: `0 8px 32px ${BLUE}40` }}
          >
            Criar minha conta grátis
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <a
            href="https://connectacademy.com.br"
            className="h-13 px-8 py-4 rounded-2xl text-[15px] font-bold text-gray-700 border-2 border-gray-200 hover:border-gray-300 transition-all hover:-translate-y-0.5"
          >
            Ver plataforma completa
          </a>
        </div>

        {/* Video embed */}
        <div className="relative mx-auto max-w-3xl rounded-3xl overflow-hidden border border-gray-200 shadow-2xl" style={{ boxShadow: `0 30px 80px ${BLUE}18` }}>
          {/* Colored top bar like browser chrome */}
          <div className="flex items-center gap-1.5 px-4 h-9 bg-gray-50 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 mx-4 h-5 bg-gray-200 rounded-full" />
          </div>
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=0b95370e-45d5-40d2-9c30-5c152ac60f49"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: '+28K', label: 'alunos ativos' },
            { n: '+30M', label: 'produtos disponíveis' },
            { n: '1.500', label: 'fábricas parceiras' },
            { n: '100%', label: 'seguro de envio incluso' },
          ].map(s => (
            <div key={s.n} className="text-center">
              <p
                className="text-[32px] md:text-[38px] font-extrabold text-gray-950 leading-none mb-1"
                style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
              >
                {s.n}
              </p>
              <p className="text-[13px] text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENTO FEATURES ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <p className="text-[12px] font-bold uppercase tracking-widest mb-3" style={{ color: BLUE }}>Plataforma Completa</p>
          <h2
            className="text-[36px] md:text-[48px] font-extrabold text-gray-950 tracking-tight leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Tudo que você precisa para importar
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">

          {/* Card 1 — Minerador AI (large, spans 7 cols) */}
          <div
            className="md:col-span-7 rounded-3xl p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden group"
            style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)` }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)' }} />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5 backdrop-blur-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 className="text-[24px] font-extrabold text-white mb-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                Minerador IA
              </h3>
              <p className="text-white/70 text-[14px] leading-relaxed max-w-sm">
                Nossa IA exclusiva pesquisa produtos, calcula impostos reais, verifica fornecedores e elimina todas as burocracias alfandegárias — você recebe o produto, a IA cuida do resto.
              </p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-[12px] font-semibold">IA Ativa 24/7</span>
            </div>
          </div>

          {/* Card 2 — 30M Produtos (spans 5 cols) */}
          <div className="md:col-span-5 rounded-3xl p-8 border border-gray-200 flex flex-col justify-between min-h-[280px] group hover:border-gray-300 transition-all">
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: BLUE_LIGHT }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3
                className="text-[22px] font-extrabold text-gray-950 mb-2"
                style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
              >
                +30 Milhões de Produtos
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Acesso direto a 1.500 fábricas parceiras. Eletrônicos, moda, casa, beleza — qualquer nicho, qualquer produto, sem intermediários.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Eletrônicos', 'Moda', 'Casa', 'Beleza', '+muito mais'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">{tag}</span>
              ))}
            </div>
          </div>

          {/* Card 3 — Sem mínimo (spans 4 cols) */}
          <div className="md:col-span-4 rounded-3xl p-8 border border-gray-200 flex flex-col group hover:border-gray-300 transition-all">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: BLUE_LIGHT }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="M9 9h.01M15 15h.01"/>
              </svg>
            </div>
            <h3
              className="text-[20px] font-extrabold text-gray-950 mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              Sem Quantidade Mínima
            </h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Compre 1 unidade para testar ou 1.000 para escalar. Você decide o ritmo do seu negócio.
            </p>
          </div>

          {/* Card 4 — Seguro envio (spans 4 cols) */}
          <div
            className="md:col-span-4 rounded-3xl p-8 flex flex-col border-2 group transition-all"
            style={{ borderColor: `${BLUE}30`, background: BLUE_LIGHT }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: '#fff' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3
              className="text-[20px] font-extrabold mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: BLUE_DARK }}
            >
              Seguro de Envio Incluso
            </h3>
            <p className="text-[14px] leading-relaxed" style={{ color: `${BLUE_DARK}99` }}>
              Extravio, roubo ou dano? Reembolso em até 24h, sem burocracia, incluso em todos os planos.
            </p>
          </div>

          {/* Card 5 — Rastreio (spans 4 cols) */}
          <div className="md:col-span-4 rounded-3xl p-8 border border-gray-200 flex flex-col group hover:border-gray-300 transition-all">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: BLUE_LIGHT }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            </div>
            <h3
              className="text-[20px] font-extrabold text-gray-950 mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              Rastreio em Tempo Real
            </h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Acompanhe cada etapa do envio direto no app. Entrega aérea expressa: Brasil em 15 dias, Europa em 6 dias.
            </p>
          </div>

          {/* Card 6 — Comunidade (spans 8 cols, wide) */}
          <div className="md:col-span-8 rounded-3xl p-8 bg-gray-950 flex flex-col md:flex-row items-center gap-8 group overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 20% 50%, ${BLUE} 0%, transparent 60%)` }} />
            <div className="relative z-10 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3
                className="text-[24px] font-extrabold text-white mb-2"
                style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
              >
                Comunidade Exclusiva de Importadores
              </h3>
              <p className="text-white/60 text-[14px] leading-relaxed max-w-md">
                A maior rede social de importadores do Brasil. Tire dúvidas, compartilhe fornecedores e encontre parceiros de negócio — tudo dentro da plataforma.
              </p>
            </div>
            {/* Avatars */}
            <div className="relative z-10 flex flex-col items-center gap-3 shrink-0">
              <div className="flex -space-x-3">
                {['A','B','C','D','E'].map((l, i) => (
                  <div
                    key={l}
                    className="w-10 h-10 rounded-full border-2 border-gray-950 flex items-center justify-center text-[12px] font-black text-white"
                    style={{ background: `hsl(${240 + i * 20}, 70%, 55%)`, zIndex: 5 - i }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-[12px] font-semibold text-center">+28.000 membros</p>
            </div>
          </div>

          {/* Card 7 — Aulas (spans 4 cols) */}
          <div className="md:col-span-4 rounded-3xl p-8 border border-gray-200 flex flex-col group hover:border-gray-300 transition-all">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: BLUE_LIGHT }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h3
              className="text-[20px] font-extrabold text-gray-950 mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              Aulas Exclusivas
            </h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Do zero ao avançado: aprenda a escolher fornecedores, negociar preços, calcular impostos e montar seu negócio de importação.
            </p>
          </div>

        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[12px] font-bold uppercase tracking-widest mb-3" style={{ color: BLUE }}>Simples assim</p>
            <h2
              className="text-[36px] md:text-[48px] font-extrabold text-gray-950 tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              3 passos para importar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                title: 'Crie sua conta',
                desc: 'Cadastro gratuito em menos de 2 minutos. Acesse imediatamente as aulas e a plataforma completa.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                ),
              },
              {
                n: '02',
                title: 'Use o Minerador',
                desc: 'Descreva o produto que quer importar. A IA encontra fornecedores, calcula custos reais e evita taxas abusivas.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ),
              },
              {
                n: '03',
                title: 'Receba em casa',
                desc: 'Envio aéreo expresso com rastreio em tempo real e seguro incluso. Seu produto chega em até 15 dias.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div key={step.n} className="relative bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                {/* Step number */}
                <span
                  className="absolute top-6 right-6 text-[48px] font-black leading-none"
                  style={{ color: `${BLUE}10`, fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
                >
                  {step.n}
                </span>
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)` }}
                >
                  {step.icon}
                </div>
                <h3
                  className="text-[20px] font-extrabold text-gray-950 mb-2"
                  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{step.desc}</p>
                {/* Connector arrow */}
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section id="precos" className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <p className="text-[12px] font-bold uppercase tracking-widest mb-3" style={{ color: BLUE }}>Planos</p>
          <h2
            className="text-[36px] md:text-[48px] font-extrabold text-gray-950 tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Escolha seu plano
          </h2>
          <p className="text-[15px] text-gray-500 mt-3">Acesso completo. Sem surpresas. Cancele quando quiser.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className="relative rounded-3xl p-8 flex flex-col transition-all hover:-translate-y-1"
              style={
                plan.highlight
                  ? {
                      background: `linear-gradient(160deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`,
                      boxShadow: `0 20px 60px ${BLUE}40`,
                    }
                  : { background: '#fff', border: '2px solid #e5e7eb' }
              }
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-[11px] font-black text-amber-950 uppercase tracking-wide shadow-lg whitespace-nowrap">
                  ⭐ Mais Popular
                </div>
              )}

              {/* Plan name + period */}
              <div className="mb-6">
                <p
                  className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}
                >
                  {plan.period}
                </p>
                <p
                  className={`text-[22px] font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-950'}`}
                  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
                >
                  {plan.label}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <p
                  className={`text-[36px] font-extrabold leading-none ${plan.highlight ? 'text-white' : 'text-gray-950'}`}
                  style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
                >
                  {plan.price}
                </p>
                <p className={`text-[13px] mt-1 font-medium ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>
                  {plan.monthly}
                </p>
              </div>

              {/* Perks */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.perks.map(p => (
                  <li key={p} className="flex items-center gap-2.5">
                    {plan.highlight ? (
                      <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,0.2)" />
                        <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <Check />
                    )}
                    <span
                      className={`text-[13px] font-medium ${plan.highlight ? 'text-white/90' : 'text-gray-700'}`}
                    >
                      {p}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => openCheckout(plan)}
                className="w-full h-12 rounded-2xl text-[14px] font-bold transition-all hover:opacity-90 active:scale-95"
                style={
                  plan.highlight
                    ? { background: '#fff', color: BLUE }
                    : { background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`, color: '#fff' }
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-2xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[12px] font-bold uppercase tracking-widest mb-3" style={{ color: BLUE }}>Dúvidas Frequentes</p>
            <h2
              className="text-[36px] font-extrabold text-gray-950 tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              Perguntas frequentes
            </h2>
          </div>
          <div className="bg-white rounded-3xl border border-gray-200 px-8 py-2 shadow-sm">
            {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-14 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)` }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3" style={{ background: '#fff' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 translate-y-1/2 -translate-x-1/3" style={{ background: '#fff' }} />

          <div className="relative z-10">
            <h2
              className="text-[36px] md:text-[52px] font-extrabold text-white tracking-tight leading-tight mb-4"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              Comece a importar hoje.
            </h2>
            <p className="text-white/70 text-[16px] max-w-lg mx-auto mb-10 leading-relaxed">
              Mais de 28.000 alunos já descobriram que importar da China é mais simples do que parece. Agora é a sua vez.
            </p>
            <button
              onClick={() => openCheckout(PLANS[1])}
              className="inline-flex items-center gap-2 h-14 px-10 rounded-2xl text-[15px] font-bold bg-white text-gray-950 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 active:scale-95"
            >
              Criar conta grátis
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
            alt="Connect Academy"
            className="h-6 w-auto"
            style={{ filter: 'brightness(0)' }}
          />
          <p className="text-[13px] text-gray-400">© 2025 Connect Academy. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="https://connectacademy.com.br" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              Site Principal
            </a>
            <a href="mailto:suporte@connectacademy.com.br" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              Suporte
            </a>
          </div>
        </div>
      </footer>

      {/* ── CHECKOUT MODAL ───────────────────────────────── */}
      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          onClose={closeCheckout}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};
