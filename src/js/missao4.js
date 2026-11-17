/* Esquadrão Sentinela · missao4.js
   Missão 4 · O Camaleão (engenharia social). Herói: Eco. Roteiro cena a cena em docs/missao4-roteiro.md.
   Carregado só por missao4.html, depois de roteiro.js: acrescenta personagens, cenários, telas, o desafio de sinais na conversa,
   trechos, quiz e fecho. Não altera nada das outras missões.
   Áudio: <trecho>_<nn>_<voz>.mp3 (ex.: c1_05_eco.mp3); sem o arquivo, a legenda fica o tempo de leitura. */

const E = "ECO", CM = "O CAMALEÃO", CP = "CONTRAPROVA";
CAPS[4] = ["Abertura", "Consequência", "Lição", "Desafio", "Virada", "Se cair", "Desfecho", "Quiz"];
Object.assign(MISSOES.find(m => m.n === 4), { heroi: "Eco", inicio: "c1", disponivel: true });

/* ===================== Personagens ===================== */
/* Recortes das folhas em referencias/personagens/ (eco_*, camaleao_*). poses: por cenário, [arquivo base, [centro X %, base %, altura %], lado de entrada].
   ancora: [centro dos pés na largura do recorte, largura/altura], para o corpo não pular de lugar quando a pose muda. */
HEROIS.eco = {
  nome: "Eco", sub: "comunicador · canal seguro", voz: E,
  poses: {
    office: ["eco_frente.png", [88, 0, 86], "right"],
    corredor: ["eco_tresquartos.png", [12, 1, 80], "left"],
    central: ["eco_frente.png", [74.5, 35, 46], "right"],   // na plataforma do nicho, à direita (bg_central_m2), ao lado do Contraprova
    comando: ["eco_frente.png", [50, 11, 62], "up"]
  },
  arquivoPose: pose => `eco_${pose}.png`,
  ancora: {
    frente: [.498, .371], tresquartos: [.547, .350], cruzado: [.498, .371], cruzado_calmo: [.527, .374], cruzado_fala: [.488, .351],
    cruzado_sorriso: [.557, .360], cruzado_surpreso: [.502, .335], coracao: [.547, .350], comemora: [.488, .408],
    insignia: [.509, .340], insignia_rindo: [.510, .340], preocupado: [.557, .360]
  },
  avatar: () => `<img class="r-cara" src="${IMG("eco_cara_gentil.png")}" alt="">`
};
HEROIS.camaleao = {
  nome: "O Camaleão", sub: "ligação recebida", voz: CM,
  poses: {
    office: ["camaleao_telefone.png", [13, 0, 84], "left"],
    corredor: ["camaleao_caixas.png", [52, 1, 76], "up"]
  },
  arquivoPose: pose => `camaleao_${pose}.png`,
  ancora: {
    telefone: [.458, .489], cracha: [.466, .449], caixas: [.475, .471], reverencia: [.478, .557], ofendido: [.525, .488],
    derrotado: [.475, .435], contrariado: [.431, .432], sem_cor: [.432, .509]
  },
  /* close de quadrinho enquanto ele fala ao telefone: st.caraVilao fixa o rosto; sem ela, a boca mexe (2 bocas) */
  extra: st => {
    if (st.bg !== "office" && st.bg !== "corredor") return "";
    const rosto = st.caraVilao
      ? `<img src="${IMG(`camaleao_cara_${st.caraVilao}.png`)}" alt="">`
      : `<span class="cm-bocas"><img src="${IMG("camaleao_boca1.png")}" alt=""><img src="${IMG("camaleao_boca2.png")}" alt=""></span>`;
    return `<div class="cm-close" data-k="cm-close"><span class="cm-rosto">${rosto}</span><b>${esc(st.caraNome || "O Camaleão")}</b></div>`;
  }
};
/* Contraprova: o parceiro do Eco, que confirma por outro canal. Aparece ao lado dele em toda cena do Eco (st.cp = false esconde);
   st.cpPose troca a pose. Sozinho (st.heroi = "contraprova"), usa as mesmas posições. */
