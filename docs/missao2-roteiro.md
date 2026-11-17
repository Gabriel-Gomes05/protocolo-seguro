# Missão 2 · A Força Bruta: roteiro

Versão de 12 de outubro de 2026. É o roteiro exatamente como está no player (`src/js/missao2.js`, página `src/missao2.html`). Segue o esqueleto da Missão 1: abertura, decisão ramificada, lição, desafio, virada com decisão rápida, "e se eu errar", desfecho e quiz. Duração de 6 a 8 minutos.

**CENA** descreve o que se vê; **PLAYER** descreve o que a camada interativa faz. **[EMPRESA]** é preenchido pelo player; no áudio, as vozes dizem só "empresa".

## Personagens

| Personagem | Papel | Personalidade | Visual (referência) |
| --- | --- | --- | --- |
| Chave-Mestra | Herói da missão: senhas e acessos | Calmo, paciente, firme, com humor seco. Bordão: "Uma chave só não basta." | Homem de barba e óculos, traje azul com linhas claras, cadeado no peito, capa azul-marinho, escudo-cadeado no braço esquerdo e token de pulso com tela verde. Folha: `referencias/personagens/chave_mestra_folha_modelo_v1.jpg`; recortes `assets/img/chave_frente.png` e `chave_tresquartos.png` |
| A Força Bruta | Vilã: ataques de senha, senhas vazadas, insistência | Brava, impaciente e eloquente; comemora cada "123456" | Gigante de blocos de teclas, olhos vermelhos. Folha: `referencias/viloes/forca_bruta_folha_modelo_v1.jpg` |
| Narrador | Abre e fecha os trechos | Grave e suave | |

O nome do herói segue o código e as artes (Chave-Mestra). A bíblia (`esquadrao-sentinela-roteiro-completo.md`) ainda o chama de "Trava".

## O que a missão ensina

1. **Tamanho vence complicação:** frase-senha com 4 palavras ou mais, sem nome, data, time, empresa ou sequência de teclado.
2. **Uma senha para cada lugar:** um vazamento abre todas as portas onde a senha se repete.
3. **Gerenciador de senhas:** cria e guarda senhas fortes (o TI indica qual).
4. **Verificação em duas etapas:** a segunda trava.
5. **Pedido de login que você não fez = alguém tem a sua senha:** negue, troque a senha, avise o TI. Ninguém pede senha nem código.

## Trecho 1 · Abertura (`f1`)

**CENA:** Escritório, quarta-feira de manhã. No monitor, o portal de primeiro acesso do sistema novo (endereço oficial `https://acesso.[domínio]/primeiro-acesso`), com o campo de senha vazio e o cursor piscando. Corte para a sala escura: os olhos vermelhos da Força Bruta e o terminal carregando "lista: 10 milhões de senhas". Volta ao escritório: a Chave-Mestra surge ao lado da mesa.

**NARRADOR:** Quarta-feira, 9 da manhã. O TI acabou de liberar o seu acesso ao sistema novo da [EMPRESA].

**NARRADOR:** Falta só uma coisa: criar a sua senha.

**NARRADOR:** Enquanto isso, numa sala escura, alguém já está aquecendo os dedos.

**FORÇA BRUTA:** Mais um recruta criando senha… Adoro esse momento. Vai, me dá um 123456.

**CHAVE-MESTRA:** Calma aí, recruta. Antes de digitar, pensa como ela.

**CHAVE-MESTRA:** Prazer, Chave-Mestra, do Esquadrão Sentinela. Eu cuido das portas, e a senha é a porta da frente.

**CHAVE-MESTRA:** Ela testa milhões de senhas por segundo. Então: qual vai ser a sua?

## Decisão 1 (`fd1`)

**PLAYER:** "Que senha você cria?", com o portal ao lado das opções.

| Botão | Vai para | XP | Observação |
| --- | --- | --- | --- |
| A) [Empresa]2026! · tem maiúscula, número e símbolo | 2A | 20 | |
| B) A mesma do meu e-mail pessoal, assim não esqueço | 2B | 10 | |
| C) Uma frase só minha, com 4 palavras ou mais | 2C | 100 | Conquista "Frase de Ferro" |

