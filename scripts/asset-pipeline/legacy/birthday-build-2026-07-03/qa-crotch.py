import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png').convert('RGBA')
    arr = np.array(img)
    
    # Print the pixels between the legs for the first frame of walk (row 1)
    # y=256+210=466 down to 495
    print("Pixels between legs (y=466 to 495) at x=128:")
    for y in range(466, 496):
        print(f"y={y}: {arr[y, 128]}")

if __name__ == '__main__':
    main()
