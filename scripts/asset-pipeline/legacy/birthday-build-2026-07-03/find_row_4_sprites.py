import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects

def find_sprites_row(path, r):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    mask = arr[:, :, 3] > 0
    labeled_array, num_features = label(mask)
    objects = find_objects(labeled_array)
    
    sprites = []
    for obj in objects:
        y_slice, x_slice = obj
        if y_slice.start >= r*192 and y_slice.start < (r+1)*192:
            sprites.append((x_slice.start, y_slice.start, x_slice.stop - x_slice.start, y_slice.stop - y_slice.start))
            
    sprites.sort(key=lambda x: x[0])
    print(f"Row {r} has {len(sprites)} sprites:")
    for i, s in enumerate(sprites):
        print(f"  Sprite {i}: x={s[0]}, w={s[2]}")

find_sprites_row('assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png', 4)
find_sprites_row('assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png', 6)
