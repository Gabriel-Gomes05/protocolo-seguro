# Esquadrão Sentinela: guia do projeto para o Claude Code

Treinamento interativo de segurança da informação vendido como produto **white label** e entregue como pacote **SCORM 1.2**. O pacote abre na **Missão 0, "O Recrutamento"** (o Comandante apresenta vilões, esquadrão e juramento; roteiro em `docs/missao0-roteiro.md`), passa pela **Central de Missões** e segue para a **Missão 1, "A Isca"**, que ensina a reconhecer phishing. O colaborador assiste em **modo cinema**: cena em tela cheia, legendas de filme, vozes gravadas e trilha. Decisões, desafio e quiz aparecem por cima da cena.

Tudo é **gamificado**: XP por boa decisão, patentes, conquistas, sequência no quiz, estrelas por missão e progresso salvo no LMS (ver "Gamificação").

## Como rodar

```bash
npm install
npm run dev          # http://localhost:5173/src/
npm run build:scorm  # gera dist/esquadrao-sentinela-m1-scorm12.zip
```

**Uma página por missão (desenvolvimento):** `src/missao0.html`, `src/missao1.html` e `src/missao2.html` (ex.: http://localhost:5173/src/missao2.html) abrem direto na missão, sem recrutamento nem Central, e o Personalizar lista só os trechos dela. São cópias do `index.html` com `const MISSAO_FOCO = n` antes dos scripts (se mudar a marcação do index, replique nelas). O build tira essas páginas do pacote. A Missão 2 está em `src/js/missao2.js`, carregado só por `missao2.html` até entrar no pacote.

**Missão 2 · A Força Bruta (12/out/2026):** completa no player (`src/js/missao2.js` + `src/css/missao2.css`; roteiro em `docs/missao2-roteiro.md`), trechos `f1` a `f8`, `fd1`, `fd2`, `fquiz`, `ffim`. Faltam as vozes (62 falas listadas no roteiro; sem arquivo, a legenda fica o tempo de leitura) e os quadros por fala (a Chave-Mestra já tem folha de modelo em `referencias/personagens/` e folha de poses/expressões; recortes `chave_frente`, `chave_tresquartos`, 6 poses `chave_<pose>`, 8 expressões `chave_cara_<nome>` e 3 bocas `chave_boca1..3`. Na fala: `set: { heroiPose: "aponta" }` troca a pose (atuação em missao2.css, `.act-chave-<pose>`) e `set: { cara: "serio" }` muda a expressão no comunicador; sem `cara`, a boca mexe). A Força Bruta entra na sala escura como recorte (`HEROIS.forca`; folhas em `referencias/personagens/forca_bruta_*`, prompts em `docs/prompts-forca-bruta.md`): `set: { vilao: "forca", vilaoPose: "soco" }` (poses aquece, soco, insiste, comemora, le, reverencia, furiosa, ameaca; `escala` e `ancora` por pose mantêm o corpo no lugar), `caraVilao` fixa a expressão do close de quadrinho que aparece enquanto ela fala (sem ela, a boca mexe) e `fxVilao: "soco"`/`"racha"` dispara os efeitos (`forca_fx_*`). O motor desenha qualquer `st.vilao` com `extra(st)` para camadas próprias. Pontos de extensão do motor que uma missão nova preenche: `CAPS[n]`, `QUIZZES[n]`, `FINAIS[n]` (insígnia, gabarito, textos do resultado), `CONQUISTAS`, `INSIGNIAS`, `HEROIS` (herói em cena `st.heroi`, por recortes `poses` ou holograma da arte de duelo, e comunicador `radio` + `st.radioHeroi`), `TERMINAIS` (sala escura, `st.term`), `SCREENS`, e o trecho `type: "classificar"` (desafio de classificar itens). Chaves de XP de quiz e reflexo levam o número da missão a partir da 2. Cenários próprios por missão: `FUNDOS.m2 = { office, central, dark }` (arquivos `bg_*_m2.jpg`, fontes em `referencias/cenarios/cenario_*_m2_v1.jpg`; a Central é `cenario_central_m2_v2.jpg`, uma sala só com o telão à esquerda e o herói na plataforma do nicho à direita, em [80.8, 35, 50]; a sala da Força Bruta é `cenario_sala_m2_v2.jpg`, com o terminal num balão que sai do monitor da mesa), escolhidos por `fundos: "m2"` no estado-base `M2`, com câmera em `CAMERAS_MISSAO` (chave = nome do arquivo) e camadas reposicionadas no CSS da missão por `.stage[data-fundo]`/`.shot[data-bg]`; o celular segue o da Missão 1. Fluidez por missão (sem afetar as outras): `IMAGENS_MISSAO` (pré-carregamento), `TRANSICOES_MISSAO` (transição por par de cenários, ex.: `"office>dark": "glitch"`), e o player marca quem fala (`data-voz` no palco, `.falando` no herói com `HEROIS[k].voz`) e reinicia `.subs.entra` a cada fala; o estilo de cada um fica no CSS da missão.

No modo dev aparece o botão **Personalizar** (troca empresa, cor, logo e canal de reporte, pula para qualquer trecho das Missões 0 e 1 e zera XP e progresso). No pacote SCORM esse painel some (`modoDemo: false`, aplicado pelo build). Fora do LMS, o progresso fica no localStorage do navegador: use "Zerar XP e progresso" para ver a primeira visita de novo.

Para testar no LMS, importe o .zip no SCORM Cloud (cloud.scorm.com, gratuito). O resultado deve registrar complete, passed/failed, nota e tempo.

## Estrutura

```
src/index.html        marcação do player (palco 16:9, legendas, topbar, overlay de decisões)
src/css/player.css    todo o visual (modo cinema, telas sobrepostas, cartões)
src/js/config.js      CONFIG white label: o ÚNICO arquivo que muda por cliente
src/js/core.js        utilidades (esc, fmt com {EMPRESA}/{slug}/{dominio}) e ponte SCORM 1.2
src/js/cenas.js       desenha cada cena: sceneParts(st), m0HTML (Missão 0), SCREENS (e-mail, login, SMS, tutorial…), ICONES
src/js/roteiro.js     o roteiro como dado: MISSOES, CAPS, regras de XP/PATENTES/CONQUISTAS, SCENES, QUIZ, HOTSPOTS
src/js/progresso.js   gamificação: PROG (XP, patente, conquistas, notas), placar de XP no topo e avisos (toasts)
src/js/animacao.js    câmera lenta por cena, transições entre planos (cortes secos no susto e no alarme), troca suave de camadas
src/js/player.js      motor: go(), playLine(), áudio (falar, trilha, efeito, bip sintetizado), overlays, Central de Missões, controles
assets/img            fundos (bg_*.jpg), cenas prontas (cena01-03.jpg, m0_O1-O9.jpg) e recortes (isca_*.png, lupa_*.png)
assets/img/quadros    um quadro por fala da Missão 1 (gerado por npm run quadros:preparar)
assets/audio          83 falas: <trecho>_<nn>_<voz>.mp3 (Missão 1, ex.: t1_04_lupa.mp3) e m0_<nn>_<voz>.mp3 (Missão 0)
assets/sfx            trilha.mp3 (original) e efeitos (notificacao, acerto, erro, insignia, rebobinar)
referencias/          folhas de modelo e poses; cenários; cenas originais; missao0/ (Comandante, cenas em alta); viloes/; marca/
docs/                 roteiros (Missão 0 e completo), storyboard (.pdf), narração (.csv), textos para o ElevenLabs
scripts/              servidor dev, build SCORM, divisão de áudio, preparar quadros, colar o broche (Missão 0)
```

Os scripts são clássicos (sem bundler) e compartilham escopo global, nesta ordem: config → core → cenas → roteiro → progresso → animacao → player. Manter assim: o pacote precisa abrir em qualquer LMS, sem build no cliente.

## Como uma cena funciona

O roteiro é uma lista de trechos (`SCENES`). Um trecho do tipo `lines` tem falas; cada fala pode trazer `set`, que altera o estado do palco (`S.stage`):

| Campo | Valores | Efeito |
| --- | --- | --- |
| `bg` | `title`, `office`, `roof`, `central`, `phone`, `dark` | cenário |
| `lupa` | `true`/`false` | Lupa em cena |
| `lupaPose` | `null`, `"aponta"` | no escritório: cena02 (examinando) ou cena03 (apontando) |
| `isca` | `far`, `fisgou`, `tramando`, `caido`, `irritado`, `mao`, `lancar`, `rede`, `null` | pose do Isca no telhado (arquivo `isca_<pose>.png`) |
| `screen` | `email1`, `login`, `reply1`, `reply2`, `tutorial`, `sms`, `card`, `app`, `steps`, `report`, `null` | tela sobreposta (monitor, celular, telão ou tela cheia) |
| `fx` | `hook`, `cut`, `alert`, `stamp`, `rewind`, `lights`, `badge`, `null` | efeitos |
| `hl` | chave de `ORDEM_PISTAS` ou `"todos"` | pista destacada no tutorial |
| `step` | 1 a 4 | passo destacado no trecho 7 |

Na **Missão 0** (`bg: "m0"`, trechos `m0a` a `m0i`; o estado-base é `M0` em roteiro.js) os campos são outros:

| Campo | Valores | Efeito |
| --- | --- | --- |
| `img` | `m0_O1.jpg` … `m0_O9.jpg` | cena pronta da estação (cada uma tem câmera e camadas animadas próprias em `m0HTML`) |
| `vilao` | `isca`, `forca`, `vazamento`, `camaleao`, `"todos"`, `null` | foco, mira e dossiê do vilão no painel (O4) |
| `pods` | `"lupa"`, `"todos"`, `null` | heróis na galeria (O6) |
| `mapa` | `0`, `1`, `2` | telão das missões com as artes de duelo (O7); `2` mostra também as insígnias |
| `fx` | `nervoso`, `holo`, `glitch`, `vozfalsa`, `alarme`, `central` | suor, transmissão da Isca, Camaleão, carimbo, alarme, fundo da Central |

Na fala: `a` dá o nome do arquivo de áudio e `radio: "esq"`/`"dir"` mostra o comunicador da Lupa. Outros tipos de trecho: `juramento`, `aceite` e `hub` (Central de Missões).

`renderStage()` só redesenha a arte quando o estado muda. Cada fala toca `assets/audio/<trecho>_<nn>_<voz>.mp3` (ou o arquivo em `a`); quando o áudio termina, o player avança sozinho, se o avanço automático estiver ligado. A legenda mostra `fmt(texto)`, com o nome do cliente.

## Gamificação

- **XP** (`XP` em roteiro.js, motor em progresso.js): `PROG.ganhar(chave, xp, motivo)` soma uma única vez por chave (rever não acumula), mostra o aviso "+XP" com som de moeda e anuncia promoções. Decisões dão XP pela opção (`xp`, `motivo`, `conq`, `reflexo` em cada opção).
- **Patentes** (`PATENTES`): Recruta, Cadete (a Missão 0 inteira já dá), Agente, Sentinela, Sentinela de Elite (Missão 1 perfeita).
- **Conquistas** (`CONQUISTAS`): Recruta Sentinela, Olho Vivo, Caçador de Pistas, Direto na Fonte, Reflexo Rápido (decisão do SMS em menos de 5 s), Gabarito, Insígnia da Lupa.
- **Quiz:** sequência a partir de 3 acertos seguidos dá bônus; estrelas por missão (3 com 5 acertos, 2 com aprovação).
- **Central de Missões** (`hub`): patente, barra de XP, cartões de `MISSOES` com a arte de duelo meio escura (concluída, liberada, bloqueada, em breve) e quadro de conquistas. Fundo: `bg_comando.jpg` (salão vazio). Arte de duelo: `dueloHTML()` em cenas.js, imagens `assets/img/duelo_1..4.jpg` (fontes em `referencias/duelos/`, prompts em `docs/prompts-duelos.md`, `npm run quadros:preparar` liga novas). Escurecida pelo estado: liberada meio escura, bloqueada escura e desfocada (herói secreto), vencida colorida com selo "VENCIDO". Layout de referência: `referencias/duelos/prints/`.
- **Progresso salvo:** `cmi.suspend_data` no LMS (JSON curto, ~350 caracteres; limite do SCORM 1.2: 4096) ou localStorage fora dele. Quem já fez a Missão 0 entra direto pela Central.
- A nota do LMS continua sendo só a do quiz da Missão 1 (`renderEnd()`); XP não entra na nota.

## Regras que não podem quebrar

1. **White label:** nada de nome, logo ou cor do cliente dentro de imagem, vídeo ou áudio. Tudo entra pelo player (`CONFIG`, `fmt`, `.sign`). O áudio diz "empresa".
2. **SCORM 1.2:** manter `SCORM.init`, a gravação de nota/status/tempo em `renderEnd()` e o `LMSFinish` no `pagehide`. Todo arquivo novo precisa ficar dentro de `src/` ou `assets/` para o build incluir no manifesto.
3. **Sem dependência externa em tempo de execução**, além das fontes do Google, que têm fallback. Bibliotecas de animação devem ir como arquivo local em `src/vendor/` (ex.: GSAP), nunca por CDN, porque intranets costumam bloquear.
4. **Funciona sem animação:** com `prefers-reduced-motion`, o player deve mostrar as cenas estáticas, como hoje.
5. **Celular:** em tela estreita, a cena fica no topo e os cartões abaixo (media query em player.css). Nada pode gerar rolagem horizontal.
6. **Tamanho:** o pacote hoje tem ~12 MB (Missões 0 e 1). Mantenha abaixo de ~40 MB.
7. **Conteúdo de segurança correto:** o personagem nunca pode ensinar algo inseguro (ex.: entregar um pen drive).

## Roteiro de animação (backlog)

Faça em ordem. Cada etapa precisa deixar o módulo funcionando e testado.

**Direção atual (06/out/2026):** a série terá vários episódios, cada um com **personagens novos** (Lupa e Isca são só do episódio 1); cada episódio é um pacote SCORM próprio, com a abertura de série (`MISSOES` em roteiro.js, mostrada na abertura e na Central de Missões). Vídeo de IA (Flow/Veo) foi testado e descartado: os personagens mudam de cara entre clipes. **Formato escolhido: quadrinho animado.** Cada fala traz `set: { quadro: "q_t1_05" }` (e opcionalmente `depois: { quadro: ... }`, aplicado no meio da fala); as imagens aprovadas ficam em `referencias/cenas/` e `npm run quadros:preparar` comprime para `assets/img/quadros/` e atualiza `QUADROS_PRONTOS` em cenas.js. Fala sem quadro pronto mostra a ilustração animada. Prompts das imagens: `docs/prompts-animacao.md`. O suporte a vídeo (clipes por fala, `CONFIG.clipes`, `CONFIG.videos`, `npm run video:preparar`) foi **removido** em 07/out/2026, junto com os clipes brutos.

**Missão 0 (07/out/2026):** integrada com animação nas 9 cenas (ver `docs/missao0-roteiro.md`). É a versão exclusiva Francal: as cenas e o áudio trazem a marca e a voz do presidente, o que foge da regra 1; para vender a outros clientes falta a versão genérica.

### Etapa 1 · Movimento de câmera e vida no palco (só código) · FEITA
- Câmera lenta em cada cena (zoom de 1.0 a ~1.06 e leve deslocamento) em vez de imagem parada; cortes com transição suave (fade ou wipe) entre cenários.
- Personagens recortados com "respiração" (escala vertical 1.000 a 1.012, ciclo de ~3 s), leve balanço e entrada/saída com movimento.
- Animações por efeito: anzol voando no `hook`, linha se partindo no `cut`, janelas acendendo em sequência no `lights` (já existe, refinar), insígnia girando no `badge`.
- Sugestão: GSAP (arquivo local) com uma timeline por mudança de `S.stage`. Critério: nenhuma cena fica 100% parada; nada pisca nem pula ao trocar de fala.

### Etapa 2 · Personagens articulados (cut-out)
- Separar os personagens em partes (cabeça, tronco, braços, antebraços, capa) a partir das folhas de pose em `referencias/personagens`. Pode-se gerar as partes no Gemini ("mesmo personagem, só o braço direito, fundo transparente") ou recortar num editor.
- Montar cada personagem como grupo de camadas com pivôs (ombro, cotovelo, pescoço) e animar gestos: Lupa erguendo a lupa, apontando, entregando a insígnia; Isca lançando a vara, comemorando, caindo.
- Piscar: camada de pálpebras alternando a cada 3 a 6 s. Boca: 2 ou 3 formas trocando enquanto o áudio da fala toca (usar `VOZ.currentTime` ou um AnalyserNode do Web Audio para a abertura da boca).

### Etapa 3 · Clipes de vídeo gerados por IA (Google Flow / Veo) · DESCARTADA (o código foi removido; mantido aqui só como histórico)
- Testado e rejeitado: os personagens mudavam de cara entre clipes. O formato escolhido é o quadrinho animado (acima).

### Etapa 4 · Acabamento
- Mixagem: abaixar a trilha suavemente durante as falas (já existe em `trilha()`), adicionar ambiência por cenário (escritório, noite na cidade, base).
- Rever legendas e tempos com os áudios regravados (ver abaixo).
- Testar o pacote no SCORM Cloud, no desktop e no celular.

## Áudio

As falas atuais foram cortadas de gravações únicas e alguns cortes ficaram secos; as falas do Isca estão desalinhadas. O plano é regravar no ElevenLabs (modelo Multilingual v2) com os textos de `docs/textos-com-pausas-elevenlabs.txt`, que já trazem `<break time="1.5s" />` entre as falas, e dividir com:

```bash
npm run audio:dividir -- "LUPA · PARTE 1 de 3 (falas 1 a 12)" audio-bruto/lupa-parte1.mp3
```

O script confere se a quantidade de pausas bate com a de falas antes de gravar em `assets/audio/`. Salve as gravações inteiras numa pasta `audio-bruto/` (fora do pacote e ignorada pelo git). Os blocos da Missão 0 (`M0 · …`) também estão em `scripts/blocos-audio.json`.

Sons curtos de interface (moeda do XP, sirene, falha do holograma, chiado do rádio) são sintetizados na hora por `bip()` em player.js, sem arquivo.

## Arte

- Estilo: ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples.
- Lupa: casaco azul-petróleo #2B5F6E, capa âmbar #F2A93B, calça #25324C, óculos redondos, cabelo preto chanel, lupa de cabo de madeira.
- Isca: sobretudo cinza #3B4459, cachecol e faixa do chapéu vermelhos #D84A4A, chapéu cinza #5B6274, vara com anzol de envelope.
- A Força Bruta (vilã do módulo 2): gigante de blocos de teclas, olhos vermelhos; no módulo 1 aparece só a sombra.
- Cenas que ainda faltam gerar (cenário + personagem): ver `docs/cenas-para-gerar.md`. As 3 primeiras já estão em `assets/img/cena01-03.jpg`.

## Como testar uma mudança

1. `npm run dev` e percorrer o módulo pelo botão Personalizar → "Ir direto para um trecho" (M0 e M1); "Zerar XP e progresso" volta à primeira visita.
2. Conferir em 1280×720 e em 390×844 (celular), sem erros no console.
3. `npm run build:scorm` e importar no SCORM Cloud quando mexer em algo que afete o pacote.
