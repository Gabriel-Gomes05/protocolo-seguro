/* Esquadrão Sentinela · missao2.js
   Missão 2 · A Força Bruta (senhas). Herói: Chave-Mestra. Roteiro cena a cena em docs/missao2-roteiro.md.
   Carregado só por missao2.html, depois de roteiro.js: acrescenta capítulos, conquistas, telas, terminais, trechos, quiz e fecho.
   Quando ficar pronta, entra no pacote (index.html). Áudio: <trecho>_<nn>_<voz>.mp3 (ex.: f1_05_chave-mestra.mp3); sem o arquivo, a legenda fica o tempo de leitura. */

CAPS[2] = ["Abertura", "Consequência", "Lição", "Desafio", "Virada", "Se vazar", "Desfecho", "Quiz"];

/* ===================== Personagem e insígnia ===================== */
/* Chave-Mestra: recortes da folha de modelo (referencias/personagens/chave_mestra_folha_modelo_v1.jpg → assets/img/chave_*.png).
   No escritório fica à esquerda da mesa (o monitor está à direita); na Central e no celular, à direita, como a Lupa. */
HEROIS.chave = {
  nome: "Chave-Mestra", sub: "comunicador · canal seguro", voz: H,
  poses: {
    office: ["chave_tresquartos.png", [17, 0, 90], "left"],
    central: ["chave_frente.png", [80.8, 35, 50], "right"],   // em pé na plataforma do nicho iluminado, à direita (bg_central_m2, v2)
    phone: ["chave_tresquartos.png", [83, 0, 84], "right"]
  },
  /* Folha de poses e expressões (referencias/personagens/chave_mestra_poses_expressoes_v1.jpg): st.heroiPose na fala troca a pose */
  arquivoPose: pose => `chave_${pose}.png`,
  virar: ["aponta"],
  ancora: { aponta: [.32, 278 / 440], escudo: [.39, 219 / 442], comemora: [.42, 208 / 443] },
  /* Comunicador: com st.cara mostra a expressão; sem ela, a boca mexe (3 bocas alternando) enquanto ele fala */
  avatar: st => st.cara
    ? `<img class="r-cara" src="${IMG(`chave_cara_${st.cara}.png`)}" alt="">`
    : `<span class="r-bocas">${[1, 2, 3].map(n => `<img src="${IMG(`chave_boca${n}.png`)}" alt="">`).join("")}</span>`
};
/* Força Bruta: recortes das folhas referencias/personagens/forca_bruta_poses_a_v1.jpg (aquece, soco, insiste, comemora) e
   forca_bruta_folha_v1.jpg (le, reverencia, furiosa, ameaca; rostos forca_cara_*; efeitos forca_fx_*). Fica no centro da sala escura
   (fundo: referencias/cenarios/cenario_sala_m2_v2.jpg, com o centro vazio para ela). st.vilao = "forca", st.vilaoPose troca a pose (atuação .act-forca-<pose>). */
const FB_BOCAS = ["neutra", "falando", "gritando"];
HEROIS.forca = {
  nome: "Força Bruta", sub: "sinal interceptado", voz: F,
  poses: { dark: ["forca_aquece.png", [50, 1, 76], "up"] },
  arquivoPose: pose => `forca_${pose}.png`,
  /* [centro da cabeça na largura do recorte, largura/altura] e altura do recorte em relação à pose de pé da mesma folha */
  ancora: { aquece: [.491, .563], soco: [.526, .781], insiste: [.445, .543], comemora: [.507, .805], le: [.457, .954], reverencia: [.527, .572], furiosa: [.485, .675], ameaca: [.373, .712] },
  escala: { insiste: 1.157, comemora: 1.058, le: 1.044, reverencia: .974, furiosa: .989 },
  /* Close de quadrinho enquanto ela fala (aparece com data-voz="forca-bruta"): st.caraVilao fixa a expressão; sem ela, a boca mexe.
     st.fxVilao: "soco" (estouro e teclas voando do punho) ou "racha" (o monitor dela trinca) */
  extra: st => {
    if (st.bg !== "dark") return "";
    const rosto = st.caraVilao
      ? `<img class="fb-cara" src="${IMG(`forca_cara_${st.caraVilao}.png`)}" alt="">`
      : `<span class="fb-bocas">${FB_BOCAS.map(c => `<img src="${IMG(`forca_cara_${c}.png`)}" alt="">`).join("")}</span>`;
    let h = `<div class="fb-close" data-k="fb-close"><span class="fb-rosto">${rosto}</span><b>Força Bruta</b></div>`;
    if (st.fxVilao === "soco") {
      const teclas = [["tecla1", -9, -7, -220], ["tecla2", -12, 3, 160], ["tecla_verm", -7, 8, -300], ["tecla3", -4, -11, 260], ["tecla1", -14, -2, 400], ["tecla2", -6, 12, -140]];
      h += `<div class="fb-soco" data-k="fb-soco"><img class="fb-estouro" src="${IMG("forca_fx_impacto.png")}" alt=""><img class="fb-faiscas" src="${IMG("forca_fx_faiscas.png")}" alt="">
        ${teclas.map(([n, dx, dy, r], i) => `<img class="fb-tecla" src="${IMG(`forca_fx_${n}.png`)}" alt="" style="--dx:${dx}cqw;--dy:${dy}cqw;--r:${r}deg;animation-delay:${.05 * i}s">`).join("")}</div>`;
    }
    if (st.fxVilao === "racha") h += `<img class="fb-racha" data-k="fb-racha" src="${IMG("forca_fx_racha.png")}" alt="">`;
    return h;
  }
};

