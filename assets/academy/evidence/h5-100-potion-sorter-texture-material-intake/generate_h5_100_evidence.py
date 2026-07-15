from __future__ import annotations
import hashlib, json, math, textwrap, zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat

ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
LANE = "H5.100"
BASELINE = "c2058e4e682d9e7e5ecfab8ede06c5b5f7989af8"
RETRIEVED = "2026-07-14"
EVIDENCE = ROOT / "assets/academy/evidence/h5-100-potion-sorter-texture-material-intake"
SOURCE = ROOT / "assets/academy/materials/source/h5-100"
MANIFEST_DIR = ROOT / "manifests/academy/games/potion-sorter/planning"
REPORT = ROOT / "docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_100_POTION_SORTER_TEXTURE_MATERIAL_INTAKE_AND_PROVENANCE.md"
RUN_LOG = EVIDENCE / "pipeline-run-log.json"
MANIFEST_DIR.mkdir(parents=True, exist_ok=True)

AMBIENT = [
    ("WoodSiding008", "Wood Siding 008", "structural-wood", "primary", "timber beams, wall planks, conveyor slats"),
    ("WoodFloor065B", "Wood Floor 065 B", "structural-wood", "alternate", "worn counter, floor, or secondary slats"),
    ("Bricks089", "Bricks 089", "rough-stone", "primary", "dark medieval masonry and arch faces"),
    ("Bricks100", "Bricks 100", "rough-stone", "alternate", "warmer pale masonry accent"),
    ("Metal046B", "Metal 046 B", "dark-iron", "primary", "rails, chain housings, brackets, mechanism plates"),
    ("Metal053C", "Metal 053 C", "dark-iron", "alternate", "heavier rust accent, not broad coverage"),
    ("Metal008", "Metal 008", "aged-brass-bronze", "primary", "gears, rims, fittings, mechanism accents"),
    ("Paper006", "Paper 006", "parchment-paper", "primary", "labels, notices, recipe cards"),
    ("SurfaceImperfections015", "Surface Imperfections 015", "grime-wear", "primary", "restrained soot, dust, and wear overlay"),
]

FX = [
    ("smoke_06.png", "steam-smoke", "primary", "steam vent and soft smoke puffs"),
    ("dirt_02.png", "dust-debris", "primary", "dust burst and conveyor debris"),
    ("spark_01.png", "sparks", "primary", "compact electrical or metal-impact burst"),
    ("light_01.png", "glow-noise", "primary", "potion glow and restrained bloom helper"),
    ("smoke_03.png", "steam-smoke", "deferred", "smaller alternate; primary is more readable"),
    ("dirt_03.png", "dust-debris", "deferred", "too dense for restrained default use"),
    ("spark_05.png", "sparks", "deferred", "reads as a large lightning stroke"),
    ("magic_04.png", "glow-noise", "deferred", "cross-shaped flare is too specific"),
]

RESEARCH_DECISIONS = [
    ("Paper004", "defer", "visible lined/corrugated character is less parchment-like than Paper006"),
    ("Leaking006", "defer", "narrow directional leak is too composition-specific for the first pantry"),
    ("ambientCG glass facade/window materials", "reject", "architectural panes are not honest bottle-glass helpers"),
    ("ambientCG liquid search results", "reject", "no small neutral browser-game helper met the lane boundary"),
    ("Kenney black-background duplicates", "reject", "transparent originals are the correct reusable source"),
    ("Kenney Unity sample package", "defer", "engine sample is unrelated to source-helper intake"),
    ("ambientCG normal/roughness/metalness/displacement maps", "defer", "sealed in archives; H5.100 approves color-source study only"),
    ("Metal055B", "reject", "too pale to carry the dark-iron role without relying on tinting"),
    ("Metal063", "defer", "dark but too glossy and reflection-heavy for the primary authored iron vocabulary"),
    ("Metal019", "defer", "useful smudged metal, but Metal046B reads more clearly as dirty black iron"),
    ("external glass texture", "defer", "H5.101 should audition code-authored transparency with existing bottle geometry"),
    ("external potion-liquid texture", "defer", "H5.101 should audition color, alpha, and the selected glow/noise helper"),
]

SHORTLIST = ["WoodSiding008", "Bricks089", "Metal046B", "Metal008", "Paper006",
             "SurfaceImperfections015", "smoke_06.png", "dirt_02.png", "spark_01.png", "light_01.png"]