HEROIS.contraprova = {
  nome: "Contraprova", sub: "comunicador · canal seguro", voz: CP,
  poses: {
    office: ["contraprova_frente.png", [71, 0, 80], "right"],
    corredor: ["contraprova_frente.png", [31, 1, 76], "left"],
    central: ["contraprova_frente.png", [86.5, 35, 44], "right"],
    comando: ["contraprova_frente.png", [66, 11, 56], "up"]
  },
  arquivoPose: pose => `contraprova_${pose}.png`,
  ancora: {
    frente: [.498, .508], tresquartos: [.510, .503], telefone: [.498, .507], disparo: [.462, .590], confere: [.472, .441], cruzado: [.519, .451],
    pensativo: [.500, .509], aponta: [.610, .617], holograma: [.528, .494], comemora: [.560, .559]
  },
  escala: { comemora: 1.08 },
  avatar: () => `<img class="r-cara" src="${IMG("contraprova_cara_calmo.png")}" alt="">`
};
/* A dupla em cena: quando o Eco aparece, o Contraprova vem junto (só nesta página; o desenho do herói continua em cenas.js) */
const heroiHTMLBase = heroiHTML;
heroiHTML = (k, bg, st = {}) => heroiHTMLBase(k, bg, st) +
  (k === "eco" && st.cp !== false ? heroiHTMLBase("contraprova", bg, { ...st, heroiPose: st.cpPose }) : "");
/* O esquadrão reunido no fim (st.time): heróis lado a lado na Central de Missões */
HEROIS.time = {
  nome: "Esquadrão Sentinela", poses: {},
  extra: st => st.bg !== "comando" ? "" : [["chave_frente.png", [20, 11, 58]], ["lupa_frente.png", [35, 11, 50]]]
    .map(([f, pos], i) => charHTML("time-" + i, f, pos, { cls: "heroi time", side: "up" })).join("")
};

INSIGNIAS.eco = `<svg viewBox="0 0 200 230" aria-hidden="true"><defs><clipPath id="badgeClip4"><path d="M100 8 L186 40 L178 130 Q160 190 100 222 Q40 190 22 130 L14 40 Z"/></clipPath><linearGradient id="badgeShine4" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="M100 8 L186 40 L178 130 Q160 190 100 222 Q40 190 22 130 L14 40 Z" fill="#9a7be0" stroke="#f1eaff" stroke-width="6"/><g stroke="#1e1238" stroke-width="10" stroke-linecap="round" fill="none"><path d="M100 70v62"/><path d="M78 84v34"/><path d="M122 84v34"/><path d="M56 94v14"/><path d="M144 94v14"/></g><text x="100" y="198" text-anchor="middle" font-family="Bricolage Grotesque, Trebuchet MS, sans-serif" font-size="25" font-weight="800" fill="#1e1238">ECO</text><g clip-path="url(#badgeClip4)"><g transform="rotate(20 100 115)"><rect class="shine" x="-90" y="-20" width="70" height="280" fill="url(#badgeShine4)"/></g></g></svg>`;

/* ===================== Cenários ===================== */
/* Fontes em referencias/cenarios/cenario_*_m4_v1.jpg. A Central reaproveita a da Missão 2 (telão à esquerda, nicho à direita);
   o fecho usa o salão da Central de Missões (bg_comando). */
FUNDOS.m4 = { office: "bg_escritorio_m4.jpg", corredor: "bg_corredor_m4.jpg", central: "bg_central_m2.jpg", comando: "bg_comando.jpg" };
const CAMERAS_MISSAO = {
  bg_escritorio_m4: { o: [48, 50], z: [1, 1.05], T: 26 },
  bg_corredor_m4:   { o: [52, 45], z: [1, 1.06], T: 24 },   // avança devagar pelo corredor
  bg_central_m2:    { o: [50, 40], z: [1, 1.05], T: 28 },
  bg_comando:       { o: [50, 45], z: [1, 1.05], T: 30 }
};
const IMAGENS_MISSAO = ["bg_escritorio_m4.jpg", "bg_corredor_m4.jpg", "bg_central_m2.jpg", "bg_comando.jpg",
  ...["frente", "tresquartos", "cruzado_calmo", "cruzado_fala", "cruzado_sorriso", "coracao", "comemora", "insignia", "insignia_rindo", "preocupado"].map(p => `eco_${p}.png`),
  ...["frente", "telefone", "disparo", "confere", "cruzado", "pensativo", "aponta", "holograma", "comemora"].map(p => `contraprova_${p}.png`),
  ...["telefone", "cracha", "caixas", "reverencia", "ofendido", "derrotado", "contrariado", "sem_cor", "boca1", "boca2"].map(p => `camaleao_${p}.png`),
  ...["charmoso", "malicioso", "ofendido", "bravo", "derrotado", "piscando"].map(c => `camaleao_cara_${c}.png`)];