INSIGNIAS.chave =`<svg viewBox="0 0 200 230" aria-hidden="true"><defs><clipPath id="badgeClip2"><path d="M100 8 L186 40 L178 130 Q160 190 100 222 Q40 190 22 130 L14 40 Z"/></clipPath><linearGradient id="badgeShine2" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="M100 8 L186 40 L178 130 Q160 190 100 222 Q40 190 22 130 L14 40 Z" fill="#6fb6ff" stroke="#e6f3ff" stroke-width="6"/><circle cx="100" cy="72" r="24" fill="none" stroke="#0d1a33" stroke-width="12"/><path d="M100 96v62m0-18h20m-20-18h14" stroke="#0d1a33" stroke-width="12" stroke-linecap="round" fill="none"/><text x="100" y="198" text-anchor="middle" font-family="Bricolage Grotesque, Trebuchet MS, sans-serif" font-size="21" font-weight="800" fill="#0d1a33">CHAVE</text><g clip-path="url(#badgeClip2)"><g transform="rotate(20 100 115)"><rect class="shine" x="-90" y="-20" width="70" height="280" fill="url(#badgeShine2)"/></g></g></svg>`;

/* Fluidez: imagens pré-carregadas (a troca de pose não espera a rede) e corte digital, rápido, para entrar e sair da sala escura da Força Bruta */
const IMAGENS_MISSAO = ["chave_frente", "chave_tresquartos", "chave_aponta", "chave_cruzado", "chave_escudo", "chave_token", "chave_comemora", "chave_pensa",
  "chave_boca1", "chave_boca2", "chave_boca3", ...["serio", "preocupado", "rindo", "piscando"].map(c => "chave_cara_" + c)].map(n => n + ".png")
  .concat("bg_escritorio_m2.jpg", "bg_central_m2.jpg", "bg_sala_m2.jpg",
    ["aquece", "soco", "insiste", "comemora", "le", "reverencia", "furiosa", "ameaca"].map(p => `forca_${p}.png`),
    ["neutra", "falando", "gritando", "gargalhando", "furiosa", "piscando", "malicioso"].map(c => `forca_cara_${c}.png`),
    ["tecla1", "tecla2", "tecla3", "tecla_verm", "impacto", "faiscas", "racha"].map(n => `forca_fx_${n}.png`));
/* Cenários da Missão 2 (fontes em referencias/cenarios/cenario_*_m2_v1.jpg); o celular continua o da Missão 1.
   A Central é a emenda das duas metades da fonte (telão à esquerda, plataforma à direita), com uma coluna cobrindo a junção. */
FUNDOS.m2 = { office: "bg_escritorio_m2.jpg", central: "bg_central_m2.jpg", dark: "bg_sala_m2.jpg" };
const CAMERAS_MISSAO = {
  bg_escritorio_m2: { o: [48, 48], z: [1, 1.05], T: 26 },   // entre a Chave-Mestra e o monitor
  bg_central_m2:    { o: [50, 40], z: [1, 1.05], T: 28 },
  bg_sala_m2:       { o: [50, 32], z: [1, 1.08], T: 36 }     // avança devagar até o rosto da Força Bruta
};
const TRANSICOES_MISSAO = { "office>dark": "glitch", "dark>office": "glitch", "phone>dark": "glitch", "dark>phone": "glitch", "central>dark": "glitch", "dark>central": "glitch" };

