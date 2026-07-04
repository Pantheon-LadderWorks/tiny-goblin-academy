import numpy as np
from PIL import Image

def test_cleanup(path, cols, rows, r, c, out_path):
    print(f"Testing cleanup on {path} at row {r}, col {c}")
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    h, w, _ = arr.shape
    cw, ch = w // cols, h // rows
    
    # Extract cell
    y1, y2 = r * ch, (r + 1) * ch
    x1, x2 = c * cw, (c + 1) * cw
    cell = arr[y1:y2, x1:x2].copy()
    
    # Destroy grid lines by clearing a 2px margin on all sides
    cell[:2, :] = [0, 0, 0, 0]
    cell[-2:, :] = [0, 0, 0, 0]
    cell[:, :2] = [0, 0, 0, 0]
    cell[:, -2:] = [0, 0, 0, 0]
    
    # To remove checkerboard, let's look at the colors. 
    # Checkerboard is usually grayscale. 
    # If R ~ G ~ B, it's gray.
    rgb = cell[..., :3]
    color_diff = np.max(rgb, axis=-1) - np.min(rgb, axis=-1)
    is_gray = color_diff < 15
    
    # Actually, we can just find the most common colors in the margin/background.
    # But since these are Slime (green) and Knight (brown/metal), they might have gray pixels (like sword/helmet).
    # Flood fill from the edges is safer! Since we cleared the 2px margin to transparent, 
    # we can flood fill from the transparent edge inwards, replacing any pixel that is grayscale.
    
    # Let's try simple flood fill approach (from edges)
    from skimage.segmentation import flood_fill
    
    # Create a mask where grayscale is True
    # Let's be very specific: checkerboard is exactly two colors usually.
    # Let's find unique colors in the cell that are gray.
    # Actually, a simple transparency threshold for anything gray that touches the edge.
    
    # We will use flood fill on the alpha channel.
    # First, make all grayscale pixels have alpha=254 (almost opaque).
    mask_gray = is_gray & (cell[..., 3] > 0)
    cell[mask_gray, 3] = 254
    
    # Now flood fill from (0,0) replacing alpha=254 or alpha=0 with alpha=0.
    # Actually, scikit-image flood_fill requires a single value to match.
    # Let's just write a simple BFS flood fill in Python for pixels that are gray.
    from collections import deque
    
    q = deque()
    # Add all edges
    for i in range(ch):
        q.append((i, 0))
        q.append((i, cw-1))
    for j in range(cw):
        q.append((0, j))
        q.append((ch-1, j))
        
    visited = set(q)
    
    while q:
        cy, cx = q.popleft()
        cell[cy, cx] = [0, 0, 0, 0]
        
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = cy+dy, cx+dx
            if 0 <= ny < ch and 0 <= nx < cw:
                if (ny, nx) not in visited:
                    # If neighbor is gray, it's part of the background checkerboard
                    # or if it's already transparent
                    c_rgb = cell[ny, nx, :3]
                    diff = int(max(c_rgb)) - int(min(c_rgb))
                    if diff < 15:
                        visited.add((ny, nx))
                        q.append((ny, nx))

    Image.fromarray(cell).save(out_path)
    print(f"Saved {out_path}")

def main():
    test_cleanup('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png', 16, 8, 0, 0, 'test_slime_0_0.png')
    test_cleanup('assets/academy/creatures/soldier/tga-topdown-soldier-enemy-v0.1.png', 16, 8, 0, 0, 'test_soldier_0_0.png')

if __name__ == '__main__':
    main()
