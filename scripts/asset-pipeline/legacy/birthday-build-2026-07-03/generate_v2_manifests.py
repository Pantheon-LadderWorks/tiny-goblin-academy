import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects, binary_dilation

def generate_v2_manifest(name, path, grid_h, rows_config):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    mask = arr[:, :, 3] > 0
    
    struct = np.ones((15, 15), dtype=bool)
    dilated_mask = binary_dilation(mask, structure=struct, iterations=2)
    
    labeled_array, num_features = label(dilated_mask)
    objects = find_objects(labeled_array)
    
    detected_rows = {}
    for obj in objects:
        y_slice, x_slice = obj
        region_mask = mask[y_slice, x_slice]
        if not np.any(region_mask): continue
            
        true_y, true_x = np.where(region_mask)
        min_y = y_slice.start + np.min(true_y)
        max_y = y_slice.start + np.max(true_y)
        min_x = x_slice.start + np.min(true_x)
        max_x = x_slice.start + np.max(true_x)
        
        r = int(min_y // grid_h)
        if r not in detected_rows: detected_rows[r] = []
        detected_rows[r].append((min_x, min_y, max_x - min_x + 1, max_y - min_y + 1))
        
    manifest = {
        "domain": f"topdown-slime-v2-{name}",
        "operationalType": "character-animation-sheet",
        "sourceSheet": path.replace("-cleaned", ""),
        "derivedSheet": path,
        "animations": []
    }
    
    for r in sorted(detected_rows.keys()):
        detected_rows[r].sort(key=lambda x: x[0])
        anim_name = rows_config.get(r, f"row_{r}")
        
        frames = []
        for i, s in enumerate(detected_rows[r]):
            frames.append({"index": i, "sourceRect": {"x": int(s[0]), "y": int(s[1]), "w": int(s[2]), "h": int(s[3])}})
            
        manifest["animations"].append({
            "id": anim_name,
            "label": anim_name.capitalize(),
            "rowIndex": r,
            "frameCount": len(frames),
            "loop": True,
            "reviewStatus": "Draft",
            "frames": frames
        })
        
        # If it's a "right" animation, create a synthetic "left"
        if "right" in anim_name:
            manifest["animations"].append({
                "id": anim_name.replace("right", "left"),
                "label": anim_name.replace("right", "left").capitalize(),
                "rowIndex": r,
                "frameCount": len(frames),
                "loop": True,
                "reviewStatus": "Draft",
                "flipX": True,
                "frames": frames
            })
            
    out_path = Path(f"manifests/academy.topdown-slime-v2-{name}.animations.json")
    out_path.write_text(json.dumps(manifest, indent=2))
    print(f"Generated manifest: {out_path}")

idle_rows = {0: "idle.down", 1: "idle.up", 2: "idle.right", 3: "walk.down", 4: "walk.up", 5: "walk.right"}
action_rows = {0: "dash.down", 1: "dash.up", 2: "dash.right", 3: "die", 4: "victory"}

generate_v2_manifest('idle-move', 'assets/academy/creatures/slime/tga-topdown-slime-v2-idle-move-cleaned.png', 2528/6, idle_rows)
generate_v2_manifest('action', 'assets/academy/creatures/slime/tga-topdown-slime-v2-action-cleaned.png', 2304/5, action_rows)