/* ===================== Conquistas ===================== */
ICONES.ondas = `<path d="M12 5v14M8 8v8M16 8v8M4 10.5v3M20 10.5v3"/>`;
ICONES.telefone = `<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>`;
ICONES.porta = `<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M14.5 12h.01"/>`;
Object.assign(CONQUISTAS, {
  outroCanal: { nome: "Outro Canal", desc: "Desligou e ligou para o suporte pelo número oficial.", icone: "telefone" },
  ouvido: { nome: "Ouvido Fino", desc: "Achou os 4 sinais de golpe na conversa sem errar.", icone: "ondas" },
  portaCerta: { nome: "Porta Certa", desc: "Indicou a recepção em vez de segurar a porta.", icone: "porta" },
  reflexoEco: { nome: "Reflexo do Eco", desc: "Decidiu sobre a porta em menos de 5 segundos.", icone: "raio" },
  gabarito4: { nome: "Gabarito do Eco", desc: "Acertou as 5 perguntas do quiz da Missão 4.", icone: "alvo" },
  eco: { nome: "Insígnia do Eco", desc: "Concluiu a Missão 4 com aprovação.", icone: "ondas" }
});

/* ===================== Telas dentro da cena ===================== */
/* Celular na mesa: st.chamada (ligação do "Suporte TI") e st.sms (código de verificação); st.smsDestaque realça o aviso */
const SMS_CODIGO = "Seu código de verificação é 482 913. Não compartilhe este código com ninguém.";
const LICOES = {
  sinais: { k: "Lição do Eco", t: "Os 5 sinais do Camaleão", itens: [
    ["Urgência", "“antes que bloqueiem tudo”, “preciso agora”."],
    ["Segredo", "“não comenta com ninguém”, “é confidencial”."],
    ["Autoridade", "diretor, TI, banco, polícia. O cargo vira pressão."],
    ["Pedido fora do normal", "código, senha, transferência, cartão-presente, troca de conta bancária."],
    ["Canal inesperado", "número novo, ligação do nada, e-mail pessoal."]] },
  caiu: { k: "Eco · se cair", t: "Caí na conversa. E agora?", itens: [
    ["Avise na hora", "o TI e a segurança, pelo canal oficial."],
    ["Passou senha ou código?", "Troque a senha agora."],
    ["Envolveu dinheiro?", "Avise o financeiro e o banco na hora."],
    ["Anote tudo", "número, nome usado, horário e o que foi pedido."]] }
};
Object.assign(SCREENS, {
  fone(st) { return `<div class="onphone m4-fone">${SCREENS._fone(st)}</div>`; },
  _fone(st = {}) {
    const ligando = st.chamada !== false;
    return `<div class="phone-ui m4-ph">
      ${ligando ? `<div class="m4-call"><small>chamada recebida</small><b>Suporte TI · ${esc(CONFIG.empresa)}</b><span class="mono">(11) 3090-4040</span>
        <i class="m4-call-onda"></i><p class="m4-call-bts"><span class="nao">Desligar</span><span class="sim">Atender</span></p></div>` : ""}
      ${st.sms ? `<div class="m4-sms${st.smsDestaque ? " destaque" : ""}"><p class="m4-sms-de"><b>${esc(CONFIG.empresa)}</b><span>SMS · 17:51</span></p>
        <p>Seu código de verificação é <b class="mono">482 913</b>. <span class="aviso">Não compartilhe este código com ninguém.</span></p></div>` : ""}
    </div>`;
  },
  alerta() {
    return `<div class="closeup m4-alerta"><div class="m4-alerta-card"><span class="k">Central Sentinela · ${esc(CONFIG.empresa)}</span>
      <b>Ligação falsa reportada</b><span>Ninguém do TI ligou para você. Código não compartilhado.</span></div></div>`;
  },
  /* telão da lição (st.licao) com os itens revelados até st.step; st.step 99 = todos */
  licao(st) {
    const L = LICOES[st.licao] || LICOES.sinais, n = st.step || 0;
    return `<div class="m4-telao"><div class="m4-telao-card">
      <p class="rg-k">${esc(L.k)}</p><h3>${esc(L.t)}</h3>
      <ol>${L.itens.map(([t, d], i) => `<li class="${i < n ? (i === n - 1 && n < 99 ? "on now" : "on") : ""}"><span class="n">${i + 1}</span><span><b>${esc(t)}</b> <small>${esc(fmt(d))}</small></span></li>`).join("")}</ol>
      ${n >= 99 && st.licao !== "caiu" ? `<p class="m4-faixa">Pressa e segredo? <b>Hora de checar.</b> Por outro canal, que você escolhe.</p>` : ""}
    </div></div>`;
  },
  canal4() {
    return `<div class="closeup" style="left:6%;top:24%;width:52%"><div class="report-card">
      <span class="k">${esc(CONFIG.empresa)} · canal de reporte</span>
      <span class="v">${esc(CONFIG.canalReporte)}</span>
      <span>${esc(CONFIG.contatoAlternativo)}</span>
    </div></div>`;
  }
});

