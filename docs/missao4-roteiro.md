# Missão 4 · O Camaleão: roteiro

Versão de 19 de outubro de 2026, a partir do rascunho do módulo 4 (`modulo-4-camaleao`, estrutura da bíblia). Ainda fora do player. Segue o esqueleto das Missões 1 e 2: abertura, decisão ramificada, lição, desafio, virada com decisão rápida, "e se eu cair?", desfecho e quiz. Duração de cerca de 7 minutos. Trechos com prefixo `c` (`c1` a `c8`, `cd1`, `cd2`, `cquiz`, `cfim`), para o futuro `src/js/missao4.js`.

**CENA** descreve o que se vê; **PLAYER** descreve o que a camada interativa faz. **[EMPRESA]** e **[CANAL]** são preenchidos pelo player (nome do cliente e canal oficial do TI, do `CONFIG`); no áudio, as vozes dizem só "empresa" e "suporte".

## Personagens

| Personagem | Papel | Personalidade | Visual (referência) |
| --- | --- | --- | --- |
| Eco | Herói da missão: engenharia social | Empático, ouve mais do que fala; gentil e firme. Bordão: "Pressa e segredo? Hora de checar." | Fones com ondas visíveis, capa que muda de cor com as emoções |
| Contraprova | Parceiro do Eco: confirma por outro canal | Calmo e metódico; fala quando o assunto é confirmar por outro canal (4 falas) e atua em cena ao lado do Eco (liga de volta, aponta o telão, dispara o raio no Camaleão) | Barba, óculos redondos, traje lilás com capa, seta circular no peito. Folhas em `referencias/personagens/contraprova_*` |
| O Camaleão | Vilão: falso suporte, falso diretor, carona na porta | Charmoso, convincente, ofendido quando é descoberto | Terno verde-oliva, gravata-borboleta, pele verde, língua enrolada, cauda em espiral, maleta de disfarces; pele que imita o crachá de quem finge ser. Folha: `referencias/viloes/camaleao_folha_modelo_v1.jpg`. Poses: em pé e `derrotado` |
| Narrador | Abre e fecha os trechos | Grave e suave | |


## O que a missão ensina

1. **Engenharia social:** enganar pessoas em vez de máquinas. Em vez de arrombar a porta, o golpista convence alguém a abrir.
2. **Os 5 sinais do Camaleão:** urgência, segredo, autoridade, pedido fora do normal (código, senha, transferência, cartão-presente, troca de conta bancária) e canal inesperado.
3. **Confirmar por outro canal:** desligar e ligar de volta pelo número oficial, ou falar pessoalmente. Perguntar ao próprio golpista não prova nada, e até voz pode ser imitada.
4. **Código de verificação é a chave da conta:** ninguém do TI pede. Quem pede é quem quer entrar.
5. **Sem carona na porta:** quem tem crachá passa o próprio; quem não tem se identifica na recepção. Gentil e firme.
6. **Se cair:** avise o TI e a segurança na hora, troque a senha, avise o financeiro e o banco se envolveu dinheiro, anote tudo. Ninguém julga quem avisa.

## Abertura (tela inicial)

**CENA:** Telhado, à noite. O Eco no meio-direita, um pouco menor que o normal.

**PLAYER:** cartão de abertura da missão, com o tema "ENGENHARIA SOCIAL": "Recruta da [EMPRESA], o **Camaleão** não invade sistemas: ele convence pessoas. Muda de pele, de voz e de crachá. Em cerca de 7 minutos você vai aprender a ouvir o que está por trás da conversa, e no final há um quiz de 5 perguntas."

## Trecho 1 · Abertura (`c1`)

**CENA:** Escritório, sexta-feira, fim de expediente; o colaborador fechando o notebook. O telefone toca: tela de chamada "Suporte TI · [EMPRESA] · (11) 3090-4040". O Camaleão entra pela esquerda. Chega o SMS da [EMPRESA]: "Seu código de verificação é 482 913. Não compartilhe este código com ninguém." (17:51). O Eco entra pela direita.

