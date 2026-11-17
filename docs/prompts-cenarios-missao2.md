# Prompts · Cenários da Missão 2

Para gerar no Gemini (Nano Banana). Gere **em 16:9, horizontal, o maior tamanho possível** (ideal 1920×1080 ou mais).

Anexe como referência de estilo o cenário atual correspondente (`assets/img/bg_escritorio.jpg`, `bg_central.jpg`, `bg_sala.jpg`) e, na sala escura, também a folha da vilã (`referencias/viloes/forca_bruta_folha_modelo_v1.jpg`).

Salve em `referencias/cenarios/` com o nome indicado. Os cenários da Missão 1 continuam como estão.

Regras para todos (o player desenha por cima monitor, herói, legendas e marca do cliente):
- **Sem pessoas, sem texto, sem letras, sem números, sem logotipos, sem marca d'água.** Nome e logo do cliente entram pelo player (white label).
- Faixa de baixo (os 15% inferiores) sem detalhes importantes: ali ficam as legendas.
- Mesmo estilo da série: ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples.

## 1. Escritório → `cenario_escritorio_m2_v1.jpg`

```
Cenário de fundo para animação, formato 16:9 horizontal, sem nenhuma pessoa. Estilo ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples, mesmo estilo da imagem de referência anexa.

Um escritório corporativo moderno e aconchegante, de manhã, com luz natural entrando por uma janela grande com vista para a cidade.

Composição obrigatória:
- Terço esquerdo da imagem: espaço livre de chão até o teto, com a janela ao fundo e uma planta alta, sem móveis na frente (ali um personagem vai ficar em pé).
- Metade direita: uma mesa de trabalho com um monitor grande virado de frente para quem olha, centralizado na metade direita, com a tela totalmente lisa, cinza bem claro e sem nada desenhado (o conteúdo da tela será colocado depois). Teclado, mouse, uma caneca de café e alguns papéis na mesa.
- Detalhes de fundo discretos: estante com pastas, quadro de avisos sem texto, luminária, relógio de parede marcando 9 horas.
- Os 15% de baixo com pouca informação (tampo da mesa ou chão liso).

Paleta clara e calma: azuis suaves, branco, madeira clara, toques de verde nas plantas.
Sem texto, sem letras, sem números, sem logotipos, sem marca d'água.
```

## 2. Central Sentinela → `cenario_central_m2_v1.jpg`

```
Cenário de fundo para animação, formato 16:9 horizontal, sem nenhuma pessoa. Estilo ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples, mesmo estilo da imagem de referência anexa.

A Central Sentinela: uma sala de comando de segurança digital, futurista mas acolhedora, iluminação azul e verde-água, painéis com gráficos abstratos (sem texto).

Composição obrigatória:
- Os 60% da esquerda: um telão grande e escuro na parede, quase vazio, com moldura iluminada (cartões e quadros serão colocados por cima dele depois). No centro do telão, um emblema discreto em linhas finas: um escudo com um buraco de fechadura (nada de lupa).
- Terço direito: piso livre e iluminado, com uma plataforma redonda e sutil no chão, sem móveis na frente (ali o herói vai ficar em pé, de corpo inteiro).
- Bancada de controle curva na parte de baixo, com teclados e luzes, mas os 15% inferiores com pouca informação.
- Detalhes: cadeados e chaves estilizados em hologramas pequenos nas laterais, cabos e luzes indicadoras.

Paleta: azul-marinho profundo, azul elétrico, verde-água e pontos dourados.
Sem texto, sem letras, sem números, sem logotipos, sem marca d'água.
```

## 2b. Central Sentinela, versão 2 → `cenario_central_m2_v2.jpg`

