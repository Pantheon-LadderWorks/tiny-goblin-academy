from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
EVIDENCE = ROOT / "assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation"
PLANNING = ROOT / "manifests/academy/games/potion-sorter/planning"
H5101_INVENTORY = PLANNING / "academy.potion-sorter.material-specimen-inventory-h5-101.json"
H5101_RECIPES = PLANNING / "academy.potion-sorter.material-recipes-h5-101.json"
H548C = ROOT / "manifests/academy/games/potion-sorter/academy.potion-sorter.cleanup-candidate.json"
MATERIAL_PATH = PLANNING / "academy.potion-sorter.runtime-material-preparation-h5-102.json"
SKIN_PATH = PLANNING / "academy.potion-sorter.skin-registry-h5-102.json"
CONTAINMENT_PATH = PLANNING / "academy.potion-sorter.containment-contract-h5-102.json"
HARNESS_PATH = PLANNING / "academy.potion-sorter.proof-harness-h5-102.json"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def alpha_status(image: Image.Image) -> str:
    if "A" not in image.getbands():
        return "opaque-no-alpha-channel"
    minimum, maximum = image.getchannel("A").getextrema()
    if minimum == maximum == 255:
        return "alpha-channel-fully-opaque"
    if minimum == 0 and maximum == 255:
        return "true-alpha-transparent-to-opaque"
    return f"alpha-range-{minimum}-{maximum}"


h5101_inventory = read_json(H5101_INVENTORY)
h5101_recipes = read_json(H5101_RECIPES)
h548c = read_json(H548C)
source_by_key = {item["key"]: item for item in h5101_inventory["resolvedSources"]}
recipe_by_role = {item["semanticMaterialRole"]: item for item in h5101_recipes["recipes"]}

material_plan = [
    ("primary-structural-timber", "kenney-wall-timber", "initial-prepared-default", "repeat", 2.6, ["beams", "shelves", "conveyor slats"], ["photographic broad-room identity"]),
    ("timber-grain-support", "WoodSiding008", "prepared-support", "repeat", 0.32, ["restrained timber grain overlay"], ["primary timber identity", "full-opacity broad coverage"]),
    ("timber-alternate", "deadkir-wood", "prepared-alternate", "repeat", 1.7, ["hero furniture", "accent slats"], ["every repeated conveyor slat"]),
    ("primary-masonry", "kenney-wall-stone", "initial-prepared-default", "repeat", 2.2, ["arches", "foundations", "wall blocks"], ["flattened room background"]),
    ("masonry-grain-support", "Bricks089", "prepared-support", "repeat", 0.28, ["quiet stone variation"], ["primary authored block identity"]),
    ("masonry-alternate", "kenney-wall-rock", "prepared-alternate", "repeat", 1.8, ["cave foundation", "rough apertures"], ["small text-bearing surfaces"]),
    ("primary-painted-iron", "deadkir-metal", "initial-prepared-default", "repeat", 1.9, ["rails", "brackets", "machine plates"], ["paper labels", "glass"]),
    ("constrained-realistic-iron", "Metal046B", "prepared-constrained", "repeat", 0.30, ["narrow rails", "bolts", "small brackets"], ["broad machine plates", "room walls"]),
    ("constrained-realistic-brass-focal-accent", "Metal008", "prepared-constrained", "repeat", 0.30, ["hubs", "rims", "valves", "fittings", "fasteners"], ["broad gear faces", "broad room coverage", "structural walls"]),
    ("primary-parchment", "luke-parchment", "initial-prepared-default", "clamp", 1.0, ["recipe cards", "station labels"], ["floors", "machine bodies"]),
    ("parchment-alternate", "Paper006", "prepared-alternate", "clamp", 0.48, ["small labels", "quiet paper support"], ["primary room identity"]),
    ("wear-mask-helper", "kenney-ground-dirt", "prepared-helper", "clamp", 1.0, ["placed wear masks", "authored dirt events"], ["repeating wallpaper", "full-surface replacement"]),
    ("realistic-wear-support", "SurfaceImperfections015", "prepared-support", "clamp", 0.25, ["restrained masked wear"], ["repeating fill", "unmasked broad coverage"]),
    ("potion-glow-helper", "kenney-particle-light_01", "prepared-helper", "clamp", 1.0, ["optional potion glow socket"], ["implemented emitter", "baked final lighting"]),
    ("steam-smoke-source-helper", "kenney-particle-smoke_06", "prepared-helper", "clamp", 1.0, ["future steam source sprite"], ["implemented emitter", "permanent room fog"]),
    ("spark-source-helper", "kenney-particle-spark_01", "prepared-helper", "clamp", 1.0, ["future mechanism feedback source"], ["implemented emitter"]),
    ("dust-debris-source-helper", "kenney-particle-dirt_02", "prepared-helper", "clamp", 1.0, ["future conveyor release source"], ["implemented emitter"]),
    ("ooze-liquid-helper", "deadkir-ooze", "prepared-helper", "repeat", 1.6, ["liquid support", "residue accents"], ["replace classification color", "entire floor"]),
]

