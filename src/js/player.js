/* Esquadrão Sentinela · player.js
   Motor do player: estado, avanço das falas, áudio, legendas, overlays (decisões, juramento, Central de Missões, quiz), SCORM e controles. */

/* ===================== Estado e motor ===================== */
/* Páginas de desenvolvimento por missão (missao0.html, missao1.html…) definem MISSAO_FOCO antes dos scripts; o index.html não. */
const FOCO = typeof MISSAO_FOCO === "number" ? MISSAO_FOCO : null;
const S = { scene: "inicio", li: 0, stage: { bg: "title" }, auto: true, som: true, token: 0, timers: [], escolhas: [], hs: { found: new Set(), miss: 0 }, quiz: { i: 0, ok: 0, answered: false, seq: 0 }, inicio: Date.now(), lastSig: "", lastFx: "" };

function clearTimers() { S.timers.forEach(t => clearTimeout(t)); S.timers = []; }
function later(fn, ms) { const tok = S.token; S.timers.push(setTimeout(() => { if (tok === S.token) fn(); }, ms)); }

const RENDER = { start: renderStart, decision: renderDecision, hotspot: renderHotspot, classificar: renderClassificar, quiz: renderQuiz, end: renderEnd, juramento: renderJuramento, aceite: renderAceite, hub: renderHub };
/* Quiz e fecho da missão do trecho atual (a Missão 1 é o padrão) */
const quizDe = m => QUIZZES[m] || QUIZ;
const missaoAtual = () => SCENES[S.scene].m || 1;
const cenaDe = (m, tipo) => Object.keys(SCENES).find(id => SCENES[id].m === m && SCENES[id].type === tipo);
const novoQuiz = () => ({ i: 0, ok: 0, answered: false, seq: 0 });
/* Telas que chegam com som de notificação */
const NOTIFICA = new Set(["email1", "sms", "push"]);
function go(id) {
  const sc = SCENES[id];
  if (!sc) return;
  S.token++; clearTimers(); stopVoice();
  S.scene = id; S.li = 0;
  if (sc.stage) S.stage = { ...S.stage, quadro: null, com: null, ...sc.stage };   // o quadro não passa de um trecho para outro
  markChapters(sc);
  if (sc.type === "lines") playLine();
  else { marcarFala(null); renderStage(); RENDER[sc.type](sc); }
}

function playLine() {
  const sc = SCENES[S.scene], ln = sc.lines[S.li];
  S.token++; clearTimers(); stopVoice();
  S.stage = { ...S.stage, ...(ln.set || {}), com: ln.radio || null };   // com: a fala chega pelo comunicador
  renderStage();
  renderCaption(ln);
  marcarFala(ln.who);
  const set = ln.set || {};
  if (NOTIFICA.has(set.screen) || set.pushes) efeito("notificacao", .5);
  if (set.fx === "rewind") efeito("rebobinar", .5);
  if (set.fx === "badge") efeito("insignia", .55);
  if (set.fx === "stamp") efeito("acerto", .5);
  if (set.fx === "glitch" || set.fx === "holo") bip("glitch");
  if (set.fx === "vozfalsa") efeito("erro", .45);
  if (S.li === 0 && S.stage.fx === "alarme") bip("sirene");
  if (ln.radio) bip("radio");
  if (set.digitar) bip("teclas");
  /* impacto: true na fala dá um tranco de câmera (estilo .art.impacto no CSS da missão) */
  if (ln.impacto) { const a = $("art"); a.classList.remove("impacto"); void a.offsetWidth; a.classList.add("impacto"); bip("glitch"); }
  /* depois: muda o palco no meio da fala (ex.: a Lupa andando → já parada na mesa) */
  if (ln.depois) later(() => { S.stage = { ...S.stage, ...ln.depois }; renderStage(); }, lineMs(ln) * .5);
  /* sem o arquivo de áudio (fala ainda não gravada), a legenda fica o tempo de leitura */
  if (falar(arquivoFala(S.scene, S.li, ln), () => { if (S.auto) later(nextLine, 250); }, lineMs(ln))) return;
  if (S.auto) later(nextLine, lineMs(ln));
}
/* Quem fala: data-voz no palco (ex.: olhos da Força Bruta acendem) e .falando no herói em cena (HEROIS[k].voz). O estilo fica no CSS da missão. */
function marcarFala(who) {
  $("stage").dataset.voz = (who && VOZ_ARQ[who]) || "";
  for (const c of $("art").querySelectorAll(".char[data-k^=\"heroi-\"]")) { const h = HEROIS[c.dataset.k.slice(6)]; c.classList.toggle("falando", !!who && !!h && h.voz === who); }
}
const lineMs = ln => Math.max(2600, 1300 + fmt(ln.t).length * 52);

function nextLine() {
  if (S.pausado) return;
  const sc = SCENES[S.scene];
  if (!sc || sc.type !== "lines") return;
  if (S.li < sc.lines.length - 1) { S.li++; playLine(); } else go(sc.next);
}

/* Palco */
function renderStage(force) {
  const st = S.stage;
  const sig = JSON.stringify(st) + CONFIG.empresa + CONFIG.corMarca + CONFIG.dominioOficial;
  if (sig !== S.lastSig || force) {
    const artSig = JSON.stringify({ ...st, screen: st.screen ? (st.screen === "tutorial" ? "t" : "s") : 0, hl: 0, step: 0 }) + CONFIG.empresa + CONFIG.corMarca;
    if (artSig !== S.artSig || force) {
      montarCena(sceneParts(st));
      S.artSig = artSig;
    }
    const scr = st.screen && SCREENS[st.screen] && !quadroAtivo(st) ? SCREENS[st.screen](st) : "";   // com quadro, a imagem ocupa a cena
    $("screen").classList.toggle("still", st.screen === S.lastScreen);
    S.lastScreen = st.screen;
    $("screen").innerHTML = scr;
    $("dock").innerHTML = scr;
    let fx = "";
    if (st.fx === "rewind") fx = `<div class="rewind">◀◀ VOLTANDO A FITA</div>`;
    if (st.fx === "badge") fx = `<div class="badge-fx">${INSIGNIAS[st.insignia] || BADGE_SVG}</div>`;
    if (st.fx === "stamp") fx = `<div class="stamp">Selo conquistado: ${esc(st.selo || "Olho Vivo")}</div>`;
    if (fx !== S.lastFx) { $("fx").innerHTML = fx; S.lastFx = fx; }   // mesmo efeito: não reinicia a animação
    S.lastSig = sig;
  }
}

