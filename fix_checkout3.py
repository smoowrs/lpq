import re
import subprocess

file_path = 'src/components/CheckoutModal.tsx'
original = subprocess.check_output(['git', 'show', 'HEAD:src/components/CheckoutModal.tsx']).decode('utf-8')

def replace_return(content, func_name, new_return, search_string="return ("):
    func_idx = content.find(func_name)
    if func_idx == -1: return content
    return_idx = content.find(search_string, func_idx)
    if return_idx == -1: return content
        
    open_brackets = 0
    close_idx = -1
    for i in range(return_idx, len(content)):
        if content[i] == '(':
            open_brackets += 1
        elif content[i] == ')':
            open_brackets -= 1
            if open_brackets == 0:
                close_idx = i
                break
                
    if close_idx != -1:
        if close_idx + 1 < len(content) and content[close_idx + 1] == ';':
            close_idx += 1
        return content[:return_idx] + new_return + content[close_idx + 1:]
    
    return content

stripe_return = """return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <PaymentElement
                onChange={handlePaymentElementChange}
                options={{
                    layout: 'tabs',
                    wallets: { applePay: 'never', googlePay: 'never' },
                    link: { email: 'never' },
                    terms: { card: 'never' },
                }}
            />
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{ width: '16px', height: '16px', marginTop: '2px' }}
                />
                <span style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Ao fornecer os seus dados, você permite que a Stripe faça a cobrança no seu cartão de acordo com os seus termos.
                </span>
            </label>
            <button
                type="submit"
                disabled={loading || !stripe || !agreedToTerms}
                style={{
                    width: '100%', padding: '18px', background: (loading || !stripe || !agreedToTerms) ? '#94a3b8' : '#254bff',
                    color: '#fff', borderRadius: '14px', fontSize: '17px', fontWeight: '700', border: 'none', cursor: (loading || !stripe || !agreedToTerms) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Processando...' : 'Comprar →'}
            </button>
        </form>
    );"""

apple_return = """return (
        <button
            onClick={handleClick}
            style={{
                flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#000', borderRadius: '12px', border: isActive ? '2px solid #254bff' : '1px solid #e2e8f0', cursor: 'pointer'
            }}
        >
            <img
                src="https://i.postimg.cc/YS7x3Xjp/5977576_2.png"
                style={{ height: '28px', filter: 'invert(1)' }}
                alt="Apple Pay"
            />
        </button>
    );"""

pix_content_pattern = re.compile(r"if \(loading\) return \([\s\S]*?className=\"w-full h-14 bg-\[\#4D5BFF\].*?</button>\n        </div>\n    \);", re.MULTILINE)
pix_new_content = """if (loading) return (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Gerando QR Code...</p>
        </div>
    );

    if (pixData) return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #E8EAF0', display: 'inline-block', margin: '0 auto' }}>
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.payload)}`}
                    alt="PIX"
                    style={{ width: '176px', height: '176px' }}
                />
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <p style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left', fontFamily: 'monospace' }}>{pixData.payload}</p>
                <button
                    onClick={() => { navigator.clipboard.writeText(pixData.payload); setCopiedMessage(true); setTimeout(() => setCopiedMessage(false), 2000); }}
                    style={{ padding: '8px', background: '#e2e8f0', color: '#475569', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    <Icons.Copy style={{ width: '16px', height: '16px' }} />
                </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
                Aguardando pagamento... {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>CPF do Titular</label>
                <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', boxSizing: 'border-box' }}
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                />
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px' }} checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
                <span style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>Concordo com os termos do serviço e políticas de privacidade.</span>
            </label>
            <button
                onClick={handleGeneratePix}
                disabled={loading}
                style={{ width: '100%', background: loading ? '#94a3b8' : '#254bff', color: '#fff', borderRadius: '14px', padding: '18px', fontSize: '17px', fontWeight: '700', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading ? 'Gerando...' : 'Gerar QR Code PIX →'}
            </button>
        </div>
    );"""

