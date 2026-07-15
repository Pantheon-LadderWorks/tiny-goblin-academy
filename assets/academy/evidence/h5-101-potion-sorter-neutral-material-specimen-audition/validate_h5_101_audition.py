from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
EVIDENCE = ROOT / "assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition"
RECIPES = ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.material-recipes-h5-101.json"
INVENTORY = ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.material-specimen-inventory-h5-101.json"
REPORT = EVIDENCE / "validation-report.json"

REQUIRED_FILES = [
    EVIDENCE / "README.md",
    EVIDENCE / "index.html",
    EVIDENCE / "styles.css",
    EVIDENCE / "app.js",
    EVIDENCE / "materials.generated.js",
    EVIDENCE / "generate_h5_101_lab.py",
    EVIDENCE / "capture_h5_101_evidence.mjs",
    EVIDENCE / "specimen-inventory.json",
    EVIDENCE / "material-verdict-table.json",
    RECIPES,
    INVENTORY,
    ROOT / "docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_101_NEUTRAL_MATERIAL_SPECIMEN_AUDITION.md",
]

REQUIRED_SHEETS = {
    "01-timber-comparison.png": (1600, 900),
    "02-masonry-comparison.png": (1600, 900),
    "03-conveyor-repetition.png": (1600, 900),
    "04-iron-rail-bracket.png": (1600, 900),
    "05-gear-brass-accent.png": (1600, 900),
    "06-parchment-labels.png": (1600, 900),
    "07-potion-bottles.png": (1600, 900),
    "08-fx-helper-board.png": (1600, 900),
    "09-neutral-vs-warm-light.png": (1600, 900),
    "10-provisional-palette.png": (1600, 900),
    "11-material-recipe-verdicts.png": (1600, 900),
    "12-constrained-rejected.png": (1600, 900),
    "13-coherence-1920x1080.png": (1920, 1080),
    "14-coherence-1024x640.png": (1024, 640),
}

REQUIRED_RECIPE_FIELDS = {
    "recipeId",
    "semanticMaterialRole",
    "specimenTarget",
    "primarySource",
    "supportSource",
    "textureScale",
    "orientation",
    "wrapMode",
    "tint",
    "opacity",
    "blendMode",
    "contrastTreatment",
    "authoredEdgeTreatment",
    "wearMaskSource",
    "wearStrength",
    "lightingAssumptions",
    "repetitionMitigation",
    "performanceNotes",
    "permittedSceneRigTargets",
    "prohibitedBroadUses",
    "neutralLightVerdict",
    "warmLightVerdict",
    "provisionalStatus",
    "runtimeApproved",
}

REQUIRED_DEFAULT_ROLES = {
    "primary-structural-timber",
    "primary-masonry",
    "primary-dark-iron",
    "primary-parchment",
    "grime-wear-helper",
    "code-authored-glass",
    "potion-liquid-glow",
    "steam-smoke-helper",
    "spark-helper",
    "dust-debris-helper",
}


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


checks: list[dict[str, object]] = []


def check(name: str, passed: bool, detail: str) -> None:
    checks.append({"name": name, "passed": bool(passed), "detail": detail})


for path in REQUIRED_FILES:
    check(f"required file: {path.name}", path.exists() and path.stat().st_size > 0, str(path.relative_to(ROOT)))

recipes = None
inventory = None
try:
    recipes = json.loads(RECIPES.read_text(encoding="utf-8"))
    check("recipe manifest parses", True, str(RECIPES.relative_to(ROOT)))
except Exception as error:
    check("recipe manifest parses", False, str(error))

try:
    inventory = json.loads(INVENTORY.read_text(encoding="utf-8"))
    check("specimen inventory manifest parses", True, str(INVENTORY.relative_to(ROOT)))
except Exception as error:
    check("specimen inventory manifest parses", False, str(error))

