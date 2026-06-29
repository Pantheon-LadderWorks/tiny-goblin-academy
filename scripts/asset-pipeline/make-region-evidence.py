#!/usr/bin/env python
"""Generate synchronized region-review evidence from a region manifest.

Outputs:
- <domain>-bbox-overlay.png
- <domain>-numbered-contact-sheet.png
- <domain>-region-table-preview.png

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
        Path(r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


F_TITLE = font(34, True)
F_HEAD = font(20, True)
F_BODY = font(16)
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


def validate_regions(manifest: dict, source_size: tuple[int, int]) -> list[dict]:
    regions = manifest.get("regions")
    if not isinstance(regions, list):
        fail("Manifest regions must be an array.")

    seen: set[str] = set()
    width, height = source_size
    for idx, region in enumerate(regions, 1):
        region_id = region.get("id")
        if not region_id:
            fail(f"Region {idx} is missing id.")
        if region_id in seen:
            fail(f"Duplicate region id: {region_id}")
        seen.add(region_id)

        rect = region.get("sourceRect")
        if not isinstance(rect, dict):
            fail(f"Region {region_id} has invalid sourceRect.")
        for key in ("x", "y", "w", "h"):
            if not isinstance(rect.get(key), (int, float)):
                fail(f"Region {region_id} sourceRect.{key} must be numeric.")
        x, y, w, h = int(rect["x"]), int(rect["y"]), int(rect["w"]), int(rect["h"])
        if w <= 0 or h <= 0:
            fail(f"Region {region_id} sourceRect must have positive width/height.")
        if x < 0 or y < 0 or x + w > width or y + h > height:
            fail(f"Region {region_id} sourceRect out of bounds: {rect}")
    return regions


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


def short_id(region_id: str) -> str:
    return region_id.replace("ui-hud.", "").replace("shared-core.", "").replace("shared-fx.", "")


def generate_contact_sheet(regions: list[dict], crop_sheet: Image.Image, out_path: Path) -> None:
    card_w, card_h = 320, 250
    cols = 4
    rows = math.ceil(len(regions) / cols)
    header_h = 120
    canvas = Image.new("RGB", (cols * card_w + 40, header_h + rows * card_h + 30), (18, 20, 24))
    draw = ImageDraw.Draw(canvas)
    draw.text((24, 20), "Region Numbered Contact Sheet — Draft Review", font=F_TITLE, fill=(255, 244, 204))
    draw.text(
        (24, 68),
        "Crops use derived sheet when present. Indexes match bbox overlay and table preview. Not runtime-approved.",
        font=F_BODY,
        fill=(225, 230, 240),
    )

    for idx, region in enumerate(regions, 1):
        col = (idx - 1) % cols
        row = (idx - 1) // cols
        x = 20 + col * card_w
        y = header_h + row * card_h
        rect = region["sourceRect"]
        crop = crop_sheet.crop((rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"]))
        preview = dark_composite(crop, (card_w - 40, 140))

        draw.rounded_rectangle([x + 8, y + 8, x + card_w - 12, y + card_h - 12], radius=12, fill=(31, 34, 42), outline=(87, 105, 140), width=2)
        draw.ellipse([x + 18, y + 18, x + 54, y + 54], fill=(255, 210, 80))
        draw.text((x + 27, y + 25), str(idx), font=F_HEAD, fill=(20, 20, 20))
        canvas.paste(preview, (x + 20, y + 60))
        draw.text((x + 20, y + 205), short_id(region["id"])[:34], font=F_SMALL, fill=(238, 238, 238))
        draw.text((x + 20, y + 223), str(region.get("category", ""))[:34], font=F_SMALL, fill=(178, 220, 255))

    canvas.save(out_path)


def generate_bbox_overlay(regions: list[dict], source_sheet: Image.Image, out_path: Path) -> None:
    scale = min(0.55, 1500 / source_sheet.width)
    sw, sh = int(source_sheet.width * scale), int(source_sheet.height * scale)
    base = Image.new("RGBA", (sw, sh), (30, 30, 34, 255))
    base.alpha_composite(source_sheet.resize((sw, sh), Image.Resampling.LANCZOS))
    canvas = Image.new("RGB", (sw + 40, sh + 150), (18, 20, 24))
    draw = ImageDraw.Draw(canvas)
    draw.text((24, 18), "Region BBox Overlay — Draft Review", font=F_TITLE, fill=(255, 244, 204))
    draw.text((24, 66), "Visible sourceRect boxes over source sheet. Indexes match contact sheet/table. Not runtime-approved.", font=F_BODY, fill=(225, 230, 240))
    canvas.paste(base.convert("RGB"), (20, 115))

    colors = [(255, 110, 110), (255, 190, 90), (120, 220, 160), (120, 180, 255), (230, 140, 255)]
    for idx, region in enumerate(regions, 1):
        rect = region["sourceRect"]
        color = colors[(idx - 1) % len(colors)]
        x0 = 20 + int(rect["x"] * scale)
        y0 = 115 + int(rect["y"] * scale)
        x1 = 20 + int((rect["x"] + rect["w"]) * scale)
        y1 = 115 + int((rect["y"] + rect["h"]) * scale)
        draw.rectangle([x0, y0, x1, y1], outline=color, width=3)
        draw.rectangle([x0, y0, x0 + 28, y0 + 22], fill=color)
        draw.text((x0 + 3, y0 + 2), str(idx), font=F_SMALL, fill=(0, 0, 0))

    canvas.save(out_path)


def generate_table_preview(regions: list[dict], out_path: Path) -> None:
    row_h = 34
    table_w = 2100
    table_h = 150 + row_h * (len(regions) + 1)
    canvas = Image.new("RGB", (table_w, table_h), (18, 20, 24))
    draw = ImageDraw.Draw(canvas)
    draw.text((24, 18), "Region Table Preview — Draft Review", font=F_TITLE, fill=(255, 244, 204))
    draw.text((24, 66), "Required fields: id, category, sourceRect, usage, reviewStatus. Not runtime-approved.", font=F_BODY, fill=(225, 230, 240))

    columns = [
        ("idx", 50),
        ("id", 520),
        ("category", 220),
        ("sourceRect", 300),
        ("usage", 180),
        ("reviewStatus", 260),
        ("label", 500),
    ]
    x0, y = 24, 120
    x = x0
    for name, width in columns:
        draw.rectangle([x, y, x + width, y + row_h], fill=(45, 51, 64), outline=(90, 105, 130))
        draw.text((x + 8, y + 8), name, font=F_SMALL, fill=(255, 244, 204))
        x += width
    y += row_h

    for idx, region in enumerate(regions, 1):
        x = x0
        fill = (27, 30, 38) if idx % 2 else (32, 36, 45)
        rect = region["sourceRect"]
        values = [
            str(idx),
            region["id"],
            str(region.get("category", "")),
            f"x:{rect['x']} y:{rect['y']} w:{rect['w']} h:{rect['h']}",
            str(region.get("usage", "")),
            str(region.get("reviewStatus", "")),
            str(region.get("label", "")),
        ]
        for value, (_, width) in zip(values, columns):
            draw.rectangle([x, y, x + width, y + row_h], fill=fill, outline=(64, 74, 90))
            draw.text((x + 8, y + 8), value[: max(6, width // 8)], font=F_SMALL, fill=(230, 235, 240))
            x += width
        y += row_h

    canvas.save(out_path)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate synchronized region evidence from a region manifest.")
    parser.add_argument("--manifest", required=True, help="Repo-relative path to region manifest JSON.")
    parser.add_argument("--out", required=True, help="Repo-relative output evidence folder.")
    args = parser.parse_args()

    root = repo_root()
    manifest_path = root / args.manifest
    manifest = load_manifest(manifest_path)
    domain = manifest.get("domain")
    if not domain:
        fail("Manifest missing domain.")

    source_path = root / manifest.get("sourceSheet", "")
    if not source_path.exists():
        fail(f"sourceSheet missing: {source_path}")
    source_sheet = Image.open(source_path).convert("RGBA")

    derived_sheet_value = manifest.get("derivedSheet")
    if derived_sheet_value:
        derived_path = root / derived_sheet_value
        if not derived_path.exists():
            print(f"WARNING: derivedSheet missing; using sourceSheet for crops: {derived_sheet_value}", file=sys.stderr)
            crop_sheet = source_sheet
        else:
            crop_sheet = Image.open(derived_path).convert("RGBA")
    else:
        print("WARNING: derivedSheet is null; using sourceSheet for crops.", file=sys.stderr)
        crop_sheet = source_sheet

    regions = validate_regions(manifest, source_sheet.size)
    out_dir = root / args.out
    out_dir.mkdir(parents=True, exist_ok=True)

    generate_bbox_overlay(regions, source_sheet, out_dir / f"{domain}-bbox-overlay.png")
    generate_contact_sheet(regions, crop_sheet, out_dir / f"{domain}-numbered-contact-sheet.png")
    generate_table_preview(regions, out_dir / f"{domain}-region-table-preview.png")

    print(f"Generated region evidence for {domain}")
    print(f"Regions: {len(regions)}")
    print(f"Output: {out_dir}")


if __name__ == "__main__":
    main()
