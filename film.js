/* Um Clique — curta interativo de cybersegurança.
   Motor pequeno de cenas: canvas para os cenários, camadas DOM para interfaces, legendas e decisões. */
(() => {
  const film = document.getElementById('film');
  if (!film) return;

  const canvas = document.getElementById('film-canvas');
  const ctx = canvas.getContext('2d');
  const stage = document.getElementById('film-stage');
  const subtitle = document.getElementById('film-subtitle');
  const speakerEl = subtitle.querySelector('.film-speaker');
  const lineEl = subtitle.querySelector('p');
  const choiceEl = document.getElementById('film-choice');
  const flashEl = document.getElementById('film-flash');
  const slateEl = document.getElementById('film-slate');
  const sceneNoEl = document.getElementById('film-scene-no');
  const sceneNameEl = document.getElementById('film-scene-name');
  const sceneCountEl = document.getElementById('film-scene-count');
  const progressEl = document.getElementById('film-progress-bar');
  const scoreEl = document.getElementById('film-score');
  const pauseBtn = document.getElementById('film-pause');
  const soundBtn = document.getElementById('film-sound');
  const voiceBtn = document.getElementById('film-voice');
  const skipBtn = document.getElementById('film-skip');
  const closeBtn = document.getElementById('film-close');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- utilidades ----------
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const pad = n => String(n).padStart(2, '0');
  const ease = {
    linear: k => k,
    inOut: k => (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
    out: k => 1 - Math.pow(1 - k, 3),
    in: k => k * k * k
  };
  function rng(seed) {
    return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  }
  const wobble = t => Math.sin(t * 1.7) * .5 + Math.sin(t * 2.9 + 1.3) * .3 + Math.sin(t * 5.3 + .7) * .2;
  const BLUE = [82, 199, 255], RED = [255, 88, 109], GREEN = [84, 226, 162], WARM = [255, 214, 150], WHITE = [235, 245, 255];
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const mix = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

  // ---------- relógio do filme (pausa congela tudo) ----------
  const ABORT = Symbol('abort');
  let clock = 0, lastFrame = 0, paused = false, open = false, raf = 0, session = 0;
  let timers = [];
  let tweens = [];
  const hooks = new Set();
  const pendingRejects = new Set();

  function wait(ms) {
    return new Promise((resolve, reject) => timers.push({ at: clock + ms, resolve, reject }));
  }
  function abortAll() {
    const list = timers; timers = [];
    list.forEach(tm => tm.reject(ABORT));
    [...pendingRejects].forEach(fail => fail(ABORT));
    pendingRejects.clear();
  }
  const spawn = fn => { fn().catch(err => { if (err !== ABORT) console.error(err); }); };

  function tween(obj, key, to, ms, easing = ease.inOut) {
    tweens = tweens.filter(tw => !(tw.obj === obj && tw.key === key));
    const from = obj[key] ?? 0;
    if (ms <= 0) { obj[key] = to; return; }
    tweens.push({ obj, key, start: clock, dur: ms, easing, apply: k => { obj[key] = lerp(from, to, k); } });
  }
  function animate(ms, apply, easing = ease.inOut) {
    tweens.push({ start: clock, dur: Math.max(1, ms), easing, apply });
  }
  function stepTweens() {
    tweens = tweens.filter(tw => {
      const k = clamp((clock - tw.start) / tw.dur);
      tw.apply(tw.easing(k));
      return k < 1;
    });
  }

  function frame(now) {
    const dt = Math.min(250, now - (lastFrame || now));
    lastFrame = now;
    if (!paused) {
      clock += dt;
      stepTweens();
      hooks.forEach(fn => fn());
      const due = timers.filter(tm => tm.at <= clock);
      if (due.length) {
        timers = timers.filter(tm => tm.at > clock);
        due.forEach(tm => tm.resolve());
      }
    }
    draw();
    raf = requestAnimationFrame(frame);
  }

  // ---------- áudio sintetizado ----------
  const audio = (() => {
    let ac = null, master = null, noiseBuf = null, drone = null, muted = false;
    const VOL = .7;
    function init() {
      if (ac) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = muted ? 0 : VOL;
      master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const ready = () => ac && ac.state === 'running';
    function tone({ type = 'sine', freq = 440, to, dur = .2, gain = .15, delay = 0, attack = .005 }) {
      if (!ready()) return;
      const t0 = ac.currentTime + delay;
      const osc = ac.createOscillator(), g = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
      g.gain.setValueAtTime(.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      osc.connect(g); g.connect(master);
      osc.start(t0); osc.stop(t0 + dur + .05);
    }
    function noise({ dur = .2, gain = .2, type = 'bandpass', freq = 1000, to, q = 1, delay = 0, attack = .005 }) {
      if (!ready()) return;
      const t0 = ac.currentTime + delay;
      const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      src.buffer = noiseBuf; src.loop = true;
      f.type = type; f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
      if (to) f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
      g.gain.setValueAtTime(.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t0, Math.random()); src.stop(t0 + dur + .05);
    }
    function startDrone() {
      if (!ready() || drone) return;
      const out = ac.createGain(), filter = ac.createBiquadFilter();
      out.gain.value = .0001;
      filter.type = 'lowpass'; filter.frequency.value = 220; filter.Q.value = 4;
      const oscs = [55, 55.6, 82.4].map((f, i) => {
        const o = ac.createOscillator();
        o.type = i === 2 ? 'sine' : 'sawtooth';
        o.frequency.value = f;
        o.connect(filter); o.start();
        return o;
      });
      const lfo = ac.createOscillator(), lfoGain = ac.createGain();
      lfo.frequency.value = .08; lfoGain.gain.value = 60;
      lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
      filter.connect(out); out.connect(master);
      out.gain.exponentialRampToValueAtTime(.06, ac.currentTime + 3);
      drone = { out, filter, oscs, lfo };
    }
    function tension(k) {
      if (!drone) return;
      const t = ac.currentTime;
      drone.filter.frequency.setTargetAtTime(220 + k * 1400, t, .8);
      drone.out.gain.setTargetAtTime(.06 + k * .05, t, .8);
      drone.oscs[2].frequency.setTargetAtTime(82.4 + k * 40, t, 1);
    }
    function stopDrone() {
      if (!drone) return;
      const d = drone; drone = null;
      d.out.gain.setTargetAtTime(.0001, ac.currentTime, .3);
      setTimeout(() => { [...d.oscs, d.lfo].forEach(o => { try { o.stop(); } catch (e) { /* já parado */ } }); }, 1500);
    }
    function duck(ms) {
      if (!ac || muted) return;
      const t = ac.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(.0001, t + .06);
      master.gain.setValueAtTime(.0001, t + ms / 1000);
      master.gain.linearRampToValueAtTime(VOL, t + ms / 1000 + .8);
    }
    function setMuted(m) {
      muted = m;
      if (!ac) return;
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setTargetAtTime(m ? 0 : VOL, ac.currentTime, .05);
    }
    return {
      init, startDrone, stopDrone, tension, duck, setMuted,
      suspend: () => ac && ac.suspend(),
      resume: () => ac && ac.resume(),
      key: () => noise({ dur: .035, gain: .07, freq: 1800 + Math.random() * 2200, q: 2.5 }),
      typing(n = 10, spread = 1) { for (let i = 0; i < n; i++) noise({ dur: .03, gain: .05 + Math.random() * .05, freq: 1600 + Math.random() * 2400, q: 2.5, delay: Math.random() * spread }); },
      click() { noise({ dur: .025, gain: .45, type: 'highpass', freq: 2500 }); tone({ freq: 220, to: 70, dur: .09, gain: .3 }); },
      boom() { tone({ freq: 95, to: 28, dur: 1.6, gain: .55 }); noise({ dur: 1.1, gain: .25, type: 'lowpass', freq: 400, to: 60 }); },
      thud() { tone({ freq: 80, to: 40, dur: .4, gain: .35 }); },
      whoosh(d = 1.2) { noise({ dur: d, gain: .22, freq: 300, to: 3200, q: .8, attack: d * .6 }); },
      notify() { tone({ freq: 880, dur: .14, gain: .1 }); tone({ freq: 1318, dur: .22, gain: .09, delay: .11 }); },
      vibrate() { for (let i = 0; i < 3; i++) tone({ type: 'square', freq: 95, dur: .22, gain: .045, delay: i * .32 }); },
      ring() { for (let i = 0; i < 2; i++) { tone({ freq: 440, dur: .8, gain: .06, delay: i * 1.1 }); tone({ freq: 480, dur: .8, gain: .06, delay: i * 1.1 }); } },
      deny() { tone({ type: 'square', freq: 140, dur: .28, gain: .08 }); tone({ type: 'square', freq: 104, dur: .4, gain: .08, delay: .3 }); },
      alarm() { for (let i = 0; i < 4; i++) tone({ type: 'sawtooth', freq: i % 2 ? 520 : 700, dur: .26, gain: .05, delay: i * .28 }); },
      success() { [523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, dur: .35, gain: .07, delay: i * .08 })); },
      chime() { tone({ freq: 784, dur: .5, gain: .06 }); tone({ freq: 1175, dur: .6, gain: .04, delay: .05 }); },
      layer(i) { tone({ freq: [392, 440, 494, 587, 659, 784][i] || 784, dur: .6, gain: .06 }); },
      choice() { tone({ freq: 660, dur: .12, gain: .06 }); tone({ freq: 990, dur: .18, gain: .05, delay: .08 }); },
      glitch() { for (let i = 0; i < 7; i++) tone({ type: 'square', freq: 200 + Math.random() * 1800, dur: .04, gain: .05, delay: i * .05 }); noise({ dur: .3, gain: .12, type: 'highpass', freq: 4000 }); },
      shatter() { noise({ dur: .7, gain: .35, type: 'highpass', freq: 2200 }); for (let i = 0; i < 6; i++) tone({ type: 'triangle', freq: 1800 + Math.random() * 3000, dur: .25, gain: .03, delay: Math.random() * .3 }); },
      heartbeat(n = 4, gap = .8) { for (let i = 0; i < n; i++) { tone({ freq: 62, to: 40, dur: .16, gain: .35, delay: i * gap }); tone({ freq: 58, to: 38, dur: .18, gain: .25, delay: i * gap + .22 }); } },
      riser(d = 3) { noise({ dur: d, gain: .18, freq: 200, to: 5000, q: 1.2, attack: d * .95 }); tone({ type: 'sawtooth', freq: 70, to: 420, dur: d, gain: .04, attack: d * .9 }); },
      hangup() { for (let i = 0; i < 3; i++) tone({ freq: 425, dur: .22, gain: .06, delay: i * .4 }); },
      trash() { noise({ dur: .5, gain: .2, type: 'lowpass', freq: 3000, to: 200 }); tone({ freq: 300, to: 120, dur: .3, gain: .08 }); },
      lock() { tone({ type: 'square', freq: 300, to: 150, dur: .12, gain: .06 }); noise({ dur: .05, gain: .15, type: 'highpass', freq: 3000 }); }
    };
  })();

  // ---------- narração por voz (opcional, depende do navegador) ----------
  const hasSpeech = 'speechSynthesis' in window;
  let soundOn = true, voiceOn = true, ptVoice = null;
  const VOICE = {
    NARRADOR: { pitch: .85, rate: .95 },
    HACKER: { pitch: .35, rate: .85 },
    GABRIEL: { pitch: 1.05, rate: 1.02 },
    'VOZ AO TELEFONE': { pitch: .9, rate: 1.08 }
  };
  function findVoice() {
    if (!hasSpeech) return null;
    const voices = speechSynthesis.getVoices();
    return voices.find(v => /pt-BR/i.test(v.lang) && /natural|neural|online/i.test(v.name))
      || voices.find(v => /pt-BR/i.test(v.lang))
      || voices.find(v => /^pt/i.test(v.lang)) || null;
  }
  if (hasSpeech) {
    ptVoice = findVoice();
    speechSynthesis.onvoiceschanged = () => { ptVoice = findVoice(); };
  }
  function speak(who, text) {
    if (!soundOn || !voiceOn || !ptVoice || !VOICE[who]) return null;
    return new Promise(resolve => {
      const u = new SpeechSynthesisUtterance(text);
      u.voice = ptVoice; u.lang = ptVoice.lang;
      u.pitch = VOICE[who].pitch; u.rate = VOICE[who].rate; u.volume = .9;
      u.onend = u.onerror = () => resolve();
      speechSynthesis.speak(u);
    });
  }
  const stopSpeech = () => { if (hasSpeech) speechSynthesis.cancel(); };

  // ---------- legendas e camadas ----------
  const WHO_CLASS = { NARRADOR: 'narrator', HACKER: 'hacker', GABRIEL: 'hero', 'VOZ AO TELEFONE': 'caller' };
  function showLine(who, text) {
    speakerEl.textContent = who;
    subtitle.dataset.who = WHO_CLASS[who] || 'other';
    lineEl.textContent = text;
    subtitle.classList.add('show');
  }
  const hideLine = () => subtitle.classList.remove('show');
  async function say(who, text, { hold = 0, voice = true } = {}) {
    showLine(who, text);
    const speech = voice ? speak(who, text) : null;
    await wait(1200 + text.length * 52 + hold);
    if (speech) await Promise.race([speech, wait(4000)]);
    hideLine();
    await wait(250);
  }
  function el(html, cls) {
    const node = document.createElement('div');
    node.className = cls;
    node.innerHTML = html;
    stage.append(node);
    return node;
  }
  function remove(node, ms = 380) {
    if (!node || !node.isConnected) return;
    if (!ms) { node.remove(); return; }
    node.classList.add('out');
    spawn(async () => { await wait(ms); node.remove(); });
  }
  const caption = (text, pos = 'top') => el(text, `fx-caption ${pos}`);
  const bigWord = (text, cls = '') => el(`<span>${text}</span>`, `fx-big ${cls}`);
  function flash(color = '#fff', ms = 600) {
    flashEl.style.setProperty('--flash', color);
    flashEl.style.setProperty('--flash-ms', `${ms}ms`);
    flashEl.classList.remove('on'); void flashEl.offsetWidth; flashEl.classList.add('on');
  }
  function verdict(good, text) {
    const v = el(text, `fx-verdict ${good ? 'good' : 'bad'}`);
    spawn(async () => { await wait(3200); remove(v); });
  }
  function terminal(title) {
    const t = el(`<div class="term-head"><i></i><i></i><i></i><span>${title}</span></div><div class="term-body"></div>`, 'fx-term');
    return t.querySelector('.term-body');
  }
  async function typeLines(body, lines, speed = 16) {
    for (const line of lines) {
      const text = typeof line === 'string' ? line : line.t;
      const row = document.createElement('div');
      if (line.c) row.className = line.c;
      body.append(row);
      if (!text) { row.innerHTML = '&nbsp;'; await wait(speed * 3); continue; }
      for (let i = 0; i < text.length; i++) {
        row.textContent = text.slice(0, i + 1);
        if (text[i] !== ' ' && i % 2 === 0) audio.key();
        await wait(speed);
      }
      await wait(speed * 6);
    }
  }
  function makeCursor() {
    const c = el('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.6L4 20z" fill="#fff" stroke="#000" stroke-width="1.2"/></svg>', 'fx-cursor');
    c.pos = { x: innerWidth * .78, y: innerHeight * .86 };
    c.style.transform = `translate(${c.pos.x}px, ${c.pos.y}px)`;
    return c;
  }
  function moveCursorTo(c, target, ms, frac = { x: .5, y: .5 }) {
    const r = target.getBoundingClientRect();
    const to = { x: r.left + r.width * frac.x, y: r.top + r.height * frac.y };
    const from = { ...c.pos };
    animate(ms, k => {
      c.pos.x = lerp(from.x, to.x, k); c.pos.y = lerp(from.y, to.y, k);
      c.style.transform = `translate(${c.pos.x}px, ${c.pos.y}px)`;
    });
    return wait(ms);
  }

  // ---------- estado da história ----------
  let S;
  const freshState = () => ({ score: 0, flags: 0, d: { phishing: null, password: null, social: null, ransom: null } });
  function updateScore(bump) {
    scoreEl.querySelector('b').textContent = S.score;
    if (bump) { scoreEl.classList.remove('bump'); void scoreEl.offsetWidth; scoreEl.classList.add('bump'); }
  }
  function addScore(n) { S.score += n; updateScore(true); }

  // ---------- decisões ----------
  let activeChoice = null;
  function choose({ index, question, options, timeoutId, time = 15000 }) {
    hideLine();
    return new Promise((resolve, reject) => {
      choiceEl.innerHTML = `<div class="choice-panel" role="group" tabindex="-1" aria-label="Decisão ${index} de 5"><div class="choice-head"><span>DECISÃO ${pad(index)} / 05</span><span class="choice-timer" aria-hidden="true"><i></i></span></div><h3></h3><div class="choice-options"></div><p class="choice-hint">O TEMPO CORRE — A PRESSA FAZ PARTE DO GOLPE</p></div>`;
      choiceEl.querySelector('h3').textContent = question;
      const list = choiceEl.querySelector('.choice-options');
      const bar = choiceEl.querySelector('.choice-timer i');
      const start = clock;
      let settled = false;
      const cleanup = () => {
        hooks.delete(tick); pendingRejects.delete(fail);
        activeChoice = null; choiceEl.hidden = true; choiceEl.innerHTML = ''; skipBtn.disabled = false;
      };
      const finish = (opt, timeout = false) => { if (settled) return; settled = true; cleanup(); audio.click(); resolve({ ...opt, timeout }); };
      const fail = err => { if (settled) return; settled = true; cleanup(); reject(err); };
      const tick = () => {
        const k = clamp((clock - start) / time);
        bar.style.transform = `scaleX(${1 - k})`;
        bar.classList.toggle('low', k > .7);
        if (k >= 1) finish(options.find(o => o.id === timeoutId), true);
      };
      options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'choice-option';
        b.innerHTML = `<span class="choice-key">${'ABC'[i]}</span><span></span><span class="choice-go">↗</span>`;
        b.children[1].textContent = opt.label;
        b.addEventListener('click', () => finish(opt));
        list.append(b);
      });
      activeChoice = { options, finish };
      hooks.add(tick); pendingRejects.add(fail);
      choiceEl.hidden = false; skipBtn.disabled = true;
      choiceEl.querySelector('.choice-panel').focus({ preventScroll: true });
      audio.choice();
    });
  }

  // =====================================================================
  //  CENÁRIOS EM CANVAS
  // =====================================================================
  const W = {};
  function resetWorld(mode) {
    tweens = tweens.filter(tw => tw.obj !== W && !(tw.obj && tw.obj.__world));
    Object.keys(W).forEach(k => delete W[k]);
    W.mode = mode;
  }
  let cw = 0, ch = 0, dpr = 1;
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cw = window.innerWidth; ch = window.innerHeight;
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  }
  function fit(vw, vh, contain = false) {
    const s = contain ? Math.min(cw / vw, ch / vh) : Math.max(cw / vw, ch / vh);
    ctx.translate(cw / 2, ch / 2); ctx.scale(s, s); ctx.translate(-vw / 2, -vh / 2);
    return s;
  }
  function glow(x, y, r, color, alpha = 1) {
    if (r <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, alpha)); g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function poly(points) {
    ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath(); ctx.fill();
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function hexPath(x, y, R, rot = 0) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = rot + i / 6 * TAU;
      ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * R, y + Math.sin(a) * R);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#010204'; ctx.fillRect(0, 0, cw, ch);
    ctx.save();
    if (W.shake && !reduceMotion) ctx.translate(Math.sin(clock * .11) * W.shake, Math.cos(clock * .13) * W.shake);
    const blur = W.blur ? `blur(${W.blur}px)` : '';
    if (canvas.style.filter !== blur) canvas.style.filter = blur;
    const render = RENDER[W.mode];
    if (render) render(clock / 1000);
    ctx.restore();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (W.fade > 0) { ctx.fillStyle = `rgba(0,0,0,${W.fade})`; ctx.fillRect(0, 0, cw, ch); }
  }

  // ---------- cidade em 3D ----------
  let cityData = null;
  function facadeTexture(wpx, hpx, rand, special) {
    const c = document.createElement('canvas'); c.width = wpx; c.height = hpx;
    const g = c.getContext('2d');
    g.fillStyle = special ? '#0c1830' : '#0a1222'; g.fillRect(0, 0, wpx, hpx);
    const top = special ? 70 : 4;
    for (let y = top; y < hpx - 4; y += 14) {
      for (let x = 3; x < wpx - 3; x += 12) {
        if (rand() < (special ? .55 : .3)) {
          const warm = rand() < (special ? .3 : .55);
          g.fillStyle = warm ? `rgba(255,${200 + rand() * 40 | 0},${130 + rand() * 50 | 0},${.55 + rand() * .45})` : `rgba(${140 + rand() * 60 | 0},220,255,${.5 + rand() * .5})`;
        } else g.fillStyle = 'rgba(30,45,70,.55)';
        g.fillRect(x, y, 7, 8);
      }
    }
    const shade = g.createLinearGradient(0, 0, wpx, 0);
    shade.addColorStop(0, 'rgba(0,0,0,.35)'); shade.addColorStop(.5, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(0,0,0,.45)');
    g.fillStyle = shade; g.fillRect(0, 0, wpx, hpx);
    if (special) {
      g.fillStyle = '#0f2444'; g.fillRect(0, 0, wpx, 60);
      g.shadowColor = '#52c7ff'; g.shadowBlur = 14;
      g.fillStyle = '#7fd6ff'; g.font = '700 30px "DM Sans", sans-serif'; g.textAlign = 'center';
      g.fillText('NEXUS', wpx / 2, 42);
    }
    return c;
  }
  function buildCity() {
    const rand = rng(1337);
    const textures = Array.from({ length: 6 }, () => facadeTexture(320, 640, rand, false));
    const buildings = [];
    for (let z = 260; z < 4400; z += 150 + rand() * 90) {
      for (const side of [-1, 1]) {
        let edge = side * (180 + rand() * 50);
        for (let col = 0; col < 3; col++) {
          const w = 120 + rand() * 160, d = 100 + rand() * 120;
          const h = 180 + rand() * rand() * 1100 + col * 140;
          const tex = textures[(rand() * textures.length) | 0];
          const sw = Math.min(tex.width, w * .5), sh = Math.min(tex.height, h * .5);
          buildings.push({ x: edge + side * w / 2, z: z + rand() * 50, w, h, d, tex, sx: rand() * (tex.width - sw), sy: rand() * (tex.height - sh), sw, sh, shade: 8 + rand() * 10 });
          edge += side * (w + 40 + rand() * 80);
        }
      }
    }
    const towerTex = facadeTexture(230, 800, rand, true);
    buildings.push({ x: 0, z: 4700, w: 460, h: 1600, d: 320, tex: towerTex, sx: 0, sy: 0, sw: 230, sh: 800, shade: 18, tower: true });
    buildings.sort((a, b) => b.z - a.z);
    const stars = Array.from({ length: 160 }, () => [rand(), rand() * .9, rand() * 1.3 + .3, rand() * 6]);
    const cars = Array.from({ length: 34 }, (_, i) => ({ lane: i % 2 ? 1 : -1, z0: rand() * 5000, speed: 260 + rand() * 260 }));
    return { buildings, stars, cars, towerTex };
  }
  function drawCity(time) {
    const C = cityData || (cityData = buildCity());
    const reveal = W.reveal ?? 1;
    const f = ch * .9, cx = cw / 2, hy = ch * (W.horizon ?? .58);
    const camZ = W.camZ ?? 0, camY = W.camY ?? 150;
    const P = (x, y, z) => { const dz = Math.max(1, z - camZ); return [cx + x * f / dz, hy - (y - camY) * f / dz]; };

    ctx.globalAlpha = reveal;
    const sky = ctx.createLinearGradient(0, 0, 0, hy);
    sky.addColorStop(0, '#02040b'); sky.addColorStop(1, '#0c1a36');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, cw, hy + 1);
    ctx.fillStyle = '#cfe6ff';
    for (const [sx, sy, r, ph] of C.stars) {
      ctx.globalAlpha = reveal * (.3 + .3 * Math.sin(time * 1.3 + ph));
      ctx.fillRect(sx * cw, sy * hy * .8, r, r);
    }
    ctx.globalAlpha = reveal;
    glow(cx, hy, Math.max(cw, ch) * .6, [40, 90, 170], .35);
    const ground = ctx.createLinearGradient(0, hy, 0, ch);
    ground.addColorStop(0, '#0a1222'); ground.addColorStop(1, '#03060c');
    ctx.fillStyle = ground; ctx.fillRect(0, hy, cw, ch - hy);

    // rua
    const zn = camZ + 30, zf = camZ + 6000;
    const [lxn, yn] = P(-150, 0, zn), [rxn] = P(150, 0, zn), [lxf, yf] = P(-150, 0, zf), [rxf] = P(150, 0, zf);
    ctx.fillStyle = '#070d18'; poly([[lxn, yn], [rxn, yn], [rxf, yf], [lxf, yf]]);
    ctx.fillStyle = 'rgba(160,200,255,.3)';
    for (let z = Math.ceil(zn / 160) * 160; z < camZ + 3200; z += 160) {
      const [ax, ay] = P(-3, 0, z), [bx] = P(3, 0, z), [cx2, cy] = P(3, 0, z + 60), [dx] = P(-3, 0, z + 60);
      poly([[ax, ay], [bx, ay], [cx2, cy], [dx, cy]]);
    }

    // prédios, do mais distante ao mais próximo
    for (const b of C.buildings) {
      const dz = b.z - camZ;
      if (dz < 8 || dz > 6500) continue;
      const [x1, y1] = P(b.x - b.w / 2, b.h, b.z), [x2, y2] = P(b.x + b.w / 2, 0, b.z);
      if (x2 < -cw || x1 > cw * 2) continue;
      const fog = clamp((dz - 300) / 5200) * .9;
      if (!b.tower) {
        const inner = b.x < 0 ? b.x + b.w / 2 : b.x - b.w / 2;
        const [ax, ay] = P(inner, b.h, b.z), [, ay2] = P(inner, 0, b.z), [bx, by] = P(inner, b.h, b.z + b.d), [, by2] = P(inner, 0, b.z + b.d);
        const v = b.shade * (1 - fog * .4);
        ctx.fillStyle = `rgb(${v * .6 + 4 | 0},${v * .8 + 8 | 0},${v * 1.4 + 16 | 0})`;
        poly([[ax, ay], [bx, by], [bx, by2], [ax, ay2]]);
      }
      ctx.drawImage(b.tex, b.sx, b.sy, b.sw, b.sh, x1, y1, x2 - x1, y2 - y1);
      if (fog > .01) { ctx.fillStyle = `rgba(10,20,42,${fog})`; ctx.fillRect(x1, y1, x2 - x1, y2 - y1); }
    }

    // carros e postes
    ctx.globalCompositeOperation = 'lighter';
    for (const car of C.cars) {
      const travel = car.lane > 0 ? time * car.speed : -time * car.speed;
      const z = camZ + 40 + (((car.z0 + travel) % 5000) + 5000) % 5000;
      if (z > 4650) continue;
      const [px, py] = P(car.lane * 70, 6, z);
      const s = f / (z - camZ);
      const r = Math.max(1.2, 7 * s);
      const col = car.lane < 0 ? WHITE : RED;
      glow(px - 9 * s, py, r * 3, col, .55); glow(px + 9 * s, py, r * 3, col, .55);
    }
    for (let z = Math.ceil((camZ + 40) / 260) * 260; z < Math.min(4650, camZ + 5000); z += 260) {
      for (const side of [-1, 1]) {
        const [px, py] = P(side * 165, 110, z);
        glow(px, py, Math.max(2, 26 * f / (z - camZ)), WARM, .5);
      }
    }
    const [lx, ly] = P(0, 1660, 4700);
    const blink = .5 + .5 * Math.sin(time * 3);
    glow(lx, ly, 6 + 6 * (W.point ?? 0), RED, .35 + .5 * blink);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    // ponto de luz inicial na escuridão
    if ((W.point ?? 0) > 0 && reveal < 1) {
      ctx.globalCompositeOperation = 'lighter';
      glow(lx, ly, 40 * W.point, [255, 120, 140], (1 - reveal) * W.point);
      ctx.fillStyle = rgba(WHITE, (1 - reveal) * W.point);
      ctx.fillRect(lx - 1.5, ly - 1.5, 3, 3);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ---------- escritório ----------
  let officeData = null;
  function buildOffice() {
    const rand = rng(99);
    const sky = document.createElement('canvas'); sky.width = 1200; sky.height = 260;
    const g = sky.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, '#040814'); grad.addColorStop(1, '#10203d');
    g.fillStyle = grad; g.fillRect(0, 0, 1200, 260);
    for (let x = 0; x < 1200;) {
      const w = 30 + rand() * 70, h = 60 + rand() * 170;
      g.fillStyle = `rgb(${8 + rand() * 8 | 0},${14 + rand() * 8 | 0},${28 + rand() * 10 | 0})`;
      g.fillRect(x, 260 - h, w, h);
      for (let wy = 260 - h + 6; wy < 255; wy += 9) {
        for (let wx = x + 4; wx < x + w - 4; wx += 7) {
          if (rand() < .3) { g.fillStyle = rand() < .6 ? 'rgba(255,210,140,.75)' : 'rgba(150,215,255,.7)'; g.fillRect(wx, wy, 3, 4); }
        }
      }
      x += w + 2;
    }
    const palette = ['#1b2a40', '#22324a', '#2a2f45', '#1d3340', '#302a3f'];
    const hairs = ['#06080d', '#0d0a08', '#141018', '#0a0c12'];
    const rows = [
      { y: 540, s: .74, par: .82, desks: Array.from({ length: 10 }, (_, i) => ({ x: -120 + i * 250 + rand() * 30 })) },
      { y: 720, s: 1, par: 1, desks: Array.from({ length: 8 }, (_, i) => ({ x: -80 + i * 330 })) }
    ];
    for (const row of rows) {
      for (const d of row.desks) {
        Object.assign(d, { body: palette[(rand() * palette.length) | 0], hair: hairs[(rand() * hairs.length) | 0], phase: rand() * 10, shift: (rand() - .5) * 20, mug: rand() < .35, screen: rand() < .5 ? BLUE : [140, 170, 255], empty: rand() < .12 });
      }
    }
    const gabriel = rows[1].desks[4];
    Object.assign(gabriel, { gabriel: true, mug: true, empty: false });
    return { sky, rows, gabriel };
  }
  function drawDesk(row, d, time) {
    const s = row.s, x = d.x;
    const mw = 150 * s, mh = 92 * s, mx = x - mw / 2, my = row.y - mh - 26 * s;
    ctx.fillStyle = '#05080e'; ctx.fillRect(mx - 5 * s, my - 5 * s, mw + 10 * s, mh + 10 * s);
    const scr = ctx.createLinearGradient(mx, my, mx, my + mh);
    const alert = d.gabriel && W.gabrielAlert;
    scr.addColorStop(0, rgba(alert ? RED : d.screen, .85)); scr.addColorStop(1, rgba(alert ? [120, 30, 50] : [30, 70, 120], .9));
    ctx.fillStyle = scr; ctx.fillRect(mx, my, mw, mh);
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    for (let i = 0; i < 4; i++) ctx.fillRect(mx + 12 * s, my + (14 + i * 16) * s, (40 + ((i * 37 + d.phase * 10) % 70)) * s, 4 * s);
    ctx.fillStyle = '#05080e'; ctx.fillRect(x - 6 * s, my + mh + 5 * s, 12 * s, 21 * s);
    ctx.globalCompositeOperation = 'lighter';
    glow(x, my + mh / 2, 190 * s, alert ? RED : d.screen, .14);
    ctx.globalCompositeOperation = 'source-over';
    if (d.mug) {
      const ux = x + 95 * s, uy = row.y - 22 * s;
      ctx.fillStyle = '#c9d4e2'; ctx.fillRect(ux, uy, 16 * s, 20 * s);
      ctx.strokeStyle = 'rgba(220,235,255,.2)'; ctx.lineWidth = 2 * s;
      for (let k = 0; k < 2; k++) {
        ctx.beginPath();
        for (let j = 0; j <= 10; j++) {
          const yy = uy - 4 * s - j * 4 * s, xx = ux + 6 * s + k * 5 * s + Math.sin(time * 2 + j * .6 + k) * 3 * s;
          ctx[j ? 'lineTo' : 'moveTo'](xx, yy);
        }
        ctx.stroke();
      }
    }
    const px = x + d.shift * s, py = row.y + 40 * s;
    ctx.fillStyle = '#04060b'; rr(px - 48 * s, py - 70 * s, 96 * s, 130 * s, 18 * s); ctx.fill();
    if (d.empty) return;
    const bob = Math.sin(time * 6 + d.phase) * 1.2 * s;
    ctx.fillStyle = d.body; rr(px - 54 * s, py - 58 * s + bob, 108 * s, 90 * s, 40 * s); ctx.fill();
    ctx.fillStyle = d.hair; ctx.beginPath(); ctx.ellipse(px, py - 84 * s + bob, 27 * s, 31 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(d.screen, .35); ctx.lineWidth = 2 * s;
    ctx.beginPath(); ctx.ellipse(px, py - 84 * s + bob, 27 * s, 31 * s, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    if (d.gabriel && W.tag) {
      ctx.globalAlpha = W.tag;
      ctx.fillStyle = 'rgba(6,14,26,.9)'; ctx.fillRect(px - 50, py - 160 * s, 100, 22);
      ctx.strokeStyle = rgba(BLUE, .7); ctx.strokeRect(px - 50, py - 160 * s, 100, 22);
      ctx.fillStyle = '#bfe9ff'; ctx.font = '500 11px "DM Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText('GABRIEL', px, py - 160 * s + 15);
      ctx.globalAlpha = 1;
    }
  }
  function drawOffice(time) {
    const O = officeData || (officeData = buildOffice());
    ctx.save();
    fit(1600, 900);
    const pan = (W.pan ?? 0) * 700;
    const zoom = W.zoom ?? 1;
    if (zoom !== 1) {
      const fx = O.gabriel.x - pan, fy = 640;
      ctx.translate(fx, fy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy);
    }
    ctx.fillStyle = '#0a111e'; ctx.fillRect(-600, -300, 2800, 1500);
    ctx.save(); ctx.translate(-pan * .5, 0);
    ctx.drawImage(O.sky, -300, 110, 2600, 400);
    ctx.fillStyle = '#070c16';
    for (let x = -300; x < 2300; x += 520) ctx.fillRect(x, 100, 26, 420);
    ctx.fillRect(-300, 100, 2600, 14); ctx.fillRect(-300, 505, 2600, 16);
    ctx.restore();
    ctx.save(); ctx.translate(-pan * .9, 0);
    for (let x = -500; x < 2600; x += 300) {
      ctx.fillStyle = 'rgba(200,225,255,.55)'; ctx.fillRect(x, 46, 170, 5);
      glow(x + 85, 56, 170, [150, 190, 255], .1);
    }
    ctx.restore();
    const floor = ctx.createLinearGradient(0, 600, 0, 900);
    floor.addColorStop(0, '#0b1322'); floor.addColorStop(1, '#05080f');
    ctx.fillStyle = floor; ctx.fillRect(-600, 600, 2800, 400);
    O.rows.forEach((row, ri) => {
      ctx.save(); ctx.translate(-pan * row.par, 0);
      ctx.fillStyle = '#121b2b'; ctx.fillRect(-600, row.y, 3200, 18 * row.s);
      ctx.fillStyle = '#0b1220'; ctx.fillRect(-600, row.y + 18 * row.s, 3200, 140 * row.s);
      row.desks.forEach(d => drawDesk(row, d, time));
      ctx.restore();
      if (ri === 0) { ctx.fillStyle = 'rgba(10,17,30,.35)'; ctx.fillRect(-600, 300, 2800, 420); }
    });
    ctx.save(); ctx.translate(-pan * 1.35, 0);
    ctx.fillStyle = '#020306';
    for (const [lx, a] of [[180, -.6], [210, -.2], [240, .3], [1820, -.4], [1850, .1], [1880, .5]]) {
      ctx.beginPath(); ctx.ellipse(lx, 820, 26, 110, a, 0, TAU); ctx.fill();
    }
    ctx.fillRect(-600, 870, 3400, 60);
    ctx.restore();
    ctx.restore();
    if (W.dim) { ctx.fillStyle = `rgba(2,4,9,${W.dim})`; ctx.fillRect(0, 0, cw, ch); }
  }

  // ---------- covil do hacker ----------
  function drawLair(time) {
    ctx.save();
    fit(1600, 900);
    const fx = cw / ch > 1.2 ? 1040 : 800;
    const L = (W.light ?? 1) * (.88 + .12 * wobble(time * 3));
    const col = mix(BLUE, RED, W.red ?? 0);
    ctx.fillStyle = '#010205'; ctx.fillRect(-400, -300, 2400, 1500);
    glow(fx, 990, 900, col, .3 * L);
    for (let i = 0; i < 40; i++) {
      const x = fx + Math.sin(i * 12.9 + time * .2) * 420, y = 900 - ((i * 53 + time * 12) % 700);
      ctx.fillStyle = rgba(col, .25 * L * (1 - (900 - y) / 700));
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.save();
    ctx.translate((W.anger ?? 0) * Math.sin(time * 40) * 2.5, 0);
    ctx.beginPath();
    ctx.moveTo(fx - 340, 920);
    ctx.bezierCurveTo(fx - 300, 640, fx - 260, 300, fx, 260);
    ctx.bezierCurveTo(fx + 260, 300, fx + 300, 640, fx + 340, 920);
    ctx.closePath();
    const hood = ctx.createLinearGradient(0, 260, 0, 920);
    hood.addColorStop(0, '#020306'); hood.addColorStop(.6, rgba(mix([4, 8, 14], col, .1), 1)); hood.addColorStop(1, rgba(mix([4, 8, 14], col, .35 * L), 1));
    ctx.fillStyle = hood; ctx.fill();
    ctx.strokeStyle = rgba(col, .35 * L); ctx.lineWidth = 3; ctx.stroke();
    ctx.save();
    ctx.beginPath(); ctx.ellipse(fx, 560, 112, 150, 0, 0, TAU);
    ctx.fillStyle = '#000'; ctx.fill(); ctx.clip();
    glow(fx, 780, 230, col, .55 * L);
    ctx.restore();
    for (const ex of [fx - 48, fx + 48]) {
      ctx.fillStyle = rgba(col, .5 * L); rr(ex - 34, 515, 68, 26, 6); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${.35 * L})`;
      for (let k = 0; k < 3; k++) ctx.fillRect(ex - 26, 520 + ((time * 30 + k * 7) % 18), 30 + k * 6, 2);
      ctx.strokeStyle = '#05070b'; ctx.lineWidth = 3; rr(ex - 34, 515, 68, 26, 6); ctx.stroke();
    }
    const sm = W.smile ?? 0;
    ctx.strokeStyle = rgba(mix(col, WHITE, .4), .75 * L); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(fx - 42, 640 - sm * 4); ctx.quadraticCurveTo(fx, 640 + sm * 22, fx + 42, 640 - sm * 4); ctx.stroke();
    ctx.restore();
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillStyle = rgba(col, (.15 + .15 * Math.sin(i * 3 + j + time * 4)) * L);
        ctx.fillRect(fx - 260 + i * 20, 866 + j * 12, 14, 7);
      }
    }
    ctx.restore();
    if (W.red) { ctx.fillStyle = rgba(RED, .07 * W.red); ctx.fillRect(0, 0, cw, ch); }
  }

  // ---------- mundo digital ----------
  let digitalData = null;
  function buildDigital() {
    const rand = rng(5);
    return {
      stars: Array.from({ length: 240 }, () => ({ x: rand() * 2 - 1, y: rand() * 2 - 1, z: rand() })),
      swarm: Array.from({ length: 320 }, () => ({ a: rand() * TAU, r: Math.pow(rand(), .6), sp: .3 + rand() * 1.2, sz: 1 + rand() * 3 }))
    };
  }
  function drawCreature(time, x, y, R, alpha) {
    const D = digitalData;
    ctx.save(); ctx.globalAlpha *= alpha;
    const core = ctx.createRadialGradient(x, y, 0, x, y, R * 1.3);
    core.addColorStop(0, 'rgba(0,0,0,.95)'); core.addColorStop(.6, 'rgba(40,0,8,.8)'); core.addColorStop(1, 'rgba(255,40,70,0)');
    ctx.fillStyle = core; ctx.fillRect(x - R * 1.3, y - R * 1.3, R * 2.6, R * 2.6);
    ctx.strokeStyle = 'rgba(255,70,95,.5)'; ctx.lineWidth = Math.max(1, R * .025);
    for (let i = 0; i < 11; i++) {
      const a = i / 11 * TAU + Math.sin(time * .7 + i) * .3;
      const len = R * (1.3 + .4 * Math.sin(time * 1.3 + i * 2));
      const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len * .85;
      const cx2 = x + Math.cos(a + .5 * Math.sin(time + i)) * len * .55, cy2 = y + Math.sin(a + .5 * Math.sin(time + i)) * len * .5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(cx2, cy2, ex, ey); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const p of D.swarm) {
      const ang = p.a + time * p.sp * .5;
      const rr2 = R * p.r * (1 + .25 * Math.sin(time * 2 + p.a * 3));
      ctx.fillStyle = `rgba(255,${60 + p.sz * 20 | 0},90,.5)`;
      const sz = Math.max(1, p.sz * R / 140);
      ctx.fillRect(x + Math.cos(ang) * rr2, y + Math.sin(ang) * rr2 * .85, sz, sz);
    }
    const blink = Math.sin(time * .9) > .97 ? .15 : 1;
    for (const side of [-1, 1]) {
      glow(x + side * R * .22, y - R * .08, R * .2, [255, 60, 80], .9);
      ctx.fillStyle = '#ffe3e7';
      ctx.beginPath(); ctx.ellipse(x + side * R * .22, y - R * .08, R * .06, R * .025 * blink, side * .2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function drawDigital(time) {
    const D = digitalData || (digitalData = buildDigital());
    const reveal = W.reveal ?? 1;
    const cx = cw / 2, hy = ch * .56;
    const danger = W.danger ?? 0;
    const accent = mix(BLUE, RED, danger * clamp(W.open ?? 0) * .7);
    const speed = W.speed ?? 1;
    ctx.globalAlpha = reveal;
    const bg = ctx.createLinearGradient(0, 0, 0, ch);
    bg.addColorStop(0, '#01040b'); bg.addColorStop(.56, rgba(mix([7, 26, 51], accent, .15), 1)); bg.addColorStop(1, '#01040b');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = rgba(accent, .2); ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = -22; i <= 22; i++) { ctx.moveTo(cx + i * cw * .004, hy); ctx.lineTo(cx + i * cw * .09, ch); ctx.moveTo(cx + i * cw * .004, hy); ctx.lineTo(cx + i * cw * .09, 0); }
    ctx.stroke();
    const off = (time * speed * .6) % 1;
    for (let k = 0; k < 30; k++) {
      const z = k + 1 - off;
      const y = hy + (ch - hy) * 1.2 / z, y2 = hy - hy * 1.1 / z;
      ctx.strokeStyle = rgba(accent, clamp(1.4 / z) * .32);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
      ctx.strokeStyle = rgba(accent, clamp(1.4 / z) * .12);
      ctx.beginPath(); ctx.moveTo(0, y2); ctx.lineTo(cw, y2); ctx.stroke();
    }
    ctx.font = '12px "DM Mono", monospace'; ctx.textAlign = 'center';
    for (let i = 0; i < 16; i++) {
      const x = (i + .5) / 16 * cw, sp = .6 + (i * 37 % 10) / 10;
      for (let j = 0; j < 10; j++) {
        const y = ((time * 60 * sp + j * 22 + i * 97) % (ch * 1.2)) - ch * .1;
        ctx.fillStyle = rgba(accent, .05 + (j / 10) * .1);
        ctx.fillText((i * 7 + j * 3 + Math.floor(time * 4)) % 2 ? '1' : '0', x, y);
      }
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const s of D.stars) {
      const z = 1 - (((s.z + time * .1 * speed) % 1));
      if (z < .02) continue;
      const px = cx + s.x / z * cw * .12, py = hy * .95 + s.y / z * ch * .12;
      if (px < 0 || px > cw || py < 0 || py > ch) continue;
      ctx.fillStyle = rgba(accent, (1 - z) * .8);
      const sz = (1 - z) * 3;
      ctx.fillRect(px, py, sz, sz);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (!W.hideDoor) drawDoor(time, cx, hy);
    ctx.globalAlpha = 1;
  }
  function drawDoor(time, cx, hy) {
    const m = W.morph ?? 0, open = W.open ?? 0, sealed = W.sealed ?? 0, cre = W.creature ?? 0, danger = W.danger ?? 0;
    const u = ch * .01;
    const bottom = hy + 14 * u;
    const w = lerp(34 * u, 20 * u, ease.inOut(m)), h = lerp(22 * u, 40 * u, ease.inOut(m));
    const floatY = (1 - m) * (Math.sin(time * 1.5) * u * 1.2 - 8 * u);
    const x0 = cx - w / 2, y0 = bottom - h + floatY;
    const frameCol = mix(mix(BLUE, RED, danger * open), GREEN, sealed);
    const pw = w * (1 - open * .92);
    if (open > 0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(x0 + pw, y0, w - pw, h); ctx.clip();
      const g = ctx.createRadialGradient(cx, y0 + h / 2, 0, cx, y0 + h / 2, h * .7);
      g.addColorStop(0, rgba(mix(WHITE, RED, danger * .6), .95)); g.addColorStop(1, rgba(danger ? RED : BLUE, .25));
      ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
      if (cre > 0 && cre < .4) drawCreature(time, cx, y0 + h * .45, w * (.35 + cre), clamp(cre / .25));
      ctx.restore();
      const spill = ctx.createLinearGradient(0, bottom, 0, ch);
      spill.addColorStop(0, rgba(danger ? RED : WHITE, .22 * open)); spill.addColorStop(1, rgba(danger ? RED : WHITE, 0));
      ctx.fillStyle = spill;
      poly([[x0 + pw, bottom], [x0 + w, bottom], [cx + w * 2.5, ch], [cx - w * 1.2, ch]]);
    }
    if (m < 1) {
      ctx.fillStyle = `rgba(12,30,55,${.85 * (1 - m)})`;
      ctx.fillRect(x0, y0, w, h);
      ctx.strokeStyle = rgba(frameCol, 1 - m); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(cx, y0 + h * .55); ctx.lineTo(x0 + w, y0); ctx.stroke();
    }
    if (m > .5) {
      const a = clamp((m - .5) * 2);
      ctx.fillStyle = `rgba(10,26,48,${.96 * a})`;
      poly([[x0, y0], [x0 + pw, y0 - open * h * .08], [x0 + pw, y0 + h + open * h * .08], [x0, y0 + h]]);
      ctx.fillStyle = rgba(frameCol, a);
      ctx.beginPath(); ctx.arc(x0 + pw * .85, y0 + h * .52, u * .8, 0, TAU); ctx.fill();
    }
    ctx.save();
    ctx.shadowColor = rgba(frameCol, .9); ctx.shadowBlur = 24;
    ctx.strokeStyle = rgba(frameCol, 1); ctx.lineWidth = 2.5;
    ctx.strokeRect(x0, y0, w, h);
    ctx.restore();
    if (sealed > 0) {
      ctx.globalAlpha *= sealed;
      ctx.fillStyle = rgba(GREEN, 1); ctx.strokeStyle = rgba(GREEN, 1); ctx.lineWidth = u * .7;
      ctx.beginPath(); ctx.arc(cx, y0 + h * .44, u * 2, Math.PI, 0); ctx.stroke();
      ctx.fillRect(cx - u * 2.8, y0 + h * .44, u * 5.6, u * 4.4);
      ctx.lineWidth = 2;
      for (let k = 0; k < 3; k++) {
        const r = (time * .7 + k / 3) % 1;
        ctx.strokeStyle = rgba(GREEN, (1 - r) * .6);
        hexPath(cx, y0 + h / 2, h * (.6 + r * .9), Math.PI / 6); ctx.stroke();
      }
      ctx.globalAlpha /= sealed;
    }
    if (cre >= .4) {
      const t = (cre - .4) / .6;
      drawCreature(time, cx, lerp(y0 + h * .45, hy + ch * .05, t), lerp(w * .75, ch * 1.4, t * t), 1);
    }
  }

  // ---------- rede ----------
  const MAIN = [
    { x: 0, y: 0, label: 'E-MAIL', icon: '✉' },
    { x: 520, y: -170, label: 'CREDENCIAIS', icon: '⚿' },
    { x: 1040, y: 90, label: 'SERVIDOR', icon: '▤' },
    { x: 1560, y: -50, label: 'BANCO DE DADOS', icon: '◫' }
  ];
  const PATH = [{ x: -420, y: 120 }, ...MAIN];
  function pathPos(u) {
    u = clamp(u, 0, PATH.length - 1);
    const i = Math.min(PATH.length - 2, Math.floor(u)), k = u - i;
    return { x: lerp(PATH[i].x, PATH[i + 1].x, k), y: lerp(PATH[i].y, PATH[i + 1].y, k) };
  }
  let netData = null;
  function buildNet() {
    const rand = rng(4242);
    const nodes = [];
    while (nodes.length < 80) {
      const x = -800 + rand() * 3200, y = -650 + rand() * 1300;
      if (PATH.some(p => Math.hypot(p.x - x, p.y - y) < 110)) continue;
      nodes.push({ x, y, r: 2 + rand() * 3, server: rand() < .2 });
    }
    const edges = [], seen = new Set();
    nodes.forEach((n, i) => {
      nodes.map((m, j) => [j, Math.hypot(m.x - n.x, m.y - n.y)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) { seen.add(key); edges.push([n, nodes[j]]); }
      });
    });
    MAIN.forEach(m => nodes.map(n => [n, Math.hypot(n.x - m.x, n.y - m.y)]).sort((a, b) => a[1] - b[1]).slice(0, 3).forEach(([n]) => edges.push([m, n])));
    const origin = MAIN[2];
    const maxD = Math.max(...nodes.map(n => Math.hypot(n.x - origin.x, n.y - origin.y)));
    nodes.forEach(n => {
      const d = Math.hypot(n.x - origin.x, n.y - origin.y) / maxD;
      n.infectAt = clamp(d * .85 + rand() * .12, .01, .98);
      n.restoreAt = clamp(d * .8 + rand() * .15, .01, .98);
    });
    return { nodes, edges };
  }
  function nodeState(n) {
    const restored = (W.restore ?? 0) > (n.restoreAt ?? .02);
    const infected = !restored && (W.infect ?? 0) > (n.infectAt ?? .02);
    return infected ? 'infected' : restored ? 'restored' : 'idle';
  }
  function drawNetwork(time) {
    const N = netData || (netData = buildNet());
    const reveal = W.reveal ?? 1;
    const bg = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.max(cw, ch) * .7);
    bg.addColorStop(0, '#071328'); bg.addColorStop(1, '#010309');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, cw, ch);
    const s = Math.min(cw, ch) / 900 * (W.zoom ?? 1);
    const pp = pathPos(W.pulse ?? 0);
    const camX = W.follow ? pp.x : (W.camX ?? 780) + Math.sin(time * .15) * 30;
    const camY = W.follow ? pp.y * .5 : (W.camY ?? 0);
    ctx.save();
    ctx.globalAlpha = reveal;
    ctx.translate(cw / 2, ch / 2); ctx.scale(s, s); ctx.translate(-camX, -camY);
    ctx.fillStyle = 'rgba(82,199,255,.07)';
    for (let x = -1000; x < 2600; x += 60) for (let y = -800; y < 800; y += 60) ctx.fillRect(x, y, 2, 2);
    ctx.lineWidth = 1;
    for (const [a, b] of N.edges) {
      const sa = nodeState(a), sb = nodeState(b);
      ctx.strokeStyle = sa === 'infected' && sb === 'infected' ? 'rgba(255,88,109,.5)' : sa === 'restored' && sb === 'restored' ? 'rgba(84,226,162,.4)' : 'rgba(82,199,255,.14)';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let i = 0; i < 3; i++) {
      const a = MAIN[i], b = MAIN[i + 1];
      ctx.strokeStyle = 'rgba(82,199,255,.45)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      const k = clamp((W.pulse ?? 0) - (i + 1));
      if (k > 0 && !W.hidePulse) {
        ctx.strokeStyle = 'rgba(255,88,109,.9)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(lerp(a.x, b.x, k), lerp(a.y, b.y, k)); ctx.stroke();
      }
      const ph = (time * .5 + i * .3) % 1;
      ctx.fillStyle = 'rgba(162,229,255,.8)';
      ctx.fillRect(lerp(a.x, b.x, ph) - 2, lerp(a.y, b.y, ph) - 2, 4, 4);
    }
    for (const n of N.nodes) {
      const st = nodeState(n);
      const col = st === 'infected' ? RED : st === 'restored' ? GREEN : BLUE;
      if (n.server) {
        for (let k = 0; k < 3; k++) {
          ctx.fillStyle = st === 'infected' ? 'rgba(60,10,18,.9)' : 'rgba(10,22,40,.9)';
          ctx.fillRect(n.x - 12, n.y - 10 + k * 7, 24, 5);
          ctx.fillStyle = rgba(col, st === 'infected' ? .3 + .3 * Math.sin(time * 9 + n.x) : .8);
          ctx.fillRect(n.x + 6, n.y - 9 + k * 7, 3, 3);
        }
        if (st === 'infected') { ctx.fillStyle = rgba(RED, .9); ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🔒', n.x, n.y - 16); }
      } else {
        ctx.fillStyle = rgba(col, st === 'idle' ? .55 : .9);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, TAU); ctx.fill();
      }
    }
    ctx.textAlign = 'center';
    MAIN.forEach((m, i) => {
      const reached = !W.hidePulse && (W.pulse ?? 0) >= i + 1 - .02;
      const sh = W.shields && W.shields[i];
      const infected = (W.infect ?? 0) > .05 && (W.restore ?? 0) < .5;
      const col = sh && sh.state === 'hold' ? GREEN : (reached || infected) ? RED : BLUE;
      ctx.globalCompositeOperation = 'lighter';
      glow(m.x, m.y, 90, col, .25);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#07111f'; ctx.strokeStyle = rgba(col, .95); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(m.x, m.y, 30, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rgba(col, 1); ctx.font = '22px "DM Sans", sans-serif';
      ctx.fillText(m.icon, m.x, m.y + 8);
      ctx.fillStyle = '#d4e6fb'; ctx.font = '500 15px "DM Mono", monospace';
      ctx.fillText(m.label, m.x, m.y + 60);
      const sub = W.sub && W.sub[i];
      if (sub) { ctx.fillStyle = rgba(sh && sh.state === 'hold' ? GREEN : RED, .95); ctx.font = '12px "DM Mono", monospace'; ctx.fillText(sub, m.x, m.y + 80); }
      if (sh && sh.up > 0) {
        const R = 72 * ease.out(sh.up);
        const scol = sh.state === 'hold' ? GREEN : sh.state === 'broken' ? RED : BLUE;
        if (sh.state === 'broken') {
          ctx.strokeStyle = rgba(RED, 1 - sh.crack); ctx.lineWidth = 3;
          for (let k = 0; k < 6; k++) {
            const a0 = k / 6 * TAU, a1 = (k + 1) / 6 * TAU, am = (a0 + a1) / 2;
            const ox = Math.cos(am) * sh.crack * 140, oy = Math.sin(am) * sh.crack * 140;
            ctx.beginPath();
            ctx.moveTo(m.x + ox + Math.cos(a0) * R, m.y + oy + Math.sin(a0) * R);
            ctx.lineTo(m.x + ox + Math.cos(a1) * R, m.y + oy + Math.sin(a1) * R);
            ctx.stroke();
          }
        } else {
          ctx.save();
          ctx.shadowColor = rgba(scol, .9); ctx.shadowBlur = 18;
          ctx.strokeStyle = rgba(scol, .95); ctx.lineWidth = 3; ctx.fillStyle = rgba(scol, .08);
          hexPath(m.x, m.y, R); ctx.fill(); ctx.stroke();
          ctx.restore();
          if (sh.state === 'hold') {
            const r = (time * .8) % 1;
            ctx.strokeStyle = rgba(GREEN, (1 - r) * .6); ctx.lineWidth = 2;
            hexPath(m.x, m.y, R * (1 + r * .6)); ctx.stroke();
          }
        }
      }
    });
    if (!W.hidePulse) {
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 14; k >= 1; k--) {
        const p = pathPos((W.pulse ?? 0) - k * .018);
        glow(p.x, p.y, 26 - k, RED, .35 * (1 - k / 15));
      }
      glow(pp.x, pp.y, 46, RED, .8);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(pp.x, pp.y, 4, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }

  // ---------- prédio com camadas de proteção ----------
  const LAYER_NAMES = ['MFA', 'BACKUP', 'EDR', 'SENHAS ÚNICAS', 'TREINAMENTO', 'MONITORAMENTO'];
  function drawBuilding(time) {
    const C = cityData || (cityData = buildCity());
    ctx.save();
    ctx.globalAlpha = W.reveal ?? 1;
    fit(1600, 900, cw / ch < 1.1);
    const sky = ctx.createLinearGradient(0, -300, 0, 760);
    sky.addColorStop(0, '#01030a'); sky.addColorStop(1, '#0b1a35');
    ctx.fillStyle = sky; ctx.fillRect(-1200, -600, 4000, 1400);
    ctx.fillStyle = '#cfe6ff';
    for (const [sx, sy, r] of C.stars) ctx.fillRect(-400 + sx * 2400, -300 + sy * 800, r, r);
    ctx.fillStyle = '#060b16';
    for (let i = 0; i < 26; i++) {
      const x = -1000 + i * 140, h = 80 + ((i * 97) % 200);
      if (x > 560 && x < 1040) continue;
      ctx.fillRect(x, 760 - h, 120, h);
    }
    ctx.fillStyle = '#04070e'; ctx.fillRect(-1200, 760, 4000, 600);
    ctx.drawImage(C.towerTex, 0, 0, 230, 460, 670, 240, 260, 520);
    const L = W.layers ?? 0, secure = W.secure ?? 0;
    const rb = W.rebuild ?? 0;
    for (let i = 0; i < 9; i++) {
      const tx = i < 4 ? 140 + i * 120 : 1000 + (i - 4) * 120;
      const k = clamp(rb * 9 - (i < 4 ? 3 - i : i - 4));
      ctx.strokeStyle = rgba(mix(RED, GREEN, k), .25 + .5 * k); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(800, 762); ctx.lineTo(tx, 790); ctx.stroke();
      ctx.fillStyle = rgba(mix(RED, GREEN, k), .9); ctx.beginPath(); ctx.arc(tx, 790, 5, 0, TAU); ctx.fill();
    }
    ctx.font = '500 15px "DM Mono", monospace'; ctx.textAlign = 'center';
    for (let i = 0; i < 6; i++) {
      const p = clamp(L - i);
      if (p <= 0) continue;
      const rx = 230 + i * 62, ry = rx * 1.08;
      const col = mix(BLUE, GREEN, secure);
      ctx.save();
      ctx.shadowColor = rgba(col, .8); ctx.shadowBlur = 14;
      ctx.strokeStyle = rgba(col, .75 - i * .07); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(800, 760, rx, ry, 0, Math.PI, Math.PI + Math.PI * ease.out(p)); ctx.stroke();
      ctx.restore();
      const ang = Math.PI + Math.PI * (i % 2 ? .8 : .2);
      const lx = 800 + Math.cos(ang) * rx, ly = 760 + Math.sin(ang) * ry;
      const label = `◆ ${LAYER_NAMES[i]}`;
      const tw = ctx.measureText(label).width + 22;
      ctx.globalAlpha = (W.reveal ?? 1) * p;
      ctx.fillStyle = 'rgba(5,12,24,.92)'; ctx.fillRect(lx - tw / 2, ly - 15, tw, 28);
      ctx.strokeStyle = rgba(col, .8); ctx.lineWidth = 1; ctx.strokeRect(lx - tw / 2, ly - 15, tw, 28);
      ctx.fillStyle = rgba(mix(col, WHITE, .5), 1); ctx.fillText(label, lx, ly + 5);
      ctx.globalAlpha = W.reveal ?? 1;
    }
    const attack = W.attack ?? 0;
    if (attack > 0 && L > 0) {
      const outer = 230 + (Math.min(6, Math.ceil(L)) - 1) * 62;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 36; i++) {
        const ang = Math.PI + .1 + ((i * .618) % 1) * (Math.PI - .2);
        const ph = (time * .35 + i * .137) % 1;
        const dist = lerp(1100, outer, ease.in(ph));
        const px = 800 + Math.cos(ang) * dist, py = 760 + Math.sin(ang) * dist * 1.08;
        const a = attack * (ph > .9 ? (1 - ph) / .1 : .9);
        glow(px, py, ph > .9 ? 26 : 10, RED, a * .8);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }

  // ---------- milhares de computadores ----------
  let screensPattern = null;
  function drawScreens() {
    if (!screensPattern) {
      const rand = rng(77);
      const tile = document.createElement('canvas'); tile.width = tile.height = 256;
      const g = tile.getContext('2d');
      g.fillStyle = '#03060c'; g.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const ox = x * 64, oy = y * 64;
          g.fillStyle = '#0a0f18'; g.fillRect(ox + 8, oy + 10, 48, 32);
          g.fillStyle = `rgba(${80 + rand() * 60 | 0},${170 + rand() * 60 | 0},255,${.35 + rand() * .65})`;
          g.fillRect(ox + 11, oy + 13, 42, 26);
          g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(ox + 14, oy + 17, 20, 2); g.fillRect(ox + 14, oy + 22, 30, 2);
          g.fillStyle = '#0a0f18'; g.fillRect(ox + 29, oy + 42, 6, 6); g.fillRect(ox + 22, oy + 48, 20, 3);
        }
      }
      screensPattern = ctx.createPattern(tile, 'repeat');
    }
    const z = W.zoomOut ?? 1;
    const k = Math.max(6, 520 / z) / 64;
    ctx.save();
    ctx.translate(cw / 2 - 32 * k, ch / 2 - 26 * k);
    ctx.scale(k, k);
    ctx.fillStyle = screensPattern;
    const ox = (cw / 2) / k + 64, oy = (ch / 2) / k + 64;
    ctx.fillRect(-ox, -oy, ox * 2 + 64, oy * 2 + 64);
    ctx.restore();
    ctx.globalCompositeOperation = 'lighter';
    glow(cw / 2, ch / 2, Math.max(60, 420 / Math.sqrt(z)), BLUE, .35);
    ctx.globalCompositeOperation = 'source-over';
    const v = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * .2, cw / 2, ch / 2, Math.max(cw, ch) * .7);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.85)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, cw, ch);
  }

  const RENDER = { black: () => {}, city: drawCity, office: drawOffice, lair: drawLair, digital: drawDigital, network: drawNetwork, building: drawBuilding, screens: drawScreens };

  // =====================================================================
  //  INTERFACES (DOM)
  // =====================================================================
  const MAIL_LIST = `
    <div class="mail-item"><b>RH Nexus</b><small>08:52</small><span>Calendário de férias 2026</span></div>
    <div class="mail-item"><b>Ana · Comercial</b><small>08:31</small><span>Proposta revisada — cliente Atlas</span></div>
    <div class="mail-item"><b>TI Nexus</b><small>ontem</small><span>Manutenção programada no sábado</span></div>
    <div class="mail-item"><b>Carlos · Gestor</b><small>ontem</small><span>Fechamento do mês</span></div>`;
  function buildPov(from, subject, time) {
    return el(`<div class="pov-monitor"><div class="pov-screen">
      <div class="mail-bar"><span><i class="mail-dot"></i>Correio Nexus</span><span class="mail-user">gabriel@nexuscorp.com.br</span><span>${time}</span></div>
      <div class="mail-grid"><aside class="mail-list"><div class="mail-folder">CAIXA DE ENTRADA</div>
        <div class="mail-item new" hidden><b>${from}</b><small>agora</small><span>${subject}</span></div>${MAIL_LIST}</aside>
        <section class="mail-read"><div class="mail-empty">NENHUMA MENSAGEM SELECIONADA</div></section></div>
      </div><div class="pov-status"></div></div>`, 'fx-pov');
  }
  async function openMail(pov, html) {
    const item = pov.querySelector('.mail-item.new'), read = pov.querySelector('.mail-read');
    item.hidden = false; audio.notify();
    await wait(1100);
    item.classList.add('selected');
    read.innerHTML = html; read.classList.add('enter');
    return read;
  }
  const PHISH_MAIL = `
    <div class="mr-subject">URGENTE — SUA CONTA SERÁ BLOQUEADA</div>
    <div class="mr-from"><span class="mr-avatar">S</span><div><b>Segurança Nexus</b><small>seguranca@<mark>nexuscorp-suporte.com</mark></small></div><small class="mr-time">09:41</small></div>
    <p>Prezado colaborador,</p>
    <p>Detectamos uma atividade incomum na sua conta. Para evitar o bloqueio, confirme seus dados nos próximos <b>30 minutos</b>.</p>
    <button class="mr-cta" type="button" tabindex="-1">VERIFICAR CONTA</button>
    <p class="mr-sign">Equipe de Segurança da Informação</p>`;
  const RANSOM_MAIL = `
    <div class="mr-subject">Nota fiscal de setembro</div>
    <div class="mr-from"><span class="mr-avatar alt">F</span><div><b>Fornecedor Alfa</b><small>faturamento@alfa-distribuidora.net</small></div><small class="mr-time">14:07</small></div>
    <p>Boa tarde! Segue a nota fiscal referente aos serviços de setembro. Favor conferir e aprovar hoje.</p>
    <div class="mr-attach"><span class="ext">EXE</span><span><b>NF_2026.exe</b><small>Aplicativo · 2,4 MB</small></span></div>
    <p class="mr-sign">Atenciosamente, Financeiro Alfa</p>`;
  const FINAL_MAIL = `
    <div class="mr-subject">Sua senha expira hoje</div>
    <div class="mr-from"><span class="mr-avatar">N</span><div><b>Equipe NexusCloud</b><small><button type="button" class="hot" data-flag="sender" data-note="REMETENTE: “nexuscl0ud” usa um zero no lugar do “o”. Não é o domínio da empresa.">no-reply@nexuscl0ud-suporte.co</button></small></div><small class="mr-time">08:58</small></div>
    <p><button type="button" class="hot" data-flag="context" data-note="CONTEXTO: saudação genérica, prazo apertado e ameaça. O TI da Nexus não pede isso por e-mail.">Prezado usuário, sua senha expira em 2 horas. Após esse prazo você perderá o acesso a todos os seus arquivos.</button></p>
    <p>Para manter a senha atual, clique abaixo:</p>
    <button type="button" class="hot mr-cta" data-flag="link" data-note="LINK: o endereço real é m365-login.help/keep — nada a ver com a Nexus.">MANTER SENHA ATUAL</button>
    <p class="mr-sign">NexusCloud · Suporte</p>`;

  // =====================================================================
  //  ROTEIRO — 10 CENAS
  // =====================================================================
  async function sceneCity() {
    resetWorld('city');
    Object.assign(W, { camZ: -400, camY: 150, reveal: 0, point: 0, horizon: .6 });
    audio.typing(18, 2.2);
    await wait(1800);
    tween(W, 'point', 1, 1400, ease.out);
    await wait(1600);
    audio.startDrone(); audio.whoosh(3);
    const moveMs = 19000, moveEnd = clock + moveMs;
    tween(W, 'reveal', 1, 3500);
    tween(W, 'camZ', 4520, moveMs, ease.inOut);
    tween(W, 'camY', 560, moveMs, ease.inOut);
    await wait(2600);
    await say('NARRADOR', 'Todos os dias, milhares de pessoas entram no trabalho acreditando que estão seguras.', { hold: 1200 });
    const cap = caption('NEXUS CORP · SEDE · 14º ANDAR', 'top');
    await wait(Math.max(0, moveEnd - clock - 600));
    remove(cap);
    audio.whoosh(.8); flash('#bfe9ff', 700);
    await wait(150);
    resetWorld('office');
    Object.assign(W, { pan: 0, tag: 0 });
    tween(W, 'pan', 1, 11000, ease.inOut);
    audio.typing(30, 8);
    const cap2 = caption('09:12 · UMA MANHÃ COMO QUALQUER OUTRA', 'top');
    await wait(1600);
    for (const word of ['FUNCIONÁRIOS.', 'CAFÉ.', 'COMPUTADORES.', 'TUDO NORMAL.']) {
      const c = caption(word, 'beat');
      await wait(1500);
      c.remove();
    }
    tween(W, 'tag', 1, 600);
    remove(cap2);
    await say('NARRADOR', 'Até que...', { hold: 300 });
    audio.click();
    resetWorld('black');
    audio.duck(900);
    const w = bigWord('CLIC.', 'mono');
    await wait(1300);
    remove(w);
    await wait(400);
  }

  async function sceneVillain() {
    resetWorld('lair');
    Object.assign(W, { light: 0, smile: 0, anger: 0, red: 0 });
    audio.tension(.25);
    tween(W, 'light', 1, 2200, ease.out);
    const body = terminal('recon.sh — ghost@void');
    await wait(900);
    await typeLines(body, ['> recon --alvo nexus-corp', '', 'EMPRESA', '├── Funcionários   312', '├── Financeiro      18', '├── RH               9', '├── TI              11', '└── Diretoria        6']);
    tween(W, 'smile', 1, 1500);
    await wait(900);
    await say('HACKER', 'Eu não preciso invadir.', { hold: 600 });
    body.innerHTML = '';
    await typeLines(body, ['> novo-email', 'PARA:    gabriel@nexuscorp.com.br', 'DE:      seguranca@nexuscorp-suporte.com', 'ASSUNTO: URGENTE — SUA CONTA SERÁ BLOQUEADA', '', { t: '[ ENVIAR ]', c: 'warn' }], 14);
    await say('HACKER', 'Só preciso que alguém abra a porta.', { hold: 300 });
    audio.click();
    body.lastChild.textContent = '[ ENVIADO ✓ ]';
    body.lastChild.className = 'err';
    await wait(1100);
  }

  async function scenePhishing() {
    resetWorld('office');
    Object.assign(W, { pan: .62, zoom: 2.3, dim: .7, blur: 5 });
    const cap = caption('GABRIEL · FINANCEIRO · 09:41', 'top');
    const pov = buildPov('Segurança Nexus', 'URGENTE — SUA CONTA SERÁ BLOQUEADA', '09:41');
    const status = pov.querySelector('.pov-status');
    audio.typing(16, 2.2);
    await wait(2200);
    const read = await openMail(pov, PHISH_MAIL);
    await wait(600);
    await say('GABRIEL', 'Bloqueada? Como assim?');
    const phone = el('<div class="ph-screen"><div class="ph-time">09:42</div><div class="ph-notif"><span class="ph-app">MENSAGENS · AGORA</span><b>Carlos · Gestor</b><p>Consegue resolver isso agora?</p></div></div>', 'fx-phone');
    audio.vibrate();
    await wait(700);
    await say('CARLOS · GESTOR', '“Consegue resolver isso agora?”', { voice: false });
    audio.tension(.6);
    const cursor = makeCursor();
    const cta = read.querySelector('.mr-cta');
    audio.heartbeat(5, .75);
    await moveCursorTo(cursor, cta, 2600, { x: .62, y: .62 });
    cta.classList.add('hover');
    status.textContent = 'http://nexus-verify.top/login'; status.classList.add('show');
    await wait(500);
    const pick = await choose({
      index: 1, question: 'Você abriria esse e-mail? O cursor já está no botão.', timeoutId: 'click',
      options: [
        { id: 'click', label: 'Clicar em VERIFICAR CONTA — o chefe está esperando', safe: false },
        { id: 'check', label: 'Parar e conferir o remetente e o link', safe: true },
        { id: 'call', label: 'Ligar para o TI pelo ramal que já conhece', safe: true }
      ]
    });
    S.d.phishing = pick.safe;
    remove(phone);
    if (!pick.safe) {
      if (pick.timeout) await say('NARRADOR', 'Na pressa, ele clicou.');
      cta.classList.add('pressed'); audio.click();
      await wait(250);
      audio.duck(2200); audio.tension(0);
      pov.classList.add('freeze');
      verdict(false, 'RISCO · LINK DE PHISHING ABERTO');
      const w = bigWord('CLIQUE.', 'mono');
      await wait(2000);
      remove(w);
    } else {
      addScore(20);
      cta.classList.remove('hover');
      read.querySelector('mark').classList.add('flag');
      status.classList.add('flag');
      const note = el('<b>REMETENTE FALSO</b> nexuscorp-suporte.com ≠ nexuscorp.com.br', 'fx-chip red');
      await wait(1400);
      await say('GABRIEL', pick.id === 'call' ? 'Vou ligar para o TI antes de qualquer coisa.' : 'Esse endereço não é da Nexus. E esse link também não.');
      remove(note);
      verdict(true, '+20 · PHISHING REPORTADO AO TI');
      audio.success(); audio.tension(.1);
      await wait(1800);
    }
    remove(cap);
  }

  async function sceneDigital() {
    const safe = S.d.phishing !== false;
    resetWorld('digital');
    Object.assign(W, { reveal: 0, morph: 0, open: 0, creature: 0, sealed: 0, danger: safe ? 0 : 1, speed: 1 });
    audio.startDrone(); audio.whoosh(1.6);
    tween(W, 'reveal', 1, 1600, ease.out);
    await wait(1200);
    const cap = caption('DENTRO DO COMPUTADOR', 'top');
    tween(W, 'morph', 1, 2600);
    await wait(2900);
    remove(cap);
    if (!safe) {
      audio.tension(.5); audio.riser(2.4);
      tween(W, 'open', 1, 2400);
      await wait(1500);
      tween(W, 'creature', .38, 2600, ease.out);
      await say('NARRADOR', 'Um ataque sofisticado nem sempre começa com um código.');
      audio.boom();
      tween(W, 'creature', 1, 3600, ease.in);
      tween(W, 'speed', 3, 3600);
      tween(W, 'shake', 6, 3600, ease.in);
      await wait(600);
      await say('NARRADOR', 'Às vezes, começa com confiança.');
      await wait(400);
      tween(W, 'shake', 0, 0);
      flash('#ff2f4f', 800); audio.boom();
      tween(W, 'reveal', 0, 600);
      await wait(900);
    } else {
      tween(W, 'open', .14, 900);
      tween(W, 'creature', .26, 1500, ease.out);
      await say('NARRADOR', 'Um ataque sofisticado nem sempre começa com um código.');
      audio.deny();
      tween(W, 'open', 0, 220, ease.in);
      tween(W, 'sealed', 1, 600, ease.out);
      tween(W, 'creature', 0, 900);
      flash('rgba(84,226,162,.5)', 500);
      const chip = el('PHISHING REPORTADO · REMETENTE BLOQUEADO', 'fx-chip green');
      await say('NARRADOR', 'Às vezes, começa com confiança. E termina com atenção.', { hold: 300 });
      remove(chip);
      await say('HACKER', 'Tudo bem. Existem outras portas.');
    }
  }

  function shield(i) { return W.shields[i]; }
  function shieldUp(i) { audio.lock(); tween(shield(i), 'up', 1, 600, ease.out); }

  async function sceneNetwork() {
    const phished = S.d.phishing === false;
    resetWorld('network');
    Object.assign(W, { reveal: 0, pulse: 0, follow: true, zoom: 1.05, sub: ['', '', '', ''], infect: 0, restore: 0 });
    W.shields = MAIN.map(() => ({ up: 0, state: 'idle', crack: 0, __world: true }));
    tween(W, 'reveal', 1, 1200);
    audio.tension(.35);
    const chip = el(phished ? 'CREDENCIAIS CAPTURADAS NA PÁGINA FALSA' : 'PLANO B · SENHA DO GABRIEL VAZADA EM OUTRO SITE', 'fx-chip red');
    tween(W, 'pulse', 1, 2200);
    await wait(1300);
    shieldUp(0);
    await wait(1100);
    if (phished) {
      W.sub[0] = 'LOGIN ACEITO · SENHA CORRETA';
      shield(0).state = 'broken'; tween(shield(0), 'crack', 1, 900, ease.out); audio.shatter();
    } else {
      W.sub[0] = 'BLOQUEADO · PHISHING REPORTADO';
      shield(0).state = 'hold'; audio.deny();
      await wait(800);
      chip.innerHTML = 'TENTANDO A MESMA SENHA EM OUTROS SISTEMAS…';
    }
    await wait(1000);
    remove(chip);
    tween(W, 'pulse', 2, 1800);
    await wait(1800);
    W.sub[1] = 'USUÁRIO: gabriel'; audio.glitch();
    await wait(800);
    tween(W, 'pulse', 2.8, 1800);
    shieldUp(2);
    await wait(1900);
    const pick = await choose({
      index: 2, question: 'O atacante tem uma senha do Gabriel. Que senha protege o servidor?', timeoutId: 'same',
      options: [
        { id: 'same', label: 'A mesma do e-mail, com um número no final', safe: false },
        { id: 'unique', label: 'Uma senha única, guardada em um gerenciador', safe: true }
      ]
    });
    S.d.password = pick.safe;
    if (!pick.safe) {
      const c = el('SENHA REUTILIZADA', 'fx-chip red big');
      shield(2).state = 'broken'; tween(shield(2), 'crack', 1, 900, ease.out);
      audio.shatter(); flash('rgba(255,60,80,.35)', 400);
      verdict(false, 'RISCO · A BARREIRA QUEBROU');
      W.sub[2] = 'ACESSO LIBERADO';
      await wait(1000);
      remove(c);
      tween(W, 'pulse', 4, 2000);
      await wait(2000);
      W.sub[3] = 'DADOS EXPOSTOS'; audio.alarm();
      await wait(2000);
    } else {
      addScore(20);
      shield(2).state = 'hold'; audio.deny();
      W.sub[2] = 'SENHA ÚNICA ✓';
      tween(W, 'pulse', 2.55, 500, ease.out);
      const c = el('A SENHA VAZADA NÃO SERVE AQUI', 'fx-chip green');
      verdict(true, '+20 · BARREIRA MANTIDA');
      await wait(2600);
      remove(c);
    }
  }

  async function sceneSocial() {
    resetWorld('office');
    Object.assign(W, { pan: .62, zoom: 1.6, dim: .78, blur: 4 });
    audio.tension(.25);
    const call = el(`<div class="call-top"><span>CHAMADA RECEBIDA</span><b class="call-timer"></b></div><div class="call-avatar">F</div><b class="call-name">Financeiro</b><small class="call-number">Ramal 2041 · Nexus</small><div class="call-sms" hidden><span>MENSAGENS · AGORA</span><p>NEXUS: seu código de verificação é <b>482 913</b>. Não compartilhe com ninguém.</p></div><div class="call-actions"><i class="decline">✕</i><i class="accept">✆</i></div>`, 'fx-call ringing');
    const label = call.querySelector('.call-top span'), timer = call.querySelector('.call-timer');
    audio.ring();
    await wait(2300);
    call.classList.replace('ringing', 'active');
    label.textContent = 'EM CHAMADA';
    audio.click();
    spawn(async () => { for (let s = 0; ; s++) { timer.textContent = `00:${pad(s)}`; await wait(1000); } });
    await say('VOZ AO TELEFONE', 'Oi, sou do financeiro. Preciso que você me passe aquele código que chegou no seu celular.');
    call.querySelector('.call-sms').hidden = false; audio.notify();
    await wait(1300);
    const hes = caption('GABRIEL HESITA', 'beat');
    await wait(1500);
    hes.remove();
    await say('VOZ AO TELEFONE', 'É urgente.', { hold: 100 });
    audio.riser(3); audio.tension(.85);
    const words = [];
    for (const [x, y, s, r] of [[22, 28, 1, -6], [70, 40, 1.4, 4], [36, 70, 1.9, -2]]) {
      const w = el('URGENTE', 'fx-urgent');
      w.style.cssText = `left:${x}%;top:${y}%;--s:${s};--r:${r}deg`;
      words.push(w); audio.thud();
      await wait(850);
    }
    const pick = await choose({
      index: 3, question: 'O código está na tela. A voz insiste. O que o Gabriel responde?', timeoutId: 'give',
      options: [
        { id: 'give', label: 'Passa o código — é urgente', safe: false },
        { id: 'verify', label: '“Vou confirmar com o financeiro primeiro.”', safe: true }
      ]
    });
    S.d.social = pick.safe;
    words.forEach(w => remove(w));
    audio.tension(.2);
    if (pick.safe) {
      addScore(20);
      await say('GABRIEL', 'Vou confirmar com o financeiro primeiro.');
      audio.duck(1600);
      await wait(1700);
      audio.hangup();
      call.classList.replace('active', 'ended'); label.textContent = 'CHAMADA ENCERRADA';
      verdict(true, '+20 · CONFIRMOU POR OUTRO CANAL');
      const c = el('DO OUTRO LADO, A LIGAÇÃO CAIU', 'fx-chip green');
      await wait(2400);
      remove(c);
    } else {
      await say('GABRIEL', 'Tá bom... é 4-8-2-9-1-3.');
      await say('VOZ AO TELEFONE', 'Perfeito. Obrigado.');
      audio.hangup();
      call.classList.replace('active', 'ended'); label.textContent = 'CHAMADA ENCERRADA';
      verdict(false, 'RISCO · CÓDIGO ENTREGUE');
      await wait(1800);
    }
  }

  async function sceneVillainLoses() {
    resetWorld('lair');
    Object.assign(W, { light: 0, smile: .7, anger: 0, red: 0 });
    tween(W, 'light', 1, 1200, ease.out);
    audio.tension(.4);
    const body = terminal('auth.sh — ghost@void');
    await wait(900);
    const deny = async (text, anger, smile, cls = 'err') => {
      await typeLines(body, [{ t: text, c: cls }], 10);
      audio.deny();
      tween(W, 'anger', anger, 400); tween(W, 'smile', smile, 800);
      await wait(800);
    };
    if (S.d.social !== false) {
      await typeLines(body, ['> login gabriel@nexuscorp.com.br']);
      await deny('ACCESS DENIED', .3, .2);
      await typeLines(body, ['> login gabriel@nexuscorp.com.br --retry']);
      await deny('ACCESS DENIED', .6, -.2);
      await typeLines(body, ['> push-mfa --spam 30']);
      await deny('MFA ENABLED · TODAS AS APROVAÇÕES NEGADAS', 1, -.7, 'warn');
    } else {
      await typeLines(body, ['> login --codigo 482913']);
      await typeLines(body, [{ t: 'ACCESS GRANTED', c: 'ok' }], 10);
      audio.chime(); tween(W, 'smile', 1, 600);
      await wait(1200);
      await typeLines(body, [{ t: '! ALERTA SOC: LOGIN DE LOCAL INCOMUM', c: 'warn' }, { t: '! SESSÃO ENCERRADA · SENHA REDEFINIDA', c: 'warn' }], 12);
      audio.alarm(); tween(W, 'smile', -.2, 800);
      await typeLines(body, ['> login gabriel@nexuscorp.com.br']);
      await deny('ACCESS DENIED', 1, -.7);
      await say('NARRADOR', 'O monitoramento percebeu o acesso estranho em minutos.');
    }
    W.red = 0; tween(W, 'red', .35, 600);
    await wait(500);
    await say('HACKER', 'Então vai ser do jeito difícil.');
  }

  async function sceneRansom() {
    resetWorld('office');
    Object.assign(W, { pan: .62, zoom: 2.3, dim: .7, blur: 5 });
    const cap = caption('GABRIEL · FINANCEIRO · 14:07', 'top');
    const pov = buildPov('Fornecedor Alfa', 'Nota fiscal de setembro', '14:07');
    await wait(1600);
    const read = await openMail(pov, RANSOM_MAIL);
    await wait(1400);
    const cursor = makeCursor();
    const att = read.querySelector('.mr-attach');
    await moveCursorTo(cursor, att, 2000, { x: .3, y: .5 });
    const pick = await choose({
      index: 4, question: 'Uma “nota fiscal” chega como arquivo .exe. O que o Gabriel faz?', timeoutId: 'open',
      options: [
        { id: 'open', label: 'Abre NF_2026.exe para conferir a nota', safe: false },
        { id: 'report', label: 'Não abre e reporta o anexo ao TI', safe: true }
      ]
    });
    S.d.ransom = pick.safe;
    remove(cap);
    if (pick.safe) {
      addScore(20);
      att.classList.add('quarantine');
      att.querySelector('small').textContent = 'EM QUARENTENA · EDR';
      audio.success(); verdict(true, '+20 · ANEXO REPORTADO');
      await wait(2000);
      pov.remove(); cursor.remove();
      resetWorld('lair');
      Object.assign(W, { light: 1, smile: .8, anger: .4, red: 0 });
      const body = terminal('payload.sh — ghost@void');
      await typeLines(body, ['> status NF_2026.exe', { t: 'PAYLOAD BLOQUEADO · ARQUIVO EM QUARENTENA', c: 'err' }]);
      audio.deny(); tween(W, 'smile', -.8, 1400); tween(W, 'anger', 1, 600);
      await wait(2200);
      return;
    }
    att.classList.add('opened');
    audio.click(); await wait(150); audio.click();
    await wait(450);
    audio.glitch(); flash('rgba(255,40,70,.6)', 500);
    pov.remove(); cursor.remove();
    resetWorld('network');
    Object.assign(W, { reveal: 1, pulse: 0, follow: false, camX: 780, camY: 0, zoom: .62, shields: [], sub: ['', '', '', ''], infect: 0, restore: 0, hidePulse: true });
    audio.tension(.9); audio.alarm();
    tween(W, 'infect', 1, 5200, ease.in);
    const files = el(`<div class="files-head">ARQUIVOS DA REDE</div>${['DOCUMENTOS', 'BANCO DE DADOS', 'CONTRATOS', 'BACKUPS (REDE)'].map(n => `<div class="file-row"><span>${n}</span><b>OK</b></div>`).join('')}`, 'fx-files');
    for (const row of files.querySelectorAll('.file-row')) {
      await wait(1100);
      row.classList.add('locked'); row.querySelector('b').textContent = '🔒'; audio.lock();
    }
    await wait(500);
    const note = el('<h4>SEUS ARQUIVOS FORAM CRIPTOGRAFADOS</h4><p>Pague 50 BTC em 48 horas para recuperar os dados.</p>', 'fx-ransom');
    await say('HACKER', 'Agora vocês estão sem escolha.', { hold: 300 });
    note.remove(); files.remove();
    resetWorld('lair');
    Object.assign(W, { light: 1, smile: 1, anger: 0, red: .6 });
    const body = terminal('ransom.sh — ghost@void');
    await typeLines(body, ['> aguardando pagamento...']);
    await wait(900);
    await typeLines(body, [{ t: 'BACKUP DETECTED · OFFLINE · ÍNTEGRO (03:00)', c: 'ok' }, { t: 'RESTAURAÇÃO INICIADA PELA NEXUS', c: 'ok' }], 14);
    audio.chime();
    tween(W, 'smile', -.6, 1800); tween(W, 'red', 0, 1800);
    verdict(false, 'RISCO · O BACKUP SALVOU A EMPRESA');
    await wait(2400);
  }

  async function sceneTurn() {
    resetWorld('building');
    Object.assign(W, { reveal: 0, layers: 0, secure: 0, attack: 1, rebuild: 0 });
    tween(W, 'reveal', 1, 1200);
    audio.tension(.3);
    await wait(900);
    let files = null;
    if (S.d.ransom === false) {
      files = el(`<div class="files-head">RESTAURANDO DO BACKUP</div>${['DOCUMENTOS', 'BANCO DE DADOS', 'CONTRATOS', 'BACKUPS (REDE)'].map(n => `<div class="file-row locked"><span>${n}</span><b>🔒</b></div>`).join('')}`, 'fx-files');
    }
    const rows = files ? [...files.querySelectorAll('.file-row')] : [];
    for (let i = 0; i < 6; i++) {
      tween(W, 'layers', i + 1, 800, ease.out);
      audio.layer(i);
      if (rows[i]) { rows[i].className = 'file-row restored'; rows[i].querySelector('b').textContent = 'RESTAURADO'; }
      await wait(950);
    }
    tween(W, 'secure', 1, 1500); tween(W, 'rebuild', 1, 3000); tween(W, 'attack', 0, 3000);
    await say('NARRADOR', 'Nenhuma camada sozinha basta. Juntas, elas mudam o final.');
    const c = el('ATAQUE INTERROMPIDO', 'fx-chip green big');
    audio.success();
    await wait(2200);
    remove(c);
    if (files) remove(files);
  }

  function huntFlags(read, hunt) {
    return new Promise((resolve, reject) => {
      const spots = [...read.querySelectorAll('[data-flag]')];
      const count = hunt.querySelector('.hunt-count'), bar = hunt.querySelector('.hunt-timer i');
      const start = clock, LIMIT = 30000;
      let n = 0, settled = false;
      const cleanup = () => { hooks.delete(tick); pendingRejects.delete(fail); };
      const done = () => { if (settled) return; settled = true; cleanup(); resolve(n); };
      const fail = err => { if (settled) return; settled = true; cleanup(); reject(err); };
      const tick = () => {
        const k = clamp((clock - start) / LIMIT);
        bar.style.transform = `scaleX(${1 - k})`;
        if (k >= 1) done();
      };
      spots.forEach(spot => spot.addEventListener('click', () => {
        if (settled || spot.classList.contains('found')) return;
        spot.classList.add('found');
        spot.insertAdjacentHTML('afterend', `<em class="hot-note">${spot.dataset.note}</em>`);
        n++; count.textContent = `${n} / 3`;
        audio.chime();
        if (n === 3) spawn(async () => { await wait(900); done(); });
      }));
      hunt.querySelector('.hunt-delete').addEventListener('click', done);
      hooks.add(tick); pendingRejects.add(fail);
      spots[0].focus({ preventScroll: true });
    });
  }

  async function sceneFinal() {
    resetWorld('office');
    Object.assign(W, { pan: .62, zoom: 2.3, dim: .7, blur: 5 });
    audio.tension(.15);
    const cap = caption('NO DIA SEGUINTE · 08:58', 'top');
    const pov = buildPov('Equipe NexusCloud', 'Sua senha expira hoje', '08:58');
    pov.classList.add('hunting');
    await wait(1500);
    const read = await openMail(pov, FINAL_MAIL);
    await wait(700);
    pov.classList.add('interactive');
    const hunt = el('<span class="hunt-label">DECISÃO 05 / 05</span><b>Toque nos 3 sinais de golpe</b><span class="hunt-count">0 / 3</span><span class="hunt-timer" aria-hidden="true"><i></i></span><button type="button" class="hunt-delete">Apagar e-mail ↘</button>', 'fx-hunt');
    skipBtn.disabled = true;
    audio.choice();
    const found = await huntFlags(read, hunt);
    skipBtn.disabled = false;
    pov.classList.remove('interactive');
    S.flags = found;
    const pts = Math.round(found / 3 * 20);
    if (pts) addScore(pts);
    verdict(found === 3, `+${pts} · ${found}/3 SINAIS ENCONTRADOS`);
    read.querySelectorAll('[data-flag]:not(.found)').forEach(spot => {
      spot.classList.add('reveal');
      spot.insertAdjacentHTML('afterend', `<em class="hot-note">${spot.dataset.note}</em>`);
    });
    remove(hunt);
    await wait(1200);
    const order = ['sender', 'link', 'context'];
    for (const [i, word] of ['O REMETENTE.', 'O LINK.', 'O CONTEXTO.'].entries()) {
      const spot = read.querySelector(`[data-flag="${order[i]}"]`);
      spot.classList.add('pulse');
      const c = caption(`ELE OLHA ${word}`, 'top');
      await wait(1300);
      spot.classList.remove('pulse'); c.remove();
    }
    read.classList.add('deleting'); audio.trash();
    const w = bigWord('APAGA.', 'mono');
    await wait(1700);
    remove(w); remove(cap);
    pov.remove();

    resetWorld('city');
    Object.assign(W, { camZ: 4300, camY: 560, reveal: 1, horizon: .58, point: 0 });
    tween(W, 'camZ', -2600, 10000, ease.inOut);
    tween(W, 'camY', 2600, 10000, ease.inOut);
    tween(W, 'horizon', .32, 10000);
    audio.whoosh(2); audio.tension(.1);
    await wait(1400);
    await say('NARRADOR', 'A melhor defesa não começa no firewall.', { hold: 1400 });
    await wait(1200);
    flash('rgba(140,200,255,.3)', 600);
    resetWorld('screens');
    W.zoomOut = 1;
    tween(W, 'zoomOut', 60, 9000, ease.in);
    await wait(900);
    await say('NARRADOR', 'Começa na pessoa atrás da tela.', { hold: 1600 });
    tween(W, 'fade', 1, 1500);
    await wait(1600);
    resetWorld('black');
    audio.stopDrone();
    const q = bigWord('', 'question');
    const span = q.querySelector('span');
    const text = 'VOCÊ ESTÁ PREPARADO?';
    for (let i = 1; i <= text.length; i++) { span.textContent = text.slice(0, i); audio.key(); await wait(55); }
    await wait(2200);
    remove(q);
    await wait(500);
  }

  const SCENES = [
    ['A CIDADE', sceneCity], ['O VILÃO', sceneVillain], ['PHISHING', scenePhishing], ['O MUNDO DIGITAL', sceneDigital],
    ['A REDE', sceneNetwork], ['ENGENHARIA SOCIAL', sceneSocial], ['O VILÃO PERDE', sceneVillainLoses],
    ['RANSOMWARE', sceneRansom], ['A VIRADA', sceneTurn], ['FINAL', sceneFinal]
  ];

  // ---------- resultado ----------
  function showResult() {
    resetWorld('digital');
    Object.assign(W, { reveal: .35, hideDoor: true, speed: .3, danger: 0 });
    skipBtn.disabled = true;
    progressEl.style.width = '100%';
    const score = S.score, survived = score >= 60;
    const line = (key, title, ok, bad) => {
      const v = S.d[key];
      const cls = v === true ? 'ok' : v === false ? 'bad' : 'skip';
      return `<li class="${cls}"><span>${v === true ? '✓' : v === false ? '✕' : '—'}</span><b>${title}</b><span>${v === true ? ok : v === false ? bad : 'Cena pulada.'}</span></li>`;
    };
    const flagCls = S.flags === 3 ? 'ok' : S.flags ? 'skip' : 'bad';
    const r = el(`<div class="result-card">
        <span class="result-kicker">UM CLIQUE · FIM</span>
        <h2 class="${survived ? '' : 'lost'}">${survived ? 'Você sobreviveu ao ataque.' : 'O ataque chegou longe demais.'}</h2>
        <div class="result-score ${survived ? '' : 'low'}"><span>0</span><small> / 100</small></div>
        <span class="result-label">CYBER SCORE</span>
        <ul class="result-list">
          ${line('phishing', 'PHISHING', 'Conferiu o remetente antes de clicar.', 'Clicou no link sob pressão.')}
          ${line('password', 'SENHAS', 'A senha única segurou o servidor.', 'A senha reutilizada abriu o servidor.')}
          ${line('social', 'ENG. SOCIAL', 'Confirmou o pedido por outro canal.', 'Entregou o código de verificação.')}
          ${line('ransom', 'RANSOMWARE', 'Reportou o anexo suspeito.', 'Abriu o executável — o backup salvou.')}
          <li class="${flagCls}"><span>${S.flags === 3 ? '✓' : S.flags ? '◐' : '✕'}</span><b>SINAIS DE GOLPE</b><span>${S.flags} de 3 sinais encontrados no último e-mail.</span></li>
        </ul>
        <div class="result-actions">
          <button type="button" class="primary-button" data-act="test">Faça o teste de cybersegurança <span>↗</span></button>
          <button type="button" class="secondary-button" data-act="replay">Assistir de novo <span>↻</span></button>
          <button type="button" class="secondary-button" data-act="close">Voltar à página <span>✕</span></button>
        </div></div>`, 'fx-result');
    const num = r.querySelector('.result-score span');
    animate(1600, k => { num.textContent = Math.round(score * k); }, ease.out);
    survived ? audio.success() : audio.deny();
    r.querySelector('[data-act="test"]').addEventListener('click', () => { closeFilm(); if (window.protocoloGo) window.protocoloGo(1); });
    r.querySelector('[data-act="replay"]').addEventListener('click', restart);
    r.querySelector('[data-act="close"]').addEventListener('click', closeFilm);
    r.querySelector('[data-act="test"]').focus({ preventScroll: true });
  }

  // ---------- reprodução ----------
  function clearStage() {
    stage.innerHTML = '';
    hideLine();
    choiceEl.hidden = true; choiceEl.innerHTML = '';
    activeChoice = null;
    tweens = []; hooks.clear();
    stopSpeech();
    skipBtn.disabled = false;
    flashEl.classList.remove('on');
  }
  function setScene(i) {
    sceneNoEl.textContent = `CENA ${pad(i + 1)}`;
    sceneNameEl.textContent = SCENES[i][0];
    sceneCountEl.textContent = `${pad(i + 1)} / ${pad(SCENES.length)}`;
    slateEl.classList.remove('in'); void slateEl.offsetWidth; slateEl.classList.add('in');
    progressEl.style.width = `${(i + .5) / SCENES.length * 100}%`;
  }
  async function play() {
    const run = ++session;
    for (let i = 0; i < SCENES.length; i++) {
      if (run !== session) return;
      setScene(i);
      try { await SCENES[i][1](); } catch (err) { if (err !== ABORT) console.error(err); }
      if (run !== session) return;
      abortAll();
      clearStage();
    }
    if (run === session) showResult();
  }
  function setPaused(p) {
    if (paused === p) return;
    paused = p;
    film.classList.toggle('paused', p);
    pauseBtn.innerHTML = p ? '▶<span> CONTINUAR</span>' : '❚❚<span> PAUSAR</span>';
    pauseBtn.setAttribute('aria-label', p ? 'Continuar' : 'Pausar');
    if (p) { audio.suspend(); if (hasSpeech) speechSynthesis.pause(); }
    else { audio.resume(); if (hasSpeech) speechSynthesis.resume(); }
  }
  function toggleSound() {
    soundOn = !soundOn;
    audio.setMuted(!soundOn);
    if (!soundOn) stopSpeech();
    soundBtn.classList.toggle('off', !soundOn);
    soundBtn.setAttribute('aria-pressed', String(soundOn));
  }
  function toggleVoice() {
    voiceOn = !voiceOn;
    if (!voiceOn) stopSpeech();
    voiceBtn.classList.toggle('off', !voiceOn);
    voiceBtn.setAttribute('aria-pressed', String(voiceOn));
  }
  let returnFocus = null;
  function openFilm(trigger) {
    if (open) return;
    returnFocus = trigger || document.activeElement;
    open = true;
    film.hidden = false;
    document.body.classList.add('film-open');
    audio.init(); audio.resume();
    if (!soundOn) audio.setMuted(true);
    voiceBtn.hidden = !hasSpeech;
    resize();
    paused = true; setPaused(false);
    lastFrame = 0;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
    S = freshState(); updateScore(false);
    pauseBtn.focus({ preventScroll: true });
    play();
  }
  function restart() {
    session++;
    abortAll(); clearStage();
    S = freshState(); updateScore(false);
    audio.stopDrone();
    play();
  }
  function closeFilm() {
    if (!open) return;
    open = false;
    session++;
    abortAll(); clearStage();
    resetWorld('black');
    setPaused(false);
    audio.stopDrone();
    cancelAnimationFrame(raf);
    film.hidden = true;
    document.body.classList.remove('film-open');
    if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
  }
  function skipScene() {
    if (!open || activeChoice || skipBtn.disabled) return;
    if (paused) setPaused(false);
    abortAll();
  }

  pauseBtn.addEventListener('click', () => setPaused(!paused));
  soundBtn.addEventListener('click', toggleSound);
  voiceBtn.addEventListener('click', toggleVoice);
  skipBtn.addEventListener('click', skipScene);
  closeBtn.addEventListener('click', closeFilm);
  document.querySelectorAll('[data-film]').forEach(btn => btn.addEventListener('click', () => openFilm(btn)));
  window.addEventListener('resize', () => { if (open) resize(); });
  document.addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closeFilm(); return; }
    if (activeChoice && !paused) {
      const k = e.key.toLowerCase();
      const i = k.length === 1 ? Math.max('123'.indexOf(k), 'abc'.indexOf(k)) : -1;
      if (i >= 0 && activeChoice.options[i]) { e.preventDefault(); activeChoice.finish(activeChoice.options[i]); return; }
    }
    if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); setPaused(!paused); return; }
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) { toggleSound(); return; }
    if (e.key === 'Tab') {
      const items = [...film.querySelectorAll('button:not([disabled]):not([hidden]), [href]')].filter(n => n.getClientRects().length);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('visibilitychange', () => { if (open && document.hidden) setPaused(true); });
})();
