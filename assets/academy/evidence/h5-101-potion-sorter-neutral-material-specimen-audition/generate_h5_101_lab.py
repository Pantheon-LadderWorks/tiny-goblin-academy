from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
EVIDENCE = ROOT / "assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition"
PLANNING = ROOT / "manifests/academy/games/potion-sorter/planning"
H100_CLASSIFICATION = PLANNING / "academy.potion-sorter.material-classification-h5-100.json"
H100_PROVENANCE = PLANNING / "academy.potion-sorter.texture-material-provenance-h5-100.json"
H100C_INTAKE = PLANNING / "academy.potion-sorter.stylized-fantasy-texture-source-intake-h5-100c.json"
H100C_CLASSIFICATION = PLANNING / "academy.potion-sorter.stylized-fantasy-material-classification-h5-100c.json"
RECIPE_PATH = PLANNING / "academy.potion-sorter.material-recipes-h5-101.json"
INVENTORY_PATH = PLANNING / "academy.potion-sorter.material-specimen-inventory-h5-101.json"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def sha256(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


h100 = load(H100_CLASSIFICATION)
h100_provenance = load(H100_PROVENANCE)
h100c_intake = load(H100C_INTAKE)
h100c_classification = load(H100C_CLASSIFICATION)
h100_by_id = {entry["id"]: entry for entry in h100["assets"]}
h100c_root = ROOT / h100c_intake["sourceRoot"]

ambient_license = next(item["licenseFiles"] for item in h100_provenance["licenseRecords"] if item["sourceFamily"] == "ambientCG")
particle_license = next(item["licenseFiles"] for item in h100_provenance["licenseRecords"] if item["sourceFamily"].startswith("Kenney"))
h100c_kenney_license = [
    "assets/academy/materials/source/h5-100c/kenney/license/License.txt",
    "assets/academy/materials/source/h5-100c/kenney/license/CC0-1.0-legalcode.txt",
]
h100c_oga_license = ["assets/academy/materials/source/h5-100c/opengameart/license/CC0-1.0-legalcode.txt"]


def find_selected(filename: str) -> str:
    matches = [path for path in h100c_root.rglob(filename) if path.is_file() and "archives" not in path.parts]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one manifest-root match for {filename}, found {len(matches)}")
    return matches[0].relative_to(ROOT).as_posix()


def source(key: str, path: str, family: str, license_files: list[str], authority: str) -> dict:
    absolute = ROOT / path
    return {
        "key": key,
        "path": path,
        "url": f"/{path}",
        "family": family,
        "license": "CC0 1.0",
        "licenseFiles": license_files,
        "authorityManifest": authority,
        "sha256": sha256(absolute),
        "bytes": absolute.stat().st_size,
    }


resolved_sources: list[dict] = []
for asset_id in [
    "WoodSiding008", "WoodFloor065B", "Bricks089", "Bricks100", "Metal046B", "Metal053C",
    "Metal008", "Paper006", "SurfaceImperfections015", "kenney-particle-smoke_06",
    "kenney-particle-dirt_02", "kenney-particle-spark_01", "kenney-particle-light_01",
]:
    entry = h100_by_id[asset_id]
    resolved_sources.append(
        source(
            asset_id,
            entry["sourceFile"],
            entry["materialFamily"],
            particle_license if asset_id.startswith("kenney-particle-") else ambient_license,
            H100_CLASSIFICATION.relative_to(ROOT).as_posix(),
        )
    )

for key, filename, family, license_files in [
    ("kenney-wall-timber", "wall_timber.png", "fantasy-timber", h100c_kenney_license),
    ("kenney-wall-timber-structure", "wall_timber_structure.png", "fantasy-timber", h100c_kenney_license),
    ("kenney-wood-planks", "floor_wood_planks.png", "fantasy-timber", h100c_kenney_license),
    ("kenney-damaged-planks", "floor_wood_planks_damaged.png", "painted-wear", h100c_kenney_license),
    ("deadkir-wood", "wooden.png", "fantasy-timber", h100c_oga_license),
    ("kenney-brick-stone", "wall_brick_stone_center.png", "chunky-masonry", h100c_kenney_license),
    ("kenney-wall-stone", "wall_stone.png", "chunky-masonry", h100c_kenney_license),
    ("kenney-wall-rock", "wall_rock.png", "chunky-masonry", h100c_kenney_license),
    ("deadkir-metal", "metal_plates.png", "painted-dark-metal", h100c_oga_license),
    ("luke-parchment", "parchment.png", "illustrated-parchment", h100c_oga_license),
    ("kenney-ground-dirt", "floor_ground_dirt.png", "hand-painted-grime-wear", h100c_kenney_license),
    ("deadkir-ooze", "ooz_slime.png", "magical-surface-helper", h100c_oga_license),
]:
    resolved_sources.append(
        source(
            key,
            find_selected(filename),
            family,
            license_files,
            H100C_CLASSIFICATION.relative_to(ROOT).as_posix(),
        )
    )


def recipe(
    recipe_id: str,
    role: str,
    target: str,
    primary: str | None,
    support: str | None,
    status: str,
    *,
    scale: float = 1.0,
    opacity: float = 1.0,
    blend: str = "source-over",
    wear: str | None = None,
    wear_strength: float = 0.0,
    prohibited: list[str] | None = None,
    neutral: str,
    warm: str,
    permitted: list[str],
    edge: str = "code-authored bevel, outline, and shadow planes",
    repetition: str = "offset repetition and geometry-led edge breaks",
) -> dict:
    return {
        "recipeId": recipe_id,
        "semanticMaterialRole": role,
        "specimenTarget": target,
        "primarySource": primary,
        "supportSource": support,
        "textureScale": scale,
        "orientation": "geometry-aligned",
        "wrapMode": "repeat" if primary else "not-applicable",
        "tint": "identity-preserving warm-neutral",
        "opacity": opacity,
        "blendMode": blend,
        "contrastTreatment": "quiet midtones with authored edge contrast",
        "authoredEdgeTreatment": edge,
        "wearMaskSource": wear,
        "wearStrength": wear_strength,
        "lightingAssumptions": ["neutral inspection light", "warm amber alchemy-room light"],
        "repetitionMitigation": repetition,
        "performanceNotes": "one primary pattern plus at most one restrained support layer",
        "permittedSceneRigTargets": permitted,
        "prohibitedBroadUses": prohibited or [],
        "neutralLightVerdict": neutral,
        "warmLightVerdict": warm,
        "provisionalStatus": status,
        "runtimeApproved": False,
    }


recipes = [
    recipe("timber.kenney-hybrid-default", "primary-structural-timber", "beam and conveyor slat", "kenney-wall-timber", "WoodSiding008", "recommended-default", scale=2.6, opacity=1.0, wear="kenney-ground-dirt", wear_strength=0.14, neutral="Readable chunky timber with low repetition noise.", warm="Keeps silhouette and gains restrained grain depth.", permitted=["beams", "shelves", "conveyor slats", "counter faces"]),
    recipe("timber.deadkir-painted-alternate", "timber-alternate", "beam", "deadkir-wood", None, "registered-alternate", scale=1.35, neutral="Painterly and rich, but busier at small scale.", warm="Warm and characterful for hero furniture.", permitted=["hero beam", "counter face", "cabinet panel"]),
    recipe("timber.realistic-control", "timber-control", "beam", "WoodSiding008", None, "deferred", scale=0.72, neutral="Material truth is clear but identity is too photographic alone.", warm="Useful only as restrained support.", permitted=["detail overlay"], prohibited=["broad structural identity"]),
    recipe("masonry.kenney-stone-hybrid-default", "primary-masonry", "masonry arch", "kenney-wall-stone", "Bricks089", "recommended-default", scale=2.25, wear="SurfaceImperfections015", wear_strength=0.1, neutral="Chunky blocks remain geometry-led.", warm="Amber light preserves block rhythm and adds quiet depth.", permitted=["arches", "wall fields", "machine foundations"]),
    recipe("masonry.rock-alternate", "masonry-alternate", "masonry arch", "kenney-wall-rock", "Bricks100", "registered-alternate", scale=2.0, neutral="Irregular and cave-like without losing the arch.", warm="Warmer, rougher option for frontier walls.", permitted=["cave wall", "rough foundation"]),
    recipe("masonry.realistic-control", "masonry-control", "masonry arch", "Bricks089", None, "deferred", scale=0.75, neutral="Readable but too photographic as the main identity.", warm="Grain competes with authored voussoirs.", permitted=["subtle grain overlay"], prohibited=["full arch identity"]),
    recipe("iron.deadkir-hybrid-default", "primary-dark-iron", "rail and bracket", "deadkir-metal", "Metal046B", "recommended-default", scale=1.55, wear="SurfaceImperfections015", wear_strength=0.12, neutral="Painted plate language reads immediately.", warm="Edges remain legible beside brass accents.", permitted=["rails", "brackets", "mechanism plates", "chain housings"]),
    recipe("iron.realistic-alternate", "constrained-realistic-iron-alternate", "small bracket", "Metal046B", None, "registered-alternate", scale=0.82, neutral="Convincing dirty iron on small hardware.", warm="Strong contrast but too real for broad plates.", permitted=["small bracket", "fastener", "rail wear"], prohibited=["broad mechanism housing"]),
    recipe("iron.rust-heavy-alternate", "rust-heavy-iron-alternate", "small bracket", "Metal053C", None, "deferred", scale=0.82, neutral="Rust dominates the form.", warm="Useful only for neglected machinery storytelling.", permitted=["damaged alternate"], prohibited=["default machinery"]),
    recipe("brass.metal008-focal", "realistic-brass-focal-accent", "gear rim, valve ring, and fasteners", "Metal008", None, "constrained-accent", scale=0.68, neutral="High material response makes focal hardware pop.", warm="Excellent amber highlight when coverage stays small.", permitted=["gear rim", "valve ring", "hub", "fasteners", "trim"], prohibited=["broad structural coverage", "full wall", "full machine housing"]),
    recipe("parchment.luke-default", "primary-parchment", "label and recipe card", "luke-parchment", "Paper006", "recommended-default", scale=0.85, wear="kenney-ground-dirt", wear_strength=0.08, neutral="Illustrated field supports live text without looking sterile.", warm="Warmth remains readable with restrained edge dirt.", permitted=["bin labels", "recipe cards", "sorting notices"]),
    recipe("parchment.paper006-alternate", "parchment-alternate", "small label", "Paper006", None, "registered-alternate", scale=0.7, neutral="Clean fiber truth but less authored.", warm="Useful for tiny labels where the illustration is too busy.", permitted=["small label", "utility note"]),
    recipe("wear.kenney-mask-default", "grime-wear-helper", "edge and contact masks", "kenney-ground-dirt", "SurfaceImperfections015", "recommended-default", scale=2.0, opacity=0.26, blend="multiply", neutral="Readable authored dirt placement.", warm="Adds age without graying the entire object.", permitted=["edge wear", "floor dirt", "soot boundary", "contact mask"], prohibited=["full-opacity broad fill"]),
    recipe("glass.code-authored-default", "code-authored-glass", "potion bottle", None, None, "recommended-default", opacity=0.34, neutral="Transparent fill, rim, highlight, and shadow communicate glass without a texture.", warm="Preserves potion color and catches amber edge light.", permitted=["bottles", "vials", "small windows"], edge="code-authored rim, inner highlight, refraction stripe, and grounded shadow"),
    recipe("liquid.ooze-glow-default", "potion-liquid-glow", "masked potion liquid", "deadkir-ooze", "kenney-particle-light_01", "recommended-default", scale=1.8, opacity=0.62, blend="soft-light", neutral="Ooze texture remains subordinate to classification color.", warm="Glow lifts the liquid without washing out red, blue, or green.", permitted=["bottle liquid mask", "spill mask", "alchemical residue"], prohibited=["unmasked broad fill"]),
    recipe("fx.smoke06-default", "steam-smoke-helper", "FX helper board", "kenney-particle-smoke_06", None, "recommended-default", scale=1.0, opacity=0.72, neutral="Soft alpha reads as steam rather than a sticker.", warm="Accepts warm tint and stays restrained.", permitted=["steam vent", "machine exhaust", "cauldron vapor"]),
    recipe("fx.spark01-default", "spark-helper", "FX helper board", "kenney-particle-spark_01", None, "recommended-default", scale=1.0, opacity=0.9, blend="screen", neutral="Compact impact spark with clean alpha.", warm="Bright enough for mechanism feedback without dominating.", permitted=["machinery spark", "correct-sort accent", "metal impact"]),
    recipe("fx.dirt02-default", "dust-debris-helper", "FX helper board", "kenney-particle-dirt_02", None, "recommended-default", scale=1.0, opacity=0.64, neutral="Sparse debris reads at small scale.", warm="Works as dusty release under amber light.", permitted=["conveyor impact", "crate movement", "wrong-sort dust"]),
]

sheets = [
    {"id": "timber", "file": "01-timber-comparison.png", "size": [1600, 900]},
    {"id": "masonry", "file": "02-masonry-comparison.png", "size": [1600, 900]},
    {"id": "conveyor", "file": "03-conveyor-repetition.png", "size": [1600, 900]},
    {"id": "iron", "file": "04-iron-rail-bracket.png", "size": [1600, 900]},
    {"id": "gear", "file": "05-gear-brass-accent.png", "size": [1600, 900]},
    {"id": "parchment", "file": "06-parchment-labels.png", "size": [1600, 900]},
    {"id": "bottle", "file": "07-potion-bottles.png", "size": [1600, 900]},
    {"id": "fx", "file": "08-fx-helper-board.png", "size": [1600, 900]},
    {"id": "lighting", "file": "09-neutral-vs-warm-light.png", "size": [1600, 900]},
    {"id": "palette", "file": "10-provisional-palette.png", "size": [1600, 900]},
    {"id": "verdicts", "file": "11-material-recipe-verdicts.png", "size": [1600, 900]},
    {"id": "rejected", "file": "12-constrained-rejected.png", "size": [1600, 900]},
    {"id": "coherence", "file": "13-coherence-1920x1080.png", "size": [1920, 1080]},
    {"id": "coherence", "file": "14-coherence-1024x640.png", "size": [1024, 640]},
]

specimens = [
    {"id": "timber-beam", "geometry": ["beam silhouette", "bevel plane", "peg holes", "brace joint"]},
    {"id": "masonry-arch", "geometry": ["arch opening", "voussoir rhythm", "foundation mass", "edge depth"]},
    {"id": "conveyor-slat", "geometry": ["three repeated slats", "iron brackets", "rivets", "foreshortened moving sample"]},
    {"id": "iron-rail-bracket", "geometry": ["rail", "support bracket", "rivets", "edge highlight", "recess"]},
    {"id": "gear-valve", "geometry": ["teeth", "hub", "fasteners", "valve ring", "layered depth"]},
    {"id": "parchment-label", "geometry": ["label", "recipe card", "edge treatment", "live text", "pin"]},
    {"id": "potion-bottle", "geometry": ["bottle", "neck", "cork", "glass rim", "liquid mask", "label", "shadow"]},
    {"id": "fx-helper-board", "geometry": ["glow", "spark", "dust", "steam", "ooze/bubble"]},
]

inventory = {
    "schemaVersion": "0.1",
    "laneId": "H5.101",
    "status": "reviewed",
    "reviewStatus": "human-review-passed",
    "selectionUse": "approved-for-runtime-preparation-only",
    "h5_102Readiness": "ready",
    "runtimeEligibility": "not-runtime-approved",
    "runtimeApproved": False,
    "sourceManifests": [
        path.relative_to(ROOT).as_posix()
        for path in (H100_CLASSIFICATION, H100_PROVENANCE, H100C_INTAKE, H100C_CLASSIFICATION)
    ],
    "resolvedSources": resolved_sources,
    "specimens": specimens,
    "evidenceSheets": [
        {**sheet, "path": f"assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition/captures/{sheet['file']}"}
        for sheet in sheets
    ],
    "generator": EVIDENCE.relative_to(ROOT).as_posix() + "/generate_h5_101_lab.py",
}

recipe_manifest = {
    "schemaVersion": "0.1",
    "laneId": "H5.101",
    "status": "reviewed-provisional-selection",
    "reviewStatus": "human-review-passed",
    "selectionUse": "approved-for-runtime-preparation-only",
    "h5_102Readiness": "ready",
    "runtimeEligibility": "not-runtime-approved",
    "runtimeApproved": False,
    "strategy": h100c_classification["strategy"],
    "recipes": recipes,
}

verdict_table = {
    "schemaVersion": "0.1",
    "laneId": "H5.101",
    "status": "human-review-passed",
    "selectionUse": "approved-for-runtime-preparation-only",
    "runtimeApproved": False,
    "h5_102Readiness": "ready",
    "recommendations": [
        {"role": entry["semanticMaterialRole"], "recipeId": entry["recipeId"], "status": entry["provisionalStatus"], "neutral": entry["neutralLightVerdict"], "warm": entry["warmLightVerdict"]}
        for entry in recipes
    ],
}

lab_payload = {
    "sources": {entry["key"]: entry for entry in resolved_sources},
    "recipes": recipes,
    "sheets": sheets,
    "palette": {
        "sootPlum": "#171221",
        "kilnBrown": "#4b2f28",
        "parchmentCream": "#f0d9a7",
        "oxideTeal": "#3f7d78",
        "brassAmber": "#d89a42",
        "potionCyan": "#67d8d0",
    },
}

outputs = {
    EVIDENCE / "specimen-inventory.json": json.dumps(inventory, indent=2) + "\n",
    EVIDENCE / "material-verdict-table.json": json.dumps(verdict_table, indent=2) + "\n",
    EVIDENCE / "materials.generated.js": "window.H5101_MATERIALS = " + json.dumps(lab_payload, indent=2) + ";\n",
    INVENTORY_PATH: json.dumps(inventory, indent=2) + "\n",
    RECIPE_PATH: json.dumps(recipe_manifest, indent=2) + "\n",
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    mismatches = []
    for path, content in outputs.items():
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != content:
                mismatches.append(path.relative_to(ROOT).as_posix())
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
    if mismatches:
        print(json.dumps({"reproducible": False, "mismatches": mismatches}, indent=2))
        return 1
    print(json.dumps({"reproducible": True, "outputCount": len(outputs), "sourceCount": len(resolved_sources), "recipeCount": len(recipes)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
