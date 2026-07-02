import numpy as np
from PIL import Image
from collections import deque
from pathlib import Path

def main():
    src = Path('assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png')
    img = Image.open(src).convert("RGBA")
    arr = np.array(img).astype(np.float32) / 255.0
    h, w = arr.shape[:2]
    
    # Pre-Crop: The Precise Canyon Crop (H5.10C)
    ground_lines = [254, 511, 768, 1025, 1280, 1536]
    for center_y in ground_lines:
        y_start = max(0, center_y - 20)
        y_end = min(h, center_y + 3)
        arr[y_start:y_end, :, 3] = 0.0

    rgb = arr[..., :3]
    alpha = arr[..., 3]

    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)

    gray_like = (
        (sat < 0.16) &
        (mx > 0.12) & (mx < 0.88) &
        (np.abs(rgb[...,0] - rgb[...,1]) < 0.075) &
        (np.abs(rgb[...,1] - rgb[...,2]) < 0.075) &
        (np.abs(rgb[...,0] - rgb[...,2]) < 0.075)
    )
    
    gray_like = gray_like | (alpha == 0.0)

    visited = np.zeros((h, w), dtype=bool)
    q = deque()

    for x in range(w):
        if gray_like[0, x]: visited[0, x] = True; q.append((0, x))
        if gray_like[h-1, x]: visited[h-1, x] = True; q.append((h-1, x))
    for y in range(h):
        if gray_like[y, 0]: visited[y, 0] = True; q.append((y, 0))
        if gray_like[y, w-1]: visited[y, w-1] = True; q.append((y, w-1))

    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    while q:
        y, x = q.popleft()
        for dy, dx in dirs:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and gray_like[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    mask = visited.copy()
    for _ in range(2):
        expanded = mask.copy()
        for dy, dx in dirs + [(1,1), (1,-1), (-1,1), (-1,-1)]:
            shifted = np.zeros_like(mask)
            ys = slice(max(0, dy), h + min(0, dy))
            xs = slice(max(0, dx), w + min(0, dx))
            ysrc = slice(max(0, -dy), h - max(0, dy))
            xsrc = slice(max(0, -dx), w - max(0, dx))
            shifted[ys, xs] = mask[ysrc, xsrc]
            expanded |= (shifted & gray_like)
        mask = expanded

    out = (arr * 255).astype(np.uint8)
    out[..., 3] = np.where(mask, 0, out[..., 3])
    
    out_alpha = out[..., 3].astype(np.float32)
    neighbor_transparent = np.zeros_like(mask)
    for dy, dx in dirs + [(1,1), (1,-1), (-1,1), (-1,-1)]:
        shifted = np.zeros_like(mask)
        ys = slice(max(0, dy), h + min(0, dy))
        xs = slice(max(0, dx), w + min(0, dx))
        ysrc = slice(max(0, -dy), h - max(0, dy))
        xsrc = slice(max(0, -dx), w - max(0, dx))
        shifted[ys, xs] = mask[ysrc, xsrc]
        neighbor_transparent |= shifted

    edge = (~mask) & neighbor_transparent & gray_like
    out_alpha[edge] = np.minimum(out_alpha[edge], 80)
    out[..., 3] = out_alpha.astype(np.uint8)

    out_path = Path('assets/academy/derived-cleaned/goblin/tga-platformer-goblin-player-cleaned-v0.1.png')
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_img = Image.fromarray(out, "RGBA")
    out_img.save(out_path)
    print("Saved cleaned image to:", out_path)

if __name__ == '__main__':
    main()
