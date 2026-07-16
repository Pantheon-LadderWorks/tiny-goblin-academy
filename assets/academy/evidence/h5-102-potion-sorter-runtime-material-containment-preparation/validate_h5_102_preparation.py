from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
EVIDENCE = ROOT / "assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation"
PLANNING = ROOT / "manifests/academy/games/potion-sorter/planning"
MATERIALS = PLANNING / "academy.potion-sorter.runtime-material-preparation-h5-102.json"
SKINS = PLANNING / "academy.potion-sorter.skin-registry-h5-102.json"
CONTAINMENT = PLANNING / "academy.potion-sorter.containment-contract-h5-102.json"
HARNESS = PLANNING / "academy.potion-sorter.proof-harness-h5-102.json"
REPORT = EVIDENCE / "validation-report.json"
BASELINE = "22cf2cd124f50ff1a9278f26ed9db8212d07a6d1"

REQUIRED_FILES = [
    EVIDENCE / "README.md",
    EVIDENCE / "index.html",
    EVIDENCE / "styles.css",
    EVIDENCE / "app.js",
    EVIDENCE / "prepared.generated.js",
    EVIDENCE / "generate_h5_102_preparation.py",
    EVIDENCE / "capture_h5_102_evidence.mjs",
    EVIDENCE / "runtime-prepared-material-inventory.json",
    EVIDENCE / "potion-prop-skin-inventory.json",
    EVIDENCE / "containment-contract.json",
    EVIDENCE / "runtime-preparation-verdict-table.json",
    EVIDENCE / "interaction-proof.json",
    EVIDENCE / "evidence-layout-proof.json",
    MATERIALS,
    SKINS,
    CONTAINMENT,
    HARNESS,
    ROOT / "docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_102_RUNTIME_MATERIAL_CONTAINMENT_PREPARATION.md",
]

REQUIRED_CAPTURES = {
    "01-runtime-prepared-material-inventory.png": (1600, 900),
    "01a-material-inventory-1024x640-plate-1.png": (1024, 640),
    "01b-material-inventory-1024x640-plate-2.png": (1024, 640),
    "02-potion-prop-skin-inventory.png": (1600, 900),
    "03-layering-first-containment-diagram.png": (1600, 900),
    "04-conveyor-cradle-proof.png": (1600, 900),
    "05-foreground-rail-proof.png": (1600, 900),
    "06-deep-containment-three-state-proof.png": (1600, 900),
    "07-machine-aperture-three-state-proof.png": (1600, 900),
    "08-interaction-bounds-proof.png": (1600, 900),
    "09-irregular-opening-mask-verdict.png": (1600, 900),
    "10-material-binding-proof.png": (1600, 900),
    "11-harness-1920x1080.png": (1920, 1080),
    "12-harness-1024x640.png": (1024, 640),
    "13-runtime-preparation-verdicts.png": (1600, 900),
    "14-rejected-deferred-containment.png": (1600, 900),
    "15-three-color-destination-containment-board.png": (1600, 900),
    "16-deep-containment-presentation-debug.png": (1600, 900),
    "17-machine-aperture-three-state-debug.png": (1600, 900),
}

REQUIRED_MATERIAL_ROLES = {
    "primary-structural-timber",
    "timber-alternate",
    "primary-masonry",
    "masonry-alternate",
    "primary-painted-iron",
    "constrained-realistic-iron",
    "constrained-realistic-brass-focal-accent",
    "primary-parchment",
    "parchment-alternate",
    "wear-mask-helper",
    "potion-glow-helper",
    "steam-smoke-source-helper",
    "spark-source-helper",
    "dust-debris-source-helper",
    "ooze-liquid-helper",
}

MATERIAL_FIELDS = {
    "semanticRole", "evidenceLabel", "sourceKey", "sourceFile", "sourceManifest", "sourceHash", "licenseRecords",
    "dimensions", "format", "alphaStatus", "wrapExpectation", "defaultTextureScale",
    "permittedBroadUses", "prohibitedBroadUses", "tintOpacityBlend", "runtimePreparationStatus",
    "runtimeApproved",
}

