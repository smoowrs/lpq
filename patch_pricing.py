
with open('/Users/thg/Downloads/lpq-main/lpq/src/pages/NovaPage.tsx', 'r') as f:
    content = f.read()

# ── 1. Replace PLANS ──────────────────────────────────────────────────────────
old_plans = "const PLANS = [\n  {\n    id: 'starter', label: 'Starter', emoji: '\U0001fa99',"
end_plans = "];\n\nconst FAQS"

start = content.find(old_plans)
end   = content.find(end_plans, start)
assert start != -1 and end != -1, "PLANS markers not found"

new_plans = """const PLANS = [
  {
    id: 'experience', label: 'Experience', emoji: '\U0001f499',
    period: '', periodLabel: '',
    priceOriginal: '', price: '', installment: '',
    cta: 'Criar conta gr\u00e1tis', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: false, free: true,
    desc: 'Uma forma simples de conhecer a estrutura por dentro e entender se faz sentido para voc\u00ea antes de seguir para a experi\u00eancia completa.',
    included: [], excluded: [],
    prices: { BR: { annual: '0' } }, region: 'BR',
  },
  {
    id: 'starter', label: 'STARTER', emoji: '\U0001f30e',
    period: '3 MESES DE ACESSO', periodLabel: 'trimestre',
    priceOriginal: 'R$ 97,00', price: 'R$ 67,90', installment: 'ou 12x de R$ 6,57',
    cta: 'Come\u00e7ar', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: false, free: false,
    desc: 'Acesso essencial para come\u00e7ar suas importa\u00e7\u00f5es.',
    included: [
      'Acesso \u00e0s f\u00e1bricas diretas na China.',
      'Roupas, T\u00eanis, Rel\u00f3gios, Bon\u00e9s, \u00d3culos, Meias, Bolsas, Perfumes, Ferramentas, Pesca, Eletr\u00f4nicos, Perif\u00e9ricos, Acess\u00f3rios para celular, Ilumina\u00e7\u00e3o, Casa e Cozinha, Decora\u00e7\u00e3o, Brinquedos, Papelaria, Pet, Beleza, Maquiagem, Automotivo, Esporte, Ciclismo, Fitness, Sex Shop, Joias, Jardinagem, Festa e Brindes. (N\u00e3o inclui produtos Apple e nem eletr\u00f4nicos)',
      'Um painel com produtos atualizados',
      'O Minerador (Intelig\u00eancia artificial de buscas e perguntas).',
      'Gerador de imagens 4K (3 cr\u00e9ditos mensais).',
      'Rastreio em tempo real de at\u00e9 5 envios.',
      'M\u00f3dulos de aulas exclusivas.',
      'Acesso \u00e0 comunidade.',
      'Sistema Indique e Ganhe.',
    ],
    excluded: [
      'Acesso \u00e0 Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global',
      'Baixar imagens ilimitadas',
      'Acesso aos marketplaces locais na China',
      'Prioridade no suporte (Topo da lista)',
      'Medalha de destaque exclusiva na comunidade',
      'Alertas e oportunidades em primeira m\u00e3o',
      'Sorteios mensais e premia\u00e7\u00f5es',
      'Grupo de Networking no WhatsApp',
    ],
    prices: { BR: { annual: '67.90' } }, region: 'BR',
  },
  {
    id: 'pro', label: 'PRO', emoji: '\U0001f30e',
    period: '1 ANO DE ACESSO', periodLabel: 'ano',
    priceOriginal: 'R$ 197,00', price: 'R$ 137,90', installment: 'ou 12x de R$ 12,78',
    cta: 'Come\u00e7ar', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: true, free: false,
    desc: 'O plano intermedi\u00e1rio para quem busca variedade e ferramentas de IA.',
    included: [
      'Acesso \u00e0 f\u00e1bricas exclusivas na China.',
      'Roupas, T\u00eanis, Rel\u00f3gios, Bon\u00e9s, \u00d3culos, Meias, Bolsas, Perfumes, Ferramentas, Pesca, Eletr\u00f4nicos, Perif\u00e9ricos, Acess\u00f3rios para celular, Ilumina\u00e7\u00e3o, Casa e Cozinha, Decora\u00e7\u00e3o, Brinquedos, Papelaria, Pet, Beleza, Maquiagem, Automotivo, Esporte, Ciclismo, Fitness, Sex Shop, Joias, Jardinagem, Festa e Brindes. (N\u00e3o inclui produtos Apple)',
      'Gerador de imagens 4K (5 cr\u00e9ditos mensais).',
      'Intelig\u00eancia Artificial o Minerador de buscas e perguntas.',
      'Acesso aos marketplaces locais na China.',
      'Rastreio em tempo real de at\u00e9 10 envios.',
      'M\u00f3dulos de aulas exclusivas.',
      'Acesso \u00e0 comunidade.',
      'Alertas e oportunidades em primeira m\u00e3o.',
      'Sorteios mensais e premia\u00e7\u00f5es.',
      'Sistema Indique e Ganhe.',
    ],
    excluded: [
      'Acesso \u00e0 Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global',
      'Baixar imagens ilimitadas',
      'Prioridade no suporte (Topo da lista)',
      'Medalha de destaque exclusiva na comunidade',
      'Grupo de Networking no WhatsApp',
    ],
    prices: { BR: { annual: '137.90' } }, region: 'BR',
  },
  {
    id: 'elite', label: 'ELITE', emoji: '\U0001f3c6',
    period: 'ACESSO PARA SEMPRE', periodLabel: 'vital\u00edcio',
    priceOriginal: 'R$ 380,00', price: 'R$ 266,00', installment: 'ou 12x de R$ 25,27',
    cta: 'Come\u00e7ar', ctaHref: 'https://app.connectacademy.com.br/cadastro',
    highlight: false, free: false,
    desc: 'Acesso total e suporte priorit\u00e1rio para escala m\u00e1xima.',
    included: [
      'Acesso \u00e0 Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global',
      'Baixar imagens ilimitadas',
      'Painel de f\u00e1bricas e produtos exclusivos n\u00e3o divulgados publicamente.',
      'Um painel com produtos atualizados',
      'Acesso \u00e0 origem de Eletr\u00f4nicos, Gamer, Perif\u00e9ricos, Acess\u00f3rios para Celular, Automotivo, Roupas, T\u00eanis, Rel\u00f3gios, Perfumes, Bolsas, Joias, \u00d3culos, Beleza, Maquiagem, Sex Shop, Fitness, Esporte, Ciclismo, Pesca, Casa e Cozinha, Decora\u00e7\u00e3o, Ilumina\u00e7\u00e3o, Jardinagem, Ferramentas, Brinquedos, Papelaria, Pet, Festa e Brindes.',
      'Gerador de imagens 4K (10 cr\u00e9ditos mensais).',
      'Intelig\u00eancia Artificial o Minerador de buscas e perguntas.',
      'Acesso aos marketplaces locais na China.',
      'Sem limites de rastreios de envios.',
      'M\u00f3dulos de aulas exclusivas.',
      'Acesso \u00e0 comunidade.',
      'Prioridade no suporte (Topo da lista).',
      'Medalha de destaque na comunidade.',
      'Alertas e oportunidades em primeira m\u00e3o.',
      'Sorteios mensais e premia\u00e7\u00f5es.',
      'Sistema Indique e Ganhe.',
      'Grupo de Networking no WhatsApp',
    ],
    excluded: [],
    prices: { BR: { annual: '266.00' } }, region: 'BR',
  },
"""

