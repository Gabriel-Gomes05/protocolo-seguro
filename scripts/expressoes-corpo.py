"""Transplanta olhos e boca dos rostos de expressão para o sprite de corpo inteiro (vista de frente)."""
import os
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

PASTA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'personagens')
saida = sys.argv[1]
exprs = sys.argv[2].split(',')
cfg = dict(arg.split('=') for arg in sys.argv[3:])
f = lambda k, d: float(cfg.get(k, d))

corpo = Image.open(f'{PASTA}/lupa-frente.webp').convert('RGBA')
ESC = f('esc', .487)
# âncoras: (centro no rosto de expressão) → (centro no corpo); caixas no rosto de expressão
REGIOES = {
    'olhos': dict(de=(f('ox', 130), f('oy', 139)), para=(f('cx', 135.5), f('cy', 75)), caixa=(38, 92, 222, 182)),
    'boca': dict(de=(f('bx', 132), f('by', 194)), para=(f('mx', 136), f('my', 107)), caixa=(88, 168, 176, 226)),
}

def mascara(w, h, borda):
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).ellipse((borda, borda, w - borda, h - borda), fill=255)
    return m.filter(ImageFilter.GaussianBlur(borda / 2))

def pele_media(img, caixa):
    a = np.asarray(img.crop(caixa).convert('RGBA')).reshape(-1, 4).astype(float)
    a = a[a[:, 3] > 200][:, :3]
    pele = a[(a[:, 0] > 90) & (a[:, 0] < 200) & (a[:, 0] > a[:, 2] + 25)]
    return pele.mean(axis=0) if len(pele) else np.zeros(3)

for ex in exprs:
    rosto = Image.open(f'{PASTA}/lupa-rosto-{ex}.webp').convert('RGBA')
    out = corpo.copy()
    for nome, r in REGIOES.items():
        x0, y0, x1, y1 = r['caixa']
        patch = rosto.crop(r['caixa'])
        E = f('eesc', ESC) if nome == 'olhos' else ESC
        w, h = round((x1 - x0) * E), round((y1 - y0) * E)
        patch = patch.resize((w, h), Image.LANCZOS)
        # acerta o tom de pele do enxerto com o do corpo
        dx, dy = r['para'][0] - (r['de'][0] - x0) * E, r['para'][1] - (r['de'][1] - y0) * E
        alvo = pele_media(corpo, (int(dx), int(dy), int(dx) + w, int(dy) + h))
        orig = pele_media(patch, (0, 0, w, h))
        arr = np.asarray(patch).astype(float)
        arr[..., :3] = np.clip(arr[..., :3] + (alvo - orig) * .8, 0, 255)
        patch = Image.fromarray(arr.astype(np.uint8))
        m = mascara(w, h, max(2, min(w, h) * .14))
        m = Image.fromarray((np.asarray(m).astype(float) * np.asarray(patch)[..., 3] / 255).astype(np.uint8))
        out.paste(patch, (round(dx), round(dy)), m)
    out.save(f'{saida}/lupa-frente-{ex}.webp', quality=92)
print('ok')
