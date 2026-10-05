# Esquadrão Sentinela

Série de treinamentos interativos de segurança da informação, em português, com heróis, vilões e decisões que o próprio colaborador toma. Cada módulo dura de 6 a 8 minutos e termina com um quiz registrado no LMS.

Abra `index.html` (o QG) em um navegador. Não precisa de build nem de instalação.

## Módulos

| # | Módulo | Herói × vilão | Tema | Arquivo |
|---|--------|---------------|------|---------|
| 1 | A Isca | Lupa × Isca | Phishing por e-mail, SMS e WhatsApp; reportar | `modulo-1-isca.html` |
| 2 | A Força Bruta | Trava × Força Bruta | Frase-senha, não reutilizar, gerenciador, segundo fator | `modulo-2-forca-bruta.html` |
| 3 | O Vazamento | Íris × Vazamento | LGPD no dia a dia | `modulo-3-vazamento.html` |
| 4 | O Camaleão | Eco × Camaleão | Engenharia social | `modulo-4-camaleao.html` |
| 5 | Esquadrão Reunido (bônus) | Todos | Revisão e certificado | ainda não produzido |

O roteiro do módulo 1 segue a bíblia do projeto (versão de 5/10/2026). Os módulos 2 a 4 são rascunhos na mesma estrutura e precisam de revisão de roteiro.

Todo módulo segue a estrutura padrão: abertura, decisão ramificada, lição do herói, desafio interativo, virada com decisão rápida (10 s), "e se eu errar?", desfecho com insígnia e quiz de 5 perguntas (aprovação com 4).

## Estrutura

```
index.html                 QG: lista de missões e insígnias conquistadas
modulo-N-*.html            uma página por módulo (é o que vai para o LMS)
config.js                  white label: empresa, domínio, cor, logo, canal de reporte
modulos/NN-*.js            roteiro de cada módulo (falas, decisões, desafio, quiz)
player/player.js           motor: cenas, legendas, vozes, decisões, desafios, quiz, resultado
player/elenco.js           personagens e cenários provisórios
player/scorm.js            ponte SCORM 1.2 (não faz nada fora de um LMS)
player/player.css, qg.css  visual
assets/personagens/        sprites recortados das folhas aprovadas (Lupa e Isca)
assets/referencia/         folhas de modelo originais
scorm/empacotar.ps1        gera um .zip SCORM 1.2 por módulo em dist/
legado/                    versão anterior ("Um Clique")
```

## White label

Tudo o que identifica o cliente fica em `config.js` e entra pelo player, nunca pela arte ou pelo áudio. `[EMPRESA]`, `[empresa]` e `[domínio oficial]` nos roteiros são trocados automaticamente.

Para demonstrações, dá para trocar pela URL, sem mexer no arquivo: `index.html?empresa=Acme&dominio=acme.com.br&cor=%23c0392b`.

## Arte, vozes e cenários

- **Personagens:** Lupa e Isca usam as folhas aprovadas. Trava, Íris, Eco, Força Bruta, Vazamento e Camaleão aparecem como figuras provisórias (marcadas "arte provisória") até as folhas deles serem geradas. Para trocar, salve as poses em `assets/personagens/<id>-<pose>.webp` e marque o personagem com `arte: true` em `player/elenco.js`.
- **Cenários:** são desenhados em CSS. Para usar a arte aprovada, aponte em `config.js → cenarios` (ex.: `escritorio: 'assets/cenarios/escritorio.jpg'`).
- **Vozes:** sem gravações, o player usa a voz pt-BR do navegador. Para usar as gravações do ElevenLabs, abra `modulo-1-isca.html?roteiro`, que lista cada fala com seu id (f001, f002…). Salve cada áudio como `<id>.mp3` numa pasta e aponte essa pasta em `config.js → vozes` (ex.: `isca: 'assets/vozes/isca/'`).

## SCORM / LMS

```powershell
powershell -ExecutionPolicy Bypass -File scorm\empacotar.ps1
```

Gera `dist/sentinela-<módulo>-scorm12.zip`. No fim do quiz o player envia ao LMS a nota (0 a 100), o status (`passed` ou `failed`) e o tempo de sessão. Ajuste `config.js` para o cliente antes de empacotar.

## Controles

`Espaço` pausa · `Enter` ou clique avança a fala · `A`/`B`/`C` respondem · `M` liga/desliga efeitos · `V` liga/desliga narração.