appmax_return = """return (
        <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label style={labelStyle}>NÚMERO DO CARTÃO</label>
                <input
                    name="card_number"
                    type="tel"
                    inputMode="numeric"
                    placeholder="1234 1234 1234 1234"
                    required
                    style={inputStyle}
                    value={formData.card_number}
                    onChange={handleInputChange}
                    maxLength={19}
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>NOME NO CARTÃO</label>
                    <input
                        name="card_name"
                        placeholder="Nome impresso"
                        required
                        style={inputStyle}
                        value={formData.card_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label style={labelStyle}>CPF DO TITULAR</label>
                    <input
                        name="cpf"
                        type="tel"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        required
                        style={inputStyle}
                        value={formData.cpf}
                        onChange={handleInputChange}
                        maxLength={14}
                    />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>DATA DE VALIDADE</label>
                    <input
                        name="card_expiry"
                        type="tel"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        required
                        style={inputStyle}
                        value={formData.card_expiry}
                        onChange={handleInputChange}
                        maxLength={5}
                    />
                </div>
                <div>
                    <label style={labelStyle}>CÓDIGO (CVC)</label>
                    <input
                        name="card_cvv"
                        type="tel"
                        inputMode="numeric"
                        placeholder="123"
                        required
                        style={inputStyle}
                        value={formData.card_cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                    />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>PARCELAS</label>
                    <select name="installments" style={{...inputStyle, appearance: 'auto'}} value={formData.installments} onChange={handleInputChange}>
                        {adjustedInstallments.map((inst: any, i: number) => {
                            const n = i + 1;
                            return (
                                <option key={n} value={n}>
                                    {n}x de R$ {inst.value}
                                </option>
                            );
                        })}
                        {adjustedInstallments.length === 0 && Array.from({ length: 21 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}x</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>PAÍS</label>
                    <select name="country" style={{...inputStyle, appearance: 'auto'}} value={formData.country} onChange={handleInputChange}>
                        <option value="BR">Brasil</option>
                        <option value="US">Estados Unidos</option>
                        <option value="PT">Portugal</option>
                    </select>
                </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginTop: '4px' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px' }} checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
                <span style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Ao fornecer os seus dados, você permite que a Appmax realize a cobrança no seu cartão.
                </span>
            </label>

            <button
                type="submit"
                disabled={loading || !agreedToTerms}
                style={{
                    width: '100%', background: (!agreedToTerms || loading) ? '#94a3b8' : '#254bff', color: '#fff', borderRadius: '14px', padding: '18px', fontSize: '17px', fontWeight: '700', border: 'none', cursor: (!agreedToTerms || loading) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Processando...' : '🔒 Comprar →'}
            </button>
        </form>
    );"""