/* ===================== Desafio: os sinais na conversa (type: "pistas") ===================== */
/* Como o desafio do e-mail da Missão 1, mas sobre uma conversa de WhatsApp. msgs: [hora, [texto | [chave do sinal, texto]]] */
const CHAT4 = {
  numero: "+55 11 97733-1029", perfil: "foto de perfil: Carlos Mendes, Diretor",
  msgs: [
    ["14:02", ["Oi, aqui é o Carlos, diretor. ", ["canal", "Troquei de número"], ", salva aí."]],
    ["14:02", [["urgencia", "Preciso de um favor urgente, estou entrando numa reunião"], "."]],
    ["14:03", ["Compra ", ["pedido", "5 cartões-presente de R$ 200"], " pra um cliente e me manda os códigos por aqui."]],
    ["14:03", [["segredo", "Não comenta com ninguém"], ", é surpresa. Te reembolso amanhã."]]
  ],
  sinais: {
    canal: ["Número novo", "Contato conhecido em número novo: confirme pelo número antigo ou pessoalmente."],
    urgencia: ["Urgência", "Reunião, pressa, agora: tempo curto pra você não pensar."],
    pedido: ["Pedido fora do normal", "Cartão-presente é o pagamento favorito de golpista: some sem deixar rastro."],
    segredo: ["Segredo", "“Não comenta” serve pra ninguém te alertar."]
  }
};
/* Clique fora de um sinal: conta o erro e revela o próximo sinal que falta, com a explicação (sinal revelado não vale XP) */
function renderPistas4(sc) {
  trilha(TRILHA_ALTA);
  showOverlay("wide");
  const ordem = Object.keys(CHAT4.sinais), total = ordem.length;
  const f = new Set(), rev = new Set(), lista = []; let erros = 0, novo = null;
  const draw = () => {
    const feitos = f.size + rev.size, done = feitos === total;
    const parte = p => typeof p === "string" ? esc(fmt(p))
      : `<span class="hs${f.has(p[0]) ? " found" : rev.has(p[0]) ? " revelado" : ""}${p[0] === novo ? " agora" : ""}" role="button" tabindex="0" data-k="${p[0]}">${esc(fmt(p[1]))}</span>`;
    $("panel").innerHTML = `
      <p class="prompt">${done ? (rev.size ? `Desafio concluído: você achou ${f.size} de ${total}.` : "Todos os sinais encontrados!") : esc(fmt(sc.prompt))}</p>
      <div class="counter"><span class="dots">${lista.map(k => `<i class="on${rev.has(k) ? " rev" : ""}"></i>`).join("")}${"<i></i>".repeat(total - feitos)}</span><span class="hint">${feitos} de ${total} sinais · ${XP.pista} XP cada${erros ? ` · ${erros} erro${erros > 1 ? "s" : ""} · cada erro revela um sinal` : " · sem erros vale bônus"}</span></div>
      <div class="challenge"><div class="m4-chat" id="chChat">
        <div class="m4-chat-top"><span class="m4-chat-av"></span><span><b class="mono">${esc(CHAT4.numero)}</b><small>${esc(CHAT4.perfil)}</small></span></div>
        <div class="m4-chat-body">${CHAT4.msgs.map(([h, ps]) => `<p class="m4-bolha">${ps.map(parte).join("")}<small>${h}</small></p>`).join("")}</div>
      </div></div>
      ${lista.length ? `<ul class="found-list m4-sinais">${lista.map(k => `<li class="${rev.has(k) ? "rev" : "achou"}${k === novo ? " agora" : ""}"><b>${esc(CHAT4.sinais[k][0])}${rev.has(k) ? " (revelado)" : ""}:</b> ${esc(CHAT4.sinais[k][1])}</li>`).join("")}</ul>` : ""}
      ${done ? `<div class="cap"><span class="who who--eco">${esc(sc.fala.nome)}</span><p class="line">${esc(fmt(sc.fala.t))}</p></div>
        <div class="cap-actions"><button class="primary" id="btnNext">Continuar</button></div>` : ""}`;
    const chat = $("chChat");
    chat.onclick = e => {
      if (done) return;
      const t = e.target.closest(".hs");
      if (t) { achou(t.dataset.k); return; }
      erros++; efeito("erro", .35);
      const k = ordem.find(x => !f.has(x) && !rev.has(x));   // revela o próximo sinal que falta
      if (k) { rev.add(k); lista.push(k); novo = k; }
      draw();
    };
    chat.querySelectorAll(".hs").forEach(el => el.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); achou(el.dataset.k); } });
    if (done) {
      $("btnNext").onclick = () => go(sc.next);
      if (!erros) { PROG.ganhar("pistas-perfeitas4", XP.pistasPerfeitas, "Nenhum erro no desafio"); PROG.conquistar(sc.conq); }
      efeito("insignia", .45); later(() => falar(CONFIG.midia + "audio/" + sc.fala.a, () => trilha(TRILHA_ALTA)), 700);
      $("btnNext").focus({ preventScroll: true });
    }
  };
  const achou = k => {
    if (f.has(k) || rev.has(k)) return;
    f.add(k); lista.push(k); novo = k; efeito("acerto", .45);
    PROG.ganhar("pista4:" + k, XP.pista, "Sinal encontrado");
    draw();
    const el = $("panel").querySelector(`#chChat [data-k="${k}"]`); if (el) el.focus({ preventScroll: true });
  };
  draw();
}
/* O motor (player.js) carrega depois deste arquivo: o tipo de trecho e as vozes novas entram quando a página termina de carregar */
document.addEventListener("DOMContentLoaded", () => {
  RENDER.pistas = renderPistas4;
  Object.assign(VOZ_ARQ, { [E]: "eco", [CM]: "camaleao", [CP]: "contraprova" });
});

