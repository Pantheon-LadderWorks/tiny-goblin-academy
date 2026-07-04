import numpy as np
from PIL import Image

def main():
    img = Image.open('assets/academy/derived-cleaned/goblin/tga-platformer-goblin-player-cleaned-v0.1.png')
    arr = np.array(img)
    alpha = arr[..., 3]
    
    crotch_alpha = alpha[472:490, 120:135]
    print(f"Correct crotch average alpha: {np.mean(crotch_alpha)}")

if __name__ == '__main__':
    main()
