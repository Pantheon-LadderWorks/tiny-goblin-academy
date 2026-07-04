import numpy as np
from PIL import Image

def check_soldier_grid():
    img = Image.open('assets/academy/creatures/soldier/tga-topdown-soldier-enemy-cleaned-v0.1.png')
    arr = np.array(img)
    mask = arr[:, :, 3] > 0
    
    # Grid: 16 columns of 176, 8 rows of 192
    for r in range(8):
        for c in range(16):
            y1, y2 = r*192, (r+1)*192
            x1, x2 = c*176, (c+1)*176
            
            cell_mask = mask[y1:y2, x1:x2]
            
            # Check if there are any pixels touching the left or right boundaries
            # If so, the grid might be cutting through the sprite
            left_touch = np.any(cell_mask[:, 0:2])
            right_touch = np.any(cell_mask[:, -2:])
            
            if left_touch or right_touch:
                print(f"Row {r}, Col {c} touches boundary! Left: {left_touch}, Right: {right_touch}")

check_soldier_grid()