evidence_labels = {
    "primary-structural-timber": "Fantasy timber",
    "timber-grain-support": "Timber grain support",
    "timber-alternate": "Painted wood alternate",
    "primary-masonry": "Chunky masonry",
    "masonry-grain-support": "Masonry grain support",
    "masonry-alternate": "Rough stone alternate",
    "primary-painted-iron": "Painted dark iron",
    "constrained-realistic-iron": "Realistic iron accent",
    "constrained-realistic-brass-focal-accent": "Focal brass accent",
    "primary-parchment": "Illustrated parchment",
    "parchment-alternate": "Quiet paper alternate",
    "wear-mask-helper": "Placed wear helper",
    "realistic-wear-support": "Realistic wear support",
    "potion-glow-helper": "Potion glow helper",
    "steam-smoke-source-helper": "Steam source helper",
    "spark-source-helper": "Spark source helper",
    "dust-debris-source-helper": "Dust source helper",
    "ooze-liquid-helper": "Ooze and liquid helper",
}

materials = []
for role, key, preparation_status, wrap, scale, permitted, prohibited in material_plan:
    source = source_by_key[key]
    path = ROOT / source["path"]
    with Image.open(path) as image:
        dimensions = {"w": image.width, "h": image.height}
        image_format = image.format or path.suffix.lstrip(".").upper()
        alpha = alpha_status(image)
    materials.append({
        "semanticRole": role,
        "evidenceLabel": evidence_labels[role],
        "sourceKey": key,
        "sourceFile": source["path"],
        "sourceUrl": "/" + source["path"],
        "sourceManifest": source["authorityManifest"],
        "sourceHash": source["sha256"],
        "license": source["license"],
        "licenseRecords": source["licenseFiles"],
        "dimensions": dimensions,
        "format": image_format,
        "alphaStatus": alpha,
        "wrapExpectation": wrap,
        "defaultTextureScale": scale,
        "permittedBroadUses": permitted,
        "prohibitedBroadUses": prohibited,
        "tintOpacityBlend": "identity-preserving tint; recipe-controlled opacity; source-over unless recorded as support",
        "runtimePreparationStatus": preparation_status,
        "runtimeApproved": False,
    })

source_sheet = ROOT / h548c["sourceSheet"]
cleaned_sheet = ROOT / h548c["derivedSheet"]
source_hash = sha256(source_sheet)
cleanup_hash = sha256(cleaned_sheet)
denied_ids = set(h548c["humanReviewExclusions"]["deniedRegionIds"])
core_ids = {
    "potion-sorter.red-round-potion-bottle",
    "potion-sorter.blue-tall-vial",
    "potion-sorter.green-round-potion-bottle",
}
initial_props = {
    "potion-sorter.hourglass-potion-timer",
    "potion-sorter.cork-stopper",
    "potion-sorter.red-sorter-slot",
    "potion-sorter.blue-sorter-slot",
    "potion-sorter.green-sorter-slot",
    "potion-sorter.wood-sorter-slot",
    "potion-sorter.potion-crate",
    "potion-sorter.alchemy-tray-labeled",
    "potion-sorter.sorting-bin-labeled",
    "potion-sorter.round-complete-chest-labeled",
    "potion-sorter.success-check-sparkle",
    "potion-sorter.failure-x-smoke",
}

