import numpy as np
from PIL import Image

def find_row_grid_lines(path, row_idx, ch):
    img = Image.open(path).convert('RGB')
    arr = np.array(img).astype(np.float32) / 255.0
    h, w, _ = arr.shape
    
    y1, y2 = row_idx * ch, (row_idx + 1) * ch
    row_arr = arr[y1:y2, :, :]
    
    max_vals = np.max(row_arr, axis=(0, 2))
    dark_cols = np.where(max_vals < 0.4)[0]
    
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
    
    print(f"Row {row_idx} detected {len(lines)} vertical dark lines:")
    for l in lines:
        print(f"  Col {l[0]} to {l[1]} (width {l[1]-l[0]+1})")
        
    if len(lines) > 1:
        widths = [lines[i+1][0] - lines[i][1] - 1 for i in range(len(lines)-1)]
        print(f"Cell widths between lines: {widths}")

find_row_grid_lines('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png', 0, 192)
find_row_grid_lines('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png', 4, 192)
