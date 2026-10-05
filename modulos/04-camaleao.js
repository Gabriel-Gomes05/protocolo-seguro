/* Módulo 4 — O Camaleão (Eco × Camaleão): engenharia social.
   Rascunho de roteiro na estrutura padrão da bíblia. */
(() => {
  Sentinela.modulo({
    id: 'camaleao', numero: 4, titulo: 'O Camaleão', tema: 'ENGENHARIA SOCIAL',
    heroi: 'eco', vilao: 'camaleao',
    insignia: { nome: 'Insígnia do Eco', icone: 'ondas' },
    proximo: null,

    abertura: {
      cena: 'telhado',
      atores: [{ id: 'eco', lado: 'meio-direita', escala: .9 }],
      texto: 'Recruta da [EMPRESA], o **Camaleão** não invade sistemas: ele convence pessoas. Muda de pele, de voz e de crachá. Em cerca de 7 minutos você vai aprender a ouvir o que está por trás da conversa, e no final há um quiz de 5 perguntas.'
    },

    roteiro: [
      // ---------- Trecho 1 · Abertura ----------
      { trecho: 'Trecho 1 · Abertura', cena: 'escritorio', atores: [], tela: null },
      ['narrador', 'Sexta-feira, 17h50. Você está fechando o notebook.', { voz: 'Sexta-feira, cinco e cinquenta da tarde. Você está fechando o notebook.' }],
      { tela: { tipo: 'chamada', nome: 'Suporte TI · [EMPRESA]', numero: '(11) 3090-4040' } },
      ['narrador', 'O telefone toca. O identificador diz: Suporte TI.'],
      { atores: [{ id: 'camaleao', lado: 'esquerda' }] },
      ['camaleao', 'Oi, aqui é o Rafael, do suporte de TI. Tudo bem? Detectamos um acesso estranho na sua conta.'],
      { tela: { tipo: 'chat', app: 'sms', titulo: '[EMPRESA]', sub: 'SMS', msgs: [{ texto: 'Seu código de verificação é 482 913. Não compartilhe este código com ninguém.', hora: '17:51' }] } },
      ['camaleao', 'Te mandei um código por SMS pra confirmar que é você. É só me ler os números, rapidinho, antes que bloqueiem tudo.'],
      { atores: [{ id: 'camaleao', lado: 'esquerda' }, { id: 'eco', lado: 'direita' }] },
      ['eco', 'Ei. Escuta só o que ele está pedindo.'],
      ['eco', 'Sou o Eco, do Esquadrão Sentinela. Eu ouço mais do que falo… e essa ligação tem um barulho estranho.'],

      // ---------- Decisão 1 ----------
      {
        decisao: {
          pergunta: 'O que você faz?',
          opcoes: [
            {
              texto: 'Ler o código, ele é do suporte',
              passos: [
                { trecho: 'Trecho 2A · Disfarce perfeito', atores: [{ id: 'camaleao', lado: 'centro' }], tela: null },
                ['narrador', 'Você lê os seis números. Do outro lado, um silêncio rápido.'],
                ['camaleao', 'Perfeito, obrigado! Já resolvi tudo por aqui.'],
                ['camaleao', 'Agora eu sou você no sistema. Que crachá bonito!'],
                { atores: [{ id: 'eco', lado: 'direita' }], tela: { tipo: 'chat', app: 'sms', titulo: '[EMPRESA]', sub: 'SMS', som: false, msgs: [{ texto: 'Seu código de verificação é 482 913. **Não compartilhe este código com ninguém.**', hora: '17:51' }] } },
                ['eco', 'O código dizia: não compartilhe com ninguém. Nem com o suporte.'],
                ['eco', 'Esse código é a chave da sua conta. Quem pede é quem quer entrar. Vamos voltar.'],
                { tela: null, efeito: 'rebobinar' }
              ]
            },
            {
              texto: 'Fazer perguntas pra ver se ele é mesmo do TI',
              passos: [
                { trecho: 'Trecho 2B · Resposta pra tudo', atores: [{ id: 'camaleao', lado: 'centro' }], tela: null },
                ['narrador', 'Você pergunta o nome completo, o setor, o nome do seu gestor.'],
                ['camaleao', 'Rafael Moreira, Infraestrutura. Seu gestor é o Paulo, né? E você está no projeto novo… vi no seu perfil. Digo, no sistema.'],
                { atores: [{ id: 'eco', lado: 'direita' }] },
                ['eco', 'Viu? Ele tem resposta pra tudo. Muita coisa sobre você está nas redes sociais, e ele estudou antes de ligar.'],
                ['eco', 'Perguntar pra ele não prova nada. Quem confere é você, por um canal que você escolhe.']
              ]
            },
            {
              texto: 'Desligar e ligar para a Central Sentinela pelo número oficial', boa: true,
              passos: [
                { trecho: 'Trecho 2C · Outro canal', cena: 'central', atores: [], tela: { tipo: 'alerta', cor: 'verde', titulo: 'Ligação falsa reportada', texto: 'Ninguém do TI ligou para você. Código não compartilhado.' } },
                ['narrador', 'Você desliga e liga para a Central Sentinela pelo número oficial. Ninguém do TI tinha ligado.'],
                { cena: 'escritorio', tela: null, atores: [{ id: 'camaleao', pose: 'derrotado', lado: 'esquerda' }] },
                ['camaleao', 'Desligou na minha cara? Que falta de educação!'],
                { atores: [{ id: 'camaleao', pose: 'derrotado', lado: 'esquerda' }, { id: 'eco', lado: 'direita' }] },
                ['eco', 'Educação é com quem é de verdade. Você checou pelo caminho certo.'],
                ['eco', 'Desligar e ligar de volta pelo número oficial vale ouro.'],
                { selo: 'Outro Canal' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 3 · A lição do Eco ----------
      {
        trecho: 'Trecho 3 · A lição do Eco', cena: 'central', atores: [{ id: 'eco', lado: 'esquerda' }], tela: { tipo: 'telao', rotulo: 'Lição do Eco', titulo: 'Os 5 sinais do Camaleão', itens: [
          '**Urgência**: “antes que bloqueiem tudo”, “preciso agora”.',
          '**Segredo**: “não comenta com ninguém”, “é confidencial”.',
          '**Autoridade**: diretor, TI, banco, polícia. O cargo vira pressão.',
          '**Pedido fora do normal**: código, senha, transferência, cartão-presente, troca de conta bancária.',
          '**Canal inesperado**: número novo, ligação do nada, e-mail pessoal.'
        ] }
      },
      ['eco', 'Engenharia social é enganar pessoas em vez de máquinas. Em vez de arrombar a porta, o golpista convence alguém a abrir.'],
      ['eco', 'O Camaleão muda de pele: suporte, diretor, fornecedor, entregador. Mas o roteiro dele é sempre o mesmo.'],
      { revelar: 1 },
      ['eco', 'Um: urgência. Pressa é pra você não pensar.'],
      { revelar: 2 },
      ['eco', 'Dois: segredo. Se ninguém pode saber, ninguém pode te alertar.'],
      { revelar: 3 },
      ['eco', 'Três: autoridade. Um cargo importante faz a gente obedecer sem checar.'],
      { revelar: 4 },
      ['eco', 'Quatro: pedido fora do normal. Código, senha, dinheiro, cartão-presente.'],
      { revelar: 5 },
      ['eco', 'Cinco: canal inesperado. Número novo, ligação do nada.'],
      ['eco', 'Pressa e segredo? Hora de checar. Por outro canal, um que você escolhe, não o que ele oferece.'],

      // ---------- Trecho 4 · Desafio ----------
      { trecho: 'Trecho 4 · Ouvindo os sinais', tela: null, atores: [] },
      {
        desafio: {
          tipo: 'pistas', titulo: 'Ouvindo os sinais',
          instrucao: 'Clique nos 4 sinais de golpe nesta conversa.',
          mensagem: {
            tipo: 'chat', titulo: '+55 11 97733-1029', sub: 'foto de perfil: Carlos Mendes, Diretor', som: false,
            msgs: [
              { texto: 'Oi, aqui é o Carlos, diretor. {{Troquei de número|canal}}, salva aí.', hora: '14:02' },
              { texto: '{{Preciso de um favor urgente, estou entrando numa reunião|urgencia}}.', hora: '14:02' },
              { texto: 'Compra {{5 cartões-presente de R$ 200|pedido}} pra um cliente e me manda os códigos por aqui.', hora: '14:03' },
              { texto: '{{Não comenta com ninguém|segredo}}, é surpresa. Te reembolso amanhã.', hora: '14:03' }
            ]
          },
          sinais: {
            canal: { nome: 'Número novo', explica: 'Contato conhecido em número novo: confirme pelo número antigo ou pessoalmente.' },
            urgencia: { nome: 'Urgência', explica: 'Reunião, pressa, agora: tempo curto pra você não pensar.' },
            pedido: { nome: 'Pedido fora do normal', explica: 'Cartão-presente é o pagamento favorito de golpista: some sem deixar rastro.' },
            segredo: { nome: 'Segredo', explica: '“Não comenta” serve pra ninguém te alertar.' }
          }
        }
      },
      { atores: [{ id: 'eco', lado: 'direita' }] },
      ['eco', 'Quatro sinais numa mensagem só. Diretor de verdade não pede cartão-presente por WhatsApp. Na dúvida, liga no número que você já tinha.'],

      // ---------- Trecho 5 · O Camaleão muda de tática ----------
      { trecho: 'Trecho 5 · O Camaleão muda de tática', cena: 'corredor', atores: [{ id: 'camaleao', lado: 'centro' }] },
      ['narrador', 'Segunda de manhã. Você passa o crachá na porta do andar.'],
      ['camaleao', 'Ô, segura a porta pra mim? Tô com as mãos ocupadas, esqueci o crachá lá embaixo…'],
      { atores: [{ id: 'camaleao', lado: 'centro' }, { id: 'eco', lado: 'direita' }] },
      ['eco', 'Gentileza é bom. Mas essa porta tem leitor de crachá por um motivo.'],

      // ---------- Decisão 2 (rápida) ----------
      {
        decisao: {
          pergunta: 'Decida rápido: o que você faz?', tempo: 10, padrao: 1,
          opcoes: [
            {
              texto: 'Segurar a porta, é só gentileza',
              passos: [
                { trecho: 'Trecho 6A · Carona', atores: [{ id: 'camaleao', lado: 'centro' }] },
                ['narrador', 'Ele entra, agradece… e some no corredor, perto das mesas, dos papéis e das telas abertas.'],
                ['camaleao', 'Obrigado! Adoro gente prestativa.'],
                { atores: [{ id: 'eco', lado: 'direita' }] },
                ['eco', 'Entrar de carona também é engenharia social. Quem tem crachá passa o próprio; quem não tem, vai pra recepção.']
              ]
            },
            {
              texto: 'Com educação, indicar a recepção para ele se identificar', boa: true,
              passos: [
                { trecho: 'Trecho 6B · Porta certa', atores: [{ id: 'camaleao', pose: 'derrotado', lado: 'centro' }, { id: 'eco', lado: 'direita' }] },
                ['narrador', 'Você sorri e aponta: “A recepção libera rapidinho.” Ele desiste e vai embora.'],
                ['camaleao', 'Hmpf. Gente educada e desconfiada… a pior combinação.'],
                ['eco', 'Gentil e firme. É isso.'],
                { selo: 'Porta Certa' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 7 · E se eu cair? ----------
      {
        trecho: 'Trecho 7 · E se eu cair?', cena: 'central', atores: [{ id: 'eco', lado: 'esquerda' }],
        tela: { tipo: 'telao', titulo: 'Caí na conversa. E agora?', itens: ['Avise o TI e a segurança imediatamente, pelo canal oficial.', 'Passou senha ou código? Troque a senha agora.', 'Envolveu dinheiro? Avise o financeiro e o banco na hora.', 'Anote tudo: número, nome usado, horário e o que foi pedido.'] }
      },
      ['eco', 'Golpe de conversa pega gente esperta, porque usa uma coisa boa: a vontade de ajudar.'],
      { revelar: 1 },
      ['eco', 'Primeiro: avise o TI e a segurança. Na hora.'],
      { revelar: 2 },
      ['eco', 'Segundo: se passou senha ou código, troque a senha agora.'],
      { revelar: 3 },
      ['eco', 'Terceiro: se envolveu dinheiro, avise o financeiro e o banco. Minutos fazem diferença pra bloquear.'],
      { revelar: 4 },
      ['eco', 'Quarto: anote tudo. Número, nome que ele usou, horário, o que pediu. Isso ajuda a proteger os colegas.'],
      { tela: { tipo: 'canal' } },
      ['eco', 'Ninguém vai te julgar. O golpista conta com a vergonha pra ganhar tempo.'],

      // ---------- Trecho 8 · Desfecho ----------
      { trecho: 'Trecho 8 · Desfecho', cena: 'corredor', tela: null, atores: [{ id: 'camaleao', lado: 'centro' }] },
      ['narrador', 'O Camaleão tenta mais um disfarce… mas ninguém mais aceita sem checar.'],
      { atores: [{ id: 'camaleao', pose: 'derrotado', lado: 'centro' }], efeito: 'tremer' },
      ['camaleao', 'Sem pressa? Sem segredo? Assim eu fico sem cor!'],
      { atores: [{ id: 'camaleao', pose: 'derrotado', lado: 'esquerda' }, { id: 'eco', lado: 'direita' }] },
      ['eco', 'Pressa e segredo? Hora de checar.'],
      { cena: 'central', atores: [{ id: 'eco', lado: 'esquerda' }] },
      ['eco', 'Quarta insígnia, recruta. Com as quatro, você é um Sentinela completo.'],
      { insignia: true },
      { cena: 'telhado', atores: [{ id: 'trava', lado: 'esquerda', escala: .8 }, { id: 'iris', lado: 'meio-esquerda', escala: .8 }, { id: 'lupa', pose: 'frente', lado: 'meio-direita', escala: .8 }, { id: 'eco', lado: 'direita', escala: .8 }] },
      ['narrador', 'O Esquadrão está completo. Missão bônus desbloqueada: Esquadrão Reunido.'],
      { atores: [] }
    ],

    quiz: [
      {
        pergunta: 'Alguém liga dizendo ser do TI e pede o código que chegou no seu celular. O que fazer?',
        opcoes: ['Passar, é do TI', 'Não passar; desligar e ligar para o número oficial do TI', 'Passar só metade do código'], certa: 1,
        explica: 'Código de verificação é a chave da sua conta. O TI de verdade nunca pede.'
      },
      {
        pergunta: 'O “diretor”, de um número novo, pede cartões-presente com urgência e segredo. Quais são os sinais de golpe?',
        opcoes: ['Só o número novo', 'Número novo, urgência, segredo e pedido fora do normal', 'Nenhum, diretor pode pedir isso'], certa: 1,
        explica: 'Quando os sinais se somam, não é coincidência: é roteiro de golpe.'
      },
      {
        pergunta: 'O que significa confirmar “por outro canal”?',
        opcoes: ['Responder a mesma mensagem perguntando se é verdade', 'Falar com a pessoa por um meio que você já conhece, como o número oficial ou pessoalmente', 'Pedir para a pessoa mandar um áudio'], certa: 1,
        explica: 'No canal dele, o golpista confirma qualquer coisa. E até voz pode ser imitada.'
      },
      {
        pergunta: 'Uma pessoa sem crachá pede para entrar junto com você. O que fazer?',
        opcoes: ['Segurar a porta, por gentileza', 'Com educação, indicar a recepção', 'Emprestar seu crachá'], certa: 1,
        explica: 'Gentil e firme: quem não tem crachá se identifica na recepção.'
      },
      {
        pergunta: 'Você passou sua senha numa ligação e depois desconfiou. E agora?',
        opcoes: ['Ficar quieto para não se complicar', 'Avisar o TI imediatamente e trocar a senha', 'Esperar para ver se algo acontece'], certa: 1,
        explica: 'O golpista conta com a vergonha. Avisar rápido corta o golpe pela raiz.'
      }
    ]
  });
})();
