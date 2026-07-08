#!/usr/bin/env python3
"""Edge-connected fake checker cleanup for grid-cell asset sheets.

This is a canonical-with-caution pipeline method for degraded fake-transparent
grid sheets. It removes only gray/checker-like pixels connected to each cell's
edge, avoiding whole-sheet blank-cell comparison and avoiding global color
replacement that chews holes through gray/stone/wood interiors.
"""

from __future__ import annotations

import argparse
import json
import math
from collections import Counter, deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


DEFAULT_EXCLUDED = {7, 9, 10, 17, 18, 47, 55, 57, 60, 61, 62}
DEFAULT_PARAMS = {
    "gray_sat_max": 0.18,
    "gray_min": 0.24,
    "gray_max": 0.90,
    "channel_delta_max": 0.09,
    "reference_distance_max": 0.34,
    "background_reference_region": 49,
    "edge_expansion_passes": 0,
    "edge_alpha": 160,
}


def load_font(size: int = 14) -> ImageFont.ImageFont:
    for name in ["arial.ttf", "DejaVuSans.ttf"]:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def parse_indexes(value: str | None) -> set[int]:
    if not value:
        return set()
    result: set[int] = set()
    for part in value.split(","):
        part = part.strip()
        if not part:
            continue
        result.add(int(part))
    return result


def repo_rel(path: Path, repo_root: Path) -> str:
    try:
        return path.resolve().relative_to(repo_root.resolve()).as_posix()
    except ValueError:
        return path.as_posix()


def gray_like_mask(crop: Image.Image, params: dict, reference_crop: Image.Image | None = None) -> np.ndarray:
    arr = np.asarray(crop.convert("RGBA")).astype(np.float32) / 255.0
    rgb = arr[..., :3]
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)
    gray = (
        (sat < params["gray_sat_max"])
        & (mx > params["gray_min"])
        & (mx < params["gray_max"])
        & (np.abs(rgb[..., 0] - rgb[..., 1]) < params["channel_delta_max"])
        & (np.abs(rgb[..., 1] - rgb[..., 2]) < params["channel_delta_max"])
        & (np.abs(rgb[..., 0] - rgb[..., 2]) < params["channel_delta_max"])
    )
    if reference_crop is not None:
        ref_arr = np.asarray(reference_crop.convert("RGBA").resize(crop.size)).astype(np.float32) / 255.0
        ref_rgb = ref_arr[..., :3]
        dist = np.sqrt(np.sum((rgb - ref_rgb) ** 2, axis=2))
        return dist < params["reference_distance_max"]
    return gray


