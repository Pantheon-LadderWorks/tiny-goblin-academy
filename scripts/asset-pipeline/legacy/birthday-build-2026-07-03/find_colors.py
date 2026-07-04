from PIL import Image
import numpy as np

img = Image.open('assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png').convert('RGB')
arr = np.array(img)

# The top-left corner is part of the grid or checkerboard
print("Top left 10x10 pixels:")
print(arr[0:10, 0:10])

# Let's find the most common colors in the image (likely the checkerboard colors)
from collections import Counter
pixels = [tuple(p) for p in arr.reshape(-1, 3)]
counts = Counter(pixels)
print("Most common colors:")
for color, count in counts.most_common(5):
    print(f"Color {color}: {count} pixels")
