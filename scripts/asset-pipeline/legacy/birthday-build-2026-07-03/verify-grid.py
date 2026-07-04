import numpy as np
from PIL import Image

def verify_grid(path, cols=16, rows=8):
    print(f"\nVerifying grid for: {path}")
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    h, w, _ = arr.shape
    cw = w // cols
    ch = h // rows
    print(f"Dimensions: {w}x{h}, Cell size: {cw}x{ch}")
    
    # Check vertical lines (x = 0, cw, 2*cw, ...)
    bad_v_lines = 0
    for c in range(cols + 1):
        x = min(c * cw, w - 1)
        col_pixels = arr[:, x, :3]
        mean_color = np.mean(col_pixels, axis=1)
        is_dark = np.sum(mean_color < 50) / h  # fraction of dark pixels
        if is_dark < 0.8:
            # print(f"Vertical line at x={x} is not consistently dark. Dark fraction: {is_dark:.2f}")
            bad_v_lines += 1
            
    # Check horizontal lines (y = 0, ch, 2*ch, ...)
    bad_h_lines = 0
    for r in range(rows + 1):
        y = min(r * ch, h - 1)
        row_pixels = arr[y, :, :3]
        mean_color = np.mean(row_pixels, axis=1)
        is_dark = np.sum(mean_color < 50) / w
        if is_dark < 0.8:
            # print(f"Horizontal line at y={y} is not consistently dark. Dark fraction: {is_dark:.2f}")
            bad_h_lines += 1
            
    print(f"Bad vertical lines: {bad_v_lines}/{cols+1}")
    print(f"Bad horizontal lines: {bad_h_lines}/{rows+1}")

def main():
    verify_grid('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png', 16, 8)
    verify_grid('assets/academy/creatures/soldier/tga-topdown-soldier-enemy-v0.1.png', 16, 8)

if __name__ == '__main__':
    main()
