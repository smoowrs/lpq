import { useState, useEffect, useRef } from "react";
import {
  Zap, Play, TrendingUp, BadgeCheck, Sparkles, ArrowRight, Check, ChevronDown,
  ShieldCheck, Bot, Image, Radar, GraduationCap, Users, Gift, Plane, Factory,
  PackageCheck, Ban, AlertTriangle, HelpCircle, Search, ShoppingCart, Truck,
  Apple, Globe2, BadgePercent, MessagesSquare,
} from "lucide-react";

// ════════════════════════════════════════════════════
//  CONNECT ACADEMY — Landing Page
//  Paleta: Navy #061021 · Azul #2563EB · Céu #60A5FA
// ════════════════════════════════════════════════════

// ─── Reveal ao rolar ───
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), obs.disconnect()),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Dados ───
const PRODUCTS = [
  { emoji: "👟", title: "Tênis direto da fábrica", tag: "Calçados", economia: "até 70% mais barato", dias: "6 dias" },
  { emoji: "⌚", title: "Relógios e smartwatches", tag: "Acessórios", economia: "até 65% mais barato", dias: "6 dias" },
  { emoji: "🎧", title: "Eletrônicos e periféricos", tag: "Tech", economia: "até 60% mais barato", dias: "6 dias" },
  { emoji: "👕", title: "Roupas e streetwear", tag: "Moda", economia: "até 75% mais barato", dias: "6 dias" },
  { emoji: "💍", title: "Joias e semijoias", tag: "Joias", economia: "até 80% mais barato", dias: "6 dias" },
];

const FLOATERS = [
  { emoji: "🧢", top: "8%", left: "10%", delay: "0s", dur: "7s" },
  { emoji: "👜", top: "14%", left: "76%", delay: "1.2s", dur: "8s" },
  { emoji: "🕶️", top: "72%", left: "8%", delay: "0.6s", dur: "9s" },
  { emoji: "🎮", top: "78%", left: "78%", delay: "1.8s", dur: "7.5s" },
  { emoji: "📱", top: "42%", left: "86%", delay: "0.3s", dur: "6.5s" },
];

const STATS = [
  { num: "+24 mil", label: "alunos na comunidade" },
  { num: "1.500", label: "fábricas parceiras" },
  { num: "+30 mi", label: "produtos disponíveis" },
  { num: "6 dias", label: "entrega aérea expressa" },
];

const PROBLEMAS = [
  { icon: AlertTriangle, titulo: "Medo de cair em golpe", texto: "Comprar da China por conta própria é um campo minado: fornecedor fantasma, produto errado, dinheiro perdido e ninguém pra te responder." },
  { icon: Ban, titulo: "Taxas que destroem o lucro", texto: "Você acha uma oferta incrível, importa... e a taxação abusiva na alfândega transforma seu lucro em prejuízo." },
  { icon: HelpCircle, titulo: "Não saber por onde começar", texto: "Taobao, 1688, Weidian, agente, frete, declaração... sem alguém pra te guiar, você desiste antes da primeira compra." },
];

const PASSOS = [
  { icon: Search, titulo: "Crie sua conta grátis", texto: "Entre na plataforma sem pagar nada, conheça a estrutura por dentro e assista às primeiras aulas." },
  { icon: Bot, titulo: "Pergunte ao Minerador", texto: "Nossa IA encontra o produto certo, responde suas dúvidas e te orienta pra evitar taxas abusivas na importação." },
  { icon: ShoppingCart, titulo: "Compre direto da fábrica", texto: "Escolha entre +30 milhões de produtos de 1.500 fábricas parceiras. Sem pedido mínimo: pode comprar 1 unidade." },
  { icon: Truck, titulo: "Receba em até 6 dias", texto: "Envio Aéreo Expresso com rastreio em tempo real e 100% de seguro. Extravio ou roubo? Reembolso em até 24h." },
];