modal_return = """return createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#F7F8FC', overflowY: 'auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #EAECF0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '14px', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                    ← Voltar
                </button>
                <div style={{ textAlign: 'center', lineHeight: 1 }}>
                    <span style={{ color: '#254bff', fontWeight: 800, fontSize: '14px' }}>CONNECT</span>
                    <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '10px', marginLeft: '4px' }}>ACADEMY</span>
                </div>
                <button style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '50%', background: 'none', color: '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    ?
                </button>
            </div>

            <div style={{ maxWidth: '480px', margin: '0 auto', paddingBottom: '80px' }}>
                <div style={{ position: 'relative', margin: '16px', borderRadius: '12px', overflow: 'hidden', height: '140px', background: '#0a0a1a' }}>
                    <img src="/portal/assets/iphone17promax.webp" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} alt="Banner" />
                    <div style={{ position: 'absolute', inset: 0, padding: '20px' }}>
                        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '11px', fontWeight: 600, letterSpacing: '.1em', margin: '0 0 8px' }}>O PRIMEIRO PASSO É SEU.</p>
                        <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0, lineHeight: 1.1, fontFamily: '"Bricolage Grotesque", system-ui' }}>Seu próximo <br/><em style={{ fontStyle: 'italic', fontWeight: 700 }}>capítulo.</em></h2>
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #E8EAF0', borderRadius: '16px', margin: '0 16px 16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>RESUMO DO PEDIDO</span>
                        {oldPriceStr && !orderBump && region === 'BR' && (
                            <span style={{ background: '#EEF2FF', color: '#254bff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>30% OFF</span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                            {planDisplayName.toLowerCase().includes('starter') ? '🌎' : '👑'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 2px' }}>Plano</p>
                            <p style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{planDisplayName.replace('Plano ', '').toUpperCase()}<span style={{ color: '#254bff' }}>.</span></p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            {oldPriceStr && !orderBump && region === 'BR' && (
                                <p style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through', margin: '0 0 2px' }}>{currencySymbol} {oldPriceStr}</p>
                            )}
                            <p style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>{currencySymbol} {orderBump ? totalPriceStr : priceStr}</p>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>• {planPeriodLabel.toLowerCase()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E8EAF0', paddingTop: '16px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>{planAccessDuration}</span>
                        {!orderBump && region === 'BR' && (
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Ou 12x de {currencySymbol} {monthly12x}</span>
                        )}
                    </div>
                </div>

                {!isAuthenticated && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px 16px', gap: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: step === 1 ? '#254bff' : '#254bff', color: '#fff', fontWeight: 700 }}>
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: step === 1 ? '#1e293b' : '#64748b' }}>Crie sua conta</span>
                        </div>
                        <div style={{ flex: 1, height: '2px', background: step > 1 ? '#254bff' : '#e2e8f0', margin: '0 12px', alignSelf: 'flex-start', marginTop: '15px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: step === 2 ? '#254bff' : '#fff', color: step === 2 ? '#fff' : '#94a3b8', border: step === 2 ? 'none' : '2px solid #e2e8f0', fontWeight: 700 }}>
                                2
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: step === 2 ? '#1e293b' : '#94a3b8' }}>Pagamento</span>
                        </div>
                    </div>
                )}

                <div style={{ padding: '0 16px' }}>
                    {step === 1 && !isAuthenticated ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <p style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', margin: '0 0 8px' }}>01 / VAMOS NOS CONHECER</p>
                                <h2 style={{ fontSize: '32px', fontWeight: 800, fontFamily: '"Bricolage Grotesque", system-ui', margin: '0 0 8px', lineHeight: 1.1 }}>Seu próximo passo.</h2>
                                <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Crie sua conta para entrar no universo Connect.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Nome completo</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', boxSizing: 'border-box' }}
                                        placeholder="Seu nome"
                                        value={guestName}
                                        onChange={e => setGuestName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>E-mail</label>
                                    <input
                                        type="email"
                                        style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', boxSizing: 'border-box' }}
                                        placeholder="Seu e-mail"
                                        value={guestEmail}
                                        onChange={e => setGuestEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>WhatsApp</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', background: '#f8fafc', color: '#64748b', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                                            🇧🇷 +55
                                        </div>
                                        <input
                                            type="tel"
                                            style={{ flex: 1, border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', boxSizing: 'border-box' }}
                                            placeholder="(11) 99999-9999"
                                            value={guestPhone}
                                            onChange={e => setGuestPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ fontSize: '20px' }}>✉</span>
                                <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.4 }}>Você receberá um <span style={{ fontWeight: 700 }}>e-mail com seus dados de acesso</span> após a compra.</p>
                            </div>

                            <button
                                onClick={handleStep1Continue}
                                style={{ background: '#254bff', color: '#fff', borderRadius: '14px', padding: '18px', fontSize: '17px', fontWeight: 700, width: '100%', border: 'none', cursor: 'pointer' }}
                            >
                                Continuar para Pagamento →
                            </button>
                            <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', margin: '0' }}>Falta só mais um passo para começar.</p>
                            <img src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png" style={{ height: '20px', opacity: 0.5, margin: '0 auto', display: 'block' }} alt="Cartões" />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <p style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', margin: '0 0 8px' }}>02 / QUASE LÁ</p>
                                <h2 style={{ fontSize: '32px', fontWeight: 800, fontFamily: '"Bricolage Grotesque", system-ui', margin: '0 0 8px', lineHeight: 1.1 }}>Do seu jeito.</h2>
                                <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Escolha como deseja pagar e comece seu próximo capítulo.</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #E8EAF0', borderRadius: '16px', padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EEF2FF', color: '#254bff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                                        {guestName ? guestName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 2px', color: '#1e293b' }}>{guestName || 'Usuário'}</p>
                                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{guestEmail}</p>
                                    </div>
                                </div>
                                {!isAuthenticated && (
                                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#254bff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                                        Editar
                                    </button>
                                )}
                            </div>

                            {showOrderBump && (
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: orderBump ? '#EEF2FF' : '#fff', border: orderBump ? '2px solid #254bff' : '1px solid #E8EAF0', borderRadius: '16px', padding: '16px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={orderBump}
                                        onChange={e => setOrderBump(e.target.checked)}
                                        style={{ width: '20px', height: '20px', marginTop: '2px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, background: '#254bff', color: '#fff', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>OFERTA ESPECIAL</span>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>+ R$ 49,90</span>
                                        </div>
                                        <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>Grupo de Networking Exclusivo</p>
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>Acesso direto a outros membros para trocar experiências e crescer junto.</p>
                                    </div>
                                </label>
                            )}

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => setMethod(region === 'EU' ? 'cc' : 'cc_appmax')}
                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: (method === 'cc_appmax' || method === 'cc') ? '2px solid #254bff' : '1px solid #E8EAF0', background: '#fff', color: (method === 'cc_appmax' || method === 'cc') ? '#254bff' : '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                                >
                                    Cartão
                                </button>
                                {region === 'BR' && (
                                    <button
                                        onClick={() => setMethod('pix')}
                                        style={{ flex: 1, padding: '14px', borderRadius: '12px', border: method === 'pix' ? '2px solid #254bff' : '1px solid #E8EAF0', background: '#fff', color: method === 'pix' ? '#254bff' : '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                                    >
                                        Pix
                                    </button>
                                )}
                                <ApplePayButton
                                    plan={plan}
                                    priceNum={totalPriceNum}
                                    region={region}
                                    guestEmail={guestEmail}
                                    guestName={guestName}
                                    onSuccess={handleLocalSuccess}
                                    isActive={method === 'apple_pay'}
                                    onClick={() => setMethod('apple_pay')}
                                />
                            </div>

                            <div>
                                {method === 'cc_appmax' ? (
                                    <AppmaxCCPayment 
                                        plan={plan} 
                                        onSuccess={handleLocalSuccess} 
                                        region={region} 
                                        guestEmail={guestEmail} 
                                        guestName={guestName} 
                                        guestPhone={guestPhone}
                                        orderBump={orderBump}
                                        orderBumpPrice={ORDER_BUMP_PRICE}
                                        onInstallmentChange={(info: any, n: number) => setSelectedInstallment({ n, info })}
                                    />
                                ) : method === 'cc' ? (
                                    clientSecret ? (
                                        <Elements
                                            stripe={stripePromise}
                                            options={{
                                                clientSecret,
                                                appearance: {
                                                    theme: 'stripe',
                                                    variables: { colorPrimary: '#254bff', borderRadius: '12px', fontSizeBase: '14px' },
                                                },
                                            }}
                                        >
                                            <StripeForm plan={plan} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} guestPhone={guestPhone} />
                                        </Elements>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px 0' }}><p>Carregando...</p></div>
                                    )
                                ) : method === 'pix' ? (
                                    <PixPayment plan={plan} onSuccess={handleLocalSuccess} guestEmail={guestEmail} guestName={guestName} guestPhone={guestPhone} orderBump={orderBump} orderBumpPrice={ORDER_BUMP_PRICE} />
                                ) : null}
                            </div>

                            <div style={{ borderTop: '1px solid #E8EAF0', paddingTop: '20px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>Total do pedido</span>
                                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>{currencySymbol} {orderBump ? totalPriceStr : priceStr}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{method === 'pix' ? 'Pagamento único' : `Ou ${selectedInstallment.n}x de ${currencySymbol} ${selectedInstallment.info?.value || monthly12x}`}</span>
                                </div>
                            </div>
                            
                            <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: '0' }}>Seus dados de acesso chegam por e-mail após o pagamento.</p>
                            <img src="https://i.postimg.cc/NGKLLVXr/LOGOSCARTAO.png" style={{ height: '20px', opacity: 0.5, margin: '0 auto', display: 'block' }} alt="Cartões" />
                        </div>
                    )}
                </div>
            </div>

            {step === 2 && (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E8EAF0', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>CONNECT ACADEMY</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Seu acesso, passo a passo →</span>
                </div>
            )}
            
            {isPaymentApproved && (
                <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
                    <img src="https://i.postimg.cc/8CypNtWj/IMG-3409.gif" style={{ width: '80px', height: '80px', marginBottom: '24px' }} alt="Success" />
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Pagamento Aprovado!</h2>
                    <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '280px', lineHeight: 1.5 }}>Seu acesso ao Connect Academy foi liberado. Verifique seu e-mail para os próximos passos.</p>
                </div>
            )}
        </div>,
        document.body
    );"""

content = original
content = replace_return(content, 'const StripeForm', stripe_return)

apple_replace = re.compile(r"return \(\s*<button[\s\S]*?alt=\"Apple Pay\"\s*/>\s*</button>\s*\);", re.MULTILINE)
content = re.sub(apple_replace, apple_return, content)

content = re.sub(pix_content_pattern, pix_new_content, content)
content = replace_return(content, 'const AppmaxCCPayment', appmax_return)
content = replace_return(content, 'export const CheckoutModal', modal_return, search_string="return createPortal(")

content = content.replace(
    'const inputStyle = "w-full h-14 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-700 outline-none focus:border-[#4D5BFF] transition-all placeholder:text-slate-300";',
    "const inputStyle = { width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', boxSizing: 'border-box' as const };"
)
content = content.replace(
    'const labelStyle = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";',
    "const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' };"
)

with open(file_path, 'w') as f:
    f.write(content)

print("CheckoutModal.tsx fixed successfully!")