## Trecho 2A · O padrão de sempre (`f2a`)

**CENA:** O campo mostra "[Empresa]2026!". Corte para a sala escura: o terminal testa 123456 ✗, senha123 ✗, [Empresa]2026! ✓ e pisca "ACESSO LIBERADO". Volta ao escritório com a Chave-Mestra e o efeito de rebobinar.

**NARRADOR:** Você digita [Empresa]2026! e confirma. Senha aceita.

**NARRADOR:** Do outro lado, a lista da Força Bruta começa pelo mais óbvio.

**FORÇA BRUTA:** Nome da empresa, ano, ponto de exclamação. Clássico! Esse padrão está no topo da minha lista.

**FORÇA BRUTA:** Achei! Bom dia, sistema novo da [EMPRESA].

**CHAVE-MESTRA:** Acontece com muita gente. Parece forte porque tem maiúscula, número e símbolo, mas é o padrão que todo mundo usa.

**CHAVE-MESTRA:** Força bruta não adivinha: testa listas. Vamos voltar a fita e ver o que ela não consegue testar.

## Trecho 2B · A chave que abre tudo (`f2b`)

**CENA:** O campo mostra a senha mascarada, com a nota "A mesma do seu e-mail pessoal". Corte para a sala escura: o terminal abre "vazamento_streaming.txt" e entra no e-mail pessoal ✓ e no sistema da [EMPRESA] ✓. Volta ao escritório com a Chave-Mestra e o efeito de rebobinar.

**NARRADOR:** Você repete a senha do seu e-mail pessoal. Fácil de lembrar.

**NARRADOR:** Só que, no ano passado, um site de streaming onde você usava essa mesma senha foi invadido.

**FORÇA BRUTA:** Lista de vazamento, minha leitura favorita. Uma senha, e eu testo em todo lugar.

**FORÇA BRUTA:** E-mail pessoal… entrei. Sistema da [EMPRESA]… entrei também!

**CHAVE-MESTRA:** Senha repetida vira uma chave-mestra na mão do bandido. E esse nome já tem dono.

**CHAVE-MESTRA:** Um vazamento em qualquer site abre todas as portas onde a senha se repete. Vamos voltar a fita.

## Trecho 2C · Séculos de espera (`f2c`)

**CENA:** O campo mostra "girassol-trator-nuvem-pipoca". Corte para a sala escura: o terminal erra tudo, mostra "tempo estimado: séculos" e "SEM SUCESSO" em verde. Volta ao escritório: a Chave-Mestra e o selo "Frase de Ferro".

**NARRADOR:** Você cria uma frase só sua, com quatro palavras sem relação entre si.

**NARRADOR:** A Força Bruta começa a testar.

**FORÇA BRUTA:** Quatro palavras?! Sem nome, sem data, sem nada pra eu adivinhar? Isso não vale!

**CHAVE-MESTRA:** Vale sim. Jogada de mestre, recruta.

**CHAVE-MESTRA:** Tamanho vence complicação. Frase longa é fácil pra você lembrar e demorada demais pra ela adivinhar.

**CHAVE-MESTRA:** Agora deixa eu te mostrar as regras da chave.

**PLAYER:** selo "Frase de Ferro".

## Trecho 3 · As regras da chave (`f3`)

**CENA:** Central Sentinela. A Chave-Mestra à direita; depois, o quadro "As 4 regras da chave" ocupa a tela e cada regra acende numerada. No fim, as quatro juntas e a faixa "Uma chave só não basta. E a senha é só sua: ninguém do TI, do banco ou da diretoria pede. Nem o código."

**CHAVE-MESTRA:** Força bruta é isso: um programa testando senhas, uma atrás da outra, até acertar. Ele não cansa.

**CHAVE-MESTRA:** Ele começa pelas mais comuns, pelos padrões e pelas senhas que já vazaram. Contra isso, quatro regras.

