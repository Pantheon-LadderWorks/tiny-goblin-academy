import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/creatures/training-dummy/tga-platformer-training-dummy-enemy-concept-v0.1.png').convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    alpha = arr[..., 3]
    
    # We want to find the y boundaries where alpha > 0
    row_sums = np.sum(alpha > 0.1, axis=1)
    
    in_row = False
    y_starts = []
    y_ends = []
    for y in range(len(row_sums)):
        if row_sums[y] > 0 and not in_row:
            in_row = True
            y_starts.append(y)
        elif row_sums[y] == 0 and in_row:
            in_row = False
            y_ends.append(y)
            
    if in_row:
        y_ends.append(len(row_sums))
        
    print("Detected Y ranges with actual pixels:")
    for i, (s, e) in enumerate(zip(y_starts, y_ends)):
        print(f"Row {i}: y_start={s}, y_end={e}, height={e-s}")
        
    # Let's also check the grid math
    print("\nStrict 256px math grid would be:")
    for i in range(6):
        print(f"Row {i}: y={i*256} to {(i+1)*256}")

if __name__ == '__main__':
    main()