def edge_connected_mask(crop: Image.Image, params: dict, reference_crop: Image.Image | None = None) -> np.ndarray:
    gray = gray_like_mask(crop, params, reference_crop)
    h, w = gray.shape
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        if gray[0, x]:
            visited[0, x] = True
            q.append((0, x))
        if gray[h - 1, x]:
            visited[h - 1, x] = True
            q.append((h - 1, x))
    for y in range(h):
        if gray[y, 0]:
            visited[y, 0] = True
            q.append((y, 0))
        if gray[y, w - 1]:
            visited[y, w - 1] = True
            q.append((y, w - 1))

    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    while q:
        y, x = q.popleft()
        for dy, dx in dirs:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and gray[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    mask = visited.copy()
    for _ in range(params["edge_expansion_passes"]):
        expanded = mask.copy()
        for dy, dx in dirs + [(1, 1), (1, -1), (-1, 1), (-1, -1)]:
            shifted = np.zeros_like(mask)
            ys = slice(max(0, dy), h + min(0, dy))
            xs = slice(max(0, dx), w + min(0, dx))
            ysrc = slice(max(0, -dy), h - max(0, dy))
            xsrc = slice(max(0, -dx), w - max(0, dx))
            shifted[ys, xs] = mask[ysrc, xsrc]
            expanded |= shifted & gray
        mask = expanded
    return mask


def apply_mask(crop: Image.Image, mask: np.ndarray, params: dict, reference_crop: Image.Image | None = None) -> Image.Image:
    out = np.asarray(crop.convert("RGBA")).copy()
    out[..., 3] = np.where(mask, 0, out[..., 3])

    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
    neighbor_transparent = np.zeros_like(mask)
    h, w = mask.shape
    for dy, dx in dirs:
        shifted = np.zeros_like(mask)
        ys = slice(max(0, dy), h + min(0, dy))
        xs = slice(max(0, dx), w + min(0, dx))
        ysrc = slice(max(0, -dy), h - max(0, dy))
        xsrc = slice(max(0, -dx), w - max(0, dx))
        shifted[ys, xs] = mask[ysrc, xsrc]
        neighbor_transparent |= shifted

    edge = (~mask) & neighbor_transparent & gray_like_mask(crop, params, reference_crop)
    alpha = out[..., 3].astype(np.float32)
    alpha[edge] = np.minimum(alpha[edge], params["edge_alpha"])
    out[..., 3] = alpha.astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def checker(size: tuple[int, int], cell: int = 16) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size, (190, 190, 190, 255))
    draw = ImageDraw.Draw(img)
    for y in range(0, h, cell):
        for x in range(0, w, cell):
            color = (140, 140, 140, 255) if ((x // cell) + (y // cell)) % 2 else (205, 205, 205, 255)
            draw.rectangle([x, y, x + cell - 1, y + cell - 1], fill=color)
    return img


def composite_preview(sheet: Image.Image, bg: tuple[int, int, int, int]) -> Image.Image:
    base = Image.new("RGBA", sheet.size, bg)
    return Image.alpha_composite(base, sheet.convert("RGBA"))


def add_title(canvas: Image.Image, title: str, subtitle: str = "") -> Image.Image:
    title_h = 70
    out = Image.new("RGBA", (canvas.width, canvas.height + title_h), (22, 22, 31, 255))
    out.paste(canvas, (0, title_h))
    draw = ImageDraw.Draw(out)
    font_title = load_font(28)
    font_sub = load_font(14)
    draw.text((20, 14), title, fill=(255, 224, 148, 255), font=font_title)
    if subtitle:
        draw.text((20, 48), subtitle, fill=(220, 220, 225, 255), font=font_sub)
    return out


def draw_label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fill=(255, 255, 255, 255)) -> None:
    font = load_font(12)
    x, y = xy
    bbox = draw.textbbox((x, y), text, font=font)
    draw.rectangle([bbox[0] - 3, bbox[1] - 2, bbox[2] + 3, bbox[3] + 2], fill=(0, 0, 0, 210))
    draw.text((x, y), text, fill=fill, font=font)


def contact_sheet(cards: list[tuple[str, Image.Image, str]], title: str, subtitle: str, cols: int = 8) -> Image.Image:
    thumb = 96
    label_h = 36
    pad = 12
    rows = math.ceil(len(cards) / cols) if cards else 1
    w = cols * (thumb + pad) + pad
    h = rows * (thumb + label_h + pad) + pad
    canvas = Image.new("RGBA", (w, h), (28, 28, 38, 255))
    draw = ImageDraw.Draw(canvas)
    font = load_font(11)
    for i, (label, img, status) in enumerate(cards):
        col = i % cols
        row = i // cols
        x = pad + col * (thumb + pad)
        y = pad + row * (thumb + label_h + pad)
        bg = checker((thumb, thumb), 12)
        crop = img.copy()
        crop.thumbnail((thumb, thumb), Image.LANCZOS)
        bg.alpha_composite(crop, ((thumb - crop.width) // 2, (thumb - crop.height) // 2))
        canvas.alpha_composite(bg, (x, y))
        color = (120, 210, 255, 255) if status == "candidate" else (255, 120, 120, 255)
        draw.rectangle([x, y, x + thumb, y + thumb], outline=color, width=2)
        draw.text((x, y + thumb + 3), label[:18], fill=(235, 235, 235, 255), font=font)
        draw.text((x, y + thumb + 17), status[:18], fill=color, font=font)
    return add_title(canvas, title, subtitle)


def before_after_sheet(rows: list[tuple[int, str, Image.Image, Image.Image, str]], title: str, subtitle: str) -> Image.Image:
    thumb = 88
    row_h = 116
    w = 900
    h = max(1, len(rows)) * row_h + 20
    canvas = Image.new("RGBA", (w, h), (28, 28, 38, 255))
    draw = ImageDraw.Draw(canvas)
    font = load_font(12)
    for i, (index, label, before, after, status) in enumerate(rows):
        y = 10 + i * row_h
        draw.text((14, y + 8), f"{index}. {label}", fill=(235, 235, 235, 255), font=font)
        draw.text((14, y + 28), status, fill=(120, 210, 255, 255) if "candidate" in status else (255, 130, 130, 255), font=font)
        for x, img, cap in [(400, before, "before"), (520, after, "after")]:
            bg = checker((thumb, thumb), 11)
            crop = img.copy()
            crop.thumbnail((thumb, thumb), Image.LANCZOS)
            bg.alpha_composite(crop, ((thumb - crop.width) // 2, (thumb - crop.height) // 2))
            canvas.alpha_composite(bg, (x, y))
            draw.text((x, y + thumb + 2), cap, fill=(220, 220, 220, 255), font=font)
        draw.line([(0, y + row_h - 1), (w, y + row_h - 1)], fill=(60, 60, 75, 255))
    return add_title(canvas, title, subtitle)


def mask_sheet(mask_cards: list[tuple[str, Image.Image]], title: str, subtitle: str) -> Image.Image:
    cards: list[tuple[str, Image.Image, str]] = []
    for label, mask_img in mask_cards:
        cards.append((label, mask_img, "edge-mask"))
    return contact_sheet(cards, title, subtitle, cols=8)


def table_preview(regions: list[dict], title: str, subtitle: str) -> Image.Image:
    rows = [["idx", "id", "category", "cleanupStatus", "notes"]]
    for r in regions:
        rows.append([
            str(r["index"]),
            r["id"].replace("topdown.objects.", ""),
            r.get("category", ""),
            r.get("cleanupStatus", ""),
            "; ".join(r.get("notes", []))[:64] if isinstance(r.get("notes"), list) else str(r.get("notes", ""))[:64],
        ])
    font = load_font(12)
    col_w = [52, 230, 145, 220, 420]
    row_h = 26
    w = sum(col_w) + 24
    h = len(rows) * row_h + 24
    canvas = Image.new("RGBA", (w, h), (28, 28, 38, 255))
    draw = ImageDraw.Draw(canvas)
    y = 12
    for ri, row in enumerate(rows):
        x = 12
        fill = (255, 224, 148, 255) if ri == 0 else (235, 235, 235, 255)
        for ci, value in enumerate(row):
            draw.text((x + 4, y + 5), value, fill=fill, font=font)
            draw.rectangle([x, y, x + col_w[ci], y + row_h], outline=(70, 70, 86, 255))
            x += col_w[ci]
        y += row_h
    return add_title(canvas, title, subtitle)


def main() -> None:
    parser = argparse.ArgumentParser(description="Selective edge-connected checker cleanup for topdown object grid sheets.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--cleanup-manifest", required=True)
    parser.add_argument("--evidence-dir", required=True)
    parser.add_argument("--excluded-regions", default="")
    parser.add_argument("--method", default="edge-connected-checker-cleanup")
    parser.add_argument("--method-status", default="canonical-with-caution")
    parser.add_argument("--run-log", required=True)
    parser.add_argument("--repo-root", default=".")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    source_path = (repo_root / args.input).resolve() if not Path(args.input).is_absolute() else Path(args.input)
    manifest_path = (repo_root / args.manifest).resolve() if not Path(args.manifest).is_absolute() else Path(args.manifest)
    output_path = (repo_root / args.output).resolve() if not Path(args.output).is_absolute() else Path(args.output)
    cleanup_manifest_path = (repo_root / args.cleanup_manifest).resolve() if not Path(args.cleanup_manifest).is_absolute() else Path(args.cleanup_manifest)
    evidence_dir = (repo_root / args.evidence_dir).resolve() if not Path(args.evidence_dir).is_absolute() else Path(args.evidence_dir)
    run_log_rel = repo_rel((repo_root / args.run_log) if not Path(args.run_log).is_absolute() else Path(args.run_log), repo_root)

    excluded = DEFAULT_EXCLUDED | parse_indexes(args.excluded_regions)
    params = dict(DEFAULT_PARAMS)

    evidence_dir.mkdir(parents=True, exist_ok=True)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    cleanup_manifest_path.parent.mkdir(parents=True, exist_ok=True)

    with manifest_path.open("r", encoding="utf-8-sig") as f:
        source_manifest = json.load(f)

    source_img = Image.open(source_path).convert("RGBA")
    reference_crop = None
    for region in source_manifest["regions"]:
        if int(region["index"]) == params["background_reference_region"]:
            rect = region["sourceRect"]
            reference_crop = source_img.crop((rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"]))
            break
    out_sheet = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    mask_overlay = Image.new("RGBA", source_img.size, (0, 0, 0, 0))
    mask_draw = ImageDraw.Draw(mask_overlay)

    regions_out: list[dict] = []
    before_after_rows: list[tuple[int, str, Image.Image, Image.Image, str]] = []
    accepted_cards: list[tuple[str, Image.Image, str]] = []
    excluded_cards: list[tuple[str, Image.Image, str]] = []
    mask_cards: list[tuple[str, Image.Image]] = []
    stats = {
        "candidateRegions": 0,
        "excludedRegions": 0,
        "transparentPixels": 0,
        "totalCandidatePixels": 0,
    }

    for region in source_manifest["regions"]:
        idx = int(region["index"])
        rect = region["sourceRect"]
        box = (rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"])
        crop = source_img.crop(box)
        region_notes: list[str] = []
        out_region = {
            "index": idx,
            "id": region["id"],
            "label": region["label"],
            "category": region.get("category"),
            "objectRole": region.get("objectRole"),
            "sourceRect": rect,
            "derivedRect": rect,
            "cleanupRisk": "medium",
            "reviewStatus": "needs-human-review",
            "runtimeEligibility": "not-runtime-approved",
        }

        if idx in excluded:
            out_region.update({
                "cleanupStatus": "excluded-effect-regeneration-needed",
                "usage": "do-not-use-from-h5-68-cleanup",
            })
            region_notes.extend([
                "Excluded from H5.68 cleanup because effect/glow/fire/portal/smoke/slime/shadow sprites should be regenerated or layered later.",
                "Not runtime-approved; no behavior, placement, collision, interaction, light, flame, portal, trap, slime, or shadow approval.",
            ])
            excluded_cards.append((f"{idx}. {region['label']}", crop, "excluded"))
            stats["excludedRegions"] += 1
        elif region.get("category") == "blank-empty-cell":
            out_region.update({
                "cleanupStatus": "blank-empty-cell-transparent",
                "usage": "draft-review",
                "cleanupRisk": "low",
            })
            region_notes.append("Blank inventory cell preserved as transparent in the H5.68 derived candidate.")
            empty = Image.new("RGBA", crop.size, (0, 0, 0, 0))
            out_sheet.alpha_composite(empty, (rect["x"], rect["y"]))
            before_after_rows.append((idx, region["label"], crop, empty, "blank transparent"))
        else:
            mask = edge_connected_mask(crop, params, reference_crop)
            cleaned = apply_mask(crop, mask, params, reference_crop)
            out_sheet.alpha_composite(cleaned, (rect["x"], rect["y"]))
            transparent_pixels = int(mask.sum())
            stats["transparentPixels"] += transparent_pixels
            stats["totalCandidatePixels"] += rect["w"] * rect["h"]
            stats["candidateRegions"] += 1
            out_region.update({
                "cleanupStatus": "nonfx-cleanup-candidate",
                "usage": "draft-review",
                "cleanupRisk": "medium" if transparent_pixels else "high",
                "maskTransparentPixels": transparent_pixels,
            })
            region_notes.extend([
                "H5.68 selective non-effect cleanup candidate using edge-connected background mask only.",
                "Needs human review; not runtime-approved.",
            ])
            if idx == 58:
                region_notes.append("Spike trap remains visual-only; no damage, collision, placement, interaction, or runtime approval.")
            before_after_rows.append((idx, region["label"], crop, cleaned, "candidate needs review"))
            accepted_cards.append((f"{idx}. {region['label']}", cleaned, "candidate"))

            mask_img = Image.new("RGBA", crop.size, (0, 0, 0, 0))
            mask_arr = np.zeros((crop.height, crop.width, 4), dtype=np.uint8)
            mask_arr[..., 0] = np.where(mask, 255, 0)
            mask_arr[..., 1] = np.where(mask, 80, 0)
            mask_arr[..., 2] = np.where(mask, 80, 0)
            mask_arr[..., 3] = np.where(mask, 210, 0)
            mask_img = Image.fromarray(mask_arr, "RGBA")
            mask_cards.append((f"{idx}. {region['label']}", mask_img))
            mask_overlay.alpha_composite(mask_img, (rect["x"], rect["y"]))
            mask_draw.rectangle([rect["x"], rect["y"], rect["x"] + rect["w"] - 1, rect["y"] + rect["h"] - 1], outline=(255, 110, 110, 190), width=1)

        out_region["notes"] = region_notes
        regions_out.append(out_region)

    out_sheet.save(output_path)

    checker_preview = composite_preview(out_sheet, (0, 0, 0, 0))
    checker_bg = checker(out_sheet.size, 16)
    checker_bg.alpha_composite(out_sheet)
    dark_preview = composite_preview(out_sheet, (22, 22, 31, 255))

    derived_preview = Image.new("RGBA", (source_img.width * 2 + 40, source_img.height + 90), (22, 22, 31, 255))
    derived_preview.alpha_composite(checker_bg, (20, 70))
    derived_preview.alpha_composite(dark_preview, (source_img.width + 20, 70))
    ddraw = ImageDraw.Draw(derived_preview)
    ddraw.text((20, 18), "H5.68 Topdown Objects Non-FX Cleaned Derived Sheet Preview", fill=(255, 224, 148, 255), font=load_font(26))
    ddraw.text((20, 48), "draft cleanup candidate • edge-connected masks • source untouched • not runtime-approved", fill=(220, 220, 225, 255), font=load_font(14))
    ddraw.text((20, 72), "checker preview", fill=(120, 210, 255, 255), font=load_font(14))
    ddraw.text((source_img.width + 20, 72), "dark preview", fill=(120, 210, 255, 255), font=load_font(14))
    derived_preview.save(evidence_dir / "topdown-objects-nonfx-cleaned-derived-sheet-preview.png")
    add_title(dark_preview, "H5.68 Topdown Objects Non-FX Cleaned On-Dark Preview", "draft cleanup candidate • on-dark residue review • no runtime approval").save(evidence_dir / "topdown-objects-nonfx-cleaned-on-dark-preview.png")
    before_after_sheet(before_after_rows, "H5.68 Topdown Objects Non-FX Before/After Contact Sheet", "candidate regions + blank cell • excluded effects shown separately • needs human review").save(evidence_dir / "topdown-objects-nonfx-before-after-contact-sheet.png")
    mask_sheet(mask_cards, "H5.68 Topdown Objects Non-FX Mask Preview", "red pixels are edge-connected background masks only • no global color chewing").save(evidence_dir / "topdown-objects-nonfx-mask-preview.png")
    contact_sheet(accepted_cards, "H5.68 Topdown Objects Accepted Candidate Preview", "ordinary non-effect candidates only • still needs human review • not runtime-approved", cols=8).save(evidence_dir / "topdown-objects-nonfx-accepted-candidate-preview.png")
    contact_sheet(excluded_cards, "H5.68 Topdown Objects Excluded Effects Preview", "future regeneration/base-sprite/particle candidates • not cleaned • not runtime-approved", cols=4).save(evidence_dir / "topdown-objects-excluded-effects-preview.png")
    table_preview(regions_out, "H5.68 Topdown Objects Non-FX Cleanup Table Preview", "status for all 64 source cells • effects excluded • candidates need review").save(evidence_dir / "topdown-objects-nonfx-cleanup-table-preview.png")
    add_title(Image.alpha_composite(source_img, mask_overlay), "H5.68 Topdown Objects Edge Mask Overlay", "red overlay marks edge-connected background removal masks • method proof, not runtime approval").save(evidence_dir / "topdown-objects-nonfx-mask-overlay.png")

    cleanup_manifest = {
        "schemaVersion": "0.1",
        "status": "draft",
        "reviewStatus": "needs-human-review",
        "pipelineUse": "draft-nonfx-cleanup-candidate",
        "runtimeEligibility": "not-runtime-approved",
        "domain": "topdown-objects",
        "operationalType": "topdown-objects-selective-nonfx-cleanup-candidate",
        "sourceSheet": repo_rel(source_path, repo_root),
        "sourceRegionManifest": repo_rel(manifest_path, repo_root),
        "derivedSheet": repo_rel(output_path, repo_root),
        "runLog": run_log_rel,
        "sourceDimensions": {"w": source_img.width, "h": source_img.height},
        "derivedDimensions": {"w": out_sheet.width, "h": out_sheet.height},
        "degradedSource": True,
        "declaredExtension": source_path.suffix,
        "actualFileSignature": Image.open(source_path).format,
        "method": args.method,
        "methodStatus": args.method_status,
        "methodParameters": params,
        "sourcePngModified": False,
        "runtimeFilesModified": False,
        "placementApproval": "none",
        "gameplayApproval": "none",
        "collisionApproval": "none",
        "interactionApproval": "none",
        "excludedEffectRegions": sorted(excluded),
        "candidateRegionCount": stats["candidateRegions"],
        "excludedRegionCount": stats["excludedRegions"],
        "blankTransparentRegionCount": sum(1 for r in regions_out if r["cleanupStatus"] == "blank-empty-cell-transparent"),
        "regions": regions_out,
        "notes": [
            "H5.68 supersedes H5.65 for Topdown Objects cleanup-candidate evaluation.",
            "H5.65 remains historical failed/limited exploratory evidence and is not promoted.",
            "Source has .png extension but JPEG-formatted bytes; treat as degraded source.",
            "Effect/glow/fire/portal/smoke/slime/shadow regions are intentionally excluded.",
            "Torches/campfires/braziers should later be regenerated as base sprites without flames/glow.",
            "Effects should later be layered through particles, FX sprites, or runtime effects.",
            "No runtime behavior, placement, collision, interaction, pickup, loot, chest, key, portal, light, flame, trap, slime, pressure plate, or shadow behavior is approved.",
        ],
    }

    with cleanup_manifest_path.open("w", encoding="utf-8") as f:
        json.dump(cleanup_manifest, f, indent=2)
        f.write("\n")

    summary = {
        "output": repo_rel(output_path, repo_root),
        "cleanupManifest": repo_rel(cleanup_manifest_path, repo_root),
        "evidenceDir": repo_rel(evidence_dir, repo_root),
        "candidateRegionCount": stats["candidateRegions"],
        "excludedRegions": sorted(excluded),
        "transparentPixels": stats["transparentPixels"],
        "totalCandidatePixels": stats["totalCandidatePixels"],
        "methodParameters": params,
        "evidenceFiles": sorted(p.name for p in evidence_dir.glob("*.png")),
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
