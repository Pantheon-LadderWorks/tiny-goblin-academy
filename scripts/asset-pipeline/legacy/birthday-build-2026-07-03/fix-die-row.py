import json
from pathlib import Path

def main():
    manifest_path = Path('manifests/academy.platformer-training-dummy-enemy.animations.json')
    data = json.loads(manifest_path.read_text(encoding='utf-8'))
    
    # We need to map the Die animation to row 5, not row 4. Row 4 is blank!
    for anim in data.get('animations', []):
        if anim['id'] == 'platformer-training-dummy.die':
            anim['rowIndex'] = 5
            anim['rowY'] = 1280
            # Also update all the frames in that animation to use y=1280
            for frame in anim.get('frames', []):
                frame['sourceRect']['y'] = 1280

    manifest_path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    main()