A v1 saiu como duas imagens lado a lado (com uma faixa branca no meio) e em baixa resolução. Esta versão pede uma sala única e mantém onde o player coloca as coisas: o herói em pé na plataforma (centro em ~77% da largura, pés a ~23% da base, altura ~64% do quadro), os cartões (regras, 4 passos, canal de reporte) sobre o telão da esquerda e a insígnia girando no centro. Anexe só `assets/img/bg_central.jpg` como referência de estilo (não anexe a v1, para o Gemini não repetir a divisão).

```
UMA ÚNICA ilustração contínua, formato 16:9 horizontal, em alta resolução. NÃO divida a imagem em painéis, quadros ou colunas; sem faixas ou bordas brancas; é um só ambiente visto de uma só câmera. Sem nenhuma pessoa.

Estilo: ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples, mesmo estilo da imagem de referência anexa.

Cena: a Central Sentinela, uma sala de comando de segurança digital, futurista e acolhedora, vista de frente, levemente de cima. Iluminação azul elétrico e verde-água, com pontos dourados.

Composição obrigatória (da esquerda para a direita):
- Da borda esquerda até 60% da largura: um telão enorme na parede do fundo, ocupando do alto até a metade da altura, tela escura e quase vazia, com moldura de luz azul. No centro do telão, um emblema discreto em linhas finas: um escudo com um buraco de fechadura (nada de lupa, nada de texto).
- De 62% até a borda direita: um nicho iluminado no mesmo ambiente (sem parede separando, sem porta), com uma plataforma redonda de holograma no chão, grande e bem visível, centralizada em 77% da largura e com o centro a 77% da altura (contando de cima). Um feixe de luz verde-água suave sobe da plataforma. Atrás dela, na parede, dois pequenos hologramas: um cadeado e uma chave. Espaço livre acima da plataforma até perto do teto: ali um herói vai ficar em pé, de corpo inteiro.
- Na frente, em toda a largura: uma bancada de controle curva e baixa, com teclados e luzes, que não cobre a plataforma.
- Os 15% de baixo com pouca informação (frente lisa da bancada).

Clima: vitória e confiança, como a sala de um esquadrão de heróis depois de uma missão cumprida.
Paleta: azul-marinho profundo, azul elétrico, verde-água, toques dourados.
Sem texto, sem letras, sem números, sem logotipos, sem marca d'água, sem pessoas.
```

## 3. Sala escura da Força Bruta → `cenario_sala_m2_v1.jpg`

```
Cenário de fundo para animação, formato 16:9 horizontal. Estilo ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples, mesmo estilo das imagens de referência anexas.

O covil da vilã Força Bruta: uma sala escura e ameaçadora, iluminada só pelo brilho de telas e por um feixe de luz entrando por uma porta entreaberta à esquerda.

Composição obrigatória:
- No centro, a silhueta escura de corpo inteiro da vilã da folha de modelo anexa: uma gigante feita de blocos de teclas de teclado, quase toda em sombra, só os olhos vermelhos brilhando. De frente para quem olha, imponente, ocupando do chão até perto do teto.
- À direita: uma mesa com um monitor grande virado de frente, tela preta totalmente lisa e vazia (o texto do ataque será colocado depois).
- No chão e nas paredes: teclas de teclado soltas espalhadas, pilhas de teclados velhos, cabos, várias telas pequenas desligadas ou com brilho vermelho abstrato (sem texto).
- Os 15% de baixo com pouca informação (chão escuro).

Paleta: preto azulado, verde-escuro, vermelho intenso só nos olhos e nos detalhes de luz.
Sem texto, sem letras, sem números, sem logotipos, sem marca d'água.
```

## Depois de gerar

Me mande as imagens. Eu comprimo para `assets/img/` (`bg_escritorio_m2.jpg`, `bg_central_m2.jpg`, `bg_sala_m2.jpg`), ligo só na Missão 2 e reposiciono por cima de cada uma:
- o portal de senha dentro do monitor do escritório;
- o herói no espaço livre;
- o terminal e os olhos vermelhos na sala escura;
- a câmera de cada cenário.
