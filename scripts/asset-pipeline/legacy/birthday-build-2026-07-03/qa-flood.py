import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/derived-cleaned/goblin/tga-platformer-goblin-player-cleaned-v0.1.png')
    arr = np.array(img)
    alpha = arr[..., 3]
    
    # Check bottom 19px of the first row (y=237 to 255)
    # They should be mostly transparent
    bottom_alpha = alpha[237:256, :]
    print(f"Bottom band average alpha: {np.mean(bottom_alpha)}")
    
    # Check between the legs of a goblin.
    # Frame 0 of walk is at x=0, y=256. The legs are around y=256+180=436 to 256+210=466.
    # The middle x is around 128. Let's check a box between the legs: x=100..150, y=440..460
    crotch_alpha = alpha[440:460, 100:150]
    print(f"Between legs average alpha: {np.mean(crotch_alpha)}")

if __name__ == '__main__':
    main()