ICONES.teclado = `<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>`;
ICONES.celular = `<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>`;
Object.assign(CONQUISTAS, {
  frase: { nome: "Frase de Ferro", desc: "Criou uma frase-senha longa de primeira.", icone: "chave" },
  padroes: { nome: "Quebra-Padrões", desc: "Classificou as 6 senhas do desafio sem errar.", icone: "teclado" },
  trava: { nome: "Segunda Trava", desc: "Negou o pedido de login que não fez.", icone: "celular" },
  dedo: { nome: "Dedo Rápido", desc: "Negou o pedido de login em menos de 5 segundos.", icone: "raio" },
  gabarito2: { nome: "Gabarito da Chave", desc: "Acertou as 5 perguntas do quiz da Missão 2.", icone: "alvo" },
  chave: { nome: "Insígnia da Chave-Mestra", desc: "Concluiu a Missão 2 com aprovação.", icone: "chave" }
});

/* ===================== Terminal da Força Bruta (sala escura) ===================== */
Object.assign(TERMINAIS, {
  aquece: { linhas: [["lista: 10 milhões de senhas", ""], ["alvo: sistema novo", ""], ["aguardando a senha…", ""]], contador: true },
  padrao: { linhas: [["123456", "x"], ["senha123", "x"], ["{Slug}2026!", "v"]], fim: "ACESSO LIBERADO" },
  vazamento: { linhas: [["vazamento_streaming.txt", ""], ["e-mail pessoal", "v"], ["sistema {EMPRESA}", "v"]], fim: "ACESSO LIBERADO" },
  frase: { linhas: [["123456", "x"], ["senha123", "x"], ["{Slug}2026!", "x"], ["tempo estimado: séculos", ""]], fim: "SEM SUCESSO", bom: true, contador: true },
  segundo: { linhas: [["senha (vazamento)", "v"], ["segunda etapa", "x"], ["enviando pedidos…", ""]], contador: true },
  entrou: { linhas: [["senha", "v"], ["aprovação do usuário", "v"]], fim: "ACESSO LIBERADO" },
  negado: { linhas: [["aprovação do usuário", "x"], ["senha alterada", "x"]], fim: "ACESSO NEGADO", bom: true },
  falha: { linhas: [["tentativa 1.000.000", "x"], ["tentativa 2.000.000", "x"], ["segunda etapa", "x"]], fim: "ACESSO NEGADO", bom: true, contador: true },
  pinga: { linhas: [["clientes_FINAL.xlsx", ""], ["link público: qualquer um", ""]], fim: "VAZANDO…" }
});

