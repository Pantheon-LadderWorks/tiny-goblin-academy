from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path
from PIL import Image


REPO = Path(__file__).resolve().parents[5]
LAB = Path(__file__).resolve().parent
BASELINE = "fc48cf92d01e0af260d474c096257245eedea7d0"

REQUIRED_SOURCE = [
    "index.html",
    "composition-c-reference.html",
    "styles.css",
    "src/config.js",
    "src/environment-rigs.js",
    "src/machine-rigs.js",
    "src/potion-rigs.js",
    "src/PreviewScene.js",
    "src/main.js",
    "capture_h6_evidence.mjs",
]

REQUIRED_RECORDS = [
    "README.md",
    "material-use-matrix.json",
    "responsive-audit.json",
    "runtime-isolation-audit.json",
    "motion-proof.json",
    "spatial-contract.json",
    "actor-lifecycle-audit.json",
    "human-review-closure.json",
]

REQUIRED_CAPTURES = {
    "00-perspective-guide.png": (1600, 900),
    "reference/original-composition-c.png": (1600, 900),
    "reference/corrected-silhouette.png": (1600, 900),
    "reference/01-original-c-vs-corrected-silhouette.png": (1920, 1080),
    "reference/02-rejected-vs-corrected-1920x1080.png": (1920, 1080),
    "reference/opaque-cabinet-before.png": (1920, 1080),
    "reference/03-opaque-cabinet-vs-open-gantry.png": (1920, 1080),
    "01-initial-queue-1920x1080.png": (1920, 1080),
    "02-initial-queue-1024x640.png": (1024, 640),
    "03-red-travelling-to-left-receiver.png": (1600, 900),
    "04-red-accepted-blue-green-advanced.png": (1600, 900),
    "05-blue-travelling-to-center-receiver.png": (1600, 900),
    "06-blue-accepted-green-advanced.png": (1600, 900),
    "07-green-travelling-to-right-receiver.png": (1600, 900),
    "08-all-three-accepted-queue-empty.png": (1600, 900),
    "09-actor-identity-ownership-diagnostic.png": (1600, 900),
    "10-aperture-approach-continuity-contact-sheet.png": (1920, 1080),
    "11-receiver-handoff-continuity-contact-sheet.png": (1920, 1080),
    "12-reduced-motion.png": (1600, 900),
    "14-queue-depth-open-gantry.png": (1600, 900),
    "15-inspection-aperture-continuous-conveyor.png": (1600, 900),
    "16-inspection-gantry-presentation-crop.png": (820, 620),
    "17-inspection-gantry-diagnostic-crop.png": (820, 620),
    "18-rear-middle-gantry-occlusion-contact-sheet.png": (1920, 1080),
}

LIVE_PATHS = [
    "games/tier-1/02-potion-sorter/src/main.ts",
    "games/tier-1/02-potion-sorter/src/potion-scene.ts",
    "games/tier-1/02-potion-sorter/src/styles.css",
    "games/tier-1/02-potion-sorter/src/controller.ts",
    "games/tier-1/02-potion-sorter/src/simulation.ts",
    "games/tier-1/02-potion-sorter/package.json",
    "pnpm-lock.yaml",
]

RIG_NAMES = [
    "PotionRoomRig",
    "ConveyorRig",
    "InspectionApertureRig",
    "SortingStationRig",
    "PotionActorRig",
    "PotionQueuePresentation",
    "AlchemyLightingRig",
]

ASSET_HASHES = {
    "assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-regenerated-v0.2.png": "8daa626200dba20a14c1bd6c511d0ac3bc1eabb55c1b17cacd69ea7b3c9f10a5",
    "assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_timber.png": "0b3a32e15151ed4b564651ae6ee7255129920f215bf4169cf20e7d2965c3b9d3",
    "assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_stone.png": "009009b4d0a9ce16dda10ed6df8a81456d6992fa32fb834bd08d84b04be35f8c",
    "assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/metal_plates.png": "2f19bc3b8868c8739149d2eecc9c1341ed6e18cdb5032f7fd32f8c4dfaae0420",
    "assets/academy/materials/source/h5-100/ambientcg/extracted-color/Metal008/Metal008_1K-JPG_Color.jpg": "89e08ccdd93901f03556b37d6361e39dee1ce614b13a10a13c73030ba6375c59",
    "assets/academy/materials/source/h5-100c/opengameart/luke-rustltd-parchment/originals/parchment.png": "1a5864e3549355d83607b0dfd6a2093106b13df0a42227f17cb28bf488ab9207",
}