role_by_id = {
    "potion-sorter.red-sorter-slot": "red-destination-station-skin",
    "potion-sorter.blue-sorter-slot": "blue-destination-station-skin",
    "potion-sorter.green-sorter-slot": "green-destination-station-skin",
    "potion-sorter.wood-sorter-slot": "neutral-holder-station-skin",
    "potion-sorter.potion-crate": "queue-source-prop-skin",
    "potion-sorter.alchemy-tray-labeled": "conveyor-cradle-prop-skin",
    "potion-sorter.sorting-bin-labeled": "deep-sorting-bin-prop-skin",
    "potion-sorter.round-complete-chest-labeled": "round-complete-prop-skin",
    "potion-sorter.cork-stopper": "potion-accessory-skin",
    "potion-sorter.hourglass-potion-timer": "round-timer-prop-skin",
    "potion-sorter.success-check-sparkle": "success-feedback-skin",
    "potion-sorter.failure-x-smoke": "failure-feedback-skin",
}

skins = []
with Image.open(cleaned_sheet) as cleaned:
    for index, region in enumerate(h548c["regions"], start=1):
        region_id = region["id"]
        rect = region["derivedRect"]
        crop = cleaned.crop((rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"]))
        if region_id in denied_ids:
            prep_status = "denied-reference-only"
        elif region_id in core_ids:
            prep_status = "initial-prepared-default"
        elif region_id in initial_props:
            prep_status = "initial-prepared-prop"
        elif region["category"] in {"potion-bottle", "vial", "flask", "potion-liquid"}:
            prep_status = "prepared-alternate"
        else:
            prep_status = "prepared-optional-prop"

        if region_id in core_ids:
            scene_role = "core-classification-potion-skin"
        elif region_id in denied_ids:
            scene_role = "denied-guardrail-only"
        else:
            scene_role = role_by_id.get(region_id, "alternate-potion-skin" if "potion" in region["category"] or region["category"] in {"vial", "flask"} else "optional-feedback-or-token-skin")

        is_actor = region["category"] in {"potion-bottle", "vial", "flask", "potion-liquid"}
        anchor = {"x": 0.5, "y": 0.92 if is_actor else 0.5}
        pivot = "bottom-center-liquid-vessel" if is_actor else "visual-center"
        interaction = "generous independent actor bounds" if is_actor else "independent station drop bounds" if region["category"] == "sorter-slot" else "presentation-only unless later contract promotes interaction"
        skins.append({
            "index": index,
            "sourceRegionId": region_id,
            "label": region["label"],
            "category": region["category"],
            "cleanedAssetPath": h548c["derivedSheet"],
            "frameRect": rect,
            "sourceSheet": h548c["sourceSheet"],
            "sourceHash": source_hash,
            "cleanupHash": cleanup_hash,
            "dimensions": {"w": rect["w"], "h": rect["h"]},
            "alphaStatus": alpha_status(crop),
            "visualPivot": pivot,
            "defaultAnchor": anchor,
            "interactionRecommendation": interaction,
            "likelyDepthLayer": "potion-actor" if is_actor else "station-surface" if region["category"] in {"sorter-slot", "background-prop"} else "feedback-overlay",
            "containmentCompatibility": "layering-and-local-geometry-mask" if is_actor else "candidate-holder-surface" if region["category"] == "sorter-slot" else "not-a-container",
            "glowHaloRisk": "hard-denied" if region_id in denied_ids else "high-review-risk" if region["riskLevel"] == "high" else "bounded-cleanup-risk",
            "edgeRiskNotes": f"H5.48C {region['riskLevel']} cleanup risk; H5.49 {'denied' if region_id in denied_ids else 'accepted for draft preparation'}. Preserve alpha and inspect at runtime scale.",
            "initialSceneRigRole": scene_role,
            "runtimePreparationStatus": prep_status,
            "runtimeApproved": False,
        })

human_review_verdict = {
    "status": "passed",
    "scope": "runtime-preparation-only",
    "runtimeAssetsApproved": False,
    "h6SceneRigPreviewReady": True,
}

material_manifest = {
    "schemaVersion": "0.1",
    "laneId": "H5.102",
    "reviewCycle": "H5.102A",
    "status": "reviewed-runtime-preparation-approved",
    "reviewStatus": "human-review-passed",
    "humanReviewVerdict": human_review_verdict,
    "runtimeEligibility": "not-runtime-approved",
    "runtimeApproved": False,
    "sourceAuthority": [H5101_INVENTORY.relative_to(ROOT).as_posix(), H5101_RECIPES.relative_to(ROOT).as_posix()],
    "selectionPolicy": "bounded first-use material set; direct approved source files; no derivatives created",
    "materials": materials,
}

skin_manifest = {
    "schemaVersion": "0.1",
    "laneId": "H5.102",
    "reviewCycle": "H5.102A",
    "status": "reviewed-runtime-preparation-approved",
    "reviewStatus": "human-review-passed",
    "humanReviewVerdict": human_review_verdict,
    "runtimeEligibility": "not-runtime-approved",
    "runtimeApproved": False,
    "authorityManifest": H548C.relative_to(ROOT).as_posix(),
    "humanReviewAuthority": "H5.49",
    "sourceSheet": h548c["sourceSheet"],
    "cleanedSheet": h548c["derivedSheet"],
    "sourceHash": source_hash,
    "cleanupHash": cleanup_hash,
    "acceptedPreparedCount": 30,
    "deniedReferenceCount": 2,
    "skins": skins,
}

containment_contract = {
    "schemaVersion": "0.1",
    "laneId": "H5.102",
    "reviewCycle": "H5.102A",
    "status": "reviewed-runtime-preparation-approved",
    "humanReviewVerdict": human_review_verdict,
    "runtimeEligibility": "not-runtime-approved",
    "runtimeApproved": False,
    "doctrine": "The rig defines movement and scene participation; the skin defines illustrated identity.",
    "methodHierarchy": ["depth-layering", "geometry-mask", "alpha-mask-only-if-required"],
    "PotionActorRig": {
        "owns": ["visual-skin", "anchor-state", "scale", "depth", "lighting-tint", "hover-active-sorted-error-presentation", "optional-glow-fx-sockets", "presentation-bounds", "interaction-bounds-reference"],
        "doesNotOwn": ["queue-truth", "potion-classification-truth", "scoring", "sorting-decisions", "simulation-state"],
    },
    "PotionHolderRig": {
        "owns": ["back-plate", "potion-anchor", "optional-local-clip-geometry", "foreground-rim-lip-rail", "label-anchor", "feedback-fx-anchor", "visible-bounds", "mask-bounds", "interaction-bounds", "sorting-drop-bounds"],
        "doesNotOwn": ["potion-classification-truth", "sorting-decision", "score-change", "simulation-state"],
    },
    "boundsSeparation": {
        "visibleBounds": "renderer-presentation-extent",
        "maskBounds": "holder-local-clip-extent",
        "interactionBounds": "generous-pointer-drag-extent",
        "sortingDropBounds": "controller-owned-resolution-extent",
    },
    "rules": [
        "Foreground occlusion is not automatically a mask.",
        "Potion source pixels remain unmodified.",
        "Masks belong to holder or station rigs and transform with them.",
        "Mask bounds never silently become interaction bounds.",
        "Partially hidden bottles retain generous interaction bounds.",
        "Sorting and drop regions remain simulation or controller owned.",
    ],
    "irregularOpeningVerdict": {
        "testedSkin": "potion-sorter.red-sorter-slot",
        "foregroundLayeringEnoughForShallowSeat": True,
        "geometryMaskEnoughForDeepEntry": True,
        "alphaMaskRequired": False,
        "reason": "The accepted painted opening is visually irregular, but its functional interior is adequately represented by holder-local rounded geometry plus the painted foreground frame.",
    },
    "primaryDeepContainmentProof": {
        "holderType": "bounded-single-color-destination-receiving-rig",
        "forbiddenPrimaryProp": "potion-sorter.sorting-bin-labeled",
        "destinationFaceplates": ["potion-sorter.red-sorter-slot", "potion-sorter.blue-sorter-slot", "potion-sorter.green-sorter-slot"],
        "states": ["approach", "partial", "accepted"],
        "presentationMaskVisible": False,
        "debugContourSeparate": True,
    },
}

sheets = [
    ("materials", "01-runtime-prepared-material-inventory.png", 1600, 900),
    ("materials-min-1", "01a-material-inventory-1024x640-plate-1.png", 1024, 640),
    ("materials-min-2", "01b-material-inventory-1024x640-plate-2.png", 1024, 640),
    ("skins", "02-potion-prop-skin-inventory.png", 1600, 900),
    ("diagram", "03-layering-first-containment-diagram.png", 1600, 900),
    ("cradle", "04-conveyor-cradle-proof.png", 1600, 900),
    ("rail", "05-foreground-rail-proof.png", 1600, 900),
    ("bin", "06-deep-containment-three-state-proof.png", 1600, 900),
    ("aperture", "07-machine-aperture-three-state-proof.png", 1600, 900),
    ("bounds", "08-interaction-bounds-proof.png", 1600, 900),
    ("irregular", "09-irregular-opening-mask-verdict.png", 1600, 900),
    ("binding", "10-material-binding-proof.png", 1600, 900),
    ("harness", "11-harness-1920x1080.png", 1920, 1080),
    ("harness", "12-harness-1024x640.png", 1024, 640),
    ("verdicts", "13-runtime-preparation-verdicts.png", 1600, 900),
    ("rejected", "14-rejected-deferred-containment.png", 1600, 900),
    ("destinations", "15-three-color-destination-containment-board.png", 1600, 900),
    ("deep-debug", "16-deep-containment-presentation-debug.png", 1600, 900),
    ("aperture-debug", "17-machine-aperture-three-state-debug.png", 1600, 900),
]

harness_manifest = {
    "schemaVersion": "0.1",
    "laneId": "H5.102",
    "reviewCycle": "H5.102A",
    "status": "reviewed-runtime-preparation-approved",
    "humanReviewVerdict": human_review_verdict,
    "scope": "evidence-harness-not-potion-sorter-runtime",
    "runtimeEligibility": "not-runtime-approved",
    "runtimeApproved": False,
    "phaserVersion": "4.2.0",
    "cleanedSpriteSheet": h548c["derivedSheet"],
    "inventoryLayoutPolicy": {
        "primaryColumns": 4,
        "minimumColumns": 2,
        "minimumRoleFontPx": 18,
        "minimumCapturedRoleFontPxAt1024": 11.52,
        "minimumPlates": 2,
        "requiredChecks": ["text-overflow", "card-content-collision", "title-image-overlap", "title-badge-overlap", "minimum-font-size"],
    },
    "demonstrations": [
        {"id": "conveyor-cradle", "method": "depth-layering", "maskUsed": False, "skin": "potion-sorter.red-round-potion-bottle"},
        {"id": "foreground-rail", "method": "depth-layering", "maskUsed": False, "skin": "potion-sorter.blue-tall-vial"},
        {"id": "three-color-single-destination-receivers", "method": "geometry-mask", "maskUsed": True, "presentationMaskVisible": False, "holderSkins": ["potion-sorter.red-sorter-slot", "potion-sorter.blue-sorter-slot", "potion-sorter.green-sorter-slot"], "states": ["approach", "partial", "accepted"], "forbiddenHolderSkin": "potion-sorter.sorting-bin-labeled"},
        {"id": "machine-aperture", "method": "geometry-mask", "maskUsed": True, "presentationMaskVisible": False, "skin": "potion-sorter.purple-square-potion", "states": ["approach", "partial", "exit"], "interactionBoundsIndependent": True},
        {"id": "irregular-opening-assessment", "method": "geometry-mask-with-painted-foreground", "maskUsed": True, "alphaMaskUsed": False, "holderSkin": "potion-sorter.red-sorter-slot"},
        {"id": "interaction-bounds", "method": "independent-bounds", "pointerProbeRequired": True, "skin": "potion-sorter.blue-tall-vial"},
    ],
    "evidenceSheets": [{"id": sheet, "file": file, "size": [w, h], "path": f"assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation/captures/{file}"} for sheet, file, w, h in sheets],
}

verdicts = {
    "schemaVersion": "0.1",
    "laneId": "H5.102",
    "reviewCycle": "H5.102A",
    "status": "reviewed-runtime-preparation-approved",
    "humanReviewVerdict": human_review_verdict,
    "runtimeApproved": False,
    "verdicts": [
        {"subject": "cleaned-sprite-source", "verdict": "prepare", "finding": "Use H5.48C regenerated cleanup sheet with H5.49 exclusions."},
        {"subject": "cradle-containment", "verdict": "layering-only", "finding": "Back plate, potion, and foreground lip are sufficient."},
        {"subject": "foreground-rail", "verdict": "layering-only", "finding": "Rail depth creates occlusion without clipping source pixels."},
        {"subject": "deep-containment", "verdict": "geometry-mask", "finding": "Single-color receiving rigs use invisible holder-local geometry and a lower foreground lip; region 23 is not the primary proof."},
        {"subject": "machine-aperture", "verdict": "geometry-mask", "finding": "Approach, partial, and exit states keep local clipping, position, scale, depth, and interaction contracts synchronized."},
        {"subject": "irregular-opening", "verdict": "no-alpha-mask", "finding": "Painted foreground plus simple geometry is sufficient."},
        {"subject": "interaction", "verdict": "separate-bounds", "finding": "Interaction remains generous beyond visible and mask bounds."},
        {"subject": "materials", "verdict": "prepared-not-approved", "finding": "Direct local sources load; brass remains focal; no runtime registry wiring."},
    ],
}

lab_payload = {
    "materials": materials,
    "skins": skins,
    "containment": containment_contract,
    "harness": harness_manifest,
    "verdicts": verdicts,
    "palette": {"soot": "#100b17", "plum": "#281c33", "cream": "#f1d8a2", "brass": "#d8a44e", "teal": "#63c8c1", "red": "#e15b5e", "blue": "#52aee0", "green": "#79ba65"},
}

outputs = {
    EVIDENCE / "runtime-prepared-material-inventory.json": json.dumps(material_manifest, indent=2) + "\n",
    EVIDENCE / "potion-prop-skin-inventory.json": json.dumps(skin_manifest, indent=2) + "\n",
    EVIDENCE / "containment-contract.json": json.dumps(containment_contract, indent=2) + "\n",
    EVIDENCE / "runtime-preparation-verdict-table.json": json.dumps(verdicts, indent=2) + "\n",
    EVIDENCE / "prepared.generated.js": "window.H5102_PREPARED = " + json.dumps(lab_payload, indent=2) + ";\n",
    MATERIAL_PATH: json.dumps(material_manifest, indent=2) + "\n",
    SKIN_PATH: json.dumps(skin_manifest, indent=2) + "\n",
    CONTAINMENT_PATH: json.dumps(containment_contract, indent=2) + "\n",
    HARNESS_PATH: json.dumps(harness_manifest, indent=2) + "\n",
}

if "--check" in sys.argv:
    mismatches = []
    for path, expected in outputs.items():
        if not path.exists() or path.read_text(encoding="utf-8") != expected:
            mismatches.append(path.relative_to(ROOT).as_posix())
    print(json.dumps({"reproducible": not mismatches, "mismatches": mismatches, "outputCount": len(outputs), "materialCount": len(materials), "skinCount": len(skins)}, indent=2))
    raise SystemExit(1 if mismatches else 0)

for path, value in outputs.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8")

print(json.dumps({"reproducible": True, "outputCount": len(outputs), "materialCount": len(materials), "skinCount": len(skins), "deniedCount": len(denied_ids)}, indent=2))
