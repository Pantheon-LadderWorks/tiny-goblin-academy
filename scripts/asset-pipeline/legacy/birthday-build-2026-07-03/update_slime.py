import json
from pathlib import Path

def create_slime_manifest():
    manifest = {
        "domain": "topdown-slime-player",
        "operationalType": "character-animation-sheet",
        "sourceSheet": "assets/academy/creatures/slime/tga-topdown-slime-player-cleaned-v0.1.png",
        "cellWidth": 229.333,
        "cellHeight": 192,
        "animations": [
            { "id": "idle.down", "label": "Idle (Down)", "row": 0, "cols": [0, 1, 2, 3], "loop": True },
            { "id": "idle.up", "label": "Idle (Up)", "row": 0, "cols": [5, 6, 7, 8], "loop": True },
            { "id": "idle.right", "label": "Idle (Right)", "row": 0, "cols": [10, 11], "loop": True },
            { "id": "idle.left", "label": "Idle (Left)", "row": 0, "cols": [10, 11], "loop": True, "flipX": True },
            
            { "id": "walk.down", "label": "Walk (Down)", "row": 1, "cols": [0, 1, 2, 3], "loop": True },
            { "id": "walk.up", "label": "Walk (Up)", "row": 1, "cols": [4, 5, 6, 7], "loop": True },
            { "id": "walk.right", "label": "Walk (Right)", "row": 1, "cols": [8, 9, 10, 11], "loop": True },
            { "id": "walk.left", "label": "Walk (Left)", "row": 1, "cols": [8, 9, 10, 11], "loop": True, "flipX": True },

            { "id": "attack.down", "label": "Attack (Down)", "row": 4, "cols": [0, 1, 2, 3, 4], "loop": False },
            { "id": "attack.up", "label": "Attack (Up)", "row": 4, "cols": [5, 6, 7, 8], "loop": False },
            { "id": "attack.right", "label": "Attack (Right)", "row": 4, "cols": [9, 10, 11], "loop": False },
            { "id": "attack.left", "label": "Attack (Left)", "row": 4, "cols": [9, 10, 11], "loop": False, "flipX": True },
            
            { "id": "hit.down", "label": "Hit (Down)", "row": 5, "cols": [0, 1, 2, 3], "loop": False },
            { "id": "hit.up", "label": "Hit (Up)", "row": 5, "cols": [4, 5, 6, 7], "loop": False },
            { "id": "hit.right", "label": "Hit (Right)", "row": 5, "cols": [8, 9, 10, 11], "loop": False },
            { "id": "hit.left", "label": "Hit (Left)", "row": 5, "cols": [8, 9, 10, 11], "loop": False, "flipX": True },

            { "id": "die", "label": "Die", "row": 6, "cols": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "loop": False }
        ]
    }
    Path("manifests/academy.topdown-slime-player.animations.json").write_text(json.dumps(manifest, indent=2))

create_slime_manifest()
