/* Elenco e cenários do Esquadrão Sentinela.
   Lupa e Isca usam as folhas de modelo aprovadas (assets/personagens).
   Os demais usam figuras provisórias em SVG até a arte deles ser gerada. */
(() => {
  const ARTE = 'assets/personagens/';

  // ---------- figuras provisórias ----------
  function figura({ casaco, gola = casaco, calca = '#1d2433', pele = '#b07a55', cabelo = '#1b1b22', largura = 1, extra = '', olhos = '#1b1b22', peito = '' }) {
    const w = 64 * largura;
    return `<svg viewBox="0 0 200 460" aria-hidden="true">
      <ellipse cx="100" cy="452" rx="${58 * largura}" ry="7" fill="rgba(0,0,0,.28)"/>
      <rect x="${100 - w / 2 + 8}" y="300" width="${w / 2 - 12}" height="138" rx="10" fill="${calca}" stroke="#111" stroke-width="3"/>
      <rect x="${104}" y="300" width="${w / 2 - 12}" height="138" rx="10" fill="${calca}" stroke="#111" stroke-width="3"/>
      <rect x="${100 - w / 2 + 2}" y="418" width="${w / 2 - 2}" height="30" rx="8" fill="#151820" stroke="#111" stroke-width="3"/>
      <rect x="${102}" y="418" width="${w / 2 - 2}" height="30" rx="8" fill="#151820" stroke="#111" stroke-width="3"/>
      <path d="M${100 - w / 2} 130 Q100 112 ${100 + w / 2} 130 L${100 + w / 2 + 14} 340 L${100 - w / 2 - 14} 340 Z" fill="${casaco}" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${100 - w / 2 - 2} 136 L${100 - w / 2 - 22} 280 L${100 - w / 2 - 6} 284 L${100 - w / 2 + 12} 170 Z" fill="${casaco}" stroke="#111" stroke-width="3"/>
      <path d="M${100 + w / 2 + 2} 136 L${100 + w / 2 + 22} 280 L${100 + w / 2 + 6} 284 L${100 + w / 2 - 12} 170 Z" fill="${casaco}" stroke="#111" stroke-width="3"/>
      <circle cx="${100 - w / 2 - 14}" cy="290" r="10" fill="${pele}" stroke="#111" stroke-width="3"/>
      <circle cx="${100 + w / 2 + 14}" cy="290" r="10" fill="${pele}" stroke="#111" stroke-width="3"/>
      <path d="M78 120 L100 150 L122 120 Z" fill="${gola}" stroke="#111" stroke-width="3"/>
      ${peito}
      <rect x="90" y="100" width="20" height="22" fill="${pele}" stroke="#111" stroke-width="3"/>
      <ellipse cx="100" cy="72" rx="34" ry="38" fill="${pele}" stroke="#111" stroke-width="3"/>
      <path d="M64 70 Q62 30 100 30 Q140 30 136 70 Q122 50 100 52 Q78 50 64 70 Z" fill="${cabelo}" stroke="#111" stroke-width="3"/>
      <circle cx="87" cy="76" r="4.5" fill="${olhos}"/><circle cx="113" cy="76" r="4.5" fill="${olhos}"/>
      <path d="M90 94 Q100 100 110 94" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/>
      ${extra}
    </svg>`;
  }

  const forcaBruta = () => {
    let teclas = '';
    const letras = '123456QWERTYASDFGH!@#$%&ZXCVBN';
    let k = 0;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) {
      const x = 30 + c * 30 + (r % 2) * 6, y = 120 + r * 50;
      teclas += `<g><rect x="${x}" y="${y}" width="26" height="44" rx="5" fill="#3b3f4a" stroke="#0d0f14" stroke-width="3"/><text x="${x + 13}" y="${y + 28}" font-size="15" text-anchor="middle" fill="#9aa3b5" font-family="monospace">${letras[k++ % letras.length]}</text></g>`;
    }
    return `<svg viewBox="0 0 200 460" aria-hidden="true">
      <ellipse cx="100" cy="452" rx="80" ry="8" fill="rgba(0,0,0,.35)"/>
      <rect x="22" y="420" width="64" height="30" rx="6" fill="#2a2d35" stroke="#0d0f14" stroke-width="3"/>
      <rect x="114" y="420" width="64" height="30" rx="6" fill="#2a2d35" stroke="#0d0f14" stroke-width="3"/>
      ${teclas}
      <rect x="-4" y="140" width="34" height="150" rx="10" fill="#2f333d" stroke="#0d0f14" stroke-width="3"/>
      <rect x="170" y="140" width="34" height="150" rx="10" fill="#2f333d" stroke="#0d0f14" stroke-width="3"/>
      <rect x="44" y="20" width="112" height="92" rx="14" fill="#2f333d" stroke="#0d0f14" stroke-width="3"/>
      <rect x="64" y="52" width="26" height="12" rx="3" fill="#ff2e3b" class="olho-brilho"/>
      <rect x="110" y="52" width="26" height="12" rx="3" fill="#ff2e3b" class="olho-brilho"/>
      <path d="M70 88 L130 88" stroke="#ff2e3b" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  };

  const vazamento = () => `<svg viewBox="0 0 220 300" aria-hidden="true">
      <defs><linearGradient id="gosma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ef0c4"/><stop offset="1" stop-color="#1f9e7a"/></linearGradient></defs>
      <path d="M40 270 Q20 180 60 120 Q90 60 120 70 Q170 80 175 150 Q182 210 200 268 Q160 290 130 276 Q110 296 84 280 Q60 292 40 270 Z" fill="url(#gosma)" stroke="#0e3b2f" stroke-width="4" opacity=".92"/>
      <path d="M70 130 Q80 100 104 96" fill="none" stroke="#e8fff6" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      <ellipse cx="100" cy="150" rx="11" ry="15" fill="#0e3b2f"/><ellipse cx="140" cy="152" rx="11" ry="15" fill="#0e3b2f"/>
      <circle cx="104" cy="145" r="4" fill="#fff"/><circle cx="144" cy="147" r="4" fill="#fff"/>
      <path d="M108 190 Q122 200 138 190" fill="none" stroke="#0e3b2f" stroke-width="4" stroke-linecap="round"/>
      <path d="M60 268 Q58 292 64 298 M176 262 Q182 288 176 296" stroke="#1f9e7a" stroke-width="8" stroke-linecap="round"/>
    </svg>`;

  const ELENCO = {
    narrador: { nome: 'Narrador' },
    recruta: { nome: 'Você' },
    lupa: {
      nome: 'Lupa', cor: '#2f7f86', arte: true, rosto: 'falando',
      poses: ['frente', 'tres-quartos', 'perfil', 'costas']
    },
    isca: {
      nome: 'Isca', cor: '#c0392b', arte: true,
      poses: ['frente', 'tres-quartos', 'perfil', 'costas', 'lancando', 'fisgou', 'tonto', 'rede', 'apresentando', 'apontando', 'tramando']
    },
    trava: {
      nome: 'Trava', cor: '#d9a43a', provisorio: true,
      svg: () => figura({
        casaco: '#5b6b82', gola: '#d9a43a', largura: 1.45, pele: '#8a5a3c', cabelo: '#2a2a2a',
        peito: '<rect x="80" y="170" width="40" height="34" rx="6" fill="#d9a43a" stroke="#111" stroke-width="3"/><path d="M88 170 v-12 a12 12 0 0 1 24 0 v12" fill="none" stroke="#111" stroke-width="4"/>',
        extra: '<g transform="translate(150 200)"><path d="M0 0 h50 v46 q0 26 -25 40 q-25 -14 -25 -40 Z" fill="#d9a43a" stroke="#111" stroke-width="3"/><circle cx="25" cy="34" r="7" fill="#111"/><rect x="22" y="38" width="6" height="16" fill="#111"/></g>'
      })
    },
    iris: {
      nome: 'Íris', cor: '#8e6bd8', provisorio: true,
      svg: () => figura({
        casaco: '#6d55b5', gola: '#c9b8f5', pele: '#d8a984', cabelo: '#5a2f1d', olhos: '#7ff3ff',
        extra: '<circle cx="87" cy="76" r="9" fill="#7ff3ff" opacity=".35"/><circle cx="113" cy="76" r="9" fill="#7ff3ff" opacity=".35"/><g transform="translate(150 110)"><g class="flutua"><rect width="46" height="46" rx="6" fill="#c9b8f5" stroke="#111" stroke-width="3"/><circle cx="23" cy="23" r="11" fill="none" stroke="#111" stroke-width="3"/><path d="M23 12 v22 M12 23 h22" stroke="#111" stroke-width="2"/></g></g>'
      })
    },
    eco: {
      nome: 'Eco', cor: '#e07a4f', provisorio: true,
      svg: () => figura({
        casaco: '#e07a4f', gola: '#f3c06b', pele: '#c48a5f', cabelo: '#2b1d14',
        extra: '<path d="M62 74 Q62 30 100 30 Q138 30 138 74" fill="none" stroke="#222" stroke-width="7"/><rect x="54" y="64" width="16" height="26" rx="6" fill="#333"/><rect x="130" y="64" width="16" height="26" rx="6" fill="#333"/><path d="M160 60 q12 18 0 36 M172 50 q20 28 0 56" fill="none" stroke="#f3c06b" stroke-width="4" stroke-linecap="round" class="ondas"/>'
      })
    },
    forca: { nome: 'A Força Bruta', cor: '#ff2e3b', provisorio: true, svg: forcaBruta },
    vazamento: { nome: 'Vazamento', cor: '#2fbf8f', provisorio: true, svg: vazamento },
    camaleao: {
      nome: 'Camaleão', cor: '#5cbf4a', provisorio: true,
      svg: () => `<div class="camaleao-pele">${figura({
        casaco: '#3d7f45', gola: '#cfe8c6', pele: '#86c27a', cabelo: '#2d5a2c',
        peito: '<g><rect x="60" y="180" width="36" height="46" rx="4" fill="#fff" stroke="#111" stroke-width="2"/><rect x="66" y="186" width="24" height="18" fill="#9ec5ff"/><rect x="66" y="210" width="24" height="4" fill="#555"/><rect x="66" y="217" width="16" height="4" fill="#555"/></g>'
      })}</div>`
    }
  };

  // ---------- cenários provisórios ----------
  const janelas = (n, acesas) => Array.from({ length: n }, (_, i) => `<i class="janela${acesas.includes(i) ? ' acesa' : ''}"></i>`).join('');
  const skyline = () => `<div class="skyline">${[38, 62, 46, 80, 54, 70, 42, 58, 66, 36].map((h, i) => `<span style="height:${h}%;--d:${i}"></span>`).join('')}</div>`;

  const CENARIOS = {
    telhado: () => `<div class="cn-ceu"><div class="cn-lua"></div><div class="cn-estrelas"></div></div>${skyline()}
      <div class="cn-predio"><div class="cn-placa" data-empresa></div><div class="cn-janelas">${janelas(40, [3, 9, 17, 22, 31])}</div></div>
      <div class="cn-beiral"></div>`,
    escritorio: () => `<div class="cn-parede"></div><div class="cn-janela-escritorio"><div class="cn-ceu-dia"></div>${skyline()}</div>
      <div class="cn-luminaria"></div><div class="cn-planta"></div><div class="cn-mesa"><div class="cn-monitor"></div><div class="cn-caneca"></div></div>`,
    central: () => `<div class="cn-central"><div class="cn-telao"><div class="cn-mapa"></div><div class="cn-telao-logo" data-canal></div></div>
      <div class="cn-sirene"></div><div class="cn-consoles"><span></span><span></span><span></span></div></div>`,
    celular: () => `<div class="cn-desfoque"></div>`,
    'sala-escura': () => `<div class="cn-sala-escura"><div class="cn-brilho-vermelho"></div><div class="cn-codigo"></div></div>`,
    corredor: () => `<div class="cn-corredor"><div class="cn-fundo-corredor"></div><div class="cn-porta"><span class="cn-leitor"></span></div><div class="cn-piso"></div></div>`,
    casa: () => `<div class="cn-casa"><div class="cn-janela-noite"><div class="cn-lua"></div></div><div class="cn-abajur"></div><div class="cn-mesa casa"><div class="cn-monitor"></div></div></div>`
  };

  function spriteDe(id, pose) {
    const p = ELENCO[id];
    if (!p) return '';
    if (p.arte) {
      const nome = p.poses.includes(pose) ? pose : 'frente';
      return `<img src="${ARTE}${id}-${nome}.webp" alt="" draggable="false">`;
    }
    return p.svg ? p.svg() + (p.provisorio ? '<span class="arte-provisoria">arte provisória</span>' : '') : '';
  }

  function rostoDe(id, expressao) {
    const p = ELENCO[id];
    if (!p || id === 'narrador') return '';
    if (id === 'lupa') return `<img src="${ARTE}lupa-rosto-${expressao || p.rosto}.webp" alt="">`;
    if (id === 'isca') return `<span class="rosto-recorte" style="background-image:url(${ARTE}isca-frente.webp)"></span>`;
    return `<span class="rosto-inicial" style="--c:${p.cor}">${p.nome.replace('A ', '')[0]}</span>`;
  }

  window.SentinelaElenco = { ELENCO, CENARIOS, spriteDe, rostoDe, ARTE };
})();
