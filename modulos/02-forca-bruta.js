/* Módulo 2 — A Força Bruta (Trava × Força Bruta): frase-senha, não reutilizar,
   gerenciador de senhas e segundo fator. Rascunho de roteiro na estrutura padrão da bíblia. */
(() => {
  const SENHA = { tipo: 'senha', titulo: 'Sua senha expirou', sub: 'Crie uma nova senha para continuar.' };

  Sentinela.modulo({
    id: 'forca-bruta', numero: 2, titulo: 'A Força Bruta', tema: 'SENHAS E AUTENTICAÇÃO',
    heroi: 'trava', vilao: 'forca',
    insignia: { nome: 'Insígnia da Trava', icone: 'cadeado' },
    proximo: { titulo: 'O Vazamento', arquivo: 'modulo-3-vazamento.html' },

    abertura: {
      cena: 'telhado',
      atores: [{ id: 'trava', lado: 'meio-direita', escala: .9 }],
      texto: 'Recruta da [EMPRESA], a **Força Bruta** saiu das sombras. Ela não adivinha senhas: testa milhões até acertar. Em cerca de 7 minutos você vai aprender a trancar a porta, e no final há um quiz de 5 perguntas.'
    },

    roteiro: [
      // ---------- Trecho 1 · Abertura ----------
      { trecho: 'Trecho 1 · Abertura', cena: 'escritorio', atores: [], tela: SENHA },
      ['narrador', 'Terça-feira, 9 da manhã. A tela trava num aviso: sua senha expirou.', { voz: 'Terça-feira, nove da manhã. A tela trava num aviso: sua senha expirou.' }],
      { cena: 'sala-escura', tela: null, atores: [{ id: 'forca', pose: 'brava', lado: 'centro' }] },
      ['forca', 'Senha nova? Que delícia. Gente com pressa escolhe senha fácil.'],
      ['forca', 'Eu não adivinho. Eu testo. Milhões de tentativas, sem cansar.'],
      { cena: 'escritorio', atores: [{ id: 'trava', lado: 'direita' }], tela: SENHA },
      ['trava', 'Calma. Respira. Senha não é coisa pra fazer correndo.'],
      ['trava', 'Eu sou a Trava, do Esquadrão Sentinela. A Lupa me contou que você tem olho bom.'],
      ['trava', 'Uma chave só não basta… mas vamos começar pela chave.'],

      // ---------- Decisão 1 ----------
      {
        decisao: {
          pergunta: 'Que senha você cria?',
          opcoes: [
            {
              texto: '[EMPRESA]@2026: tem maiúscula, símbolo e número',
              passos: [
                { trecho: 'Trecho 2A · Previsível', tela: Object.assign({}, SENHA, { valor: '[EMPRESA]@2026', forca: 2 }) },
                { cena: 'sala-escura', atores: [{ id: 'forca', pose: 'brava', lado: 'direita' }], tela: { tipo: 'tentativas', titulo: 'lista-de-palpites.txt', posicao: 'esquerda', linhas: [{ texto: '123456' }, { texto: 'senha123' }, { texto: '[empresa]2025' }, { texto: '[EMPRESA]@2025' }, { texto: '[EMPRESA]@2026 · acesso liberado', ok: true }] } },
                { pausa: 2400 },
                ['forca', 'Nome da empresa e o ano? É a primeira coisa da minha lista!'],
                ['forca', 'Maiúscula, arroba, número… e mesmo assim previsível. Adoro.'],
                { cena: 'escritorio', tela: null, atores: [{ id: 'trava', lado: 'direita' }] },
                ['trava', 'Símbolo não salva senha previsível. O que ela testa primeiro é nome, data e ano.'],
                ['trava', 'Vamos voltar e fazer do jeito certo.'],
                { efeito: 'rebobinar' }
              ]
            },
            {
              texto: 'A mesma do meu e-mail pessoal, assim não esqueço',
              passos: [
                { trecho: 'Trecho 2B · Chave reaproveitada', tela: Object.assign({}, SENHA, { valor: '••••••••••', forca: 3 }) },
                { cena: 'sala-escura', atores: [{ id: 'forca', pose: 'brava', lado: 'direita' }], tela: { tipo: 'tentativas', titulo: 'vazamentos-antigos.txt', posicao: 'esquerda', linhas: [{ texto: 'site de receitas (vazou em 2024): seu e-mail + senha', ok: true }, { texto: 'testando no e-mail da [EMPRESA]…', ok: true }, { texto: 'testando no banco…' }, { texto: 'testando na loja on-line…', ok: true }] } },
                { pausa: 2000 },
                ['forca', 'Essa senha vazou ano passado, naquele site de receitas. Agora eu testo em todo lugar.'],
                ['forca', 'Uma chave que abre todas as portas? Obrigada!'],
                { cena: 'escritorio', tela: null, atores: [{ id: 'trava', lado: 'direita' }] },
                ['trava', 'Quando um site vaza, as senhas vão pra listas que os atacantes testam em tudo. Repetir senha é entregar o molho de chaves inteiro.'],
                ['trava', 'Uma senha por serviço. Já já eu te mostro como dar conta disso.']
              ]
            },
            {
              texto: 'Uma frase-senha: café-com-pão-na-janela-azul', boa: true,
              passos: [
                { trecho: 'Trecho 2C · Frase forte', tela: Object.assign({}, SENHA, { valor: 'café-com-pão-na-janela-azul', forca: 4 }) },
                { cena: 'sala-escura', atores: [{ id: 'forca', pose: 'brava', lado: 'direita' }], tela: { tipo: 'tentativas', titulo: 'lista-de-palpites.txt', posicao: 'esquerda', linhas: [{ texto: '123456' }, { texto: '[EMPRESA]@2026' }, { texto: 'cafe123' }, { texto: 'janelaazul' }, { texto: 'tempo estimado: séculos' }] } },
                { pausa: 2400 },
                ['forca', 'Café… com… pão? Isso não tá em lista nenhuma!'],
                ['forca', 'Vou levar séculos nisso!'],
                { cena: 'escritorio', tela: null, atores: [{ id: 'trava', lado: 'direita' }] },
                ['trava', 'Viu? Comprimento vence complicação. Quatro ou mais palavras aleatórias e ela desiste.'],
                ['trava', 'E você ainda consegue lembrar. Melhor dos dois mundos.'],
                { selo: 'Frase Forte' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 3 · A lição da Trava ----------
      {
        trecho: 'Trecho 3 · A lição da Trava', cena: 'central', atores: [{ id: 'trava', lado: 'esquerda' }],
        tela: { tipo: 'telao', rotulo: 'Lição da Trava', titulo: 'As 5 regras da chave forte', itens: [
          '**Frase-senha longa**: quatro ou mais palavras aleatórias. Comprimento vence complicação.',
          '**Uma senha por serviço.** A do trabalho nunca vai para sites pessoais.',
          '**Gerenciador de senhas** aprovado pela [EMPRESA]: você lembra de uma, ele guarda o resto.',
          '**Segundo fator** ligado sempre que puder: senha + aplicativo autenticador.',
          '**Senha é pessoal**: não compartilhe, não anote em post-it, não mande por mensagem.'
        ] }
      },
      ['trava', 'A Força Bruta não é esperta. Ela é persistente. Testa senhas comuns, palavras, datas… e senhas que vazaram de outros sites.'],
      ['trava', 'Contra isso, cinco regras.'],
      { revelar: 1 },
      ['trava', 'Um: frase-senha. Quatro ou mais palavras aleatórias formam uma senha longa, fácil de lembrar e difícil de quebrar.'],
      { revelar: 2 },
      ['trava', 'Dois: uma senha por serviço. Se um site vazar, o estrago fica só nele.'],
      { revelar: 3 },
      ['trava', 'Três: gerenciador de senhas. Você decora uma frase forte, e ele cria e guarda as outras.'],
      { revelar: 4 },
      ['trava', 'Quatro: segundo fator. É provar que é você com duas coisas: algo que você sabe, a senha, e algo que você tem, o celular.'],
      { revelar: 5 },
      ['trava', 'Cinco: senha é pessoal. Tudo o que for feito com ela fica no seu nome.'],

      // ---------- Trecho 4 · Desafio ----------
      { trecho: 'Trecho 4 · Quebra ou resiste?', tela: null, atores: [] },
      {
        desafio: {
          tipo: 'classificar', titulo: 'Quebra ou resiste?',
          instrucao: 'A Força Bruta quebra essa senha rapidinho, ou ela resiste?',
          grupos: [{ id: 'fraca', nome: 'A Força Bruta quebra' }, { id: 'forte', nome: 'Resiste' }],
          itens: [
            { texto: '123456', grupo: 'fraca', explica: 'É a senha mais usada do mundo. Fica no topo de toda lista de ataque.' },
            { texto: 'Fernanda1990', grupo: 'fraca', explica: 'Nome e ano de nascimento: dá pra descobrir em qualquer rede social.' },
            { texto: 'girassol-trem-chuva-panqueca', grupo: 'forte', explica: 'Quatro palavras aleatórias: longa, fácil de lembrar e fora das listas.' },
            { texto: '[EMPRESA]@2026', grupo: 'fraca', explica: 'Nome da empresa + ano é previsível, mesmo com símbolo.' },
            { texto: 'S3nh@!', grupo: 'fraca', explica: 'Curta demais. Trocar letras por símbolos não engana ninguém.' },
            { texto: 'tamanco violeta sobe a serra de bicicleta', grupo: 'forte', explica: 'Frase longa e sem dados pessoais óbvios. Resiste muito bem.' }
          ]
        }
      },
      { atores: [{ id: 'trava', lado: 'direita' }] },
      ['trava', 'Repara: as que resistem não são as mais complicadas. São as mais longas.'],

      // ---------- Trecho 5 · A Força Bruta muda de tática ----------
      { trecho: 'Trecho 5 · A Força Bruta muda de tática', cena: 'sala-escura', atores: [{ id: 'forca', pose: 'brava', lado: 'centro' }] },
      ['narrador', 'A Força Bruta, irritada, muda de tática.'],
      ['forca', 'Achei uma senha antiga sua num vazamento. Só falta passar pelo segundo fator… e eu sei como: vou te cansar.'],
      { cena: 'casa', atores: [], tela: { tipo: 'push', titulo: 'Aprovar login?', texto: 'Novo acesso ao e-mail da [EMPRESA]\nLocal desconhecido · 23:14', contador: '×7' } },
      ['narrador', 'Quinta-feira, 11 da noite. O celular não para de vibrar.', { voz: 'Quinta-feira, onze da noite. O celular não para de vibrar.' }],
      { atores: [{ id: 'trava', lado: 'direita' }] },
      ['trava', 'Pedido de login que você não fez, sete vezes seguidas, quase meia-noite. E aí, recruta?'],

      // ---------- Decisão 2 (rápida) ----------
      {
        decisao: {
          pergunta: 'Decida rápido: o que você faz?', tempo: 10, padrao: 1,
          opcoes: [
            {
              texto: 'Aprovar, só pra parar de tocar',
              passos: [
                { trecho: 'Trecho 6A · O sim que ela queria', cena: 'sala-escura', tela: null, atores: [{ id: 'forca', pose: 'brava', lado: 'centro' }] },
                ['forca', 'Obrigada pelo sim! Seu e-mail… quer dizer, meu e-mail.'],
                { cena: 'casa', atores: [{ id: 'trava', lado: 'direita' }] },
                ['trava', 'Aprovar pra fazer parar é exatamente o que ela queria. O segundo fator só protege se você disser não.'],
                ['trava', 'Se não foi você que pediu o login, a resposta é sempre negar. E avisar.']
              ]
            },
            {
              texto: 'Negar e avisar o TI', boa: true,
              passos: [
                { trecho: 'Trecho 6B · Porta trancada', tela: { tipo: 'alerta', cor: 'verde', titulo: 'Acesso negado', texto: 'Alerta enviado ao TI · senha redefinida' } },
                ['narrador', 'Você nega e avisa o TI. A senha é trocada antes do café da manhã.'],
                ['trava', 'Isso. Pedido que você não fez é ataque em andamento.'],
                ['trava', 'E repara: quem chegou até o segundo fator já tinha sua senha. Avisar foi o que fechou a porta de vez.'],
                { selo: 'Porta Trancada' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 7 · E se minha senha vazar? ----------
      {
        trecho: 'Trecho 7 · E se minha senha vazar?', cena: 'central', atores: [{ id: 'trava', lado: 'esquerda' }],
        tela: { tipo: 'telao', titulo: 'Acho que minha senha vazou. E agora?', itens: ['Avise o TI imediatamente, pelo canal oficial.', 'Troque a senha agora, e em todo lugar onde usava a mesma.', 'Confira e encerre sessões e aparelhos que você não reconhece.', 'Ative o segundo fator onde ainda não tiver.'] }
      },
      ['trava', 'Agora, o que fazer se der errado. Porque um dia pode dar.'],
      { revelar: 1 },
      ['trava', 'Primeiro: avise o TI. Sem vergonha; quanto antes, melhor.'],
      { revelar: 2 },
      ['trava', 'Segundo: troque a senha. E em todo lugar onde você usava a mesma.'],
      { revelar: 3 },
      ['trava', 'Terceiro: confira as sessões abertas e os aparelhos conectados. Não reconheceu? Encerra.'],
      { revelar: 4 },
      ['trava', 'Quarto: ligue o segundo fator onde ainda não tiver. É a tranca extra.'],
      { tela: { tipo: 'canal' } },
      ['trava', 'Senha vazada com aviso rápido é só um susto. Sem aviso, vira chave na mão do atacante.'],

      // ---------- Trecho 8 · Desfecho ----------
      { trecho: 'Trecho 8 · Desfecho', cena: 'sala-escura', tela: { tipo: 'tentativas', titulo: 'última tentativa.txt', posicao: 'esquerda', linhas: [{ texto: 'senha123' }, { texto: '[EMPRESA]@2026' }, { texto: 'login sem segundo fator' }, { texto: 'acesso bloqueado pelo TI' }] }, atores: [{ id: 'forca', pose: 'brava', lado: 'direita' }] },
      { pausa: 2000 },
      { atores: [{ id: 'forca', pose: 'derrotado', lado: 'direita' }], efeito: 'tremer' },
      ['forca', 'Frase longa… segundo fator… isso não é justo!'],
      { tela: null, atores: [{ id: 'forca', pose: 'derrotado', lado: 'direita' }, { id: 'trava', lado: 'esquerda' }] },
      ['trava', 'É justo, sim. Uma chave só não basta.'],
      { cena: 'central', atores: [{ id: 'trava', lado: 'esquerda' }] },
      ['trava', 'Segunda insígnia conquistada, recruta.'],
      { insignia: true },
      { cena: 'escritorio', atores: [{ id: 'vazamento', lado: 'esquerda', escala: .5 }], tela: { tipo: 'planilha', titulo: 'clientes.xlsx', vazando: true, colunas: ['Nome', 'CPF', 'Telefone'], linhas: [['Ana Souza', '123.456.789-00', '(11) 9••••-1020'], ['Bruno Lima', '987.654.321-00', '(21) 9••••-3344']] } },
      ['narrador', 'Enquanto isso, numa planilha esquecida, alguma coisa começa a escorrer…'],
      ['narrador', 'Próxima missão: O Vazamento.'],
      { atores: [], tela: null }
    ],

    quiz: [
      {
        pergunta: 'Qual destas senhas é mais difícil para um atacante quebrar?',
        opcoes: ['[EMPRESA]@2026', 'Tr0c@d0r!', 'tamanco-violeta-chuva-pirata'], certa: 2,
        explica: 'Comprimento vence complicação. Palavras aleatórias formam uma senha longa que você consegue lembrar.'
      },
      {
        pergunta: 'Por que não usar a mesma senha em vários sites?',
        opcoes: ['Porque fica difícil de lembrar', 'Porque, se um site vazar, o atacante testa a mesma senha em todos os outros', 'Não tem problema, se a senha for forte'], certa: 1,
        explica: 'Senha vazada vai para listas que são testadas em todo lugar. Uma senha por serviço limita o estrago.'
      },
      {
        pergunta: 'Seu celular mostra várias notificações “Aprovar login?” que você não pediu. O que fazer?',
        opcoes: ['Aprovar uma vez para parar', 'Negar e avisar o TI imediatamente', 'Desligar o celular e esquecer'], certa: 1,
        explica: 'Pedido que você não fez é ataque em andamento: alguém já tem sua senha. Negue e avise.'
      },
      {
        pergunta: 'Um colega pede sua senha “só pra adiantar um relatório”. O que você faz?',
        opcoes: ['Passo, é colega de confiança', 'Não passo; o acesso dele deve ser pedido ao TI ou ao gestor', 'Anoto num papel e entrego em mãos'], certa: 1,
        explica: 'Senha é pessoal. Tudo o que for feito com ela fica registrado no seu nome.'
      },
      {
        pergunta: 'Qual a melhor forma de lidar com muitas senhas diferentes?',
        opcoes: ['Uma planilha no computador', 'Post-it colado no monitor', 'O gerenciador de senhas aprovado pela empresa'], certa: 2,
        explica: 'Você lembra de uma frase forte; o gerenciador cria e guarda as outras com segurança.'
      }
    ]
  });
})();
