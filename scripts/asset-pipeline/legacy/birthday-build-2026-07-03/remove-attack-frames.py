import json
from pathlib import Path

def main():
    manifest_path = Path('manifests/academy.platformer-goblin-player.animations.json')
    data = json.loads(manifest_path.read_text(encoding='utf-8'))
    
    for anim in data.get('animations', []):
        if anim['id'] == 'platformer-goblin.attack':
            # Remove frames at index 2 and 3
            # The frames are currently 0, 1, 2, 3, 4, 5, 6, 7
            new_frames = []
            new_idx = 0
            for f in anim['frames']:
                orig_idx = f['index']
                if orig_idx not in [2, 3]:
                    f['index'] = new_idx
                    new_frames.append(f)
                    new_idx += 1
            
            anim['frames'] = new_frames
            anim['frameCount'] = len(new_frames)
            anim['notes'] = "Removed original frames 2 and 3 to improve animation pacing."

    manifest_path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    main()