**NARRADOR:** Sexta-feira, 17h50. Você está fechando o notebook.

**NARRADOR:** O telefone toca. O identificador diz: Suporte TI.

**CAMALEÃO:** Oi, aqui é o Lucas, do suporte de TI. Tudo bem? Detectamos um acesso estranho na sua conta.

**CAMALEÃO:** Te mandei um código por SMS pra confirmar que é você. É só me ler os números, rapidinho, antes que bloqueiem tudo.

**ECO:** Ei. Escuta só o que ele está pedindo.

**ECO:** Sou o Eco, do Esquadrão Sentinela. A Íris falou bem de você.

**ECO:** Eu ouço mais do que falo… e essa ligação tem um barulho estranho.

## Decisão 1 (`cd1`)

**PLAYER:** "O que você faz?", com a chamada e o SMS ao lado das opções.

| Botão | Vai para | XP | Observação |
| --- | --- | --- | --- |
| A) Ler o código, ele é do suporte | 2A | 10 | |
| B) Fazer perguntas pra ver se ele é mesmo do TI | 2B | 20 | |
| C) Desligar e ligar para a [CANAL] pelo número oficial | 2C | 100 | Selo e conquista "Outro Canal" |

## Trecho 2A · Disfarce perfeito (`c2a`)

**CENA:** O Camaleão no centro, sem SMS na tela. Depois, o Eco à direita e o SMS de volta, sem som, com "**Não compartilhe este código com ninguém.**" destacado. No fim, efeito de rebobinar.

**NARRADOR:** Você lê os seis números. Do outro lado, um silêncio rápido.

**CAMALEÃO:** Perfeito, obrigado! Já resolvi tudo por aqui.

**CAMALEÃO:** Agora eu sou você no sistema. Que crachá bonito!

**ECO:** O código dizia: não compartilhe com ninguém. Nem com o suporte.

**ECO:** Esse código é a chave da sua conta. Quem pede é quem quer entrar. Vamos voltar.

**PLAYER:** efeito de rebobinar.

## Trecho 2B · Resposta pra tudo (`c2b`)

**CENA:** O Camaleão no centro, sem tela. Depois, o Eco entra pela direita.

**NARRADOR:** Você pergunta o nome completo, o setor, o nome do seu gestor.

**CAMALEÃO:** Lucas Moreira, Infraestrutura. Seu gestor é o Paulo, né? E você está no projeto novo… vi no seu perfil. Digo, no sistema.

**ECO:** Viu? Ele tem resposta pra tudo. Muita coisa sobre você está nas redes sociais, e ele estudou antes de ligar.

**CONTRAPROVA:** Perguntar pra ele não prova nada. Quem confere é você, por um canal que você escolhe.

## Trecho 2C · Outro canal (`c2c`)

**CENA:** Central Sentinela, sem personagens; alerta verde "Ligação falsa reportada · Ninguém do TI ligou para você. Código não compartilhado." Volta ao escritório: o Camaleão derrotado à esquerda; depois, o Eco à direita.

**NARRADOR:** Você desliga e liga para a [CANAL] pelo número oficial. Ninguém do TI tinha ligado.

**CAMALEÃO:** Desligou na minha cara? Que falta de educação!

**ECO:** Educação é com quem é de verdade. Você checou pelo caminho certo.

**CONTRAPROVA:** Desligar e ligar de volta pelo número oficial vale ouro.

**PLAYER:** selo "Outro Canal".

## Trecho 3 · A lição do Eco (`c3`)

**CENA:** Central Sentinela. O Eco à esquerda; o telão "Lição do Eco · Os 5 sinais do Camaleão", cada sinal revelado junto com a fala:

1. **Urgência**: "antes que bloqueiem tudo", "preciso agora".
2. **Segredo**: "não comenta com ninguém", "é confidencial".
3. **Autoridade**: diretor, TI, banco, polícia. O cargo vira pressão.
4. **Pedido fora do normal**: código, senha, transferência, cartão-presente, troca de conta bancária.
5. **Canal inesperado**: número novo, ligação do nada, e-mail pessoal.

