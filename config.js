/* Configuração white label do Esquadrão Sentinela.
   Tudo o que identifica o cliente entra por aqui, nunca na arte nem no áudio.
   Para demonstrações, dá para sobrescrever pela URL: ?empresa=Nome&dominio=nome.com.br&cor=%23c0392b */
window.SENTINELA_CONFIG = {
  empresa: 'Nexa',                 // aparece no lugar de [EMPRESA]
  dominio: 'nexa.com.br',          // aparece no lugar de [domínio oficial]
  cor: '#2f9da3',                  // cor de destaque do cliente
  logo: '',                        // caminho de uma imagem; vazio usa a inicial do nome

  // Canal de reporte do cliente ("Central Sentinela" no universo da série)
  canal: {
    nome: 'Central Sentinela',
    como: 'Botão “Reportar phishing” no Outlook',
    email: 'seguranca@nexa.com.br',
    telefone: 'Ramal 4040'
  },

  // Cenários aprovados: quando houver arte, aponte aqui e ela substitui o desenho provisório.
  // Ex.: escritorio: 'assets/cenarios/escritorio.jpg'
  cenarios: {},

  // Vozes gravadas: pasta com um arquivo por fala (ids em "?roteiro" no player).
  // Vazio usa a voz do navegador como provisória.
  vozes: {}
};
