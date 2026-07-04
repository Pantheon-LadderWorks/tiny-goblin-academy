import json
from pathlib import Path

def main():
    manifest_path = Path('manifests/academy.platformer-goblin-player.animations.json')
    data = json.loads(manifest_path.read_text(encoding='utf-8'))
    
    col_rects = data['frameGrid']['columnRects']
    row_y = data['frameGrid']['rowRects'][3]['y']
    row_h = data['frameGrid']['rowRects'][3]['h']
    
    # User requested original columns: 0, 1, 4, 5, 7, 0
    requested_cols = [0, 1, 4, 5, 7, 0]
    
    new_frames = []
    for i, col_idx in enumerate(requested_cols):
        col_w = col_rects[col_idx]['w']
        col_x = col_rects[col_idx]['x']
        
        frame = {
            "index": i,
            "sourceRect": {
                "x": col_x,
                "y": row_y,
                "w": col_w,
                "h": row_h
            },
            "durationMs": None,
            "pivot": None
        }
        new_frames.append(frame)

    for anim in data.get('animations', []):
        if anim['id'] == 'platformer-goblin.attack':
            anim['frames'] = new_frames
            anim['frameCount'] = len(new_frames)
            anim['notes'] = "Custom mapped sequence from original columns: 0, 1, 4, 5, 7, 0"

    manifest_path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    main()
