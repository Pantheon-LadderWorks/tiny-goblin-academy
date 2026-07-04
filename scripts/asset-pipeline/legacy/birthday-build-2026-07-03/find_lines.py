import numpy as np
from PIL import Image

def find_grid_lines(path):
    img = Image.open(path).convert('RGB')
    arr = np.array(img).astype(np.float32) / 255.0
    h, w, _ = arr.shape
    
    # Grid lines are dark. Let's find columns where the MAXIMUM value is less than 0.5
    # meaning the entire column is dark (no bright checkerboard, no bright slime)
    max_vals = np.max(arr, axis=(0, 2)) # max over height and color channels
    
    dark_cols = np.where(max_vals < 0.4)[0]
    
    # Group contiguous dark columns
    lines = []
    if len(dark_cols) > 0:
        start = dark_cols[0]
        prev = dark_cols[0]
        for c in dark_cols[1:]:
            if c == prev + 1:
                prev = c
            else:
                lines.append((start, prev))
                start = c
                prev = c
        lines.append((start, prev))
    
    print(f"Slime width: {w}, height: {h}")
    print(f"Detected {len(lines)} vertical dark lines:")
    for l in lines:
        print(f"  Col {l[0]} to {l[1]} (width {l[1]-l[0]+1})")

find_grid_lines('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png')
