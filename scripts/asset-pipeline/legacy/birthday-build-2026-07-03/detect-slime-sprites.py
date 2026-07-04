import json
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label, find_objects, binary_dilation
from pathlib import Path

def generate_sprite_manifest():
    sheet_path = "assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png"
    img = Image.open(sheet_path).convert('RGBA')
    arr = np.array(img)
    mask = arr[:, :, 3] > 0
    
    struct = np.ones((15, 15), dtype=bool)
    dilated_mask = binary_dilation(mask, structure=struct, iterations=2)
    
    labeled_array, num_features = label(dilated_mask)
    objects = find_objects(labeled_array)
    
    debug_img = img.copy()
    draw = ImageDraw.Draw(debug_img)
    
    rows = [[] for _ in range(8)]
    for obj in objects:
        y_slice, x_slice = obj
        
        region_mask = mask[y_slice, x_slice]
        if not np.any(region_mask):
            continue
            
        true_y, true_x = np.where(region_mask)
        min_y = y_slice.start + np.min(true_y)
        max_y = y_slice.start + np.max(true_y)
        min_x = x_slice.start + np.min(true_x)
        max_x = x_slice.start + np.max(true_x)
        
        r = min_y // 192
        if r < 8:
            rows[r].append((min_x, min_y, max_x - min_x + 1, max_y - min_y + 1))
            draw.rectangle([min_x, min_y, max_x, max_y], outline="lime", width=2)
            
    debug_img.save("slime-sprite-detection-debug.png")
    
    print("Sprite Detection Report:")
    for r in range(8):
        rows[r].sort(key=lambda x: x[0])
        sprites_str = ", ".join([f"[Sprite {i}: x={s[0]}, y={s[1]}, w={s[2]}, h={s[3]}]" for i, s in enumerate(rows[r])])
        print(f"Row {r}: {sprites_str}")

    # Animation mappings
    row_configs = {
        0: {"name": "idle",   "counts": [4, 4, 2], "loop": True},
        1: {"name": "walk",   "counts": [4, 4, 2], "loop": True},
        2: {"name": "hop",    "counts": [4, 4, 3], "loop": True},
        3: {"name": "dash",   "counts": [4, 4, 3], "loop": True},
        4: {"name": "attack", "counts": [5, 4, 3], "loop": False},
        5: {"name": "hit",    "counts": [3, 3, 2], "loop": False},
        6: {"name": "die",    "counts": [4],       "loop": False}
    }
    
    manifest = {
        "domain": "topdown-slime-player",
        "operationalType": "character-animation-sheet",
        "sourceSheet": "assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png",
        "derivedSheet": "assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png",
        "animations": []
    }
    
    for r, config in row_configs.items():
        sprites = rows[r]
        name = config["name"]
        counts = config["counts"]
        is_loop = config["loop"]
        
        if len(counts) == 1:
            # Single direction (e.g., die)
            frames = []
            for i in range(counts[0]):
                if i < len(sprites):
                    s = sprites[i]
                    frames.append({"index": i, "sourceRect": {"x": int(s[0]), "y": int(s[1]), "w": int(s[2]), "h": int(s[3])}})
            
            manifest["animations"].append({
                "id": name,
                "label": name.capitalize(),
                "rowIndex": r,
                "frameCount": len(frames),
                "loop": is_loop,
                "reviewStatus": "Draft",
                "frames": frames
            })
        else:
            # Multi-directional
            dirs = ["down", "up", "right"]
            sprite_idx = 0
            
            for d_idx, d in enumerate(dirs):
                count = counts[d_idx]
                frames = []
                for i in range(count):
                    if sprite_idx < len(sprites):
                        s = sprites[sprite_idx]
                        frames.append({"index": i, "sourceRect": {"x": int(s[0]), "y": int(s[1]), "w": int(s[2]), "h": int(s[3])}})
                        sprite_idx += 1
                        
                manifest["animations"].append({
                    "id": f"{name}.{d}",
                    "label": f"{name.capitalize()} ({d.capitalize()})",
                    "rowIndex": r,
                    "frameCount": len(frames),
                    "loop": is_loop,
                    "reviewStatus": "Draft",
                    "frames": frames
                })
                
                # Synthetic Left
                if d == "right":
                    manifest["animations"].append({
                        "id": f"{name}.left",
                        "label": f"{name.capitalize()} (Left)",
                        "rowIndex": r,
                        "frameCount": len(frames),
                        "loop": is_loop,
                        "reviewStatus": "Draft",
                        "flipX": True,
                        "frames": frames
                    })

    out_path = Path("manifests/academy.topdown-slime-player.animations.json")
    out_path.write_text(json.dumps(manifest, indent=2))
    print(f"\nManifest saved to {out_path}")

if __name__ == '__main__':
    generate_sprite_manifest()
