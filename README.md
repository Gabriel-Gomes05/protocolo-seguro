# Protocolo Seguro

Landing page interativa em português sobre phishing, senhas, engenharia social e ransomware.

Abra `index.html` em um navegador para iniciar. O projeto não precisa de build nem instalação. As fontes personalizadas carregam do Google Fonts; se estiver offline, o navegador usa fontes alternativas.

## Um Clique — o curta interativo

O botão **▶ Assistir à experiência** abre um curta de cerca de 3 minutos, em tela cheia, em 10 cenas: a cidade, o vilão, phishing, o mundo digital, a rede, engenharia social, o vilão perde, ransomware, a virada e o final. Em cinco momentos o espectador decide o que o Gabriel faz; cada escolha muda a cena seguinte e soma pontos ao **Cyber Score** (0–100). No fim, o botão **Faça o teste de cybersegurança** leva à simulação em capítulos.

- `film.js` — motor de cenas (cenários desenhados em canvas, som sintetizado com Web Audio, narração com a voz pt-BR do navegador quando houver) e o roteiro.
- `film.css` — barras de cinema, legendas, decisões e interfaces (e-mail, celular, terminal).

Controles: `Espaço` pausa, `M` liga/desliga o som, `A`/`B`/`C` ou `1`/`2`/`3` respondem às decisões e `Esc` fecha.
