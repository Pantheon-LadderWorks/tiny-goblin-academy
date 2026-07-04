import json
from pathlib import Path

def create_slime_manifest():
    manifest = {
        "domain": "topdown-slime-player",
        "operationalType": "character-animation-sheet",
        "sourceSheet": "assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png",
        "derivedSheet": "assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png",
        "frameGrid": {
            "cols": 16,
            "rows": 8,
            "cellWidth": 172,
            "cellHeight": 192,
            "columnRects": [{"x": c*172, "w": 172} for c in range(16)],
            "rowRects": [{"y": r*192, "h": 192} for r in range(8)]
        },
        "animations": []
    }
    
    # 5 frames for down? Let's just use 4 for all basic animations if it's typically a 4-frame cycle,
    # or let's use the explicit columns 0-4 if there are 5.
    # Let's map Down: 0-3, Up: 6-9, Right: 10-13, Left: 10-13 (flipX).
    # Since we aren't 100% sure without seeing it play, let's map what we can.
    
    # Let's define the 5 rows we think have content
    # R0: Walk
    # R1: Hop
    # R2: Dash
    # R3: Attack
    # R4: Hurt
    
    seqs = []
    
    row_names = ["idle", "walk", "hop", "dash", "stretch", "attack", "hurt", "die"]
    
    for r in range(8):
        name = row_names[r]
        # down
        seqs.append({"id": f"slime.{name}.down", "rowIndex": r, "loop": r<4, "cols": range(0, 4)})
        # up
        seqs.append({"id": f"slime.{name}.up", "rowIndex": r, "loop": r<4, "cols": range(6, 10)})
        # right
        seqs.append({"id": f"slime.{name}.right", "rowIndex": r, "loop": r<4, "cols": range(10, 14)})
        # left (synthetic)
        seqs.append({"id": f"slime.{name}.left", "rowIndex": r, "loop": r<4, "cols": range(10, 14), "flipX": True})

    for seq in seqs:
        frames = []
        for i, c in enumerate(seq['cols']):
            frames.append({
                "index": i,
                "sourceRect": {
                    "x": c * 172,
                    "y": seq['rowIndex'] * 192,
                    "w": 172,
                    "h": 192
                }
            })
        
        anim = {
            "id": seq["id"],
            "label": seq["id"].replace(".", " ").title(),
            "type": "animation-sequence",
            "rowIndex": seq["rowIndex"],
            "rowY": seq["rowIndex"] * 192,
            "frameCount": len(frames),
            "loop": seq.get("loop", False),
            "reviewStatus": "needs-human-review",
            "usage": "draft-review",
            "frames": frames
        }
        if "flipX" in seq:
            anim["flipX"] = seq["flipX"]
        
        manifest["animations"].append(anim)
        
    Path("manifests/academy.topdown-slime-player.animations.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

def create_soldier_manifest():
    manifest = {
        "domain": "topdown-soldier-enemy",
        "operationalType": "character-animation-sheet",
        "sourceSheet": "assets/academy/creatures/soldier/tga-topdown-soldier-enemy-v0.1.png",
        "derivedSheet": "assets/academy/creatures/soldier/tga-topdown-soldier-enemy-cleaned-v0.1.png",
        "frameGrid": {
            "cols": 16,
            "rows": 8,
            "cellWidth": 176,
            "cellHeight": 192,
            "columnRects": [{"x": c*176, "w": 176} for c in range(16)],
            "rowRects": [{"y": r*192, "h": 192} for r in range(8)]
        },
        "animations": []
    }
    
    # Soldier layout: 16 columns perfectly packed (4 Down, 4 Up, 4 Right, 4 Left)
    # Except rows 6,7 where Left is broken, so we will use flipX of Right for Left on all rows
    # to avoid the broken frames, AND to fix the symmetry issue Quinn pointed out.
    # Wait, Quinn said: "The Sword Problem: The Soldier holds a sword in their right hand. When you mirror walk.right to create walk.left, the sword will correctly appear in the left hand when facing left. This is actually correct behavior."
    # Wait, no. If the sword is in the right hand, mirroring it puts it in the left hand.
    # Usually characters should hold the sword in the same hand regardless of direction (unless they are ambidextrous).
    # If we flip the Right animation, the sword switches to the left hand.
    # But since the artist explicitly drew the Left animations for the first 6 rows, we should USE them!
    # And only use flipX for rows 6 and 7!
    # And we'll add symmetry_warning: True for rows 6 and 7 left.

    row_names = ["walk", "attack1", "walk_shield_up", "attack2", "walk_hurt", "walk_dizzy", "hurt", "die"]
    
    seqs = []
    for r in range(8):
        name = row_names[r]
        seqs.append({"id": f"soldier.{name}.down", "rowIndex": r, "loop": r<6, "cols": range(0, 4)})
        seqs.append({"id": f"soldier.{name}.up", "rowIndex": r, "loop": r<6, "cols": range(4, 8)})
        seqs.append({"id": f"soldier.{name}.right", "rowIndex": r, "loop": r<6, "cols": range(8, 12)})
        
        if r < 6:
            # Use artist's explicit left frames for rows 0-5
            seqs.append({"id": f"soldier.{name}.left", "rowIndex": r, "loop": r<6, "cols": range(12, 16)})
        else:
            # Rows 6-7 have broken left frames, so we flip Right and add warning
            seqs.append({"id": f"soldier.{name}.left", "rowIndex": r, "loop": False, "cols": range(8, 12), "flipX": True, "symmetry_warning": True})

    for seq in seqs:
        frames = []
        for i, c in enumerate(seq['cols']):
            frames.append({
                "index": i,
                "sourceRect": {
                    "x": c * 176,
                    "y": seq['rowIndex'] * 192,
                    "w": 176,
                    "h": 192
                }
            })
            
        anim = {
            "id": seq["id"],
            "label": seq["id"].replace(".", " ").title(),
            "type": "animation-sequence",
            "rowIndex": seq["rowIndex"],
            "rowY": seq["rowIndex"] * 192,
            "frameCount": len(frames),
            "loop": seq.get("loop", False),
            "reviewStatus": "needs-human-review",
            "usage": "draft-review",
            "frames": frames
        }
        if "flipX" in seq:
            anim["flipX"] = seq["flipX"]
        if "symmetry_warning" in seq:
            anim["symmetry_warning"] = seq["symmetry_warning"]
            
        manifest["animations"].append(anim)

    Path("manifests/academy.topdown-soldier-enemy.animations.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

def main():
    create_slime_manifest()
    create_soldier_manifest()

if __name__ == '__main__':
    main()
