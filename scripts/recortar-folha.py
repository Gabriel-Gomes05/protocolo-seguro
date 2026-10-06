"""Recorta as 4 vistas de uma folha de modelo com fundo branco em sprites WebP transparentes."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

folha, destino, nomes = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
rgb = np.asarray(Image.open(folha).convert('RGB')).astype(np.float32)
claro = rgb.min(axis=2)

# fundo = pixels quase brancos ligados à borda (o branco dentro do contorno, como olhos e lente, fica)
quase_branco = claro >= 228
rot, _ = ndimage.label(quase_branco)
borda = np.unique(np.concatenate([rot[0], rot[-1], rot[:, 0], rot[:, -1]]))
fundo = np.isin(rot, borda[borda > 0])
# buracos de fundo presos entre braço, cabelo e lupa: brancos puros e grandes (lente e olhos são azulados ou pequenos)
tam = ndimage.sum(np.ones_like(claro), rot, index=np.arange(rot.max() + 1))
media = ndimage.mean(claro, rot, index=np.arange(rot.max() + 1))
buracos = np.where((tam > 150) & (media > 244))[0]
fundo |= np.isin(rot, buracos[buracos > 0])

# alfa suave na faixa de 2 px junto ao fundo, tirando a franja branca (desmultiplica do branco)
perto = ndimage.binary_dilation(fundo, iterations=2) & ~fundo
alfa = np.where(fundo, 0.0, 1.0)
a_borda = np.clip((252 - claro) / (252 - 110), 0, 1)
alfa[perto] = a_borda[perto]
a = np.maximum(alfa, 1e-3)[..., None]
cor = np.clip((rgb - 255 * (1 - a)) / a, 0, 255)
rgba = np.dstack([cor, alfa * 255]).astype(np.uint8)

# separa as figuras pelas colunas vazias
colunas = (alfa > .1).sum(axis=0) > 0
rotc, n = ndimage.label(colunas)
faixas = sorted([np.where(rotc == k)[0] for k in range(1, n + 1)], key=len, reverse=True)[:len(nomes)]
faixas.sort(key=lambda f: f[0])
for nome, f in zip(nomes, faixas):
    img = Image.fromarray(rgba[:, f[0]:f[-1] + 1])
    img = img.crop(img.getbbox())
    img.save(f'{destino}/{nome}.webp', quality=92)
    print(nome, img.size)