/* Legenda e painel */
function renderCaption(ln) {
  showOverlay(null);
  const subs = $("subs");
  subs.textContent = fmt(ln.t);
  subs.className = "subs" + (ln.who === N ? " narr" : "") + (ln.who === K ? " falsa" : "");
  void subs.offsetWidth; subs.classList.add("entra");   // reinicia a entrada da legenda (estilo opcional no CSS da missão)
  $("btnSkip").hidden = false;
}
function showOverlay(kind) {
  const ov = $("overlay");
  $("dock").hidden = !!kind;
  if (!kind) { ov.hidden = true; return; }
  $("subs").textContent = ""; $("btnSkip").hidden = true;
  ov.className = "overlay" + (kind === "start" ? " start" : kind === "wide" ? " wide" : "");
  ov.hidden = false;
}

/* Abertura: primeira vez, o recrutamento; quem já fez entra pela Central de Missões */
function renderStart() {
  if (FOCO !== null) return renderFoco();
  trilha(TRILHA_ALTA);
  showOverlay("start");
  const volta = PROG.m0, p = PROG.patente();
  const estado = m => PROG.passou(m.n) ? "feita" : PROG.liberada(m.n) || (m.n === 1 && !volta) ? "atual" : "breve";
  const rotulo = { feita: "Concluída", atual: "Disponível", breve: "Em breve" };
  $("panel").innerHTML = `
    <div class="ep">
      <p class="ep-kicker">Esquadrão Sentinela${volta ? "" : " · Missão 0"}</p>
      <h1 class="ep-title">${volta ? `Bem-vindo de volta, ${esc(p.nome.toLowerCase())}` : "O Recrutamento"}</h1>
      <p class="ep-meta">${volta ? `<span class="gold">${PROG.xp} XP</span><span>${PROG.patente().prox ? `próxima patente: ${esc(p.prox[1])}` : "patente máxima"}</span>` : `<span>cerca de 12 min</span><span>XP e patentes</span><span>decisões, desafio e quiz</span>`}</p>
      <p class="ep-sinopse">${volta ? "Suas missões, sua patente e suas conquistas estão na Central. Continue de onde parou." : "O Comandante vai te apresentar os vilões, o esquadrão e o juramento do Sentinela. Depois, sua primeira missão: A Isca. Cada boa decisão vale XP."}</p>
      <p class="ep-welcome">Recruta da <b>${esc(CONFIG.empresa)}</b>.</p>
    </div>
    <div class="cap-actions"><button class="primary" id="btnStart">${volta ? "Ir para a Central de Missões" : "Começar o recrutamento"}</button>${volta ? `<button class="secondary" id="btnRever">Rever o recrutamento</button>` : `<span class="hint">Com som. Toque na cena para avançar as falas.</span>`}</div>
    <ol class="ep-list" aria-label="Missões da série">${MISSOES.map(m => `<li class="${estado(m)}"><b>M${m.n}</b><span>${esc(m.titulo)}</span><small>${esc(m.tema)} · ${rotulo[estado(m)]}</small></li>`).join("")}</ol>`;
  $("btnStart").onclick = () => { S.inicio = Date.now(); bip(); go(volta ? "hub" : "m0a"); };
  if (volta) $("btnRever").onclick = () => { S.inicio = Date.now(); bip(); go("m0a"); };
}
/* Abertura da página de desenvolvimento: só a missão em foco, sem passar pelo recrutamento nem pela Central */
function renderFoco() {
  trilha(TRILHA_ALTA);
  showOverlay("start");
  const m = MISSOES.find(x => x.n === FOCO);
  $("panel").innerHTML = `
    <div class="ep">
      <p class="ep-kicker">Esquadrão Sentinela · página de desenvolvimento</p>
      <h1 class="ep-title">Missão ${m.n} · ${esc(m.titulo)}</h1>
      <p class="ep-meta"><span>${esc(m.tema)}</span>${m.heroi ? `<span>com ${esc(m.heroi)}</span>` : ""}</p>
      <p class="ep-sinopse">${m.inicio ? "Só esta missão. Use Personalizar para pular direto para um trecho." : "Esta missão ainda não tem roteiro."}</p>
    </div>
    <div class="cap-actions">${m.inicio ? `<button class="primary" id="btnStart">Começar a missão</button>` : ""}</div>`;
  if (m.inicio) $("btnStart").onclick = () => { S.inicio = Date.now(); bip(); iniciarMissao(FOCO); };
}

