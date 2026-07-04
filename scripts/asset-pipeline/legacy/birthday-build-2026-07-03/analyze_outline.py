import numpy as np
from PIL import Image

def analyze_outline(path):
    img = Image.open(path).convert('RGB')
    arr = np.array(img).astype(np.float32) / 255.0
    
    # We found the most common colors in the image.
    # What about the darkest colors that are NOT part of the grid?
    # Grid is around [0, 0, 0] to [50, 50, 50] and has low saturation.
    
    # Let's find pixels that are dark but have some saturation
    dark_pixels = arr[np.max(arr, axis=-1) < 0.3]
    diffs = np.max(dark_pixels, axis=-1) - np.min(dark_pixels, axis=-1)
    
    # Print max diff for dark pixels to see if they are colored
    print(f"{path}: Max saturation in dark pixels: {np.max(diffs)}")

analyze_outline('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png')
analyze_outline('assets/academy/creatures/soldier/tga-topdown-soldier-enemy-v0.1.png')
