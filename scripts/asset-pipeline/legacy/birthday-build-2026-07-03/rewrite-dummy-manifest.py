import json
from pathlib import Path

def main():
    manifest_path = Path('manifests/academy.platformer-training-dummy-enemy.animations.json')
    data = json.loads(manifest_path.read_text(encoding='utf-8'))
    
    # Update frameGrid
    data['frameGrid'] = {
        "columns": 10,
        "rows": 6,
        "cellWidth": 275,
        "frameHeightCropped": None,
        "columnRects": [{"col": i, "x": i * 275, "w": 275} for i in range(10)],
        "rowRects": [{"row": i, "y": i * 256, "h": 256} for i in range(6)]
    }
    
    # Definitions
    # 1. idle: cols 1-6
    # 2. patrol: cols 1-9
    # 3. attack: cols 1-6
    # 4. hit: cols 1-6
    # 5. die: cols 1-9
    
    seq_defs = [
        {"id": "platformer-training-dummy.idle", "label": "Idle", "rowIndex": 0, "loop": True, "cols": range(1, 7)},
        {"id": "platformer-training-dummy.patrol", "label": "Patrol / Hop", "rowIndex": 1, "loop": True, "cols": range(1, 10)},
        {"id": "platformer-training-dummy.attack", "label": "Attack", "rowIndex": 2, "loop": False, "cols": range(1, 7)},
        {"id": "platformer-training-dummy.hit", "label": "Hit", "rowIndex": 3, "loop": False, "cols": range(1, 7)},
        {"id": "platformer-training-dummy.die", "label": "Die", "rowIndex": 4, "loop": False, "cols": range(1, 10)}
    ]
    
    animations = []
    for seq in seq_defs:
        rowY = seq['rowIndex'] * 256
        frames = []
        for i, col in enumerate(seq['cols']):
            frames.append({
                "index": i,
                "sourceRect": {
                    "x": col * 275,
                    "y": rowY,
                    "w": 275,
                    "h": 256
                },
                "durationMs": None,
                "pivot": None
            })
            
        animations.append({
            "id": seq["id"],
            "label": seq["label"],
            "type": "animation-sequence",
            "rowIndex": seq["rowIndex"],
            "rowY": rowY,
            "frameCount": len(frames),
            "loop": seq["loop"],
            "reviewStatus": "needs-human-review",
            "usage": "draft-review",
            "notes": "",
            "frames": frames
        })
        
    data['animations'] = animations
    
    manifest_path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    main()
