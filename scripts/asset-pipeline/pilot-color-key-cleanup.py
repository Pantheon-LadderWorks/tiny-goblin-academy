import numpy as np
from PIL import Image
from pathlib import Path
import os

def main():
    src = Path('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png')
    out_path = Path('assets/academy/evidence/h5-10a/color-key-diff-map.png')
    out_path.parent.mkdir(parents=True, exist_ok=True)
    
    img = Image.open(src).convert("RGBA")
    arr = np.array(img).astype(np.float32) / 255.0
    rgb = arr[..., :3]
    h, w = arr.shape[:2]

    # Detect low-saturation gray pixels
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)

    # Gray-ish checkerboard / compression artifacts
    gray_like = (
        (sat < 0.16) &
        (mx > 0.12) & (mx < 0.88) &
        (np.abs(rgb[...,0] - rgb[...,1]) < 0.075) &
        (np.abs(rgb[...,1] - rgb[...,2]) < 0.075) &
        (np.abs(rgb[...,0] - rgb[...,2]) < 0.075)
    )
    
    out = np.array(img)
    # Color key: Neon Pink
    out[gray_like] = [255, 0, 255, 255]
    
    out_img = Image.fromarray(out, "RGBA")
    out_img.save(out_path)
    print("Difference map saved to:", out_path)

if __name__ == '__main__':
    main()