/* ===================== Telas dentro da cena ===================== */
/* st.senha: o que está digitado no campo "Nova senha" (null, padrao, repetida, frase) */
const SENHA_DIGITADA = { padrao: "{Slug}2026!", repetida: "••••••••••••", frase: "girassol-trator-nuvem-pipoca" };
const REGRAS = [
  ["frase", "Tamanho vence complicação", "Frase-senha com 4 palavras ou mais, que só você conheça. Nada de nome, data, time, empresa ou sequência de teclado."],
  ["unica", "Uma senha para cada lugar", "Se um site vazar, só aquela porta fica aberta."],
  ["cofre", "Gerenciador de senhas", "Ele cria e guarda senhas fortes por você. Pergunte ao TI qual a {EMPRESA} recomenda."],
  ["dupla", "Verificação em duas etapas", "Mesmo com a senha, ninguém entra sem o segundo passo."]
];
Object.assign(SCREENS, {
  novaSenha(st) { return `<div class="closeup mon">${SCREENS._novaSenha(st)}</div>`; },
  _novaSenha(st = {}) {
    const v = SENHA_DIGITADA[st.senha];
    return `<div class="browser">
      <div class="urlbar"><span class="dots"><i></i><i></i><i></i></span><span class="url url-ok">https://acesso.${esc(CONFIG.dominioOficial)}/primeiro-acesso</span></div>
      <div class="portal-head">${logoHTML()}<span>Primeiro acesso · Sistema novo · ${esc(CONFIG.empresa)}</span></div>
      <div class="form">
        <label>Usuário</label><div class="field">seu.nome</div>
        <label>Crie sua senha</label><div class="field${v ? "" : " cursor"}">${v ? (st.digitar ? `<span class="digita" style="--n:${[...fmt(v)].length}">${esc(fmt(v))}</span>` : esc(fmt(v))) : ""}</div>
        ${st.senha === "repetida" ? `<span class="small-note">A mesma do seu e-mail pessoal.</span>` : `<span class="small-note">Mínimo de 12 caracteres.</span>`}
        <span class="submit">Criar senha</span>
      </div></div>`;
  },
  regras(st) {
    const atual = st.hl === "todos" ? REGRAS.length - 1 : REGRAS.findIndex(r => r[0] === st.hl);
    return `<div class="fullmail regras"><div class="regras-card">
      <p class="rg-k">Esquadrão Sentinela · Chave-Mestra</p><h3>As 4 regras da chave</h3>
      <ol>${REGRAS.map(([k, t, d], i) => `<li class="${i > atual ? "" : i === atual && st.hl !== "todos" ? "on now" : "on"}"><span class="n">${i + 1}</span><span><b>${esc(t)}</b><small>${esc(fmt(d))}</small></span></li>`).join("")}</ol>
    </div>
    ${st.hl === "todos" ? `<p class="clue">Uma chave só não basta. E a senha é só sua: ninguém do TI, do banco ou da diretoria pede. <b>Nem o código.</b></p>` : ""}
    </div>`;
  },
  push(st) { return `<div class="onphone">${SCREENS._push(st)}</div>`; },
  _push(st = {}) {
    const n = Math.max(1, st.pushes || 3);
    const hora = ["23:04", "23:05", "23:05", "23:06"];
    return `<div class="phone-ui ph-noite">
      <div class="ph-relogio">23:06<small>Quarta-feira</small></div>
      <div class="ph-body">${Array.from({ length: n }, (_, i) => `<div class="pushn" style="animation-delay:${i * .35}s">
        <p class="pn-app"><b>${esc(CONFIG.empresa)} · Acesso</b><span>${hora[i] || "23:06"}</span></p>
        <p class="pn-t">Você está tentando entrar?</p><p class="pn-d">Novo login · Windows · local desconhecido</p>
        <p class="pn-bts"><span>Negar</span><span>Aprovar</span></p></div>`).reverse().join("")}</div></div>`;
  },
  aprovado() {
    return `<div class="onphone"><div class="phone-ui ph-noite">
      <div class="ph-relogio">23:07<small>Quarta-feira</small></div>
      <div class="ph-body"><div class="pushn so"><p class="pn-app"><b>${esc(CONFIG.empresa)} · Acesso</b><span>23:07</span></p>
        <p class="pn-t">Login aprovado</p><p class="pn-d">Bem-vindo de volta. Dispositivo novo conectado.</p></div></div></div></div>`;
  },
  negado() {
    return `<div class="onphone"><div class="phone-ui">
      <div class="ph-head">${esc(CONFIG.empresa)} · Acesso<small>Segurança da conta</small></div>
      <div class="ph-body"><div class="app-card">
        <span class="ok-pill">Login negado</span><span class="ok-pill">Senha alterada</span><span class="ok-pill">Central Sentinela avisada</span>
        <span class="small-note">Ninguém entrou. Você está protegido.</span>
      </div></div></div></div>`;
  },
  passos2(st) {
    const items = ["Troque a senha na hora, começando pelo e-mail.", "Troque em todo lugar onde usava a mesma.", "Avise o TI pelo canal oficial.", "Ligue a verificação em duas etapas."];
    return `<div class="closeup" style="left:7.8%;top:16%;width:52%"><div class="steps-card"><h3>Senha vazou? Os 4 passos</h3><ol>
      ${items.map((t, i) => `<li class="${i + 1 === st.step ? "on" : i + 1 < st.step ? "done" : ""}"><span class="n">${i + 1}</span><span>${t}</span></li>`).join("")}
      </ol></div></div>`;
  },
  report2() {
    return `<div class="closeup" style="left:7.8%;top:28%;width:52%"><div class="report-card">
      <span class="k">${esc(CONFIG.empresa)} · canal de reporte</span>
      <span class="v">${esc(CONFIG.canalReporte)}</span>
      <span>${esc(CONFIG.contatoAlternativo)}</span>
    </div></div>`;
  }
});

/* ===================== Roteiro ===================== */
/* Estado-base: limpa o que vem de outras cenas. radioHeroi: quem fala pelo comunicador; insignia: a que gira no "badge" */
const M2 = { lupa: false, lupaPose: null, isca: null, screen: null, fx: null, hl: null, step: 0, heroi: null, term: null, senha: null, pushes: 0, selo: null, digitar: false, heroiPose: null, cara: null, radioHeroi: "chave", insignia: "chave", fundos: "m2",
  vilao: null, vilaoPose: null, caraVilao: null, fxVilao: null };
const XP2 = { classifica: 20, perfeito: 50 };

