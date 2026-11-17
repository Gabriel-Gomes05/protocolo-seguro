# Prompts · Força Bruta (poses, expressões, bocas e efeitos)

Para gerar no Gemini (Nano Banana). **Sempre anexe as duas referências:**
1. `referencias/viloes/forca_bruta_soco_v1.png`: o visual que vale (rosto, cabelo grisalho curto, sem capacete).
2. `referencias/viloes/forca_bruta_folha_modelo_v1.jpg`: armadura de corpo inteiro, de frente, de lado e de costas.

Gere uma folha por vez e salve em `referencias/personagens/` com o nome indicado. Depois os recortes viram `assets/img/forca_<pose>.png`, `forca_cara_<nome>.png` e `forca_boca1..3.png`, no mesmo esquema da Chave-Mestra.

Para o recorte funcionar: fundo branco liso, poses bem separadas (nada encostando), corpo inteiro sem cortar os pés, sem sombra no chão e sem texto.

Descrição fixa (já está dentro de cada prompt; se o Gemini mudar o visual, cole de novo):
> Mulher adulta, rosto anguloso, cabelo grisalho bem curto, olhos vermelhos brilhantes, sem capacete. Armadura cinza-grafite feita de blocos de teclas de teclado, algumas teclas com brilho vermelho (ombros, peito, antebraços). Gola preta alta. Luvas enormes de blocos de teclas. Argola de metal na cintura com um molho de chaves antigas penduradas. Botas pretas de blocos.

---

## 1. Folha de poses A (ataque) → `forca_bruta_poses_a_v1.jpg`

```
Use exatamente a personagem das imagens anexas, sem mudar nada no visual: mulher adulta de rosto anguloso, cabelo grisalho bem curto, olhos vermelhos brilhantes, sem capacete; armadura cinza-grafite feita de blocos de teclas de teclado, com algumas teclas brilhando em vermelho nos ombros, no peito e nos antebraços; gola preta alta; luvas enormes de blocos de teclas; argola na cintura com um molho de chaves antigas; botas pretas de blocos.

Crie uma folha de poses de corpo inteiro no mesmo estilo: ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples.

4 poses lado a lado, em uma única fileira, todas na mesma escala e na mesma altura, com bastante espaço vazio entre elas (nenhuma encostando na outra):
1. Aquecendo: estalando os dedos das duas mãos na frente do peito, sorriso malicioso, olhando para a frente.
2. Soco: desferindo um soco para a esquerda com o braço direito esticado, corpo inclinado no golpe, dentes cerrados (como na imagem anexa, mas sem o escudo azul, sem faíscas e sem teclas voando).
3. Insistindo: os dois punhos erguidos acima da cabeça, prestes a martelar para baixo, expressão teimosa e obstinada.
4. Comemorando: braços abertos para cima, cabeça para trás, gargalhando de boca aberta.

Fundo branco liso. Corpo inteiro visível, sem cortar os pés. Sem sombra no chão, sem efeitos, sem texto, sem números, sem letras, sem marca d'água.
```

## 2. Folha de poses B (reação) → `forca_bruta_poses_b_v1.jpg`

```
Use exatamente a personagem das imagens anexas, sem mudar nada no visual: mulher adulta de rosto anguloso, cabelo grisalho bem curto, olhos vermelhos brilhantes, sem capacete; armadura cinza-grafite feita de blocos de teclas de teclado, com algumas teclas brilhando em vermelho; gola preta alta; luvas enormes de blocos de teclas; argola na cintura com um molho de chaves antigas; botas pretas de blocos.

Crie uma folha de poses de corpo inteiro no mesmo estilo: ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples.

4 poses lado a lado, em uma única fileira, todas na mesma escala e na mesma altura, com bastante espaço vazio entre elas:
1. Lendo: segurando com as duas mãos uma longa tira de papel contínuo que cai até o chão, coberta só por linhas cinza abstratas (nada legível), olhar guloso.
2. Reverência irônica: curvada para a frente, uma mão no peito e a outra aberta para o lado, sorriso de deboche.
3. Furiosa: punhos fechados ao lado do corpo, ombros erguidos, bocão aberto gritando, olhos vermelhos arregalados.
4. Ameaça: apontando para a direita com o braço esquerdo esticado, corpo meio virado como quem vai embora, olhar estreito e sorriso frio.

Fundo branco liso. Corpo inteiro visível, sem cortar os pés. Sem sombra no chão, sem texto, sem números, sem letras, sem marca d'água.
```

## 3. Folha de expressões → `forca_bruta_expressoes_v1.jpg`

