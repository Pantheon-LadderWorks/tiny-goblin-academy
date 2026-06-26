import argparse
from PIL import Image
import numpy as np
from collections import deque
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description="Convert fake-transparent checkerboard background into true PNG alpha transparency.")
    parser.add_argument('--input', type=str, required=True, help="Path to original source sheet")
    parser.add_argument('--output', type=str, required=True, help="Path to derived transparent sheet")
    parser.add_argument('--preview', type=str, required=True, help="Path to save preview image")
    args = parser.parse_args()

    src = Path(args.input)
    img = Image.open(src).convert("RGBA")
    arr = np.array(img).astype(np.float32) / 255.0
    rgb = arr[..., :3]
    h, w = arr.shape[:2]

    # Detect low-saturation gray pixels
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)

    # Gray-ish checkerboard / compression artifacts
    gray_like = (
        (sat < 0.16) &
        (mx > 0.12) & (mx < 0.88) &
        (np.abs(rgb[...,0] - rgb[...,1]) < 0.075) &
        (np.abs(rgb[...,1] - rgb[...,2]) < 0.075) &
        (np.abs(rgb[...,0] - rgb[...,2]) < 0.075)
    )

    visited = np.zeros((h, w), dtype=bool)
    q = deque()

    # Seed from borders
    for x in range(w):
        if gray_like[0, x]:
            visited[0, x] = True; q.append((0, x))
        if gray_like[h-1, x]:
            visited[h-1, x] = True; q.append((h-1, x))
    for y in range(h):
        if gray_like[y, 0]:
            visited[y, 0] = True; q.append((y, 0))
        if gray_like[y, w-1]:
            visited[y, w-1] = True; q.append((y, w-1))

    # Flood fill
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    while q:
        y, x = q.popleft()
        for dy, dx in dirs:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and gray_like[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    # Slightly expand the background mask
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

    out = np.array(img)
    
    # Original alpha channel (all 255)
    out[..., 3] = np.where(mask, 0, out[..., 3])
    
    # Track the amount made transparent
    transparent_pixels = np.sum(out[..., 3] == 0)
    total_pixels = h * w

    # Lightly feather edges
    alpha = out[..., 3].astype(np.float32)
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
    alpha[edge] = np.minimum(alpha[edge], 80)
    out[..., 3] = alpha.astype(np.uint8)

    # Save final sheet
    out_img = Image.fromarray(out, "RGBA")
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_img.save(out_path)

    # Create dark-background preview
    preview_bg = Image.new("RGBA", img.size, (30, 30, 40, 255))
    preview = Image.alpha_composite(preview_bg, out_img)
    preview_path = Path(args.preview)
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    preview.save(preview_path)

    print(f"Input path: {args.input}")
    print(f"Output path: {args.output}")
    print(f"Image dimensions: {w}x{h}")
    print(f"Transparent pixels created: {transparent_pixels} ({transparent_pixels / total_pixels * 100:.2f}%)")
    print(f"Has real alpha: True")
    print(f"Preview path: {args.preview}")

if __name__ == '__main__':
    main()