SKIN_FIELDS = {
    "sourceRegionId", "cleanedAssetPath", "sourceSheet", "sourceHash", "cleanupHash",
    "dimensions", "alphaStatus", "visualPivot", "defaultAnchor", "interactionRecommendation",
    "likelyDepthLayer", "containmentCompatibility", "glowHaloRisk", "edgeRiskNotes",
    "initialSceneRigRole", "runtimePreparationStatus", "runtimeApproved",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


checks: list[dict[str, object]] = []


def check(name: str, passed: bool, detail: str) -> None:
    checks.append({"name": name, "passed": bool(passed), "detail": detail})


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        check(f"JSON parses: {path.name}", True, str(path.relative_to(ROOT)))
        return value
    except Exception as error:
        check(f"JSON parses: {path.name}", False, str(error))
        return {}


for path in REQUIRED_FILES:
    check(f"required file: {path.name}", path.exists() and path.stat().st_size > 0, str(path.relative_to(ROOT)))

materials = load_json(MATERIALS) if MATERIALS.exists() else {}
skins = load_json(SKINS) if SKINS.exists() else {}
containment = load_json(CONTAINMENT) if CONTAINMENT.exists() else {}
harness = load_json(HARNESS) if HARNESS.exists() else {}

material_entries = materials.get("materials", [])
check("material record completeness", bool(material_entries) and all(MATERIAL_FIELDS <= set(item) for item in material_entries), f"{len(material_entries)} records")
role_counts = {role: sum(item.get("semanticRole") == role for item in material_entries) for role in sorted(REQUIRED_MATERIAL_ROLES)}
check("exactly one prepared record per required material role", all(count == 1 for count in role_counts.values()), str(role_counts))
check("material runtime approvals remain false", bool(material_entries) and all(item.get("runtimeApproved") is False for item in material_entries), f"{len(material_entries)} records")
check("material evidence labels are concise and human readable", bool(material_entries) and all(4 <= len(item.get("evidenceLabel", "")) <= 32 for item in material_entries), str([item.get("evidenceLabel") for item in material_entries]))

material_paths_ok = material_hashes_ok = material_licenses_ok = material_dimensions_ok = True
for item in material_entries:
    source = ROOT / item.get("sourceFile", "")
    licenses = [ROOT / value for value in item.get("licenseRecords", [])]
    material_paths_ok &= source.exists()
    material_hashes_ok &= source.exists() and sha256(source) == item.get("sourceHash")
    material_licenses_ok &= bool(licenses) and all(value.exists() for value in licenses)
    if source.exists():
        with Image.open(source) as image:
            material_dimensions_ok &= item.get("dimensions") == {"w": image.width, "h": image.height}
check("prepared material source resolution", material_paths_ok and bool(material_entries), f"{len(material_entries)} sources")
check("prepared material hash resolution", material_hashes_ok and bool(material_entries), f"{len(material_entries)} sources")
check("prepared material license resolution", material_licenses_ok and bool(material_entries), f"{len(material_entries)} sources")
check("prepared material dimensions resolution", material_dimensions_ok and bool(material_entries), f"{len(material_entries)} sources")

skin_entries = skins.get("skins", [])
check("skin record completeness", len(skin_entries) == 32 and all(SKIN_FIELDS <= set(item) for item in skin_entries), f"{len(skin_entries)} records")
check("skin runtime approvals remain false", len(skin_entries) == 32 and all(item.get("runtimeApproved") is False for item in skin_entries), f"{len(skin_entries)} records")
denied = {item.get("sourceRegionId") for item in skin_entries if item.get("runtimePreparationStatus") == "denied-reference-only"}
check("H5.49 denials preserved exactly", denied == {"potion-sorter.glowing-green-potion", "potion-sorter.gold-sparkle-potion"}, str(sorted(denied)))
core = {item.get("sourceRegionId") for item in skin_entries if item.get("runtimePreparationStatus") == "initial-prepared-default"}
required_core = {"potion-sorter.red-round-potion-bottle", "potion-sorter.blue-tall-vial", "potion-sorter.green-round-potion-bottle"}
check("three classification bottles prepared", required_core <= core, str(sorted(core)))

cleanup_path = ROOT / skins.get("cleanedSheet", "")
source_path = ROOT / skins.get("sourceSheet", "")
check("cleaned sheet hash resolution", cleanup_path.is_file() and sha256(cleanup_path) == skins.get("cleanupHash"), str(cleanup_path.relative_to(ROOT)) if cleanup_path.is_file() else "missing")
check("source sheet hash resolution", source_path.is_file() and sha256(source_path) == skins.get("sourceHash"), str(source_path.relative_to(ROOT)) if source_path.is_file() else "missing")
if cleanup_path.is_file():
    with Image.open(cleanup_path) as image:
        check("cleaned sheet alpha truth", image.mode == "RGBA" and image.getextrema()[3][0] == 0 and image.getextrema()[3][1] == 255, f"{image.mode} {image.size}")

authority_path = ROOT / "manifests/academy/games/potion-sorter/academy.potion-sorter.cleanup-candidate.json"
authority = load_json(authority_path)
authority_by_id = {item["id"]: item for item in authority.get("regions", [])}
skin_authority_ok = all(item.get("sourceRegionId") in authority_by_id for item in skin_entries)
skin_rects_ok = all(item.get("dimensions") == {"w": authority_by_id[item["sourceRegionId"]]["derivedRect"]["w"], "h": authority_by_id[item["sourceRegionId"]]["derivedRect"]["h"]} for item in skin_entries if item.get("sourceRegionId") in authority_by_id)
check("skin IDs resolve through H5.48C authority", skin_authority_ok and len(skin_entries) == 32, f"{len(authority_by_id)} authority regions")
check("skin dimensions resolve through H5.48C authority", skin_rects_ok and len(skin_entries) == 32, f"{len(skin_entries)} records")

hierarchy = containment.get("methodHierarchy", [])
check("containment hierarchy is layering then geometry then alpha", hierarchy == ["depth-layering", "geometry-mask", "alpha-mask-only-if-required"], str(hierarchy))
actor = containment.get("PotionActorRig", {})
holder = containment.get("PotionHolderRig", {})
check("PotionActorRig excludes simulation truth", all(value in actor.get("doesNotOwn", []) for value in ["queue-truth", "potion-classification-truth", "scoring", "sorting-decisions", "simulation-state"]), str(actor.get("doesNotOwn", [])))
required_holder = {"back-plate", "potion-anchor", "optional-local-clip-geometry", "foreground-rim-lip-rail", "label-anchor", "feedback-fx-anchor", "visible-bounds", "mask-bounds", "interaction-bounds", "sorting-drop-bounds"}
check("PotionHolderRig contract completeness", required_holder <= set(holder.get("owns", [])), str(holder.get("owns", [])))
bounds = containment.get("boundsSeparation", {})
check("visible mask interaction and drop bounds remain separate", set(bounds) == {"visibleBounds", "maskBounds", "interactionBounds", "sortingDropBounds"} and len(set(bounds.values())) == 4, str(bounds))
check("alpha mask not fabricated", containment.get("irregularOpeningVerdict", {}).get("alphaMaskRequired") is False, str(containment.get("irregularOpeningVerdict", {})))

cases = {item.get("id"): item for item in harness.get("demonstrations", [])}
expected_methods = {"conveyor-cradle": "depth-layering", "foreground-rail": "depth-layering", "three-color-single-destination-receivers": "geometry-mask", "machine-aperture": "geometry-mask"}
check("proof cases use expected containment methods", all(cases.get(key, {}).get("method") == value for key, value in expected_methods.items()), str({key: cases.get(key, {}).get("method") for key in expected_methods}))
check("proof harness is explicitly non-runtime", harness.get("runtimeApproved") is False and harness.get("scope") == "evidence-harness-not-potion-sorter-runtime", str(harness.get("scope")))
deep = cases.get("three-color-single-destination-receivers", {})
required_slots = {"potion-sorter.red-sorter-slot", "potion-sorter.blue-sorter-slot", "potion-sorter.green-sorter-slot"}
check("primary deep proof excludes four-slot region 23", deep.get("forbiddenHolderSkin") == "potion-sorter.sorting-bin-labeled" and deep.get("forbiddenHolderSkin") not in deep.get("holderSkins", []), str(deep))
check("three destination faces represented", set(deep.get("holderSkins", [])) == required_slots, str(deep.get("holderSkins", [])))
check("deep containment has approach partial accepted states", deep.get("states") == ["approach", "partial", "accepted"], str(deep.get("states")))
check("presentation masks remain invisible", deep.get("presentationMaskVisible") is False and cases.get("machine-aperture", {}).get("presentationMaskVisible") is False, "deep and aperture presentation masks")
check("machine aperture proves approach partial exit", cases.get("machine-aperture", {}).get("states") == ["approach", "partial", "exit"], str(cases.get("machine-aperture", {}).get("states")))
check("machine aperture interaction remains independent", cases.get("machine-aperture", {}).get("interactionBoundsIndependent") is True, str(cases.get("machine-aperture", {})))

layout_path = EVIDENCE / "evidence-layout-proof.json"
layout = load_json(layout_path) if layout_path.exists() else {}
layout_proofs = layout.get("proofs", [])
check("inventory evidence layout audits pass", layout.get("passed") is True and len(layout_proofs) == 3 and all(item.get("passed") and not item.get("failures") for item in layout_proofs), str(layout_proofs))
check("inventory layout includes primary and two minimum plates", {item.get("sheet") for item in layout_proofs} == {"materials", "materials-min-1", "materials-min-2"}, str([item.get("sheet") for item in layout_proofs]))
check("inventory typography meets configured minimum", all(item.get("minimumFontSize", 0) >= 18 for item in layout_proofs), str([item.get("minimumFontSize") for item in layout_proofs]))

interaction_path = EVIDENCE / "interaction-proof.json"
interaction = load_json(interaction_path) if interaction_path.exists() else {}
check("partially occluded interaction probe passes", interaction.get("passed") is True and interaction.get("insideInteractionBounds") is True and interaction.get("insideVisibleBounds") is False, str(interaction))

for file, size in REQUIRED_CAPTURES.items():
    path = EVIDENCE / "captures" / file
    passed = False
    if path.exists():
        with Image.open(path) as image:
            passed = image.size == size
    check(f"capture dimensions: {file}", passed, f"expected {size[0]}x{size[1]}")

generator = EVIDENCE / "generate_h5_102_preparation.py"
if generator.exists():
    result = subprocess.run(["python", str(generator), "--check"], cwd=ROOT, text=True, encoding="utf-8", capture_output=True)
    check("generator reproduces exact outputs", result.returncode == 0, (result.stdout + result.stderr).strip())
else:
    check("generator reproduces exact outputs", False, "generator absent")

head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True, encoding="utf-8", capture_output=True, check=True).stdout.strip()
baseline_ancestry = subprocess.run(["git", "merge-base", "--is-ancestor", BASELINE, head], cwd=ROOT, text=True, encoding="utf-8", capture_output=True)
check("H5.101 committed baseline preserved", baseline_ancestry.returncode == 0, f"baseline={BASELINE}; ancestor-of-current-head={baseline_ancestry.returncode == 0}")
h5101_paths = [
    "assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition",
    "docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_101_NEUTRAL_MATERIAL_SPECIMEN_AUDITION.md",
    "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.material-recipes-h5-101.json",
    "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.material-specimen-inventory-h5-101.json",
]
h5101_committed_diff = subprocess.run(["git", "diff", "--name-only", f"{BASELINE}..{head}", "--", *h5101_paths], cwd=ROOT, text=True, encoding="utf-8", capture_output=True, check=True).stdout.splitlines()
check("H5.101 committed paths unchanged since baseline", not h5101_committed_diff, str(h5101_committed_diff))
h5101_diff = subprocess.run(["git", "diff", "--name-only", "--", *h5101_paths], cwd=ROOT, text=True, encoding="utf-8", capture_output=True, check=True).stdout.splitlines()
check("H5.101 committed paths remain unchanged", not h5101_diff, str(h5101_diff))
status = subprocess.run(["git", "status", "--porcelain=v1", "-uall"], cwd=ROOT, text=True, encoding="utf-8", capture_output=True, check=True).stdout.splitlines()
staged = [line for line in status if line and line[0] not in (" ", "?")]
check("no staged files", not staged, str(staged))
changed_paths = [line[3:].replace("\\", "/") for line in status if line]
forbidden = [path for path in changed_paths if path.startswith(("games/tier-1/02-potion-sorter/", "apps/academy-hub/")) or Path(path).name in {"package.json", "pnpm-lock.yaml", "package-lock.json", "yarn.lock"}]
check("runtime package and gameplay scope preserved", not forbidden, str(forbidden))

capture_names = {path.name for path in (EVIDENCE / "captures").glob("*.png")}
check("no superseded H5.102 captures remain", capture_names == set(REQUIRED_CAPTURES), str(sorted(capture_names - set(REQUIRED_CAPTURES))))

result = {
    "laneId": "H5.102",
    "passed": all(item["passed"] for item in checks),
    "checkCount": len(checks),
    "failed": [item for item in checks if not item["passed"]],
    "checks": checks,
}
REPORT.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"passed": result["passed"], "checkCount": len(checks), "failed": result["failed"]}, indent=2))
raise SystemExit(0 if result["passed"] else 1)
