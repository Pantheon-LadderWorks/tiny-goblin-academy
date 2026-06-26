import sys
import json
import os
from PIL import Image

def is_checkerboard(r, g, b, tol=10):
    # known checkerboard grays: (101,101,101), (102,102,102), (146,146,146), (143,143,143), (144,144,144)
    if abs(r - g) <= tol and abs(g - b) <= tol:
        avg = (r + g + b) / 3
        if 90 < avg < 115 or 135 < avg < 155:
            return True
    return False

def flood_fill_clean(img, rect):
    x, y, w, h = rect['x'], rect['y'], rect['w'], rect['h']
    
    # We will operate on a crop to avoid interfering with other regions, but actually
    # we can operate on the main image if we want. But the user asked to restrict removal to background pixels connected to the region edges.
    
    # Let's do a flood fill starting from the perimeter of the crop.
    
    # Create a mask of the same size as the crop
    crop = img.crop((x, y, x+w, y+h))
    data = crop.load()
    
    # List of points to process
    stack = []
    
    # Add perimeter to stack if they match checkerboard
    for cx in range(w):
        stack.append((cx, 0))
        stack.append((cx, h - 1))
    for cy in range(1, h - 1):
        stack.append((0, cy))
        stack.append((w - 1, cy))
        
    visited = set()
    cleaned_count = 0
    
    # Actually, before flood filling, check if a point is checkerboard.
    # We only push valid checkerboard points to the traversal stack.
    valid_stack = []
    for pt in stack:
        if pt in visited:
            continue
        cx, cy = pt
        if cx < 0 or cx >= w or cy < 0 or cy >= h:
            continue
        r, g, b, a = data[cx, cy]
        if is_checkerboard(r, g, b) and a == 255:
            valid_stack.append(pt)
            visited.add(pt)
            
    # Flood fill
    while valid_stack:
        cx, cy = valid_stack.pop()
        
        # Clean the pixel
        data[cx, cy] = (255, 255, 255, 0)
        cleaned_count += 1
        
        # Check neighbors
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h:
                if (nx, ny) not in visited:
                    visited.add((nx, ny))
                    r, g, b, a = data[nx, ny]
                    if is_checkerboard(r, g, b) and a == 255:
                        valid_stack.append((nx, ny))
                        
    # Paste the cleaned crop back into the main image
    img.paste(crop, (x, y))
    return cleaned_count

def main():
    original_path = 'assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png'
    derived_dir = 'assets/academy/hub/derived'
    derived_path = os.path.join(derived_dir, 'tga-hub-game-icons-cleaned-v0.1.png')
    manifest_path = 'manifests/hub.icon-regions.json'
    
    evidence_dir = 'hub/evidence/screenshots/h2-5-checkerboard-cleanup'
    
    os.makedirs(derived_dir, exist_ok=True)
    os.makedirs(evidence_dir, exist_ok=True)
    
    img = Image.open(original_path).convert("RGBA")
    print(f"Source size: {img.size}")
    
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
        
    total_cleaned = 0
    
    for region in manifest['regions']:
        rect = region['sourceRect']
        cleaned_count = flood_fill_clean(img, rect)
        total_cleaned += cleaned_count
        print(f"Region {region['gameId']}: {cleaned_count} pixels cleaned")
        if cleaned_count > 30000:
             print(f"  WARNING: Suspiciously high cleanup count for {region['gameId']}!")
        
    print(f"Total transparent pixels: {total_cleaned}")
    print(f"Derived output path: {derived_path}")
    
    img.save(derived_path)
    
    # Generate evidence
    # 01-cleaned-sheet-preview.png (just the cleaned sheet itself, maybe resized)
    img.copy().resize((img.size[0]//2, img.size[1]//2)).save(os.path.join(evidence_dir, '01-cleaned-sheet-preview.png'))
    
    # 02-alpha-preview.png
    alpha = img.split()[-1]
    alpha.save(os.path.join(evidence_dir, '02-alpha-preview.png'))
    
    # 03-before-after-sample.png
    # Let's crop region 1 from both original and cleaned, and paste side by side
    orig = Image.open(original_path).convert("RGBA")
    r = manifest['regions'][0]['sourceRect']
    w, h = r['w'], r['h']
    
    sample = Image.new('RGBA', (w * 2, h))
    sample.paste(orig.crop((r['x'], r['y'], r['x']+w, r['y']+h)), (0, 0))
    sample.paste(img.crop((r['x'], r['y'], r['x']+w, r['y']+h)), (w, 0))
    sample.save(os.path.join(evidence_dir, '03-before-after-sample.png'))

if __name__ == '__main__':
    main()
