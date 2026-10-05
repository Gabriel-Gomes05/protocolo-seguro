/* Esquadrão Sentinela — player interativo em modo cinema.
   Cada módulo chama Sentinela.modulo({...}) com o roteiro em passos; este arquivo
   interpreta os passos: cenas, falas, decisões ramificadas, desafios, quiz e resultado. */
(() => {
  const { ELENCO, CENARIOS, spriteDe, rostoDe } = window.SentinelaElenco;
  const SCORM = window.SentinelaSCORM;
  const params = new URLSearchParams(location.search);
  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- configuração white label ----------
  const CFG = (() => {
    const c = JSON.parse(JSON.stringify(window.SENTINELA_CONFIG || {}));
    for (const k of ['empresa', 'dominio', 'cor', 'logo']) if (params.get(k)) c[k] = params.get(k);
    c.empresa = c.empresa || 'Empresa';
    c.dominio = c.dominio || 'empresa.com.br';
    c.canal = Object.assign({ nome: 'Central Sentinela', como: '', email: '', telefone: '' }, c.canal);
    c.slug = c.empresa.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return c;
  })();
  if (CFG.cor) document.documentElement.style.setProperty('--cliente', CFG.cor);

  const txt = s => String(s ?? '')
    .replaceAll('[EMPRESA]', CFG.empresa)
    .replaceAll('[empresa]', CFG.slug)
    .replaceAll('[domínio oficial]', CFG.dominio)
    .replaceAll('[CANAL]', CFG.canal.nome);
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  // {{trecho|chave}} vira uma pista clicável; **texto** vira negrito.
  const marcar = s => esc(txt(s))
    .replace(/\{\{(.+?)\|(.+?)\}\}/g, '<span class="pista" data-pista="$2">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const paragrafos = s => String(s || '').split('\n').filter(Boolean).map(p => `<p>${marcar(p)}</p>`).join('');
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const logoHTML = () => CFG.logo ? `<img src="${esc(CFG.logo)}" alt="">` : `<span>${esc(CFG.empresa[0])}</span>`;

  // ---------- relógio (pausa congela tudo) ----------
  const estado = { pausado: false, avanco: new Set(), selos: [], escolhas: [], inicio: Date.now(), cena: null, trecho: 0 };

  function esperar(ms, pulavel = false) {
    return new Promise(resolve => {
      let acumulado = 0, anterior = performance.now(), fim = false;
      const sair = () => { if (!fim) { fim = true; estado.avanco.delete(sair); resolve(); } };
      if (pulavel) estado.avanco.add(sair);
      const passo = agora => {
        if (fim) return;
        if (!estado.pausado) acumulado += agora - anterior;
        anterior = agora;
        if (acumulado >= ms) sair(); else requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }
  const aguardarAvanco = () => new Promise(r => { const f = () => { estado.avanco.delete(f); r(); }; estado.avanco.add(f); });
  function avancar() { [...estado.avanco].forEach(f => f()); }

  // ---------- efeitos sonoros sintetizados ----------
  const Som = {
    ctx: null, ligado: params.get('som') !== '0',
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    },
    tom(freq, dur = 0.15, { tipo = 'sine', vol = 0.12, atraso = 0, ate = null } = {}) {
      if (!this.ligado || !this.ctx || estado.pausado) return;
      const t = this.ctx.currentTime + atraso;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = tipo; o.frequency.setValueAtTime(freq, t);
      if (ate) o.frequency.exponentialRampToValueAtTime(ate, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(this.ctx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    },
    acerto() { this.tom(660, .12, { tipo: 'triangle' }); this.tom(990, .18, { tipo: 'triangle', atraso: .09 }); },
    erro() { this.tom(220, .22, { tipo: 'square', vol: .06, ate: 150 }); },
    clique() { this.tom(520, .05, { tipo: 'triangle', vol: .06 }); },
    notificacao() { this.tom(880, .1, { vol: .1 }); this.tom(1320, .14, { vol: .08, atraso: .1 }); },
    alerta() { for (let i = 0; i < 3; i++) { this.tom(740, .16, { tipo: 'sawtooth', vol: .05, atraso: i * .32 }); this.tom(560, .16, { tipo: 'sawtooth', vol: .05, atraso: i * .32 + .16 }); } },
    tique() { this.tom(1200, .03, { tipo: 'square', vol: .03 }); },
    rebobinar() { this.tom(900, .9, { tipo: 'sawtooth', vol: .04, ate: 2400 }); },
    selo() { [523, 659, 784].forEach((f, i) => this.tom(f, .2, { tipo: 'triangle', atraso: i * .08 })); },
    fanfarra() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tom(f, i > 3 ? .5 : .18, { tipo: 'triangle', vol: .11, atraso: i * .13 })); },
    linha() { this.tom(1800, .12, { tipo: 'square', vol: .04, ate: 300 }); },
    whoosh() { this.tom(300, .35, { tipo: 'sawtooth', vol: .03, ate: 80 }); }
  };

  // ---------- vozes (gravadas quando houver; senão a voz do navegador) ----------
  const FEMININAS = ['lupa', 'forca', 'trava', 'iris'];
  const PERFIL_VOZ = {
    narrador: { pitch: .9, rate: .98 }, lupa: { pitch: 1.05, rate: 1.04 }, isca: { pitch: 1.15, rate: 1.08 },
    forca: { pitch: .6, rate: .92 }, trava: { pitch: .8, rate: .95 }, iris: { pitch: 1.1, rate: 1 },
    eco: { pitch: 1, rate: .97 }, camaleao: { pitch: 1.05, rate: 1.05 }, vazamento: { pitch: .7, rate: .9 }
  };
  const Voz = {
    ligada: params.get('voz') !== '0', tts: 'speechSynthesis' in window, fem: null, masc: null, audio: null, base: '',
    init(moduloId) {
      this.base = (CFG.vozes || {})[moduloId] || '';
      if (!this.tts) return;
      const escolher = () => {
        const pt = speechSynthesis.getVoices().filter(v => /^pt[-_]BR/i.test(v.lang) || /portugu.s.*bras/i.test(v.name));
        const nat = v => /natural|online|neural/i.test(v.name) ? 0 : 1;
        pt.sort((a, b) => nat(a) - nat(b));
        const f = /maria|francisca|thalita|luciana|fernanda|raquel|leila|vit[oó]ria|brenda|giovanna|let[ií]cia|manuela|yara|elza|helo[ií]sa|google/i;
        const m = /daniel|ant[oô]nio|donato|f[aá]bio|humberto|j[uú]lio|nicolau|val[eé]rio/i;
        this.fem = pt.find(v => f.test(v.name)) || pt[0] || null;
        this.masc = pt.find(v => m.test(v.name)) || pt.find(v => v !== this.fem) || this.fem;
      };
      escolher();
      speechSynthesis.onvoiceschanged = escolher;
    },
    falar(texto, id, quem) {
      if (!this.ligada) return null;
      if (this.base && id) {
        return new Promise(resolve => {
          const a = new Audio(`${this.base}${id}.mp3`);
          this.audio = a;
          a.onended = () => resolve();
          a.onerror = () => { this.audio = null; (this.sintetizar(texto, quem) || Promise.resolve()).then(resolve); };
          a.play().catch(() => a.onerror());
        });
      }
      return this.sintetizar(texto, quem);
    },
    sintetizar(texto, quem) {
      if (!this.tts || !(this.fem || this.masc)) return null;
      speechSynthesis.cancel();
      return new Promise(resolve => {
        const u = new SpeechSynthesisUtterance(texto);
        u.voice = FEMININAS.includes(quem) ? this.fem : this.masc;
        u.lang = 'pt-BR';
        Object.assign(u, PERFIL_VOZ[quem] || {});
        u.onend = u.onerror = () => resolve();
        speechSynthesis.speak(u);
      });
    },
    cancelar() {
      if (this.audio) { this.audio.pause(); this.audio = null; }
      if (this.tts) speechSynthesis.cancel();
    },
    pausar(p) {
      if (this.audio) p ? this.audio.pause() : this.audio.play().catch(() => {});
      if (this.tts) p ? speechSynthesis.pause() : speechSynthesis.resume();
    }
  };
  // Texto para a voz: [EMPRESA] vira o nome; números simples ficam com a voz.
  const textoVoz = s => txt(s).replace(/[“”"*]/g, '');

  // ---------- estrutura da página ----------
  let M; // módulo atual
  let ui = {};

  function montar() {
    document.body.classList.add('modo-cinema');
    const raiz = el('div', 'player');
    raiz.id = 'player';
    raiz.innerHTML = `
      <div class="palco" id="palco">
        <div class="cenarios"></div>
        <div class="atores"></div>
        <div class="tela-camada"></div>
        <div class="notas" aria-live="polite"></div>
        <div class="efeito"></div>
      </div>
      <div class="faixa faixa-topo"></div><div class="faixa faixa-base"></div>
      <header class="barra">
        <div class="barra-marca"><span class="logo-cliente">${logoHTML()}</span><div><small>ESQUADRÃO SENTINELA · MÓDULO ${M.numero}</small><b>${esc(M.titulo)}</b></div></div>
        <div class="barra-trecho" id="trecho-nome"></div>
        <div class="barra-acoes">
          <span class="selos-contador" id="selos-contador" title="Selos ganhos">★ 0</span>
          <button type="button" id="b-pausa" title="Pausar (Espaço)" aria-label="Pausar">❚❚</button>
          <button type="button" id="b-som" title="Efeitos sonoros (M)" aria-label="Efeitos sonoros">♪</button>
          <button type="button" id="b-voz" title="Narração (V)" aria-label="Narração">🗣</button>
          <a class="b-sair" id="b-sair" href="index.html" title="Voltar ao QG" aria-label="Voltar ao QG">✕</a>
        </div>
        <div class="progresso"><i id="progresso"></i></div>
      </header>
      <div class="legenda" id="legenda" hidden>
        <div class="legenda-rosto"></div>
        <div class="legenda-corpo"><span class="legenda-quem"></span><p></p></div>
        <span class="legenda-dica">clique ou Enter para avançar</span>
      </div>
      <div class="camada" id="camada"></div>
      <div class="selo-toast" id="selo-toast" aria-live="polite"></div>
      <div class="pausado-aviso" id="pausado-aviso" hidden><b>Pausado</b><span>Espaço para continuar</span></div>`;
    document.body.appendChild(raiz);
    ui = {
      raiz, palco: $('#palco'), cenarios: $('.cenarios', raiz), atores: $('.atores', raiz), tela: $('.tela-camada', raiz),
      notas: $('.notas', raiz), efeito: $('.efeito', raiz), legenda: $('#legenda'), camada: $('#camada'),
      trecho: $('#trecho-nome'), progresso: $('#progresso'), selos: $('#selos-contador'), toast: $('#selo-toast')
    };
    if (SCORM.emLMS) $('#b-sair').hidden = true;
    $('#b-pausa').onclick = () => pausar(!estado.pausado);
    $('#b-som').onclick = () => alternar('som');
    $('#b-voz').onclick = () => alternar('voz');
    atualizarBotoes();
    ui.palco.addEventListener('click', e => { if (!e.target.closest('button, a, .pista, .t-email-link')) avancar(); });
    ui.legenda.addEventListener('click', avancar);
    document.addEventListener('keydown', teclado);
  }

  function atualizarBotoes() {
    $('#b-som').classList.toggle('desligado', !Som.ligado);
    $('#b-voz').classList.toggle('desligado', !Voz.ligada);
    $('#b-pausa').textContent = estado.pausado ? '▶' : '❚❚';
  }
  function alternar(qual) {
    if (qual === 'som') Som.ligado = !Som.ligado;
    else { Voz.ligada = !Voz.ligada; if (!Voz.ligada) Voz.cancelar(); }
    atualizarBotoes();
  }
  function pausar(p) {
    estado.pausado = p;
    ui.raiz.classList.toggle('pausado', p);
    $('#pausado-aviso').hidden = !p;
    Voz.pausar(p);
    atualizarBotoes();
  }
  function teclado(e) {
    const alvo = e.target.closest ? e.target.closest('button, input, a') : null;
    if (e.key === ' ' && !alvo) { e.preventDefault(); pausar(!estado.pausado); return; }
    if (estado.pausado) return;
    const k = e.key.toLowerCase();
    if (k === 'm') alternar('som');
    else if (k === 'v') alternar('voz');
    else if ((e.key === 'Enter' || e.key === 'ArrowRight') && !alvo) avancar();
    else {
      const idx = { a: 0, b: 1, c: 2, 1: 0, 2: 1, 3: 2 }[k];
      if (idx != null) { const b = ui.camada.querySelectorAll('[data-opcao]')[idx]; if (b) b.click(); }
    }
  }

  // ---------- cenas, atores e telas ----------
  function cena(nome) {
    if (estado.cena === nome) return;
    estado.cena = nome;
    const antigo = ui.cenarios.firstElementChild;
    const novo = el('div', `cenario cn-${nome}`);
    const img = (CFG.cenarios || {})[nome];
    novo.innerHTML = img ? `<img class="cn-arte" src="${esc(img)}" alt="">` : (CENARIOS[nome] || (() => ''))();
    novo.querySelectorAll('[data-empresa]').forEach(e => { e.textContent = CFG.empresa; });
    novo.querySelectorAll('[data-canal]').forEach(e => { e.textContent = CFG.canal.nome; });
    ui.cenarios.appendChild(novo);
    requestAnimationFrame(() => novo.classList.add('visivel'));
    if (antigo) setTimeout(() => antigo.remove(), 700);
  }

  function atores(lista) {
    const vistos = new Set();
    (lista || []).forEach(a => {
      vistos.add(a.id);
      let e = ui.atores.querySelector(`[data-ator="${a.id}"]`);
      if (!e) {
        e = el('div', 'ator entrando');
        e.dataset.ator = a.id;
        ui.atores.appendChild(e);
        requestAnimationFrame(() => requestAnimationFrame(() => e.classList.remove('entrando')));
      }
      e.dataset.lado = a.lado || 'direita';
      e.style.setProperty('--escala', a.escala || 1);
      e.classList.toggle('espelhado', !!a.espelhar);
      definirPose(e, a.id, a.pose);
    });
    ui.atores.querySelectorAll('.ator').forEach(e => {
      if (!vistos.has(e.dataset.ator) && !e.classList.contains('saindo')) {
        e.classList.add('saindo');
        setTimeout(() => e.remove(), 500);
      }
    });
  }
  function definirPose(e, id, pose) {
    const p = pose || 'frente';
    if (e.dataset.pose === p) return;
    e.dataset.pose = p;
    e.className = e.className.replace(/\bpose-\S+/g, '').trim() + ` pose-${p}`;
    e.innerHTML = spriteDe(id, p);
  }

  const celular = (html, extra = '') => `<div class="t-celular ${extra}"><div class="t-celular-notch"></div><div class="t-celular-tela">${html}</div></div>`;
  const navegador = (url, html, falso) => `<div class="t-navegador"><div class="t-nav-barra"><i></i><i></i><i></i><span class="t-url ${falso ? 'falso' : ''}">${falso ? '⚠' : '🔒'} ${esc(txt(url))}</span></div>${html}</div>`;

  const TELAS = {
    email: t => `<article class="t-email">
        <div class="t-email-barra"><span>Caixa de entrada · ${esc(CFG.empresa)}</span><span>${esc(t.hora || 'agora')}</span></div>
        <div class="t-email-de"><span class="t-av">${esc(txt(t.de).replace(/\{\{|\}\}/g, '')[0] || '?')}</span><div><b>${marcar(t.de)}</b><small>${marcar(t.endereco)}</small></div></div>
        <h3 class="t-email-assunto">${marcar(t.assunto)}</h3>
        <div class="t-email-corpo">${paragrafos(t.corpo)}</div>
        ${t.link ? `<div class="t-email-link"><span class="t-botao-link">${marcar(t.link.texto)}</span><span class="t-url-real">${esc(txt(t.link.real))}</span></div>` : ''}
        ${t.anexo ? `<div class="t-anexo"><span class="t-clip">⎘</span> ${marcar(t.anexo)}</div>` : ''}
      </article>`,
    chat: t => {
      const corpo = `<div class="t-chat ${t.app || ''}"><div class="t-chat-topo"><span class="t-av">${esc(txt(t.titulo)[0] || '?')}</span><div><b>${marcar(t.titulo)}</b><small>${marcar(t.sub || '')}</small></div></div>
        <div class="t-msgs">${(t.msgs || []).map((m, i) => `<div class="t-msg ${m.de || 'eles'}" style="--i:${i}">${marcar(m.texto)}<small>${esc(m.hora || '')}</small></div>`).join('')}</div></div>`;
      return t.celular === false ? `<div class="t-janela-chat">${corpo}</div>` : celular(corpo);
    },
    login: t => navegador(t.url, `<div class="t-login ${t.falso ? 'falso' : ''}"><div class="t-login-logo">${logoHTML()}<b>${esc(CFG.empresa)}</b></div><h4>${marcar(t.titulo || 'Acesse sua conta')}</h4>
        <label>Usuário<span class="t-campo ${t.digitando ? 'digitando' : ''}">${esc(txt(t.usuario || 'seu.nome'))}</span></label>
        <label>Senha<span class="t-campo senha ${t.digitando ? 'digitando d2' : ''}">••••••••••</span></label>
        <span class="t-botao">Entrar</span></div>`, t.falso),
    senha: t => navegador(t.url || 'https://intranet.[empresa].com.br/senha', `<div class="t-login"><div class="t-login-logo">${logoHTML()}<b>${esc(CFG.empresa)}</b></div><h4>${marcar(t.titulo || 'Sua senha expirou')}</h4><p class="t-sub">${marcar(t.sub || 'Crie uma nova senha para continuar.')}</p>
        <label>Nova senha<span class="t-campo ${t.valor ? 'digitando' : ''}">${esc(txt(t.valor || ''))}</span></label>
        <div class="t-forca f${t.forca ?? 0}"><i></i><i></i><i></i><i></i><small>${esc(['', 'Fraca', 'Média', 'Boa', 'Forte'][t.forca ?? 0])}</small></div>
        <span class="t-botao">Salvar</span></div>`),
    tentativas: t => `<div class="t-terminal"><div class="t-terminal-topo">${marcar(t.titulo || 'ataque.exe')}</div>
        ${(t.linhas || []).map((l, i) => `<div class="t-linha ${l.ok ? 'ok' : ''}" style="--i:${i}"><span>${l.ok ? '✔' : '✖'}</span> ${marcar(l.texto)}</div>`).join('')}</div>`,
    cartao: t => celular(`<div class="t-form-cartao"><div class="t-loja-topo">${marcar(t.titulo || 'Correios Entregas')}</div><p class="t-sub">${marcar(t.sub || 'Taxa de reentrega: R$ 4,90')}</p>
        ${['Nome no cartão', 'Número do cartão', 'Validade', 'Código de segurança'].map((c, i) => `<label>${c}<span class="t-campo digitando" style="--d:${i * .5}s">${['MARIA S. COSTA', '5412 •••• •••• 8831', '08/29', '•••'][i]}</span></label>`).join('')}
        <span class="t-botao">Pagar R$ 4,90</span></div>`),
    app: t => celular(`<div class="t-app"><div class="t-loja-topo">${marcar(t.titulo || 'Minha Loja')}</div><div class="t-pedido"><small>${marcar(t.pedido || 'Pedido #48213')}</small><b>${marcar(t.status || 'Em trânsito')}</b>
        <div class="t-trilha"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></div><p>${marcar(t.texto || 'Nenhuma pendência. Nenhuma taxa a pagar.')}</p></div></div>`),
    push: t => celular(`<div class="t-push-fundo"><div class="t-push"><small>${esc(CFG.empresa)} Autenticador · agora</small><b>${marcar(t.titulo || 'Aprovar login?')}</b><p>${marcar(t.texto || '').replace(/\n/g, '<br>')}</p>
        <div class="t-push-botoes"><span>Negar</span><span>Aprovar</span></div>${t.contador ? `<span class="t-push-badge">${esc(t.contador)}</span>` : ''}</div></div>`, 'escuro'),
    chamada: t => celular(`<div class="t-chamada"><small>${marcar(t.status || 'Chamada recebida')}</small><b>${marcar(t.nome || 'Número desconhecido')}</b><span>${marcar(t.numero || '')}</span>
        <div class="t-chamada-botoes"><i class="desliga">✆</i><i class="atende">✆</i></div></div>`, 'escuro'),
    planilha: t => `<div class="t-planilha ${t.vazando ? 'vazando' : ''}"><div class="t-planilha-topo">${marcar(t.titulo || 'clientes.xlsx')}</div>
        <table><thead><tr>${t.colunas.map((c, i) => `<th class="${(t.ocultas || []).includes(i) ? 'oculta' : ''}">${marcar(c)}</th>`).join('')}</tr></thead>
        <tbody>${t.linhas.map(l => `<tr>${l.map((c, i) => `<td class="${(t.ocultas || []).includes(i) ? 'oculta' : ''}">${marcar(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
        ${t.vazando ? '<div class="t-gosma"></div>' : ''}</div>`,
    alerta: t => `<div class="t-alerta ${t.cor || ''}"><div class="t-alerta-icone">!</div><div><small>${esc(CFG.canal.nome)}</small><b>${marcar(t.titulo)}</b><p>${marcar(t.texto || '')}</p></div></div>`,
    aviso: t => `<div class="t-aviso ${t.cor || ''}">${t.icone ? `<div class="t-aviso-icone">${esc(t.icone)}</div>` : ''}<b>${marcar(t.titulo)}</b>${t.texto ? `<p>${marcar(t.texto)}</p>` : ''}</div>`,
    telao: t => `<div class="t-telao"><small>${esc(t.rotulo || CFG.canal.nome)}</small><h3>${marcar(t.titulo)}</h3><ol>${t.itens.map(i => `<li>${marcar(i)}</li>`).join('')}</ol>
        ${t.canal ? `<div class="t-canal-mini">${canalHTML()}</div>` : ''}</div>`,
    canal: () => `<div class="t-canal">${canalHTML()}</div>`
  };
  function canalHTML() {
    const c = CFG.canal;
    return `<small>VIU ALGO ESTRANHO? REPORTE</small><b>${esc(c.nome)}</b><ul>${[c.como, c.email, c.telefone].filter(Boolean).map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  }

  function tela(spec) {
    ui.notas.innerHTML = '';
    ui.tela.querySelectorAll('.tela:not(.saindo)').forEach(antiga => { antiga.classList.add('saindo'); setTimeout(() => antiga.remove(), 350); });
    ui.palco.classList.toggle('foco', !!(spec && spec.foco));
    if (!spec) return;
    const caixa = el('div', `tela tela-${spec.tipo} ${spec.posicao ? 'pos-' + spec.posicao : ''} ${spec.foco ? 'foco' : ''}`, TELAS[spec.tipo](spec));
    ui.tela.appendChild(caixa);
    if (['chat', 'push', 'chamada'].includes(spec.tipo) && spec.som !== false) Som.notificacao();
  }

  function destacar(passo) {
    const caixa = ui.tela.querySelector('.tela:not(.saindo)');
    if (!caixa) return;
    const chaves = passo.destacar === 'todas' ? [...caixa.querySelectorAll('.pista')].map(p => p.dataset.pista) : [String(passo.destacar)];
    chaves.forEach(ch => caixa.querySelectorAll(`.pista[data-pista="${ch}"]`).forEach((p, i) => {
      p.classList.add('marcada');
      if (i === 0 && !p.querySelector('.pista-num')) p.insertAdjacentHTML('afterbegin', `<i class="pista-num">${esc(ch)}</i>`);
      if (p.closest('.t-email-link')) caixa.classList.add('mostrar-url');
    }));
    caixa.classList.add('com-destaques');
    if (passo.nota) {
      const n = el('div', 'nota', marcar(passo.nota));
      ui.notas.appendChild(n);
      Som.clique();
    }
    if (passo.limparNotas) ui.notas.innerHTML = '';
  }

  // ---------- legendas e falas ----------
  function legenda(quem, texto, o = {}) {
    const p = ELENCO[quem] || { nome: quem };
    ui.legenda.hidden = false;
    ui.legenda.className = `legenda fala-${quem}`;
    ui.legenda.style.setProperty('--cor', p.cor || '#9fb3c8');
    $('.legenda-rosto', ui.legenda).innerHTML = rostoDe(quem, o.rosto);
    $('.legenda-quem', ui.legenda).textContent = quem === 'narrador' ? '' : p.nome.toUpperCase();
    $('p', ui.legenda).innerHTML = marcar(texto);
  }

  function leitura(texto) { return Math.min(9000, Math.max(1900, txt(texto).length * 58 + 900)); }

  async function fala(f) {
    legenda(f.quem, f.texto, f);
    const ator = ui.atores.querySelector(`[data-ator="${f.quem}"]`);
    if (ator && f.pose) definirPose(ator, f.quem, f.pose);
    ui.atores.querySelectorAll('.ator').forEach(a => a.classList.toggle('falando', a === ator));
    const voz = Voz.falar(textoVoz(f.voz || f.texto), f.id, f.quem);
    const minimo = esperar(Math.min(900, leitura(f.texto)));
    if (voz) {
      await Promise.race([Promise.all([voz, minimo]).then(() => esperar(320)), esperar(leitura(f.texto) * 2.4), aguardarAvanco()]);
    } else {
      await Promise.race([esperar(leitura(f.texto)), aguardarAvanco()]);
    }
    Voz.cancelar();
    if (ator) ator.classList.remove('falando');
  }

  // ---------- selos, efeitos e insígnia ----------
  function selo(nome) {
    if (!estado.selos.includes(nome)) estado.selos.push(nome);
    ui.selos.textContent = `★ ${estado.selos.length}`;
    ui.toast.innerHTML = `<span class="selo-icone">★</span><div><small>SELO CONQUISTADO</small><b>${esc(nome)}</b></div>`;
    ui.toast.classList.remove('mostra'); void ui.toast.offsetWidth; ui.toast.classList.add('mostra');
    Som.selo();
  }

  async function efeito(nome) {
    const fx = ui.efeito;
    if (nome === 'rebobinar') {
      Som.rebobinar();
      fx.className = 'efeito rebobinar'; fx.innerHTML = '<b>◀◀ REBOBINANDO</b>';
      await esperar(1700);
      fx.className = 'efeito'; fx.innerHTML = '';
    } else if (nome === 'flash') {
      fx.className = 'efeito flash'; await esperar(450); fx.className = 'efeito';
    } else if (nome === 'tremer') {
      ui.palco.classList.add('tremer'); await esperar(600); ui.palco.classList.remove('tremer');
    } else if (nome === 'alerta') {
      Som.alerta(); ui.cenarios.lastElementChild?.classList.add('em-alerta');
    } else if (nome === 'janelas') {
      const js = [...ui.cenarios.querySelectorAll('.janela:not(.acesa)')];
      for (let i = js.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [js[i], js[j]] = [js[j], js[i]]; }
      for (const j of js) { j.classList.add('acesa', 'reporte'); if (Math.random() < .3) Som.tique(); await esperar(reduzirMovimento ? 10 : 70); }
    } else if (nome === 'linha') {
      Som.linha();
    }
  }

  async function insignia() {
    const h = ELENCO[M.heroi];
    Som.fanfarra();
    const c = ui.camada;
    c.className = 'camada ativa insignia-camada';
    c.innerHTML = `<div class="insignia-grande" style="--cor:${h.cor}">${iconeInsignia(M.insignia.icone)}<small>INSÍGNIA</small><b>${esc(M.insignia.nome)}</b></div>`;
    await Promise.race([esperar(3200), aguardarAvanco()]);
    fecharCamada();
  }

  function iconeInsignia(nome) {
    const icones = {
      lupa: '<circle cx="42" cy="42" r="20" fill="none" stroke="currentColor" stroke-width="7"/><path d="M57 57 L76 76" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>',
      cadeado: '<rect x="24" y="44" width="52" height="38" rx="7" fill="currentColor"/><path d="M34 44 V32 a16 16 0 0 1 32 0 V44" fill="none" stroke="currentColor" stroke-width="7"/><circle cx="50" cy="60" r="5" fill="#0b1220"/>',
      cofre: '<rect x="20" y="22" width="60" height="58" rx="8" fill="none" stroke="currentColor" stroke-width="7"/><circle cx="50" cy="51" r="13" fill="none" stroke="currentColor" stroke-width="6"/><path d="M50 38v-6M50 70v-6M37 51h-6M69 51h-6" stroke="currentColor" stroke-width="5"/>',
      ondas: '<circle cx="34" cy="50" r="9" fill="currentColor"/><path d="M50 32 q14 18 0 36 M62 22 q24 28 0 56 M74 14 q32 36 0 72" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>'
    };
    return `<svg class="insignia-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 L90 20 V52 C90 74 72 88 50 96 C28 88 10 74 10 52 V20 Z" fill="var(--cor)" stroke="#f3d27a" stroke-width="4"/><g transform="translate(18 16) scale(.64)" color="#fff">${icones[nome] || icones.lupa}</g></svg>`;
  }

  // ---------- camada interativa ----------
  function abrirCamada(cls, html) {
    const c = ui.camada;
    c.className = `camada ativa ${cls}`;
    c.innerHTML = html;
    ui.legenda.hidden = true;
    return c;
  }
  function fecharCamada() { ui.camada.className = 'camada'; ui.camada.innerHTML = ''; }

  async function decisao(d) {
    Voz.cancelar();
    const letras = ['A', 'B', 'C', 'D'];
    const c = abrirCamada('decisao-camada', `<div class="decisao ${d.tempo ? 'rapida' : ''}">
        <p class="decisao-rotulo">${d.tempo ? 'DECIDA RÁPIDO' : 'SUA DECISÃO'}</p><h2>${marcar(d.pergunta)}</h2>
        ${d.tempo ? '<div class="cronometro"><i></i><span></span></div>' : ''}
        <div class="opcoes">${d.opcoes.map((o, i) => `<button type="button" class="opcao" data-opcao="${i}"><span class="tecla">${letras[i]}</span><span>${marcar(o.texto)}</span></button>`).join('')}</div></div>`);
    Som.notificacao();
    const escolha = await new Promise(resolve => {
      let feito = false;
      const escolher = (i, porTempo) => { if (feito) return; feito = true; resolve({ i, porTempo }); };
      c.querySelectorAll('[data-opcao]').forEach(b => b.addEventListener('click', () => { Som.init(); Som.clique(); escolher(Number(b.dataset.opcao), false); }));
      if (d.tempo) {
        const barra = $('.cronometro i', c), num = $('.cronometro span', c);
        let resta = d.tempo * 1000, anterior = performance.now(), ultimo = d.tempo;
        const passo = agora => {
          if (feito) return;
          if (!estado.pausado) resta -= agora - anterior;
          anterior = agora;
          barra.style.transform = `scaleX(${Math.max(0, resta / (d.tempo * 1000))})`;
          const s = Math.ceil(Math.max(0, resta) / 1000);
          num.textContent = `${s}s`;
          if (s !== ultimo) { ultimo = s; Som.tique(); }
          if (resta <= 0) escolher(d.padrao ?? 0, true); else requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      }
    });
    const o = d.opcoes[escolha.i];
    c.querySelectorAll('[data-opcao]').forEach((b, i) => { b.disabled = true; b.classList.toggle('escolhida', i === escolha.i); });
    if (escolha.porTempo) $('.decisao-rotulo', c).textContent = 'O TEMPO ACABOU';
    estado.escolhas.push({ pergunta: txt(d.pergunta), resposta: txt(o.texto).replace(/\{\{|\}\}|\|\w+/g, ''), boa: !!o.boa, porTempo: escolha.porTempo });
    await esperar(escolha.porTempo ? 1200 : 650);
    fecharCamada();
    if (o.selo) selo(o.selo);
    await rodar(o.passos || []);
  }

  // Desafio "pistas": clicar nos sinais escondidos numa mensagem.
  async function desafioPistas(d) {
    Voz.cancelar();
    const total = Object.keys(d.sinais).length;
    const c = abrirCamada('desafio-camada', `<div class="desafio">
        <div class="desafio-topo"><div><p class="decisao-rotulo">DESAFIO · ${marcar(d.titulo)}</p><h2>${marcar(d.instrucao)}</h2></div><div class="placar"><b>0</b>/${total}</div></div>
        <div class="desafio-corpo"><div class="desafio-msg tela">${TELAS[d.mensagem.tipo](d.mensagem)}</div>
        <ul class="desafio-lista">${Object.entries(d.sinais).map(([k, s]) => `<li data-sinal="${k}"><span class="check">?</span><div><b>${marcar(s.nome)}</b><small>${marcar(s.explica)}</small></div></li>`).join('')}</ul></div>
        <p class="desafio-erros" aria-live="polite"></p></div>`);
    let achados = 0, erros = 0;
    await new Promise(resolve => {
      c.querySelector('.desafio-msg').addEventListener('click', e => {
        const p = e.target.closest('.pista');
        if (p && !p.classList.contains('achada')) {
          const k = p.dataset.pista;
          c.querySelectorAll(`.pista[data-pista="${k}"]`).forEach(x => x.classList.add('achada'));
          const li = c.querySelector(`[data-sinal="${k}"]`);
          li.classList.add('achado'); $('.check', li).textContent = '✔';
          achados++; Som.acerto();
          $('.placar b', c).textContent = achados;
          if (achados === total) setTimeout(resolve, 900);
        } else if (!p) {
          erros++; Som.erro();
          const msg = $('.desafio-erros', c);
          msg.textContent = erros >= 3 ? 'Dica: os sinais que faltam estão piscando.' : 'Aí não tem sinal de golpe. Olhe de novo.';
          if (erros >= 3) c.querySelectorAll('.pista:not(.achada)').forEach(x => x.classList.add('dica'));
        }
      });
    });
    estado.desafios = (estado.desafios || 0) + 1;
    await esperar(400);
    fecharCamada();
  }

  // Desafio "classificar": decidir em que grupo cada item entra.
  async function desafioClassificar(d) {
    Voz.cancelar();
    const c = abrirCamada('desafio-camada', `<div class="desafio classificar">
        <div class="desafio-topo"><div><p class="decisao-rotulo">DESAFIO · ${marcar(d.titulo)}</p><h2>${marcar(d.instrucao)}</h2></div><div class="placar"><b>0</b>/${d.itens.length}</div></div>
        <div class="classificar-palco"><div class="item-carta"></div><div class="grupos">${d.grupos.map((g, i) => `<button type="button" class="grupo g${i}" data-opcao="${i}" data-grupo="${g.id}"><span class="tecla">${'ABC'[i]}</span>${marcar(g.nome)}</button>`).join('')}</div>
        <p class="classificar-retorno" aria-live="polite"></p></div>
        <div class="trilha-itens">${d.itens.map(() => '<i></i>').join('')}</div></div>`);
    let acertos = 0;
    for (let n = 0; n < d.itens.length; n++) {
      const it = d.itens[n];
      const carta = $('.item-carta', c);
      carta.className = 'item-carta entra';
      carta.innerHTML = `<span>${marcar(it.texto)}</span>${it.sub ? `<small>${marcar(it.sub)}</small>` : ''}`;
      $('.classificar-retorno', c).textContent = '';
      c.querySelectorAll('.grupo').forEach(b => { b.disabled = false; b.classList.remove('certo', 'errado'); });
      const escolhido = await new Promise(r => c.querySelectorAll('.grupo').forEach(b => { b.onclick = () => r(b.dataset.grupo); }));
      const ok = escolhido === it.grupo;
      if (ok) { acertos++; Som.acerto(); } else Som.erro();
      c.querySelectorAll('.grupo').forEach(b => { b.disabled = true; if (b.dataset.grupo === it.grupo) b.classList.add('certo'); else if (b.dataset.grupo === escolhido) b.classList.add('errado'); });
      carta.classList.add(ok ? 'certa' : 'errada');
      c.querySelectorAll('.trilha-itens i')[n].className = ok ? 'ok' : 'nao';
      $('.placar b', c).textContent = acertos;
      $('.classificar-retorno', c).innerHTML = `<b>${ok ? 'Isso!' : 'Quase.'}</b> ${marcar(it.explica)}`;
      await Promise.race([esperar(ok ? 2600 : 3600), aguardarAvanco()]);
    }
    await esperar(300);
    fecharCamada();
  }

  // ---------- interpretador do roteiro ----------
  async function executar(p) {
    if (p.quem) return fala(p);
    if (p.trecho) {
      ui.trecho.textContent = txt(p.trecho);
      if (p.marco != null) ui.progresso.style.transform = `scaleX(${p.marco})`;
    }
    if (p.cena) cena(p.cena);
    if ('atores' in p) atores(p.atores);
    if ('tela' in p) tela(p.tela);
    if (p.destacar != null) destacar(p);
    if (p.revelar) { ui.tela.querySelectorAll('.t-telao li').forEach((li, i) => li.classList.toggle('on', i < p.revelar)); Som.clique(); }
    if (p.efeito) await efeito(p.efeito);
    if (p.selo) selo(p.selo);
    if (p.decisao) await decisao(p.decisao);
    if (p.desafio) await (p.desafio.tipo === 'classificar' ? desafioClassificar(p.desafio) : desafioPistas(p.desafio));
    if (p.insignia) await insignia();
    if (p.pausa) await esperar(p.pausa);
    if (p.legenda === false) ui.legenda.hidden = true;
  }
  async function rodar(passos) { for (const p of passos) await executar(p); }

  // Converte ['lupa', 'texto', {opções}] em objetos e numera as falas (ids estáveis para as vozes gravadas).
  function preparar(passos, cont) {
    return passos.map(p => {
      if (Array.isArray(p)) {
        const [quem, texto, o = {}] = p;
        return Object.assign({ quem, texto, id: `f${String(++cont.n).padStart(3, '0')}` }, o);
      }
      const q = Object.assign({}, p);
      if (q.decisao) q.decisao = Object.assign({}, q.decisao, { opcoes: q.decisao.opcoes.map(o => Object.assign({}, o, { passos: preparar(o.passos || [], cont) })) });
      return q;
    });
  }
  function marcos(passos) {
    const t = passos.filter(p => p.trecho);
    t.forEach((p, i) => { p.marco = i / t.length; });
  }

  // ---------- abertura, quiz e resultado ----------
  function abertura() {
    cena(M.abertura.cena || 'telhado');
    atores(M.abertura.atores || []);
    ui.trecho.textContent = 'Abertura';
    return new Promise(resolve => {
      const c = abrirCamada('abertura-camada', `<div class="abertura">
          <p class="abertura-serie"><span class="logo-cliente">${logoHTML()}</span> ${esc(CFG.empresa)} apresenta</p>
          <h1>Esquadrão<br><span>Sentinela</span></h1>
          <p class="abertura-modulo">MÓDULO ${M.numero} · ${esc(M.titulo.toUpperCase())} · ${esc(M.tema)}</p>
          <p class="abertura-texto">${marcar(M.abertura.texto)}</p>
          <button type="button" class="botao-principal" id="comecar">▶ Começar missão</button>
          <p class="abertura-dicas">Espaço pausa · Enter avança · A/B/C respondem · use fones para ouvir a narração</p></div>`);
      $('#comecar', c).onclick = () => { Som.init(); Som.whoosh(); fecharCamada(); resolve(); };
      $('#comecar', c).focus();
    });
  }

  async function quiz() {
    cena('central'); atores([]); tela(null);
    ui.trecho.textContent = 'Quiz final';
    ui.progresso.style.transform = 'scaleX(1)';
    let acertos = 0;
    const h = ELENCO[M.heroi];
    for (let i = 0; i < M.quiz.length; i++) {
      const q = M.quiz[i];
      const c = abrirCamada('quiz-camada', `<div class="quiz">
          <div class="quiz-topo"><span>QUIZ FINAL · PERGUNTA ${i + 1} DE ${M.quiz.length}</span><span class="quiz-pontos">${'●'.repeat(i)}${'○'.repeat(M.quiz.length - i)}</span></div>
          <h2>${marcar(q.pergunta)}</h2>
          <div class="opcoes">${q.opcoes.map((o, j) => `<button type="button" class="opcao" data-opcao="${j}"><span class="tecla">${'abc'[j]}</span><span>${marcar(o)}</span></button>`).join('')}</div>
          <div class="quiz-explica" hidden><div class="legenda-rosto">${rostoDe(M.heroi, 'sorriso')}</div><div><b></b><p></p></div><button type="button" class="botao-principal" id="proxima">${i + 1 < M.quiz.length ? 'Próxima pergunta →' : 'Ver resultado →'}</button></div></div>`);
      const j = await new Promise(r => c.querySelectorAll('[data-opcao]').forEach(b => { b.onclick = () => r(Number(b.dataset.opcao)); }));
      const ok = j === q.certa;
      if (ok) { acertos++; Som.acerto(); } else Som.erro();
      c.querySelectorAll('[data-opcao]').forEach((b, k) => { b.disabled = true; if (k === q.certa) b.classList.add('certa'); else if (k === j) b.classList.add('errada'); });
      const ex = $('.quiz-explica', c);
      ex.hidden = false;
      if (M.heroi === 'lupa') $('.legenda-rosto', ex).innerHTML = rostoDe('lupa', ok ? 'feliz' : 'preocupada');
      $('b', ex).textContent = `${ok ? 'Acertou!' : 'Não foi dessa vez.'} ${h.nome.toUpperCase()}:`;
      $('p', ex).innerHTML = marcar(q.explica);
      Voz.falar(textoVoz(q.explica), null, M.heroi);
      $('#proxima', c).focus();
      await new Promise(r => { $('#proxima', c).onclick = r; });
      Voz.cancelar();
    }
    return acertos;
  }

  async function resultado(acertos) {
    const nota = Math.round(acertos / M.quiz.length * 100);
    const aprovado = acertos >= (M.aprovacao || 4);
    const seg = Math.round((Date.now() - estado.inicio) / 1000);
    const tempo = `${Math.floor(seg / 60)} min ${String(seg % 60).padStart(2, '0')} s`;
    SCORM.concluir({ nota, aprovado });
    try {
      const prog = JSON.parse(localStorage.getItem('sentinela.progresso') || '{}');
      const antes = prog[M.id] || {};
      prog[M.id] = { nota: Math.max(nota, antes.nota || 0), aprovado: aprovado || !!antes.aprovado, selos: [...new Set([...(antes.selos || []), ...estado.selos])] };
      localStorage.setItem('sentinela.progresso', JSON.stringify(prog));
    } catch (e) { /* armazenamento indisponível: segue sem guardar */ }
    if (aprovado) Som.fanfarra();
    const h = ELENCO[M.heroi];
    const c = abrirCamada('resultado-camada', `<div class="resultado ${aprovado ? 'aprovado' : 'reprovado'}">
        <div class="resultado-insignia" style="--cor:${h.cor}">${iconeInsignia(M.insignia.icone)}</div>
        <p class="decisao-rotulo">${aprovado ? 'MISSÃO CUMPRIDA' : 'QUASE LÁ, RECRUTA'}</p>
        <h2>${aprovado ? `Você ganhou a ${esc(M.insignia.nome)}` : 'Faltou pouco para a insígnia'}</h2>
        <div class="resultado-numeros"><div><b>${acertos}/${M.quiz.length}</b><small>acertos</small></div><div><b>${nota}</b><small>nota</small></div><div><b>${estado.selos.length}</b><small>selos</small></div><div><b>${tempo}</b><small>tempo</small></div></div>
        ${estado.selos.length ? `<p class="resultado-selos">${estado.selos.map(s => `<span>★ ${esc(s)}</span>`).join('')}</p>` : ''}
        <details class="resultado-escolhas"><summary>Suas escolhas na história</summary><ul>${estado.escolhas.map(e => `<li class="${e.boa ? 'boa' : ''}"><small>${esc(e.pergunta)}</small>${esc(e.resposta)}${e.porTempo ? ' <em>(tempo esgotado)</em>' : ''}</li>`).join('')}</ul></details>
        ${aprovado ? '' : `<p class="resultado-dica">Você precisa de ${M.aprovacao || 4} acertos. Refaça o quiz: as explicações estão fresquinhas.</p>`}
        <div class="resultado-botoes">
          ${aprovado ? '' : '<button type="button" class="botao-principal" id="refazer">Refazer o quiz</button>'}
          <button type="button" class="botao-secundario" id="rever">Assistir de novo</button>
          ${!SCORM.emLMS && M.proximo && aprovado ? `<a class="botao-principal" href="${esc(M.proximo.arquivo)}">Próxima missão: ${esc(M.proximo.titulo)} →</a>` : ''}
          ${!SCORM.emLMS ? '<a class="botao-secundario" href="index.html">Voltar ao QG</a>' : ''}
        </div></div>`);
    const refazer = $('#refazer', c);
    if (refazer) refazer.onclick = async () => resultado(await quiz());
    $('#rever', c).onclick = () => location.reload();
  }

  // Lista todas as falas com seus ids (para gravar as vozes).
  function mostrarRoteiro(passos) {
    const linhas = [];
    const andar = (ps, nivel) => ps.forEach(p => {
      if (p.quem) linhas.push(`<tr><td>${p.id}</td><td>${esc((ELENCO[p.quem] || {}).nome || p.quem)}</td><td style="padding-left:${nivel * 18}px">${esc(textoVoz(p.voz || p.texto))}</td></tr>`);
      if (p.trecho) linhas.push(`<tr class="r-trecho"><td colspan="3">${esc(txt(p.trecho))}</td></tr>`);
      if (p.decisao) p.decisao.opcoes.forEach(o => { linhas.push(`<tr class="r-opcao"><td></td><td colspan="2" style="padding-left:${nivel * 18}px">↳ ${esc(txt(o.texto))}</td></tr>`); andar(o.passos, nivel + 1); });
    });
    andar(passos, 0);
    document.body.innerHTML = `<main class="roteiro-lista"><h1>${esc(M.titulo)} — falas para gravação</h1><p>Salve cada áudio como <code>&lt;id&gt;.mp3</code> numa pasta e aponte essa pasta em <code>config.js → vozes.${esc(M.id)}</code>.</p><table>${linhas.join('')}</table></main>`;
  }

  // ---------- ponto de entrada ----------
  window.Sentinela = {
    config: CFG, txt,
    async modulo(def) {
      M = def;
      const roteiro = preparar(def.roteiro, { n: 0 });
      marcos(roteiro);
      document.title = `${def.titulo} — Esquadrão Sentinela`;
      if (params.has('roteiro')) return mostrarRoteiro(roteiro);
      SCORM.iniciar();
      Voz.init(def.id);
      montar();
      await abertura();
      await rodar(roteiro);
      ui.legenda.hidden = true;
      await resultado(await quiz());
    }
  };
})();
