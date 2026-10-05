(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const navDots = [...document.querySelectorAll('.nav-dot')];
  const stepNames = ['INÍCIO', 'INTRODUÇÃO', 'PHISHING', 'SENHAS', 'ENG. SOCIAL', 'RANSOMWARE', 'DEFESA', 'QUIZ FINAL', 'CONCLUSÃO'];
  let current = 0;
  let score = 0;
  let completed = { phishing: false, password: false, social: false };
  let quizIndex = 0;
  let quizScore = 0;
  let answered = false;
  let encryptTimer;

  function go(index) {
    index = Math.max(0, Math.min(screens.length - 1, Number(index)));
    current = index;
    screens.forEach((screen, i) => screen.classList.toggle('active', i === index));
    navDots.forEach((dot, i) => dot.classList.toggle('selected', i === index));
    document.getElementById('nav-current').textContent = String(index + 1).padStart(2, '0');
    document.getElementById('header-step').textContent = `CAPÍTULO ${String(index).padStart(2, '0')}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => go(button.dataset.go)));
  window.protocoloGo = go;

  function setFeedback(el, message, error = false) {
    el.textContent = message;
    el.classList.toggle('error', error);
  }
  function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2300);
  }
  document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
    const feedback = button.closest('.email-options').querySelector('.feedback');
    const safe = button.dataset.correct === 'true';
    button.classList.toggle('correct', safe);
    button.classList.toggle('wrong', !safe);
    document.querySelectorAll('.choice').forEach(el => { el.disabled = true; });
    if (safe) {
      score += 1; completed.phishing = true;
      setFeedback(feedback, 'Boa decisão. A urgência era um sinal de alerta; confira por um canal conhecido.');
      setTimeout(() => go(3), 1350);
    } else {
      setFeedback(feedback, 'Armadilha identificada. O endereço parece legítimo, mas o domínio é suspeito. Você ainda pode seguir em frente com atenção.', true);
      completed.phishing = false;
      setTimeout(() => go(3), 2100);
    }
  }));

  document.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => {
    const feedback = button.closest('.quiz-card').querySelector('.feedback');
    const safe = button.dataset.correct === 'true';
    document.querySelectorAll('.answer').forEach(el => { el.disabled = true; });
    button.classList.add(safe ? 'correct' : 'wrong');
    if (safe) {
      score += 1; completed.password = true;
      setFeedback(feedback, 'Correto. Senhas únicas e um gerenciador reduzem o impacto de um vazamento.');
    } else {
      completed.password = false;
      setFeedback(feedback, 'Uma senha repetida pode abrir outras contas. Prefira senhas únicas e um gerenciador.', true);
    }
    document.querySelector('.next-hidden').style.display = 'inline-block';
  }));

  document.querySelectorAll('.chat-choice').forEach(button => button.addEventListener('click', () => {
    const feedback = button.closest('.chat-card').querySelector('.feedback');
    const safe = button.dataset.correct === 'true';
    document.querySelectorAll('.chat-choice').forEach(el => { el.disabled = true; });
    button.classList.add(safe ? 'correct' : 'wrong');
    if (safe) {
      score += 1; completed.social = true;
      setFeedback(feedback, 'Boa. Confirme o pedido por um telefone ou canal que você já conhece.');
    } else {
      completed.social = false;
      setFeedback(feedback, 'A urgência e a autoridade foram usadas para pressionar. Confirme por outro canal.', true);
    }
    setTimeout(() => go(5), 1600);
  }));

  const bar = document.getElementById('encrypt-bar');
  const status = document.getElementById('encrypt-status');
  const message = document.getElementById('encrypt-message');
  const percent = document.getElementById('encrypt-percent');
  const ransomFeedback = document.getElementById('ransom-feedback');
  function resetMonitor() {
    clearInterval(encryptTimer);
    bar.style.width = '0';
    status.textContent = 'MONITORANDO';
    status.style.color = 'var(--green)';
    message.textContent = 'Nenhuma ameaça ativa detectada.';
    message.style.color = '';
    percent.textContent = 'SISTEMA ÍNTEGRO';
    percent.style.color = '';
  }
  document.getElementById('open-file').addEventListener('click', () => {
    clearInterval(encryptTimer);
    const button = document.getElementById('open-file');
    button.disabled = true;
    status.textContent = 'AMEAÇA DETECTADA';
    status.style.color = 'var(--red)';
    message.textContent = 'Comportamento de ransomware detectado.';
    message.style.color = 'var(--red)';
    percent.textContent = 'AÇÃO NECESSÁRIA';
    percent.style.color = 'var(--red)';
    setFeedback(ransomFeedback, 'Um executável inesperado pode iniciar uma criptografia. O EDR interrompeu a simulação.');
    bar.style.width = '82%';
    bar.style.background = 'var(--red)';
    setTimeout(() => { status.textContent = 'AMEAÇA CONTIDA'; message.textContent = 'Endpoint isolado · arquivos preservados.'; percent.textContent = 'ATAQUE BLOQUEADO'; percent.style.color = 'var(--green)'; message.style.color = 'var(--green)'; }, 1500);
    setTimeout(() => go(6), 2500);
  });
  document.getElementById('report-file').addEventListener('click', () => {
    clearInterval(encryptTimer);
    document.getElementById('open-file').disabled = true;
    status.textContent = 'RELATÓRIO ENVIADO';
    status.style.color = 'var(--green)';
    message.textContent = 'Arquivo isolado para análise. Nenhum dado foi afetado.';
    message.style.color = 'var(--green)';
    percent.textContent = 'AMEAÇA EVITADA';
    percent.style.color = 'var(--green)';
    setFeedback(ransomFeedback, 'Boa decisão. Não abra anexos inesperados; reporte o arquivo à equipe de segurança.');
    score += 1;
    setTimeout(() => go(6), 1900);
  });

  const questions = [
    { topic: 'PHISHING', text: 'Você recebe um e-mail pedindo sua senha para evitar o bloqueio da conta. O que faz?', answers: ['Respondo ao e-mail para resolver o problema.', 'Não compartilho a senha; verifico pelo site ou canal oficial.', 'Encaminho a mensagem para colegas perguntando se parece legítima.'], correct: 1, why: 'Nunca compartilhe sua senha. Acesse o serviço por um endereço conhecido e reporte a mensagem suspeita.' },
    { topic: 'MFA', text: 'Chega uma notificação de autenticação em dois fatores que você não iniciou. Como reage?', answers: ['Aprovo para parar as notificações.', 'Rejeito o pedido e aviso a equipe de segurança.', 'Envio o código para o suporte por mensagem.'], correct: 1, why: 'Rejeite solicitações inesperadas. Podem indicar que alguém já tem sua senha.' },
    { topic: 'ENG. SOCIAL', text: 'Uma pessoa que diz ser seu gestor pede uma transferência urgente pelo chat. O que faz?', answers: ['Confirmo a identidade por um canal conhecido antes de agir.', 'Faço a transferência, já que o pedido veio do gestor.', 'Peço que envie os dados bancários por e-mail.'], correct: 0, why: 'Verifique o pedido em um canal que você já conhece, especialmente quando há urgência ou dinheiro.' },
    { topic: 'ARQUIVOS', text: 'Você recebe uma nota fiscal inesperada com extensão .exe. Qual é a melhor resposta?', answers: ['Abro para conferir o conteúdo.', 'Baixo o arquivo e envio para meu e-mail pessoal.', 'Não abro; reporto o anexo à equipe de segurança.'], correct: 2, why: 'Um arquivo .exe executa um programa. Não abra anexos inesperados e reporte-os.' },
    { topic: 'SENHAS', text: 'Um serviço avisa que houve um vazamento de dados. Você reutilizou a senha em outros sites.', answers: ['Troco a senha vazada e as senhas repetidas, usando senhas únicas.', 'Espero para ver se aparece alguma atividade estranha.', 'Adiciono um número no fim da senha antiga.'], correct: 0, why: 'Troque a senha comprometida em todos os serviços onde foi reutilizada. Use senhas únicas e MFA.' }
  ];
  const topicEl = document.getElementById('question-topic');
  const questionEl = document.getElementById('question-text');
  const answersEl = document.getElementById('final-answers');
  const feedbackEl = document.getElementById('final-feedback');
  const panelEl = document.getElementById('result-panel');
  function renderQuestion() {
    answered = false;
    const q = questions[quizIndex];
    topicEl.textContent = q.topic;
    questionEl.textContent = q.text;
    document.getElementById('question-counter').textContent = `${String(quizIndex + 1).padStart(2, '0')}—05`;
    document.getElementById('quiz-index').textContent = `PERGUNTA ${String(quizIndex + 1).padStart(2, '0')} / 05`;
    document.getElementById('quiz-progress-bar').style.width = `${(quizIndex + 1) * 20}%`;
    feedbackEl.textContent = '';
    answersEl.innerHTML = '';
    q.answers.forEach((answer, i) => {
      const button = document.createElement('button');
      button.className = 'final-answer';
      button.textContent = `${String.fromCharCode(65 + i)}  /  ${answer}`;
      button.addEventListener('click', () => answerQuestion(i, button));
      answersEl.append(button);
    });
  }
  function answerQuestion(index, button) {
    if (answered) return;
    answered = true;
    const q = questions[quizIndex];
    const correct = index === q.correct;
    if (correct) quizScore++;
    [...answersEl.children].forEach((el, i) => {
      el.disabled = true;
      if (i === q.correct) el.classList.add('correct');
      else if (i === index) el.classList.add('wrong');
    });
    setFeedback(feedbackEl, `${correct ? 'Correto. ' : 'Não desta vez. '}${q.why}`, !correct);
    setTimeout(() => {
      quizIndex++;
      if (quizIndex < questions.length) renderQuestion();
      else showResult();
    }, 1650);
  }
  function showResult() {
    questionEl.textContent = 'Seu radar de segurança, em resumo.';
    topicEl.textContent = 'RESULTADO';
    document.getElementById('question-counter').textContent = 'FIM';
    answersEl.innerHTML = '';
    feedbackEl.textContent = '';
    const scoreNumber = quizScore * 20;
    const title = scoreNumber >= 80 ? 'DEFENSOR DIGITAL' : scoreNumber >= 60 ? 'RADAR EM TREINAMENTO' : 'PRÓXIMA MISSÃO: PRATICAR';
    panelEl.hidden = false;
    panelEl.innerHTML = `<div class="result-score">${scoreNumber}<small> / 100</small></div><div class="result-title">${title} &nbsp; ◈</div><p class="result-desc">Você identificou ${quizScore} de 5 situações. Continue verificando pedidos urgentes, usando senhas únicas e reportando arquivos inesperados.</p><button class="result-restart" id="to-ending">Ver encerramento →</button>`;
    document.getElementById('to-ending').addEventListener('click', () => go(8));
  }
  renderQuestion();

  document.getElementById('restart').addEventListener('click', () => {
    score = 0; completed = { phishing: false, password: false, social: false };
    quizIndex = 0; quizScore = 0; panelEl.hidden = true;
    document.querySelectorAll('.choice,.answer,.chat-choice').forEach(el => { el.disabled = false; el.classList.remove('correct', 'wrong'); });
    document.querySelectorAll('.feedback').forEach(el => { el.textContent = ''; el.classList.remove('error'); });
    document.querySelector('.next-hidden').style.display = 'none';
    document.getElementById('open-file').disabled = false;
    resetMonitor(); renderQuestion(); go(0);
  });
})();
