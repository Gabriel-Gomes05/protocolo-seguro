# Prompts · Chave-Mestra (poses e expressões)

Para gerar no Gemini (Nano Banana). **Sempre anexe a folha de modelo** `referencias/personagens/chave_mestra_folha_modelo_v1.jpg` como imagem de referência. Gere uma folha por vez e salve em `referencias/personagens/` com o nome indicado. Depois, `assets/img/chave_<pose>.png` é recortado a partir delas.

Regras para o recorte funcionar: fundo branco liso, poses separadas com bastante espaço entre elas (nada encostando), corpo inteiro sem cortar pés nem capa, sem sombra no chão, sem texto.

## 1. Folha de poses → `chave_mestra_poses_v1.jpg`

```
Use exatamente o personagem da imagem anexa, sem mudar nada no visual: mesmo rosto, barba escura cheia, cabelo castanho curto, óculos retangulares de aro fino, traje azul com linhas claras, cadeado prateado no peito, capa azul-marinho, escudo redondo com cadeado no braço esquerdo e token de pulso com tela verde no braço direito.

Crie uma folha de poses de corpo inteiro, no mesmo estilo: ilustração 2D flat, contorno limpo, cores chapadas, sombreamento simples.

6 poses lado a lado, em uma única fileira, todas na mesma escala e na mesma altura, com bastante espaço vazio entre elas (nenhuma encostando na outra):
1. Apontando para a direita com o braço direito esticado, olhando para onde aponta, expressão confiante.
2. Braços cruzados no peito, sorriso de canto, confiante.
3. Erguendo o escudo-cadeado na frente do corpo, em posição de defesa, expressão firme.
4. Olhando para o token do pulso, com a outra mão indicando a tela verde, como quem explica.
5. Comemorando com o punho fechado para cima, sorriso aberto.
6. Mão no queixo, sério e pensativo.

Fundo branco liso. Corpo inteiro visível, sem cortar pés nem capa. Sem sombra no chão, sem texto, sem números, sem letras, sem marca d'água.
```

## 2. Folha de expressões → `chave_mestra_expressoes_v1.jpg`

```
Use exatamente o personagem da imagem anexa (mesmo rosto, barba, cabelo, óculos retangulares de aro fino e gola do traje azul).

Crie uma folha de expressões no mesmo estilo (ilustração 2D flat, contorno limpo, cores chapadas): só cabeça e ombros, de frente, todas na mesma escala, em duas fileiras de 4, com espaço entre elas:
1. Confiante, sorriso fechado.
2. Falando, boca aberta, simpático.
3. Sério, boca reta.
4. Preocupado, sobrancelhas levantadas.
5. Surpreso, boca em "o".
6. Piscando um olho, sorriso de canto.
7. Bravo, determinado, sobrancelhas franzidas.
8. Rindo, olhos fechados de alegria.

Fundo branco liso. Sem texto, sem números, sem marca d'água.
```

## 3. Bocas para a fala (opcional) → `chave_mestra_bocas_v1.jpg`

Para a boca mexer junto com o áudio (lip-sync simples).

```
Use exatamente o personagem da imagem anexa. Mesmo rosto, mesmo ângulo de frente, mesma escala, só cabeça e ombros, no mesmo estilo (ilustração 2D flat, contorno limpo).

3 versões lado a lado, idênticas em tudo (posição da cabeça, olhos, óculos, barba), mudando só a boca:
1. Boca fechada, sorriso leve.
2. Boca entreaberta.
3. Boca bem aberta, como quem fala uma vogal "a".

Fundo branco liso, bastante espaço entre as três. Sem texto, sem marca d'água.
```

## Onde cada pose entra na Missão 2

| Pose | Momentos |
| --- | --- |
| Apontando | Trecho 1 (apresentação), trecho 3 (as 4 regras), trecho 7 (os 4 passos) |
| Braços cruzados | "Vale sim. Jogada de mestre" (2C), fim do desafio |
| Escudo erguido | Quando a Força Bruta ataca; "a segunda trava segurou a porta" (6B) |
| Olhando o token | Regra 4 (verificação em duas etapas), virada do celular |
| Comemorando | Insígnia no desfecho |
| Pensativo | "Acontece com muita gente…" (2A, 2B, 6A) |
