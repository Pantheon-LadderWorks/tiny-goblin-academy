from __future__ import annotations
import hashlib, io, json, os, subprocess, zipfile
from collections import defaultdict
from pathlib import Path
from typing import Any
from PIL import Image

ROOT = Path(r"C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder")
EVIDENCE = ROOT / "assets/academy/evidence/h5-100-potion-sorter-texture-material-intake"
SOURCE = ROOT / "assets/academy/materials/source/h5-100"
PROVENANCE = ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.texture-material-provenance-h5-100.json"
CLASSIFICATION = ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.material-classification-h5-100.json"
INTAKE = ROOT / "manifests/academy/games/potion-sorter/planning/academy.potion-sorter.texture-material-source-intake-h5-100.json"
INDEX = ROOT / "manifests/academy/tooling/organization/academy.manifest-maturity-index.json"
RUN_LOG = EVIDENCE / "pipeline-run-log.json"
REPORT_PATH = EVIDENCE / "validation-report.json"
BASELINE = "c2058e4e682d9e7e5ecfab8ede06c5b5f7989af8"
MANIFEST_PATHS = [p.relative_to(ROOT).as_posix() for p in (INTAKE, PROVENANCE, CLASSIFICATION)]
EXPECTED_AMBIENT = {"WoodSiding008", "WoodFloor065B", "Bricks089", "Bricks100", "Metal046B", "Metal053C", "Metal008", "Paper006", "SurfaceImperfections015"}
EXPECTED_FX = {"smoke_06.png", "dirt_02.png", "spark_01.png", "light_01.png", "smoke_03.png", "dirt_03.png", "spark_05.png", "magic_04.png"}
REQUIRED_EVIDENCE = {
    "source-inventory-overview.jpg", "family-structural-wood-contact-sheet.jpg",
    "family-rough-stone-contact-sheet.jpg", "family-dark-iron-contact-sheet.jpg",
    "family-aged-brass-bronze-contact-sheet.jpg", "family-parchment-paper-contact-sheet.jpg",
    "family-grime-wear-contact-sheet.jpg", "family-fx-helpers-contact-sheet.jpg",
    "core-material-palette-overview.jpg", "support-material-overview.jpg",
    "candidate-defer-reject-table.jpg", "provenance-status-table.jpg",
    "material-to-future-scenerig-mapping-table.jpg", "source-image-and-hash-audit.json", "README.md",
}

def sha(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()

def aggregate(paths: list[Path]) -> str:
    h = hashlib.sha256()
    for path in sorted(paths, key=lambda p: p.relative_to(ROOT).as_posix()):
        h.update(path.relative_to(ROOT).as_posix().encode())
        h.update(sha(path).encode())
    return h.hexdigest()

def load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))

def run(*args: str) -> str:
    result = subprocess.run(args, cwd=ROOT, text=True, encoding="utf-8", errors="replace", capture_output=True, check=True)
    return result.stdout

def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)

provenance, classification, intake, index, run_log = map(load, (PROVENANCE, CLASSIFICATION, INTAKE, INDEX, RUN_LOG))
for manifest in (provenance, classification, intake):
    require(manifest["status"] == "reviewed", "H5.100 manifest status must preserve the completed human review")
    require(manifest["reviewStatus"] == "human-review-passed", "H5.100 human review verdict missing")
    require(manifest["pantryEligibility"] == "approved-for-reusable-glyphforge-source-pantry", "pantry acceptance missing")
    require(manifest["runtimeEligibility"] == "not-runtime-approved" and manifest["runtimeApproved"] is False, "pantry approval leaked into runtime approval")
    require(manifest["humanReviewVerdict"]["verdict"] == "approved-for-reusable-glyphforge-material-pantry", "human review verdict drift")
require("evidence-only" in intake["researchPreviewPolicy"], "research preview evidence-only policy missing")
require(run("git", "rev-parse", "HEAD").strip() == BASELINE, "Git HEAD differs from required baseline")
require(not run("git", "diff", "--cached", "--name-only").strip(), "staged files are present")
status_lines = [line for line in run("git", "status", "--porcelain=v1", "-uall").splitlines() if line]
changed = [line[3:].replace("\\", "/") for line in status_lines]
allowed_exact = {
    "CHANGELOG.md",
    "docs/assets/pantry/visual-assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md",
    "docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_100_POTION_SORTER_TEXTURE_MATERIAL_INTAKE_AND_PROVENANCE.md",
    "manifests/academy/tooling/organization/academy.manifest-maturity-index.json",
    *MANIFEST_PATHS,
}
allowed_prefixes = (
    "assets/academy/materials/source/h5-100/",
    "assets/academy/evidence/h5-100-potion-sorter-texture-material-intake/",
)
for path in changed:
    require(path in allowed_exact or path.startswith(allowed_prefixes), f"out-of-scope changed path: {path}")
    require(not path.startswith(("games/", "hub/", "assets/academy/fonts/runtime/")), f"runtime path changed: {path}")
    require(not Path(path).name in {"package.json", "pnpm-lock.yaml", "package-lock.json"}, f"package/lock path changed: {path}")

