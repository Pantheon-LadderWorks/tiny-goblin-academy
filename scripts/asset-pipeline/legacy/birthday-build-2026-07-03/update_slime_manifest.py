import json
from pathlib import Path

def create_slime_manifest():
    manifest = {
        "domain": "topdown-slime-player",
        "operationalType": "character-animation-sheet",
        "sourceSheet": "assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png",
        "frameGrid": {
            "cols": 12,
            "rows": 8,
            "cellWidth": 229.333,
            "cellHeight": 192,
            "columnRects": [{"x": int(c*229.333), "w": int(229.333)} for c in range(12)],
            "rowRects": [{"y": r*192, "h": 192} for r in range(8)]
        },
        "animations": []
    }
    
    seqs = []
    # Row 0: Idle
    seqs.append({"id": "idle.down", "label": "Idle (Down)", "rowIndex": 0, "cols": [0, 1, 2, 3], "loop": True})
    seqs.append({"id": "idle.up", "label": "Idle (Up)", "rowIndex": 0, "cols": [5, 6, 7, 8], "loop": True})
    seqs.append({"id": "idle.right", "label": "Idle (Right)", "rowIndex": 0, "cols": [10, 11], "loop": True})
    seqs.append({"id": "idle.left", "label": "Idle (Left)", "rowIndex": 0, "cols": [10, 11], "loop": True, "flipX": True})
    
    # Row 1: Walk
    seqs.append({"id": "walk.down", "label": "Walk (Down)", "rowIndex": 1, "cols": [0, 1, 2, 3], "loop": True})
    seqs.append({"id": "walk.up", "label": "Walk (Up)", "rowIndex": 1, "cols": [4, 5, 6, 7], "loop": True})
    seqs.append({"id": "walk.right", "label": "Walk (Right)", "rowIndex": 1, "cols": [8, 9, 10, 11], "loop": True})
    seqs.append({"id": "walk.left", "label": "Walk (Left)", "rowIndex": 1, "cols": [8, 9, 10, 11], "loop": True, "flipX": True})

    # Row 4: Attack
    seqs.append({"id": "attack.down", "label": "Attack (Down)", "rowIndex": 4, "cols": [0, 1, 2, 3, 4], "loop": False})
    seqs.append({"id": "attack.up", "label": "Attack (Up)", "rowIndex": 4, "cols": [5, 6, 7, 8], "loop": False})
    seqs.append({"id": "attack.right", "label": "Attack (Right)", "rowIndex": 4, "cols": [9, 10, 11], "loop": False})
    seqs.append({"id": "attack.left", "label": "Attack (Left)", "rowIndex": 4, "cols": [9, 10, 11], "loop": False, "flipX": True})
    
    # Row 5: Hit
    seqs.append({"id": "hit.down", "label": "Hit (Down)", "rowIndex": 5, "cols": [0, 1, 2, 3], "loop": False})
    seqs.append({"id": "hit.up", "label": "Hit (Up)", "rowIndex": 5, "cols": [4, 5, 6, 7], "loop": False})
    seqs.append({"id": "hit.right", "label": "Hit (Right)", "rowIndex": 5, "cols": [8, 9, 10, 11], "loop": False})
    seqs.append({"id": "hit.left", "label": "Hit (Left)", "rowIndex": 5, "cols": [8, 9, 10, 11], "loop": False, "flipX": True})

    # Row 6: Die
    seqs.append({"id": "die", "label": "Die", "rowIndex": 6, "cols": range(12), "loop": False})

    for seq in seqs:
        frames = []
        for i, c in enumerate(seq['cols']):
            frames.append({
                "index": i,
                "sourceRect": {
                    "x": int(c * 229.333),
                    "y": seq['rowIndex'] * 192,
                    "w": int(229.333),
                    "h": 192
                }
            })
        anim = {
            "id": seq["id"],
            "label": seq.get("label", seq["id"]),
            "rowIndex": seq["rowIndex"],
            "frameCount": len(frames),
            "frameWidth": int(229.333),
            "frameHeight": 192,
            "loop": seq.get("loop", False),
            "reviewStatus": "Draft",
            "flipX": seq.get("flipX", False),
            "frames": frames
        }
        manifest["animations"].append(anim)

    Path("manifests/academy.topdown-slime-player.animations.json").write_text(json.dumps(manifest, indent=2))
    print("Slime manifest created!")

create_slime_manifest()