if recipes:
    entries = recipes.get("recipes", [])
    complete = all(REQUIRED_RECIPE_FIELDS <= set(entry) for entry in entries)
    check("material recipe completeness", complete, f"{len(entries)} recipes")
    defaults = {
        role: sum(
            entry.get("semanticMaterialRole") == role and entry.get("provisionalStatus") == "recommended-default"
            for entry in entries
        )
        for role in REQUIRED_DEFAULT_ROLES
    }
    check("one recommended default per required role", all(count == 1 for count in defaults.values()), str(defaults))
    brass = [entry for entry in entries if entry.get("semanticMaterialRole") == "realistic-brass-focal-accent"]
    brass_ok = (
        len(brass) == 1
        and brass[0].get("provisionalStatus") == "constrained-accent"
        and "broad" in " ".join(brass[0].get("prohibitedBroadUses", [])).lower()
    )
    check("constrained brass rule", brass_ok, f"{len(brass)} brass recipes")
    check("runtime approval remains false", bool(entries) and all(entry.get("runtimeApproved") is False for entry in entries), f"{len(entries)} recipes")

if inventory:
    sources = inventory.get("resolvedSources", [])
    source_paths_ok = True
    hashes_ok = True
    licenses_ok = True
    allowed_roots_ok = True
    for source in sources:
        path = ROOT / source.get("path", "")
        license_paths = [ROOT / item for item in source.get("licenseFiles", [])]
        source_paths_ok &= path.exists()
        hashes_ok &= path.exists() and digest(path) == source.get("sha256")
        licenses_ok &= bool(license_paths) and all(item.exists() for item in license_paths)
        allowed_roots_ok &= source.get("path", "").startswith(
            ("assets/academy/materials/source/h5-100/", "assets/academy/materials/source/h5-100c/")
        )
    check("source path resolution", source_paths_ok and bool(sources), f"{len(sources)} sources")
    check("source hash resolution", hashes_ok and bool(sources), f"{len(sources)} sources")
    check("source license resolution", licenses_ok and bool(sources), f"{len(sources)} sources")
    check("no new external source families", allowed_roots_ok and bool(sources), "H5.100/H5.100C only")
    check("specimen inventory runtime boundary", inventory.get("runtimeApproved") is False, str(inventory.get("runtimeApproved")))

capture_dir = EVIDENCE / "captures"
for name, expected_size in REQUIRED_SHEETS.items():
    path = capture_dir / name
    actual_size = None
    if path.exists():
        with Image.open(path) as image:
            actual_size = image.size
    check(f"capture dimensions: {name}", actual_size == expected_size, f"expected={expected_size} actual={actual_size}")

generator = EVIDENCE / "generate_h5_101_lab.py"
if generator.exists():
    result = subprocess.run(
        ["python", str(generator), "--check"],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
    )
    check("generator reproducibility", result.returncode == 0, (result.stdout + result.stderr).strip())

status = subprocess.run(
    ["git", "status", "--porcelain=v1", "-uall"], cwd=ROOT, text=True, encoding="utf-8", capture_output=True, check=True
).stdout.splitlines()
changed = [line[3:].replace("\\", "/") for line in status if line]
forbidden_prefixes = ("games/", "hub/", "assets/academy/materials/source/")
forbidden_names = {"package.json", "pnpm-lock.yaml", "package-lock.json"}
scope_ok = not any(path.startswith(forbidden_prefixes) or Path(path).name in forbidden_names for path in changed)
check("scope boundary", scope_ok, f"{len(changed)} changed paths")
staged = subprocess.run(
    ["git", "diff", "--cached", "--name-only"], cwd=ROOT, text=True, encoding="utf-8", capture_output=True, check=True
).stdout.strip()
check("no staged files", not staged, staged or "none")

passed = all(item["passed"] for item in checks)
payload = {
    "schemaVersion": "0.1",
    "laneId": "H5.101",
    "passed": passed,
    "checkCount": len(checks),
    "failed": [item["name"] for item in checks if not item["passed"]],
    "checks": checks,
}
REPORT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
print(json.dumps({key: payload[key] for key in ("passed", "checkCount", "failed")}, indent=2))
raise SystemExit(0 if passed else 1)
