import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png').convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    rgb = arr[..., :3]

    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)

    gray_like = (
        (sat < 0.16) &
        (mx > 0.12) & (mx < 0.88) &
        (np.abs(rgb[...,0] - rgb[...,1]) < 0.075) &
        (np.abs(rgb[...,1] - rgb[...,2]) < 0.075) &
        (np.abs(rgb[...,0] - rgb[...,2]) < 0.075)
    )
    
    print("gray_like for x=128, y=472 to 491:")
    for y in range(472, 492):
        print(f"y={y}: {gray_like[y, 128]}")

if __name__ == '__main__':
    main()