/* ===================== Roteiro ===================== */
/* Estado-base: limpa o que vem de outras cenas */
const M4 = { lupa: false, lupaPose: null, isca: null, screen: null, fx: null, hl: null, step: 0, heroi: null, heroiPose: null, cara: null, term: null,
  vilao: null, vilaoPose: null, caraVilao: null, caraNome: null, cpPose: null, cp: true, radioHeroi: "eco", insignia: "eco", fundos: "m4", selo: null,
  chamada: false, sms: false, smsDestaque: false, licao: null };
const NA_MESA = { ...M4, bg: "office", vilao: "camaleao", vilaoPose: "telefone", screen: "fone", chamada: true, sms: true };

Object.assign(SCENES, {
  /* ---------- Trecho 1 · Abertura ---------- */
  c1: { m: 4, cap: 1, type: "lines", next: "cd1", stage: { ...M4, bg: "office" }, lines: [
    { who: N, t: "Sexta-feira, 17h50. Você está fechando o notebook." },
    { who: N, t: "O telefone toca. O identificador diz: Suporte TI.", set: { screen: "fone", chamada: true } },
    { who: CM, t: "Oi, aqui é o Lucas, do suporte de TI. Tudo bem? Detectamos um acesso estranho na sua conta.", set: { vilao: "camaleao", vilaoPose: "telefone", caraNome: "“Lucas, do suporte”" } },
    { who: CM, t: "Te mandei um código por SMS pra confirmar que é você. É só me ler os números, rapidinho, antes que bloqueiem tudo.", set: { sms: true, caraVilao: "charmoso" } },
    { who: E, t: "Ei. Escuta só o que ele está pedindo.", set: { heroi: "eco", heroiPose: "cruzado_calmo", cpPose: "pensativo", caraVilao: null } },
    { who: E, t: "Sou o Eco, do Esquadrão Sentinela. A Íris falou bem de você.", set: { heroiPose: "cruzado_sorriso", cpPose: "cruzado" } },
    { who: E, t: "Eu ouço mais do que falo… e essa ligação tem um barulho estranho.", set: { heroiPose: "cruzado_fala", cpPose: "confere" } }
  ]},
  cd1: { m: 4, cap: 1, type: "decision", tela: "_fone", stage: { ...NA_MESA, heroi: "eco", heroiPose: "cruzado_calmo", cpPose: "confere", caraNome: "“Lucas, do suporte”" }, prompt: "O que você faz?", options: [
    { t: "Ler o código, ele é do suporte", go: "c2a", tag: "Decisão 1: leu o código", xp: 10, motivo: "Errar também ensina" },
    { t: "Fazer perguntas pra ver se ele é mesmo do TI", go: "c2b", tag: "Decisão 1: fez perguntas ao golpista", xp: 20, motivo: "Errar também ensina" },
    { t: "Desligar e ligar para o suporte pelo número oficial", go: "c2c", tag: "Decisão 1: desligou e ligou pelo número oficial", xp: 100, motivo: "Confirmou por outro canal", conq: "outroCanal" }
  ]},

  /* ---------- Trecho 2 · Consequência (uma por escolha) ---------- */
  c2a: { m: 4, cap: 2, type: "lines", next: "c3", stage: { ...NA_MESA, screen: null, caraNome: "“Lucas, do suporte”" }, lines: [
    { who: N, t: "Você lê os seis números. Do outro lado, um silêncio rápido." },
    { who: CM, t: "Perfeito, obrigado! Já resolvi tudo por aqui.", set: { vilaoPose: "reverencia", caraVilao: "piscando" } },
    { who: CM, t: "Agora eu sou você no sistema. Que crachá bonito!", impacto: true, set: { vilaoPose: "cracha", caraVilao: "malicioso" } },
    { who: E, t: "O código dizia: não compartilhe com ninguém. Nem com o suporte.", set: { heroi: "eco", heroiPose: "preocupado", cpPose: "pensativo", screen: "fone", chamada: false, sms: true, smsDestaque: true, caraVilao: null } },
    { who: E, t: "Esse código é a chave da sua conta. Quem pede é quem quer entrar. Vamos voltar.", set: { heroiPose: "cruzado_fala", cpPose: "confere", fx: "rewind" } }
  ]},
  c2b: { m: 4, cap: 2, type: "lines", next: "c3", stage: { ...NA_MESA, screen: null, caraNome: "“Lucas, do suporte”" }, lines: [
    { who: N, t: "Você pergunta o nome completo, o setor, o nome do seu gestor." },
    { who: CM, t: "Lucas Moreira, Infraestrutura. Seu gestor é o Paulo, né? E você está no projeto novo… vi no seu perfil. Digo, no sistema.", set: { caraVilao: "charmoso" } },
    { who: E, t: "Viu? Ele tem resposta pra tudo. Muita coisa sobre você está nas redes sociais, e ele estudou antes de ligar.", set: { heroi: "eco", heroiPose: "cruzado_fala", cpPose: "pensativo", caraVilao: null } },
    { who: CP, t: "Perguntar pra ele não prova nada. Quem confere é você, por um canal que você escolhe.", set: { heroiPose: "coracao", cpPose: "confere" } }
  ]},
  c2c: { m: 4, cap: 2, type: "lines", next: "c3", stage: { ...M4, bg: "central", screen: "alerta", heroi: "contraprova", heroiPose: "telefone" }, lines: [
    { who: N, t: "Você desliga e liga para o suporte pelo número oficial. Ninguém do TI tinha ligado." },
    { who: CM, t: "Desligou na minha cara? Que falta de educação!", impacto: true, set: { bg: "office", screen: null, heroi: null, vilao: "camaleao", vilaoPose: "ofendido", caraVilao: "ofendido", caraNome: "O Camaleão" } },
    { who: E, t: "Educação é com quem é de verdade. Você checou pelo caminho certo.", set: { heroi: "eco", heroiPose: "cruzado_sorriso", cpPose: "cruzado", vilaoPose: "contrariado", caraVilao: null } },
    { who: CP, t: "Desligar e ligar de volta pelo número oficial vale ouro.", set: { heroiPose: "comemora", cpPose: "telefone", fx: "stamp", selo: "Outro Canal" } }
  ]},

  /* ---------- Trecho 3 · A lição do Eco ---------- */
  c3: { m: 4, cap: 3, type: "lines", next: "c4", stage: { ...M4, bg: "central", heroi: "eco", heroiPose: "cruzado_fala", cpPose: "holograma", screen: "licao", licao: "sinais", step: 0 }, lines: [
    { who: E, t: "Engenharia social é enganar pessoas em vez de máquinas. Em vez de arrombar a porta, o golpista convence alguém a abrir." },
    { who: E, t: "O Camaleão muda de pele: suporte, diretor, fornecedor, entregador. Mas o roteiro dele é sempre o mesmo.", set: { heroiPose: "cruzado_calmo" } },
    { who: E, t: "Um: urgência. Pressa é pra você não pensar.", set: { step: 1, heroiPose: "cruzado_fala", cpPose: "aponta" } },
    { who: E, t: "Dois: segredo. Se ninguém pode saber, ninguém pode te alertar.", set: { step: 2 } },
    { who: E, t: "Três: autoridade. Um cargo importante faz a gente obedecer sem checar.", set: { step: 3, heroiPose: "tresquartos" } },
    { who: E, t: "Quatro: pedido fora do normal. Código, senha, dinheiro, cartão-presente.", set: { step: 4, heroiPose: "cruzado_fala" } },
    { who: E, t: "Cinco: canal inesperado. Número novo, ligação do nada.", set: { step: 5 } },
    { who: E, t: "Pressa e segredo? Hora de checar. Por outro canal, um que você escolhe, não o que ele oferece.", set: { step: 99, heroiPose: "cruzado_sorriso", cpPose: "confere" } }
  ]},

  /* ---------- Trecho 4 · Desafio: ouvindo os sinais ---------- */
  c4: { m: 4, cap: 4, type: "pistas", next: "c5", stage: { ...M4, bg: "central", heroi: "eco", heroiPose: "cruzado_calmo", cpPose: "cruzado" },
    prompt: "Desafio: clique nos 4 sinais de golpe nesta conversa.", conq: "ouvido",
    fala: { nome: "Eco", a: "c4_01_eco.mp3", t: "Quatro sinais numa mensagem só. Diretor de verdade não pede cartão-presente por WhatsApp. Na dúvida, liga no número que você já tinha." } },

  /* ---------- Trecho 5 · O Camaleão muda de tática ---------- */
  c5: { m: 4, cap: 5, type: "lines", next: "cd2", stage: { ...M4, bg: "corredor" }, lines: [
    { who: N, t: "Segunda de manhã. Você passa o crachá na porta do andar." },
    { who: CM, t: "Ô, segura a porta pra mim? Tô com as mãos ocupadas, esqueci o crachá lá embaixo…", set: { vilao: "camaleao", vilaoPose: "caixas", caraNome: "O Camaleão" } },
    { who: E, t: "Gentileza é bom. Mas essa porta tem leitor de crachá por um motivo.", set: { heroi: "eco", heroiPose: "tresquartos", cpPose: "pensativo" } }
  ]},
  cd2: { m: 4, cap: 5, type: "decision", timer: 10, stage: { ...M4, bg: "corredor", vilao: "camaleao", vilaoPose: "caixas", heroi: "eco", heroiPose: "tresquartos", cpPose: "pensativo", caraNome: "O Camaleão" }, prompt: "Decida rápido: o que você faz?", timeoutGo: "c6a",
    timeoutTag: "Decisão 2: tempo esgotado (porta aberta)", timeoutTxt: "Enquanto você hesitava, a porta ficou aberta.", options: [
    { t: "Segurar a porta, é só gentileza", go: "c6a", tag: "Decisão 2: segurou a porta", xp: 10, motivo: "Errar também ensina" },
    { t: "Com educação, indicar a recepção para ele se identificar", go: "c6b", tag: "Decisão 2: indicou a recepção", xp: 100, motivo: "Gentil e firme", conq: "portaCerta", reflexo: "reflexoEco" }
  ]},

  /* ---------- Trecho 6 · Consequência da virada ---------- */
  c6a: { m: 4, cap: 5, type: "lines", next: "c7", stage: { ...M4, bg: "corredor", vilao: "camaleao", vilaoPose: "caixas", caraNome: "O Camaleão" }, lines: [
    { who: N, t: "Ele entra, agradece… e some no corredor, perto das mesas, dos papéis e das telas abertas." },
    { who: CM, t: "Obrigado! Adoro gente prestativa.", set: { vilaoPose: "reverencia", caraVilao: "piscando" } },
    { who: E, t: "Entrar de carona também é engenharia social. Quem tem crachá passa o próprio; quem não tem, vai pra recepção.", set: { vilao: null, heroi: "eco", heroiPose: "preocupado", cpPose: "pensativo" } }
  ]},
  c6b: { m: 4, cap: 5, type: "lines", next: "c7", stage: { ...M4, bg: "corredor", vilao: "camaleao", vilaoPose: "derrotado", heroi: "eco", heroiPose: "tresquartos", cpPose: "aponta", caraNome: "O Camaleão" }, lines: [
    { who: N, t: "Você sorri e aponta: “A recepção libera rapidinho.” Ele desiste e vai embora." },
    { who: CM, t: "Hmpf. Gente educada e desconfiada… a pior combinação.", set: { vilaoPose: "contrariado", caraVilao: "bravo" } },
    { who: E, t: "Gentil e firme. É isso.", set: { heroiPose: "cruzado_sorriso", cpPose: "cruzado", caraVilao: null, fx: "stamp", selo: "Porta Certa" } }
  ]},

  /* ---------- Trecho 7 · E se eu cair? ---------- */
  c7: { m: 4, cap: 6, type: "lines", next: "c8", stage: { ...M4, bg: "central", heroi: "eco", heroiPose: "coracao", cpPose: "pensativo", screen: "licao", licao: "caiu", step: 0 }, lines: [
    { who: E, t: "Golpe de conversa pega gente esperta, porque usa uma coisa boa: a vontade de ajudar." },
    { who: CP, t: "Primeiro: avise o TI e a segurança. Na hora.", set: { step: 1, heroiPose: "cruzado_fala", cpPose: "aponta" } },
    { who: E, t: "Segundo: se passou senha ou código, troque a senha agora.", set: { step: 2 } },
    { who: E, t: "Terceiro: se envolveu dinheiro, avise o financeiro e o banco. Minutos fazem diferença pra bloquear.", set: { step: 3, heroiPose: "tresquartos" } },
    { who: CP, t: "Quarto: anote tudo. Número, nome que ele usou, horário, o que pediu. Isso ajuda a proteger os colegas.", set: { step: 4, heroiPose: "cruzado_fala" } },
    { who: E, t: "Ninguém vai te julgar. O golpista conta com a vergonha pra ganhar tempo.", set: { screen: "canal4", heroiPose: "coracao", cpPose: "telefone" } }
  ]},

  /* ---------- Trecho 8 · Desfecho ---------- */
  c8: { m: 4, cap: 7, type: "lines", next: "cquiz", stage: { ...M4, bg: "corredor", vilao: "camaleao", vilaoPose: "cracha", caraNome: "O Camaleão" }, lines: [
    { who: N, t: "O Camaleão tenta mais um disfarce… mas ninguém mais aceita sem checar.", set: { vilaoPose: "ofendido" } },
    { who: CM, t: "Sem pressa? Sem segredo? Assim eu fico sem cor!", impacto: true, set: { vilaoPose: "sem_cor", caraVilao: "derrotado" } },
    { who: E, t: "Pressa e segredo? Hora de checar.", set: { heroi: "eco", heroiPose: "cruzado_sorriso", cpPose: "disparo", caraVilao: null } },
    { who: E, t: "Quarta insígnia, recruta. Junte as quatro e você é um Sentinela completo.", set: { bg: "central", vilao: null, heroiPose: "insignia_rindo", cpPose: "comemora", fx: "badge" } },
    { who: N, t: "O Esquadrão está reunido. E agora você faz parte dele.", set: { bg: "comando", fx: null, heroiPose: "comemora", cpPose: "frente", vilao: "time" } }
  ]},
  cquiz: { m: 4, cap: 8, type: "quiz", next: "cfim", stage: { ...M4, bg: "central", heroi: "eco", heroiPose: "cruzado_calmo", cpPose: "cruzado" } },
  cfim: { m: 4, cap: 8, type: "end", stage: { ...M4, bg: "central", heroi: "eco", heroiPose: "insignia", cpPose: "comemora", fx: "badge" } }
});