/* Decisões (e a enquete da Missão 0). Cada opção pode trazer xp, motivo, conq (conquista) e reflexo (bônus por decidir rápido). */
function renderDecision(sc) {
  trilha(TRILHA_ALTA);
  /* tela: a mensagem sobre a qual se decide (e-mail, SMS) fica ao lado das opções */
  showOverlay(sc.tela ? "wide" : "card");
  const letters = "ABCDE", t0 = Date.now();
  const escolha = `<p class="prompt">${esc(fmt(sc.prompt))}</p>${sc.nota ? `<p class="hint">${esc(sc.nota)}</p>` : ""}
    ${sc.timer ? `<div class="countdown"><i style="animation-duration:${sc.timer}s;--d:${sc.timer}s"></i></div>` : ""}
    <div class="options">${sc.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="k">${letters[i]}</span><span>${esc(fmt(o.t))}</span></button>`).join("")}</div>`;
  $("panel").innerHTML = sc.tela ? `<div class="dec-grid"><div class="dec-tela challenge">${SCREENS[sc.tela](S.stage)}</div><div class="dec-opcoes">${escolha}</div></div>` : escolha;
  $("panel").querySelectorAll(".opt").forEach(btn => btn.onclick = () => {
    const o = sc.options[+btn.dataset.i];
    S.escolhas.push(o.tag);
    PROG.ganhar("dec:" + S.scene, o.xp, o.motivo);
    if (o.conq) PROG.conquistar(o.conq);
    /* reflexo: true (Missão 1) ou o id da conquista de reflexo da missão; o XP conta uma vez por missão */
    if (o.reflexo && Date.now() - t0 < 5000) { PROG.ganhar("reflexo" + (sc.m > 1 ? sc.m : ""), XP.reflexo, "Reflexo rápido"); PROG.conquistar(o.reflexo === true ? "reflexo" : o.reflexo); }
    go(o.go);
  });
  if (sc.timer) later(() => {
    S.escolhas.push(sc.timeoutTag || "Decisão 2: tempo esgotado");
    $("panel").innerHTML = `<p class="prompt">Tempo esgotado.</p><p class="line" style="font-size:17px">${esc(sc.timeoutTxt || "Sem problema: veja o que a Lupa faria.")}</p>`;
    bip("erro");
    later(() => go(sc.timeoutGo), 1600);
  }, sc.timer * 1000);
  const first = $("panel").querySelector(".opt"); if (first) first.focus({ preventScroll: true });
}

function renderHotspot(sc) {
  trilha(TRILHA_ALTA);
  showOverlay("wide");
  S.hs = { found: new Set(), miss: 0 };
  const draw = () => {
    const f = S.hs.found, done = f.size === 4;
    const hs = (k, html) => `<span class="hs${f.has(k) ? " found" : ""}${!f.has(k) && S.hs.miss >= 3 ? " hint" : ""}" role="button" tabindex="0" data-k="${k}">${html}</span>`;
    $("panel").innerHTML = `
      <p class="prompt">${done ? "Todas as pistas encontradas!" : "Desafio: encontre os 4 sinais de golpe nesta mensagem."}</p>
      <div class="counter"><span class="dots">${[0, 1, 2, 3].map(i => `<i class="${i < f.size ? "on" : ""}"></i>`).join("")}</span><span class="hint">${f.size} de 4 sinais · ${XP.pista} XP cada${S.hs.miss ? ` · ${S.hs.miss} erro${S.hs.miss > 1 ? "s" : ""}` : " · sem erros vale bônus"}${S.hs.miss >= 3 && !done ? " · as pistas restantes estão piscando" : ""}</span></div>
      <div class="challenge"><div class="mail" id="chMail">
        <div class="mail-bar"><span>Caixa de entrada</span><span class="mono">09:31</span></div>
        <div class="mail-head">
          <div><b>De:</b> Suporte TI ${hs("dominio", `&lt;suporte@${esc(slug())}-ti-helpdesk.com&gt;`)}</div>
          <div class="subj">Sua caixa de e-mail atingiu 99%: ação necessária</div>
        </div>
        <div class="mail-body">
          <p>Olá, ${hs("ameaca", "sua caixa será bloqueada em 24 horas")}.</p>
          <p>${hs("validar", `Valide sua conta para continuar recebendo mensagens. <span class="fakebtn" style="margin-left:.3em">VALIDAR AGORA</span>`)}</p>
          <p>${hs("anexo", `<span class="attach">Anexo: validacao_conta.html</span>`)}</p>
          <p class="sig">Equipe de Suporte</p>
        </div>
      </div></div>
      ${f.size ? `<ul class="found-list">${[...f].map(k => `<li>${esc(HOTSPOTS[k])}</li>`).join("")}</ul>` : ""}
      ${done ? `<div class="cap"><span class="who who--lupa">Lupa</span><p class="line">${esc(fmt("Repara no truque do domínio: ele colocou o nome da {EMPRESA} no endereço pra parecer de casa. Nome conhecido no meio do endereço não é garantia de nada."))}</p></div>
        <div class="cap-actions"><button class="primary" id="btnNext">Continuar</button></div>` : ""}`;
    const mail = $("chMail");
    mail.onclick = e => {
      const t = e.target.closest(".hs");
      if (t) { found(t.dataset.k); return; }
      if (!done) { S.hs.miss++; efeito("erro", .35); draw(); }
    };
    mail.querySelectorAll(".hs").forEach(el => el.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); found(el.dataset.k); } });
    if (done) {
      $("btnNext").onclick = () => go(sc.next);
      if (!S.hs.miss) { PROG.ganhar("pistas-perfeitas", XP.pistasPerfeitas, "Nenhum erro no desafio"); PROG.conquistar("cacador"); }
      efeito("insignia", .45); later(() => falar(CONFIG.midia + "audio/t4_01_lupa.mp3", () => trilha(TRILHA_ALTA)), 700);
    }
  };
  const found = k => {
    if (S.hs.found.has(k)) return;
    S.hs.found.add(k); efeito("acerto", .45);
    PROG.ganhar("pista:" + k, XP.pista, "Pista encontrada");
    draw();
    const el = $("panel").querySelector(`[data-k="${k}"]`); if (el) el.focus({ preventScroll: true });
  };
  draw();
}

/* Desafio de classificar: cada item recebe uma categoria (ex.: senha fraca ou forte). Erro mostra a resposta certa, sem XP.
   sc: prompt, cats (rótulos), itens [{t, c: índice da categoria certa, e: explicação}], xp por acerto, perfeito (bônus sem erro),
   conq (conquista sem erro), fala {who, cls, t, a} dita ao terminar */
function renderClassificar(sc) {
  trilha(TRILHA_ALTA);
  showOverlay("wide");
  const resp = {}, n = sc.itens.length; let ultimo = -1;
  const draw = () => {
    const feitos = Object.keys(resp).length, done = feitos === n;
    const erros = Object.keys(resp).filter(i => resp[i] !== sc.itens[i].c).length;
    $("panel").innerHTML = `
      <p class="prompt">${done ? (erros ? `Desafio concluído: ${n - erros} de ${n}.` : "Nenhum erro. Nada passa por você!") : esc(fmt(sc.prompt))}</p>
      <div class="counter"><span class="dots">${sc.itens.map((_, i) => `<i class="${i in resp ? "on" : ""}"></i>`).join("")}</span><span class="hint">${feitos} de ${n} · ${sc.xp} XP por acerto${erros ? ` · ${erros} erro${erros > 1 ? "s" : ""}` : " · sem erros vale bônus"}</span></div>
      <ul class="classif">${sc.itens.map((it, i) => {
        if (!(i in resp)) return `<li class="cl-item"><span class="cl-t">${esc(fmt(it.t))}</span><span class="cl-bts">${sc.cats.map((c, k) => `<button class="secondary cl-b" data-i="${i}" data-k="${k}">${esc(c)}</button>`).join("")}</span></li>`;
        const certo = resp[i] === it.c;
        return `<li class="cl-item ${certo ? "certo" : "errado"}${i === ultimo ? " agora" : ""}"><span class="cl-t">${esc(fmt(it.t))}</span><span class="cl-tag">${esc(sc.cats[it.c])}</span>
          <span class="cl-e"><b>${certo ? "Certo." : `Na verdade, é ${esc(sc.cats[it.c].toLowerCase())}.`}</b> ${esc(fmt(it.e))}</span></li>`;
      }).join("")}</ul>
      ${done && sc.fala ? `<div class="cap"><span class="who who--${sc.fala.cls || "lupa"}">${esc(sc.fala.nome)}</span><p class="line">${esc(fmt(sc.fala.t))}</p></div>` : ""}
      ${done ? `<div class="cap-actions"><button class="primary" id="btnNext">Continuar</button></div>` : ""}`;
    $("panel").querySelectorAll(".cl-b").forEach(b => b.onclick = () => {
      const i = +b.dataset.i, k = +b.dataset.k, it = sc.itens[i];
      if (i in resp) return;
      resp[i] = k; ultimo = i;
      if (k === it.c) { efeito("acerto", .45); PROG.ganhar(`cl:${S.scene}:${i}`, sc.xp, "Classificação certa"); } else efeito("erro", .35);
      draw();
      const prox = $("panel").querySelector(".cl-b"); if (prox) prox.focus({ preventScroll: true });
      if (Object.keys(resp).length === n) {
        if (!Object.keys(resp).some(j => resp[j] !== sc.itens[j].c)) { PROG.ganhar(`cl-perfeito:${S.scene}`, sc.perfeito, "Nenhum erro no desafio"); if (sc.conq) PROG.conquistar(sc.conq); }
        efeito("insignia", .45);
        if (sc.fala && sc.fala.a) later(() => falar(CONFIG.midia + "audio/" + sc.fala.a, () => trilha(TRILHA_ALTA)), 700);
        $("btnNext").focus({ preventScroll: true });
      }
    });
    if (done) $("btnNext").onclick = () => go(sc.next);
  };
  draw();
}

/* Quiz: 40 XP por acerto (uma vez por pergunta) e bônus de sequência a partir do 3º acerto seguido */
function renderQuiz() {
  trilha(TRILHA_ALTA);
  showOverlay("card");
  const sc = SCENES[S.scene], m = missaoAtual(), QUIZ = quizDe(m), px = m > 1 ? m : "";   // px: chaves de XP separadas por missão
  const q = QUIZ[S.quiz.i];
  const ans = S.quiz.answered;
  $("panel").innerHTML = `
    <div class="meta"><span>Pergunta ${S.quiz.i + 1} de ${QUIZ.length}</span><span class="dots quiz-dots">${QUIZ.map((_, i) => `<i class="${i < S.quiz.i || (i === S.quiz.i && ans !== false) ? "on" : ""}"></i>`).join("")}</span><span>${S.quiz.seq >= 2 ? `<b class="seq">Sequência ×${S.quiz.seq}</b> · ` : ""}${S.quiz.ok} acerto${S.quiz.ok === 1 ? "" : "s"}</span></div>
    <p class="prompt">${esc(fmt(q.q))}</p>
    <div class="options">${q.o.map((o, i) => `<button class="opt${ans !== false ? (i === q.c ? " right" : i === ans ? " wrong" : "") : ""}" data-i="${i}" ${ans !== false ? "disabled" : ""}><span class="k">${"ABC"[i]}</span><span>${esc(fmt(o))}</span></button>`).join("")}</div>
    ${ans !== false ? `<p class="explain"><b>${ans === q.c ? "Na mosca." : "Não foi dessa vez."}</b> ${esc(fmt(q.e))}</p>
      <div class="cap-actions"><button class="primary" id="btnQ">${S.quiz.i < QUIZ.length - 1 ? "Próxima pergunta" : "Ver resultado"}</button></div>` : ""}`;
  $("panel").querySelectorAll(".opt:not(:disabled)").forEach(b => b.onclick = () => {
    const i = +b.dataset.i, certo = i === q.c;
    S.quiz.answered = i;
    if (certo) {
      S.quiz.ok++; S.quiz.seq++;
      PROG.ganhar(`quiz${px}:` + S.quiz.i, XP.quiz, "Resposta certa");
      if (S.quiz.seq >= 3) PROG.ganhar(`seq${px}:` + S.quiz.i, XP.sequencia, `Sequência de ${S.quiz.seq} acertos`);
    } else S.quiz.seq = 0;
    efeito(certo ? "acerto" : "erro", .45);
    renderQuiz();
    $("btnQ").focus({ preventScroll: true });
  });
  const nb = $("btnQ");
  if (nb) nb.onclick = () => {
    S.quiz.answered = false;
    if (S.quiz.i < QUIZ.length - 1) { S.quiz.i++; renderQuiz(); } else go(sc.next || "fim");
  };
}

const estrelas = (ok, total = QUIZ.length) => ok >= total ? 3 : ok >= CONFIG.notaMinima ? 2 : ok >= 2 ? 1 : 0;
const estrelasHTML = n => `<span class="estrelas" aria-label="${n} de 3 estrelas">${[1, 2, 3].map(i => `<i class="${i <= n ? "on" : ""}">${ic("estrela")}</i>`).join("")}</span>`;

function renderEnd() {
  trilha(TRILHA_ALTA);
  showOverlay("card");
  const m = missaoAtual(), QUIZ = quizDe(m), FIM = FINAIS[m] || FINAIS[1];
  const ok = S.quiz.ok, pass = ok >= CONFIG.notaMinima;
  if (pass) efeito("insignia", .55);
  SCORM.set("cmi.core.score.min", 0);
  SCORM.set("cmi.core.score.max", 100);
  SCORM.set("cmi.core.score.raw", Math.round(ok / QUIZ.length * 100));
  SCORM.set("cmi.core.lesson_status", pass ? "passed" : "failed");
  SCORM.set("cmi.core.session_time", tempoSessao());
  SCORM.commit();
  PROG.registrarNota(m, ok);
  if (pass) { PROG.ganhar("aprovado:" + m, XP.aprovado, `Missão ${m} cumprida`); PROG.conquistar(FIM.insignia); }
  if (ok === QUIZ.length) PROG.conquistar(FIM.gabarito);
  if (!pass) { S.stage = { ...S.stage, fx: null }; renderStage(); }
  const p = PROG.patente();
  $("panel").innerHTML = `<div class="result">
    <p class="eyebrow">${pass ? "Missão cumprida" : "Quase lá"}</p>
    <div class="res-top"><p class="score">${ok}<small> de ${QUIZ.length} acertos</small></p>${estrelasHTML(estrelas(ok, QUIZ.length))}</div>
    <p class="line" style="font-size:17px">${pass ? esc(FIM.ganhou) : `Para conquistar a insígnia são ${CONFIG.notaMinima} acertos. Refaça o quiz; ${esc(FIM.dica)}`}</p>
    <div class="chips"><span class="chip gold">${ic("estrela")} ${PROG.xp} XP · ${esc(p.nome)}</span>${Object.keys(CONQUISTAS).filter(PROG.tem).map(c => `<span class="chip gold">${esc(CONQUISTAS[c].nome)}</span>`).join("")}<span class="chip">Tempo: ${tempoSessao()}</span></div>
    <ul class="choices">${S.escolhas.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
    <div class="cap-actions">${pass ? `<button class="primary" id="btnHub">Voltar à Central de Missões</button>` : `<button class="primary" id="btnRetry">Refazer o quiz</button>`}<button class="secondary" id="btnAgain">Rever a missão</button></div>
  </div>`;
  const r = $("btnRetry"); if (r) r.onclick = () => { S.quiz = novoQuiz(); go(cenaDe(m, "quiz")); };
  const h = $("btnHub"); if (h) h.onclick = () => go("hub");
  $("btnAgain").onclick = () => iniciarMissao(m);
}

/* ===================== Missão 0: juramento e aceite ===================== */
function renderJuramento(sc) {
  trilha(TRILHA_ALTA);
  showOverlay("card");
  const aceitas = new Set();
  const draw = () => {
    const prox = aceitas.size;
    const todas = prox === PROMESSAS.length;
    $("panel").innerHTML = `
      <p class="eyebrow">O juramento do Sentinela</p>
      <p class="prompt">${todas ? "Juramento feito. Bem-vindo ao esquadrão." : "Toque em cada promessa para aceitá-la."}</p>
      <div class="promessas">${PROMESSAS.map(([t, d], i) => `<button class="promessa${aceitas.has(i) ? " ok" : ""}" data-i="${i}" ${i !== prox ? "disabled" : ""} aria-pressed="${aceitas.has(i)}">
        <span class="p-n">${i + 1}</span><span><b>${esc(t)}</b><span class="p-d">${esc(d)}</span></span><span class="p-v">${aceitas.has(i) ? "Eu juro" : i === prox ? `Aceitar · +${XP.promessa} XP` : ""}</span></button>`).join("")}</div>
      ${todas ? `<div class="recruta">
          <div class="r-insignia">${BADGE_RECRUTA}</div>
          <div><p class="eyebrow">Insígnia conquistada</p><p class="r-nome">Recruta Sentinela</p></div>
        </div>
        <div class="canal"><p class="eyebrow">Canal da Central Sentinela</p><p class="c-main">${esc(fmt(CONFIG.canalReporte))}</p><p class="hint">${esc(fmt(CONFIG.contatoAlternativo))}</p></div>
        <div class="cap-actions"><button class="primary" id="btnJur">Continuar</button></div>` : ""}`;
    $("panel").querySelectorAll(".promessa:not(:disabled)").forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (aceitas.has(i)) return;
      aceitas.add(i);
      efeito(aceitas.size === PROMESSAS.length ? "insignia" : "acerto", .5);
      PROG.ganhar("jur:" + i, XP.promessa, "Promessa: " + PROMESSAS[i][0]);
      if (aceitas.size === PROMESSAS.length) PROG.conquistar("recruta");
      draw();
    });
    if (todas) {
      $("btnJur").onclick = () => go(sc.next);
      later(() => falar(CONFIG.midia + "audio/m0_23_comandante.mp3", () => trilha(TRILHA_ALTA)), 900);
      $("btnJur").focus({ preventScroll: true });
    } else { const b = $("panel").querySelector(".promessa:not(:disabled)"); if (b) b.focus({ preventScroll: true }); }
  };
  draw();
}
function renderAceite() {
  trilha(TRILHA_ALTA);
  showOverlay("card");
  $("panel").innerHTML = `
    <p class="eyebrow chamado">Chamado da Central · prioridade máxima</p>
    <div class="aceite"><span class="a-ic">${ic("anzol")}</span><div><p class="prompt">Missão 1 · A Isca</p>
    <p class="line" style="font-size:17px">Atividade suspeita no setor de e-mails. A Lupa espera você em campo.</p></div></div>
    <p class="hint">Recompensa: até ${XP.aprovado + 2 * 100 + 4 * XP.pista + XP.pistasPerfeitas + XP.reflexo + QUIZ.length * XP.quiz + 3 * XP.sequencia} XP e a Insígnia da Lupa.</p>
    <div class="cap-actions"><button class="primary pulsa" id="btnAceite">Aceitar a missão</button></div>`;
  $("btnAceite").onclick = () => { PROG.marcarM0(); PROG.ganhar("m0", XP.m0, "Missão 0 concluída"); efeito("acerto", .45); go("hub"); };
  $("btnAceite").focus({ preventScroll: true });
}

/* ===================== Central de Missões ===================== */
function iniciarMissao(n) {
  const m = MISSOES.find(x => x.n === n);
  if (!m || !m.inicio) return;
  if (n > 0) { S.escolhas = []; S.quiz = novoQuiz(); }
  S.stage = { bg: "title" };
  go(m.inicio);
}
function renderHub() {
  trilha(TRILHA_ALTA);
  showOverlay("wide");
  const p = PROG.patente();
  const pct = p.prox ? Math.round((PROG.xp - p.min) / (p.prox[0] - p.min) * 100) : 100;
  const ms = MISSOES.filter(m => m.n > 0), vencidas = ms.filter(m => PROG.passou(m.n)).length;
  const card = m => {
    const feita = PROG.passou(m.n), nota = PROG.nota(m.n);
    const livre = m.n === 1 ? PROG.m0 : PROG.passou(m.n - 1);   // a anterior foi vencida
    /* feita · aberta (jogável) · proxima (liberada, mas ainda não está neste pacote) · bloqueada */
    const estado = feita ? "feita" : livre ? (m.disponivel ? "aberta" : "proxima") : "bloqueada";
    const total = quizDe(m.n).length, pct = n => Math.round(n / total * 100);
    const status = { feita: `<p class="m-st ok">Concluída · nota ${pct(nota)}</p>`, aberta: `<p class="m-st">Liberada${nota !== null ? ` · melhor nota ${pct(nota)}` : ""}</p>`, proxima: `<p class="m-st">Liberada</p>`, bloqueada: "" }[estado];
    const acao = {
      feita: `<button class="secondary" data-m="${m.n}">Rever missão</button>`,
      aberta: `<button class="primary pulsa" data-m="${m.n}">Iniciar missão</button>`,
      proxima: `<button class="breve" disabled>Em breve</button>`,
      bloqueada: `<p class="tag">${ic("cadeado")} Conclua a Missão ${m.n - 1} para liberar</p>`
    }[estado];
    return `<article class="missao ${estado}">
      <div class="m-arte">${dueloHTML(m)}<span class="m-ic">${ic(estado === "bloqueada" ? "cadeado" : m.icone)}</span>${feita ? `<b class="m-selo">Vencido</b>` : ""}</div>
      <div class="m-corpo"><p class="m-n">Missão ${m.n}</p><p class="m-t">${esc(m.titulo)}</p>
      <p class="m-d">${esc(m.tema)}${m.heroi ? ` · ${estado === "bloqueada" ? "herói secreto" : `com ${esc(m.heroi)}`}` : ""}</p>
      ${status}${feita ? estrelasHTML(estrelas(nota, total)) : ""}<div class="m-acao">${acao}</div></div></article>`;
  };
  const conqs = Object.entries(CONQUISTAS);
  $("panel").innerHTML = `
    <div class="hub-top">
      <div><p class="eyebrow">Painel de missões</p><p class="hub-tit">Escolha sua missão, recruta.</p></div>
      <div class="hub-lado">
        <div class="patente"><span class="pat-ins">${ic("escudo")}<b>${p.i + 1}</b></span>
          <div class="pat-tx"><p class="pat-nome">${esc(p.nome)}</p><div class="xpbar"><i style="width:${pct}%"></i></div>
          <p class="hint">${PROG.xp} XP${p.prox ? ` · faltam ${p.prox[0] - PROG.xp} para ${esc(p.prox[1])}` : " · patente máxima"}</p></div></div>
        <p class="ins-cont"><span class="ins-dots">${ms.map(m => `<i class="${PROG.passou(m.n) ? "on" : ""}"></i>`).join("")}</span>${vencidas} de ${ms.length} insígnias</p>
      </div>
    </div>
    <div class="missoes">${ms.map(card).join("")}</div>
    ${vencidas === ms.length ? `<p class="hub-fim">Você é um Sentinela completo. Missão cumprida, recruta.</p>` : ""}
    <div class="conq-box"><div class="conq-top"><p class="eyebrow">Conquistas · ${conqs.filter(([id]) => PROG.tem(id)).length} de ${conqs.length}</p><button class="ghost" id="btnM0">Rever o recrutamento</button></div>
      <ul class="conqs">${conqs.map(([id, c]) => `<li class="${PROG.tem(id) ? "on" : ""}" title="${esc(c.nome)}: ${esc(c.desc)}"><span>${ic(PROG.tem(id) ? c.icone : "cadeado")}</span><small>${esc(c.nome)}</small></li>`).join("")}</ul></div>`;
  $("panel").querySelectorAll("[data-m]").forEach(b => b.onclick = () => iniciarMissao(+b.dataset.m));
  $("btnM0").onclick = () => iniciarMissao(0);
  const b = $("panel").querySelector(".missao.aberta [data-m]"); if (b) b.focus({ preventScroll: true });
}

function markChapters(sc) {
  const caps = CAPS[sc.m] || [];
  const ch = $("chapters");
  ch.style.gridTemplateColumns = `repeat(${Math.max(caps.length, 1)}, minmax(0, 1fr))`;
  ch.innerHTML = caps.map((c, i) => `<li class="${i + 1 < sc.cap ? "done" : i + 1 === sc.cap ? "now" : ""}"><div class="bar"></div><span class="lbl">${c}</span></li>`).join("");
  const m = MISSOES.find(x => x.n === sc.m);
  $("modName").textContent = m ? `· Missão ${m.n}: ${m.titulo}` : sc.type === "hub" ? "· Central de Missões" : "";
}

/* ===================== Pausa ===================== */
/* Só nas páginas que têm o botão (missao2.html). Congela a fala, o avanço automático, a trilha, o cronômetro das decisões,
   a câmera (animacao.js) e as animações CSS; a tela de pausa cobre o quadro até a pessoa voltar. */
function pausar() {
  if (S.pausado) return;
  S.pausado = Date.now();
  clearTimers();
  try { VOZ.pause(); TRILHA.pause(); } catch (e) {}
  $("frame").classList.add("pausado");
  $("pausa").hidden = false;
  $("btnContinuar").focus({ preventScroll: true });
}
function continuar() {
  if (!S.pausado) return;
  const parado = Date.now() - S.pausado;
  S.pausado = 0;
  for (const sh of $("art").children) if (sh._cam) sh._cam.t0 += parado;   // a câmera segue de onde parou
  $("frame").classList.remove("pausado");
  $("pausa").hidden = true;
  bip();
  const sc = SCENES[S.scene];
  if (sc.type !== "lines") {
    trilha(TRILHA_ALTA);
    if (sc.timer) go(S.scene);   // decisão com tempo: recomeça a contagem
    return;
  }
  const ln = sc.lines[S.li];
  if (ln.depois && Object.entries(ln.depois).some(([k, v]) => S.stage[k] !== v)) later(() => { S.stage = { ...S.stage, ...ln.depois }; renderStage(); }, 600);
  if (S.som && VOZ.src && !VOZ.error && !VOZ.ended) {
    trilha(TRILHA_BAIXA);
    const p = VOZ.play(); if (p && p.catch) p.catch(() => { if (S.auto) later(nextLine, 1500); });
  } else {
    if (S.som) trilha(TRILHA_BAIXA);
    if (S.auto) later(nextLine, VOZ.ended ? 250 : lineMs(ln));
  }
}

function restart() {
  S.escolhas = []; S.quiz = { i: 0, ok: 0, answered: false, seq: 0 }; S.stage = { bg: "title" };
  go("inicio");
}

/* ===================== Áudio: falas gravadas, trilha, efeitos e sons sintetizados ===================== */
const VOZ_ARQ = { [N]: "narrador", [L]: "lupa", [I]: "isca", [F]: "forca-bruta", [C]: "comandante", [K]: "camaleao", [H]: "chave-mestra" };
const VOZ = new Audio(); VOZ.preload = "auto";
const TRILHA = new Audio(); TRILHA.loop = true; TRILHA.preload = "auto";
const TRILHA_ALTA = .32, TRILHA_BAIXA = .05;
let trilhaAlvo = TRILHA_ALTA, trilhaFade = null;
/* a: nome do arquivo na fala (Missão 0); sem ele, <trecho>_<nn>_<voz>.mp3 */
function arquivoFala(sid, i, ln) { return CONFIG.midia + "audio/" + (ln.a || `${sid}_${String(i + 1).padStart(2, "0")}_${VOZ_ARQ[ln.who]}.mp3`); }
/* faltaMs: quanto esperar antes de seguir quando o arquivo não existe ou não toca */
function falar(src, onend, faltaMs) {
  if (!S.som) return false;
  try {
    VOZ.pause(); VOZ.onended = null; VOZ.onerror = null;
    VOZ.src = src; VOZ.currentTime = 0;
    const tok = S.token;
    VOZ.onended = () => { if (tok === S.token && onend) onend(); };
    VOZ.onerror = () => { if (tok === S.token && onend) later(onend, faltaMs || 1500); };
    const p = VOZ.play();
    if (p && p.catch) p.catch(() => { if (tok === S.token && onend) later(onend, faltaMs || 2500); });
    trilha(TRILHA_BAIXA);
    return true;
  } catch (e) { return false; }
}
function stopVoice() { try { VOZ.pause(); VOZ.onended = null; } catch (e) {} }
function trilha(alvo) {
  trilhaAlvo = alvo;
  if (!S.som) { TRILHA.pause(); return; }
  try {
    if (!TRILHA.src) TRILHA.src = CONFIG.midia + "sfx/trilha.mp3";
    if (TRILHA.paused) { TRILHA.volume = 0; const p = TRILHA.play(); if (p && p.catch) p.catch(() => {}); }
    clearInterval(trilhaFade);
    trilhaFade = setInterval(() => {
      const d = trilhaAlvo - TRILHA.volume;
      if (Math.abs(d) < .02) { TRILHA.volume = trilhaAlvo; clearInterval(trilhaFade); } else TRILHA.volume = Math.max(0, Math.min(1, TRILHA.volume + Math.sign(d) * .02));
    }, 40);
  } catch (e) {}
}
function efeito(nome, vol) {
  if (!S.som) return;
  try { const a = new Audio(CONFIG.midia + "sfx/" + nome + ".mp3"); a.volume = vol ?? .6; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
}
/* Sons curtos gerados na hora (Web Audio): moeda do XP, sirene do alarme, falha do holograma, chiado do rádio.
   Sem arquivo: não pesam no pacote. bip() sem nome só destrava o áudio no primeiro clique. */
let AC = null;
function bip(tipo) {
  if (!S.som) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    if (!tipo) return;
    const t = AC.currentTime, saida = AC.createGain();
    saida.connect(AC.destination);
    const tom = (tipoOnda, f0, f1, ini, dur, vol) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = tipoOnda; o.frequency.setValueAtTime(f0, t + ini);
      if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + ini + dur);
      g.gain.setValueAtTime(0, t + ini); g.gain.linearRampToValueAtTime(vol, t + ini + .01); g.gain.exponentialRampToValueAtTime(.0001, t + ini + dur);
      o.connect(g); g.connect(saida); o.start(t + ini); o.stop(t + ini + dur + .02);
    };
    const ruido = (ini, dur, vol) => {
      const b = AC.createBuffer(1, AC.sampleRate * dur, AC.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const s = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 1800; g.gain.value = vol;
      s.buffer = b; s.connect(f); f.connect(g); g.connect(saida); s.start(t + ini);
    };
    if (tipo === "xp") { saida.gain.value = .16; tom("square", 988, 0, 0, .08, .5); tom("square", 1319, 0, .07, .22, .5); }
    if (tipo === "sirene") { saida.gain.value = .07; for (let i = 0; i < 3; i++) { tom("sawtooth", 520, 880, i * .7, .35, .6); tom("sawtooth", 880, 520, i * .7 + .35, .35, .6); } }
    if (tipo === "glitch") { saida.gain.value = .12; ruido(0, .12, .6); tom("square", 140, 60, .05, .15, .4); ruido(.22, .08, .5); }
    if (tipo === "radio") { saida.gain.value = .08; ruido(0, .18, .8); tom("sine", 1400, 0, .02, .06, .4); }
    if (tipo === "teclas") { saida.gain.value = .09; for (let i = 0; i < 14; i++) ruido(.25 + i * (.07 + (i % 3) * .015), .018, .8); }
    if (tipo === "erro") { saida.gain.value = .1; tom("square", 220, 160, 0, .3, .5); }
  } catch (e) {}
}

/* Marca do cliente */
function applyBrand() {
  document.documentElement.style.setProperty("--brand", CONFIG.corMarca);
  $("logo").innerHTML = CONFIG.logo ? `<img src="${esc(CONFIG.logo)}" alt="">` : esc(iniciais());
  $("brandName").textContent = CONFIG.empresa;
}
function rerenderCurrent() {
  applyBrand(); renderStage(true);
  const sc = SCENES[S.scene];
  if (sc.type === "lines") renderCaption(sc.lines[S.li]);
  else if (sc.type === "start") renderStart();
  else if (sc.type === "quiz") renderQuiz();
  else if (sc.type === "hub") renderHub();
}

/* ===================== Ligações de interface ===================== */
$("btnSkip").onclick = e => { e.stopPropagation(); nextLine(); };
$("btnFull").onclick = () => {
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else { const p = $("cine").requestFullscreen && $("cine").requestFullscreen(); if (p && p.catch) p.catch(() => {}); }
  } catch (e) {}
};
if (!document.fullscreenEnabled) $("btnFull").hidden = true;
$("stage").addEventListener("click", e => {
  if (e.target.closest(".screen > *")) return;
  if (SCENES[S.scene].type === "lines") nextLine();
});
if ($("btnPause")) {
  $("btnPause").onclick = pausar;
  $("btnContinuar").onclick = continuar;
  document.addEventListener("keydown", e => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "p" || e.key === "P") { e.preventDefault(); S.pausado ? continuar() : pausar(); }
    else if (S.pausado && e.key === "Escape") continuar();
  });
}
document.addEventListener("keydown", e => {
  if (S.pausado || e.target.closest("input, textarea, .opt, .hs, button")) return;
  if (e.key === " " || e.key === "ArrowRight") {
    if (SCENES[S.scene].type === "lines") { e.preventDefault(); nextLine(); }
  }
});
$("btnAuto").onclick = () => {
  S.auto = !S.auto;
  $("btnAuto").setAttribute("aria-pressed", String(S.auto));
  if (SCENES[S.scene].type === "lines") playLine();
};
$("btnVoice").onclick = () => {
  S.som = !S.som;
  $("btnVoice").setAttribute("aria-pressed", String(S.som));
  if (!S.som) { stopVoice(); TRILHA.pause(); } else trilha(SCENES[S.scene].type === "lines" ? TRILHA_BAIXA : TRILHA_ALTA);
  if (SCENES[S.scene].type === "lines") playLine();
};
$("btnRestart").onclick = restart;

/* Painel de personalização */
const JUMPS = [["M0 · Abertura", "m0a"], ["M0 · Vilões", "m0c"], ["M0 · Enquete", "m0d"], ["M0 · Esquadrão", "m0e"], ["M0 · Missões", "m0f"], ["M0 · Juramento", "m0g"], ["M0 · Alarme", "m0h"], ["Central", "hub"],
  ["M1 · Abertura", "t1"], ["Lição", "t3"], ["Desafio", "t4"], ["Virada", "t5"], ["Se eu cair", "t7"], ["Desfecho", "t8"], ["Quiz", "quiz"]];
/* Na página de uma missão: todos os trechos dela, com o capítulo de cada um, e a Central */
const jumps = FOCO === null ? JUMPS : [
  ...Object.entries(SCENES).filter(([, sc]) => sc.m === FOCO).map(([id, sc]) => [`${(CAPS[FOCO] || [])[sc.cap - 1] || "Trecho"} · ${id}`, id]),
  ["Central", "hub"]];
function fillForm() {
  $("cfgEmpresa").value = CONFIG.empresa; $("cfgDominio").value = CONFIG.dominioOficial; $("cfgCor").value = CONFIG.corMarca;
  $("cfgCanal").value = CONFIG.canalReporte; $("cfgCanalDet").value = CONFIG.contatoAlternativo; $("cfgLogo").value = "";
}
if (CONFIG.modoDemo) {
  $("btnCloseDrawer").onclick = () => { $("drawer").hidden = true; $("btnConfig").setAttribute("aria-expanded", "false"); };
  $("btnConfig").onclick = () => { const d = $("drawer"); d.hidden = !d.hidden; $("btnConfig").setAttribute("aria-expanded", String(!d.hidden)); };
  $("jump").innerHTML = jumps.map(([l, id]) => `<button class="ghost" data-go="${id}">${l}</button>`).join("");
  $("jump").onclick = e => {
    const b = e.target.closest("[data-go]"); if (!b) return;
    bip();
    if (SCENES[b.dataset.go].type === "quiz") S.quiz = novoQuiz();
    go(b.dataset.go);
  };
  [["cfgEmpresa", "empresa"], ["cfgDominio", "dominioOficial"], ["cfgCor", "corMarca"], ["cfgCanal", "canalReporte"], ["cfgCanalDet", "contatoAlternativo"]].forEach(([id, k]) => {
    $(id).addEventListener("input", () => { CONFIG[k] = $(id).value || CONFIG_PADRAO[k]; rerenderCurrent(); });
  });
  $("cfgLogo").addEventListener("change", () => {
    const f = $("cfgLogo").files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { CONFIG.logo = r.result; rerenderCurrent(); }; r.readAsDataURL(f);
  });
  $("cfgReset").onclick = () => { CONFIG = JSON.parse(JSON.stringify(CONFIG_PADRAO)); fillForm(); rerenderCurrent(); };
  $("cfgZerar").onclick = () => { PROG.zerar(); restart(); };
  fillForm();
} else {
  $("btnConfig").hidden = true;
}

/* Início */
SCORM.init();
PROG.carregar();
if (SCORM.ok) { $("lmsStatus").textContent = "Conectado ao LMS"; $("lmsStatus").classList.add("on"); $("lmsStatus").hidden = false; }
else if (CONFIG.modoDemo) $("lmsStatus").hidden = false;
window.addEventListener("pagehide", () => { SCORM.set("cmi.core.session_time", tempoSessao()); SCORM.commit(); SCORM.finish(); });
applyBrand();
hud();
go("inicio");
