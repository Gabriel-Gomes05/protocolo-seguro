/* Módulo 3 — O Vazamento (Íris × Vazamento): LGPD no dia a dia.
   Rascunho de roteiro na estrutura padrão da bíblia. */
(() => {
  const PLANILHA = {
    tipo: 'planilha', titulo: 'clientes.xlsx · 4.000 linhas',
    colunas: ['Nome', 'CPF', 'Telefone', 'Endereço', 'Última compra'],
    linhas: [
      ['Ana Souza', '123.456.789-00', '(11) 9••••-1020', 'R. das Flores, 120', '12/09'],
      ['Bruno Lima', '987.654.321-00', '(21) 9••••-3344', 'Av. Central, 88', '03/09'],
      ['Carla Nunes', '456.123.789-00', '(31) 9••••-7781', 'R. do Porto, 7', '28/08'],
      ['Diego Alves', '321.789.456-00', '(41) 9••••-2290', 'Tv. Azul, 15', '21/08']
    ]
  };

  Sentinela.modulo({
    id: 'vazamento', numero: 3, titulo: 'O Vazamento', tema: 'LGPD E DADOS PESSOAIS',
    heroi: 'iris', vilao: 'vazamento',
    insignia: { nome: 'Insígnia da Íris', icone: 'cofre' },
    proximo: { titulo: 'O Camaleão', arquivo: 'modulo-4-camaleao.html' },

    abertura: {
      cena: 'telhado',
      atores: [{ id: 'iris', lado: 'meio-direita', escala: .9 }],
      texto: 'Recruta da [EMPRESA], o **Vazamento** quase não fala, mas escorre por qualquer brecha: planilha largada, e-mail errado, tela aberta. Em cerca de 7 minutos você vai aprender a fechar essas brechas, e no final há um quiz de 5 perguntas.'
    },

    roteiro: [
      // ---------- Trecho 1 · Abertura ----------
      { trecho: 'Trecho 1 · Abertura', cena: 'escritorio', atores: [], tela: { tipo: 'chat', app: 'email', celular: false, titulo: 'Rafael · Comercial', sub: 'chat interno da [EMPRESA]', msgs: [{ texto: 'Oi! Me manda a planilha de clientes? Vou terminar em casa hoje à noite.', hora: '17:32' }, { texto: 'Manda pro meu Gmail, que é mais fácil: rafa.vendas@gmail.com', hora: '17:32' }] } },
      ['narrador', 'Quarta-feira, fim de tarde. Um colega do Comercial pede uma ajuda.'],
      { tela: PLANILHA },
      ['narrador', 'A planilha tem nome, CPF, telefone e endereço de quatro mil clientes.'],
      { atores: [{ id: 'vazamento', lado: 'esquerda', escala: .5 }] },
      ['narrador', 'E, no canto da tela, alguma coisa brilha.'],
      ['vazamento', 'Glub…'],
      { atores: [{ id: 'vazamento', lado: 'esquerda', escala: .5 }, { id: 'iris', lado: 'direita' }] },
      ['iris', 'Psiu. Antes de enviar, me deixa olhar.'],
      ['iris', 'Sou a Íris, do Esquadrão Sentinela. Meus olhos brilham quando veem dado pessoal… e agora eles estão ofuscados.'],

      // ---------- Decisão 1 ----------
      {
        decisao: {
          pergunta: 'Como você ajuda o colega?',
          opcoes: [
            {
              texto: 'Enviar a planilha inteira para o Gmail dele',
              passos: [
                { trecho: 'Trecho 2A · Escorreu', tela: Object.assign({}, PLANILHA, { vazando: true }), atores: [{ id: 'vazamento', lado: 'esquerda', escala: .7 }] },
                ['narrador', 'A planilha sai da [EMPRESA] e vai parar numa conta pessoal, fora de qualquer controle.'],
                ['vazamento', 'Glub… quatro mil… CPFs…'],
                { atores: [{ id: 'vazamento', lado: 'esquerda', escala: .7 }, { id: 'iris', lado: 'direita' }] },
                ['iris', 'Agora esses dados estão num lugar que a [EMPRESA] não protege, não monitora e não consegue apagar.'],
                ['iris', 'Se essa conta for invadida, são quatro mil pessoas expostas. Vamos voltar.'],
                { tela: null, efeito: 'rebobinar' }
              ]
            },
            {
              texto: 'Mandar no grupo de WhatsApp do time, que é mais rápido',
              passos: [
                { trecho: 'Trecho 2B · Grupo grande demais', tela: { tipo: 'chat', titulo: 'Time Comercial', sub: '38 participantes', msgs: [{ de: 'eu', texto: '📎 clientes.xlsx', hora: '17:35' }, { texto: 'Valeu! Salvei aqui 👍', hora: '17:36' }] }, atores: [{ id: 'vazamento', lado: 'esquerda', escala: .6 }] },
                ['narrador', 'O grupo tem 38 pessoas, incluindo dois ex-funcionários e um fornecedor.', { voz: 'O grupo tem trinta e oito pessoas, incluindo dois ex-funcionários e um fornecedor.' }],
                ['vazamento', 'Glub! Trinta e oito portas abertas…'],
                { atores: [{ id: 'vazamento', lado: 'esquerda', escala: .6 }, { id: 'iris', lado: 'direita' }] },
                ['iris', 'Rápido não é o mesmo que seguro. Em grupo, o arquivo vai pra quem não precisa, e fica lá.'],
                ['iris', 'Dado pessoal só circula pelos canais oficiais, para quem precisa.']
              ]
            },
            {
              texto: 'Compartilhar pela pasta oficial da [EMPRESA], só com ele e só as colunas que ele precisa', boa: true,
              passos: [
                { trecho: 'Trecho 2C · Só o necessário', tela: Object.assign({}, PLANILHA, { titulo: 'clientes_contato.xlsx · compartilhado só com Rafael', ocultas: [1, 3] }) },
                ['narrador', 'Você compartilha pela pasta oficial, só com o Rafael, sem CPF e sem endereço: ele só precisava do contato.'],
                { atores: [{ id: 'vazamento', pose: 'evaporando', lado: 'esquerda', escala: .5 }, { id: 'iris', lado: 'direita' }] },
                ['vazamento', 'Glub…?'],
                ['iris', 'Perfeito. Ele recebeu o que precisava, e nada além disso.'],
                ['iris', 'Isso tem nome na LGPD: necessidade. Usar e compartilhar só o que é preciso.'],
                { selo: 'Só o Necessário' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 3 · A lição da Íris ----------
      {
        trecho: 'Trecho 3 · A lição da Íris', cena: 'central', atores: [{ id: 'iris', lado: 'esquerda' }],
        tela: { tipo: 'telao', rotulo: 'Lição da Íris', titulo: 'LGPD no dia a dia', itens: [
          '**Dado pessoal** é o que identifica alguém: nome, CPF, e-mail, telefone, endereço, foto.',
          '**Dado sensível** pede ainda mais cuidado: saúde, biometria, religião, origem racial, opinião política, vida sexual.',
          '**Só o necessário**: use e compartilhe apenas o que a tarefa exige.',
          '**Só pelo canal oficial**: nada de e-mail pessoal, pendrive ou grupo de mensagem.',
          '**Só com quem precisa**, e descarte quando não precisar mais.'
        ] }
      },
      ['iris', 'LGPD é a Lei Geral de Proteção de Dados. Ela diz como empresas podem usar informação sobre pessoas: clientes, colegas… você.'],
      ['iris', 'Não precisa decorar a lei. Precisa de cinco hábitos.'],
      { revelar: 1 },
      ['iris', 'Um: dado pessoal é qualquer informação que identifica uma pessoa. Até o e-mail do trabalho.'],
      { revelar: 2 },
      ['iris', 'Dois: alguns dados são sensíveis, como saúde e biometria. Vazou, o estrago na vida da pessoa é maior.'],
      { revelar: 3 },
      ['iris', 'Três: só o necessário. Se a tarefa precisa do telefone, não manda o CPF junto.'],
      { revelar: 4 },
      ['iris', 'Quatro: só pelo canal oficial. Fora dele, a [EMPRESA] não consegue proteger nem apagar.'],
      { revelar: 5 },
      ['iris', 'Cinco: só com quem precisa. E quando o dado não for mais necessário, descarte do jeito certo.'],
      ['iris', 'Dado de alguém é confiança de alguém.'],

      // ---------- Trecho 4 · Desafio ----------
      { trecho: 'Trecho 4 · Que dado é esse?', tela: null, atores: [] },
      {
        desafio: {
          tipo: 'classificar', titulo: 'Que dado é esse?',
          instrucao: 'Classifique cada informação.',
          grupos: [{ id: 'pessoal', nome: 'Dado pessoal' }, { id: 'sensivel', nome: 'Dado sensível' }, { id: 'nao', nome: 'Não é dado pessoal' }],
          itens: [
            { texto: 'CPF de um cliente', grupo: 'pessoal', explica: 'Identifica uma pessoa diretamente: dado pessoal.' },
            { texto: 'Atestado médico de um colega', grupo: 'sensivel', explica: 'Saúde é dado sensível: acesso só para quem cuida disso, como o RH.' },
            { texto: 'Faturamento do trimestre', grupo: 'nao', explica: 'Não identifica ninguém. É confidencial da empresa, mas não é dado pessoal.' },
            { texto: 'Digital usada no ponto eletrônico', grupo: 'sensivel', explica: 'Biometria é dado sensível.' },
            { texto: 'E-mail corporativo de um colega', grupo: 'pessoal', explica: 'Identifica uma pessoa, mesmo sendo do trabalho.' },
            { texto: 'Placa do carro de um visitante', grupo: 'pessoal', explica: 'Dá para chegar a uma pessoa a partir da placa: é dado pessoal.' }
          ]
        }
      },
      { atores: [{ id: 'iris', lado: 'direita' }] },
      ['iris', 'Repara: dado pessoal está em quase tudo. Por isso o cuidado tem que virar hábito, não exceção.'],

      // ---------- Trecho 5 · O Vazamento muda de tática ----------
      { trecho: 'Trecho 5 · O Vazamento muda de tática', cena: 'escritorio', atores: [{ id: 'vazamento', lado: 'esquerda', escala: .55 }], tela: PLANILHA },
      ['narrador', 'Meio-dia. Fome. Você levanta para almoçar com a planilha aberta na tela.'],
      ['vazamento', 'Glub… tela aberta… ninguém olhando…'],
      { atores: [{ id: 'vazamento', lado: 'esquerda', escala: .55 }, { id: 'iris', lado: 'direita' }] },
      ['iris', 'Tela aberta é porta aberta. E agora?'],

      // ---------- Decisão 2 (rápida) ----------
      {
        decisao: {
          pergunta: 'Decida rápido: o que você faz?', tempo: 10, padrao: 1,
          opcoes: [
            {
              texto: 'Deixar aberta, volto em 5 minutos',
              passos: [
                { trecho: 'Trecho 6A · Cinco minutos', tela: { tipo: 'aviso', cor: 'vermelho', icone: '📸', titulo: 'Clique!', texto: 'Um visitante passou pela mesa e fotografou a tela com o celular.' }, atores: [{ id: 'vazamento', lado: 'esquerda', escala: .7 }] },
                ['vazamento', 'Glub glub!'],
                { atores: [{ id: 'vazamento', lado: 'esquerda', escala: .7 }, { id: 'iris', lado: 'direita' }] },
                ['iris', 'Cinco minutos bastam. Uma foto, e os dados saem andando pela porta.'],
                ['iris', 'Levantou? Bloqueou. Windows mais L. No Mac, Control, Command e Q.']
              ]
            },
            {
              texto: 'Bloquear a tela antes de sair (Windows + L)', boa: true,
              passos: [
                { trecho: 'Trecho 6B · Tela trancada', tela: { tipo: 'aviso', cor: 'verde', icone: '🔒', titulo: 'Tela bloqueada', texto: 'Windows + L · no Mac: Control + Command + Q' }, atores: [{ id: 'vazamento', pose: 'evaporando', lado: 'esquerda', escala: .55 }, { id: 'iris', lado: 'direita' }] },
                ['narrador', 'Um toque e a tela trava. O Vazamento escorrega de volta.'],
                ['iris', 'Isso! Virou reflexo, virou proteção.'],
                ['iris', 'Vale também pro papel: documento com dado pessoal não fica largado na impressora.'],
                { selo: 'Tela Trancada' }
              ]
            }
          ]
        }
      },

      // ---------- Trecho 7 · E se eu errar? ----------
      {
        trecho: 'Trecho 7 · E se eu errar?', cena: 'central', atores: [{ id: 'iris', lado: 'esquerda' }],
        tela: { tipo: 'telao', titulo: 'Mandei dados pra pessoa errada. E agora?', itens: ['Avise o TI e o encarregado de dados (DPO) imediatamente.', 'Peça ao destinatário que apague o arquivo e confirme, sem reencaminhar.', 'Não apague seus registros: eles mostram o que saiu e para quem.', 'Anote o que foi enviado, para quem e quando.'] }
      },
      ['iris', 'Agora, a parte mais importante. Errar acontece: um anexo trocado, um destinatário parecido.'],
      { revelar: 1 },
      ['iris', 'Primeiro: avise o TI e o encarregado de dados. Toda empresa tem alguém responsável por isso.'],
      { revelar: 2 },
      ['iris', 'Segundo: peça a quem recebeu que apague, e confirme que apagou.'],
      { revelar: 3 },
      ['iris', 'Terceiro: não apague seus registros. Eles mostram exatamente o que saiu.'],
      { revelar: 4 },
      ['iris', 'Quarto: anote o que foi, pra quem e quando. A [EMPRESA] tem prazos legais curtos para avaliar e comunicar incidentes.'],
      { tela: { tipo: 'canal' } },
      ['iris', 'Esconder o erro transforma um tropeço num problema sério. Avisar protege as pessoas daquela planilha.'],

      // ---------- Trecho 8 · Desfecho ----------
      { trecho: 'Trecho 8 · Desfecho', cena: 'escritorio', tela: null, atores: [{ id: 'vazamento', lado: 'centro', escala: .6 }] },
      ['narrador', 'Sem e-mail pessoal, sem grupo, sem tela aberta… o Vazamento não tem por onde escorrer.'],
      { atores: [{ id: 'vazamento', pose: 'evaporando', lado: 'centro', escala: .6 }] },
      ['vazamento', 'Glub… secou…'],
      { atores: [{ id: 'iris', lado: 'meio-direita' }] },
      ['iris', 'Dado de alguém é confiança de alguém. E você cuidou bem dela.'],
      { cena: 'central', atores: [{ id: 'iris', lado: 'esquerda' }] },
      ['iris', 'Terceira insígnia conquistada, recruta.'],
      { insignia: true },
      { cena: 'corredor', atores: [{ id: 'camaleao', lado: 'centro' }] },
      ['camaleao', 'Oi! Sou do suporte de TI… ou do RH? Ou da diretoria? Depende de quem você quer ouvir.'],
      ['narrador', 'Próxima missão: O Camaleão.'],
      { atores: [] }
    ],

    quiz: [
      {
        pergunta: 'Qual destes é um dado pessoal sensível?',
        opcoes: ['O e-mail corporativo de um colega', 'A informação de saúde de um colega', 'O faturamento da empresa'], certa: 1,
        explica: 'Saúde, biometria, religião e origem racial, entre outros, são dados sensíveis: pedem cuidado redobrado.'
      },
      {
        pergunta: 'Um colega pede a planilha de clientes no e-mail pessoal dele. O que fazer?',
        opcoes: ['Enviar, é colega', 'Compartilhar pelo canal oficial, só com quem precisa e só o necessário', 'Mandar no grupo do time'], certa: 1,
        explica: 'Fora do canal oficial, a empresa não protege nem consegue apagar. E só vai o que a tarefa exige.'
      },
      {
        pergunta: 'Você vai sair da mesa por 5 minutos com dados de clientes na tela.',
        opcoes: ['Deixo como está, é rápido', 'Bloqueio a tela (Windows + L)', 'Desligo só o monitor'], certa: 1,
        explica: 'Desligar o monitor não trava nada. Bloquear a tela trava de verdade.'
      },
      {
        pergunta: 'O que diz o princípio da necessidade, da LGPD?',
        opcoes: ['Coletar o máximo de dados possível', 'Usar só os dados necessários para a finalidade', 'Guardar os dados para sempre'], certa: 1,
        explica: 'Quanto menos dado circula, menos dado pode vazar.'
      },
      {
        pergunta: 'Você enviou dados de clientes para a pessoa errada. Qual a primeira coisa a fazer?',
        opcoes: ['Torcer para a pessoa não abrir', 'Avisar o TI e o encarregado de dados imediatamente', 'Apagar o e-mail enviado'], certa: 1,
        explica: 'A empresa tem prazos curtos para agir. Avisar rápido protege as pessoas cujos dados saíram.'
      }
    ]
  });
})();