/* ===================== Quiz e fecho ===================== */
QUIZZES[4] = [
  { q: "Alguém liga dizendo ser do TI e pede o código que chegou no seu celular. O que fazer?",
    o: ["Passar, é do TI", "Não passar; desligar e ligar para o número oficial do TI", "Passar só metade do código"], c: 1,
    e: "Código de verificação é a chave da sua conta. O TI de verdade nunca pede." },
  { q: "O “diretor”, de um número novo, pede cartões-presente com urgência e segredo. Quais são os sinais de golpe?",
    o: ["Só o número novo", "Número novo, urgência, segredo e pedido fora do normal", "Nenhum, diretor pode pedir isso"], c: 1,
    e: "Quando os sinais se somam, não é coincidência: é roteiro de golpe." },
  { q: "O que significa confirmar “por outro canal”?",
    o: ["Responder a mesma mensagem perguntando se é verdade", "Falar com a pessoa por um meio que você já conhece, como o número oficial ou pessoalmente", "Pedir para a pessoa mandar um áudio"], c: 1,
    e: "No canal dele, o golpista confirma qualquer coisa. E até voz pode ser imitada." },
  { q: "Uma pessoa sem crachá pede para entrar junto com você. O que fazer?",
    o: ["Segurar a porta, por gentileza", "Com educação, indicar a recepção", "Emprestar seu crachá"], c: 1,
    e: "Gentil e firme: quem não tem crachá se identifica na recepção." },
  { q: "Você passou sua senha numa ligação e depois desconfiou. E agora?",
    o: ["Ficar quieto para não se complicar", "Avisar o TI imediatamente e trocar a senha", "Esperar para ver se algo acontece"], c: 1,
    e: "O golpista conta com a vergonha. Avisar rápido corta o golpe pela raiz." }
];
FINAIS[4] = { insignia: "eco", gabarito: "gabarito4", ganhou: "Insígnia do Eco conquistada. Pressa e segredo? Agora você checa por outro canal.", dica: "as explicações do Eco ajudam." };