```
Use exatamente a personagem das imagens anexas (mesmo rosto anguloso, cabelo grisalho bem curto, olhos vermelhos brilhantes, gola preta alta e ombreiras de blocos de teclas).

Crie uma folha de expressões no mesmo estilo (ilustração 2D flat, contorno limpo, cores chapadas): só cabeça e ombros, de frente, todas na mesma escala, em duas fileiras de 4, com espaço entre elas:
1. Sorriso malicioso, boca fechada.
2. Falando, boca aberta, debochada.
3. Concentrada, olhos estreitos, boca reta.
4. Gargalhando, boca bem aberta, olhos semicerrados.
5. Surpresa indignada, sobrancelhas no alto, boca em "o".
6. Furiosa, gritando, sobrancelhas franzidas.
7. Frustrada, bico de birra, olhar de lado.
8. Piscando um olho com deboche, sorriso de canto.

Fundo branco liso. Sem texto, sem números, sem marca d'água.
```

## 4. Bocas para a fala → `forca_bruta_bocas_v1.jpg`

Para a boca mexer junto com o áudio, como na Chave-Mestra.

```
Use exatamente a personagem das imagens anexas. Mesmo rosto, de frente, mesma escala, só cabeça e ombros, no mesmo estilo (ilustração 2D flat, contorno limpo).

3 versões lado a lado, idênticas em tudo (posição da cabeça, olhos vermelhos, cabelo, gola), mudando só a boca:
1. Boca fechada, sorriso de canto.
2. Boca entreaberta.
3. Boca bem aberta, como quem fala uma vogal "a".

Fundo branco liso, bastante espaço entre as três. Sem texto, sem marca d'água.
```

## 5. Efeitos soltos (opcional) → `forca_bruta_efeitos_v1.jpg`

Peças separadas para animar por cima das falas com impacto (`impacto: true`): teclas voando no soco e rachaduras quando o acesso é negado.

```
No mesmo estilo das imagens anexas (ilustração 2D flat, contorno limpo, cores chapadas), crie uma folha de elementos soltos, bem espaçados, sem personagem:
1. Seis teclas de teclado cinza-grafite soltas, em ângulos diferentes, sem letras.
2. Duas teclas com brilho vermelho, sem letras.
3. Uma explosão de impacto laranja e vermelha, em forma de estrela irregular.
4. Um punhado de faíscas laranja pequenas.
5. Uma rachadura escura em forma de teia, para colocar sobre uma tela.
6. Uma chave antiga de metal cinza, igual às da cintura da personagem.

Fundo branco liso. Sem texto, sem letras, sem números, sem marca d'água.
```

## 6. Sala escura sem a vilã → `cenario_sala_m2_vazia_v1.jpg`

O fundo atual (`bg_sala_m2.jpg`) já traz a silhueta da Força Bruta desenhada. Para ela entrar como recorte animado, a sala precisa estar vazia. Anexe `referencias/cenarios/cenario_sala_m2_v1.jpg`.

```
Recrie exatamente a imagem anexa, com o mesmo enquadramento, a mesma luz, as mesmas telas vermelhas, os mesmos teclados no chão, a mesma porta entreaberta à esquerda e a mesma mesa com o monitor preto à direita, mas sem a figura gigante no centro: ali fica só a parede e o chão da sala, com algumas teclas soltas no piso.

Formato 16:9 horizontal, mesmo estilo. Sem pessoas, sem texto, sem letras, sem números, sem marca d'água.
```

---

## Onde cada pose entra na Missão 2

| Pose | Fala |
| --- | --- |
| Aquecendo | "Mais um recruta criando senha… Vai, me dá um 123456." (f1) |
| Lendo | "Esse padrão está no topo da minha lista." (2A) · "Lista de vazamento, minha leitura favorita." (2B) |
| Soco | "Achei! Bom dia, sistema novo da empresa." (2A) |
| Comemorando | "E-mail pessoal… entrei. Sistema… entrei também!" (2B) |
| Furiosa | "Quatro palavras?! … Isso não vale!" (2C) · "Negado?! … Volta tudo pro começo da lista!" (6B) |
| Insistindo | "O problema é essa tal de segunda etapa… Então eu insisto." (f5) |
| Reverência irônica | "Obrigada pela ajuda! Entrei pela porta da frente…" (6A) |
| Ameaça | "Isso não acaba aqui! Um dia alguém vai repetir uma senha…" (f8) |

| Expressão | Uso |
| --- | --- |
| Malicioso, debochada, piscando | falas de provocação (f1, 6A) |
| Concentrada | lendo a lista (2A, 2B) |
| Gargalhando | quando entra (2A, 2B, 6A) |
| Surpresa indignada, furiosa, frustrada | quando a senha ou a segunda etapa barram (2C, 6B, f8) |