**CHAVE-MESTRA:** Um: tamanho vence complicação. Use uma frase-senha, com quatro palavras ou mais, que só você conheça.

**CHAVE-MESTRA:** Nada de nome, data de nascimento, time, nome da empresa ou sequência de teclado. Isso é o começo da lista dela. E não copie os exemplos daqui: crie a sua.

**CHAVE-MESTRA:** Dois: uma senha para cada lugar. Se um site vazar, só aquela porta fica aberta.

**CHAVE-MESTRA:** Três: use um gerenciador de senhas. Ele cria e guarda senhas fortes por você. Pergunte ao TI qual a [EMPRESA] recomenda.

**CHAVE-MESTRA:** Quatro: ligue a verificação em duas etapas. Mesmo com a senha, ninguém entra sem o segundo passo.

**CHAVE-MESTRA:** E a senha é só sua. Ninguém do TI, do banco ou da diretoria vai pedir. Nem o código. Uma chave só não basta.

## Trecho 4 · Desafio: fraca ou forte? (`f4`)

**PLAYER:** "Desafio: a Força Bruta adivinharia? Classifique cada senha." Seis senhas, cada uma com os botões **Fraca** e **Forte**. Acerto: som e +20 XP. Erro: mostra a resposta certa, sem XP. Sem nenhum erro: +50 XP e a conquista "Quebra-Padrões".

| Senha | Resposta | Explicação |
| --- | --- | --- |
| Fernanda1987 | Fraca | Nome e ano de nascimento estão nas redes sociais. É dos primeiros palpites. |
| girassol-trator-nuvem-pipoca | Forte | Quatro palavras sem relação: longa, fácil de lembrar e difícil de adivinhar. |
| 123456 | Fraca | A senha mais usada do mundo. É a primeira tentativa de qualquer ataque. |
| P@ssw0rd! | Fraca | Trocar letra por símbolo não engana: os programas já testam essas trocas. |
| minha tia faz bolo de fubá às quintas | Forte | Frase longa e pessoal, sem dado público. Tamanho é força. |
| [Empresa]2026! | Fraca | Nome da empresa + ano + símbolo: um dos primeiros padrões testados. |

Ao concluir:

**CHAVE-MESTRA:** Repara: as fracas parecem complicadas, mas seguem padrões. As fortes são só longas e imprevisíveis. É isso que trava a Força Bruta.

## Trecho 5 · A Força Bruta muda de tática (`f5`)

**CENA:** Sala escura: o terminal mostra "senha (vazamento) ✓", "segunda etapa ✗", "enviando pedidos…". Corte para o celular na mão, à noite: tela de bloqueio às 23:06 com pedidos de login empilhando ("Você está tentando entrar? Negar · Aprovar"). A Chave-Mestra fala pelo comunicador.

**NARRADOR:** A Força Bruta, irritada, troca de tática.

**FORÇA BRUTA:** Senha eu acho num vazamento qualquer. O problema é essa tal de segunda etapa… Então eu insisto. Até alguém cansar.

**NARRADOR:** Onze da noite. Seu celular não para de vibrar.

**NARRADOR:** Pedido de login. E de novo. E de novo.

**CHAVE-MESTRA (comunicador):** Recruta, olha a hora. Você está tentando entrar em algum lugar agora?

## Decisão 2 · rápida (`fd2`)

**PLAYER:** "Decida rápido: o que você faz?", com o celular ao lado. Cronômetro de 10 segundos; se o tempo acabar, segue para 6B sem penalidade ("Sem problema: veja o que a Chave-Mestra faria.").

| Botão | Vai para | XP | Observação |
| --- | --- | --- | --- |
| A) Aprovar, só pra parar de apitar | 6A | 10 | |
| B) Negar, trocar a senha e avisar o TI | 6B | 100 | Conquista "Segunda Trava"; em menos de 5 s, +40 XP e "Dedo Rápido" |

## Trecho 6A · Porta aberta (`f6a`)