def unchanged_from_baseline(relative: str) -> bool:
    result = subprocess.run(
        ["git", "diff", "--quiet", BASELINE, "--", relative], cwd=REPO
    )
    return result.returncode == 0


checks: list[tuple[str, bool, str]] = []


def check(name: str, condition: bool, detail: str) -> None:
    checks.append((name, condition, detail))


for relative in REQUIRED_SOURCE:
    check(f"source:{relative}", (LAB / relative).is_file(), relative)

for relative in REQUIRED_RECORDS:
    check(f"record:{relative}", (LAB / relative).is_file(), relative)

source_text = "\n".join(
    path.read_text(encoding="utf-8")
    for path in LAB.glob("src/*.js")
    if path.is_file()
)
for rig_name in RIG_NAMES:
    check(f"rig:{rig_name}", f"class {rig_name}" in source_text, rig_name)

check("logical-stage", "1600" in source_text and "900" in source_text, "1600x900")
check("reduced-motion", "prefers-reduced-motion" in source_text, "media query respected")
check("local-masks-only", "setMask" in source_text, "geometry masks used locally")
check("no-alpha-mask", "BitmapMask" not in source_text, "no alpha mask")
check("h5.49-denials", "region: 9" not in source_text and "region: 14" not in source_text, "regions 9 and 14 absent")
check("approved-sprite-regions", all(f"region: {index}" in source_text for index in [1, 2, 3, 17, 18, 19]), "regions 1,2,3,17,18,19")
check("three-stable-actor-constructions", source_text.count("new PotionActorRig") == 3, str(source_text.count("new PotionActorRig")))
check("no-active-reusable-actor", "this.active =" not in source_text and "this.active." not in source_text, "no reusable active actor")
check("no-sorted-actor-clones", "addSortedBottle" not in source_text and "sortedActors" not in source_text, "no parked replicas")
check("actor-identity-diagnostics", all(token in source_text for token in ["actorId", "ownerRig", "anchorState", "activeMask", "snapshot"]), "identity and ownership fields")
check("no-opaque-inspection-cabinet", "fillStyle(0x100b12, 1).fillRoundedRect(635, 350, 330, 310" not in source_text, "broad opaque interior removed")
check("inspection-corridor-components", all(token in source_text for token in ["corridorRoot", "corridorShade", "corridorRails", "focusRoot", "housingTop"]), "open gantry corridor")

for relative, expected_hash in ASSET_HASHES.items():
    path = REPO / relative
    actual_hash = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else "missing"
    check(f"asset-hash:{relative}", actual_hash == expected_hash, actual_hash)

runtime_text = "\n".join(
    path.read_text(encoding="utf-8", errors="replace")
    for path in LAB.rglob("*")
    if path.is_file() and path.suffix.lower() in {".html", ".css", ".js"}
)
check("no-external-runtime", "https://" not in runtime_text and "http://" not in runtime_text, "no network assets")

for relative in LIVE_PATHS:
    check(f"isolated:{relative}", unchanged_from_baseline(relative), relative)

capture_dir = LAB / "captures"
for filename, expected_size in REQUIRED_CAPTURES.items():
    path = capture_dir / filename
    exists = path.is_file()
    actual = Image.open(path).size if exists else None
    check(f"capture:{filename}", exists and actual == expected_size, f"expected {expected_size}, got {actual}")

motion = capture_dir / "13-complete-demo-cycle.webm"
check("motion-capture", motion.is_file() and motion.stat().st_size > 10_000, "complete WebM cycle")

continuity_frames = list((capture_dir / "continuity-frames").glob("*.png"))
check("continuity-real-frames", len(continuity_frames) == 24, f"expected 24, got {len(continuity_frames)}")

for record_name in REQUIRED_RECORDS[1:]:
    path = LAB / record_name
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            check(f"json:{record_name}", bool(data.get("passed")), "passed=true")
        except (json.JSONDecodeError, AttributeError) as exc:
            check(f"json:{record_name}", False, str(exc))