Object.assign(SCENES, {
  /* ---------- Trecho 1 · Abertura ---------- */
  f1: { m: 2, cap: 1, type: "lines", next: "fd1", stage: { ...M2, bg: "office", screen: "novaSenha" }, lines: [
    { who: N, t: "Quarta-feira, 9 da manhã. O TI acabou de liberar o seu acesso ao sistema novo da {EMPRESA}." },
    { who: N, t: "Falta só uma coisa: criar a sua senha." },
    { who: N, t: "Enquanto isso, numa sala escura, alguém já está aquecendo os dedos.", set: { bg: "dark", screen: null, term: "aquece", vilao: "forca", vilaoPose: "aquece" } },
    { who: F, t: "Mais um recruta criando senha… Adoro esse momento. Vai, me dá um 123456." },
    { who: H, t: "Calma aí, recruta. Antes de digitar, pensa como ela.", set: { heroiPose: "aponta", bg: "office", screen: "novaSenha", term: null, heroi: "chave" } },
    { who: H, t: "Prazer, Chave-Mestra, do Esquadrão Sentinela. Eu cuido das portas, e a senha é a porta da frente.", set: { heroiPose: "cruzado" } },
    { who: H, t: "Ela testa milhões de senhas por segundo. Então: qual vai ser a sua?", set: { heroiPose: "aponta" } }
  ]},
  fd1: { m: 2, cap: 1, type: "decision", tela: "_novaSenha", prompt: "Que senha você cria?", options: [
    { t: "{Slug}2026! · tem maiúscula, número e símbolo", go: "f2a", tag: "Decisão 1: nome da empresa + ano", xp: 20, motivo: "Errar também ensina" },
    { t: "A mesma do meu e-mail pessoal, assim não esqueço", go: "f2b", tag: "Decisão 1: repetiu a senha", xp: 10, motivo: "Errar também ensina" },
    { t: "Uma frase só minha, com 4 palavras ou mais", go: "f2c", tag: "Decisão 1: frase-senha longa", xp: 100, motivo: "Frase-senha criada", conq: "frase" }
  ]},

  /* ---------- Trecho 2 · Consequência (uma por escolha) ---------- */
  f2a: { m: 2, cap: 2, type: "lines", next: "f3", stage: { ...M2, bg: "office", screen: "novaSenha" }, lines: [
    { who: N, t: "Você digita {Slug}2026! e confirma. Senha aceita.", set: { digitar: true, senha: "padrao" } },
    { who: N, t: "Do outro lado, a lista da Força Bruta começa pelo mais óbvio.", set: { digitar: false, bg: "dark", screen: null, term: "padrao", vilao: "forca", vilaoPose: "le" } },
    { who: F, t: "Nome da empresa, ano, ponto de exclamação. Clássico! Esse padrão está no topo da minha lista." },
    { who: F, t: "Achei! Bom dia, sistema novo da {EMPRESA}.", impacto: true, set: { vilaoPose: "soco", caraVilao: "gargalhando", fxVilao: "soco" } },
    { who: H, t: "Acontece com muita gente. Parece forte porque tem maiúscula, número e símbolo, mas é o padrão que todo mundo usa.", set: { heroiPose: "pensa", bg: "office", screen: "novaSenha", term: null, heroi: "chave" } },
    { who: H, t: "Força bruta não adivinha: testa listas. Vamos voltar a fita e ver o que ela não consegue testar.", set: { heroiPose: "aponta", fx: "rewind" } }
  ]},
  f2b: { m: 2, cap: 2, type: "lines", next: "f3", stage: { ...M2, bg: "office", screen: "novaSenha" }, lines: [
    { who: N, t: "Você repete a senha do seu e-mail pessoal. Fácil de lembrar.", set: { digitar: true, senha: "repetida" } },
    { who: N, t: "Só que, no ano passado, um site de streaming onde você usava essa mesma senha foi invadido.", set: { digitar: false, bg: "dark", screen: null, term: "vazamento", vilao: "forca", vilaoPose: "le" } },
    { who: F, t: "Lista de vazamento, minha leitura favorita. Uma senha, e eu testo em todo lugar." },
    { who: F, t: "E-mail pessoal… entrei. Sistema da {EMPRESA}… entrei também!", impacto: true, set: { vilaoPose: "comemora", caraVilao: "gargalhando" } },
    { who: H, t: "Senha repetida vira uma chave-mestra na mão do bandido. E esse nome já tem dono.", set: { heroiPose: "cruzado", bg: "office", screen: "novaSenha", term: null, heroi: "chave" } },
    { who: H, t: "Um vazamento em qualquer site abre todas as portas onde a senha se repete. Vamos voltar a fita.", set: { heroiPose: "pensa", fx: "rewind" } }
  ]},
  f2c: { m: 2, cap: 2, type: "lines", next: "f3", stage: { ...M2, bg: "office", screen: "novaSenha" }, lines: [
    { who: N, t: "Você cria uma frase só sua, com quatro palavras sem relação entre si.", set: { digitar: true, senha: "frase" } },
    { who: N, t: "A Força Bruta começa a testar.", set: { digitar: false, bg: "dark", screen: null, term: "frase", vilao: "forca", vilaoPose: "insiste" } },
    { who: F, t: "Quatro palavras?! Sem nome, sem data, sem nada pra eu adivinhar? Isso não vale!", impacto: true, set: { vilaoPose: "furiosa", caraVilao: "furiosa" } },
    { who: H, t: "Vale sim. Jogada de mestre, recruta.", set: { heroiPose: "comemora", bg: "office", screen: "novaSenha", term: null, heroi: "chave", fx: "stamp", selo: "Frase de Ferro" } },
    { who: H, t: "Tamanho vence complicação. Frase longa é fácil pra você lembrar e demorada demais pra ela adivinhar.", set: { heroiPose: "cruzado", fx: null } },
    { who: H, t: "Agora deixa eu te mostrar as regras da chave.", set: { heroiPose: "aponta" } }
  ]},

  /* ---------- Trecho 3 · A lição da Chave-Mestra ---------- */
  f3: { m: 2, cap: 3, type: "lines", next: "f4", stage: { ...M2, bg: "central", heroi: "chave", heroiPose: "pensa" }, lines: [
    { who: H, t: "Força bruta é isso: um programa testando senhas, uma atrás da outra, até acertar. Ele não cansa." },
    { who: H, t: "Ele começa pelas mais comuns, pelos padrões e pelas senhas que já vazaram. Contra isso, quatro regras.", set: { screen: "regras", heroiPose: "aponta" } },
    { who: H, t: "Um: tamanho vence complicação. Use uma frase-senha, com quatro palavras ou mais, que só você conheça.", set: { hl: "frase" } },
    { who: H, t: "Nada de nome, data de nascimento, time, nome da empresa ou sequência de teclado. Isso é o começo da lista dela. E não copie os exemplos daqui: crie a sua." },
    { who: H, t: "Dois: uma senha para cada lugar. Se um site vazar, só aquela porta fica aberta.", set: { hl: "unica" } },
    { who: H, t: "Três: use um gerenciador de senhas. Ele cria e guarda senhas fortes por você. Pergunte ao TI qual a {EMPRESA} recomenda.", set: { hl: "cofre" } },
    { who: H, t: "Quatro: ligue a verificação em duas etapas. Mesmo com a senha, ninguém entra sem o segundo passo.", set: { heroiPose: "token", hl: "dupla" } },
    { who: H, t: "E a senha é só sua. Ninguém do TI, do banco ou da diretoria vai pedir. Nem o código. Uma chave só não basta.", set: { heroiPose: "escudo", hl: "todos" } }
  ]},

  /* ---------- Trecho 4 · Desafio: fraca ou forte? ---------- */
  f4: { m: 2, cap: 4, type: "classificar", next: "f5", stage: { ...M2, bg: "central", heroi: "chave", heroiPose: "cruzado" },
    prompt: "Desafio: a Força Bruta adivinharia? Classifique cada senha.", cats: ["Fraca", "Forte"], xp: XP2.classifica, perfeito: XP2.perfeito, conq: "padroes",
    itens: [
      { t: "Fernanda1987", c: 0, e: "Nome e ano de nascimento estão nas redes sociais. É dos primeiros palpites." },
      { t: "girassol-trator-nuvem-pipoca", c: 1, e: "Quatro palavras sem relação: longa, fácil de lembrar e difícil de adivinhar." },
      { t: "123456", c: 0, e: "A senha mais usada do mundo. É a primeira tentativa de qualquer ataque." },
      { t: "P@ssw0rd!", c: 0, e: "Trocar letra por símbolo não engana: os programas já testam essas trocas." },
      { t: "minha tia faz bolo de fubá às quintas", c: 1, e: "Frase longa e pessoal, sem dado público. Tamanho é força." },
      { t: "{Slug}2026!", c: 0, e: "Nome da empresa + ano + símbolo: um dos primeiros padrões testados." }
    ],
    fala: { who: H, nome: "Chave-Mestra", cls: "chave", a: "f4_01_chave-mestra.mp3", t: "Repara: as fracas parecem complicadas, mas seguem padrões. As fortes são só longas e imprevisíveis. É isso que trava a Força Bruta." } },

  /* ---------- Trecho 5 · Virada: a Força Bruta muda de tática ---------- */
  f5: { m: 2, cap: 5, type: "lines", next: "fd2", stage: { ...M2, bg: "dark", term: "segundo", vilao: "forca", vilaoPose: "furiosa" }, lines: [
    { who: N, t: "A Força Bruta, irritada, troca de tática." },
    { who: F, t: "Senha eu acho num vazamento qualquer. O problema é essa tal de segunda etapa… Então eu insisto. Até alguém cansar.", set: { vilaoPose: "insiste" } },
    { who: N, t: "Onze da noite. Seu celular não para de vibrar.", set: { bg: "phone", term: null, screen: "push", pushes: 1 } },
    { who: N, t: "Pedido de login. E de novo. E de novo.", set: { pushes: 3 } },
    { who: H, t: "Recruta, olha a hora. Você está tentando entrar em algum lugar agora?", radio: "dir", set: { cara: "serio" } }
  ]},
  fd2: { m: 2, cap: 5, type: "decision", tela: "_push", timer: 10, prompt: "Decida rápido: o que você faz?", timeoutGo: "f6b",
    timeoutTag: "Decisão 2: tempo esgotado", timeoutTxt: "Sem problema: veja o que a Chave-Mestra faria.", options: [
    { t: "Aprovar, só pra parar de apitar", go: "f6a", tag: "Decisão 2: aprovou o login", xp: 10, motivo: "Errar também ensina" },
    { t: "Negar, trocar a senha e avisar o TI", go: "f6b", tag: "Decisão 2: negou e avisou o TI", xp: 100, motivo: "Segunda trava fechada", conq: "trava", reflexo: "dedo" }
  ]},

  /* ---------- Trecho 6 · Consequência da virada ---------- */
  f6a: { m: 2, cap: 5, type: "lines", next: "f7", stage: { ...M2, bg: "phone", screen: "push", pushes: 3 }, lines: [
    { who: N, t: "Você toca em Aprovar. O celular, enfim, fica quieto.", set: { screen: "aprovado" } },
    { who: F, t: "Obrigada pela ajuda! Entrei pela porta da frente, com a sua autorização.", impacto: true, set: { bg: "dark", screen: null, term: "entrou", vilao: "forca", vilaoPose: "reverencia", caraVilao: "piscando" } },
    { who: H, t: "Pedido que você não fez quer dizer uma coisa: alguém já tem a sua senha.", radio: "dir", set: { cara: "preocupado", bg: "phone", screen: "aprovado", term: null } },
    { who: H, t: "Nunca aprove o que você não pediu. Negue, troque a senha e avise o TI na hora.", radio: "dir", set: { cara: null } }
  ]},
  f6b: { m: 2, cap: 5, type: "lines", next: "f7", stage: { ...M2, bg: "phone", screen: "push", pushes: 3 }, lines: [
    { who: N, t: "Você toca em Negar, troca a senha e avisa a Central Sentinela.", set: { screen: "negado" } },
    { who: F, t: "Negado?! E ainda trocou a senha? Volta tudo pro começo da lista!", impacto: true, set: { bg: "dark", screen: null, term: "negado", vilao: "forca", vilaoPose: "furiosa", caraVilao: "furiosa", fxVilao: "racha" } },
    { who: H, t: "Isso! A senha caiu, mas a segunda trava segurou a porta.", radio: "dir", set: { cara: "rindo", bg: "phone", screen: "negado", term: null } },
    { who: H, t: "Uma chave só não basta. Por isso a gente usa duas.", radio: "dir", set: { cara: "piscando" } }
  ]},

  /* ---------- Trecho 7 · E se a minha senha vazar? ---------- */
  f7: { m: 2, cap: 6, type: "lines", next: "f8", stage: { ...M2, bg: "central", heroi: "chave", heroiPose: "pensa", step: 0 }, lines: [
    { who: H, t: "Agora a parte mais importante do treinamento." },
    { who: H, t: "Senhas vazam, até de sites grandes. Muitas vezes nem é culpa sua." },
    { who: H, t: "O que importa é agir rápido quando você desconfia." },
    { who: H, t: "Primeiro: troque a senha na hora, começando pelo e-mail, que recupera todas as outras.", set: { heroiPose: "aponta", screen: "passos2", step: 1 } },
    { who: H, t: "Segundo: troque em todo lugar onde você usava a mesma senha.", set: { step: 2 } },
    { who: H, t: "Terceiro: avise o TI pelo canal oficial. Eles conferem acessos estranhos e bloqueiam a tempo.", set: { step: 3 } },
    { who: H, t: "Quarto: ligue a verificação em duas etapas onde ainda não estiver ligada.", set: { heroiPose: "token", step: 4 } },
    { who: H, t: "Ninguém vai te culpar por avisar. O estrago vem do silêncio.", set: { heroiPose: "cruzado", screen: "report2" } }
  ]},

  /* ---------- Trecho 8 · Desfecho ---------- */
  f8: { m: 2, cap: 7, type: "lines", next: "fquiz", stage: { ...M2, bg: "dark", term: "falha", vilao: "forca", vilaoPose: "insiste" }, lines: [
    { who: N, t: "Na sala escura, a Força Bruta tenta de novo…" },
    { who: N, t: "…mas cada porta da {EMPRESA} agora tem frase longa e segunda trava.", set: { vilaoPose: "furiosa" } },
    { who: F, t: "Isso não acaba aqui! Um dia alguém vai repetir uma senha…", impacto: true, set: { vilaoPose: "ameaca", caraVilao: "malicioso" } },
    { who: H, t: "E nesse dia você vai lembrar: uma chave só não basta.", set: { heroiPose: "escudo", bg: "central", term: null, heroi: "chave" } },
    { who: H, t: "Segunda insígnia conquistada, recruta. O esquadrão está ficando forte.", set: { heroiPose: "comemora", fx: "badge" } },
    { who: N, t: "Enquanto isso, em algum lugar, uma planilha esquecida começa a pingar…", set: { bg: "dark", heroi: null, fx: null, term: "pinga", vilao: null } },
    { who: N, t: "Próxima missão: O Vazamento." }
  ]},
  fquiz: { m: 2, cap: 8, type: "quiz", next: "ffim", stage: { ...M2, bg: "central", heroi: "chave", heroiPose: "cruzado" } },
  ffim: { m: 2, cap: 8, type: "end", stage: { ...M2, bg: "central", heroi: "chave", heroiPose: "comemora", fx: "badge" } }
});