**CENA:** Celular com "Login aprovado · Dispositivo novo conectado". Corte para a sala escura: "aprovação do usuário ✓", "ACESSO LIBERADO". Volta ao celular, Chave-Mestra pelo comunicador.

**NARRADOR:** Você toca em Aprovar. O celular, enfim, fica quieto.

**FORÇA BRUTA:** Obrigada pela ajuda! Entrei pela porta da frente, com a sua autorização.

**CHAVE-MESTRA:** Pedido que você não fez quer dizer uma coisa: alguém já tem a sua senha.

**CHAVE-MESTRA:** Nunca aprove o que você não pediu. Negue, troque a senha e avise o TI na hora.

## Trecho 6B · A segunda trava (`f6b`)

**CENA:** Celular com "Login negado · Senha alterada · Central Sentinela avisada". Corte para a sala escura: "ACESSO NEGADO" em verde. Volta ao celular, Chave-Mestra pelo comunicador.

**NARRADOR:** Você toca em Negar, troca a senha e avisa a Central Sentinela.

**FORÇA BRUTA:** Negado?! E ainda trocou a senha? Volta tudo pro começo da lista!

**CHAVE-MESTRA:** Isso! A senha caiu, mas a segunda trava segurou a porta.

**CHAVE-MESTRA:** Uma chave só não basta. Por isso a gente usa duas.

## Trecho 7 · E se a minha senha vazar? (`f7`)

**CENA:** Central Sentinela, tom mais sério. A Chave-Mestra à direita; os 4 passos aparecem no telão um a um; no fim, o canal de reporte do cliente.

**CHAVE-MESTRA:** Agora a parte mais importante do treinamento.

**CHAVE-MESTRA:** Senhas vazam, até de sites grandes. Muitas vezes nem é culpa sua.

**CHAVE-MESTRA:** O que importa é agir rápido quando você desconfia.

**CHAVE-MESTRA:** Primeiro: troque a senha na hora, começando pelo e-mail, que recupera todas as outras.

**CHAVE-MESTRA:** Segundo: troque em todo lugar onde você usava a mesma senha.

**CHAVE-MESTRA:** Terceiro: avise o TI pelo canal oficial. Eles conferem acessos estranhos e bloqueiam a tempo.

**CHAVE-MESTRA:** Quarto: ligue a verificação em duas etapas onde ainda não estiver ligada.

**CHAVE-MESTRA:** Ninguém vai te culpar por avisar. O estrago vem do silêncio.

**PLAYER:** caixa com o canal de reporte do cliente (configuração white label).

## Trecho 8 · Desfecho (`f8`)

**CENA:** Sala escura: tentativa 1.000.000 ✗, 2.000.000 ✗, segunda etapa ✗, "ACESSO NEGADO". Central: a Chave-Mestra e a insígnia da chave girando. Corte final: sala escura com o terminal mostrando "clientes_FINAL.xlsx · link público: qualquer um · VAZANDO…" (gancho do Vazamento).

**NARRADOR:** Na sala escura, a Força Bruta tenta de novo…

**NARRADOR:** …mas cada porta da [EMPRESA] agora tem frase longa e segunda trava.

**FORÇA BRUTA:** Isso não acaba aqui! Um dia alguém vai repetir uma senha…

**CHAVE-MESTRA:** E nesse dia você vai lembrar: uma chave só não basta.

**CHAVE-MESTRA:** Segunda insígnia conquistada, recruta. O esquadrão está ficando forte.

**NARRADOR:** Enquanto isso, em algum lugar, uma planilha esquecida começa a pingar…

**NARRADOR:** Próxima missão: O Vazamento.

**PLAYER:** fanfarra da insígnia; em seguida abre o quiz.

## Resultado

**PLAYER:** acertos, estrelas, a Insígnia da Chave-Mestra (com 4 ou 5 acertos), as conquistas, o tempo e as escolhas feitas. Com menos de 4 acertos, oferece refazer o quiz. Nota (0 a 100), status e tempo vão para o LMS.

