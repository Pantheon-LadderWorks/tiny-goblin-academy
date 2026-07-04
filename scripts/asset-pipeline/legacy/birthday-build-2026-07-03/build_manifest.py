import json
import numpy as np
from PIL import Image

def build_manifest():
    clean_path = 'assets/academy/games/one-room-platformer/tga-one-room-platformer-construction-pieces-cleaned-v0.1.png'
    img = Image.open(clean_path).convert('RGBA')
    arr = np.array(img)
    
    # Grid is 128x128 cells. 8 cols, 6 rows.
    # Total 48 cells.
    
    mapping = [
        # Row 0
        ("platform.stone.flat.1", "Stone Platform (Flat 1)"),
        ("platform.stone.flat.2", "Stone Platform (Flat 2)"),
        ("platform.stone.flat.3", "Stone Platform (Flat 3)"),
        ("platform.stone.flat.4", "Stone Platform (Flat 4)"),
        ("platform.stone.cracked", "Stone Platform (Cracked)"),
        ("platform.stone.mossy", "Stone Platform (Mossy)"),
        ("platform.stone.dark", "Stone Platform (Dark)"),
        ("platform.stone.decorative", "Stone Platform (Decorative)"),
        # Row 1
        ("platform.wood.flat", "Wooden Platform (Flat)"),
        ("platform.wood.supported", "Wooden Platform (Supported)"),
        ("platform.stone.slab.1", "Stone Slab (1)"),
        ("platform.stone.slab.2", "Stone Slab (2)"),
        ("prop.bookcase.small", "Bookcase (Small)"),
        ("platform.wood.bracket", "Wooden Shelf (Bracket)"),
        ("platform.wood.shelf", "Wooden Shelf"),
        ("platform.stone.shelf", "Stone Shelf"),
        # Row 2
        ("support.metal.left", "Metal Bracket (Left)"),
        ("support.metal.right", "Metal Bracket (Right)"),
        ("support.wood", "Wooden Bracket"),
        ("pillar.stone.short", "Stone Pillar (Short)"),
        ("pillar.stone.tall", "Stone Pillar (Tall)"),
        ("vertical.chain", "Chain"),
        ("vertical.rope", "Rope"),
        ("platform.stone.ledge", "Stone Ledge (Under)"),
        # Row 3
        ("hazard.spikes.metal", "Spikes (Metal)"),
        ("hazard.spikes.wood", "Spikes (Wood Base)"),
        ("hazard.lava.left", "Lava (Left Edge)"),
        ("hazard.lava.mid", "Lava (Middle)"),
        ("hazard.lava.right", "Lava (Right Edge)"),
        ("hazard.lava.bubbles", "Lava (Bubbles)"),
        ("hazard.rocks.crumbling", "Crumbling Rocks"),
        ("hazard.trapdoor", "Trapdoor Outline"),
        # Row 4
        ("prop.ladder.1", "Ladder (1)"),
        ("prop.ladder.2", "Ladder (2)"),
        ("prop.button", "Floor Button"),
        ("prop.crate", "Wooden Crate"),
        ("prop.flag", "Flag"),
        ("prop.key", "Key"),
        ("goal.door.locked", "Door (Locked)"),
        ("goal.door.open", "Door (Open)"),
        # Row 5
        ("prop.torch", "Torch"),
        ("prop.window", "Window"),
        ("prop.banner", "Banner"),
        ("prop.bookcase.large", "Bookcase (Large)"),
        ("prop.chalkboard", "Chalkboard"),
        ("prop.sign", "Sign"),
        ("fx.sparkles", "Sparkles"),
        ("fx.smoke", "Smoke Cloud")
    ]
    
    manifest = {
        "domain": "platformer-construction-pieces",
        "operationalType": "region-manifest",
        "sourceSheet": "assets/academy/games/one-room-platformer/tga-one-room-platformer-sideview-construction-pieces-concept-v0.1.png",
        "derivedSheet": clean_path,
        "regions": []
    }
    
    idx = 0
    for r in range(6):
        for c in range(8):
            cell_y = r * 128
            cell_x = c * 128
            
            # Extract cell mask
            cell_mask = arr[cell_y:cell_y+128, cell_x:cell_x+128, 3] > 0
            
            if np.any(cell_mask):
                true_y, true_x = np.where(cell_mask)
                min_y = np.min(true_y)
                max_y = np.max(true_y)
                min_x = np.min(true_x)
                max_x = np.max(true_x)
                
                # Actual coordinates in the full sheet
                act_x = cell_x + min_x
                act_y = cell_y + min_y
                act_w = max_x - min_x + 1
                act_h = max_y - min_y + 1
            else:
                # Fallback if empty (shouldn't happen if cleanup worked)
                act_x, act_y, act_w, act_h = cell_x, cell_y, 128, 128
                
            region_id, region_label = mapping[idx]
            manifest["regions"].append({
                "id": region_id,
                "label": region_label,
                "sourceRect": {
                    "x": int(act_x),
                    "y": int(act_y),
                    "w": int(act_w),
                    "h": int(act_h)
                }
            })
            idx += 1
            
    import os
    os.makedirs('manifests', exist_ok=True)
    with open('manifests/academy.platformer-construction-pieces.regions.json', 'w') as f:
        json.dump(manifest, f, indent=2)
        
    print("Manifest generated successfully!")

build_manifest()
