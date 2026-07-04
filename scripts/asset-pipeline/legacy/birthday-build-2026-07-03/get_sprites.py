import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects
import json

def get_row_sprites(path):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    mask = arr[:, :, 3] > 0
    labeled_array, num_features = label(mask)
    objects = find_objects(labeled_array)
    
    rows = [[] for _ in range(8)]
    for obj in objects:
        y_slice, x_slice = obj
        r = y_slice.start // 192
        if r < 8:
            rows[r].append((x_slice.start, y_slice.start, x_slice.stop - x_slice.start, y_slice.stop - y_slice.start))
            
    for r in range(8):
        rows[r].sort(key=lambda x: x[0])
        print(f"Row {r} has {len(rows[r])} sprites.")
        
get_row_sprites('assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png')
get_row_sprites('assets/academy/creatures/soldier/tga-topdown-soldier-enemy-cleaned-v0.1.png')
