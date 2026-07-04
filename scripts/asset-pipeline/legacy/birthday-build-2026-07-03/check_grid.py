import numpy as np
from PIL import Image

def analyze_grid(path):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    h, w, _ = arr.shape
    
    # We expect 1px dark grid lines forming a checkerboard.
    # To find vertical grid lines, we can look for columns that are entirely dark/gray
    # Wait, the checkerboard background itself has lines.
    # Let's just sum the alpha or color diffs in each column.
    # Actually, grid lines in a top-down sheet are often just drawn between cells.
    # Let's see if there are columns where the color is completely uniform across the entire height.
    
    col_diffs = np.max(arr[:, :, :3], axis=0) - np.min(arr[:, :, :3], axis=0)
    col_max_diff = np.max(col_diffs, axis=1) # max color variation in each column
    
    # Grid lines will have 0 variation
    grid_cols = np.where(col_max_diff < 0.05)[0]
    
    # Group contiguous grid columns
    lines = []
    if len(grid_cols) > 0:
        start = grid_cols[0]
        prev = grid_cols[0]
        for c in grid_cols[1:]:
            if c == prev + 1:
                prev = c
            else:
                lines.append((start, prev))
                start = c
                prev = c
        lines.append((start, prev))
    
    print(f"Detected vertical lines: {lines}")
    
    widths = []
    for i in range(len(lines)-1):
        # distance between end of one line and start of next
        widths.append(lines[i+1][0] - lines[i][1] - 1)
        
    print(f"Cell widths between lines: {widths}")

analyze_grid('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png')