/* ===================== Quiz e fecho ===================== */
QUIZZES[2] = [
  { q: "Qual destas senhas a Força Bruta teria mais dificuldade para adivinhar?",
    o: ["{Slug}@2026", "Tr0c@d0r!", "cafe-janela-trovao-bicicleta"], c: 2,
    e: "Tamanho vence complicação: quatro palavras sem relação valem mais que trocar letra por símbolo." },
  { q: "Um site onde você tem conta foi invadido e as senhas vazaram. Você usava a mesma senha no seu e-mail. O que fazer?",
    o: ["Nada, o vazamento foi só naquele site", "Trocar a senha do e-mail e de todo lugar onde ela se repetia", "Esperar o site mandar um aviso"], c: 1,
    e: "Senha vazada é testada em todo lugar. Troque onde ela se repete, começando pelo e-mail." },
  { q: "Onze da noite, chegam pedidos de login que você não fez. O que você faz?",
    o: ["Aprova, para as notificações pararem", "Nega, troca a senha e avisa o TI", "Ignora e vai dormir"], c: 1,
    e: "Pedido que você não fez quer dizer que alguém já tem a sua senha. Negue e troque a senha antes que ela insista." },
  { q: "Alguém liga dizendo ser do TI e pede o código que acabou de chegar no seu celular, “para validar seu acesso”. Você:",
    o: ["Passa o código, é do TI", "Não passa. Ninguém pede código nem senha; desliga e avisa o TI pelo canal oficial", "Passa só metade do código"], c: 1,
    e: "O código é a segunda trava. Quem pede o código está tentando abrir a sua porta." },
  { q: "Qual o jeito mais seguro de lidar com dezenas de senhas diferentes?",
    o: ["Anotar todas num papel colado no monitor", "Usar a mesma senha forte em tudo", "Usar um gerenciador de senhas, como o que o TI recomenda"], c: 2,
    e: "O gerenciador cria e guarda uma senha diferente para cada lugar. Você só precisa lembrar de uma frase forte." }
];
FINAIS[2] = { insignia: "chave", gabarito: "gabarito2", ganhou: "Insígnia da Chave-Mestra conquistada. Suas portas agora têm frase longa e segunda trava.", dica: "as explicações da Chave-Mestra ajudam." };

Object.assign(MISSOES.find(m => m.n === 2), { inicio: "f1", disponivel: true });
