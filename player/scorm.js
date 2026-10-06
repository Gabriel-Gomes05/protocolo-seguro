/* Ponte mínima com SCORM 1.2. Fora de um LMS, todas as chamadas viram no-op. */
window.SentinelaSCORM = (() => {
  let api = null;
  let ativo = false;
  let terminado = false;
  let concluido = false;
  const inicio = Date.now();

  function procurar(win) {
    for (let i = 0; win && i < 10; i++) {
      if (win.API) return win.API;
      if (win.parent === win) break;
      win = win.parent;
    }
    return null;
  }

  function tempo(ms) {
    const s = Math.round(ms / 1000);
    const p = n => String(n).padStart(2, '0');
    return `${String(Math.floor(s / 3600)).padStart(4, '0')}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
  }

  function set(k, v) { if (ativo) api.LMSSetValue(k, String(v)); }
  function get(k) { return ativo ? api.LMSGetValue(k) : ''; }

  function iniciar() {
    try { api = procurar(window) || (window.opener && procurar(window.opener)); } catch (e) { api = null; }
    if (!api) return false;
    ativo = String(api.LMSInitialize('')) === 'true';
    if (ativo && ['not attempted', ''].includes(get('cmi.core.lesson_status'))) {
      set('cmi.core.lesson_status', 'incomplete');
      api.LMSCommit('');
    }
    return ativo;
  }

  function concluir({ nota, aprovado }) {
    if (!ativo) return;
    set('cmi.core.score.min', 0);
    set('cmi.core.score.max', 100);
    set('cmi.core.score.raw', nota);
    set('cmi.core.lesson_status', aprovado ? 'passed' : 'failed');
    set('cmi.core.session_time', tempo(Date.now() - inicio));
    concluido = true;
    api.LMSCommit('');
  }

  function encerrar() {
    if (!ativo || terminado) return;
    terminado = true;
    set('cmi.core.session_time', tempo(Date.now() - inicio));
    set('cmi.core.exit', concluido ? '' : 'suspend');
    api.LMSCommit('');
    api.LMSFinish('');
  }

  window.addEventListener('pagehide', encerrar);
  window.addEventListener('beforeunload', encerrar);

  return { iniciar, concluir, encerrar, get emLMS() { return ativo; } };
})();