const FERRAMENTAS = [
  { icon: Bot, titulo: "O Minerador (IA)", texto: "Inteligência artificial de buscas e perguntas, desenvolvida pra te orientar na importação e evitar taxas abusivas." },
  { icon: Image, titulo: "Gerador de imagens 4K", texto: "A Connect AI transforma fotos simples de fornecedores em imagens profissionais que vendem na sua loja." },
  { icon: Radar, titulo: "Rastreio em tempo real", texto: "Sistema conectado direto com transportadoras internacionais e Correios: atualizações precisas e automáticas." },
  { icon: GraduationCap, titulo: "Aulas exclusivas", texto: "Módulos do zero ao avançado. O primeiro módulo te leva da criação da conta à primeira importação em menos de 30 minutos." },
  { icon: MessagesSquare, titulo: "Comunidade de networking", texto: "A maior comunidade de importadores do Brasil: alertas, oportunidades em primeira mão e sorteios mensais." },
  { icon: Gift, titulo: "Indique e Ganhe", texto: "Convide amigos pra plataforma e seja recompensado. Sua rede vira renda." },
];

const CATEGORIAS = [
  "Roupas", "Tênis", "Relógios", "Bonés", "Óculos", "Bolsas", "Perfumes",
  "Eletrônicos", "Periféricos", "Acessórios de celular", "Casa e Cozinha",
  "Decoração", "Brinquedos", "Pet", "Beleza", "Maquiagem", "Automotivo",
  "Esporte", "Fitness", "Joias", "Papelaria", "Gamer",
];

const PLANOS = [
  {
    nome: "Gratuito",
    preco: "0",
    sufixo: "",
    desc: "Uma forma simples de conhecer a estrutura por dentro antes de seguir para a experiência completa.",
    destaque: false,
    beneficios: [
      "Acesso à plataforma",
      "Primeiras aulas liberadas",
      "Conheça o Minerador",
      "Acesso à comunidade",
    ],
    cta: "Criar conta grátis",
  },
  {
    nome: "Essencial",
    preco: "XX,90",
    sufixo: "/mês",
    desc: "Acesso essencial para começar suas importações.",
    destaque: false,
    beneficios: [
      "Acesso às fábricas diretas na China",
      "O Minerador (IA de buscas e perguntas)",
      "Gerador de imagens 4K — 3 créditos/mês",
      "Rastreio em tempo real de até 5 envios",
      "Módulos de aulas exclusivas",
      "Sistema Indique e Ganhe",
      "Apple oficial na China (1 ano de garantia global)",
      "R$ 70 em cupons na primeira compra",
    ],
    cta: "Começar no Essencial",
  },
  {
    nome: "Intermediário",
    preco: "XX,90",
    sufixo: "/mês",
    desc: "O plano pra quem busca variedade e ferramentas de IA.",
    destaque: true,
    beneficios: [
      "Tudo do Essencial, e mais:",
      "Acesso a fábricas exclusivas na China",
      "Gerador de imagens 4K — 5 créditos/mês",
      "Acesso aos marketplaces locais da China",
      "Rastreio em tempo real de até 10 envios",
      "Alertas e oportunidades em primeira mão",
      "Sorteios mensais e premiações",
      "R$ 70 em cupons na primeira compra",
    ],
    cta: "Quero o Intermediário",
  },
];

const FAQS = [
  { p: "Preciso comprar em grande quantidade?", r: "Não. Nenhuma fábrica da plataforma exige pedido mínimo. Você pode comprar uma única unidade, inclusive só pra uso pessoal." },
  { p: "E se meu pacote extraviar?", r: "Todos os pacotes enviados pelo sistema contam com 100% de seguro. Em caso de extravio ou roubo durante o transporte, seu dinheiro é reembolsado em até 24 horas." },
  { p: "Quanto tempo demora pra chegar?", r: "Com os envios Aéreos Expresso, seus produtos chegam em até 6 dias, com rastreio em tempo real do começo ao fim." },
  { p: "Nunca importei nada. Vou conseguir?", r: "Sim. O primeiro módulo de aulas foi criado exatamente pra isso: configurar sua conta, cadastrar endereço, comprar, organizar o envio e rastrear — sua primeira importação em menos de 30 minutos." },
  { p: "Os produtos Apple são originais?", r: "Sim. O acesso é à Apple oficial na China: produtos originais, lacrados, desbloqueados e com 1 ano de garantia global." },
  { p: "Posso cancelar ou pedir reembolso?", r: "Pode cancelar quando quiser. E se não curtir por qualquer motivo, é só pedir o reembolso total dentro de 7 dias após a compra." },
];

