import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label, find_objects, binary_dilation

def detect_sprites(path, grid_h):
    print(f"--- Analyzing {path} ---")
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    mask = arr[:, :, 3] > 0
    
    struct = np.ones((15, 15), dtype=bool)
    dilated_mask = binary_dilation(mask, structure=struct, iterations=2)
    
    labeled_array, num_features = label(dilated_mask)
    objects = find_objects(labeled_array)
    
    debug_img = img.copy()
    draw = ImageDraw.Draw(debug_img)
    
    rows = {}
    for obj in objects:
        y_slice, x_slice = obj
        
        region_mask = mask[y_slice, x_slice]
        if not np.any(region_mask):
            continue
            
        true_y, true_x = np.where(region_mask)
        min_y = y_slice.start + np.min(true_y)
        max_y = y_slice.start + np.max(true_y)
        min_x = x_slice.start + np.min(true_x)
        max_x = x_slice.start + np.max(true_x)
        
        r = int(min_y // grid_h)
        if r not in rows:
            rows[r] = []
            
        rows[r].append((min_x, min_y, max_x - min_x + 1, max_y - min_y + 1))
        draw.rectangle([min_x, min_y, max_x, max_y], outline="lime", width=5)
        
    debug_img.save(f"{path}-debug.png")
    
    for r in sorted(rows.keys()):
        rows[r].sort(key=lambda x: x[0])
        print(f"Row {r} has {len(rows[r])} sprites")
    
    return rows

detect_sprites('assets/academy/creatures/slime/tga-topdown-slime-v2-idle-move-cleaned.png', 2528/6)
detect_sprites('assets/academy/creatures/slime/tga-topdown-slime-v2-action-cleaned.png', 2304/5)
