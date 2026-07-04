import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects, binary_dilation

def clean_and_detect():
    path = 'assets/academy/games/one-room-platformer/tga-one-room-platformer-sideview-construction-pieces-concept-v0.1.png'
    out_path = 'assets/academy/games/one-room-platformer/tga-one-room-platformer-construction-pieces-cleaned-v0.1.png'
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    
    # We want to remove the checkerboard and grid lines.
    # The grid lines form a perfect 128x128 grid? Let's check.
    # We can just erase a 2-pixel border around every 128x128 cell!
    # Because it's a fixed grid with explicit black borders drawn by the artist.
    
    for r in range(1024):
        for c in range(1024):
            if r % 128 == 0 or r % 128 == 127 or c % 128 == 0 or c % 128 == 127:
                arr[r, c, 3] = 0 # erase grid lines
                
    # Now erase the checkerboard.
    # Let's see what the colors of the checkerboard are in the top-left cell.
    # Cell 0,0 background is transparent or gray checkerboard.
    cb_colors = {}
    for r in range(10):
        for c in range(10):
            color = tuple(arr[r+2, c+2, :3])
            cb_colors[color] = cb_colors.get(color, 0) + 1
    print("Checkerboard colors near top-left:", cb_colors)
    
    # Alternatively, just use the delta < 15 logic on the background, starting from the erased grid lines.
    h, w = 1024, 1024
    from collections import deque
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    
    for r in range(h):
        for c in range(w):
            if arr[r, c, 3] == 0:
                q.append((r, c))
                visited[r, c] = True
                
    while q:
        r, c = q.popleft()
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < h and 0 <= nc < w and not visited[nr, nc]:
                # If the color is grayscale checkerboard
                color = arr[nr, nc]
                mx, mn = int(max(color[:3])), int(min(color[:3]))
                if mx - mn < 20 and mx > 100 and mx < 200: 
                    # Checkerboard is typically mid-gray.
                    visited[nr, nc] = True
                    arr[nr, nc, 3] = 0
                    q.append((nr, nc))
                    
    # Also erase the black grid lines that might have bled inside.
    # We can just run the sprite detection now!
    out_img = Image.fromarray(arr)
    out_img.save(out_path)
    
    # Sprite detection
    mask = arr[:, :, 3] > 0
    struct = np.ones((5, 5), dtype=bool) # small dilation
    dilated_mask = binary_dilation(mask, structure=struct, iterations=1)
    
    labeled_array, num_features = label(dilated_mask)
    objects = find_objects(labeled_array)
    
    print(f"Detected {num_features} pieces.")
    
clean_and_detect()
