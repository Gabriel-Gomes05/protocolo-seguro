/* Módulo 1 — A Isca (Lupa × Isca): phishing por e-mail, SMS e WhatsApp; reportar.
   Roteiro conforme a bíblia do projeto, versão de 5/10/2026. */
(() => {
  const EMAIL_RH = {
    tipo: 'email', hora: 'seg · 08:02',
    de: 'RH Comunicados',
    endereco: '{{rh@atualiza-cadastro.net|1}}',
    assunto: '{{URGENTE: Atualização cadastral obrigatória até hoje às 12h|2}}',
    corpo: '{{Prezado colaborador|5}},\nIdentificamos pendências no seu cadastro. {{Caso não atualize até as 12h, o pagamento deste mês poderá ser suspenso.|2}}\nPara regularizar, {{confirme seu usuário e senha|4}} no link abaixo.',
    link: { texto: '{{Clique aqui para regularizar|3}}', real: 'http://atualiza-cadastro.net/rh/login.php' }
  };

  const SMS_ENCOMENDA = {
    tipo: 'chat', app: 'sms', titulo: '+55 11 94821-0337', sub: 'Número desconhecido',
    msgs: [{ texto: 'Rastreio Express: sua encomenda BR4821 está retida por taxa de reentrega pendente de R$ 4,90. Pague em até 24h ou ela será devolvida: rastreio-express.top/pagar', hora: '10:41' }]
  };

  Sentinela.modulo({
    id: 'isca', numero: 1, titulo: 'A Isca', tema: 'PHISHING',
    heroi: 'lupa', vilao: 'isca',
    insignia: { nome: 'Insígnia da Lupa', icone: 'lupa' },
    proximo: { titulo: 'A Força Bruta', arquivo: 'modulo-2-forca-bruta.html' },

    abertura: {
      cena: 'telhado',
      atores: [{ id: 'lupa', pose: 'frente', lado: 'meio-direita', escala: .9 }],
      texto: 'Boas-vindas, recruta da [EMPRESA]. Em cerca de 8 minutos você vai enfrentar a **Isca**, o vilão do phishing. Suas escolhas mudam a história, e no final há um quiz de 5 perguntas.'
    },

    roteiro: [
      // ---------- Trecho 1 · Abertura ----------
      { trecho: 'Trecho 1 · Abertura', cena: 'escritorio', atores: [], tela: null },
      ['narrador', 'Segunda-feira, 8 da manhã. Quarenta e dois e-mails não lidos.', { voz: 'Segunda-feira, oito da manhã. Quarenta e dois e-mails não lidos.' }],
      { atores: [{ id: 'isca', pose: 'lancando', lado: 'telhado-vizinho' }], efeito: 'linha' },
      ['narrador', 'O dia mal começou… e alguém já está pescando.'],
      { atores: [], tela: EMAIL_RH },
      ['narrador', 'Um novo e-mail chega com destaque.'],
      { atores: [{ id: 'lupa', pose: 'tres-quartos', lado: 'direita' }] },
      ['lupa', 'Opa, opa. Antes de clicar… olha de novo.', { rosto: 'surpresa' }],
      ['lupa', 'Prazer, Lupa, do Esquadrão Sentinela. Você chegou agora na [EMPRESA], né?', { rosto: 'sorriso' }],
      ['lupa', 'Então vamos ver do que você é capaz.', { rosto: 'desconfiada' }],

      // ---------- Decisão 1 ----------
      {
        decisao: {
          pergunta: 'O que você faz com esse e-mail?',
          opcoes: [
            {
              texto: 'Clicar no link e atualizar o cadastro',
              passos: [
                // Trecho 2A · Fisgado
                { trecho: 'Trecho 2A · Fisgado', atores: [], tela: { tipo: 'login', url: 'http://atualiza-cadastro.net/rh/login.php', falso: true, digitando: true, usuario: 'seu.nome' } },
                ['narrador', 'A página abre: uma tela de login igualzinha à da [EMPRESA].'],
                ['narrador', 'Usuário… senha… entrar.'],
                { cena: 'telhado', tela: null, atores: [{ id: 'isca', pose: 'fisgou', lado: 'centro' }], efeito: 'linha' },
                ['isca', 'Fisguei! Que peixão!'],
                ['isca', 'Com essa senha eu entro no e-mail, no sistema… quem sabe até na folha de pagamento.', { pose: 'tramando' }],
                { cena: 'escritorio', atores: [{ id: 'lupa', pose: 'frente', lado: 'direita' }], tela: { tipo: 'login', url: 'http://atualiza-cadastro.net/rh/login.php', falso: true, usuario: 'seu.nome' } },
                ['lupa', 'Acontece com gente muito experiente. Mas olha só o que eu teria visto antes.', { rosto: 'preocupada' }],
                ['lupa', 'Vamos voltar a fita.', { rosto: 'sorriso' }],
                { tela: null, efeito: 'rebobinar' }
              ]
            },
            {
              texto: 'Responder perguntando se é verdade',
              passos: [
                // Trecho 2B · Conversando com o pescador
                { trecho: 'Trecho 2B · Conversando com o pescador', atores: [], tela: { tipo: 'chat', app: 'email', celular: false, titulo: 'RH Comunicados', sub: 'rh@atualiza-cadastro.net', msgs: [{ de: 'eu', texto: 'Isso é verdade?', hora: '08:04' }, { texto: 'Sim! O prazo termina às 12h. Regularize pelo link para não perder o pagamento deste mês.', hora: '08:05' }] } },
                ['narrador', 'Você responde: “Isso é verdade?”'],
                ['narrador', 'Segundos depois, chega a resposta.'],
                { cena: 'telhado', tela: null, atores: [{ id: 'isca', pose: 'tramando', lado: 'centro' }] },
                ['isca', 'Responderam! Agora eu sei que esse endereço existe e que tem alguém lendo.'],
                ['isca', 'Vou caprichar no próximo.', { pose: 'apresentando' }],
                { cena: 'escritorio', atores: [{ id: 'lupa', pose: 'tres-quartos', lado: 'direita' }] },
                ['lupa', 'Quase. Perguntar foi uma boa intuição, mas pro lugar errado: quem responde é o próprio golpista.', { rosto: 'preocupada' }],
                ['lupa', 'Desconfiou? Pergunte por outro canal. Bora aprender a enxergar os sinais.', { rosto: 'sorriso' }]
              ]
            },
            {
              texto: 'Reportar ao TI pelo canal oficial', boa: true,
              passos: [
                // Trecho 2C · Linha cortada
                { trecho: 'Trecho 2C · Linha cortada', cena: 'central', atores: [], tela: { tipo: 'alerta', titulo: 'Phishing reportado', texto: 'rh@atualiza-cadastro.net · enviado para 300 caixas da [EMPRESA]' }, efeito: 'alerta' },
                ['narrador', 'Você clica em Reportar. Na [CANAL], um alerta acende.'],
                { cena: 'telhado', tela: null, atores: [{ id: 'isca', pose: 'tonto', lado: 'centro' }], efeito: 'linha' },
                ['isca', 'Ei! Quem cortou minha linha?!'],
                { cena: 'central', atores: [{ id: 'lupa', pose: 'frente', lado: 'direita' }], tela: { tipo: 'alerta', cor: 'verde', titulo: 'Golpe bloqueado', texto: '300 cópias apagadas das caixas de entrada' } },
                ['lupa', 'Jogada de mestre, recruta.', { rosto: 'rindo' }],
                ['lupa', 'Esse mesmo e-mail chegou pra outras 300 pessoas. Seu reporte avisou a equipe pra apagar todos.', { rosto: 'feliz', voz: 'Esse mesmo e-mail chegou pra outras trezentas pessoas. Seu reporte avisou a equipe pra apagar todos.' }],
                ['lupa', 'Agora deixa eu te mostrar como eu soube na hora.', { rosto: 'sorriso' }],
                { selo: 'Olho Vivo' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 3 · A lição da Lupa ----------
      { trecho: 'Trecho 3 · A lição da Lupa', cena: 'escritorio', atores: [{ id: 'lupa', pose: 'tres-quartos', lado: 'esquerda' }], tela: Object.assign({ foco: true }, EMAIL_RH) },
      ['lupa', 'Phishing é uma mensagem que finge ser de alguém de confiança pra você entregar senha, dados ou dinheiro.', { rosto: 'falando' }],
      ['lupa', 'A Isca joga milhares de anzóis por dia. Mas todo anzol deixa pistas. Cinco delas.', { rosto: 'desconfiada' }],
      { destacar: 1, nota: '**Pista 1** · O domínio é atualiza-cadastro.net. O oficial é @[domínio oficial].' },
      ['lupa', 'Um: o remetente. Olha o endereço, não só o nome. Esse domínio não é o da [EMPRESA].'],
      { destacar: 2, nota: '**Pista 2** · Prazo curto + ameaça ao salário.' },
      ['lupa', 'Dois: urgência e ameaça. Prazo curto e salário em risco. Pressa desliga o pensamento.', { rosto: 'seria' }],
      { destacar: 3, nota: '**Pista 3** · Passe o mouse no botão: o destino real aparece embaixo e não é da empresa.' },
      ['lupa', 'Três: link disfarçado. Passe o mouse em cima, sem clicar, e o endereço real aparece. No celular, segure o dedo.'],
      { destacar: 4, nota: '**Pista 4** · Pede usuário e senha. RH, TI e banco nunca pedem isso por e-mail.' },
      ['lupa', 'Quatro: pedido de senha ou dados. RH, TI e banco não pedem sua senha por e-mail. Nunca.', { rosto: 'seria' }],
      { destacar: 5, nota: '**Pista 5** · “Prezado colaborador”: nem sabe o seu nome.' },
      ['lupa', 'Cinco: saudação genérica e detalhes estranhos, como “Prezado colaborador”.', { rosto: 'desconfiada' }],
      { destacar: 'todas', nota: '**5 sinais.** Viu um? Desconfie. Viu dois? Não clique: reporte.' },
      ['lupa', 'Viu um sinal? Já vale desconfiar. Viu dois? Não clica, reporta.', { rosto: 'sorriso' }],

      // ---------- Trecho 4 · Desafio: caça às pistas ----------
      { trecho: 'Trecho 4 · Caça às pistas', tela: null, atores: [] },
      {
        desafio: {
          tipo: 'pistas', titulo: 'Caça às pistas',
          instrucao: 'Clique nos 4 sinais de golpe neste e-mail.',
          mensagem: {
            tipo: 'email', hora: 'seg · 09:17',
            de: 'Suporte TI',
            endereco: '{{suporte@[empresa]-ti-helpdesk.com|dominio}}',
            assunto: 'Sua caixa de e-mail atingiu 99%: {{ação necessária|prazo}}',
            corpo: 'Olá, {{sua caixa será bloqueada em 24 horas|prazo}}. {{Valide sua conta|validacao}} para continuar recebendo mensagens.',
            link: { texto: '{{VALIDAR AGORA|validacao}}', real: 'http://[empresa]-ti-helpdesk.com/validar' },
            anexo: '{{validacao_conta.html|anexo}}'
          },
          sinais: {
            dominio: { nome: 'Domínio falso', explica: 'Nome da empresa pendurado num domínio que não é o oficial.' },
            prazo: { nome: 'Ameaça com prazo', explica: 'Ameaça com prazo: a pressa trabalhando para o golpista.' },
            validacao: { nome: 'Pedido de validação', explica: '“Valide sua conta” é pedido de login disfarçado.' },
            anexo: { nome: 'Anexo .html', explica: 'Anexo .html inesperado abre uma página falsa.' }
          }
        }
      },
      { atores: [{ id: 'lupa', pose: 'frente', lado: 'direita' }] },
      ['lupa', 'Repara no truque do domínio: ele colocou o nome da [EMPRESA] no endereço pra parecer de casa. Nome conhecido no meio do endereço não é garantia de nada.', { rosto: 'desconfiada' }],

      // ---------- Trecho 5 · A Isca muda de tática ----------
      { trecho: 'Trecho 5 · A Isca muda de tática', cena: 'telhado', atores: [{ id: 'isca', pose: 'apontando', lado: 'centro' }] },
      ['narrador', 'A Isca, irritada, troca de tática.'],
      ['isca', 'E-mail não deu? Tudo bem. Todo mundo tá esperando alguma entrega…', { pose: 'tramando' }],
      { cena: 'celular', atores: [], tela: SMS_ENCOMENDA },
      ['narrador', 'No seu celular, uma mensagem de número desconhecido.'],
      { atores: [{ id: 'lupa', pose: 'tres-quartos', lado: 'direita' }] },
      ['lupa', 'Mesma isca, outro lago. SMS e WhatsApp também têm phishing. E aí, recruta?', { rosto: 'desconfiada' }],

      // ---------- Decisão 2 (rápida) ----------
      {
        decisao: {
          pergunta: 'Decida rápido: o que você faz?', tempo: 10, padrao: 1,
          opcoes: [
            {
              texto: 'Pagar, é pouco dinheiro',
              passos: [
                // Trecho 6A · O preço dos R$ 4,90
                { trecho: 'Trecho 6A · O preço dos R$ 4,90', atores: [], tela: { tipo: 'cartao', titulo: 'Rastreio Express' } },
                ['narrador', 'O link pede nome, número do cartão, validade e código de segurança.'],
                { cena: 'telhado', tela: null, atores: [{ id: 'isca', pose: 'fisgou', lado: 'centro' }], efeito: 'linha' },
                ['isca', 'Obrigado pelo cartão! Volte sempre!'],
                { cena: 'celular', atores: [{ id: 'lupa', pose: 'frente', lado: 'direita' }], tela: SMS_ENCOMENDA },
                ['lupa', 'O golpe nunca foi os R$ 4,90. Era o seu cartão inteiro.', { rosto: 'seria', voz: 'O golpe nunca foi os quatro e noventa. Era o seu cartão inteiro.' }],
                ['lupa', 'Taxa surpresa por link é sinal clássico. Confira sempre direto no site ou app da loja.', { rosto: 'falando' }]
              ]
            },
            {
              texto: 'Não clicar; conferir no app ou site da loja onde comprei', boa: true,
              passos: [
                // Trecho 6B · Verificou pelo caminho certo
                { trecho: 'Trecho 6B · Direto na fonte', tela: { tipo: 'app', titulo: 'Minha Loja', pedido: 'Pedido #48213 · fone de ouvido', status: 'Em trânsito', texto: 'Nenhuma pendência. Nenhuma taxa a pagar.' } },
                ['narrador', 'Você abre o app da loja: pedido em trânsito, sem pendências.'],
                ['lupa', 'Isso! Não discutiu com a mensagem, foi direto na fonte.', { rosto: 'rindo' }],
                ['lupa', 'Esse é o hábito que derruba qualquer isca.', { rosto: 'feliz' }],
                { selo: 'Direto na Fonte' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 7 · E se eu cair? ----------
      {
        trecho: 'Trecho 7 · E se eu cair?', cena: 'central', atores: [{ id: 'lupa', pose: 'frente', lado: 'esquerda' }],
        tela: { tipo: 'telao', titulo: 'Cliquei. E agora?', itens: ['Avise o TI imediatamente, pelo canal oficial.', 'Troque a senha digitada, e onde mais usava a mesma.', 'Não apague a mensagem: ela ajuda a bloquear o golpe.', 'Envolveu cartão ou banco? Ligue para o número do verso do cartão.'] }
      },
      ['lupa', 'Agora a parte mais importante do treinamento.', { rosto: 'seria' }],
      ['lupa', 'Um dia, cansado, com pressa, você pode clicar. Acontece com todo mundo.', { rosto: 'preocupada' }],
      ['lupa', 'O que separa um susto de um desastre é o que você faz nos minutos seguintes.', { rosto: 'seria' }],
      { revelar: 1 },
      ['lupa', 'Primeiro: avise o TI imediatamente, pelo canal oficial. Sem vergonha; ninguém vai te crucificar.', { rosto: 'falando' }],
      { revelar: 2 },
      ['lupa', 'Segundo: troque a senha que você digitou, e em qualquer outro lugar onde usava a mesma.', { rosto: 'falando' }],
      { revelar: 3 },
      ['lupa', 'Terceiro: não apague a mensagem. Ela ajuda o TI a bloquear o golpe para todo mundo.', { rosto: 'falando' }],
      { revelar: 4 },
      ['lupa', 'Quarto: se envolveu cartão ou banco, ligue para o banco pelo número do verso do cartão.', { rosto: 'falando' }],
      { tela: { tipo: 'canal' } },
      ['lupa', 'Atacante conta com o silêncio. Quanto mais cedo a gente sabe, menor o estrago.', { rosto: 'seria' }],

      // ---------- Trecho 8 · Desfecho ----------
      { trecho: 'Trecho 8 · Desfecho', cena: 'telhado', tela: null, atores: [{ id: 'isca', pose: 'lancando', lado: 'esquerda', escala: .8 }] },
      ['narrador', 'A Isca tenta lançar a vara de novo…'],
      { efeito: 'janelas' },
      ['narrador', '…mas as janelas da [EMPRESA] se acendem, uma a uma, com reportes.'],
      { atores: [{ id: 'isca', pose: 'rede', lado: 'esquerda', escala: .85 }], efeito: 'tremer' },
      ['isca', 'Isso não acaba aqui! Um dia alguém vai estar com pressa…'],
      { atores: [{ id: 'isca', pose: 'rede', lado: 'esquerda', escala: .85 }, { id: 'lupa', pose: 'frente', lado: 'meio-direita' }] },
      ['lupa', 'E nesse dia você vai lembrar: olha de novo.', { rosto: 'sorriso' }],
      { cena: 'central', atores: [{ id: 'lupa', pose: 'frente', lado: 'esquerda' }] },
      ['lupa', 'Agora você é do Esquadrão Sentinela, recruta. Primeira insígnia conquistada.', { rosto: 'feliz' }],
      { insignia: true },
      { cena: 'sala-escura', atores: [{ id: 'forca', pose: 'sombra', lado: 'centro', escala: 1.1 }] },
      ['forca', '123456… senha123… [empresa]2026… Achei!', { voz: 'um, dois, três, quatro, cinco, seis… senha um dois três… [EMPRESA] dois mil e vinte e seis… Achei!' }],
      ['narrador', 'Próxima missão: A Força Bruta.'],
      { atores: [] }
    ],

    quiz: [
      {
        pergunta: 'Você recebe um e-mail do “Banco” pedindo para confirmar sua senha num link, senão a conta será bloqueada. O que mais denuncia o golpe?',
        opcoes: ['O e-mail ter o logo do banco', 'O pedido de senha combinado com ameaça de bloqueio', 'Ter chegado numa segunda-feira'], certa: 1,
        explica: 'Banco nenhum pede senha por e-mail, e ameaça com prazo é a pressa trabalhando a favor do golpista.'
      },
      {
        pergunta: 'Como conferir para onde um link leva antes de clicar?',
        opcoes: ['Clicar e ver se a página parece certa', 'Passar o mouse sobre o link (ou segurar o dedo, no celular) e ler o endereço real', 'Encaminhar para um colega clicar'], certa: 1,
        explica: 'O texto do link pode dizer qualquer coisa; o endereço real é que conta.'
      },
      {
        pergunta: 'O remetente é “Diretoria [EMPRESA]” e o endereço é diretoria@[empresa]-corp-mail.com. Isso prova que é legítimo?',
        opcoes: ['Sim, tem o nome da empresa', 'Não. O nome no meio do endereço pode ser imitação; o que vale é o domínio oficial (@[domínio oficial])', 'Sim, se tiver assinatura no final'], certa: 1,
        explica: 'Golpista adora pendurar o nome da empresa num domínio parecido.'
      },
      {
        pergunta: 'Chega no WhatsApp: “Sua encomenda está retida, pague R$ 4,90 no link”. O melhor caminho é:',
        opcoes: ['Pagar, é um valor baixo', 'Responder pedindo mais detalhes', 'Ignorar o link e conferir no site ou app oficial da loja'], certa: 2,
        explica: 'Vá direto na fonte; nunca pelo caminho que a mensagem te oferece.'
      },
      {
        pergunta: 'Você clicou num link suspeito e digitou sua senha. Qual a primeira coisa a fazer?',
        opcoes: ['Apagar o e-mail e torcer para nada acontecer', 'Avisar o TI imediatamente e trocar a senha', 'Esperar para ver se aparece algo estranho'], certa: 1,
        explica: 'Minutos contam. Avisar rápido transforma um desastre num susto.'
      }
    ]
  });
})();
