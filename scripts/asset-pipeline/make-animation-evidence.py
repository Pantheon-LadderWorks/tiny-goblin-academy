#!/usr/bin/env python
"""Generate synchronized animation-sequence evidence from an animation manifest.

Outputs (parallel to make-region-evidence.py standard):
- <domain>-sequences-bbox-overlay.png   — full sheet with row annotations + frame cell grid
- <domain>-sequences-contact-sheet.png  — each sequence as a labeled strip of crops
- <domain>-sequences-table-preview.png  — table: id, label, rowY, frameCount, frameSize, loop, reviewStatus

This helper is intentionally review/evidence-only. It does not modify manifests,
source images, derived images, or runtime code.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path(r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf"),
        Path(r"C:\Windows\Fonts\arialbd.ttf"  if bold else r"C:\Windows\Fonts\arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


F_TITLE = font(34, True)
F_HEAD  = font(20, True)
F_BODY  = font(16)
F_SMALL = font(13)


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def load_manifest(path: Path) -> dict:
    if not path.exists():
        fail(f"Manifest not found: {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"Manifest JSON parse failed: {exc}")


SEQ_COLORS = [
    (255, 110, 110),   # red
    (255, 190, 90),    # orange
    (120, 220, 160),   # green
    (120, 180, 255),   # blue
    (230, 140, 255),   # purple
    (255, 230, 80),    # yellow
]


def dark_composite(crop: Image.Image, size: tuple[int, int] | None = None) -> Image.Image:
    crop = crop.convert("RGBA")
    if size:
        crop.thumbnail(size, Image.Resampling.LANCZOS)
        base = Image.new("RGBA", size, (24, 26, 32, 255))
        base.alpha_composite(crop, ((size[0] - crop.width) // 2, (size[1] - crop.height) // 2))
    else:
        base = Image.new("RGBA", crop.size, (24, 26, 32, 255))
        base.alpha_composite(crop)
    return base.convert("RGB")


def generate_sequences_bbox_overlay(
    animations: list[dict],
    source_sheet: Image.Image,
    frame_grid: dict,
    out_path: Path,
) -> None:
    """Full sheet with row highlight bands and frame cell grid — one band per sequence."""
    cell_w = frame_grid.get("cellWidth", 256)
    cell_h = frame_grid.get("cellHeight", 256)

    scale = min(0.5, 1500 / source_sheet.width)
    sw, sh = int(source_sheet.width * scale), int(source_sheet.height * scale)

    canvas_w = max(sw + 40, 1200)
    canvas = Image.new("RGB", (canvas_w, sh + 200), (18, 20, 24))
    draw = ImageDraw.Draw(canvas)

    draw.text((24, 18), "Animation Sequence BBox Overlay — Draft Review", font=F_TITLE, fill=(255, 244, 204))
    draw.text((24, 66), "Row highlight bands and frame cell grid over source sheet. Indexes match contact sheet/table. Not runtime-approved.", font=F_BODY, fill=(225, 230, 240))
    draw.text((24, 92), f"Sheet: {source_sheet.width}x{source_sheet.height}  |  Cell: {cell_w}x{cell_h}  |  CroppedH: {frame_grid.get('frameHeightCropped', cell_h)}  |  ShadowBand cropped.", font=F_SMALL, fill=(180, 200, 220))

    thumb = source_sheet.copy().convert("RGB")
    thumb.thumbnail((sw, sh), Image.Resampling.LANCZOS)
    TX, TY = 20, 130
    canvas.paste(thumb, (TX, TY))

    # Draw row band highlights + sequence label + frame cell columns
    for idx, anim in enumerate(animations):
        color = SEQ_COLORS[idx % len(SEQ_COLORS)]
        row_y_src = anim.get("rowY", idx * cell_h)
        n_frames = anim.get("frameCount", 1)
        frame_h_src = anim.get("frameHeight", cell_h)

        # band top/bottom in canvas coords
        band_top    = TY + int(row_y_src * scale)
        band_bot    = TY + int((row_y_src + frame_h_src) * scale)

        # semi-transparent overlay band (draw rows of dots)
        for yy in range(band_top, band_bot, 3):
            draw.line([(TX, yy), (TX + thumb.width, yy)], fill=(*color, 40), width=1)

        # solid top/bottom border
        draw.line([(TX - 4, band_top), (TX + thumb.width + 4, band_top)], fill=color, width=2)
        draw.line([(TX - 4, band_bot), (TX + thumb.width + 4, band_bot)], fill=color, width=2)

        # frame cell vertical dividers
        for f in range(n_frames + 1):
            fx = TX + int(f * cell_w * scale)
            draw.line([(fx, band_top), (fx, band_bot)], fill=color, width=1)

        # index badge
        badge_x = TX - 4
        badge_y = band_top
        draw.rectangle([badge_x - 30, badge_y, badge_x, badge_y + 22], fill=color)
        draw.text((badge_x - 25, badge_y + 3), str(idx + 1), font=F_SMALL, fill=(0, 0, 0))

        # right-side label
        lx = TX + thumb.width + 8
        draw.text((lx, band_top),      f"{idx + 1}. {anim.get('label', anim['id'])}", font=F_SMALL, fill=color)
        draw.text((lx, band_top + 18), f"frames: {n_frames}  y:{row_y_src}  loop:{anim.get('loop', False)}", font=F_SMALL, fill=(200, 210, 230))

    canvas.save(out_path)


def generate_sequences_contact_sheet(
    animations: list[dict],
    crop_sheet: Image.Image,
    out_path: Path,
) -> None:
    """Each animation row rendered as a horizontal strip of frame crops."""
    # Determine the widest strip we'll need
    max_frames = max(len(a.get("frames", [])) for a in animations)
    thumb_w = 160
    thumb_h = 140
    pad = 16
    header_h = 110
    row_h = thumb_h + 60
    strip_label_w = 220

    canvas_w = strip_label_w + max_frames * (thumb_w + pad) + pad + 40
    canvas_h = header_h + len(animations) * (row_h + pad) + pad
    canvas = Image.new("RGB", (canvas_w, canvas_h), (18, 20, 24))
    draw = ImageDraw.Draw(canvas)

    draw.text((24, 18), "Animation Sequence Contact Sheet — Draft Review", font=F_TITLE, fill=(255, 244, 204))
    draw.text((24, 66), "Each row is one animation sequence. Frame crops from source sheet. Indexes match overlay and table. Not runtime-approved.", font=F_BODY, fill=(225, 230, 240))

    for seq_idx, anim in enumerate(animations):
        color = SEQ_COLORS[seq_idx % len(SEQ_COLORS)]
        row_y_canvas = header_h + seq_idx * (row_h + pad)

        # sequence label strip
        draw.rounded_rectangle(
            [20, row_y_canvas, strip_label_w - 10, row_y_canvas + row_h],
            radius=10, fill=(31, 34, 42), outline=color, width=2,
        )
        draw.text((30, row_y_canvas + 8),  f"{seq_idx + 1}. {anim.get('label', anim['id'])}", font=F_HEAD, fill=color)
        draw.text((30, row_y_canvas + 34), f"row {anim.get('rowIndex', seq_idx)}  y={anim.get('rowY', 0)}", font=F_SMALL, fill=(200, 210, 230))
        draw.text((30, row_y_canvas + 52), f"{len(anim.get('frames', []))} frames", font=F_SMALL, fill=(200, 210, 230))
        loop_label = "loop" if anim.get("loop") else "one-shot"
        draw.text((30, row_y_canvas + 70), loop_label, font=F_SMALL, fill=(180, 220, 180) if anim.get("loop") else (220, 180, 180))
        draw.text((30, row_y_canvas + 90), anim.get("reviewStatus", ""), font=F_SMALL, fill=(200, 190, 120))

        for frame_idx, frame in enumerate(anim.get("frames", [])):
            rect = frame.get("sourceRect", {})
            fx, fy = rect.get("x", 0), rect.get("y", 0)
            fw, fh = rect.get("w", 256), rect.get("h", 237)
            crop = crop_sheet.crop((fx, fy, fx + fw, fy + fh))
            preview = dark_composite(crop, (thumb_w, thumb_h))
            cx = strip_label_w + frame_idx * (thumb_w + pad) + pad
            cy = row_y_canvas + 4
            draw.rounded_rectangle([cx - 4, cy - 4, cx + thumb_w + 4, cy + thumb_h + 34], radius=8, fill=(28, 32, 40), outline=(*color, 120), width=1)
            canvas.paste(preview, (cx, cy))
            # frame number
            draw.ellipse([cx, cy, cx + 22, cy + 22], fill=color)
            draw.text((cx + 4, cy + 4), str(frame_idx), font=F_SMALL, fill=(0, 0, 0))
            draw.text((cx, cy + thumb_h + 6), f"x:{fx}", font=F_SMALL, fill=(200, 210, 230))
            draw.text((cx, cy + thumb_h + 20), f"y:{fy}", font=F_SMALL, fill=(200, 210, 230))

    canvas.save(out_path)


def generate_sequences_table_preview(animations: list[dict], out_path: Path) -> None:
    """Table preview: id, label, rowIndex, rowY, frameCount, frameSize, loop, reviewStatus."""
    row_h = 38
    table_w = 2200
    table_h = 160 + row_h * (len(animations) + 2)
    canvas = Image.new("RGB", (table_w, table_h), (18, 20, 24))
    draw = ImageDraw.Draw(canvas)
    draw.text((24, 18), "Animation Sequence Table Preview — Draft Review", font=F_TITLE, fill=(255, 244, 204))
    draw.text((24, 66), "Required fields: id, rowIndex, rowY, frameCount, frameWidth/Height, loop, reviewStatus. Not runtime-approved.", font=F_BODY, fill=(225, 230, 240))

    columns = [
        ("idx",         50),
        ("id",          520),
        ("label",       220),
        ("rowIndex",     90),
        ("rowY",         80),
        ("frameCount",  110),
        ("frameSize",   160),
        ("loop",         80),
        ("reviewStatus",240),
        ("usage",       180),
    ]
    x0, y = 24, 120
    x = x0
    for name, width in columns:
        draw.rectangle([x, y, x + width, y + row_h], fill=(45, 51, 64), outline=(90, 105, 130))
        draw.text((x + 8, y + 10), name, font=F_SMALL, fill=(255, 244, 204))
        x += width
    y += row_h

    for idx, anim in enumerate(animations):
        x = x0
        fill = (27, 30, 38) if idx % 2 else (32, 36, 45)
        color = SEQ_COLORS[idx % len(SEQ_COLORS)]
        fw = anim.get("frameWidth", 256)
        fh = anim.get("frameHeight", 237)
        values = [
            str(idx + 1),
            anim["id"],
            anim.get("label", ""),
            str(anim.get("rowIndex", idx)),
            str(anim.get("rowY", idx * 256)),
            str(anim.get("frameCount", len(anim.get("frames", [])))),
            f"{fw}x{fh}",
            "yes" if anim.get("loop") else "no",
            anim.get("reviewStatus", ""),
            anim.get("usage", ""),
        ]
        for value, (_, width) in zip(values, columns):
            draw.rectangle([x, y, x + width, y + row_h], fill=fill, outline=(64, 74, 90))
            draw.text((x + 8, y + 10), value[: max(6, width // 8)], font=F_SMALL, fill=(230, 235, 240))
            x += width
        # color badge on left
        draw.rectangle([x0, y + 8, x0 + 6, y + row_h - 8], fill=color)
        y += row_h

    canvas.save(out_path)


def generate_flipbook_html(manifest: dict, out_path: Path, root_dir: Path) -> None:
    import os
    
    # Target image to load: derivedSheet if exists, else sourceSheet
    image_rel_path = manifest.get("derivedSheet") or manifest.get("sourceSheet", "")
    image_abs_path = root_dir / image_rel_path
    
    # Calculate relative path from the HTML file's directory to the image
    html_to_image = os.path.relpath(image_abs_path, out_path.parent).replace('\\', '/')
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{manifest.get('domain', 'Animation')} Flipbook</title>
    <style>
        body {{
            background-color: #121418;
            color: #e1e6f0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            margin: 0;
        }}
        h1 {{
            color: #fff4cc;
            margin-bottom: 8px;
        }}
        p {{
            color: #b4c8dc;
            margin-top: 0;
            margin-bottom: 24px;
        }}
        .canvas-container {{
            background-color: #181a20;
            border: 2px solid #2d3340;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            min-width: 300px;
        }}
        canvas {{
            background-color: #181a20;
            image-rendering: pixelated;
            max-width: 100%;
        }}
        .controls {{
            display: flex;
            gap: 16px;
            background-color: #1f222a;
            padding: 16px 24px;
            border-radius: 8px;
            border: 1px solid #2d3340;
            align-items: center;
        }}
        select, button, input {{
            background-color: #2d3340;
            color: #e1e6f0;
            border: 1px solid #404859;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
        }}
        select:focus, button:hover, input:focus {{
            border-color: #78b4ff;
        }}
        button {{
            cursor: pointer;
            font-weight: bold;
            background-color: #3b4252;
        }}
        button:hover {{
            background-color: #4c566a;
        }}
        .fps-control {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        #fps-value {{
            width: 24px;
            text-align: right;
            font-variant-numeric: tabular-nums;
        }}
    </style>
</head>
<body>
    <h1>{manifest.get('domain', 'Animation')} Flipbook</h1>
    <p>Interactive sequence viewer &mdash; Draft Review</p>
    
    <div class="canvas-container">
        <canvas id="viewer"></canvas>
    </div>
    
    <div class="controls">
        <select id="seq-select"></select>
        <div id="action-buttons" style="display: flex; gap: 8px; border-left: 1px solid #404859; padding-left: 16px; border-right: 1px solid #404859; padding-right: 16px;"></div>
        <button id="play-btn">Pause</button>
        <div class="fps-control">
            <label for="fps-slider">FPS:</label>
            <input type="range" id="fps-slider" min="1" max="30" value="10">
            <span id="fps-value">10</span>
        </div>
    </div>

    <script>
        const manifest = {json.dumps(manifest)};
        const imgPath = "{html_to_image}";
        
        const canvas = document.getElementById('viewer');
        const ctx = canvas.getContext('2d');
        const select = document.getElementById('seq-select');
        const actionButtons = document.getElementById('action-buttons');
        const playBtn = document.getElementById('play-btn');
        const fpsSlider = document.getElementById('fps-slider');
        const fpsValue = document.getElementById('fps-value');
        
        let img = new Image();
        let isPlaying = true;
        let fps = 10;
        let currentSeq = null;
        let baseLoopSeq = null;
        let isPlayingOneShot = false;
        let currentFrameIdx = 0;
        let lastFrameTime = 0;
        let animationId = null;
        
        if (manifest.animations) {{
            manifest.animations.forEach((anim, idx) => {{
                if (anim.loop) {{
                    const opt = document.createElement('option');
                    opt.value = idx;
                    opt.textContent = anim.label || anim.id;
                    select.appendChild(opt);
                }} else {{
                    const btn = document.createElement('button');
                    btn.textContent = anim.label || anim.id;
                    btn.addEventListener('click', () => playOneShot(idx));
                    actionButtons.appendChild(btn);
                }}
            }});
        }}
        
        function updateCanvasSize() {{
            if (!currentSeq || !currentSeq.frames || currentSeq.frames.length === 0) return;
            let maxW = 0, maxH = 0;
            currentSeq.frames.forEach(f => {{
                if (f.sourceRect) {{
                    maxW = Math.max(maxW, f.sourceRect.w);
                    maxH = Math.max(maxH, f.sourceRect.h);
                }}
            }});
            canvas.width = maxW || 256;
            canvas.height = maxH || 256;
        }}
        
        function setSequence(idx, isOneShot=false) {{
            currentSeq = manifest.animations[idx];
            if (!isOneShot) {{
                baseLoopSeq = currentSeq;
            }}
            currentFrameIdx = 0;
            updateCanvasSize();
            drawFrame();
        }}
        
        function playOneShot(idx) {{
            isPlayingOneShot = true;
            setSequence(idx, true);
            lastFrameTime = performance.now();
        }}
        
        function drawFrame() {{
            if (!currentSeq || !currentSeq.frames || currentSeq.frames.length === 0 || !img.complete) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const frame = currentSeq.frames[currentFrameIdx];
            if (!frame || !frame.sourceRect) return;
            const rect = frame.sourceRect;
            
            const dx = (canvas.width - rect.w) / 2;
            const dy = (canvas.height - rect.h) / 2;
            
            ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w, rect.h);
        }}
        
        function loop(time) {{
            if (isPlaying && currentSeq && currentSeq.frames.length > 0) {{
                const elapsed = time - lastFrameTime;
                const msPerFrame = 1000 / fps;
                
                if (elapsed >= msPerFrame) {{
                    currentFrameIdx++;
                    if (currentFrameIdx >= currentSeq.frames.length) {{
                        if (isPlayingOneShot) {{
                            isPlayingOneShot = false;
                            currentSeq = baseLoopSeq;
                            currentFrameIdx = 0;
                            updateCanvasSize();
                        }} else {{
                            currentFrameIdx = currentSeq.loop ? 0 : currentSeq.frames.length - 1;
                        }}
                    }}
                    drawFrame();
                    lastFrameTime = time;
                }}
            }}
            animationId = requestAnimationFrame(loop);
        }}
        
        select.addEventListener('change', (e) => {{
            if (!isPlayingOneShot) {{
                setSequence(e.target.value);
                lastFrameTime = performance.now();
            }} else {{
                baseLoopSeq = manifest.animations[e.target.value];
            }}
        }});
        
        playBtn.addEventListener('click', () => {{
            isPlaying = !isPlaying;
            playBtn.textContent = isPlaying ? 'Pause' : 'Play';
            if (isPlaying) lastFrameTime = performance.now();
        }});
        
        fpsSlider.addEventListener('input', (e) => {{
            fps = parseInt(e.target.value);
            fpsValue.textContent = fps;
        }});
        
        img.onload = () => {{
            if (manifest.animations && manifest.animations.length > 0) {{
                let firstLoopIdx = manifest.animations.findIndex(a => a.loop);
                if (firstLoopIdx === -1) firstLoopIdx = 0;
                setSequence(firstLoopIdx);
                
                // Keep select value in sync if a loop exists
                if (select.options.length > 0) {{
                    select.value = firstLoopIdx;
                }}
                
                lastFrameTime = performance.now();
                animationId = requestAnimationFrame(loop);
            }}
        }};
        img.onerror = () => {{
            ctx.fillStyle = '#ff6e6e';
            ctx.font = '16px Arial';
            ctx.fillText('Failed to load sprite sheet', 20, 40);
            ctx.fillText(imgPath, 20, 60);
        }};
        img.src = imgPath;
        
    </script>
</body>
</html>
"""
    out_path.write_text(html_content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate synchronized animation-sequence evidence from an animation manifest.")
    parser.add_argument("--manifest", required=True, help="Repo-relative path to animation manifest JSON.")
    parser.add_argument("--out",      required=True, help="Repo-relative output evidence folder.")
    args = parser.parse_args()

    root = repo_root()
    manifest_path = root / args.manifest
    manifest = load_manifest(manifest_path)

    domain = manifest.get("domain")
    if not domain:
        fail("Manifest missing domain.")

    op_type = manifest.get("operationalType", "")
    if op_type != "character-animation-sheet":
        print(f"WARNING: operationalType is '{op_type}', expected 'character-animation-sheet'.", file=sys.stderr)

    animations = manifest.get("animations")
    if not isinstance(animations, list) or not animations:
        fail("Manifest animations array is missing or empty. Map sequences before generating evidence.")

    frame_grid = manifest.get("frameGrid", {})

    source_path = root / manifest.get("sourceSheet", "")
    if not source_path.exists():
        fail(f"sourceSheet missing: {source_path}")
    source_sheet = Image.open(source_path).convert("RGBA")

    derived_sheet_value = manifest.get("derivedSheet")
    if derived_sheet_value:
        derived_path = root / derived_sheet_value
        if not derived_path.exists():
            print(f"WARNING: derivedSheet missing; using sourceSheet for crops.", file=sys.stderr)
            crop_sheet = source_sheet
        else:
            crop_sheet = Image.open(derived_path).convert("RGBA")
    else:
        print("WARNING: derivedSheet is null; using sourceSheet for crops (checkerboard visible).", file=sys.stderr)
        crop_sheet = source_sheet

    out_dir = root / args.out
    out_dir.mkdir(parents=True, exist_ok=True)

    generate_sequences_bbox_overlay(animations, source_sheet, frame_grid, out_dir / f"{domain}-sequences-bbox-overlay.png")
    print(f"  wrote {domain}-sequences-bbox-overlay.png")

    generate_sequences_contact_sheet(animations, crop_sheet, out_dir / f"{domain}-sequences-contact-sheet.png")
    print(f"  wrote {domain}-sequences-contact-sheet.png")

    generate_sequences_table_preview(animations, out_dir / f"{domain}-sequences-table-preview.png")
    print(f"  wrote {domain}-sequences-table-preview.png")

    flipbook_path = out_dir / f"{domain}-flipbook.html"
    generate_flipbook_html(manifest, flipbook_path, root)
    print(f"  wrote {domain}-flipbook.html")

    print(f"\nGenerated animation evidence for {domain}")
    print(f"Sequences: {len(animations)}")
    print(f"Output: {out_dir}")


if __name__ == "__main__":
    main()