SCENE_TARGETS = {
    "structural-wood": ["room timber frame", "conveyor slats", "shelf/counter faces"],
    "rough-stone": ["wall fields", "arch surrounds", "floor/wall masonry accents"],
    "dark-iron": ["conveyor rails", "chains", "brackets", "mechanism housings"],
    "aged-brass-bronze": ["gears", "valves", "rims", "mechanism highlights"],
    "parchment-paper": ["bottle labels", "sorting labels", "recipe and notice cards"],
    "grime-wear": ["mask/overlay on stone, wood, and metal", "soot near vents"],
    "steam-smoke": ["steam vents", "cauldron vapor", "machine exhaust"],
    "dust-debris": ["conveyor impacts", "floor dust", "crate movement"],
    "sparks": ["metal contact", "mechanism fault", "success accent if restrained"],
    "glow-noise": ["potion liquid glow", "bottle halo", "alchemy mechanism pulse"],
}


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def aggregate_sha(paths: list[Path]) -> str:
    h = hashlib.sha256()
    for path in sorted(paths, key=lambda p: rel(p)):
        h.update(rel(path).encode("utf-8"))
        h.update(sha256(path).encode("ascii"))
    return h.hexdigest()


def image_audit(path: Path) -> dict[str, Any]:
    with Image.open(path) as im:
        original_mode = im.mode
        rgba = im.convert("RGBA")
        rgb = rgba.convert("RGB")
        alpha = rgba.getchannel("A")
        alpha_range = alpha.getextrema()
        edge = 4
        lr = ImageChops.difference(rgb.crop((0, 0, edge, rgb.height)), rgb.crop((rgb.width-edge, 0, rgb.width, rgb.height)))
        tb = ImageChops.difference(rgb.crop((0, 0, rgb.width, edge)), rgb.crop((0, rgb.height-edge, rgb.width, rgb.height)))
        seam = round((sum(ImageStat.Stat(lr).mean) + sum(ImageStat.Stat(tb).mean)) / 6 / 255, 4)
        continuity = "likely-continuous" if seam < 0.08 else "moderate-seam-risk" if seam < 0.16 else "high-seam-risk"
        lum = rgb.convert("L")
        contrast = round(ImageStat.Stat(lum).stddev[0], 2)
        return {"width": im.width, "height": im.height, "format": im.format, "colorMode": original_mode,
                "alphaPresent": "A" in original_mode, "meaningfulTransparency": alpha_range != (255, 255),
                "alphaRange": list(alpha_range), "edgeDifferenceScore": seam,
                "observedEdgeContinuity": continuity, "luminanceStdDev": contrast}


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = ["C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
             "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()

FONT_TITLE = load_font(30, True)
FONT_HEAD = load_font(20, True)
FONT_BODY = load_font(15)
FONT_SMALL = load_font(12)
BG = (28, 24, 36, 255)
PANEL = (48, 43, 58, 255)
TEXT = (245, 241, 225, 255)
MUTED = (194, 188, 174, 255)
ACCENT = (227, 178, 82, 255)


def checker(size: tuple[int, int], step: int = 24) -> Image.Image:
    out = Image.new("RGBA", size, (50, 50, 58, 255))
    draw = ImageDraw.Draw(out)
    for y in range(0, size[1], step):
        for x in range(0, size[0], step):
            if (x // step + y // step) % 2 == 0:
                draw.rectangle((x, y, x + step - 1, y + step - 1), fill=(76, 76, 86, 255))
    return out


def fitted(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as im:
        image = im.convert("RGBA")
        image.thumbnail(size, Image.Resampling.LANCZOS)
        base = checker(size) if image.getchannel("A").getextrema() != (255, 255) else Image.new("RGBA", size, PANEL)
        x = (size[0] - image.width) // 2
        y = (size[1] - image.height) // 2
        base.alpha_composite(image, (x, y))
        return base


def wrap(draw: ImageDraw.ImageDraw, text: str, width: int, font=FONT_BODY) -> list[str]:
    words, lines, current = text.split(), [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= width:
            current = candidate
        else:
            if current: lines.append(current)
            current = word
    if current: lines.append(current)
    return lines


def contact_sheet(title: str, cards: list[dict[str, Any]], output: Path, cols: int = 3) -> None:
    card_w, card_h, pad, top = 360, 430, 18, 82
    rows = math.ceil(len(cards) / cols)
    canvas = Image.new("RGBA", (cols * card_w, top + rows * card_h), BG)
    draw = ImageDraw.Draw(canvas)
    draw.text((pad, 18), title, font=FONT_TITLE, fill=TEXT)
    draw.text((pad, 54), "H5.100 evidence only · source aspect preserved · no color correction · not runtime-approved", font=FONT_SMALL, fill=MUTED)
    for i, card in enumerate(cards):
        x, y = (i % cols) * card_w + pad, top + (i // cols) * card_h + pad
        draw.rounded_rectangle((x, y, x + card_w - 2 * pad, y + card_h - 2 * pad), 12, fill=PANEL)
        if card.get("path"):
            canvas.alpha_composite(fitted(card["path"], (card_w - 4 * pad, 248)), (x + pad, y + pad))
        else:
            draw.rounded_rectangle((x + pad, y + pad, x + card_w - 3 * pad, y + 248), 8, outline=ACCENT, width=2)
            yy = y + 48
            for line in wrap(draw, card.get("placeholder", "No source selected"), card_w - 6 * pad, FONT_HEAD):
                draw.text((x + 2 * pad, yy), line, font=FONT_HEAD, fill=ACCENT); yy += 28
        draw.text((x + pad, y + 276), card["label"], font=FONT_HEAD, fill=TEXT)
        draw.text((x + pad, y + 304), card["status"], font=FONT_BODY, fill=ACCENT)
        yy = y + 332
        for line in wrap(draw, card["note"], card_w - 4 * pad, FONT_SMALL)[:4]:
            draw.text((x + pad, yy), line, font=FONT_SMALL, fill=MUTED); yy += 17
    canvas.convert("RGB").save(output, quality=95)


def table_image(title: str, headers: list[str], rows: list[list[str]], output: Path, widths: list[int]) -> None:
    pad, row_h, head_h = 20, 48, 52
    total_w = sum(widths) + pad * 2
    total_h = 84 + head_h + row_h * len(rows) + pad
    image = Image.new("RGBA", (total_w, total_h), BG)
    draw = ImageDraw.Draw(image)
    draw.text((pad, 16), title, font=FONT_TITLE, fill=TEXT)
    y = 84
    x = pad
    for header, width in zip(headers, widths):
        draw.rectangle((x, y, x + width, y + head_h), fill=(77, 62, 43, 255))
        draw.text((x + 8, y + 14), header, font=FONT_BODY, fill=TEXT)
        x += width
    y += head_h
    for row_index, row in enumerate(rows):
        x = pad
        fill = PANEL if row_index % 2 == 0 else (41, 37, 50, 255)
        for cell, width in zip(row, widths):
            draw.rectangle((x, y, x + width, y + row_h), fill=fill, outline=(88, 80, 96, 255))
            lines = wrap(draw, str(cell), width - 14, FONT_SMALL)[:2]
            yy = y + 8
            for line in lines:
                draw.text((x + 7, yy), line, font=FONT_SMALL, fill=TEXT); yy += 16
            x += width
        y += row_h
    image.convert("RGB").save(output, quality=95)


def json_write(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def ambient_path(asset_id: str) -> Path:
    folder = SOURCE / "ambientcg/extracted-color" / asset_id
    return next(folder.glob("*_Color.*"))


def source_record(asset_id: str, title: str, family: str, disposition: str, use: str) -> dict[str, Any]:
    archive = SOURCE / "ambientcg/archives" / f"{asset_id}_1K-JPG.zip"
    metadata_path = SOURCE / "ambientcg/metadata" / f"{asset_id}-api-v3.json"
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))["assets"][0]
    color_path = ambient_path(asset_id)
    audit = image_audit(color_path)
    return {
        "id": asset_id, "sourceTitle": title, "creator": "ambientCG / Lennart Demes",
        "sourcePage": metadata["url"], "directDownloadSource": f"https://ambientcg.com/get?file={asset_id}_1K-JPG.zip",
        "retrievalDate": RETRIEVED, "license": "CC0 1.0", "attributionRequired": False,
        "redistributionConditions": "CC0; raw-file redistribution permitted; no attribution required",
        "originalArchive": rel(archive), "originalArchiveBytes": archive.stat().st_size,
        "originalArchiveSha256": sha256(archive), "metadataRecord": rel(metadata_path),
        "extractedFiles": [{"path": rel(color_path), "sha256": sha256(color_path), **audit}],
        "advertisedTileability": True, "materialFamily": family, "intendedFutureUse": use,
        "disposition": "promoted-candidate" if disposition == "primary" else "pantry-alternate",
        "selectionRole": disposition,
    }


def fx_record(filename: str, family: str, disposition: str, use: str) -> dict[str, Any]:
    archive = SOURCE / "kenney/archives/kenney_particle-pack.zip"
    path = SOURCE / "kenney/extracted-selected" / filename
    audit = image_audit(path)
    return {
        "id": f"kenney-particle-{path.stem}", "sourceTitle": f"Particle Pack 1.1 / {filename}",
        "creator": "Kenney Vleugels (Kenney.nl)", "sourcePage": "https://kenney.nl/assets/particle-pack",
        "directDownloadSource": "https://kenney.nl/media/pages/assets/particle-pack/f8fe0f8cb8-1677578741/kenney_particle-pack.zip",
        "retrievalDate": RETRIEVED, "license": "CC0 1.0", "attributionRequired": False,
        "redistributionConditions": "CC0; personal and commercial use; credit optional",
        "originalArchive": rel(archive), "originalArchiveBytes": archive.stat().st_size,
        "originalArchiveSha256": sha256(archive), "archiveMember": f"PNG (Transparent)/{filename}",
        "extractedFiles": [{"path": rel(path), "sha256": sha256(path), **audit}],
        "advertisedTileability": False, "materialFamily": family, "intendedFutureUse": use,
        "disposition": "promoted-candidate" if disposition == "primary" else "deferred",
        "selectionRole": disposition,
    }


ambient_records = [source_record(*item) for item in AMBIENT]
fx_records = [fx_record(*item) for item in FX]
records = ambient_records + fx_records
archive_paths = sorted((SOURCE / "ambientcg/archives").glob("*.zip")) + [SOURCE / "kenney/archives/kenney_particle-pack.zip"]
source_sha = aggregate_sha(archive_paths)
now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
run_rel = rel(RUN_LOG)
pipeline_run = {
    "tool": "Python 3 + Pillow via MCP Orchestrator / Desktop Commander",
    "command": "make-evidence", "method": "h5-100-source-truth-material-contact-sheets",
    "methodStatus": "pilot-only", "runLog": run_rel, "sourceSha256": source_sha,
    "generatedAt": now, "gitBaseline": BASELINE, "sourcePngModified": False, "runtimeFilesModified": False,
}

classification_assets = []
for record in records:
    audit = record["extractedFiles"][0]
    family = record["materialFamily"]
    is_fx = family in {"steam-smoke", "dust-debris", "sparks", "glow-noise"}
    classification_assets.append({
        "id": record["id"], "sourceFile": audit["path"], "materialFamily": family,
        "intendedFutureUse": record["intendedFutureUse"], "dimensions": [audit["width"], audit["height"]],
        "fileType": audit["format"], "colorMode": audit["colorMode"], "alphaStatus": "meaningful-alpha" if audit["meaningfulTransparency"] else "no-alpha",
        "seamlessTileableClaim": record["advertisedTileability"],
        "observedEdgeContinuity": audit["observedEdgeContinuity"],
        "edgeDifferenceScore": audit["edgeDifferenceScore"],
        "dominantVisualScale": "particle-helper" if is_fx else ("micro-wear-noise" if family == "grime-wear" else "medium-material-detail"),
        "lightingBakedIntoSource": "none-minimal" if is_fx or family in {"parchment-paper", "grime-wear"} else "directional-low-to-moderate",
        "perspectiveBakedIntoSource": False,
        "repetitionRisk": "not-applicable-single-particle" if is_fx else ("medium" if audit["observedEdgeContinuity"] != "likely-continuous" else "low-to-medium"),
        "contrastLevel": "high" if audit["luminanceStdDev"] >= 55 else "medium" if audit["luminanceStdDev"] >= 30 else "low",
        "likelyTintability": "high" if is_fx or family in {"grime-wear", "parchment-paper"} else "medium",
        "suitabilityForRuntimeTiling": "candidate-needs-h5-101-audition" if record["advertisedTileability"] else "not-a-tiling-texture",
        "suitabilityForMasksOrOverlays": "strong" if family in {"grime-wear", "steam-smoke", "dust-debris", "sparks", "glow-noise"} else "limited",
        "likelySceneRigTargets": SCENE_TARGETS[family],
        "visualStyleCompatibility": "compatible-with-authored-medieval-alchemy-direction",
        "disposition": record["disposition"], "runtimeEligibility": "not-runtime-approved",
    })

source_manifest_path = MANIFEST_DIR / "academy.potion-sorter.texture-material-source-intake-h5-100.json"
provenance_manifest_path = MANIFEST_DIR / "academy.potion-sorter.texture-material-provenance-h5-100.json"
classification_manifest_path = MANIFEST_DIR / "academy.potion-sorter.material-classification-h5-100.json"

common = {
    "schemaVersion": "0.1", "laneId": LANE, "status": "reviewed", "reviewStatus": "human-review-passed",
    "runtimeEligibility": "not-runtime-approved", "runtimeApproved": False,
    "pantryEligibility": "approved-for-reusable-glyphforge-source-pantry",
    "humanReviewVerdict": {
        "date": "2026-07-14",
        "verdict": "approved-for-reusable-glyphforge-material-pantry",
        "scope": "all provenance-clean accepted source families, original packages, extracted review sources, hashes, licenses, classifications, and useful alternatives",
        "constraints": [
            "pantry acceptance does not require Potion Sorter runtime use",
            "Potion Sorter material selection remains provisional until H5.101 neutral-specimen audition",
            "research previews remain evidence-only and are not pantry or runtime assets",
            "no source family or extracted candidate is runtime-approved by H5.100",
        ],
    },
    "sourceBaselineCommit": BASELINE, "canonicalGamePath": "games/tier-1/02-potion-sorter",
    "evidenceRoot": rel(EVIDENCE), "pipelineRun": pipeline_run,
}
source_manifest = {**common, "pipelineUse": "texture-material-source-intake-planning",
    "purpose": "Bounded reusable material vocabulary for future neutral H5.101 specimens and later Potion Sorter SceneRig work.",
    "scopeExclusions": ["room implementation", "SceneRig implementation", "runtime texture wiring", "shaders/PBR", "particle implementation", "flattened room background"],
    "sourceFamilies": ["ambientCG materials", "Kenney Particle Pack 1.1"],
    "researchPreviewPolicy": "evidence-only; official thumbnails and research contact sheets are not canonical pantry sources or runtime assets",
    "intakeBounds": {"ambientMaterialArchives": 9, "fxArchiveFamilies": 1, "resolutionPolicy": "1K JPG color maps only for material candidates", "advancedMaps": "archive-preserved-but-not-extracted"},
    "provisionalShortlist": SHORTLIST, "researchDecisions": [{"candidate": a, "disposition": b, "reason": c} for a,b,c in RESEARCH_DECISIONS],
    "records": [{k: v for k, v in r.items() if k not in {"originalArchiveSha256", "extractedFiles"}} for r in records],
}
provenance_manifest = {**common, "pipelineUse": "texture-material-source-provenance",
    "licenseVerdict": "clear-cc0-source-families-no-attribution-required",
    "licenseRecords": [
        {"sourceFamily": "ambientCG", "license": "CC0 1.0", "licenseFiles": [
            "assets/academy/materials/source/h5-100/ambientcg/license/ambientcg-license-page.html",
            "assets/academy/materials/source/h5-100/ambientcg/license/CC0-1.0-legalcode.txt"],
         "attributionRequired": False, "rawRedistributionAllowed": True},
        {"sourceFamily": "Kenney Particle Pack 1.1", "license": "CC0 1.0", "licenseFiles": [
            "assets/academy/materials/source/h5-100/kenney/license/kenney-particle-pack-source-page.html",
            "assets/academy/materials/source/h5-100/kenney/license/License.txt",
            "assets/academy/materials/source/h5-100/kenney/license/CC0-1.0-legalcode.txt"],
         "attributionRequired": False, "rawRedistributionAllowed": True},
    ],
    "sourceRecords": records,
    "archiveAggregateSha256": source_sha,
    "archiveCount": len(archive_paths),
    "totalArchiveBytes": sum(p.stat().st_size for p in archive_paths),
    "totalSourceShelfBytes": sum(p.stat().st_size for p in SOURCE.rglob("*") if p.is_file()),
}
classification_manifest = {**common, "pipelineUse": "texture-material-technical-classification",
    "classificationPolicy": "source truth only; no seam repair, recolor, crop, relighting, shader, normal-map, or PBR promotion",
    "assets": classification_assets,
    "glassLiquidDecision": {
        "glass": "No external glass texture promoted. H5.101 should audition code-authored transparency/reflection treatment on neutral bottle geometry.",
        "liquid": "No external liquid texture promoted. H5.101 should audition code-authored color/alpha with the shortlisted glow helper.",
        "existingPotionAssetAuthority": "The H5.49 cleanup manifest remains separate and not runtime-approved; denied regions 9 and 14 remain excluded.",
    },
}
json_write(source_manifest_path, source_manifest)
json_write(provenance_manifest_path, provenance_manifest)
json_write(classification_manifest_path, classification_manifest)

cards_by_family: dict[str, list[dict[str, Any]]] = {}
for record in records:
    path = ROOT / record["extractedFiles"][0]["path"]
    cards_by_family.setdefault(record["materialFamily"], []).append({
        "path": path, "label": record["id"], "status": record["selectionRole"],
        "note": f"{record['intendedFutureUse']} · original {path.name}",
    })
family_outputs = []
for family, title in [
    ("structural-wood", "Accepted Source Family · Structural Wood"),
    ("rough-stone", "Accepted Source Family · Rough Stone / Masonry"),
    ("dark-iron", "Accepted Source Family · Dark Iron"),
    ("aged-brass-bronze", "Accepted Source Family · Aged Brass / Bronze"),
    ("parchment-paper", "Accepted Source Family · Parchment / Aged Paper"),
    ("grime-wear", "Accepted Source Family · Restrained Grime / Wear"),
]:
    output = EVIDENCE / f"family-{family}-contact-sheet.jpg"
    contact_sheet(title, cards_by_family[family], output, cols=2 if len(cards_by_family[family]) > 1 else 1)
    family_outputs.append(output)
fx_cards = sum((cards_by_family[key] for key in ["steam-smoke", "dust-debris", "sparks", "glow-noise"]), [])
fx_output = EVIDENCE / "family-fx-helpers-contact-sheet.jpg"
contact_sheet("Accepted Source Family · FX Helpers (Promoted + Deferred Audition Candidates)", fx_cards, fx_output, cols=4)
family_outputs.append(fx_output)

record_by_id = {record["id"]: record for record in records}
def card_for(asset_id: str) -> dict[str, Any]:
    record = record_by_id[asset_id if not asset_id.endswith(".png") else f"kenney-particle-{Path(asset_id).stem}"]
    path = ROOT / record["extractedFiles"][0]["path"]
    return {"path": path, "label": asset_id, "status": "provisional primary",
            "note": record["intendedFutureUse"]}

core_output = EVIDENCE / "core-material-palette-overview.jpg"
contact_sheet("Core Material Palette · Provisional H5.100 Shortlist",
              [card_for(x) for x in ["WoodSiding008", "Bricks089", "Metal046B", "Metal008", "Paper006"]],
              core_output, cols=3)
support_cards = [card_for("SurfaceImperfections015"), card_for("smoke_06.png"), card_for("dirt_02.png"),
                 card_for("spark_01.png"), card_for("light_01.png"),
                 {"path": None, "label": "Glass helper", "status": "deferred to H5.101",
                  "placeholder": "NO EXTERNAL GLASS TEXTURE PROMOTED",
                  "note": "Audition code-authored transparency/reflection on neutral bottle geometry."},
                 {"path": None, "label": "Potion-liquid helper", "status": "deferred to H5.101",
                  "placeholder": "NO EXTERNAL LIQUID TEXTURE PROMOTED",
                  "note": "Audition code-authored color/alpha with the shortlisted glow helper."}]
support_output = EVIDENCE / "support-material-overview.jpg"
contact_sheet("Support Materials · Wear, Glass/Liquid Decision, and FX Helpers", support_cards, support_output, cols=3)
inventory_rows = []
for record in ambient_records:
    inventory_rows.append([record["id"], record["materialFamily"], record["selectionRole"],
                           f"{record['originalArchiveBytes'] / 1024 / 1024:.2f} MiB", "CC0 1.0"])
kenney_archive = SOURCE / "kenney/archives/kenney_particle-pack.zip"
inventory_rows.append(["Kenney Particle Pack 1.1", "FX helpers", "bounded extraction",
                       f"{kenney_archive.stat().st_size / 1024 / 1024:.2f} MiB", "CC0 1.0"])
inventory_output = EVIDENCE / "source-inventory-overview.jpg"
table_image("Source Inventory Overview", ["Source", "Family", "Role", "Archive", "License"],
            inventory_rows, inventory_output, [280, 230, 220, 140, 150])

decision_rows = [[name, disposition, reason] for name, disposition, reason in RESEARCH_DECISIONS]
for record in records:
    decision_rows.insert(0, [record["id"], record["disposition"], record["intendedFutureUse"]])
decision_output = EVIDENCE / "candidate-defer-reject-table.jpg"
table_image("Candidate / Defer / Reject Table", ["Candidate", "Disposition", "Reason / Intended Use"],
            decision_rows, decision_output, [320, 220, 700])

provenance_rows = [
    ["ambientCG", "CC0 1.0", "license page + legal code preserved", "9 archives / 9 color maps", "complete"],
    ["Kenney Particle Pack 1.1", "CC0 1.0", "source page + pack License.txt + legal code", "1 intact archive / 8 audition PNGs", "complete"],
    ["Archive hashes", "SHA-256", source_sha[:20] + "… aggregate", f"{len(archive_paths)} archives", "verified by validation"],
    ["Runtime boundary", "none", "no runtime registration or game edits", "planning/evidence only", "preserved"],
]
provenance_output = EVIDENCE / "provenance-status-table.jpg"
table_image("Provenance Status Table", ["Source / Boundary", "Authority", "Preserved Record", "Coverage", "Verdict"],
            provenance_rows, provenance_output, [250, 170, 440, 260, 190])

mapping_rows = []
for asset_id in SHORTLIST:
    record = record_by_id[asset_id if not asset_id.endswith(".png") else f"kenney-particle-{Path(asset_id).stem}"]
    mapping_rows.append([asset_id, record["materialFamily"], ", ".join(SCENE_TARGETS[record["materialFamily"]]), "H5.101 neutral specimen only"])
mapping_rows += [
    ["Glass helper", "code-authored", "neutral bottle geometry", "no external texture promoted"],
    ["Potion liquid", "code-authored + light_01", "neutral liquid fill / glow treatment", "no external liquid texture promoted"],
]
mapping_output = EVIDENCE / "material-to-future-scenerig-mapping-table.jpg"
table_image("Material-to-Future-SceneRig Mapping", ["Candidate", "Family", "Likely Targets", "Next Boundary"],
            mapping_rows, mapping_output, [280, 220, 620, 300])
audit_path = EVIDENCE / "source-image-and-hash-audit.json"
json_write(audit_path, {
    "schemaVersion": "0.1", "laneId": LANE, "generatedAt": now,
    "archiveAggregateSha256": source_sha,
    "archives": [{"path": rel(path), "bytes": path.stat().st_size, "sha256": sha256(path)} for path in archive_paths],
    "images": [{"id": record["id"], **record["extractedFiles"][0]} for record in records],
    "duplicateHashGroups": {},
})

readme = f"""# H5.100 Potion Sorter Texture Material Intake Evidence

## Status

Reviewed / Reusable Pantry Accepted / Not Runtime Approved

## Purpose

This evidence records a small reusable source-material vocabulary for a future code-authored medieval alchemy production room. It does not implement the room, SceneRig, runtime texture wiring, shaders, PBR, particles, or a flattened background.

## Human Review Verdict

The provenance-clean ambientCG and Kenney source families are approved for the reusable GlyphForge texture/material pantry. Pantry acceptance does not require Potion Sorter usage. The active Potion Sorter palette remains provisional until H5.101 neutral-specimen audition, and `research-previews/` remains evidence-only.

## Provisional Shortlist

- Structural wood: `WoodSiding008`
- Rough stone: `Bricks089`
- Dark iron: `Metal046B`
- Aged brass/bronze: `Metal008`
- Parchment: `Paper006`
- Grime/wear: `SurfaceImperfections015`
- FX helpers: `smoke_06.png`, `dirt_02.png`, `spark_01.png`, `light_01.png`
- Glass: no external texture promoted; code-authored transparency is deferred to H5.101.
- Potion liquid: no external texture promoted; code-authored color/alpha plus the glow helper is deferred to H5.101.

## Evidence Index

- `source-inventory-overview.jpg`
- `family-structural-wood-contact-sheet.jpg`
- `family-rough-stone-contact-sheet.jpg`
- `family-dark-iron-contact-sheet.jpg`
- `family-aged-brass-bronze-contact-sheet.jpg`
- `family-parchment-paper-contact-sheet.jpg`
- `family-grime-wear-contact-sheet.jpg`
- `family-fx-helpers-contact-sheet.jpg`
- `core-material-palette-overview.jpg`
- `support-material-overview.jpg`
- `candidate-defer-reject-table.jpg`
- `provenance-status-table.jpg`
- `material-to-future-scenerig-mapping-table.jpg`
- `source-image-and-hash-audit.json`
- `pipeline-run-log.json`
- `research-previews/` contains official preview-based research evidence only.

## Evidence Rules

All source aspect ratios are preserved. No source color correction, seam repair, relighting, crop, recolor, or runtime derivative was created. Contact sheets and tables are evidence-only and must never be registered as runtime assets.

## Next Boundary

H5.101 may apply the shortlist to neutral code-authored specimens: timber beam, stone arch, conveyor slat, iron rail, brass gear, parchment label, glass bottle, and potion liquid/glow treatment. Room composition and runtime wiring remain later work.
"""
(EVIDENCE / "README.md").write_text(readme, encoding="utf-8")
report = f"""# Tiny Goblin Academy H5.100 — Potion Sorter Texture Material Intake and Provenance

## Status

Reviewed / Reusable Pantry Accepted / No Runtime Approval

## Baseline and Authority

- Baseline: `{BASELINE}` (`docs: record button goblin visual integration lessons`)
- Canonical game path: `games/tier-1/02-potion-sorter`
- Repository state at lane start: clean
- Potion Sorter authority inspected: surviving runtime, H5.46-H5.49 asset records, Academy asset doctrine, manifest maturity index, H5.67 provenance contract, and Button Goblin visual-integration lessons.
- Archival note: the current Potion Sorter folder has no game-local README, playable-loop contract, playtest report, human-review file, or lessons file. This lane did not fabricate replacements.

## Source Sites Researched

1. ambientCG official asset pages, API v3 metadata, downloads, and license documentation.
2. Kenney official Particle Pack page, original archive, and embedded `License.txt`.

## License and Provenance Verdict

Both accepted source families are CC0 1.0. Preserved records state that attribution is not required and commercial use is allowed. Original archives are preserved unchanged, direct-source metadata/license records are local, and SHA-256 hashes cover every archive and extracted candidate. The archive aggregate SHA-256 is `{source_sha}`. Official thumbnails and research contact sheets remain evidence-only; the licensed source archives and extracted source files are the canonical reusable pantry materials.

## Intake Result

- 9 ambientCG 1K-JPG archives preserved.
- 9 color maps extracted for candidate review.
- 1 Kenney Particle Pack archive preserved intact.
- 8 transparent PNGs extracted for bounded FX audition; 4 are shortlisted and 4 remain deferred alternates.
- Advanced ambientCG maps remain only inside sealed archives.
- Total archive footprint: {sum(p.stat().st_size for p in archive_paths) / 1024 / 1024:.2f} MiB.
- Total H5.100 source-shelf footprint: {sum(p.stat().st_size for p in SOURCE.rglob('*') if p.is_file()) / 1024 / 1024:.2f} MiB.

## Provisional Material Shortlist

| Class | Primary | Alternate / Boundary |
| --- | --- | --- |
| Structural wood | WoodSiding008 | WoodFloor065B retained as alternate |
| Rough stone | Bricks089 | Bricks100 retained as warmer alternate |
| Dark iron | Metal046B | Metal053C retained as rust-heavy alternate |
| Brass/bronze | Metal008 | No second source family |
| Parchment | Paper006 | Paper004 deferred |
| Grime/wear | SurfaceImperfections015 | Leaking006 deferred |
| Glass | No external texture | Code-authored transparency audition in H5.101 |
| Potion liquid | No external texture | Code-authored color/alpha plus `light_01` in H5.101 |
| Steam/smoke | smoke_06.png | smoke_03.png deferred alternate |
| Dust | dirt_02.png | dirt_03.png deferred as too dense |
| Sparks | spark_01.png | spark_05.png deferred as lightning-like |
| Glow/noise | light_01.png | magic_04.png deferred as too specific |

## Technical Audit Summary

Every extracted candidate records dimensions, file type, color mode, alpha status, edge-continuity score, contrast, tintability, tiling suitability, overlay suitability, likely SceneRig targets, style compatibility, and disposition. All ambientCG candidate maps are 1K color-source images; Kenney helpers retain meaningful alpha. H5.101 must test repetition and scale on neutral geometry before any Potion Sorter runtime selection.

## Scope Verdict

No Potion Sorter runtime, Hub/Tauri runtime, package, lockfile, shader, SceneRig, game loop, room background, runtime registry, or existing source asset was modified. H5.100 creates source intake, evidence, and planning records only.

## Human Review Verdict

Human review approves all provenance-clean accepted source families for the reusable GlyphForge texture/material pantry. This approval preserves original licensed packages, hashes, licenses and attribution records, material classifications, contact-sheet evidence, future SceneRig mappings, and useful alternatives. It does not require Potion Sorter to use every accepted source. The active Potion Sorter palette remains provisional until H5.101 neutral-specimen audition, and no material is runtime-approved by this lane.
"""
REPORT.write_text(report, encoding="utf-8")
output_files = [source_manifest_path, provenance_manifest_path, classification_manifest_path, REPORT,
                EVIDENCE / "README.md", audit_path, Path(__file__),
                ROOT / "manifests/academy/tooling/organization/academy.manifest-maturity-index.json",
                ROOT / "docs/assets/pantry/visual-assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md",
                ROOT / "CHANGELOG.md",
                EVIDENCE / "validate_h5_100_intake.py"]
evidence_files = sorted([p for p in EVIDENCE.rglob("*") if p.is_file() and p not in {RUN_LOG, Path(__file__)}
                         and p.suffix.lower() in {".jpg", ".png", ".json", ".md"}])
run_log = {
    "schemaVersion": "0.1", "contractVersion": "0.1",
    "tool": "Python 3 + Pillow via MCP Orchestrator / Desktop Commander",
    "command": "make-evidence", "method": "h5-100-source-truth-material-contact-sheets",
    "methodStatus": "pilot-only", "laneId": LANE,
    "agent": "Mega through MCP Orchestrator and Desktop Commander",
    "gitBaseline": BASELINE, "startedAt": now, "completedAt": now,
    "sourcePath": "assets/academy/materials/source/h5-100", "sourceSha256": source_sha,
    "inputManifests": [
        "manifests/academy/games/potion-sorter/academy.potion-sorter.cleanup-candidate.json",
        "manifests/academy/games/potion-sorter/lineage/academy.potion-sorter.regions.json",
        "manifests/academy/tooling/organization/academy.manifest-maturity-index.json",
    ],
    "outputFiles": [{"path": rel(path), "sha256": sha256(path)} for path in output_files],
    "evidenceFiles": [rel(path) for path in evidence_files],
    "outputFileHashes": [{"path": rel(path), "sha256": sha256(path)} for path in output_files + evidence_files],
    "validationCommands": [
        "python assets/academy/evidence/h5-100-potion-sorter-texture-material-intake/generate_h5_100_evidence.py",
        "python assets/academy/evidence/h5-100-potion-sorter-texture-material-intake/validate_h5_100_intake.py",
        "node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok",
        "node scripts/validate-academy-asset-manifests.mjs",
        "node scripts/validate-academy-shared-asset-regions.mjs",
        "node scripts/validate-academy-manifest.mjs",
        "node scripts/validate-hub-icons.mjs",
        "node scripts/asset-pipeline/smoke-check.mjs",
        "git diff --check",
    ],
    "warnings": [
        "Evidence shows flat source specimens only; no room composition is approved.",
        "Observed edge-continuity scores are screening measurements, not runtime tiling approval.",
        "Kenney audition alternates remain extracted for review but only four helpers are shortlisted.",
        "Glass and potion-liquid treatment remain code-authored H5.101 decisions.",
    ],
    "sourcePngModified": False, "runtimeFilesModified": False, "status": "completed",
}
json_write(RUN_LOG, run_log)
print(json.dumps({
    "records": len(records), "archives": len(archive_paths), "sourceSha256": source_sha,
    "archiveBytes": sum(p.stat().st_size for p in archive_paths),
    "sourceShelfBytes": sum(p.stat().st_size for p in SOURCE.rglob("*") if p.is_file()),
    "evidenceFiles": len(evidence_files), "manifests": [rel(p) for p in [source_manifest_path, provenance_manifest_path, classification_manifest_path]],
}, indent=2))