**ECO:** Engenharia social é enganar pessoas em vez de máquinas. Em vez de arrombar a porta, o golpista convence alguém a abrir.

**ECO:** O Camaleão muda de pele: suporte, diretor, fornecedor, entregador. Mas o roteiro dele é sempre o mesmo.

**ECO:** Um: urgência. Pressa é pra você não pensar.

**ECO:** Dois: segredo. Se ninguém pode saber, ninguém pode te alertar.

**ECO:** Três: autoridade. Um cargo importante faz a gente obedecer sem checar.

**ECO:** Quatro: pedido fora do normal. Código, senha, dinheiro, cartão-presente.

**ECO:** Cinco: canal inesperado. Número novo, ligação do nada.

**ECO:** Pressa e segredo? Hora de checar. Por outro canal, um que você escolhe, não o que ele oferece.

## Trecho 4 · Ouvindo os sinais (`c4`)

**PLAYER:** desafio de pistas, como o do e-mail na Missão 1: "Clique nos 4 sinais de golpe nesta conversa." Conversa de WhatsApp de "+55 11 97733-1029", com a foto de perfil "Carlos Mendes, Diretor". Cada sinal achado: som e +25 XP, com a explicação. Os 4 achados sem clicar fora: +50 XP e a conquista "Ouvido Fino".

| Hora | Mensagem (o trecho clicável em destaque) |
| --- | --- |
| 14:02 | Oi, aqui é o Carlos, diretor. **Troquei de número**, salva aí. |
| 14:02 | **Preciso de um favor urgente, estou entrando numa reunião**. |
| 14:03 | Compra **5 cartões-presente de R$ 200** pra um cliente e me manda os códigos por aqui. |
| 14:03 | **Não comenta com ninguém**, é surpresa. Te reembolso amanhã. |

| Sinal | Explicação |
| --- | --- |
| Número novo | Contato conhecido em número novo: confirme pelo número antigo ou pessoalmente. |
| Urgência | Reunião, pressa, agora: tempo curto pra você não pensar. |
| Pedido fora do normal | Cartão-presente é o pagamento favorito de golpista: some sem deixar rastro. |
| Segredo | "Não comenta" serve pra ninguém te alertar. |

Ao concluir (o Eco entra pela direita):

**ECO:** Quatro sinais numa mensagem só. Diretor de verdade não pede cartão-presente por WhatsApp. Na dúvida, liga no número que você já tinha.

## Trecho 5 · O Camaleão muda de tática (`c5`)

**CENA:** Corredor do andar, segunda de manhã; porta com leitor de crachá. O Camaleão no centro, com as mãos ocupadas. Depois, o Eco à direita.

**NARRADOR:** Segunda de manhã. Você passa o crachá na porta do andar.

**CAMALEÃO:** Ô, segura a porta pra mim? Tô com as mãos ocupadas, esqueci o crachá lá embaixo…

**ECO:** Gentileza é bom. Mas essa porta tem leitor de crachá por um motivo.

## Decisão 2 · rápida (`cd2`)

**PLAYER:** "Decida rápido: o que você faz?" Cronômetro de 10 segundos; se o tempo acabar, vale a opção A (a porta ficou aberta enquanto você hesitava) e segue para 6A.

| Botão | Vai para | XP | Observação |
| --- | --- | --- | --- |
| A) Segurar a porta, é só gentileza | 6A | 10 | Também é o caminho quando o tempo acaba |
| B) Com educação, indicar a recepção para ele se identificar | 6B | 100 | Selo e conquista "Porta Certa"; em menos de 5 s, +40 XP e "Reflexo do Eco" |

## Trecho 6A · Carona (`c6a`)

**CENA:** O Camaleão passa pela porta e some no corredor, entre mesas, papéis e telas abertas. Depois, o Eco à direita.

**NARRADOR:** Ele entra, agradece… e some no corredor, perto das mesas, dos papéis e das telas abertas.