spatial_path = LAB / "spatial-contract.json"
if spatial_path.is_file():
    spatial = json.loads(spatial_path.read_text(encoding="utf-8"))
    aperture_x = spatial["apertureCenter"]["x"]
    destination_xs = [destination["x"] for destination in spatial["destinationCenters"]]
    check("spatial:aperture-central", abs(aperture_x - 800) <= 80, str(aperture_x))
    check("spatial:queue-corridor", all(abs(anchor["x"] - aperture_x) <= 40 for anchor in spatial["queueAnchors"]), str(spatial["queueAnchors"]))
    check("spatial:conveyor-diverges", spatial["conveyor"]["nearWidth"] > spatial["conveyor"]["farWidth"] * 3, str(spatial["conveyor"]))
    check("spatial:receivers-span-foreground", destination_xs[0] < 600 and 650 <= destination_xs[1] <= 950 and destination_xs[2] > 1000, str(destination_xs))
    check("spatial:no-side-module", not spatial["detachedSideModule"], str(spatial["detachedSideModule"]))
    check("spatial:no-diagonal-feed", not spatial["dominantDiagonalFeed"], str(spatial["dominantDiagonalFeed"]))
    check("spatial:path-continuous", spatial["continuousPath"], str(spatial["continuousPath"]))
    gantry = spatial["inspectionGantry"]
    check("gantry:continuous-conveyor", gantry["continuousConveyor"], str(gantry))
    check("gantry:no-broad-opaque-interior", not gantry["broadOpaqueInterior"], str(gantry))
    check("gantry:depth-order", gantry["corridor"] < gantry["rearPotion"] < gantry["upperCrossbar"] < gantry["middlePotion"] < gantry["activePotion"] < gantry["foregroundRim"], str(gantry))

lifecycle_path = LAB / "actor-lifecycle-audit.json"
if lifecycle_path.is_file():
    lifecycle = json.loads(lifecycle_path.read_text(encoding="utf-8"))
    stable_ids = lifecycle.get("stableActorIds", [])
    check("lifecycle:exact-three-ids", stable_ids == ["potion-green", "potion-blue", "potion-red"], str(stable_ids))
    check("lifecycle:actor-count", lifecycle.get("presentationActorCount") == 3, str(lifecycle.get("presentationActorCount")))
    check("lifecycle:no-clones", lifecycle.get("clonesCreated") is False, str(lifecycle.get("clonesCreated")))
    check("lifecycle:no-invisible-handoffs", lifecycle.get("invisibleHandoffs") is False, str(lifecycle.get("invisibleHandoffs")))
    check("lifecycle:two-deterministic-runs", lifecycle.get("deterministicRunsCompared") == 2, str(lifecycle.get("deterministicRunsCompared")))
    check("lifecycle:all-phases-pass", all(entry.get("passed") for entry in lifecycle.get("timelineAudit", [])), str(len(lifecycle.get("timelineAudit", []))))
    check("lifecycle:final-occupancy", lifecycle.get("finalOccupancy") == {
        "destination.green": "green", "destination.blue": "blue", "destination.red": "red"
    }, str(lifecycle.get("finalOccupancy")))
    approach = next((entry for entry in lifecycle.get("timelineAudit", []) if entry.get("phase") == "blue-approach"), None)
    rear_actor = next((actor for actor in approach.get("actors", []) if actor.get("potionId") == "green"), {}) if approach else {}
    check("lifecycle:rear-behind-crossbar", rear_actor.get("depth") == 27 and rear_actor.get("anchorState") == "gantry-crossing.green" and rear_actor.get("visible") is True, str(rear_actor))

closure_path = LAB / "human-review-closure.json"
if closure_path.is_file():
    closure = json.loads(closure_path.read_text(encoding="utf-8"))
    check("closure:human-review-passed", closure.get("humanReviewStatus") == "passed", str(closure.get("humanReviewStatus")))
    check("closure:visual-target-approved", closure.get("visualTargetStatus") == "approved", str(closure.get("visualTargetStatus")))
    check("closure:production-not-integrated", closure.get("productionIntegrated") is False, str(closure.get("productionIntegrated")))
    check("closure:runtime-not-approved", closure.get("runtimeApproved") is False, str(closure.get("runtimeApproved")))
    check("closure:production-ready", closure.get("productionIntegrationReady") is True, str(closure.get("productionIntegrationReady")))

passed = sum(1 for _, ok, _ in checks if ok)
for name, ok, detail in checks:
    print(f"{'PASS' if ok else 'FAIL'} {name}: {detail}")
print(f"\nH6 preview validation: {passed}/{len(checks)} checks passed")
if passed != len(checks):
    raise SystemExit(1)