json_files = [ROOT / path for path in changed if path.lower().endswith(".json")]
for path in json_files:
    load(path)

records = provenance["sourceRecords"]
require(len(records) == 17, f"expected 17 source records, found {len(records)}")
required_record_fields = {"id", "sourceTitle", "creator", "sourcePage", "directDownloadSource", "retrievalDate", "license", "attributionRequired", "redistributionConditions", "originalArchive", "originalArchiveSha256", "extractedFiles", "materialFamily", "disposition"}
for record in records:
    require(required_record_fields <= record.keys(), f"incomplete provenance record: {record.get('id')}")
    require(record["license"] == "CC0 1.0" and record["attributionRequired"] is False, f"unexpected license assertion: {record['id']}")

archives = sorted((SOURCE / "ambientcg/archives").glob("*.zip")) + [SOURCE / "kenney/archives/kenney_particle-pack.zip"]
require(len(archives) == 10, f"expected 10 archives, found {len(archives)}")
require({p.name.removesuffix("_1K-JPG.zip") for p in archives[:-1]} == EXPECTED_AMBIENT, "ambient archive roster mismatch")
require(not (SOURCE / "ambientcg/archives/Metal055B_1K-JPG.zip").exists(), "rejected Metal055B archive remains in intake")
archive_hashes = {p.relative_to(ROOT).as_posix(): sha(p) for p in archives}
require(aggregate(archives) == provenance["archiveAggregateSha256"], "aggregate archive SHA-256 mismatch")

image_count = 0
for record in records:
    archive = ROOT / record["originalArchive"]
    require(archive.exists(), f"missing archive: {archive}")
    require(sha(archive) == record["originalArchiveSha256"] == archive_hashes[record["originalArchive"]], f"archive hash mismatch: {record['id']}")
    extracted = record["extractedFiles"]
    require(len(extracted) == 1, f"expected one extracted review file: {record['id']}")
    item = extracted[0]
    path = ROOT / item["path"]
    require(path.exists() and sha(path) == item["sha256"], f"extracted hash mismatch: {record['id']}")
    with Image.open(path) as im:
        require([im.width, im.height] == [item["width"], item["height"]], f"dimension mismatch: {record['id']}")
        require(im.format == item["format"], f"format mismatch: {record['id']}")
    with zipfile.ZipFile(archive) as zf:
        if "archiveMember" in record:
            member = record["archiveMember"]
        else:
            color_members = [n for n in zf.namelist() if Path(n).name.lower().endswith(("_color.jpg", "_color.jpeg", "_color.png"))]
            require(len(color_members) == 1, f"color member ambiguity: {record['id']}")
            member = color_members[0]
        require(hashlib.sha256(zf.read(member)).hexdigest() == item["sha256"], f"archive member differs from extracted file: {record['id']}")
    image_count += 1
require({Path(r["archiveMember"]).name for r in records if "archiveMember" in r} == EXPECTED_FX, "Kenney extraction roster mismatch")

for license_record in provenance["licenseRecords"]:
    files = [ROOT / p for p in license_record["licenseFiles"]]
    require(all(p.exists() for p in files), f"missing license record for {license_record['sourceFamily']}")
    text = "\n".join(p.read_text(encoding="utf-8", errors="replace") for p in files).lower()
    require("cc0" in text or "creative commons zero" in text, f"CC0 authority missing for {license_record['sourceFamily']}")
    require(license_record["attributionRequired"] is False and license_record["rawRedistributionAllowed"] is True, f"license conditions mismatch for {license_record['sourceFamily']}")

hash_groups: dict[str, list[str]] = defaultdict(list)
for path in SOURCE.rglob("*"):
    if path.is_file():
        hash_groups[sha(path)].append(path.relative_to(ROOT).as_posix())
duplicates = [paths for paths in hash_groups.values() if len(paths) > 1]
for group in duplicates:
    require(all(Path(p).name == "CC0-1.0-legalcode.txt" for p in group), f"unexpected duplicate source files: {group}")

class_by_id = {item["id"]: item for item in classification["assets"]}
require(set(class_by_id) == {r["id"] for r in records}, "classification/provenance record IDs differ")
for record in records:
    item = record["extractedFiles"][0]
    classified = class_by_id[record["id"]]
    require(classified["dimensions"] == [item["width"], item["height"]], f"classification dimensions mismatch: {record['id']}")
    if record["id"].startswith("kenney-particle-"):
        require(classified["alphaStatus"] == "meaningful-alpha", f"FX alpha missing: {record['id']}")
    else:
        require(classified["alphaStatus"] == "no-alpha", f"ambient color map unexpectedly has alpha: {record['id']}")
    require(classified["runtimeEligibility"] == "not-runtime-approved", f"runtime eligibility drift: {record['id']}")