**CAMALEÃO:** Obrigado! Adoro gente prestativa.

**ECO:** Entrar de carona também é engenharia social. Quem tem crachá passa o próprio; quem não tem, vai pra recepção.

## Trecho 6B · Porta certa (`c6b`)

**CENA:** O Camaleão derrotado no centro e o Eco à direita.

**NARRADOR:** Você sorri e aponta: "A recepção libera rapidinho." Ele desiste e vai embora.

**CAMALEÃO:** Hmpf. Gente educada e desconfiada… a pior combinação.

**ECO:** Gentil e firme. É isso.

**PLAYER:** selo "Porta Certa".

## Trecho 7 · E se eu cair? (`c7`)

**CENA:** Central Sentinela. O Eco à esquerda; o telão "Caí na conversa. E agora?", cada passo revelado junto com a fala:

1. Avise o TI e a segurança imediatamente, pelo canal oficial.
2. Passou senha ou código? Troque a senha agora.
3. Envolveu dinheiro? Avise o financeiro e o banco na hora.
4. Anote tudo: número, nome usado, horário e o que foi pedido.

**ECO:** Golpe de conversa pega gente esperta, porque usa uma coisa boa: a vontade de ajudar.

**CONTRAPROVA:** Primeiro: avise o TI e a segurança. Na hora.

**ECO:** Segundo: se passou senha ou código, troque a senha agora.

**ECO:** Terceiro: se envolveu dinheiro, avise o financeiro e o banco. Minutos fazem diferença pra bloquear.

**CONTRAPROVA:** Quarto: anote tudo. Número, nome que ele usou, horário, o que pediu. Isso ajuda a proteger os colegas.

**PLAYER:** caixa com o canal de reporte do cliente (configuração white label).

**ECO:** Ninguém vai te julgar. O golpista conta com a vergonha pra ganhar tempo.

## Trecho 8 · Desfecho (`c8`)

**CENA:** Corredor: o Camaleão no centro tenta mais um disfarce; fica derrotado, com tremor de câmera. Depois, derrotado à esquerda e o Eco à direita. Central: o Eco à esquerda e a Insígnia do Eco (ícone de ondas) girando. Telhado: o esquadrão reunido, um pouco menor que o normal, da esquerda para a direita: Trava, Íris, Lupa de frente e Eco.

**NARRADOR:** O Camaleão tenta mais um disfarce… mas ninguém mais aceita sem checar.

**CAMALEÃO:** Sem pressa? Sem segredo? Assim eu fico sem cor!

**ECO:** Pressa e segredo? Hora de checar.

**ECO:** Quarta insígnia, recruta. Junte as quatro e você é um Sentinela completo.

**PLAYER:** fanfarra da Insígnia do Eco.

**NARRADOR:** O Esquadrão está reunido. E agora você faz parte dele.

**PLAYER:** a cena esvazia e abre o quiz. É a última missão: não há "próxima missão".

## Resultado

**PLAYER:** acertos, estrelas, a Insígnia do Eco (com 4 ou 5 acertos), as conquistas, o tempo e as escolhas feitas. Com menos de 4 acertos, oferece refazer o quiz. Nota (0 a 100), status e tempo vão para o LMS.

## Quiz final

Cinco perguntas; aprovação com 4 acertos. A resposta certa está em negrito.

1. **Alguém liga dizendo ser do TI e pede o código que chegou no seu celular. O que fazer?**
    - a) Passar, é do TI
    - **b) Não passar; desligar e ligar para o número oficial do TI**
    - c) Passar só metade do código
    - *Eco:* Código de verificação é a chave da sua conta. O TI de verdade nunca pede.
2. **O "diretor", de um número novo, pede cartões-presente com urgência e segredo. Quais são os sinais de golpe?**
    - a) Só o número novo
    - **b) Número novo, urgência, segredo e pedido fora do normal**
    - c) Nenhum, diretor pode pedir isso
    - *Eco:* Quando os sinais se somam, não é coincidência: é roteiro de golpe.