content = content[:start] + new_plans + content[end:]

# ── 2. Replace entire PRICING JSX section ─────────────────────────────────────
pricing_marker_start = "      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PRICING \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}"
faq_marker       = "      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 FAQ \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}"

ps = content.find(pricing_marker_start)
pe = content.find(faq_marker, ps)
assert ps != -1 and pe != -1, "PRICING markers not found"

new_pricing_section = """      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PRICING \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
      <section id="precos" style={{ background: '#fff', padding: '96px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: B, margin: '0 0 12px' }}>Planos</p>
            <h2 style={{ fontFamily: \\"'Bricolage Grotesque', system-ui\\", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Escolha seu plano</h2>
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
                  }}>\u2b50 Mais Popular</div>
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

                <p style={{ fontFamily: \\"'Bricolage Grotesque', system-ui\\", fontSize: 22, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: '0 0 6px' }}>
                  {plan.label} {plan.emoji}
                </p>

                <p style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#888', lineHeight: 1.55, margin: '0 0 20px' }}>{plan.desc}</p>

                {!plan.free ? (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.3)' : '#bbb', textDecoration: 'line-through', margin: '0 0 2px' }}>{plan.priceOriginal}</p>
                    <p style={{ fontFamily: \\"'Bricolage Grotesque', system-ui\\", fontSize: 38, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: '0 0 4px', lineHeight: 1 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, verticalAlign: 'super' }}>R$</span>
                      {plan.price.replace('R$ ', '')}
                      <span style={{ fontSize: 13, fontWeight: 500, color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#aaa' }}>/{plan.periodLabel}</span>
                    </p>
                    <p style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.35)' : '#aaa', margin: 0 }}>{plan.installment}</p>
                  </div>
                ) : (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontFamily: \\"'Bricolage Grotesque', system-ui\\", fontSize: 32, fontWeight: 800, color: plan.highlight ? '#fff' : '#0a0a0a', margin: 0 }}>Gr\u00e1tis</p>
                  </div>
                )}

                <a
                  href={plan.ctaHref}
                  style={{
                    display: 'block', textAlign: 'center',
                    width: '100%', height: 52, lineHeight: '52px',
                    borderRadius: 16,
                    background: plan.highlight ? '#fff' : `linear-gradient(135deg, ${B}, ${B2})`,
                    color: plan.highlight ? '#0a0a0a' : '#fff',
                    fontWeight: 700, fontSize: 15,
                    textDecoration: 'none',
                    boxShadow: plan.highlight ? 'none' : `0 8px 24px ${B}40`,
                    marginBottom: 10,
                    transition: 'opacity 0.15s, transform 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                >
                  {plan.cta}
                </a>

                {!plan.free && (
                  <>
                    <p style={{ fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.3)' : '#bbb', textAlign: 'center', margin: '0 0 12px' }}>Cancele quando quiser.</p>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
                      {['VISA', 'MC', 'GPay', 'Apple Pay', 'PIX'].map(pm => (
                        <span key={pm} style={{
                          fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 5,
                          background: plan.highlight ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
                          color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#888',
                          letterSpacing: '0.03em',
                        }}>{pm}</span>
                      ))}
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

      """

content = content[:ps] + new_pricing_section + content[pe:]

with open('/Users/thg/Downloads/lpq-main/lpq/src/pages/NovaPage.tsx', 'w') as f:
    f.write(content)

print("SUCCESS")
