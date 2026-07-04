import numpy as np
from PIL import Image

def analyze_grid(path):
    print(f"\nAnalyzing Grid for: {path}")
    img = Image.open(path).convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    
    # We expect 1px dark grid lines. Let's find rows/cols that are nearly solid.
    # Actually, we can just look for columns that are very dark across the whole height, and rows dark across the width.
    rgb = arr[..., :3]
    
    col_variance = np.var(rgb, axis=(0, 2))
    row_variance = np.var(rgb, axis=(1, 2))
    
    # Let's find local minima in variance that are also dark.
    col_means = np.mean(rgb, axis=(0, 2))
    row_means = np.mean(rgb, axis=(1, 2))
    
    # Grid lines are probably very dark (mean < 0.2) and very uniform (variance < 0.01)
    grid_cols = np.where((col_variance < 0.01) & (col_means < 0.2))[0]
    grid_rows = np.where((row_variance < 0.01) & (row_means < 0.2))[0]
    
    # Filter contiguous indices (if grid line is 2px thick, keep one)
    def filter_contiguous(indices):
        if len(indices) == 0: return []
        filtered = [indices[0]]
        for i in indices[1:]:
            if i - filtered[-1] > 5:
                filtered.append(i)
        return filtered

    grid_cols = filter_contiguous(grid_cols)
    grid_rows = filter_contiguous(grid_rows)
    
    print(f"Detected {len(grid_cols)-1} columns. Widths:", np.diff(grid_cols) if len(grid_cols)>1 else "None")
    print(f"Detected {len(grid_rows)-1} rows. Heights:", np.diff(grid_rows) if len(grid_rows)>1 else "None")

    if len(grid_cols) < 2 or len(grid_rows) < 2:
        print("Failed to find explicit grid lines. Let's assume 16 columns and some rows.")
        return

    # Now let's analyze content of each detected cell
    print("\nCell Content Matrix:")
    for r in range(len(grid_rows)-1):
        row_str = f"Row {r:2d}: "
        y1, y2 = grid_rows[r]+1, grid_rows[r+1]
        for c in range(len(grid_cols)-1):
            x1, x2 = grid_cols[c]+1, grid_cols[c+1]
            
            cell = arr[y1:y2, x1:x2, :3]
            color_diff = np.max(cell, axis=-1) - np.min(cell, axis=-1)
            colored_pixels = np.sum(color_diff > 0.1)
            
            if colored_pixels > 20:
                row_str += "[X] "
            else:
                row_str += "[_] "
        print(row_str)

def main():
    analyze_grid('assets/academy/creatures/slime/tga-slime-quest-slime-v0.1.png')
    analyze_grid('assets/academy/creatures/soldier/tga-slime-quest-player-v0.1.png')

if __name__ == '__main__':
    main()
