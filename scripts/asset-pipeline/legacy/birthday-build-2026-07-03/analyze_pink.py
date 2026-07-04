from PIL import Image
import numpy as np

def analyze_sheet(path):
    img = Image.open(path).convert('RGB')
    arr = np.array(img)
    print(f"Sheet {path}: {img.width}x{img.height}")
    
    # The top-left corner is likely the background color
    bg_color = arr[0, 0]
    print(f"Top-left color: {bg_color}")
    
    # Let's count how many pixels have this color
    mask = np.all(arr == bg_color, axis=-1)
    print(f"Pixels matching background exactly: {np.sum(mask)} / {img.width * img.height}")

analyze_sheet('assets/academy/creatures/slime/tga-topdown-slime-v2-idle-move.png')
analyze_sheet('assets/academy/creatures/slime/tga-topdown-slime-v2-action.png')
