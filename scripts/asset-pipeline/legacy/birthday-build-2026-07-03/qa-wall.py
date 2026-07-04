import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png').convert('RGBA')
    arr = np.array(img)
    
    # Print the pixels above the cut line for the first frame (walk, row 1)
    # Cut line is at row 1, y=256+237=493
    print("Pixels above cut line (y=490 to 493):")
    for y in range(490, 494):
        print(f"y={y}: {arr[y, 120:135]}")

if __name__ == '__main__':
    main()
