import json
from pathlib import Path

def main():
    manifest_path = Path('manifests/academy.platformer-training-dummy-enemy.animations.json')
    data = json.loads(manifest_path.read_text(encoding='utf-8'))
    
    # 5 rows instead of 6
    row_divs = [0, 307, 614, 922, 1229, 1536]
    rows = []
    for i in range(5):
        rows.append({"row": i, "y": row_divs[i], "h": row_divs[i+1] - row_divs[i]})
        
    data['frameGrid']['rows'] = 5
    data['frameGrid']['rowRects'] = rows
    
    # We maintain the strict 275px columns
    columns = data['frameGrid']['columnRects']
    
    seq_defs = [
        {"id": "platformer-training-dummy.idle", "label": "Idle", "rowIndex": 0, "loop": True, "cols": range(1, 7)},
        {"id": "platformer-training-dummy.patrol", "label": "Patrol / Hop", "rowIndex": 1, "loop": True, "cols": range(1, 10)},
        {"id": "platformer-training-dummy.attack", "label": "Attack", "rowIndex": 2, "loop": False, "cols": range(1, 7)},
        {"id": "platformer-training-dummy.hit", "label": "Hit", "rowIndex": 3, "loop": False, "cols": range(1, 7)},
        {"id": "platformer-training-dummy.die", "label": "Die", "rowIndex": 4, "loop": False, "cols": range(1, 10)}
    ]
    
    animations = []
    for seq in seq_defs:
        r_info = rows[seq['rowIndex']]
        rowY = r_info['y']
        rowH = r_info['h']
        
        frames = []
        for i, col_idx in enumerate(seq['cols']):
            col = columns[col_idx]
            frames.append({
                "index": i,
                "sourceRect": {
                    "x": col["x"],
                    "y": rowY,
                    "w": col["w"],
                    "h": rowH
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
