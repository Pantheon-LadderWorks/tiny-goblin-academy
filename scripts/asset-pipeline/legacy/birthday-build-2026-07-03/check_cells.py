from PIL import Image
import os

img = Image.open('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png')

os.makedirs('debug_cells', exist_ok=True)
cw, ch = 172, 192

for c in range(5):
    cell = img.crop((c*cw, 0, (c+1)*cw, ch))
    cell.save(f'debug_cells/cell_{c}.png')