## Quiz final

Cinco perguntas; aprovação com 4 acertos. A resposta certa está em negrito.

1. **Qual destas senhas a Força Bruta teria mais dificuldade para adivinhar?**
    - a) [Empresa]@2026
    - b) Tr0c@d0r!
    - **c) cafe-janela-trovao-bicicleta**
    - *Chave-Mestra:* Tamanho vence complicação: quatro palavras sem relação valem mais que trocar letra por símbolo.
2. **Um site onde você tem conta foi invadido e as senhas vazaram. Você usava a mesma senha no seu e-mail. O que fazer?**
    - a) Nada, o vazamento foi só naquele site
    - **b) Trocar a senha do e-mail e de todo lugar onde ela se repetia**
    - c) Esperar o site mandar um aviso
    - *Chave-Mestra:* Senha vazada é testada em todo lugar. Troque onde ela se repete, começando pelo e-mail.
3. **Onze da noite, chegam pedidos de login que você não fez. O que você faz?**
    - a) Aprova, para as notificações pararem
    - **b) Nega, troca a senha e avisa o TI**
    - c) Ignora e vai dormir
    - *Chave-Mestra:* Pedido que você não fez quer dizer que alguém já tem a sua senha. Negue e troque a senha antes que ela insista.
4. **Alguém liga dizendo ser do TI e pede o código que acabou de chegar no seu celular, “para validar seu acesso”. Você:**
    - a) Passa o código, é do TI
    - **b) Não passa. Ninguém pede código nem senha; desliga e avisa o TI pelo canal oficial**
    - c) Passa só metade do código
    - *Chave-Mestra:* O código é a segunda trava. Quem pede o código está tentando abrir a sua porta.
5. **Qual o jeito mais seguro de lidar com dezenas de senhas diferentes?**
    - a) Anotar todas num papel colado no monitor
    - b) Usar a mesma senha forte em tudo
    - **c) Usar um gerenciador de senhas, como o que o TI recomenda**
    - *Chave-Mestra:* O gerenciador cria e guarda uma senha diferente para cada lugar. Você só precisa lembrar de uma frase forte.

## Gamificação

| Ação | XP | Conquista |
| --- | --- | --- |
| Decisão 1 | 20 / 10 / 100 | Frase de Ferro (frase-senha) |
| Desafio | 20 por acerto, +50 sem erro | Quebra-Padrões (sem erro) |
| Decisão 2 | 10 / 100, +40 se negar em menos de 5 s | Segunda Trava; Dedo Rápido |
| Quiz | 40 por acerto, +20 por acerto a partir do 3º seguido | Gabarito da Chave (5 de 5) |
| Aprovação (4 acertos) | 150 | Insígnia da Chave-Mestra |

As chaves de XP da Missão 2 são separadas das da Missão 1 (rever não acumula, mas uma missão não bloqueia a outra).

## Produção: o que falta

| Peça | Situação |
| --- | --- |
| Roteiro, desafio, quiz e player | Prontos (`src/missao2.html`) |
| Vozes | **Faltam as 62 falas** (lista abaixo). Sem o arquivo, a legenda fica na tela o tempo de leitura |
| Chave-Mestra | Folha de modelo e folha de poses/expressões aprovadas (`referencias/personagens/`). Em cena: 6 poses com atuação própria (aponta, cruzado, escudo, token, comemora, pensa), escolhidas fala a fala (`heroiPose`); no comunicador, a boca mexe enquanto ele fala e 8 expressões (`cara`) |
| Força Bruta | Aparece como silhueta na sala escura (cenário existente); folha de modelo pronta |
| Quadros por fala (formato quadrinho animado) | A gerar, como na Missão 1: escritório com o portal de senha, sala escura, celular à noite, Central |
| Central Sentinela | O cenário atual tem o emblema da lupa no telão; avaliar uma variação neutra ou com a chave |
| Canal de reporte | Vem do CONFIG do cliente; o texto de exemplo fala em "phishing" |

### Vozes

