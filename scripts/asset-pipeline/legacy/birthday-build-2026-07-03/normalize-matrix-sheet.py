import argparse
import numpy as np
from PIL import Image
from pathlib import Path
from collections import deque

def create_debug_overlay(cell, margin, flooded_mask):
    # cell is RGBA float32 [0.0, 1.0]
    # Red for margin, Blue for flooded checkerboard, Green for kept content
    debug = np.copy(cell)
    h, w, _ = debug.shape
    
    # 1. Color Margin Red (alpha 0.5)
    debug[:margin, :, :3] = debug[:margin, :, :3] * 0.5 + np.array([1, 0, 0]) * 0.5
    debug[-margin:, :, :3] = debug[-margin:, :, :3] * 0.5 + np.array([1, 0, 0]) * 0.5
    debug[:, :margin, :3] = debug[:, :margin, :3] * 0.5 + np.array([1, 0, 0]) * 0.5
    debug[:, -margin:, :3] = debug[:, -margin:, :3] * 0.5 + np.array([1, 0, 0]) * 0.5
    
    # 2. Color Flooded Checkerboard Blue (alpha 0.5)
    blue_overlay = debug[flooded_mask, :3] * 0.5 + np.array([0, 0, 1]) * 0.5
    debug[flooded_mask, :3] = blue_overlay
    
    # 3. Content Kept Green
    # Content is anywhere alpha > 0 and not flooded and not in margin
    content_mask = (debug[..., 3] > 0) & (~flooded_mask)
    content_mask[:margin, :] = False
    content_mask[-margin:, :] = False
    content_mask[:, :margin] = False
    content_mask[:, -margin:] = False
    
    debug[content_mask, :3] = debug[content_mask, :3] * 0.5 + np.array([0, 1, 0]) * 0.5
    
    # Make sure alpha is 1 so we can see the debug colors
    debug[..., 3] = 1.0
    return debug

def process_sheet(args):
    path = Path(args.image)
    print(f"Normalizing Matrix Sheet (Global Mode): {path.name}")
    img = Image.open(path).convert('RGBA')
    arr = np.array(img).astype(np.float32) / 255.0
    
    h, w, _ = arr.shape
    
    out_arr = arr.copy()
    
    # Global BFS Flood Fill for Checkerboard + Grid Lines
    q = deque()
    # Add border pixels to queue
    for i in range(h):
        q.append((i, 0))
        q.append((i, w - 1))
    for j in range(w):
        q.append((0, j))
        q.append((h - 1, j))
        
    visited = set(q)
    
    while q:
        cy, cx = q.popleft()
        
        # Check if this pixel is "gray" (checkerboard or grid line) or transparent
        c_rgb = out_arr[cy, cx, :3]
        c_diff = float(max(c_rgb)) - float(min(c_rgb))
        is_gray = (c_diff < 0.08) # generous threshold for grayscale
        is_transparent = (out_arr[cy, cx, 3] == 0)
        
        if is_transparent or is_gray:
            out_arr[cy, cx] = [0, 0, 0, 0]
            
            for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
                ny, nx = cy+dy, cx+dx
                if 0 <= ny < h and 0 <= nx < w:
                    if (ny, nx) not in visited:
                        visited.add((ny, nx))
                        q.append((ny, nx))

    # Alpha halo cleanup pass
    gray_halo_mask = (out_arr[..., 3] > 0) & (out_arr[..., 3] < 0.8)
    rgb_diff = np.max(out_arr[..., :3], axis=-1) - np.min(out_arr[..., :3], axis=-1)
    gray_halo_mask &= (rgb_diff < 0.15)
    out_arr[gray_halo_mask] = [0, 0, 0, 0]
    
    # Create debug overlay
    debug_arr = arr.copy()
    bg_mask = (out_arr[..., 3] == 0)
    debug_arr[bg_mask] = [0, 0, 1, 1] # Blue background for erased areas
    
    out_img = Image.fromarray((out_arr * 255).astype(np.uint8))
    debug_img = Image.fromarray((debug_arr * 255).astype(np.uint8))
    
    out_path = path.parent / args.out
    debug_path = path.parent / args.out.replace('.png', '-debug.png')
    
    out_img.save(out_path)
    debug_img.save(debug_path)
    
    print(f"Saved cleaned sheet: {out_path}")
    print(f"Saved debug sheet: {debug_path}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', required=True)
    parser.add_argument('--cols', type=int, default=16)
    parser.add_argument('--rows', type=int, default=8)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    
    process_sheet(args)

if __name__ == '__main__':
    main()