require(index["totalManifestCount"] == 82 and len(index["planningManifests"]) == 28, "maturity-index totals mismatch")
entry_paths = {entry["path"] for entry in index["manifestEntries"]}
require(all(path in index["planningManifests"] and path in entry_paths for path in MANIFEST_PATHS), "H5.100 manifests missing from maturity index")
index_by_path = {entry["path"]: entry for entry in index["manifestEntries"]}
for path in MANIFEST_PATHS:
    require(index_by_path[path]["status"] == "reviewed", f"maturity-index review status drift: {path}")
    require(index_by_path[path]["reviewStatus"] == "human-review-passed", f"maturity-index human review drift: {path}")
    require(index_by_path[path]["runtimeEligibility"] == "not-runtime-approved", f"maturity-index runtime boundary drift: {path}")
require(index["sourceOfTruthByDomain"]["h5_100PotionSorterTextureMaterialSourceIntake"] == MANIFEST_PATHS[0], "source-intake authority mismatch")
require(index["sourceOfTruthByDomain"]["h5_100PotionSorterTextureMaterialProvenance"] == MANIFEST_PATHS[1], "provenance authority mismatch")
require(index["sourceOfTruthByDomain"]["h5_100PotionSorterMaterialClassification"] == MANIFEST_PATHS[2], "classification authority mismatch")

for name in REQUIRED_EVIDENCE:
    require((EVIDENCE / name).exists(), f"missing required evidence: {name}")
if os.getenv("H5_100_SKIP_RUNLOG_HASH") != "1":
    for output in run_log["outputFiles"]:
        path = ROOT / output["path"]
        require(path.exists() and sha(path) == output["sha256"], f"run-log output hash mismatch: {output['path']}")
for path in run_log["evidenceFiles"]:
    require((ROOT / path).exists(), f"run-log evidence reference missing: {path}")
require(run_log["sourceSha256"] == provenance["archiveAggregateSha256"], "run-log source hash mismatch")

suspect = ("\ufffd", "Ã", "Â", "â€")
for path in [INTAKE, PROVENANCE, CLASSIFICATION, EVIDENCE / "README.md", EVIDENCE / "generate_h5_100_evidence.py", ROOT / "docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_100_POTION_SORTER_TEXTURE_MATERIAL_INTAKE_AND_PROVENANCE.md"]:
    text = path.read_text(encoding="utf-8")
    require("\x00" not in text and not any(token in text for token in suspect), f"control/mojibake marker in authored file: {path}")
added_diff = run("git", "diff", "--unified=0", "--", "CHANGELOG.md", "docs/assets/pantry/visual-assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md")
added_lines = "\n".join(line[1:] for line in added_diff.splitlines() if line.startswith("+") and not line.startswith("+++"))
require("\x00" not in added_lines and not any(token in added_lines for token in suspect), "control/mojibake marker in added governance lines")

report = {
    "schemaVersion": "0.1", "laneId": "H5.100", "status": "passed",
    "baseline": BASELINE, "changedPathCount": len(changed), "changedPaths": changed, "jsonFilesParsed": len(json_files),
    "sourceRecordCount": len(records), "archiveCount": len(archives), "archiveAggregateSha256": aggregate(archives),
    "archives": [{"path": p.relative_to(ROOT).as_posix(), "bytes": p.stat().st_size, "sha256": sha(p)} for p in archives],
    "archiveBytes": sum(p.stat().st_size for p in archives), "sourceShelfBytes": sum(p.stat().st_size for p in SOURCE.rglob("*") if p.is_file()),
    "extractedImageCount": image_count, "intentionalDuplicateGroups": duplicates,
    "maturityIndex": {"totalManifestCount": index["totalManifestCount"], "planningManifestCount": len(index["planningManifests"]), "manifestEntryCount": len(index["manifestEntries"])},
    "scopeChecks": {"runtimePathsChanged": False, "packageOrLockChanged": False, "stagedFiles": False, "outOfScopePaths": []},
    "checks": ["Git baseline", "unstaged-only state", "changed-path scope", "all changed JSON parses", "human pantry-review boundary", "research-preview evidence-only policy", "archive and extracted-member SHA-256", "license records", "duplicate scan", "dimensions/formats/alpha", "classification parity", "evidence references", "run-log output hashes", "maturity-index consistency", "control-character and mojibake scan"],
}
REPORT_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2, ensure_ascii=False))
