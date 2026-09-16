/* Connect Wheel — componente independente, sem dependências. */
(function (global) {
  'use strict';
  if (global.ConnectWheel) return;
  const defaults = {
    enabled: false, campaignId: 'connect-roleta-01', brand: 'CONNECT ACADEMY',
    checkoutUrl: '', terms: '', expiresAt: '', checkoutCouponParameter: '',
    autoOpen: true, delayMs: 12000, audienceRate: .35, cooldownHours: 168,
    demo: false, onEvent: null, coupon: '', sound: true
  };
  let current = null;
  let pendingReady = null;
  const css = `
:host{all:initial;color-scheme:light;font-family:Manrope,Arial,sans-serif}*,*:before,*:after{box-sizing:border-box}[hidden]{display:none!important}button,a{font:inherit;-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #254bff;outline-offset:4px}
summary { list-style: none; display: flex; align-items: center; justify-content: center; gap: 5px; }
summary::-webkit-details-marker { display: none; }

dialog{position:fixed;inset:0;width:min(900px,calc(100vw - 32px));max-width:calc(100vw - 32px);max-height:calc(100dvh - 32px);margin:auto;border:0;border-radius:24px;padding:0;overflow:auto;background:#fff;color:#121316;box-shadow:0 35px 140px #10162d45;font:14px/1.5 Manrope,Arial,sans-serif;overscroll-behavior:contain}dialog[open]{animation:cw-enter .35s ease-out}dialog::backdrop{background:#10152280;backdrop-filter:blur(7px)}.layout{display:grid;grid-template-columns:1fr 1.04fr;position:relative;isolation:isolate;min-height:540px}.content{padding:34px 34px 27px;position:relative;z-index:2}.brand{font-size:12px;font-weight:800;letter-spacing:1.7px;display:flex;align-items:center;gap:9px}.brand-mark{color:#254bff;font:28px/1 Georgia,serif}.close{position:absolute;right:17px;top:17px;z-index:9;width:36px;height:36px;border:1px solid #dfe3f0;border-radius:50%;background:#ffffffd9;color:#252b3a;display:grid;place-items:center;font:25px/1 Arial}.close:hover{background:#edf1ff}.kicker{font-size:10px;font-weight:700;letter-spacing:1.6px;color:#626980;margin:40px 0 12px;display:flex;align-items:center;gap:8px}.kicker:before{content:'';height:6px;width:6px;border-radius:50%;background:#254bff}.heading{font-size:36px;line-height:1.09;font-weight:500;letter-spacing:-1.8px;margin:0}.heading em{font-family:Georgia,serif;font-weight:400}.offer{display:flex;align-items:baseline;gap:9px;color:#254bff;line-height:1;margin:12px 0 16px;white-space:nowrap}.amount{font-size:78px;letter-spacing:-6px;font-weight:700}.off{font-size:29px;letter-spacing:-1px}.intro{font-size:13px;color:#686e7f;line-height:1.7;margin:0 0 20px;max-width:300px}.primary{background:#254bff;color:#fff;border:0;border-radius:9px;padding:16px 19px;display:flex;align-items:center;justify-content:space-between;gap:20px;width:100%;font-weight:700;font-size:14px;text-decoration:none;transition:background .2s,transform .2s}.primary:hover{background:#1238eb;transform:translateY(-1px)}.primary:disabled{cursor:wait;background:#5572ec;transform:none}.primary[aria-disabled=true]{opacity:.58;cursor:default;transform:none}.arrow{font-size:21px;line-height:1}.micro{color:#73798a;font-size:10px;margin:10px 0 0;line-height:1.65}.demo{font-size:10px;color:#596079;margin:8px 0 0}.visual{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:19px;overflow:hidden;background:radial-gradient(ellipse at 50% 47%,#e9eeff 0,#f6f8ff 48%,#fafbff 75%);border-left:1px solid #eef0f7;border-radius:0 24px 24px 0;padding:65px 19px 35px}.visual:before,.visual:after{content:'';position:absolute;width:430px;height:430px;border:1px solid #e5eafb;border-radius:50%;pointer-events:none}.visual:after{width:495px;height:495px}.wheel-wrap{width:100%;max-width:374px;aspect-ratio:1;position:relative;filter:drop-shadow(0 15px 18px #254bff15);z-index:1}.rim{position:absolute;inset:0;border:1px solid #d8e0ff;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 7px #fff,inset 0 0 0 8px #e5e9f5}.disk{position:absolute;inset:12px;transform:rotate(0deg);transform-origin:50% 50%;will-change:transform}.disk svg{width:100%;height:100%;display:block;overflow:visible}.pin{position:absolute;left:50%;top:-10px;transform:translateX(-50%);width:31px;height:43px;z-index:4;filter:drop-shadow(0 3px 2px #0c299833);transform-origin:center 10px}.hub{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:75px;width:75px;border:6px solid #fff;outline:1px solid #e2e6fa;border-radius:50%;display:grid;place-items:center;background:#254bff;box-shadow:0 3px 12px #152f9529;color:#fff;font:43px/1 Georgia,serif;z-index:3}.orbit-label{position:relative;z-index:2;background:white;border:1px solid #e3e9fc;border-radius:100px;font-size:10px;letter-spacing:.25px;color:#626c87;padding:8px 14px;display:flex;align-items:center;gap:7px}.orbit-label b{font-size:14px;color:#254bff}.spark{position:absolute;color:#254bff;font:30px/1 Georgia,serif;z-index:1}.spark.one{right:29px;top:77px}.spark.two{left:30px;bottom:59px;font-size:20px}.won .wheel-wrap{animation:cw-pop .6s ease-out}.won .hub{background:#102cb7;box-shadow:0 0 0 9px #254bff10,0 0 40px #254bff33}.result .kicker{color:#254bff;margin-top:34px}.result .heading{font-size:31px}.result .offer{margin:13px 0}.result .amount{font-size:76px}.result .intro{margin-bottom:15px}.coupon-row{display:flex;align-items:center;gap:8px;padding:7px 8px 7px 13px;border:1px dashed #a3b2ee;border-radius:8px;background:#f6f8ff;margin-bottom:11px}.code{font:700 17px/1.4 ui-monospace,monospace;letter-spacing:1px;flex:1;min-width:0;overflow-wrap:anywhere;color:#203688}.copy{border:0;border-radius:5px;background:#e5ebff;color:#2342b5;font-size:11px;font-weight:700;padding:9px 11px}.conditions{font-size:10px;color:#747b8c;margin-top:14px;line-height:1.6}.conditions summary{cursor:pointer;text-underline-offset:3px;text-decoration:underline}.conditions p{margin:8px 0 0}.chance-list{padding-left:17px;margin:8px 0}.status{font-size:11px;color:#254bff;margin:9px 0 0}.status:empty{display:none}.celebration{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:7;border-radius:24px}.confetti{position:absolute;left:70%;top:25%;width:7px;height:12px;background:var(--color);opacity:0;animation:cw-confetti 1.4s ease-out forwards;animation-delay:var(--delay)}.badge{position:absolute;right:36px;top:59px;z-index:5;background:#254bff;color:#fff;padding:9px 12px;font-size:10px;font-weight:700;border:3px solid white;border-radius:7px;transform:rotate(7deg);box-shadow:0 4px 15px #173aad1a}.screen-reader{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
@keyframes cw-enter{from{transform:translateY(100vh)}to{transform:translateY(0)}}@keyframes cw-pop{0%{transform:scale(.96)}50%{transform:scale(1.025)}100%{transform:scale(1)}}@keyframes cw-confetti{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r))}}
@media(max-width:650px){dialog{width:min(410px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);border-radius:20px}.layout{display:flex;flex-direction:column;min-height:0}.content{padding:22px 25px 20px}.brand{font-size:10px;letter-spacing:1.3px}.brand-mark{font-size:23px;display:none;}.brand-logo{height:20px;}.close{right:13px;top:15px;width:31px;height:31px}.kicker{margin:23px 0 9px;font-size:9px}.heading{font-size:27px;letter-spacing:-1px}.offer{position:absolute;right:25px;top:87px;display:block;text-align:right;margin:0}.amount{font-size:50px;letter-spacing:-3px}.off{font-size:16px;display:block;margin-top:3px}.intro{font-size:11px;line-height:1.6;max-width:230px;margin:13px 0 14px}.primary{padding:13px 15px;font-size:12px}.micro,.demo{font-size:9px}.conditions{font-size:9px;margin-top:10px}.visual{padding:26px 28px 20px;border-left:0;border-top:1px solid #eef0f7;border-radius:0 0 20px 20px;gap:13px}.wheel-wrap{max-width:254px}.hub{width:58px;height:58px;font-size:32px;border-width:5px}.disk{inset:10px}.pin{width:25px;height:35px;top:-8px}.badge{right:18px;top:17px;font-size:8px;padding:6px 9px}.orbit-label{font-size:9px;padding:6px 12px}.spark.one{top:20px;right:28px;font-size:23px}.spark.two{bottom:21px;left:26px;font-size:18px}.visual:before{width:300px;height:300px}.visual:after{width:360px;height:360px}.result .kicker{margin-top:23px}.result .heading{font-size:25px}.result .offer{position:static;display:flex;text-align:left;align-items:baseline;gap:8px;margin:10px 0}.result .amount{font-size:59px}.result .off{font-size:22px}.result .intro{margin:0 0 13px}.result .visual{padding-top:20px}.result .wheel-wrap{max-width:195px}.result .orbit-label{display:none}.result .badge{top:17px}.confetti{left:50%;top:40%}}
@media(max-width:420px){.offer{position:static;display:flex;text-align:left;align-items:baseline;gap:7px;margin:9px 0 12px}.amount{font-size:55px}.off{font-size:20px;display:inline}.kicker{margin-top:20px}.intro{max-width:none;margin-top:0}.wheel-wrap{max-width:224px}.visual{padding-top:24px}.result .offer{position:static}}
@media(max-width:360px){.content{padding:21px 20px 18px}.heading{font-size:24px}.offer{right:20px;top:89px}.amount{font-size:43px}.intro{max-width:210px}.wheel-wrap{max-width:225px}}


@media(max-width: 650px) {
  dialog {
    margin: auto 0 0 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    border-radius: 32px 32px 0 0 !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
  }
  .layout {
    border-radius: 32px 32px 0 0;
  }
}


@keyframes cw-pulse {
  0%, 100% { filter: drop-shadow(0 0 15px rgba(37,75,255,0.2)) scale(1); }
  50% { filter: drop-shadow(0 0 30px rgba(37,75,255,0.6)) scale(1.02); }
}
.spinning .wheel-wrap { animation: cw-pulse 0.4s infinite ease-in-out; }

/* Compact Connect card */
dialog{width:min(386px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);border-radius:25px;overflow:auto}.layout{display:flex;flex-direction:column;min-height:0;padding:23px 25px 19px;overflow:hidden}.content{display:contents}.brand{order:0;font-size:10px;letter-spacing:1.25px;gap:6px;min-height:25px}.brand-mark{display:none;font-size:23px}.brand-logo{height:20px;}.close{right:14px;top:17px;width:29px;height:29px;font-size:22px}.sound{position:absolute;right:49px;top:17px;width:29px;height:29px;display:grid;place-items:center;background:#f1f4ff;color:#254bff;border:1px solid #e2e7fa;border-radius:50%;font:20px/1 Georgia,serif;z-index:9}.sound[aria-pressed=false]{color:#7c8293;background:#f6f7f9}.kicker{order:1;justify-content:center;font-size:8px;letter-spacing:1.5px;margin:22px 0 8px}.heading{order:2;font-size:23px;line-height:1.18;letter-spacing:-.9px;text-align:center;font-weight:500}.offer{order:3;position:static!important;display:flex!important;align-items:baseline;justify-content:center;text-align:center;gap:8px;margin:7px 0 6px!important;line-height:1}.amount{font-size:59px!important;letter-spacing:-4px}.off{font-size:23px!important;display:inline;margin:0;letter-spacing:-1px}.intro{order:4;font-size:10px;line-height:1.6;max-width:none;text-align:center;margin:0 0 8px!important;color:#697188}.visual{order:5;overflow:visible;border:0;border-radius:0;background:none;padding:15px 0 12px!important;gap:0;min-height:0}.visual:before{width:260px;height:260px;border-color:#e7eafd;background:radial-gradient(circle,#eef2ff,transparent 65%);z-index:-1}.visual:after{width:285px;height:285px;border-color:#f0f2fb;z-index:-1}.wheel-wrap{max-width:246px!important;filter:drop-shadow(0 9px 9px #39468820)}.rim{background:repeating-conic-gradient(from 5deg,#cdd6ff 0deg 1.5deg,#fff 1.5deg 10deg);box-shadow:inset 0 0 0 3px white;border-color:#e0e6fa}.disk{inset:10px}.hub{width:59px;height:59px;font-size:34px;border:5px solid white;outline:1px solid #d9e0fa;box-shadow:0 4px 12px #11215628}.pin{width:26px;height:37px;top:-9px}.orbit-label{display:none}.spark.one{right:9px;top:28px;font-size:25px;color:#8b5cf6}.spark.two{left:4px;bottom:32px;font-size:25px;color:#f1b34d}.badge{display:none}.spin{order:6;margin-top:11px}.primary{padding:14px 15px;font-size:12px;border-radius:10px;box-shadow:0 5px 13px #254bff1a}.micro{order:8;text-align:center;font-size:9px;line-height:1.6;margin:12px 0 0}.demo{order:9;text-align:center;font-size:8px;margin:4px 0 0}.conditions{order:10;text-align:center;font-size:9px;margin-top:7px}.conditions p{text-align:left}.status{order:11;text-align:center;font-size:10px;margin-top:9px}.result-panel{order:7;margin-top:12px}.result .kicker{margin-top:19px;color:#254bff}.result .heading{font-size:22px}.result .visual{padding-top:13px!important;padding-bottom:6px!important}.result .wheel-wrap{max-width:163px!important}.result .visual:before{width:180px;height:180px}.result .visual:after{width:205px;height:205px}.result .hub{width:47px;height:47px;font-size:27px}.result .pin{width:23px;height:33px}.result .amount{font-size:61px!important}.result .intro{font-size:10px}.result .micro{margin-top:12px}.result .code{font-size:16px}.confetti{left:50%;top:40%;width:6px;height:11px}.won .offer{animation:cw-pop .6s ease-out}.spinning .pin{animation:none}.spinning .hub{box-shadow:0 0 0 8px #254bff10,0 4px 12px #11215628}.spinning .orbit-label{display:none}
@media(max-width:360px){.layout{padding:21px 20px 17px}.heading{font-size:22px}.wheel-wrap{max-width:222px!important}.visual:before{width:240px;height:240px}.visual:after{width:260px;height:260px}.brand{font-size:9px;letter-spacing:1px}}
@media(max-height:690px){.kicker{margin-top:16px}.wheel-wrap{max-width:210px!important}.visual:before{width:225px;height:225px}.visual:after{width:245px;height:245px}.amount{font-size:52px!important}.visual{padding-top:12px!important;padding-bottom:8px!important}.layout{padding-top:20px;padding-bottom:16px}}

@media(prefers-reduced-motion:reduce){dialog[open],.spinning .pin,.won .wheel-wrap,.confetti{animation:none}.primary{transition:none}.disk{transition:none!important}}
`;
  function init(options = {}) {
    destroy();
    const cfg = Object.assign({}, defaults, options);
    if (!cfg.enabled) return null;
    if (!document.body) {
      pendingReady = () => { pendingReady = null; init(options); };
      document.addEventListener('DOMContentLoaded', pendingReady, { once: true });
      return null;
    }
    let target;
    // EDITADO: a roleta exibe 5, 10, 15, 20, 25, 30
    cfg.prizes = [5, 10, 15, 20, 25, 30].map((d, i) => ({id: 'connect-' + i, discount: d, coupon: cfg.coupon}));
    try {
      if (!Array.isArray(cfg.prizes) || cfg.prizes.length < 4 || cfg.prizes.length > 8) throw Error('Configure de 4 a 8 faixas de desconto.');
      cfg.prizes = cfg.prizes.map(p => ({ id: String(p.id || ''), discount: Number(p.discount), coupon: String(p.coupon || '').trim() }));
      if (new Set(cfg.prizes.map(p => p.id)).size !== cfg.prizes.length || cfg.prizes.some(p => !p.id || !Number.isFinite(p.discount) || p.discount <= 0 || p.discount > 30)) throw Error('Use IDs únicos e descontos entre 0 e 30%, maiores que zero.');
      if (!cfg.demo) {
        if (cfg.prizes.some(p => !p.coupon) || !String(cfg.terms).trim()) throw Error('Preencha todos os cupons e as condições.');
        target = new URL(cfg.checkoutUrl);
        if (target.protocol !== 'https:' || target.username || target.password) throw Error('O checkout precisa de uma URL HTTPS válida.');
      }
      if (cfg.expiresAt && !Number.isFinite(Date.parse(cfg.expiresAt))) throw Error('Data de término inválida.');
      if (['delayMs','audienceRate','cooldownHours'].some(k => !Number.isFinite(Number(cfg[k])))) throw Error('Tempo e frequência devem ser números.');
    } catch (e) { console.warn('[ConnectWheel] Desativado: ' + e.message); return null; }
    const expired = () => Boolean(cfg.expiresAt && Date.now() >= Date.parse(cfg.expiresAt));
    if (expired()) return null;
    const max = 30;
    const prefix = 'connect-wheel:' + cfg.campaignId;
    const read = (kind, key) => { try { return JSON.parse(global[kind].getItem(prefix + ':' + key)); } catch { return null; } };
    const save = (kind, key, value) => { if (!cfg.demo) try { global[kind].setItem(prefix + ':' + key, JSON.stringify(value)); } catch {} };
    const fingerprint = JSON.stringify(cfg.prizes.map(p => [p.id, p.discount, p.coupon]));
    const saved = cfg.demo ? null : read('localStorage', 'result');
    let selected = saved && saved.fingerprint === fingerprint ? cfg.prizes.findIndex(p => p.id === saved.id) : -1;
    if (selected === null || selected === undefined) selected = -1;
    let resultVisible = selected >= 0, spinning = false, disposed = false, shown = false;
    let timer, spinTimer, expiryTimer, confettiTimer, previousFocus, previousOverflow = '', locked = false;
    let memorySession = cfg.demo ? null : read('sessionStorage', 'session');
    let memorySeen = 0;
    let audioContext = null, audioFrame = null, soundOn = cfg.sound !== false, lastTick = 0, lastSector = -1;
    const cleanups = [];
    const on = (el, type, fn, opts) => { el.addEventListener(type, fn, opts); cleanups.push(() => el.removeEventListener(type, fn, opts)); };
    function emit(name, extra = {}) {
      const detail = Object.assign({ event: name, campaignId: cfg.campaignId, demo: Boolean(cfg.demo) }, extra);
      global.dispatchEvent(new CustomEvent('connectwheel', { detail }));
      if (typeof cfg.onEvent === 'function') try { cfg.onEvent(detail); } catch {}
    }
    function session() {
      if (!memorySession || typeof memorySession.allowed !== 'boolean') {
        memorySession = { allowed: Math.random() < Math.max(0, Math.min(1, Number(cfg.audienceRate))), shown: false };
        save('sessionStorage', 'session', memorySession);
      }
      return memorySession;
    }
    const host = document.createElement('div'); host.setAttribute('data-connect-wheel', '');
    const root = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style'); style.textContent = css; root.append(style);
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-labelledby', 'cw-title'); dialog.setAttribute('aria-describedby', 'cw-intro');
    // EDITADO: Logo incluída na div brand
    dialog.innerHTML = `<div class="layout"><div class="celebration" aria-hidden="true"></div><button class="sound" type="button" aria-label="Desativar som" aria-pressed="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.07 4.93005C20.9447 6.80527 21.9979 9.34835 21.9979 12C21.9979 14.6517 20.9447 17.1948 19.07 19.0701" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="close" type="button" aria-label="Fechar roleta" autofocus>×</button><div class="content"><div class="brand"><img src="/portal/assets/logo.png" class="brand-logo" alt="Connect Academy" /></div><p class="kicker">UMA SURPRESA DA CONNECT</p><h2 class="heading" id="cw-title">Gire. Revele. <em>Aproveite.</em></h2><div class="offer"><strong class="amount">1</strong><span class="off">Tentativa</span></div><p class="intro" id="cw-intro">Explore mais de 30 milhões de produtos, encontre 1.500 fornecedores verificados e conecte-se ao maior grupo de networking do Brasil.</p><button type="button" class="primary spin"><span>Girar e desbloquear desconto</span><span class="arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block"><path d="M7 2L7 12M7 12L12 7M7 12L2 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-135 7 7)"/></svg></span></button><div class="result-panel" hidden><div class="coupon-row"><span class="code"></span><button class="copy" type="button">Copiar</button></div><a class="primary checkout"><span>Usar meu desconto</span><span class="arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block"><path d="M7 2L7 12M7 12L12 7M7 12L2 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-135 7 7)"/></svg></span></a></div><p class="micro">Revele a % de desconto em nossos cupons sorteados, são cupons limitados aproveite!</p><p class="demo" hidden>PRÉVIA · Cupons ilustrativos, sem validade.</p><details class="conditions"><summary><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Como funciona e condições</summary><p>Esta roleta revela uma oferta de até 30% OFF.</p><ul class="chance-list"></ul><p class="terms"></p></details><p class="status" role="status" aria-live="polite"></p></div><div class="visual"><span class="badge">CUPOM PREMIADO</span><div class="wheel-wrap"><div class="rim"></div><div class="disk" aria-hidden="true"></div><div class="hub" aria-hidden="true"></div><svg class="pin" viewBox="0 0 32 44" aria-hidden="true"><path d="M3 4Q16 -3 29 4L25 23L16 42L7 23Z" fill="#254bff" stroke="white" stroke-width="3"/><circle cx="16" cy="11" r="3" fill="white"/></svg></div><div class="orbit-label"><span>Um presente para o seu próximo passo.</span></div></div></div>`;
    root.append(dialog); document.body.append(host);
    const $ = s => root.querySelector(s);
    function updateSound(){ $('.sound').innerHTML=soundOn?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.07 4.93005C20.9447 6.80527 21.9979 9.34835 21.9979 12C21.9979 14.6517 20.9447 17.1948 19.07 19.0701" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 9L17 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 9L23 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; $('.sound').setAttribute('aria-label',soundOn?'Desativar som':'Ativar som'); $('.sound').setAttribute('aria-pressed',String(soundOn)); }
    function prepareAudio(){
      if(!soundOn)return;
      try{ const Audio=global.AudioContext||global.webkitAudioContext; if(!Audio)return; if(!audioContext)audioContext=new Audio(); if(audioContext.state==='suspended')audioContext.resume().catch(()=>{}); }catch{}
    }
    function tone(frequency,when,duration,volume,type='sine'){
      if(!soundOn||!audioContext||audioContext.state!=='running'||document.hidden||!dialog.open)return;
      try{const t=audioContext.currentTime+when,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,t);if(type==='triangle')osc.frequency.exponentialRampToValueAtTime(420,t+duration);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.004);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+duration+.01);osc.onended=()=>{osc.disconnect();gain.disconnect();};}catch{}
    }
    function tickFrame(now){
      if(disposed||!spinning||!dialog.open)return;
      const matrix=getComputedStyle($('.disk')).transform;
      if(matrix!=='none'){
          const values=matrix.slice(7,-1).split(',').map(Number);
          const angle=(Math.atan2(values[1],values[0])*180/Math.PI+360)%360;
          
          const offset = angle % 60;
          let pinAngle = 0;
          if (offset > 45) {
              pinAngle = -28 * ((offset - 45) / 15);
          } else if (offset < 8) {
              pinAngle = 12 * (1 - offset / 8);
          }
          $('.pin').style.transform = 'translateX(-50%) rotate(' + pinAngle + 'deg)';

          const sector=Math.floor(angle/60);
          if(sector!==lastSector&&now-lastTick>20){
              lastSector=sector;
              lastTick=now;
              tone(1450,0,.038,.04,'triangle');
              if(navigator.vibrate) navigator.vibrate(10);
          }
      }
      audioFrame=requestAnimationFrame(tickFrame);
    }
    function playSuccess(){[784,988,1175,1568].forEach((f,i)=>tone(f,i*.085,.42,.055));}
    function stopAudio(){cancelAnimationFrame(audioFrame);if(audioContext&&audioContext.state==='running')audioContext.suspend().catch(()=>{});}
    updateSound();
    on($('.sound'),'click',()=>{soundOn=!soundOn;updateSound();if(soundOn){prepareAudio();if(spinning)audioFrame=requestAnimationFrame(tickFrame);}else stopAudio();});
    
    
    $('.demo').hidden = !cfg.demo;
    $('.terms').textContent = cfg.terms || 'Demonstração visual. Configure seus cupons antes de publicar.';
    $('.chance-list').remove();
    const n = cfg.prizes.length, step = 360 / n;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', '0 0 360 360');
    const point = angle => { const a = (angle - 90) * Math.PI / 180; return [180 + 178 * Math.cos(a), 180 + 178 * Math.sin(a)]; };
    cfg.prizes.forEach((prize, i) => {
      const a = point(i * step), b = point((i + 1) * step), isMax = prize.discount === max;
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', `M180 180 L${a[0]} ${a[1]} A178 178 0 0 1 ${b[0]} ${b[1]}Z`);
      path.setAttribute('fill', ['#254bff','#8b5cf6','#f6a4c2','#f6ce6a','#6bd5bf','#78b8fa'][i]); path.setAttribute('stroke', '#fff'); path.setAttribute('stroke-width', '2'); svg.append(path);
      const g = document.createElementNS(svgNS, 'g'); g.setAttribute('transform', `rotate(${(i + .5) * step} 180 180)`);
      const text = document.createElementNS(svgNS, 'text'); text.setAttribute('x', '180'); text.setAttribute('y', '61'); text.setAttribute('text-anchor', 'middle'); text.setAttribute('fill', i < 2 ? '#fff' : '#19325e'); text.setAttribute('font-family', 'Manrope,Arial,sans-serif'); text.setAttribute('font-size', n > 6 ? '24' : '29'); text.setAttribute('font-weight', '700'); text.textContent = prize.discount + '%';
      const off = document.createElementNS(svgNS, 'text'); off.setAttribute('x','180'); off.setAttribute('y','80'); off.setAttribute('text-anchor','middle'); off.setAttribute('fill',i < 2 ? '#f1eaff' : '#28446b'); off.setAttribute('font-family','Arial,sans-serif'); off.setAttribute('font-size','10'); off.setAttribute('letter-spacing','2'); off.textContent='OFF'; g.append(text,off); svg.append(g);
    });
    $('.disk').append(svg);
    const angleFor = index => (360 - (index + .5) * step) % 360;
    function deepActive() { let el = document.activeElement; while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement; return el; }
    function busy() { const el = deepActive(); return document.hidden || Boolean(el && el.matches('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) || Boolean(document.querySelector('dialog[open],[role="dialog"][aria-modal="true"]')); }
    function eligible() {
      const s = session(), seen = Math.max(memorySeen, Number(read('localStorage', 'shown')) || 0);
      return !shown && !s.shown && s.allowed && (!seen || Date.now() - seen >= Math.max(0, Number(cfg.cooldownHours)) * 3600000) && !expired();
    }
    function confetti() {
      if (global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      for (let i = 0; i < 100; i++) {
        const p = document.createElement('span'); p.className = 'confetti';
        p.style.setProperty('--x', (Math.random() * 1000 - 500) + 'px'); p.style.setProperty('--y', (Math.random() * 600 - 200) + 'px'); p.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg'); p.style.setProperty('--delay', (Math.random() * .15) + 's'); p.style.setProperty('--color', ['#254bff','#9bb1ff','#6b87ff','#becaff','#d9b96d'][i % 5]); $('.celebration').append(p);
      }
      confettiTimer = setTimeout(() => $('.celebration').replaceChildren(), 1800);
    }
    function displayResult(celebrate) {
      if (selected < 0 || disposed) return;
      const prize = cfg.prizes[selected]; resultVisible = true; spinning = false; cancelAnimationFrame(audioFrame);
      $('.layout').classList.remove('spinning'); $('.layout').classList.add('result','won');
      $('.kicker').textContent = '✦ DESCONTO DESBLOQUEADO';
      $('.heading').textContent = 'Pronto. O desconto é seu!';
      $('.amount').textContent = prize.discount + '%'; $('.off').textContent = 'OFF';
      $('.intro').textContent = 'Copie seu cupom e dê o próximo passo com a Connect.';
      $('.spin').hidden = true; $('.result-panel').hidden = false;
      $('.code').textContent = prize.coupon || 'DEMO' + prize.discount;
      $('.badge').textContent = 'DESBLOQUEADO!';
      $('.orbit-label span').textContent = 'O próximo passo é seu.';
      if (cfg.demo || expired()) { $('.checkout').removeAttribute('href'); $('.checkout').setAttribute('aria-disabled','true'); $('.checkout').setAttribute('tabindex','0'); }
      else { $('.checkout').href = '#planos'; }
      $('.status').textContent = expired() ? 'Esta campanha terminou.' : 'Você recebeu ' + prize.discount + '% OFF. Cupom: ' + $('.code').textContent + '.';
      if (celebrate) { if(dialog.open){ confetti(); playSuccess(); } if (dialog.open) $('.copy').focus({ preventScroll:true }); emit('revealed',{discount:prize.discount,prizeId:prize.id}); }
    }
    function spin() {
      if (spinning || resultVisible || disposed || !dialog.open || expired()) return;
      // EDITADO: O desconto é sempre 30%, que é o último elemento do array cfg.prizes (índice 5).
      selected = 5; spinning = true; prepareAudio();
      save('localStorage','result',{id:cfg.prizes[selected].id,fingerprint});
      $('.spin').disabled = true; $('.spin span').textContent = 'Seu desconto está chegando…';
      $('.status').textContent = 'Roleta girando.'; $('.amount').textContent = '0'; $('.off').textContent = 'Tentativas'; $('.layout').classList.add('spinning');
      const ms = global.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 5600;
      $('.disk').style.transition = 'transform ' + ms + 'ms cubic-bezier(.12,.72,.13,1)';
      // Rotates multiple times and lands precisely on 'selected'
      $('.disk').style.transform = 'rotate(' + (2160 + angleFor(selected)) + 'deg)';
      spinTimer = setTimeout(() => displayResult(true), ms + 80);
      audioFrame = requestAnimationFrame(tickFrame); emit('spin_started');
    }
    function unlockScroll() { if (locked) { document.documentElement.style.overflow = previousOverflow; locked = false; } }
    function armExpiry() {
      if (!cfg.expiresAt || disposed) return;
      clearTimeout(expiryTimer); const remaining = Date.parse(cfg.expiresAt) - Date.now();
      if (remaining <= 0) { $('.checkout').removeAttribute('href'); $('.checkout').setAttribute('aria-disabled','true'); $('.spin').disabled=true; $('.status').textContent='Esta campanha terminou.'; }
      else expiryTimer = setTimeout(armExpiry, Math.min(2147483647,remaining));
    }
    function open({force=false} = {}) {
      if (disposed || expired() || dialog.open || (!force && (!eligible() || busy())) || typeof dialog.showModal !== 'function') return false;
      clearTimeout(timer); previousFocus=deepActive();
      if (previousFocus && typeof previousFocus.blur==='function') previousFocus.blur();
      previousOverflow=document.documentElement.style.overflow; document.documentElement.style.overflow='hidden'; locked=true;
      try { dialog.showModal(); } catch { unlockScroll(); return false; }
      $('.close').focus({preventScroll:true}); shown=true; memorySeen=Date.now();
      session().shown=true; save('sessionStorage','session',session()); save('localStorage','shown',memorySeen);
      armExpiry(); emit('shown',{trigger:force?'manual':'automatic'}); 
      if (!window.__cwSpinTimer) {
          window.__cwSpinTimer = setInterval(() => {
            if (spinning || resultVisible) { clearInterval(window.__cwSpinTimer); return; }
            const elapsed = performance.now();
            const btn = $('.spin');
            if(!btn) return;
            const span = btn.querySelector('span');
            if (elapsed < 30000) {
               btn.disabled = true;
               btn.style.opacity = '0.6';
               btn.style.cursor = 'not-allowed';
               span.textContent = 'Assista ao vídeo para girar (' + Math.ceil((30000 - elapsed)/1000) + 's)';
            } else {
               btn.disabled = false;
               btn.style.opacity = '1';
               btn.style.cursor = 'pointer';
               span.textContent = 'Girar e desbloquear desconto';
               clearInterval(window.__cwSpinTimer);
            }
          }, 500);
      }
      return true;
    }
    function close() { if (dialog.open) dialog.close(); unlockScroll(); stopAudio(); if(window.__cwSpinTimer) clearInterval(window.__cwSpinTimer); }
    on($('.close'),'click',close);
    on(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
    on(dialog,'close',()=>{unlockScroll(); stopAudio(); if(!disposed&&previousFocus&&previousFocus.isConnected&&typeof previousFocus.focus==='function')previousFocus.focus({preventScroll:true}); emit('closed');});
    on($('.spin'),'click',spin);
    on($('.copy'),'click',async()=>{
      try { await navigator.clipboard.writeText($('.code').textContent); if(disposed)return; $('.copy').textContent='Copiado ✓'; $('.status').textContent='Cupom copiado. Use no checkout.'; emit('copied'); }
      catch { $('.status').textContent='Selecione e copie o código acima.'; const selection=global.getSelection(); const range=document.createRange(); range.selectNodeContents($('.code')); if(selection){selection.removeAllRanges();selection.addRange(range);} }
    });
    on($('.checkout'),'click',e=>{if(cfg.demo||expired()){e.preventDefault();$('.status').textContent=cfg.demo?'Demonstração':'Esta campanha terminou.';return;}emit('checkout_clicked',{discount:cfg.prizes[selected].discount,prizeId:cfg.prizes[selected].id}); close();});
    const instance={open,close,destroy(){disposed=true;clearTimeout(timer);clearTimeout(spinTimer);clearTimeout(expiryTimer);clearTimeout(confettiTimer);stopAudio();if(audioContext)audioContext.close().catch(()=>{});const wasOpen=dialog.open;close();if(wasOpen&&previousFocus&&previousFocus.isConnected&&typeof previousFocus.focus==='function')previousFocus.focus({preventScroll:true});cleanups.forEach(fn=>fn());host.remove();if(current===instance)current=null;},getState(){return{open:dialog.open,spinning,revealed:resultVisible,discount:resultVisible&&selected>=0?cfg.prizes[selected].discount:null};}};
    current=instance;
    if(resultVisible){$('.disk').style.transform='rotate('+angleFor(selected)+'deg)';displayResult(false);}
    if(cfg.autoOpen){const attempt=()=>{if(disposed||!eligible())return;if(busy()){timer=setTimeout(attempt,1000);return;}open();};timer=setTimeout(attempt,Math.max(0,Number(cfg.delayMs)));emit('assigned',{variant:session().allowed?'wheel':'no_popup'});}
    return instance;
  }
  function destroy(){if(pendingReady){document.removeEventListener('DOMContentLoaded',pendingReady);pendingReady=null;}if(current)current.destroy();}
  global.ConnectWheel={init,open:options=>current?current.open(options):false,close:()=>current&&current.close(),destroy,getState:()=>current?current.getState():null};
  if(global.CONNECT_WHEEL_CONFIG)init(global.CONNECT_WHEEL_CONFIG);
})(window);
