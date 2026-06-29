# Legacy asset census/cartography tool.
# Retained for reference during H5 asset pipeline migration.
# Not the active source of truth for runtime manifests.
# Do not run as part of default validation without explicit approval.

import os
import json
from PIL import Image

def analyze_image(path):
    try:
        with Image.open(path) as img:
            width, height = img.size
            mode = img.mode
            alpha_info = {}
            alpha_state = 'not-alpha-relevant'
            
            if mode in ('RGBA', 'LA') or (mode == 'P' and 'transparency' in img.info):
                if mode == 'P':
                    img = img.convert('RGBA')
                alpha_channel = img.split()[-1]
                min_alpha, max_alpha = alpha_channel.getextrema()
                alpha_info = {'min_alpha': min_alpha, 'max_alpha': max_alpha}
                
                if min_alpha == 255 and max_alpha == 255:
                    alpha_state = 'alpha-channel-all-opaque'
                elif min_alpha < 255:
                    alpha_state = 'real-alpha-needs-review'
            else:
                alpha_state = 'opaque-illustration-background'
                
            file_size = os.path.getsize(path)
            
            return {
                'repo_path': path.replace('\\\\', '/'),
                'filename': os.path.basename(path),
                'parent_folder': os.path.dirname(path).replace('\\\\', '/'),
                'width': width,
                'height': height,
                'mode': mode,
                'alpha_state_detected': alpha_state,
                'min_alpha': alpha_info.get('min_alpha', None),
                'max_alpha': alpha_info.get('max_alpha', None),
                'file_size': file_size
            }
    except Exception as e:
        return {'repo_path': path, 'error': str(e)}

results = []
for root, dirs, files in os.walk('assets'):
    for file in files:
        if file.lower().endswith('.png'):
            full_path = os.path.join(root, file)
            results.append(analyze_image(full_path))

with open('metadata_dump.json', 'w') as f:
    json.dump(results, f, indent=2)

print(f'Analyzed {len(results)} images.')
