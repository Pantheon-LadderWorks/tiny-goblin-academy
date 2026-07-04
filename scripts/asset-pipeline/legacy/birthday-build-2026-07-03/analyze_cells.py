import numpy as np
from PIL import Image

def analyze_cells(path):
    img = Image.open(path).convert('RGB')
    arr = np.array(img).astype(np.float32) / 255.0
    
    # Let's check the bounding box for the last cell (2531 to 2752)
    # in row 0 (0 to 192)
    cell = arr[0:192, 2531:2752]
    
    # Check max saturation in this cell
    diff = np.max(cell, axis=-1) - np.min(cell, axis=-1)
    max_diff = np.max(diff)
    print(f"Max saturation in last cell of row 0: {max_diff}")
    
    if max_diff > 0.1:
        print("There is a colored sprite here!")
        # Find where it is
        mask = diff > 0.1
        ys, xs = np.where(mask)
        print(f"Sprite pixels found from x={np.min(xs)} to {np.max(xs)}, y={np.min(ys)} to {np.max(ys)}")
    else:
        print("This cell is entirely grayscale (empty checkerboard).")
        
    # How about the cell before it? (2311 to 2531)
    cell2 = arr[0:192, 2311:2531]
    diff2 = np.max(cell2, axis=-1) - np.min(cell2, axis=-1)
    print(f"\nMax saturation in 2nd to last cell of row 0: {np.max(diff2)}")

analyze_cells('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png')
