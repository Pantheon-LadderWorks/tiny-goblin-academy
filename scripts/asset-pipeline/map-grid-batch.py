#!/usr/bin/env python3
"""Batch-map like-shaped grid tilesheets with evidence.

This is a canonical mapping helper invoked by scripts/asset-pipeline/cli.mjs.
It creates a batch region manifest and review evidence for source sheets whose
semantic manifest already defines grid labels, but whose physical image
dimensions may differ from the semantic 128-grid vocabulary.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from collections import Counter
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


def load_font(size: int = 14) -> ImageFont.ImageFont:
    for name in ["arial.ttf", "DejaVuSans.ttf"]:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repo_rel(path: Path, repo_root: Path) -> str:
    try:
        return path.resolve().relative_to(repo_root.resolve()).as_posix()
    except ValueError:
        return path.as_posix()


def proportional_rect(row: int, column: int, rows: int, columns: int, width: int, height: int) -> dict[str, int]:
    """Return a rounded proportional grid cell rectangle for one-indexed row/column."""
    x0 = round((column - 1) * width / columns)
    x1 = round(column * width / columns)
    y0 = round((row - 1) * height / rows)
    y1 = round(row * height / rows)
    return {"x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0}


def manifest_rect(tile: dict[str, Any]) -> dict[str, int]:
    return {
        "x": int(tile["x"]),
        "y": int(tile["y"]),
        "w": int(tile["w"]),
        "h": int(tile["h"]),
    }


def image_metadata(path: Path) -> dict[str, Any]:
    with Image.open(path) as img:
        mode = img.mode
        fmt = img.format
        width, height = img.size
        alpha = "has-alpha" if ("A" in mode or mode in {"LA", "PA"}) else "no-alpha"
        return {
            "format": fmt,
            "mode": mode,
            "width": width,
            "height": height,
            "alphaFinding": alpha,
            "sha256": sha256_file(path),
        }


def draw_title(canvas: Image.Image, title: str, subtitle: str = "") -> Image.Image:
    out = Image.new("RGBA", (canvas.width, canvas.height + 72), (22, 22, 31, 255))
    out.alpha_composite(canvas, (0, 72))
    draw = ImageDraw.Draw(out)
    draw.text((18, 14), title, fill=(255, 224, 148, 255), font=load_font(26))
    if subtitle:
        draw.text((18, 46), subtitle, fill=(225, 225, 232, 255), font=load_font(14))
    return out


def overlay_for_sheet(image: Image.Image, sheet: dict[str, Any], regions: list[dict[str, Any]]) -> Image.Image:
    out = image.convert("RGBA").copy()
    draw = ImageDraw.Draw(out)
    for region in regions:
        rect = region["sourceRect"]
        x, y, w, h = rect["x"], rect["y"], rect["w"], rect["h"]
        draw.rectangle([x, y, x + w - 1, y + h - 1], outline=(80, 210, 255, 230), width=3)
        draw.rectangle([x, y, x + 34, y + 20], fill=(0, 0, 0, 230))
        draw.text((x + 4, y + 2), str(region["index"]), fill=(255, 255, 255, 255), font=load_font(13))
    return draw_title(
        out,
        f"H5.83 {sheet['displayName']} BBox Overlay",
        "draft future pantry mapping • proportional 8x8 sourceRects • no cleanup/runtime/tilemap approval",
    )


def numbered_contact_sheet(image: Image.Image, sheet: dict[str, Any], regions: list[dict[str, Any]]) -> Image.Image:
    thumb = 128
    label_h = 38
    margin = 16
    cols = 8
    rows = 8
    out = Image.new("RGBA", (cols * (thumb + margin) + margin, rows * (thumb + label_h + margin) + margin + 72), (22, 22, 31, 255))
    draw = ImageDraw.Draw(out)
    draw.text((18, 14), f"H5.83 {sheet['displayName']} Numbered Contact Sheet", fill=(255, 224, 148, 255), font=load_font(24))
    draw.text((18, 44), "draft future pantry mapping • 64 regions • no cleanup/runtime/tilemap approval", fill=(225, 225, 232, 255), font=load_font(14))
    for region in regions:
        rect = region["sourceRect"]
        crop = image.crop((rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"])).resize((thumb, thumb), Image.Resampling.LANCZOS)
        col = region["column"] - 1
        row = region["row"] - 1
        x = margin + col * (thumb + margin)
        y = 72 + margin + row * (thumb + label_h + margin)
        out.alpha_composite(crop, (x, y))
        draw.rectangle([x, y, x + thumb - 1, y + thumb - 1], outline=(80, 210, 255, 255), width=2)
        draw.rectangle([x, y, x + 34, y + 20], fill=(0, 0, 0, 230))
        draw.text((x + 4, y + 2), str(region["index"]), fill=(255, 255, 255, 255), font=load_font(13))
        label = region["name"][:24]
        draw.text((x, y + thumb + 4), label, fill=(230, 230, 235, 255), font=load_font(11))
        draw.text((x, y + thumb + 20), region["rowGroup"][:28], fill=(180, 190, 205, 255), font=load_font(10))
    return out


def table_preview(title: str, rows: list[dict[str, Any]], columns: list[tuple[str, str]], path: Path) -> None:
    font = load_font(12)
    header_font = load_font(13)
    row_h = 24
    col_widths = []
    for key, label in columns:
        values = [str(row.get(key, "")) for row in rows[:80]]
        col_widths.append(min(360, max(80, max([len(label), *[len(v) for v in values]]) * 7 + 18)))
    width = sum(col_widths) + 40
    height = 78 + row_h * (len(rows) + 1)
    out = Image.new("RGBA", (width, height), (22, 22, 31, 255))
    draw = ImageDraw.Draw(out)
    draw.text((18, 14), title, fill=(255, 224, 148, 255), font=load_font(24))
    draw.text((18, 44), "draft future pantry mapping • not runtime/tilemap/collision/pathfinding approved", fill=(225, 225, 232, 255), font=load_font(13))
    y = 72
    x = 20
    for (key, label), w in zip(columns, col_widths):
        draw.rectangle([x, y, x + w, y + row_h], fill=(42, 42, 56, 255))
        draw.text((x + 6, y + 5), label, fill=(255, 255, 255, 255), font=header_font)
        x += w
    for row in rows:
        y += row_h
        x = 20
        for (key, _label), w in zip(columns, col_widths):
            value = str(row.get(key, ""))
            if len(value) > 48:
                value = value[:45] + "..."
            draw.rectangle([x, y, x + w, y + row_h], outline=(52, 52, 68, 255))
            draw.text((x + 6, y + 5), value, fill=(225, 225, 232, 255), font=font)
            x += w
    path.parent.mkdir(parents=True, exist_ok=True)
    out.save(path)


def batch_source_contact(sheets: list[dict[str, Any]], evidence_dir: Path) -> None:
    thumb_w, thumb_h = 300, 300
    margin = 22
    cols = 3
    rows = math.ceil(len(sheets) / cols)
    out = Image.new("RGBA", (cols * (thumb_w + margin) + margin, rows * (thumb_h + 74 + margin) + margin + 78), (22, 22, 31, 255))
    draw = ImageDraw.Draw(out)
    draw.text((18, 14), "H5.83 Future Topdown Floor Tilesheets Source Contact Sheet", fill=(255, 224, 148, 255), font=load_font(24))
    draw.text((18, 44), "six future pantry sheets • source PNGs untouched • no cleanup/runtime/tilemap approval", fill=(225, 225, 232, 255), font=load_font(13))
    for i, sheet in enumerate(sheets):
        col = i % cols
        row = i // cols
        x = margin + col * (thumb_w + margin)
        y = 78 + margin + row * (thumb_h + 74 + margin)
        with Image.open(sheet["sourceImagePathAbs"]).convert("RGBA") as img:
            img.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            bg = Image.new("RGBA", (thumb_w, thumb_h), (32, 32, 42, 255))
            bg.alpha_composite(img, ((thumb_w - img.width) // 2, (thumb_h - img.height) // 2))
        out.alpha_composite(bg, (x, y))
        draw.rectangle([x, y, x + thumb_w - 1, y + thumb_h - 1], outline=(80, 210, 255, 255), width=2)
        draw.text((x, y + thumb_h + 8), sheet["sheetId"], fill=(255, 224, 148, 255), font=load_font(13))
        draw.text((x, y + thumb_h + 26), sheet["displayName"][:42], fill=(230, 230, 235, 255), font=load_font(12))
        md = sheet["sourceImageMetadata"]
        draw.text((x, y + thumb_h + 44), f"{md['width']}x{md['height']} {md['format']} / {md['mode']} / {md['alphaFinding']}", fill=(180, 190, 205, 255), font=load_font(11))
    out.save(evidence_dir / "batch-source-contact-sheet.png")


def main() -> None:
    parser = argparse.ArgumentParser(description="Batch-map semantic 8x8 grid tilesheets.")
    parser.add_argument("--semantic-manifest", required=True)
    parser.add_argument("--sources-dir", required=True)
    parser.add_argument("--output-manifest", required=True)
    parser.add_argument("--evidence-dir", required=True)
    parser.add_argument("--repo-root", required=True)
    args = parser.parse_args()

    repo_root = Path(args.repo_root)
    semantic_manifest_path = (repo_root / args.semantic_manifest).resolve() if not Path(args.semantic_manifest).is_absolute() else Path(args.semantic_manifest)
    sources_dir = (repo_root / args.sources_dir).resolve() if not Path(args.sources_dir).is_absolute() else Path(args.sources_dir)
    output_manifest_path = (repo_root / args.output_manifest).resolve() if not Path(args.output_manifest).is_absolute() else Path(args.output_manifest)
    evidence_dir = (repo_root / args.evidence_dir).resolve() if not Path(args.evidence_dir).is_absolute() else Path(args.evidence_dir)
    evidence_dir.mkdir(parents=True, exist_ok=True)
    output_manifest_path.parent.mkdir(parents=True, exist_ok=True)

    semantic = json.loads(semantic_manifest_path.read_text(encoding="utf-8-sig"))
    source_sheets: list[dict[str, Any]] = []
    total_regions = 0

    grid = semantic["grid"]
    columns = int(grid["columns"])
    rows = int(grid["rows"])
    semantic_tile_size = int(grid["tileSize"])

    for sheet in semantic["sheets"]:
        image_path = sources_dir / sheet["sourceImageFilename"]
        if not image_path.exists():
            raise FileNotFoundError(f"Missing source image for {sheet['sheetId']}: {image_path}")
        metadata = image_metadata(image_path)
        if len(sheet["tiles"]) != columns * rows:
            raise ValueError(f"{sheet['sheetId']} has {len(sheet['tiles'])} semantic tiles; expected {columns * rows}")
        with Image.open(image_path).convert("RGBA") as img:
            sheet_regions: list[dict[str, Any]] = []
            for tile in sheet["tiles"]:
                source_rect = proportional_rect(
                    int(tile["row"]),
                    int(tile["column"]),
                    rows,
                    columns,
                    metadata["width"],
                    metadata["height"],
                )
                region = {
                    "sheetId": sheet["sheetId"],
                    "index": int(tile["index"]),
                    "row": int(tile["row"]),
                    "column": int(tile["column"]),
                    "tileId": tile["tileId"],
                    "name": tile["name"],
                    "rowGroup": tile["rowGroup"],
                    "assetRole": tile["assetRole"],
                    "terrainCategory": sheet.get("theme"),
                    "sourceRect": source_rect,
                    "semanticRect": manifest_rect(tile),
                    "semanticDefaultWalkable": tile.get("defaultWalkable"),
                    "semanticRuntimeBehavior": tile.get("runtimeBehavior", "none-approved"),
                    "walkabilityApproval": "none",
                    "runtimeBehavior": "none-approved",
                    "reviewStatus": "needs-human-review",
                    "runtimeEligibility": "not-runtime-approved",
                    "pipelineUse": "future-pantry-region-mapping",
                    "notes": [
                        "Future pantry mapping only; semantic labels are draft planning metadata.",
                        "No runtime tilemap, collision, pathfinding, walkability, hazard, water, slime, portal, trigger, or autotiling approval.",
                    ],
                }
                sheet_regions.append(region)
            total_regions += len(sheet_regions)

            sheet_slug = slug(sheet["sheetId"].replace("terrain.", "terrain-").replace(".v0.1", ""))
            sheet_dir = evidence_dir / sheet_slug
            sheet_dir.mkdir(parents=True, exist_ok=True)
            overlay_for_sheet(img, sheet, sheet_regions).save(sheet_dir / f"{sheet_slug}-bbox-overlay.png")
            numbered_contact_sheet(img, sheet, sheet_regions).save(sheet_dir / f"{sheet_slug}-numbered-contact-sheet.png")
            table_preview(
                f"H5.83 {sheet['displayName']} Region Table",
                sheet_regions,
                [
                    ("index", "#"),
                    ("tileId", "tileId"),
                    ("name", "name"),
                    ("rowGroup", "rowGroup"),
                    ("sourceRect", "sourceRect"),
                    ("semanticRect", "semanticRect"),
                ],
                sheet_dir / f"{sheet_slug}-region-table-preview.png",
            )

        source_sheets.append({
            "sheetId": sheet["sheetId"],
            "displayName": sheet["displayName"],
            "theme": sheet.get("theme"),
            "sourceImagePath": repo_rel(image_path, repo_root),
            "sourceImagePathAbs": image_path,
            "sourceImageMetadata": metadata,
            "mappingMethod": "proportional-8x8-grid-source-rects",
            "regionCount": len(sheet_regions),
            "regions": sheet_regions,
        })

    batch_source_contact(source_sheets, evidence_dir)
    summary_rows = [
        {
            "sheetId": sheet["sheetId"],
            "displayName": sheet["displayName"],
            "dimensions": f"{sheet['sourceImageMetadata']['width']}x{sheet['sourceImageMetadata']['height']}",
            "alpha": sheet["sourceImageMetadata"]["alphaFinding"],
            "regions": sheet["regionCount"],
            "mappingMethod": sheet["mappingMethod"],
        }
        for sheet in source_sheets
    ]
    table_preview(
        "H5.83 Future Floor Tilesheets Batch Summary",
        summary_rows,
        [
            ("sheetId", "sheetId"),
            ("displayName", "displayName"),
            ("dimensions", "dimensions"),
            ("alpha", "alpha"),
            ("regions", "regions"),
            ("mappingMethod", "mappingMethod"),
        ],
        evidence_dir / "batch-summary-table-preview.png",
    )

    region_category_counts = Counter(region["rowGroup"] for sheet in source_sheets for region in sheet["regions"])
    output = {
        "manifestId": "academy.topdown.floor-tilesheets.future.regions",
        "schemaVersion": "0.1",
        "status": "draft",
        "reviewStatus": "needs-human-review",
        "pipelineUse": "future-pantry-region-mapping",
        "runtimeEligibility": "not-runtime-approved",
        "domain": "topdown-future-floor-tilesheets",
        "operationalType": "future-topdown-floor-tilesheets-batch-region-mapping",
        "sourceManifestPath": repo_rel(semantic_manifest_path, repo_root),
        "gridPolicy": {
            "semanticGrid": {"columns": columns, "rows": rows, "tileSize": semantic_tile_size},
            "sourceRectStrategy": "proportional-8x8-boundaries-from-actual-source-dimensions",
            "sourceRectFormula": "x0=round(col*width/8), x1=round((col+1)*width/8), y0=round(row*height/8), y1=round((row+1)*height/8)",
            "semanticRectPolicy": "preserve original 128-grid vocabulary separately as semanticRect",
            "noCroppingOrNormalization": True,
        },
        "roadPathOverlaySheet": "excluded",
        "runtimeDoctrine": semantic.get("runtimeDoctrine", {}),
        "sheetCount": len(source_sheets),
        "totalRegionCount": total_regions,
        "rowGroupCounts": dict(region_category_counts),
        "sheets": [
            {key: value for key, value in sheet.items() if key != "sourceImagePathAbs"}
            for sheet in source_sheets
        ],
        "notes": [
            "Future pantry mapping only.",
            "No cleanup, derived images, source mutation, runtime wiring, tilemap approval, collision approval, pathfinding approval, walkability approval, hazard/water/slime/portal/trigger behavior, or autotiling approval.",
            "Actual source PNG dimensions may differ from the semantic manifest's 128-grid vocabulary, so sourceRect uses proportional real-image boundaries and semanticRect preserves the manifest vocabulary.",
            "The road/path overlay sheet remains intentionally excluded.",
            "The existing H5.81/H5.82 terrain cleanup lane remains separate and unchanged.",
        ],
    }

    output_manifest_path.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputManifest": repo_rel(output_manifest_path, repo_root),
        "evidenceDir": repo_rel(evidence_dir, repo_root),
        "sheetCount": len(source_sheets),
        "totalRegionCount": total_regions,
        "sourceRectStrategy": output["gridPolicy"]["sourceRectStrategy"],
    }, indent=2))


if __name__ == "__main__":
    main()
