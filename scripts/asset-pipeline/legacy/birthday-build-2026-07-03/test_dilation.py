import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label, find_objects, binary_dilation

def detect_sprites_with_dilation(path):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    mask = arr[:, :, 3] > 0
    
    # Dilate the mask to merge disconnected pieces like sweat drops/halos
    # We want to merge pieces that are within ~30 pixels of each other
    struct = np.ones((15, 15), dtype=bool)
    dilated_mask = binary_dilation(mask, structure=struct, iterations=2)
    
    labeled_array, num_features = label(dilated_mask)
    objects = find_objects(labeled_array)
    
    print(f"Found {num_features} sprites after dilation.")
    
    # Draw boxes for debug
    debug_img = img.copy()
    draw = ImageDraw.Draw(debug_img)
    
    rows = [[] for _ in range(8)]
    for obj in objects:
        y_slice, x_slice = obj
        
        # We need the ORIGINAL bounding box of the non-dilated mask inside this region!
        # The dilated box is too big.
        region_mask = mask[y_slice, x_slice]
        if not np.any(region_mask):
            continue
            
        true_y, true_x = np.where(region_mask)
        min_y = y_slice.start + np.min(true_y)
        max_y = y_slice.start + np.max(true_y)
        min_x = x_slice.start + np.min(true_x)
        max_x = x_slice.start + np.max(true_x)
        
        # Group by row (approximate)
        r = min_y // 192
        if r < 8:
            rows[r].append((min_x, min_y, max_x - min_x, max_y - min_y))
            draw.rectangle([min_x, min_y, max_x, max_y], outline="lime", width=2)
            
    debug_img.save("slime-sprite-detection-debug.png")
    
    for r in range(8):
        rows[r].sort(key=lambda x: x[0])
        print(f"Row {r} has {len(rows[r])} sprites:")
        for i, s in enumerate(rows[r]):
            print(f"  Sprite {i}: x={s[0]}, w={s[2]}")

detect_sprites_with_dilation('assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png')
