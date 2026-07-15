from __future__ import annotations

import hashlib
import json
import math
import textwrap
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
EVIDENCE = ROOT / "assets/academy/evidence/h5-100c-stylized-fantasy-texture-pantry-addendum"
SOURCE = ROOT / "assets/academy/materials/source/h5-100c"
H5100 = ROOT / "assets/academy/materials/source/h5-100"
BASELINE = "c2058e4e682d9e7e5ecfab8ede06c5b5f7989af8"


def font(size: int, bold: bool = False):
    candidates = [
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


TITLE = font(34, True)
HEAD = font(20, True)
BODY = font(15)
SMALL = font(12)
BG = (27, 23, 35)
PANEL = (48, 42, 58)
TEXT = (246, 240, 220)
MUTED = (196, 187, 170)
GOLD = (225, 176, 80)
CYAN = (84, 203, 226)


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def wrap(text: str, width: int, size: int = 12) -> list[str]:
    return textwrap.wrap(text, width=max(12, width // max(6, size // 2)))


def fitted(path: Path, size: tuple[int, int], pixel: bool = False) -> Image.Image:
    with Image.open(path) as opened:
        image = opened.convert("RGB")
        resample = Image.Resampling.NEAREST if pixel else Image.Resampling.LANCZOS
        ratio = min(size[0] / image.width, size[1] / image.height)
        image = image.resize((max(1, int(image.width * ratio)), max(1, int(image.height * ratio))), resample)
        canvas = Image.new("RGB", size, PANEL)
        canvas.paste(image, ((size[0] - image.width) // 2, (size[1] - image.height) // 2))
        return canvas


def contact_sheet(title: str, subtitle: str, cards: list[dict], output: str, cols: int = 3):
    card_w, card_h, top, pad = 390, 410, 105, 18
    rows = math.ceil(len(cards) / cols)
    image = Image.new("RGB", (card_w * cols, top + card_h * rows), BG)
    draw = ImageDraw.Draw(image)
    draw.text((pad, 16), title, font=TITLE, fill=TEXT)
    draw.text((pad, 61), subtitle, font=SMALL, fill=MUTED)
    for index, card in enumerate(cards):
        x = index % cols * card_w + pad
        y = top + index // cols * card_h + pad
        draw.rounded_rectangle((x, y, x + card_w - pad * 2, y + card_h - pad * 2), radius=12, fill=PANEL)
        if card.get("path"):
            preview = fitted(card["path"], (card_w - pad * 4, 238), card.get("pixel", False))
            image.paste(preview, (x + pad, y + pad))
        else:
            draw.rounded_rectangle((x + pad, y + pad, x + card_w - pad * 3, y + 255), radius=8, outline=GOLD, width=3)
            for line_index, line in enumerate(wrap(card.get("placeholder", "No accepted source"), card_w - 80, 20)[:5]):
                draw.text((x + 2 * pad, y + 55 + line_index * 28), line, font=HEAD, fill=GOLD)
        draw.text((x + pad, y + 270), card["label"], font=HEAD, fill=TEXT)
        draw.text((x + pad, y + 299), card["role"], font=BODY, fill=GOLD)
        for line_index, line in enumerate(wrap(card["note"], card_w - 70)[:4]):
            draw.text((x + pad, y + 328 + line_index * 16), line, font=SMALL, fill=MUTED)
    image.save(EVIDENCE / output, quality=95)


def table(title: str, headers: list[str], rows: list[list[str]], widths: list[int], output: str):
    row_h, head_h, top, pad = 62, 48, 80, 18
    image = Image.new("RGB", (sum(widths) + pad * 2, top + head_h + row_h * len(rows) + pad), BG)
    draw = ImageDraw.Draw(image)
    draw.text((pad, 16), title, font=TITLE, fill=TEXT)
    y, x = top, pad
    for header, width in zip(headers, widths):
        draw.rectangle((x, y, x + width, y + head_h), fill=(86, 67, 43))
        draw.text((x + 8, y + 13), header, font=BODY, fill=TEXT)
        x += width
    y += head_h
    for row_index, row in enumerate(rows):
        x = pad
        fill = PANEL if row_index % 2 == 0 else (41, 36, 49)
        for cell, width in zip(row, widths):
            draw.rectangle((x, y, x + width, y + row_h), fill=fill, outline=(91, 81, 99))
            for line_index, line in enumerate(wrap(str(cell), width - 18)[:3]):
                draw.text((x + 8, y + 8 + line_index * 16), line, font=SMALL, fill=TEXT)
            x += width
        y += row_h
    image.save(EVIDENCE / output, quality=95)


KENNEY = SOURCE / "kenney/extracted-selected"
DEADKIR = SOURCE / "opengameart/deadkir-handpainted-tileables/originals"
PARCHMENT = SOURCE / "opengameart/luke-rustltd-parchment/originals/parchment.png"


def card(path: Path | None, label: str, role: str, note: str, pixel: bool = False, placeholder: str = ""):
    return {"path": path, "label": label, "role": role, "note": note, "pixel": pixel, "placeholder": placeholder}


def build_images():
    contact_sheet(
        "Fantasy timber candidates",
        "Accepted source pixels only · no recolor · pantry classification, not runtime selection",
        [
            card(KENNEY / "floor_wood_planks.png", "Kenney planks", "Primary identity", "Readable low-resolution boards for structural surfaces.", True),
            card(KENNEY / "wall_timber.png", "Kenney wall timber", "Primary identity", "Quiet timber field for broad authored structure.", True),
            card(DEADKIR / "wooden.png", "DeadKir painted wood", "Support alternate", "Higher-resolution hand-painted grain for selective accents."),
            card(KENNEY / "floor_wood_planks_damaged.png", "Kenney damaged planks", "Wear alternate", "Damage marks can support goblin wear without a realistic overlay.", True),
        ],
        "family-fantasy-timber-contact-sheet.jpg",
        2,
    )
    contact_sheet(
        "Chunky fantasy masonry candidates",
        "Kenney Retro Textures Fantasy · actual texture files, not rendered model previews",
        [
            card(KENNEY / "wall_brick_stone_center.png", "Stone brick wall", "Primary identity", "Chunky, readable blocks with built-in stylized value separation.", True),
            card(KENNEY / "wall_stone.png", "Stone wall", "Primary alternate", "Broader irregular stone rhythm for walls and foundations.", True),
            card(KENNEY / "wall_rock.png", "Rock wall", "Support alternate", "More organic cave or foundation character.", True),
            card(KENNEY / "floor_stone_pattern.png", "Stone floor pattern", "Floor alternate", "Structured floor pattern for neutral specimen testing.", True),
        ],
        "family-chunky-masonry-contact-sheet.jpg",
        2,
    )
    contact_sheet(
        "Painted metal and bronze boundary",
        "An honest gap is evidence: gray iron is not silently promoted to fantasy bronze",
        [
            card(DEADKIR / "metal_plates.png", "DeadKir riveted plates", "Primary dark-metal identity", "Hand-painted highlights, plate silhouettes, rivets, and light rust streaks."),
            card(None, "Warm stylized brass / bronze", "Metal008 hybrid focal accent", "No new stylized source; use realistic brass sparingly for warm contrast and material pop.", placeholder="REAL BRASS ACCENT"),
        ],
        "family-painted-metal-contact-sheet.jpg",
        2,
    )
    contact_sheet(
        "Illustrated parchment and surface helpers",
        "CC0 originals · no runtime approval",
        [
            card(PARCHMENT, "Luke.RUSTLTD parchment", "Primary parchment identity", "Weathered illustrated paper field with a naturally quiet center."),
            card(KENNEY / "floor_ground_dirt.png", "Kenney dirt", "Stylized wear helper", "Small repeatable dirt field for authored masks and edge placement.", True),
            card(DEADKIR / "ooz_slime.png", "DeadKir ooze", "Magical surface helper", "Hand-painted bubbles suitable for liquid, spill, or residue audition."),
        ],
        "family-parchment-wear-magic-contact-sheet.jpg",
        3,
    )

    real = H5100 / "ambientcg/extracted-color"
    contact_sheet(
        "Realistic vs stylized vs intended hybrid strategy",
        "H5.100 remains material truth support · H5.100C establishes fantasy identity · H5.101 must audition the combination",
        [
            card(real / "WoodSiding008/WoodSiding008_1K-JPG_Color.jpg", "Existing realistic wood", "H5.100 support", "Use only as restrained grain or wear; not the primary fantasy identity."),
            card(KENNEY / "floor_wood_planks.png", "New stylized wood", "H5.100C primary identity", "Readable shape and board rhythm define the authored look.", True),
            card(DEADKIR / "wooden.png", "Hand-painted alternate", "Hybrid planning input", "Test stylized structure first, then introduce restrained H5.100 material truth only if it helps."),
            card(real / "Bricks089/Bricks089_1K-JPG_Color.jpg", "Existing realistic masonry", "H5.100 support", "Potential low-opacity grain and wear partner."),
            card(KENNEY / "wall_brick_stone_center.png", "New stylized masonry", "H5.100C primary identity", "Chunky blocks and value rhythm carry the fantasy read.", True),
            card(real / "Metal008/Metal008_1K-JPG_Color.jpg", "Real brass focal accent", "Intentional hybrid contrast", "Use sparingly on gears, rims, valves, and fasteners for material pop."),
        ],
        "realistic-vs-stylized-vs-hybrid-comparison.jpg",
        3,
    )

    table(
        "Accepted source inventory",
        ["Source", "Files preserved", "License", "Primary roles"],
        [
            ["Kenney Retro Textures Fantasy 1.0", "Original ZIP + 12 selected PNGs", "CC0 1.0", "Timber, masonry, stylized wear"],
            ["DeadKir handpainted tileables", "3 original 512x512 PNGs", "CC0 1.0", "Dark metal, wood alternate, magical ooze"],
            ["Luke.RUSTLTD large parchment", "1 original 1920x1080 PNG", "CC0 1.0", "Illustrated parchment"],
        ],
        [380, 310, 180, 420],
        "source-inventory-overview.jpg",
    )
    table(
        "Candidate accept / defer / reject record",
        ["Candidate", "Disposition", "Reason"],
        [
            ["Kenney Retro Textures Fantasy", "ACCEPT", "Actual reusable texture tiles; strongest bounded fantasy construction vocabulary."],
            ["DeadKir handpainted tileables", "ACCEPT", "Actual CC0 tileables fill painted iron, wood alternate, and magical surface roles."],
            ["Luke.RUSTLTD parchment", "ACCEPT", "Actual CC0 image fills illustrated parchment gap."],
            ["Kenney Modular Dungeon", "REJECT", "Model palette atlases are not reusable stone/metal surface textures."],
            ["Quaternius Ultimate Stylized Nature", "DEFER", "Nature texture folder is useful later but does not cover the alchemy-room core."],
            ["Quaternius Medieval Village MegaKit", "DEFER", "Large model-first package; no bounded standalone material intake justified."],
            ["rubberduck handpainted pack", "DEFER", "Valid CC0 but overlapping; exceeds bounded exceptional-source count."],
            ["Warm stylized brass/bronze", "HYBRID ACCENT", "No stylized source accepted; H5.100 Metal008 intentionally supplies restrained focal contrast."],
        ],
        [360, 160, 760],
        "candidate-defer-reject-table.jpg",
    )


def write_audits():
    source_files = sorted(path for path in SOURCE.rglob("*") if path.is_file())
    image_rows = []
    for path in source_files:
        if path.suffix.lower() in {".png", ".jpg", ".jpeg"}:
            with Image.open(path) as image:
                image_rows.append({
                    "path": rel(path),
                    "width": image.width,
                    "height": image.height,
                    "format": image.format,
                    "mode": image.mode,
                    "sha256": sha256(path),
                })
    records = [{"path": rel(path), "bytes": path.stat().st_size, "sha256": sha256(path)} for path in source_files]
    aggregate = hashlib.sha256("".join(f"{row['path']}:{row['sha256']}" for row in records).encode("utf-8")).hexdigest()
    (EVIDENCE / "source-image-and-hash-audit.json").write_text(json.dumps({
        "schemaVersion": "0.1",
        "laneId": "H5.100C",
        "aggregateSha256": aggregate,
        "sourceFiles": records,
        "images": image_rows,
    }, indent=2) + "\n", encoding="utf-8")
    generated = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    evidence_files = sorted(rel(path) for path in EVIDENCE.iterdir() if path.is_file() and path.name != "pipeline-run-log.json")
    output_paths = [
        ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.stylized-fantasy-texture-source-intake-h5-100c.json",
        ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.stylized-fantasy-material-classification-h5-100c.json",
        ROOT / "docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_100C_STYLIZED_FANTASY_TEXTURE_PANTRY_ADDENDUM.md",
        EVIDENCE / "README.md",
        EVIDENCE / "generate_h5_100c_evidence.py",
        EVIDENCE / "validate_h5_100c_intake.py",
        EVIDENCE / "source-image-and-hash-audit.json",
    ]
    output_files = [{"path": rel(path), "sha256": sha256(path)} for path in output_paths]
    (EVIDENCE / "pipeline-run-log.json").write_text(json.dumps({
        "schemaVersion": "0.1",
        "contractVersion": "0.1",
        "tool": "Python 3 + Pillow",
        "command": "make-evidence",
        "method": "h5-100c-accepted-source-truth-contact-sheets-and-hybrid-comparison",
        "methodStatus": "pilot-only",
        "laneId": "H5.100C",
        "agent": "Codex",
        "gitBaseline": BASELINE,
        "startedAt": generated,
        "completedAt": generated,
        "sourcePath": "assets/academy/materials/source/h5-100c",
        "sourceSha256": aggregate,
        "inputManifests": [
            "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.texture-material-source-intake-h5-100.json",
            "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.material-classification-h5-100.json",
            "manifests/academy/tooling/organization/academy.manifest-maturity-index.json"
        ],
        "outputFiles": output_files,
        "evidenceFiles": evidence_files,
        "validationCommands": [
            "python assets/academy/evidence/h5-100c-stylized-fantasy-texture-pantry-addendum/generate_h5_100c_evidence.py",
            "python assets/academy/evidence/h5-100c-stylized-fantasy-texture-pantry-addendum/validate_h5_100c_intake.py",
            "node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok",
            "node scripts/validate-academy-asset-manifests.mjs",
            "node scripts/validate-academy-manifest.mjs",
            "node scripts/asset-pipeline/smoke-check.mjs",
            "git diff --check"
        ],
        "warnings": [
            "Evidence shows source specimens and planning comparisons only; no room composition is approved.",
            "Metal008 is a restrained hybrid focal accent, not permission for broad photographic brass coverage.",
            "The warm stylized brass source gap remains explicit pending future authored treatment."
        ],
        "sourcePngModified": False,
        "runtimeFilesModified": False,
        "status": "completed"
    }, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    build_images()
    write_audits()
    print(f"Generated H5.100C evidence in {EVIDENCE}")
