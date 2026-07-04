import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png').convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    rgb = arr[..., :3]

    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)

    # Find the dark vertical separator lines
    line_mask = (sat < 0.3) & (mx < 0.4)
    col_sum = line_mask.sum(axis=0)
    
    peaks = []
    for x in range(1, len(col_sum)-1):
        if col_sum[x] > 500 and col_sum[x] > col_sum[x-1] and col_sum[x] >= col_sum[x+1]:
            if not peaks or x - peaks[-1] > 50:
                peaks.append(x)
            else:
                if col_sum[x] > col_sum[peaks[-1]]:
                    peaks[-1] = x
                    
    print(f"Vertical separator lines: {peaks}")

if __name__ == '__main__':
    main()
