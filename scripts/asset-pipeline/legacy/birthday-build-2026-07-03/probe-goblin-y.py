import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png').convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    rgb = arr[..., :3]

    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)

    # Find the dark brown/gray horizontal separator lines
    # The shadow lines are low brightness, low saturation
    line_mask = (sat < 0.3) & (mx < 0.4)
    row_sum = line_mask.sum(axis=1)
    
    # Find peaks in row_sum
    peaks = []
    for y in range(1, len(row_sum)-1):
        if row_sum[y] > 500 and row_sum[y] > row_sum[y-1] and row_sum[y] >= row_sum[y+1]:
            # group nearby peaks
            if not peaks or y - peaks[-1] > 50:
                peaks.append(y)
            else:
                if row_sum[y] > row_sum[peaks[-1]]:
                    peaks[-1] = y
                    
    print(f"Horizontal ground lines: {peaks}")

if __name__ == '__main__':
    main()