3. **O que significa confirmar "por outro canal"?**
    - a) Responder a mesma mensagem perguntando se é verdade
    - **b) Falar com a pessoa por um meio que você já conhece, como o número oficial ou pessoalmente**
    - c) Pedir para a pessoa mandar um áudio
    - *Eco:* No canal dele, o golpista confirma qualquer coisa. E até voz pode ser imitada.
4. **Uma pessoa sem crachá pede para entrar junto com você. O que fazer?**
    - a) Segurar a porta, por gentileza
    - **b) Com educação, indicar a recepção**
    - c) Emprestar seu crachá
    - *Eco:* Gentil e firme: quem não tem crachá se identifica na recepção.
5. **Você passou sua senha numa ligação e depois desconfiou. E agora?**
    - a) Ficar quieto para não se complicar
    - **b) Avisar o TI imediatamente e trocar a senha**
    - c) Esperar para ver se algo acontece
    - *Eco:* O golpista conta com a vergonha. Avisar rápido corta o golpe pela raiz.

## Gamificação

| Ação | XP | Conquista |
| --- | --- | --- |
| Decisão 1 | 10 / 20 / 100 | Outro Canal (desligou e ligou pelo número oficial) |
| Desafio | 25 por sinal, +50 com os 4 sem clicar fora | Ouvido Fino (os 4 sem erro) |
| Decisão 2 | 10 / 100, +40 se escolher a recepção em menos de 5 s | Porta Certa; Reflexo do Eco |
| Quiz | 40 por acerto, +20 por acerto a partir do 3º seguido | Gabarito do Eco (5 de 5) |
| Aprovação (4 acertos) | 150 | Insígnia do Eco |

O rascunho não define XP: os valores seguem as Missões 1 e 2. As chaves de XP da Missão 4 levam o número da missão, como as da Missão 2.

## Produção: o que falta

| Peça | Situação |
| --- | --- |
| Roteiro, desafio e quiz | Prontos (este arquivo) |
| Player (`src/missao4.html`, `src/js/missao4.js`, `src/css/missao4.css`) | Pronto (20/out/2026): trechos `c1` a `c8`, decisões, desafio de sinais na conversa, quiz e fecho. Página de desenvolvimento: http://localhost:5173/src/missao4.html |
| Eco | Pronto: folha de modelo, poses e 4 rostos (`assets/img/eco_*`). Faltam as bocas para a fala |
| Contraprova | Pronto: folha de modelo, 8 poses, 8 rostos e 3 bocas (`assets/img/contraprova_*`) |
| Camaleão | Pronto: 8 poses, 8 rostos e 2 bocas (`assets/img/camaleao_*`) |
| Cenários | Prontos: escritório no fim da tarde e corredor com porta de crachá (`bg_*_m4.jpg`). Reaproveitados: Central da Missão 2 (o nicho tem cadeado e chave) e o salão da Central de Missões no fecho |
| Telas no player | Chamada telefônica com identificador, SMS com código, conversa de WhatsApp clicável, alerta verde, telão dos 5 sinais e dos 4 passos |
| Canal de reporte | Vem do CONFIG do cliente; o texto de exemplo fala em "phishing" |

### Vozes

| Personagem | Falas | Direção |
| --- | --- | --- |
| Eco | 25 | Masculina, calma e empática, ouve antes de falar; firme no trecho 7. Voz no ElevenLabs: **Dani Varejo** |
| Contraprova | 4 | Masculina adulta, calma e metódica; firme nos passos do trecho 7. Voz no ElevenLabs: **Dany Varejo** (a mesma do Eco) |
| O Camaleão | 10 | Masculina charmosa e simpática ao telefone; ofendida quando é descoberta. Voz no ElevenLabs: **Lax Whisper** |
| Narrador | 10 | A mesma voz das Missões 0, 1 e 2 (Will – Deep, Smooth and Affectionate) |

Dica de pronúncia: no texto da voz, escreva números e horários por extenso ("cinco e cinquenta da tarde"). A legenda continua mostrando os números.

