import numpy as np
from PIL import Image

def analyze_sheet(path):
    print(f"\nAnalyzing: {path}")
    img = Image.open(path).convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    h, w, _ = arr.shape
    print(f"Image dimensions: {w}x{h}")
    
    # Let's assume a 16 column layout.
    cols = 16
    cell_w = w // cols
    
    # We don't know the exact rows. Let's find horizontal grid lines.
    # The grid lines are dark. Let's find rows in the image that are completely solid dark gray.
    # Let's take the variance of the RGB channels across each row.
    # If the variance is very low, it's a solid line.
    rgb = arr[..., :3]
    row_variance = np.var(rgb, axis=(1,2))
    
    # Find all rows with near-zero variance
    solid_lines = np.where(row_variance < 0.001)[0]
    
    # The image also has a checkerboard, which has variance.
    # The grid line itself is a solid dark color.
    # Let's just assume the cells are perfectly square, as is typical for RPG maker style sprites.
    # Let's test if cell_w divides height perfectly.
    rows = h // cell_w
    if h % cell_w == 0:
        print(f"Assuming square cells: {cell_w}x{cell_w}. Rows = {rows}")
        cell_h = cell_w
    else:
        # Let's guess 8 rows for knight? Or maybe 6 rows? Let's just print factors of h.
        factors = [i for i in range(1, 20) if h % i == 0]
        print(f"Cell width is {cell_w}. Image height {h}. Divisible by: {factors}")
        # Just use row detection from grid lines if possible
        # Actually let's just look at the empty vs non-empty cells assuming cell_w x cell_w
        cell_h = cell_w
        
    print(f"Grid Layout: {cols} columns x {rows} rows (assuming square {cell_w}x{cell_h} cells)")
    
    # Background color is checkerboard. Let's find the median color or just use a difference from typical background.
    # An empty cell will have the same variance as a purely checkerboard cell.
    # Let's compute the standard deviation of an empty cell (e.g. Row 0 Col 4 for knight, or Row 5 for slime if it exists).
    
    for r in range(rows):
        row_str = f"Row {r:2d}: "
        for c in range(cols):
            x1, y1 = c * cell_w, r * cell_h
            x2, y2 = x1 + cell_w, y1 + cell_h
            
            # Extract cell
            cell = arr[y1:y2, x1:x2, :3]
            
            # To detect if it has a sprite, let's just check if it has colors other than the background.
            # Background is gray (R~G~B). If we look at the standard deviation of color channels:
            # Color std-dev across the cell will be low for grayscale checkerboard, high for colored sprites (green slime, brown knight).
            # Let's check max color difference: max(R,G,B) - min(R,G,B).
            # Grayscale checkerboard has max-min near 0.
            color_diff = np.max(cell, axis=-1) - np.min(cell, axis=-1)
            
            # How many pixels have significant color?
            colored_pixels = np.sum(color_diff > 0.1)
            
            if colored_pixels > 50:
                row_str += "[X] "
            else:
                row_str += "[_] "
        print(row_str)

def main():
    analyze_sheet('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png')
    analyze_sheet('assets/academy/creatures/soldier/tga-topdown-soldier-enemy-v0.1.png')

if __name__ == '__main__':
    main()
