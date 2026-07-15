from __future__ import annotations

import hashlib
import json
import zipfile
from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
EVIDENCE = ROOT / "assets/academy/evidence/h5-100c-stylized-fantasy-texture-pantry-addendum"
SOURCE = ROOT / "assets/academy/materials/source/h5-100c"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


checks = []


def check(name: str, passed: bool, detail: str):
    checks.append({"name": name, "passed": bool(passed), "detail": detail})


archive = SOURCE / "kenney/archives/kenney_retro-textures-fantasy.zip"
check("kenney archive hash", sha256(archive) == "46f30f2411dafa011f8e52e32d80be197f8ccfe1164818e664358ae6c78a38b9", sha256(archive))
with zipfile.ZipFile(archive) as handle:
    names = set(handle.namelist())
check("kenney archive contains actual textures", "PNG/floor_wood_planks.png" in names and "PNG/wall_brick_stone_center.png" in names, f"{len(names)} archive entries")
check("render previews not registered as selected textures", not any(path.name.lower().startswith(("preview", "sample")) for path in (SOURCE / "kenney/extracted-selected").iterdir()), "selected shelf excludes Preview.png and Sample.png")

expected = {
    "opengameart/deadkir-handpainted-tileables/originals/metal_plates.png": (512, 512, "2f19bc3b8868c8739149d2eecc9c1341ed6e18cdb5032f7fd32f8c4dfaae0420"),
    "opengameart/deadkir-handpainted-tileables/originals/wooden.png": (512, 512, "385650a45f36b97bef73afff6454310d4d34cfb4ac81046ecae6a4ef3d062d5f"),
    "opengameart/deadkir-handpainted-tileables/originals/ooz_slime.png": (512, 512, "f4d5567d543522726b9d6e6acc3ce83073e9a442ae6e4f8970ad2eeaf55f415d"),
    "opengameart/luke-rustltd-parchment/originals/parchment.png": (1920, 1080, "1a5864e3549355d83607b0dfd6a2093106b13df0a42227f17cb28bf488ab9207"),
}
for relative, (width, height, digest) in expected.items():
    path = SOURCE / relative
    with Image.open(path) as image:
        dimensions = image.size
    check(f"source image {relative}", dimensions == (width, height) and sha256(path) == digest, f"{dimensions[0]}x{dimensions[1]} {sha256(path)}")

json_paths = [
    ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.stylized-fantasy-texture-source-intake-h5-100c.json",
    ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.stylized-fantasy-material-classification-h5-100c.json",
    SOURCE / "opengameart/metadata/deadkir-handpainted-tileables.json",
    SOURCE / "opengameart/metadata/luke-rustltd-large-parchment.json",
    EVIDENCE / "source-image-and-hash-audit.json",
    EVIDENCE / "pipeline-run-log.json",
]
for path in json_paths:
    try:
        json.loads(path.read_text(encoding="utf-8"))
        check(f"JSON parses: {path.name}", True, str(path.relative_to(ROOT)))
    except Exception as error:
        check(f"JSON parses: {path.name}", False, str(error))

required_evidence = [
    "family-fantasy-timber-contact-sheet.jpg",
    "family-chunky-masonry-contact-sheet.jpg",
    "family-painted-metal-contact-sheet.jpg",
    "family-parchment-wear-magic-contact-sheet.jpg",
    "realistic-vs-stylized-vs-hybrid-comparison.jpg",
    "source-inventory-overview.jpg",
    "candidate-defer-reject-table.jpg",
]
for name in required_evidence:
    path = EVIDENCE / name
    check(f"evidence exists: {name}", path.exists() and path.stat().st_size > 0, str(path))

manifest = json.loads(json_paths[0].read_text(encoding="utf-8"))
check("no runtime approval", manifest["runtimeApproved"] is False and manifest["runtimeEligibility"] == "not-runtime-approved", "H5.100C remains planning/source pantry only")
check("stylized bronze gap retained", manifest["familyCandidateCounts"]["warm-stylized-brass-bronze"] == 0, "no false bronze classification")
check("candidate bound", all(value <= 2 for value in manifest["familyCandidateCounts"].values()), str(manifest["familyCandidateCounts"]))

passed = all(item["passed"] for item in checks)
report = {"schemaVersion": "0.1", "laneId": "H5.100C", "passed": passed, "checks": checks}
(EVIDENCE / "validation-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"passed": passed, "checkCount": len(checks), "failed": [item["name"] for item in checks if not item["passed"]]}, indent=2))
raise SystemExit(0 if passed else 1)