### Arquivos de áudio (`assets/audio/`)

Nome: `<trecho>_<nn>_<voz>.mp3`, numerando só as falas com voz de cada trecho (as linhas **PLAYER** não contam). A fala final do desafio é `c4_01_eco.mp3`.

| Arquivo | Voz | Legenda | Texto para a voz |
| --- | --- | --- | --- |
| `c1_01_narrador.mp3` | Narrador | Sexta-feira, 17h50. Você está fechando o notebook. | Sexta-feira, cinco e cinquenta da tarde. Você está fechando o notebook. |
| `c1_02_narrador.mp3` | Narrador | O telefone toca. O identificador diz: Suporte TI. | (igual) |
| `c1_03_camaleao.mp3` | Camaleão | Oi, aqui é o Lucas, do suporte de TI. Tudo bem? Detectamos um acesso estranho na sua conta. | (igual) |
| `c1_04_camaleao.mp3` | Camaleão | Te mandei um código por SMS pra confirmar que é você. É só me ler os números, rapidinho, antes que bloqueiem tudo. | (igual) |
| `c1_05_eco.mp3` | Eco | Ei. Escuta só o que ele está pedindo. | (igual) |
| `c1_06_eco.mp3` | Eco | Sou o Eco, do Esquadrão Sentinela. A Íris falou bem de você. | (igual) |
| `c1_07_eco.mp3` | Eco | Eu ouço mais do que falo… e essa ligação tem um barulho estranho. | (igual) |
| `c2a_01_narrador.mp3` | Narrador | Você lê os seis números. Do outro lado, um silêncio rápido. | (igual) |
| `c2a_02_camaleao.mp3` | Camaleão | Perfeito, obrigado! Já resolvi tudo por aqui. | (igual) |
| `c2a_03_camaleao.mp3` | Camaleão | Agora eu sou você no sistema. Que crachá bonito! | (igual) |
| `c2a_04_eco.mp3` | Eco | O código dizia: não compartilhe com ninguém. Nem com o suporte. | (igual) |
| `c2a_05_eco.mp3` | Eco | Esse código é a chave da sua conta. Quem pede é quem quer entrar. Vamos voltar. | (igual) |
| `c2b_01_narrador.mp3` | Narrador | Você pergunta o nome completo, o setor, o nome do seu gestor. | (igual) |
| `c2b_02_camaleao.mp3` | Camaleão | Lucas Moreira, Infraestrutura. Seu gestor é o Paulo, né? E você está no projeto novo… vi no seu perfil. Digo, no sistema. | (igual) |
| `c2b_03_eco.mp3` | Eco | Viu? Ele tem resposta pra tudo. Muita coisa sobre você está nas redes sociais, e ele estudou antes de ligar. | (igual) |
| `c2b_04_contraprova.mp3` | Contraprova | Perguntar pra ele não prova nada. Quem confere é você, por um canal que você escolhe. | (igual) |
| `c2c_01_narrador.mp3` | Narrador | Você desliga e liga para a [CANAL] pelo número oficial. Ninguém do TI tinha ligado. | Você desliga e liga para o suporte pelo número oficial. Ninguém do TI tinha ligado. |
| `c2c_02_camaleao.mp3` | Camaleão | Desligou na minha cara? Que falta de educação! | (igual) |
| `c2c_03_eco.mp3` | Eco | Educação é com quem é de verdade. Você checou pelo caminho certo. | (igual) |
| `c2c_04_contraprova.mp3` | Contraprova | Desligar e ligar de volta pelo número oficial vale ouro. | (igual) |
| `c3_01_eco.mp3` | Eco | Engenharia social é enganar pessoas em vez de máquinas. Em vez de arrombar a porta, o golpista convence alguém a abrir. | (igual) |
| `c3_02_eco.mp3` | Eco | O Camaleão muda de pele: suporte, diretor, fornecedor, entregador. Mas o roteiro dele é sempre o mesmo. | (igual) |
| `c3_03_eco.mp3` | Eco | Um: urgência. Pressa é pra você não pensar. | (igual) |
| `c3_04_eco.mp3` | Eco | Dois: segredo. Se ninguém pode saber, ninguém pode te alertar. | (igual) |
| `c3_05_eco.mp3` | Eco | Três: autoridade. Um cargo importante faz a gente obedecer sem checar. | (igual) |
| `c3_06_eco.mp3` | Eco | Quatro: pedido fora do normal. Código, senha, dinheiro, cartão-presente. | (igual) |
| `c3_07_eco.mp3` | Eco | Cinco: canal inesperado. Número novo, ligação do nada. | (igual) |
| `c3_08_eco.mp3` | Eco | Pressa e segredo? Hora de checar. Por outro canal, um que você escolhe, não o que ele oferece. | (igual) |
| `c4_01_eco.mp3` | Eco | Quatro sinais numa mensagem só. Diretor de verdade não pede cartão-presente por WhatsApp. Na dúvida, liga no número que você já tinha. | (igual) |
| `c5_01_narrador.mp3` | Narrador | Segunda de manhã. Você passa o crachá na porta do andar. | (igual) |
| `c5_02_camaleao.mp3` | Camaleão | Ô, segura a porta pra mim? Tô com as mãos ocupadas, esqueci o crachá lá embaixo… | (igual) |
| `c5_03_eco.mp3` | Eco | Gentileza é bom. Mas essa porta tem leitor de crachá por um motivo. | (igual) |
| `c6a_01_narrador.mp3` | Narrador | Ele entra, agradece… e some no corredor, perto das mesas, dos papéis e das telas abertas. | (igual) |
| `c6a_02_camaleao.mp3` | Camaleão | Obrigado! Adoro gente prestativa. | (igual) |
| `c6a_03_eco.mp3` | Eco | Entrar de carona também é engenharia social. Quem tem crachá passa o próprio; quem não tem, vai pra recepção. | (igual) |
| `c6b_01_narrador.mp3` | Narrador | Você sorri e aponta: "A recepção libera rapidinho." Ele desiste e vai embora. | (igual) |
| `c6b_02_camaleao.mp3` | Camaleão | Hmpf. Gente educada e desconfiada… a pior combinação. | (igual) |
| `c6b_03_eco.mp3` | Eco | Gentil e firme. É isso. | (igual) |
| `c7_01_eco.mp3` | Eco | Golpe de conversa pega gente esperta, porque usa uma coisa boa: a vontade de ajudar. | (igual) |
| `c7_02_contraprova.mp3` | Contraprova | Primeiro: avise o TI e a segurança. Na hora. | (igual) |
| `c7_03_eco.mp3` | Eco | Segundo: se passou senha ou código, troque a senha agora. | (igual) |
| `c7_04_eco.mp3` | Eco | Terceiro: se envolveu dinheiro, avise o financeiro e o banco. Minutos fazem diferença pra bloquear. | (igual) |
| `c7_05_contraprova.mp3` | Contraprova | Quarto: anote tudo. Número, nome que ele usou, horário, o que pediu. Isso ajuda a proteger os colegas. | (igual) |
| `c7_06_eco.mp3` | Eco | Ninguém vai te julgar. O golpista conta com a vergonha pra ganhar tempo. | (igual) |
| `c8_01_narrador.mp3` | Narrador | O Camaleão tenta mais um disfarce… mas ninguém mais aceita sem checar. | (igual) |
| `c8_02_camaleao.mp3` | Camaleão | Sem pressa? Sem segredo? Assim eu fico sem cor! | (igual) |
| `c8_03_eco.mp3` | Eco | Pressa e segredo? Hora de checar. | (igual) |
| `c8_04_eco.mp3` | Eco | Quarta insígnia, recruta. Junte as quatro e você é um Sentinela completo. | (igual) |
| `c8_05_narrador.mp3` | Narrador | O Esquadrão está reunido. E agora você faz parte dele. | (igual) |
