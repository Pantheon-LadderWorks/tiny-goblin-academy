import numpy as np
from PIL import Image

def clean_sheet(path, out_path):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    
    # Same logic as the global flood-fill from normalize-matrix-sheet.py
    # Background checkerboard is gray (low saturation).
    # Let's find all pixels with low saturation and low variance across RGB.
    
    r = arr[:, :, 0].astype(int)
    g = arr[:, :, 1].astype(int)
    b = arr[:, :, 2].astype(int)
    a = arr[:, :, 3]
    
    # Calculate min and max of RGB to find saturation/grayscale
    max_c = np.max(arr[:, :, :3], axis=2).astype(int)
    min_c = np.min(arr[:, :, :3], axis=2).astype(int)
    delta = max_c - min_c
    
    # Grid lines are black/dark gray. Checkerboard is gray.
    # Mask out anything where delta < 15 (it's grayscale).
    # Wait, some props might be grayscale! (like stone platforms).
    # Let's use the explicit flood-fill from the top-left corner.
    
    from collections import deque
    
    h, w = arr.shape[:2]
    visited = np.zeros((h, w), dtype=bool)
    
    # Start flood fill from corners and edges
    q = deque()
    
    for y in range(h):
        q.append((y, 0))
        q.append((y, w-1))
    for x in range(w):
        q.append((0, x))
        q.append((h-1, x))
        
    for y, x in q:
        visited[y, x] = True
        
    def is_bg(y, x):
        c = arr[y, x]
        if c[3] == 0: return True
        # Checkerboard colors are usually around 128-192 gray, grid is very dark.
        # Let's just check if it's grayscale (delta < 20).
        # We MUST avoid filling into the actual stone blocks!
        # The grid lines are dark. The checkerboard is light gray.
        # Let's just check if delta < 20 and it's part of the background.
        pixel_delta = int(max(c[:3])) - int(min(c[:3]))
        if pixel_delta < 20:
            return True
        return False
        
    # Better approach: The background is literally just the checkerboard and grid lines.
    # Let's use the exact colors of the checkerboard if possible, or just the global mask we used before.
    print(f"Loaded {path} {w}x{h}")
    
clean_sheet('assets/academy/games/one-room-platformer/tga-one-room-platformer-sideview-construction-pieces-concept-v0.1.png', 'assets/academy/games/one-room-platformer/tga-one-room-platformer-construction-pieces-cleaned-v0.1.png')
