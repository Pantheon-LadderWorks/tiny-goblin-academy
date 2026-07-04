import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/creatures/training-dummy/tga-platformer-training-dummy-enemy-concept-v0.1.png').convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    
    # We need to find the dummy. It is mostly brown/wood colored, and the background is dark gray.
    # Let's filter out the dark gray background.
    # Background seems to be around (42, 45, 52) roughly. Let's just use alpha?
    # Wait, the training dummy concept image doesn't have alpha! It has a baked background!
    
    # Let's find the variance of pixels horizontally.
    # The dummy has bright pixels (yellow, brown, white).
    # Background is a flat color or gradient.
    
    gray = np.mean(arr[..., :3], axis=2)
    # Background is dark, maybe mean < 0.3. Let's look for pixels with high brightness or high variance.
    # Let's find rows that have significant bright pixels (e.g., > 0.4)
    bright_mask = gray > 0.4
    row_bright_counts = np.sum(bright_mask, axis=1)
    
    in_row = False
    y_starts = []
    y_ends = []
    for y in range(len(row_bright_counts)):
        if row_bright_counts[y] > 10 and not in_row:
            in_row = True
            y_starts.append(y)
        elif row_bright_counts[y] <= 10 and in_row:
            in_row = False
            y_ends.append(y)
            
    if in_row:
        y_ends.append(len(row_bright_counts))
        
    print("Detected Y ranges with bright pixels (the dummy):")
    for i, (s, e) in enumerate(zip(y_starts, y_ends)):
        print(f"Sprite bounds {i}: y_start={s}, y_end={e}, height={e-s}, center={(s+e)/2}")
        
if __name__ == '__main__':
    main()