| Personagem | Falas | Direção | Voz no ElevenLabs |
| --- | --- | --- | --- |
| Chave-Mestra | 34 | Masculina adulta, calma e firme, humor seco; séria no trecho 7 | **Diego – Confident Announcer** (modelo v4) |
| Narrador | 18 | A mesma voz das Missões 0 e 1 | **Will – Deep, Smooth and Affectionate** (registrado em `docs/missao0-roteiro.md`) |
| A Força Bruta | 10 | A mesma voz do fim da Missão 1: feminina brava, impaciente, vilã eloquente | **Jessica Anne Bogart – Eloquent Villain** (modelo v4) |

Dica de pronúncia (como na Missão 1): no texto da voz, escreva números e siglas por extenso ("um, dois, três, quatro, cinco, seis"; "empresa dois mil e vinte e seis"; "onze da noite"). A legenda continua mostrando os números.

### Arquivos de áudio (`assets/audio/`)

Gerado a partir de `src/js/missao2.js`. Nome: `<trecho>_<nn>_<voz>.mp3`; a fala final do desafio é `f4_01_chave-mestra.mp3`.

| Arquivo | Voz | Legenda | Texto para a voz |
| --- | --- | --- | --- |
| `f1_01_narrador.mp3` | Narrador | Quarta-feira, 9 da manhã. O TI acabou de liberar o seu acesso ao sistema novo da [EMPRESA]. | Quarta-feira, nove da manhã. O TI acabou de liberar o seu acesso ao sistema novo da empresa. |
| `f1_02_narrador.mp3` | Narrador | Falta só uma coisa: criar a sua senha. | (igual) |
| `f1_03_narrador.mp3` | Narrador | Enquanto isso, numa sala escura, alguém já está aquecendo os dedos. | (igual) |
| `f1_04_forca-bruta.mp3` | Força Bruta | Mais um recruta criando senha… Adoro esse momento. Vai, me dá um 123456. | Mais um recruta criando senha… Adoro esse momento. Vai, me dá um um, dois, três, quatro, cinco, seis. |
| `f1_05_chave-mestra.mp3` | Chave-Mestra | Calma aí, recruta. Antes de digitar, pensa como ela. | (igual) |
| `f1_06_chave-mestra.mp3` | Chave-Mestra | Prazer, Chave-Mestra, do Esquadrão Sentinela. Eu cuido das portas, e a senha é a porta da frente. | (igual) |
| `f1_07_chave-mestra.mp3` | Chave-Mestra | Ela testa milhões de senhas por segundo. Então: qual vai ser a sua? | (igual) |
| `f2a_01_narrador.mp3` | Narrador | Você digita [Empresa]2026! e confirma. Senha aceita. | Você digita empresa dois mil e vinte e seis, exclamação e confirma. Senha aceita. |
| `f2a_02_narrador.mp3` | Narrador | Do outro lado, a lista da Força Bruta começa pelo mais óbvio. | (igual) |
| `f2a_03_forca-bruta.mp3` | Força Bruta | Nome da empresa, ano, ponto de exclamação. Clássico! Esse padrão está no topo da minha lista. | (igual) |
| `f2a_04_forca-bruta.mp3` | Força Bruta | Achei! Bom dia, sistema novo da [EMPRESA]. | Achei! Bom dia, sistema novo da empresa. |
| `f2a_05_chave-mestra.mp3` | Chave-Mestra | Acontece com muita gente. Parece forte porque tem maiúscula, número e símbolo, mas é o padrão que todo mundo usa. | (igual) |
| `f2a_06_chave-mestra.mp3` | Chave-Mestra | Força bruta não adivinha: testa listas. Vamos voltar a fita e ver o que ela não consegue testar. | (igual) |
| `f2b_01_narrador.mp3` | Narrador | Você repete a senha do seu e-mail pessoal. Fácil de lembrar. | (igual) |
| `f2b_02_narrador.mp3` | Narrador | Só que, no ano passado, um site de streaming onde você usava essa mesma senha foi invadido. | (igual) |
| `f2b_03_forca-bruta.mp3` | Força Bruta | Lista de vazamento, minha leitura favorita. Uma senha, e eu testo em todo lugar. | (igual) |
| `f2b_04_forca-bruta.mp3` | Força Bruta | E-mail pessoal… entrei. Sistema da [EMPRESA]… entrei também! | E-mail pessoal… entrei. Sistema da empresa… entrei também! |
| `f2b_05_chave-mestra.mp3` | Chave-Mestra | Senha repetida vira uma chave-mestra na mão do bandido. E esse nome já tem dono. | (igual) |
| `f2b_06_chave-mestra.mp3` | Chave-Mestra | Um vazamento em qualquer site abre todas as portas onde a senha se repete. Vamos voltar a fita. | (igual) |
| `f2c_01_narrador.mp3` | Narrador | Você cria uma frase só sua, com quatro palavras sem relação entre si. | (igual) |
| `f2c_02_narrador.mp3` | Narrador | A Força Bruta começa a testar. | (igual) |
| `f2c_03_forca-bruta.mp3` | Força Bruta | Quatro palavras?! Sem nome, sem data, sem nada pra eu adivinhar? Isso não vale! | (igual) |
| `f2c_04_chave-mestra.mp3` | Chave-Mestra | Vale sim. Jogada de mestre, recruta. | (igual) |
| `f2c_05_chave-mestra.mp3` | Chave-Mestra | Tamanho vence complicação. Frase longa é fácil pra você lembrar e demorada demais pra ela adivinhar. | (igual) |
| `f2c_06_chave-mestra.mp3` | Chave-Mestra | Agora deixa eu te mostrar as regras da chave. | (igual) |
| `f3_01_chave-mestra.mp3` | Chave-Mestra | Força bruta é isso: um programa testando senhas, uma atrás da outra, até acertar. Ele não cansa. | (igual) |
| `f3_02_chave-mestra.mp3` | Chave-Mestra | Ele começa pelas mais comuns, pelos padrões e pelas senhas que já vazaram. Contra isso, quatro regras. | (igual) |
| `f3_03_chave-mestra.mp3` | Chave-Mestra | Um: tamanho vence complicação. Use uma frase-senha, com quatro palavras ou mais, que só você conheça. | (igual) |
| `f3_04_chave-mestra.mp3` | Chave-Mestra | Nada de nome, data de nascimento, time, nome da empresa ou sequência de teclado. Isso é o começo da lista dela. E não copie os exemplos daqui: crie a sua. | (igual) |
| `f3_05_chave-mestra.mp3` | Chave-Mestra | Dois: uma senha para cada lugar. Se um site vazar, só aquela porta fica aberta. | (igual) |
| `f3_06_chave-mestra.mp3` | Chave-Mestra | Três: use um gerenciador de senhas. Ele cria e guarda senhas fortes por você. Pergunte ao TI qual a [EMPRESA] recomenda. | Três: use um gerenciador de senhas. Ele cria e guarda senhas fortes por você. Pergunte ao TI qual a empresa recomenda. |
| `f3_07_chave-mestra.mp3` | Chave-Mestra | Quatro: ligue a verificação em duas etapas. Mesmo com a senha, ninguém entra sem o segundo passo. | (igual) |
| `f3_08_chave-mestra.mp3` | Chave-Mestra | E a senha é só sua. Ninguém do TI, do banco ou da diretoria vai pedir. Nem o código. Uma chave só não basta. | (igual) |
| `f5_01_narrador.mp3` | Narrador | A Força Bruta, irritada, troca de tática. | (igual) |
| `f5_02_forca-bruta.mp3` | Força Bruta | Senha eu acho num vazamento qualquer. O problema é essa tal de segunda etapa… Então eu insisto. Até alguém cansar. | (igual) |
| `f5_03_narrador.mp3` | Narrador | Onze da noite. Seu celular não para de vibrar. | (igual) |
| `f5_04_narrador.mp3` | Narrador | Pedido de login. E de novo. E de novo. | (igual) |
| `f5_05_chave-mestra.mp3` | Chave-Mestra | Recruta, olha a hora. Você está tentando entrar em algum lugar agora? | (igual) |
| `f6a_01_narrador.mp3` | Narrador | Você toca em Aprovar. O celular, enfim, fica quieto. | (igual) |
| `f6a_02_forca-bruta.mp3` | Força Bruta | Obrigada pela ajuda! Entrei pela porta da frente, com a sua autorização. | (igual) |
| `f6a_03_chave-mestra.mp3` | Chave-Mestra | Pedido que você não fez quer dizer uma coisa: alguém já tem a sua senha. | (igual) |
| `f6a_04_chave-mestra.mp3` | Chave-Mestra | Nunca aprove o que você não pediu. Negue, troque a senha e avise o TI na hora. | (igual) |
| `f6b_01_narrador.mp3` | Narrador | Você toca em Negar, troca a senha e avisa a Central Sentinela. | (igual) |
| `f6b_02_forca-bruta.mp3` | Força Bruta | Negado?! E ainda trocou a senha? Volta tudo pro começo da lista! | (igual) |
| `f6b_03_chave-mestra.mp3` | Chave-Mestra | Isso! A senha caiu, mas a segunda trava segurou a porta. | (igual) |
| `f6b_04_chave-mestra.mp3` | Chave-Mestra | Uma chave só não basta. Por isso a gente usa duas. | (igual) |
| `f7_01_chave-mestra.mp3` | Chave-Mestra | Agora a parte mais importante do treinamento. | (igual) |
| `f7_02_chave-mestra.mp3` | Chave-Mestra | Senhas vazam, até de sites grandes. Muitas vezes nem é culpa sua. | (igual) |
| `f7_03_chave-mestra.mp3` | Chave-Mestra | O que importa é agir rápido quando você desconfia. | (igual) |
| `f7_04_chave-mestra.mp3` | Chave-Mestra | Primeiro: troque a senha na hora, começando pelo e-mail, que recupera todas as outras. | (igual) |
| `f7_05_chave-mestra.mp3` | Chave-Mestra | Segundo: troque em todo lugar onde você usava a mesma senha. | (igual) |
| `f7_06_chave-mestra.mp3` | Chave-Mestra | Terceiro: avise o TI pelo canal oficial. Eles conferem acessos estranhos e bloqueiam a tempo. | (igual) |
| `f7_07_chave-mestra.mp3` | Chave-Mestra | Quarto: ligue a verificação em duas etapas onde ainda não estiver ligada. | (igual) |
| `f7_08_chave-mestra.mp3` | Chave-Mestra | Ninguém vai te culpar por avisar. O estrago vem do silêncio. | (igual) |
| `f8_01_narrador.mp3` | Narrador | Na sala escura, a Força Bruta tenta de novo… | (igual) |
| `f8_02_narrador.mp3` | Narrador | …mas cada porta da [EMPRESA] agora tem frase longa e segunda trava. | …mas cada porta da empresa agora tem frase longa e segunda trava. |
| `f8_03_forca-bruta.mp3` | Força Bruta | Isso não acaba aqui! Um dia alguém vai repetir uma senha… | (igual) |
| `f8_04_chave-mestra.mp3` | Chave-Mestra | E nesse dia você vai lembrar: uma chave só não basta. | (igual) |
| `f8_05_chave-mestra.mp3` | Chave-Mestra | Segunda insígnia conquistada, recruta. O esquadrão está ficando forte. | (igual) |
| `f8_06_narrador.mp3` | Narrador | Enquanto isso, em algum lugar, uma planilha esquecida começa a pingar… | (igual) |
| `f8_07_narrador.mp3` | Narrador | Próxima missão: O Vazamento. | (igual) |
| `f4_01_chave-mestra.mp3` | Chave-Mestra | Repara: as fracas parecem complicadas, mas seguem padrões. As fortes são só longas e imprevisíveis. É isso que trava a Força Bruta. | (igual) |
