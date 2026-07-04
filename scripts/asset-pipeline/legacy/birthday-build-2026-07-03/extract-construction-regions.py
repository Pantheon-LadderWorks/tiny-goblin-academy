import json
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects
from collections import deque

def extract_regions():
    src_path = 'assets/academy/games/one-room-platformer/tga-one-room-platformer-sideview-construction-pieces-concept-v0.2.png'
    clean_path = 'assets/academy/games/one-room-platformer/tga-one-room-platformer-construction-pieces-cleaned-v0.2.png'
    manifest_path = 'manifests/academy.platformer-construction-pieces.regions.json'

    # 1. CLEAN
    img = Image.open(src_path).convert('RGBA')
    arr = np.array(img).astype(np.float32)
    h, w = arr.shape[:2]

    q = deque()
    for i in range(h):
        q.append((i, 0))
        q.append((i, w - 1))
    for j in range(w):
        q.append((0, j))
        q.append((h - 1, j))
        
    visited = set(q)
    
    # Flood-fill the background
    while q:
        cy, cx = q.popleft()
        c = arr[cy, cx]
        if c[3] == 0:
            continue
            
        c_diff = float(max(c[:3])) - float(min(c[:3]))
        # The background is checkerboard (c_diff < 20).
        # We also want to eat the torch glow, which is darker brown/orange.
        # Torch flame is very bright. Glow is darker.
        brightness = sum(c[:3]) / 3.0
        
        is_bg = (c_diff < 20)
        # Aggressive halo cleanup: also eat dark brownish colors from the torch glow
        # Torch glow checkerboard is typically around R=50-100, G=40-80, B=30-60
        if not is_bg and brightness < 80 and c[0] > c[1] and c_diff < 60:
            is_bg = True
            
        if is_bg:
            arr[cy, cx, 3] = 0  # transparent
            for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
                ny, nx = cy+dy, cx+dx
                if 0 <= ny < h and 0 <= nx < w:
                    if (ny, nx) not in visited:
                        visited.add((ny, nx))
                        q.append((ny, nx))

    # Save cleaned image
    out_img = Image.fromarray(arr.astype(np.uint8))
    out_img.save(clean_path)
    print(f"Cleaned image saved to {clean_path}")

    # 2. DETECT
    mask = arr[:, :, 3] > 0
    # 0-pixel dilation (pure detection). We rely entirely on the logical grid grouping
    # in Phase 3 to merge disconnected parts like sparkles or floating embers,
    # ensuring closely packed items like the three buttons stay perfectly separated.
    labeled_array, num_features = label(mask)
    objects = find_objects(labeled_array)
    
    raw_regions = []
    for idx, obj in enumerate(objects):
        if obj is None: continue
        y_slice, x_slice = obj
        # Filter noise
        area = (y_slice.stop - y_slice.start) * (x_slice.stop - x_slice.start)
        if area < 100:
            continue
            
        raw_regions.append({
            'y': y_slice.start,
            'x': x_slice.start,
            'w': x_slice.stop - x_slice.start,
            'h': y_slice.stop - y_slice.start
        })

    # 3. MAP (Smarter Merge Pass based on logical cells)
    # The artist didn't use a perfect grid, but the items cluster into 8x6 logical cells.
    # We use approximate cell boundaries to group disconnected pieces of the same item.
    cells = {}
    for r in raw_regions:
        cx = r['x'] + r['w'] / 2.0
        cy = r['y'] + r['h'] / 2.0
        
        # Approximate boundaries for the 8x6 grid
        # Rows: 0, 162, 338, 512, 716, 882, 1024
        # Cols: 0, 124, 255, 383, 512, 640, 769, 899, 1024
        row_idx = 5
        for i, border in enumerate([162, 338, 512, 716, 882, 1024]):
            if cy < border:
                row_idx = i
                break
                
        col_idx = 7
        for i, border in enumerate([124, 255, 383, 512, 640, 769, 899, 1024]):
            if cx < border:
                col_idx = i
                break
                
        cell_key = (row_idx, col_idx)
        if cell_key not in cells:
            cells[cell_key] = []
        cells[cell_key].append(r)

    # Compute bounding box for each cell
    regions = []
    # Ensure they are sorted top-to-bottom, left-to-right by iterating the grid
    for row in range(6):
        for col in range(8):
            if (row, col) in cells:
                cell_regions = cells[(row, col)]
                min_x = min(r['x'] for r in cell_regions)
                min_y = min(r['y'] for r in cell_regions)
                max_x = max(r['x'] + r['w'] for r in cell_regions)
                max_y = max(r['y'] + r['h'] for r in cell_regions)
                
                regions.append({
                    'x': min_x,
                    'y': min_y,
                    'w': max_x - min_x,
                    'h': max_y - min_y
                })

    manifest_regions = []
    for i, r in enumerate(regions, 1):
        # We can just assign region_01, region_02 as requested
        id_str = f"region_{i:02d}"
        manifest_regions.append({
            "id": id_str,
            "category": "construction-piece",
            "label": id_str,
            "sourceRect": r,
            "usage": "level-geometry",
            "reviewStatus": "draft"
        })

    manifest = {
        "domain": "platformer-construction-pieces",
        "operationalType": "region-manifest",
        "sourceSheet": src_path,
        "derivedSheet": clean_path,
        "regions": manifest_regions
    }

    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
        
    print(f"Detected {len(manifest_regions)} regions.")
    print(f"Manifest saved to {manifest_path}")

if __name__ == '__main__':
    extract_regions()
