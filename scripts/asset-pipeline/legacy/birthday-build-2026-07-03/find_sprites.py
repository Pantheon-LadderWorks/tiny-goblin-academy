import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects

def find_sprites(path):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    
    # We assume the image is already cleaned! So background is alpha=0
    mask = arr[:, :, 3] > 0
    
    # Find contiguous components
    labeled_array, num_features = label(mask)
    objects = find_objects(labeled_array)
    
    print(f"Found {num_features} sprites in {path}")
    
    # Let's see how many are in row 0
    row_0_sprites = []
    for obj in objects:
        y_slice, x_slice = obj
        if y_slice.start < 192: # inside row 0
            row_0_sprites.append((x_slice.start, y_slice.start, x_slice.stop - x_slice.start, y_slice.stop - y_slice.start))
            
    row_0_sprites.sort(key=lambda x: x[0])
    print(f"Row 0 has {len(row_0_sprites)} sprites:")
    for i, s in enumerate(row_0_sprites):
        print(f"  Sprite {i}: x={s[0]}, y={s[1]}, w={s[2]}, h={s[3]}")

find_sprites('assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png')
