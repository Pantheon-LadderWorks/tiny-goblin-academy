from PIL import Image
import numpy as np

def remove_pink_bg(path, out_path):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    
    # Magenta threshold: R > 150, B > 150, G < 100
    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]
    
    pink_mask = (r > 150) & (b > 150) & (g < 100)
    
    # We can also use connected components to only remove pink connected to the edges,
    # but let's see how much this removes.
    arr[pink_mask, 3] = 0 # set alpha to 0 for pink pixels
    
    out_img = Image.fromarray(arr)
    out_img.save(out_path)
    print(f"Removed pink from {path} -> {out_path}")

remove_pink_bg('assets/academy/creatures/slime/tga-topdown-slime-v2-idle-move.png', 'assets/academy/creatures/slime/tga-topdown-slime-v2-idle-move-cleaned.png')
remove_pink_bg('assets/academy/creatures/slime/tga-topdown-slime-v2-action.png', 'assets/academy/creatures/slime/tga-topdown-slime-v2-action-cleaned.png')