// ════════════════════════════════════════════════════
export default function App() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((p) => (p + 1) % PRODUCTS.length);
        setVisible(true);
      }, 350);
    }, 3200);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const product = PRODUCTS[active];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FFFFFF", color: "#0F172A", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        @keyframes cineUp { from { opacity:0; transform:translateY(46px);} to { opacity:1; transform:translateY(0);} }
        @keyframes cineGlow { from { opacity:0; transform:scale(.8);} to { opacity:1; transform:scale(1);} }
        .cine-1 { animation: cineUp .9s cubic-bezier(.22,1,.36,1) .15s both; }
        .cine-2 { animation: cineUp .9s cubic-bezier(.22,1,.36,1) .35s both; }
        .cine-3 { animation: cineUp .9s cubic-bezier(.22,1,.36,1) .55s both; }
        .cine-4 { animation: cineUp .9s cubic-bezier(.22,1,.36,1) .75s both; }
        .cine-5 { animation: cineUp 1s cubic-bezier(.22,1,.36,1) .95s both; }
        .cine-glow { animation: cineGlow 1.6s ease .2s both; }
        @keyframes floaty { 0%{transform:translateY(0) rotate(-2deg);} 50%{transform:translateY(-18px) rotate(2deg);} 100%{transform:translateY(0) rotate(-2deg);} }
        @keyframes pulseDot { 0%,100%{opacity:1;} 50%{opacity:.35;} }
        @keyframes spotIn { from{opacity:0; transform:scale(.92) translateY(12px);} to{opacity:1; transform:scale(1) translateY(0);} }
        @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
        .spot-in { animation: spotIn .45s cubic-bezier(.22,1,.36,1) both; }
        .btn-blue { background:#2563EB; color:#fff; border:none; font-weight:700; border-radius:12px; cursor:pointer; transition:all .2s ease; box-shadow:0 8px 20px rgba(37,99,235,.32); display:inline-flex; align-items:center; gap:8px; font-family:inherit; }
        .btn-blue:hover { background:#1D4ED8; transform:translateY(-2px); box-shadow:0 12px 28px rgba(37,99,235,.45); }
        .btn-ghost-dark { background:rgba(255,255,255,.08); color:#fff; border:1px solid rgba(255,255,255,.25); font-weight:600; border-radius:12px; cursor:pointer; transition:all .2s ease; display:inline-flex; align-items:center; gap:8px; backdrop-filter:blur(6px); font-family:inherit; }
        .btn-ghost-dark:hover { background:rgba(255,255,255,.16); border-color:rgba(255,255,255,.5); }
        .card-hover { transition: transform .25s ease, box-shadow .25s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 44px rgba(15,23,42,.10); }
        .faq-btn { width:100%; background:none; border:none; cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:20px 4px; font-size:16px; font-weight:600; color:#0F172A; text-align:left; font-family:inherit; }
        @media (prefers-reduced-motion: reduce) { * { animation:none !important; transition:none !important; } }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 44px !important; }
          .hero-h1 { font-size: 2.3rem !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-planos { grid-template-columns: 1fr !important; }
          .motion-area { height: 420px !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .apple-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) { .steps-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 68, background: scrolled ? "rgba(255,255,255,.92)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid #E2E8F0" : "1px solid transparent", transition: "all .3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, fontSize: 19, color: scrolled ? "#0F172A" : "#fff", transition: "color .3s" }}>
          <span style={{ width: 32, height: 32, borderRadius: 9, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Globe2 size={17} color="#fff" strokeWidth={2.4} />
          </span>
          Connect Academy
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 28, fontSize: 14.5, fontWeight: 500, color: scrolled ? "#475569" : "rgba(255,255,255,.85)", transition: "color .3s" }}>
          <a href="#como-funciona" style={{ color: "inherit", textDecoration: "none" }}>Como funciona</a>
          <a href="#ferramentas" style={{ color: "inherit", textDecoration: "none" }}>Ferramentas</a>
          <a href="#planos" style={{ color: "inherit", textDecoration: "none" }}>Planos</a>
          <a href="#faq" style={{ color: "inherit", textDecoration: "none" }}>FAQ</a>
        </div>
        <button className="btn-blue" style={{ padding: "10px 20px", fontSize: 14 }}>
          Criar conta grátis
        </button>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <header style={{ position: "relative", background: "radial-gradient(ellipse 120% 90% at 50% -10%, #12305F 0%, #0A1B3A 45%, #061021 100%)", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 68 }}>
        <div className="cine-glow" style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,.22) 0%, rgba(96,165,250,0) 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 120%, rgba(0,0,0,.5), transparent 60%)", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 90px", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center", width: "100%", position: "relative" }}>
          {/* esquerda */}
          <div>
            <div className="cine-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,.12)", border: "1px solid rgba(96,165,250,.35)", color: "#93C5FD", fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999, marginBottom: 26 }}>
              <Sparkles size={14} />
              Importação da China com Inteligência Artificial
            </div>

            <h1 className="hero-h1 cine-2" style={{ fontSize: "3.3rem", lineHeight: 1.08, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.035em" }}>
              Importe direto de{" "}
              <span style={{ background: "linear-gradient(90deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                1.500 fábricas na China
              </span>{" "}
              e receba em até 6 dias
            </h1>

            <p className="cine-3" style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,255,255,.72)", margin: "24px 0 36px", maxWidth: 500 }}>
              Crie sua conta grátis e tenha acesso a +30 milhões de produtos,
              aulas exclusivas, rastreio em tempo real e ao <strong style={{ color: "#fff" }}>Minerador</strong>:
              a IA desenvolvida pra te guiar e evitar taxas abusivas.
            </p>

            <div className="cine-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#planos" style={{ textDecoration: "none" }}>
                <button className="btn-blue" style={{ padding: "17px 32px", fontSize: 16 }}>
                  Criar minha conta grátis <ArrowRight size={18} />
                </button>
              </a>
              <a href="#como-funciona" style={{ textDecoration: "none" }}>
                <button className="btn-ghost-dark" style={{ padding: "17px 26px", fontSize: 16 }}>
                  <Play size={16} fill="currentColor" /> Ver como funciona
                </button>
              </a>
            </div>

            <div className="cine-5" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 36 }}>
              <div style={{ display: "flex" }}>
                {["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"].map((c, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: "2.5px solid #0A1B3A", marginLeft: i === 0 ? 0 : -10, display: "flex", alignItems: "center", justifyContent: "center", color: "#061021", fontSize: 12, fontWeight: 800 }}>
                    {["R", "C", "L", "+"][i]}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.65)" }}>
                <strong style={{ color: "#fff" }}>+24 mil alunos</strong> na maior comunidade de importadores do Brasil
              </p>
            </div>
          </div>

          {/* direita: motion area */}
          <div className="motion-area cine-5" style={{ position: "relative", height: 520, borderRadius: 24, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.10)", overflow: "hidden", backdropFilter: "blur(4px)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(147,197,253,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,.06) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

            {FLOATERS.map((f, i) => (
              <div key={i} style={{ position: "absolute", top: f.top, left: f.left, width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,.95)", boxShadow: "0 8px 22px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, animation: `floaty ${f.dur} ease-in-out ${f.delay} infinite`, opacity: 0.9 }}>
                {f.emoji}
              </div>
            ))}

            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {visible && (
                <div className="spot-in" key={active} style={{ width: 285, background: "#FFFFFF", borderRadius: 20, boxShadow: "0 30px 60px rgba(0,0,0,.45), 0 0 0 6px rgba(96,165,250,.15)", padding: 20, position: "relative" }}>
                  <span style={{ position: "absolute", top: 14, right: 14, background: "#2563EB", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
                    {product.tag}
                  </span>
                  <div style={{ height: 128, borderRadius: 14, background: "linear-gradient(145deg, #EFF6FF, #DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, marginBottom: 16 }}>
                    {product.emoji}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{product.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#334155" }}>
                      <Factory size={15} color="#2563EB" /> Direto da fábrica · <strong style={{ color: "#2563EB" }}>{product.economia}</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#334155" }}>
                      <Plane size={15} color="#2563EB" /> Entrega em até <strong>{product.dias}</strong> · sem pedido mínimo
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#334155" }}>
                      <PackageCheck size={15} color="#2563EB" /> 100% segurado · reembolso em 24h
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(6,16,33,.92)", color: "#fff", borderRadius: 999, padding: "9px 18px", fontSize: 12.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,.12)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60A5FA", animation: "pulseDot 1.6s ease-in-out infinite" }} />
              Minerador online · pergunte qualquer coisa
              <BadgeCheck size={15} color="#60A5FA" />
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, transparent, #FFFFFF)" }} />
      </header>

      {/* ═══════════ STATS ═══════════ */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px 20px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div>
                <p style={{ fontSize: 38, fontWeight: 900, color: "#2563EB", letterSpacing: "-0.03em" }}>{s.num}</p>
                <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ PROBLEMA ═══════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <Reveal>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, textAlign: "center", letterSpacing: "-0.02em" }}>
            Importar sozinho é <span style={{ color: "#DC2626" }}>arriscado e caro</span>
          </h2>
        </Reveal>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 48 }}>
          {PROBLEMAS.map((p, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="card-hover" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 28, height: "100%" }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <p.icon size={22} color="#DC2626" />
                </div>
                <h3 style={{ fontSize: 17.5, fontWeight: 700, marginBottom: 10 }}>{p.titulo}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "#475569" }}>{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <p style={{ textAlign: "center", marginTop: 44, fontSize: 18, fontWeight: 600, color: "#2563EB" }}>
            A Connect Academy existe pra resolver exatamente isso. ↓
          </p>
        </Reveal>
      </section>

      {/* ═══════════ COMO FUNCIONA ═══════════ */}
      <section id="como-funciona" style={{ background: "linear-gradient(180deg, #F8FAFC, #EFF6FF)", padding: "90px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563EB", marginBottom: 12 }}>
              Como funciona
            </p>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, textAlign: "center", letterSpacing: "-0.02em" }}>
              Sua primeira importação em menos de 30 minutos
            </h2>
            <p style={{ textAlign: "center", fontSize: 17, color: "#475569", maxWidth: 620, margin: "16px auto 0", lineHeight: 1.6 }}>
              Da criação da conta ao rastreamento do pacote: o caminho todo é guiado
              pelas aulas e pelo Minerador.
            </p>
          </Reveal>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 52 }}>
            {PASSOS.map((s, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="card-hover" style={{ background: "#FFFFFF", borderRadius: 18, padding: 26, height: "100%", border: "1px solid #E2E8F0", position: "relative" }}>
                  <span style={{ position: "absolute", top: 18, right: 20, fontSize: 40, fontWeight: 800, color: "#EFF6FF", lineHeight: 1 }}>{i + 1}</span>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 8px 18px rgba(37,99,235,.32)" }}>
                    <s.icon size={22} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, marginBottom: 10 }}>{s.titulo}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#475569" }}>{s.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FERRAMENTAS ═══════════ */}
      <section id="ferramentas" style={{ maxWidth: 1100, margin: "0 auto", padding: "90px 24px" }}>
        <Reveal>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563EB", marginBottom: 12 }}>
            Ferramentas
          </p>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, textAlign: "center", letterSpacing: "-0.02em" }}>
            Muito mais que um curso: uma plataforma completa
          </h2>
        </Reveal>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 52 }}>
          {FERRAMENTAS.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.12}>
              <div className="card-hover" style={{ background: "#F8FAFC", borderRadius: 18, padding: 28, height: "100%", border: "1px solid #F1F5F9" }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <f.icon size={22} color="#2563EB" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.titulo}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#475569" }}>{f.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ CATEGORIAS (marquee) ═══════════ */}
      <section style={{ padding: "10px 0 60px", overflow: "hidden" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 24 }}>
          +30 milhões de produtos em dezenas de categorias
        </p>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 34s linear infinite" }}>
          {[...Array(2)].map((_, dup) => (
            <div key={dup} style={{ display: "flex", gap: 14, paddingRight: 14 }}>
              {CATEGORIAS.map((c) => (
                <span key={c} style={{ fontSize: 14.5, fontWeight: 600, color: "#334155", whiteSpace: "nowrap", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 999, padding: "9px 18px" }}>
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ APPLE OFICIAL ═══════════ */}
      <section style={{ background: "#061021", padding: "90px 24px", color: "#fff" }}>
        <div className="apple-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <Reveal>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", color: "#E2E8F0", fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999, marginBottom: 22 }}>
                <Apple size={14} /> Exclusivo pra assinantes
              </div>
              <h2 style={{ fontSize: "2.1rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                Apple oficial, direto da China
              </h2>
              <p style={{ fontSize: 16.5, color: "rgba(255,255,255,.7)", lineHeight: 1.7, marginTop: 18 }}>
                Acesso à Apple oficial na China: produtos <strong style={{ color: "#fff" }}>originais,
                lacrados e desbloqueados</strong>, com <strong style={{ color: "#fff" }}>1 ano de garantia
                global</strong>. iPhone, iPad, Mac e acessórios com preço de outro mundo.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 22, padding: 34, textAlign: "center" }}>
              <div style={{ fontSize: 70 }}>📱</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22, textAlign: "left" }}>
                {["Produtos 100% originais e lacrados", "Desbloqueados de fábrica", "1 ano de garantia global Apple"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
                    <Check size={17} color="#60A5FA" strokeWidth={3} /> {t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ PLANOS ═══════════ */}
      <section id="planos" style={{ background: "linear-gradient(180deg, #F8FAFC, #EFF6FF)", padding: "90px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563EB", marginBottom: 12 }}>
              Planos
            </p>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, textAlign: "center", letterSpacing: "-0.02em" }}>
              Comece grátis. Evolua quando quiser.
            </h2>
            <p style={{ textAlign: "center", fontSize: 16, color: "#475569", marginTop: 14 }}>
              Em todos os planos pagos, você recebe <strong>R$ 70 em cupons</strong> pra usar na primeira compra.
            </p>
          </Reveal>
          <div className="grid-planos" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginTop: 52, alignItems: "stretch" }}>
            {PLANOS.map((plano, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="card-hover" style={{
                  background: plano.destaque ? "#061021" : "#FFFFFF",
                  color: plano.destaque ? "#fff" : "#0F172A",
                  border: plano.destaque ? "2px solid #2563EB" : "1px solid #E2E8F0",
                  borderRadius: 22, padding: 30, height: "100%", position: "relative",
                  boxShadow: plano.destaque ? "0 24px 56px rgba(6,16,33,.35)" : "0 4px 14px rgba(15,23,42,.05)",
                  display: "flex", flexDirection: "column",
                }}>
                  {plano.destaque && (
                    <span style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#2563EB", color: "#fff", fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 6px 16px rgba(37,99,235,.4)" }}>
                      ⭐ MAIS POPULAR
                    </span>
                  )}
                  <h3 style={{ fontSize: 19, fontWeight: 800 }}>{plano.nome}</h3>
                  <p style={{ fontSize: 13.5, color: plano.destaque ? "rgba(255,255,255,.65)" : "#64748B", marginTop: 6, lineHeight: 1.5 }}>
                    {plano.desc}
                  </p>
                  <div style={{ margin: "20px 0", display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>R$</span>
                    <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em" }}>{plano.preco}</span>
                    <span style={{ fontSize: 14, color: plano.destaque ? "rgba(255,255,255,.6)" : "#64748B" }}>{plano.sufixo}</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                    {plano.beneficios.map((b, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.8, lineHeight: 1.45 }}>
                        <span style={{ marginTop: 2, flexShrink: 0 }}>
                          <Check size={15} color={plano.destaque ? "#60A5FA" : "#2563EB"} strokeWidth={3} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={plano.destaque ? "btn-blue" : ""}
                    style={plano.destaque
                      ? { padding: "15px", fontSize: 15, width: "100%", justifyContent: "center", marginTop: 24 }
                      : { padding: "15px", fontSize: 15, width: "100%", marginTop: 24, background: "#F1F5F9", color: "#0F172A", border: "1px solid #CBD5E1", borderRadius: 12, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, transition: "all .2s", fontFamily: "inherit" }}
                  >
                    {plano.cta} <ArrowRight size={16} />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 36, color: "#1D4ED8", fontSize: 14.5, fontWeight: 600, textAlign: "center" }}>
              <ShieldCheck size={19} style={{ flexShrink: 0 }} />
              Garantia de 7 dias: não curtiu por qualquer motivo? Reembolso total. E você pode cancelar quando quiser.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" style={{ maxWidth: 720, margin: "0 auto", padding: "90px 24px" }}>
        <Reveal>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, textAlign: "center", letterSpacing: "-0.02em", marginBottom: 44 }}>
            Perguntas frequentes
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: "1px solid #E2E8F0" }}>
                <button className="faq-btn" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {f.p}
                  <ChevronDown size={19} color="#2563EB" style={{ transform: faqOpen === i ? "rotate(180deg)" : "rotate(0)", transition: "transform .25s ease", flexShrink: 0, marginLeft: 12 }} />
                </button>
                <div style={{ maxHeight: faqOpen === i ? 220 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "#475569", padding: "0 4px 20px" }}>{f.r}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section style={{ background: "radial-gradient(ellipse 110% 100% at 50% 0%, #12305F 0%, #061021 60%)", padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        <Reveal>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", maxWidth: 680, margin: "0 auto", position: "relative" }}>
            A China está a{" "}
            <span style={{ background: "linear-gradient(90deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              um clique
            </span>{" "}
            de distância
          </h2>
          <p style={{ fontSize: 17.5, color: "rgba(255,255,255,.7)", maxWidth: 540, margin: "20px auto 40px", lineHeight: 1.65 }}>
            Junte-se aos +24 mil alunos que já importam direto das fábricas.
            Crie sua conta grátis e faça sua primeira importação ainda hoje.
          </p>
          <button className="btn-blue" style={{ padding: "19px 40px", fontSize: 17 }}>
            Criar minha conta grátis <ArrowRight size={19} />
          </button>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)", marginTop: 22 }}>
            ✅ Conta grátis pra começar &nbsp;·&nbsp; ✅ Garantia de 7 dias nos planos &nbsp;·&nbsp; ✅ Cancele quando quiser
          </p>
        </Reveal>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ background: "#03080F", padding: "48px 24px 36px", color: "rgba(255,255,255,.55)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, fontSize: 17, color: "#fff" }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Globe2 size={15} color="#fff" strokeWidth={2.4} />
              </span>
              Connect Academy
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 13.5, flexWrap: "wrap" }}>
              {["Termos de Uso", "Política de Privacidade", "Suporte", "Comunidade"].map((l) => (
                <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.7, marginTop: 24, maxWidth: 820 }}>
            Connect Academy © 2026 — Todos os direitos reservados. Resultados de
            importação e revenda variam conforme produto, estratégia e dedicação.
            Prazos de entrega são estimativas e podem variar conforme rota e
            transportadora. Apple é marca registrada da Apple Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
