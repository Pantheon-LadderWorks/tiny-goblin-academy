import numpy as np
from PIL import Image
from pathlib import Path
from collections import deque

def main():
    src = Path('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png')
    img = Image.open(src).convert("RGBA")
    arr = np.array(img).astype(np.float32) / 255.0
    rgb = arr[..., :3]
    h, w = arr.shape[:2]

    # Detect low-saturation gray pixels
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)

    # Gray-ish checkerboard / compression artifacts
    gray_like = (
        (sat < 0.16) &
        (mx > 0.12) & (mx < 0.88) &
        (np.abs(rgb[...,0] - rgb[...,1]) < 0.075) &
        (np.abs(rgb[...,1] - rgb[...,2]) < 0.075) &
        (np.abs(rgb[...,0] - rgb[...,2]) < 0.075)
    )
    
    # Run flood fill to find what it caught
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        if gray_like[0, x]:
            visited[0, x] = True; q.append((0, x))
        if gray_like[h-1, x]:
            visited[h-1, x] = True; q.append((h-1, x))
    for y in range(h):
        if gray_like[y, 0]:
            visited[y, 0] = True; q.append((y, 0))
        if gray_like[y, w-1]:
            visited[y, w-1] = True; q.append((y, w-1))

    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    while q:
        y, x = q.popleft()
        for dy, dx in dirs:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and gray_like[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))
                
    # Now find pixels that are gray_like but NOT visited by flood fill
    # These are the "enclosed islands" or "holes in the goblin"
    enclosed = gray_like & (~visited)
    
    # Let's see where they are
    ys, xs = np.where(enclosed)
    
    if len(ys) == 0:
        print("No enclosed islands found!")
        return
        
    print(f"Found {len(ys)} enclosed checkerboard pixels.")
    
    # Are they near the legs? 
    # Let's count how many are inside the actual sprite body bounds
    # For the goblin, the sprite itself is roughly within y: 50 to 200 of its 256px frame.
    # The bottom is around y=210 (legs/boots).
    # Let's just group them by y within the 256px cell.
    
    y_in_cell = ys % 256
    
    # We expect enclosed pixels between the legs. 
    # Legs are at the bottom of the sprite. y_in_cell > 150 usually.
    # Let's see if there are any enclosed pixels high up (which would mean holes in the head/body).
    
    high_pixels = np.sum(y_in_cell < 130)
    mid_pixels = np.sum((y_in_cell >= 130) & (y_in_cell < 180))
    low_pixels = np.sum(y_in_cell >= 180)
    
    print(f"High pixels (head/chest, y<130): {high_pixels}")
    print(f"Mid pixels (waist/hands, 130<=y<180): {mid_pixels}")
    print(f"Low pixels (legs/ground, y>=180): {low_pixels}")
    
    if high_pixels > 0 or mid_pixels > 0:
        print("WARNING: Found enclosed gray pixels high up on the sprite! This means the global color-key is punching holes in the goblin (e.g. teeth, belt buckle, weapon shadows).")
    else:
        print("SUCCESS: All enclosed gray pixels are at the bottom (legs). The global color-key seems safe!")

if __name__ == '__main__':
    main()
