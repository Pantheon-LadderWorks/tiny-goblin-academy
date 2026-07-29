"""Build the TGA asset exposure inventory from current Git and canonical manifests.

This deliberately inventories asset payloads, not the H5/H6 evidence corpus.
Evidence paths may be attached to a pack as supporting provenance, but screenshots,
contact sheets, captures, and recordings are not promoted into independent pantry
assets by this script.
"""

from __future__ import annotations

import hashlib
import json
import subprocess
from collections import defaultdict
from pathlib import Path, PurePosixPath


REPO = Path(__file__).resolve().parents[4]
OUTPUT = REPO / "docs/assets/licensing/TGA_PUBLIC_ASSET_EXPOSURE_INVENTORY.json"
AUDIT_BASELINE = REPO / "docs/assets/licensing/evidence/audit-baseline.json"
MEDIA_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".icns",
    ".ttf", ".otf", ".woff", ".woff2", ".wav", ".mp3", ".ogg", ".webm",
    ".mp4", ".zip",
}


def git(*args: str) -> str:
    return subprocess.check_output(
        ["git", *args], cwd=REPO, text=True, encoding="utf-8", errors="replace"
    )


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_json(relative_path: str) -> dict:
    return json.loads((REPO / relative_path).read_text(encoding="utf-8"))


def is_asset_payload(path: str) -> bool:
    pure = PurePosixPath(path)
    if pure.suffix.lower() not in MEDIA_EXTENSIONS:
        return False
    normalized = "/" + path
    if "/evidence/" in normalized or "/captures/" in normalized:
        return False
    if path.startswith("docs/evidence/") or path.startswith("docs/assets/archive/"):
        return False
    return path.startswith("assets/") or path.startswith("hub/public/") or path.startswith("hub/src-tauri/icons/")


def file_record(path: str, references: dict[str, dict[str, list[str]]]) -> dict:
    absolute = REPO / path
    basename = PurePosixPath(path).name
    categorized = references.get(basename, {})
    return {
        "path": path,
        "bytes": absolute.stat().st_size,
        "sha256": sha256(absolute),
        "role": "raw-source" if "/source/" in path or "/archives/" in path else "derived-or-distribution",
        "productionRuntimeReferences": categorized.get("production", []),
        "testFixtureReferences": categorized.get("test", []),
        "evidenceAndCaptureReferences": categorized.get("evidence", []),
        "documentationReferences": categorized.get("documentation", []),
    }


def base_record(record_id: str, title: str, category: str) -> dict:
    return {
        "id": record_id,
        "title": title,
        "category": category,
        "files": [],
        "historicalPaths": [],
        "creator": None,
        "sourceWebsite": None,
        "originalSourceUrl": None,
        "acquisitionDate": None,
        "generation": None,
        "license": {"name": None, "version": None, "evidencePaths": []},
        "permissions": {
            "commercialUse": "unresolved",
            "modification": "unresolved",
            "rawSourceRedistribution": "unresolved",
            "derivativeRedistribution": "unresolved",
            "finishedGameDistribution": "unresolved",
            "publicRepository": "unresolved",
        },
        "noticeRequired": "unresolved",
        "attributionText": None,
        "aiRestrictions": "not-recorded",
        "manifestCoverage": "partial-or-missing",
        "provenanceCoverage": "incomplete",
        "runtimeApproval": "independent-from-license",
        "humanApproval": "independent-from-license",
        "currentPublicExposure": True,
        "historicalPublicExposure": False,
        "recommendedClassification": "license-unclear",
        "confidence": "low",
        "unresolvedEvidence": [],
        "evidenceReferences": [],
    }


def generated_record(record_id: str, title: str, category: str) -> dict:
    record = base_record(record_id, title, category)
    record.update(
        {
            "creator": "Kryssie-directed generation and curation",
            "originType": "first-party-ai-generated-or-assisted",
            "generation": {
                "generalProviderStatement": "CREDITS.md states that TGA visual assets were generated using Gemini image generation.",
                "providerFamily": "Google or OpenAI where already recorded; exact historical model is optional",
                "thirdPartyReferenceUsed": "unknown-for-legacy-assets",
                "humanEditing": "selected-cleaned-mapped-and-integrated-under-human-direction",
            },
            "license": {
                "name": "First-party AI-generated or AI-assisted content; no third-party stock-asset license identified",
                "version": None,
                "evidencePaths": ["CONTENT_LICENSE.md", "CREDITS.md"],
            },
            "permissions": {
                key: "no-third-party-asset-license-restriction-identified"
                for key in record["permissions"]
            },
            "noticeRequired": "project-level-ai-disclosure-and-storefront-specific-disclosure",
            "aiRestrictions": "check current provider and storefront terms at release; no per-asset public model credit required by this audit",
            "provenanceCoverage": "sufficient-origin-classification; exact-generation-lineage-optional",
            "recommendedClassification": "generated-first-party",
            "confidence": "medium-high",
            "thirdPartyInputConcern": "none-known",
            "aiDisclosure": {
                "required": True,
                "scope": "project-and-storefront-level",
                "perAssetModelCreditRequired": False,
            },
            "copyrightStrength": "not-assessed",
            "exactGenerationProvenance": "optional-incomplete",
            "unresolvedEvidence": [],
            "reviewTriggers": [
                "credible evidence of a third-party reference or copied source",
                "protected character, logo, likeness, or brand content",
                "provider-specific restriction applicable to the output",
                "uncertainty whether the asset was generated or externally downloaded",
            ],
        }
    )
    return record


def main() -> None:
    audit_baseline = json.loads(AUDIT_BASELINE.read_text(encoding="utf-8"))
    tracked = git("ls-files").splitlines()
    all_media_paths = sorted(
        path for path in tracked if PurePosixPath(path).suffix.lower() in MEDIA_EXTENSIONS
    )
    asset_paths = sorted(path for path in tracked if is_asset_payload(path))

    reference_source_text: dict[str, str] = {}
    for path in tracked:
        if path.startswith("docs/assets/licensing/"):
            continue
        if PurePosixPath(path).suffix.lower() in MEDIA_EXTENSIONS:
            continue
        absolute = REPO / path
        try:
            if absolute.stat().st_size <= 2_000_000:
                reference_source_text[path] = absolute.read_text(encoding="utf-8", errors="ignore")
        except (FileNotFoundError, OSError):
            pass
    def reference_category(path: str) -> str:
        normalized = "/" + path.lower()
        basename = PurePosixPath(path).name.lower()
        if "/tests/" in normalized or "/test/" in normalized or ".test." in basename or ".spec." in basename or "fixture" in basename:
            return "test"
        if "/evidence/" in normalized or "/captures/" in normalized or "capture" in basename or "runtime-audit" in basename:
            return "evidence"
        if "/src/" in normalized and (path.startswith("games/") or path.startswith("hub/")):
            return "production"
        if path == "hub/src-tauri/tauri.conf.json":
            return "production"
        return "documentation"

    references: dict[str, dict[str, list[str]]] = {}
    for asset_path in asset_paths:
        basename = PurePosixPath(asset_path).name
        categories = defaultdict(list)
        for path, content in reference_source_text.items():
            if basename in content:
                categories[reference_category(path)].append(path)
        references[basename] = {
            category: sorted(categories.get(category, []))
            for category in ("production", "test", "evidence", "documentation")
        }

    records: dict[str, dict] = {}
    assignment: dict[str, str] = {}

    font_inventory = load_json("manifests/academy/fonts/academy.font-inventory.json")
    font_entries = defaultdict(list)
    for path in asset_paths:
        if path.startswith("assets/academy/fonts/source/google-fonts/"):
            font_entries[path.split("/")[5]].append(path)
    canonical_font_paths = {item["localFilePath"] for item in font_inventory["fonts"]}
    for family_slug, paths in sorted(font_entries.items()):
        record_id = f"font-google-{family_slug}"
        record = base_record(record_id, f"Google Fonts family: {family_slug}", "font")
        license_path = f"assets/academy/fonts/source/google-fonts/{family_slug}/OFL.txt"
        metadata_path = f"assets/academy/fonts/source/google-fonts/{family_slug}/METADATA.pb"
        ofl_text = (REPO / license_path).read_text(encoding="utf-8", errors="replace")
        copyright_line = next(
            (line.strip() for line in ofl_text.splitlines() if line.strip().lower().startswith("copyright")),
            "See local OFL.txt copyright header",
        )
        explicit_rfn = [
            line.strip()
            for line in ofl_text.splitlines()
            if "Reserved Font Name" in line and not line.lstrip().startswith('"Reserved Font Name" refers')
        ]
        canonical_entries = [item for item in font_inventory["fonts"] if item["localFilePath"] in paths]
        record.update(
            {
                "creator": copyright_line,
                "sourceWebsite": "Google Fonts",
                "originalSourceUrl": "https://github.com/google/fonts",
                "license": {"name": "SIL Open Font License", "version": "1.1", "evidencePaths": [p for p in [license_path, metadata_path] if (REPO / p).exists()]},
                "permissions": {
                    "commercialUse": True,
                    "modification": True,
                    "rawSourceRedistribution": True,
                    "derivativeRedistribution": "allowed under OFL conditions; modified fonts may require renaming where Reserved Font Names apply",
                    "finishedGameDistribution": True,
                    "publicRepository": True,
                },
                "noticeRequired": True,
                "attributionText": "Preserve the family copyright and OFL 1.1 text; do not invent a separate credit line.",
                "aiRestrictions": "none stated in OFL 1.1",
                "manifestCoverage": "complete" if all(p in canonical_font_paths for p in paths) else "partial",
                "provenanceCoverage": "license-and-official-source-captured",
                "recommendedClassification": "third-party-public-safe",
                "confidence": "high",
                "unresolvedEvidence": [] if all(p in canonical_font_paths for p in paths) else ["One or more tracked styles are absent from the canonical font inventory."],
                "evidenceReferences": ["assets/academy/evidence/h5-98-academy-typography-promotion/font-provenance-status-table.md"],
                "fontAudit": {
                    "familySlug": family_slug,
                    "styles": [PurePosixPath(path).name for path in paths],
                    "reservedFontNameStatements": explicit_rfn,
                    "modifiedRenamedSubsetOrConverted": "no transformation recorded; canonical hashes verify only the styles represented in academy.font-inventory.json",
                    "canonicalInventoryStyleCount": len(canonical_entries),
                    "trackedBinaryCount": len(paths),
                },
            }
        )
        records[record_id] = record
        for path in paths:
            assignment[path] = record_id

    h5100 = load_json("manifests/academy/games/potion-sorter/planning/academy.potion-sorter.texture-material-provenance-h5-100.json")
    for source in h5100["sourceRecords"]:
        provider = "ambientcg" if "/ambientcg/" in source["originalArchive"] else "kenney"
        record_id = f"material-h5-100-{source['id']}" if provider == "ambientcg" else "material-h5-100-kenney-particle-pack"
        if record_id not in records:
            record = base_record(record_id, source["sourceTitle"] if provider == "ambientcg" else "Kenney Particle Pack", "texture-or-fx-source")
            root = f"assets/academy/materials/source/h5-100/{provider}"
            record.update(
                {
                    "creator": source["creator"],
                    "sourceWebsite": provider,
                    "originalSourceUrl": source["sourcePage"],
                    "acquisitionDate": source["retrievalDate"],
                    "license": {"name": "CC0", "version": "1.0", "evidencePaths": [
                        f"{root}/license/CC0-1.0-legalcode.txt",
                        *([f"{root}/license/ambientcg-license-page.html"] if provider == "ambientcg" else [f"{root}/license/License.txt", f"{root}/license/kenney-particle-pack-source-page.html"]),
                    ]},
                    "permissions": {k: True for k in ["commercialUse", "modification", "rawSourceRedistribution", "derivativeRedistribution", "finishedGameDistribution", "publicRepository"]},
                    "noticeRequired": False,
                    "attributionText": None,
                    "aiRestrictions": "none stated in CC0 1.0",
                    "manifestCoverage": "complete",
                    "provenanceCoverage": "complete-local-source-license-hash-record",
                    "recommendedClassification": "third-party-public-safe",
                    "confidence": "high",
                    "unresolvedEvidence": [],
                    "evidenceReferences": [h5100["evidenceRoot"] + "/source-image-and-hash-audit.json"],
                }
            )
            records[record_id] = record
        extracted_paths = [
            item["path"] if isinstance(item, dict) else item
            for item in (source.get("extractedFiles") or [])
        ]
        roots = [source.get("originalArchive"), source.get("metadataRecord"), *extracted_paths]
        for path in roots:
            if path in asset_paths:
                assignment[path] = record_id

    h5100c = load_json("manifests/academy/games/potion-sorter/planning/academy.potion-sorter.stylized-fantasy-texture-source-intake-h5-100c.json")
    for source in h5100c["acceptedSources"]:
        record_id = f"material-h5-100c-{source['id']}"
        record = base_record(record_id, source["id"], "texture-source")
        provider = "kenney" if "kenney" in source["id"] else "opengameart"
        root = f"assets/academy/materials/source/h5-100c/{provider}"
        record.update(
            {
                "creator": source["creator"],
                "sourceWebsite": provider,
                "originalSourceUrl": source["sourcePage"],
                "license": {"name": "CC0", "version": "1.0", "evidencePaths": [
                    f"{root}/license/CC0-1.0-legalcode.txt",
                    *([f"{root}/license/License.txt"] if provider == "kenney" else []),
                ]},
                "permissions": {k: True for k in ["commercialUse", "modification", "rawSourceRedistribution", "derivativeRedistribution", "finishedGameDistribution", "publicRepository"]},
                "noticeRequired": False,
                "attributionText": None,
                "aiRestrictions": "none stated in CC0 1.0",
                "manifestCoverage": "complete",
                "provenanceCoverage": "source-url-license-and-hash-record",
                "recommendedClassification": "third-party-public-safe",
                "confidence": "high",
                "unresolvedEvidence": [],
                "evidenceReferences": [h5100c["evidenceRoot"] + "/source-image-and-hash-audit.json"],
            }
        )
        records[record_id] = record
        if provider == "kenney":
            candidates = [p for p in asset_paths if p.startswith(root + "/")]
        elif "deadkir" in source["id"]:
            candidates = [p for p in asset_paths if "/deadkir-handpainted-tileables/" in p]
        else:
            candidates = [p for p in asset_paths if "/luke-rustltd-parchment/" in p]
        for path in candidates:
            assignment[path] = record_id

    generated_groups = [
        ("academy-branding", "Academy branding and exported icons", ["assets/academy/branding/", "assets/readme-banner.png", "assets/itch-cover.png"]),
        ("hub-branding-runtime-icons", "Hub and Tauri icon derivatives", ["hub/src-tauri/icons/", "hub/public/favicon.svg"]),
        ("hub-social-symbols", "Hub social and service SVG symbols", ["hub/public/icons.svg"]),
        ("glyphforge-boot", "GlyphForge Games boot splash", ["assets/studio/glyphforge-games/"]),
        ("academy-hub-visuals", "Academy hub banner and game icons", ["assets/academy/hub/"]),
        ("academy-shared-core", "Academy shared core sheet", ["assets/academy/shared-core/", "assets/academy/derived-cleaned/shared-core/"]),
        ("academy-ui-hud", "Academy UI HUD sheet and runtime crops", ["assets/academy/ui/", "assets/academy/derived-cleaned/ui/"]),
        ("academy-shared-fx", "Academy shared FX concept sheet", ["assets/academy/shared-fx/"]),
        ("creature-goblin", "Goblin character sheets and derivatives", ["assets/academy/creatures/goblin/", "assets/academy/derived-cleaned/goblin/", "assets/academy/derived/tga-platformer-goblin"]),
        ("creature-slime", "Slime character sheets and derivatives", ["assets/academy/creatures/slime/", "assets/academy/derived/tga-topdown-slime"]),
        ("creature-soldier", "Soldier character sheets and derivatives", ["assets/academy/creatures/soldier/"]),
        ("creature-training-dummy", "Training dummy sheets and derivatives", ["assets/academy/creatures/training-dummy/", "assets/academy/derived/tga-platformer-training-dummy"]),
        ("topdown-terrain", "Top-down terrain source and derivative sheets", ["assets/academy/topdown/terrain/"]),
        ("topdown-walls", "Top-down wall source and derivative sheets", ["assets/academy/topdown/walls/"]),
        ("topdown-objects", "Top-down object source and derivative sheets", ["assets/academy/topdown/objects/"]),
    ]
    for game_slug in ["button-goblin-clicker", "card-goblin-duel", "dice-duel-tavern", "dungeon-platformer", "farm-settlement", "one-room-platformer", "pet-campfire", "potion-sorter", "top-down-slime-quest"]:
        generated_groups.append((f"game-{game_slug}", f"Game asset family: {game_slug}", [f"assets/academy/games/{game_slug}/"]))

    for record_id, title, prefixes in generated_groups:
        matched = [path for path in asset_paths if path not in assignment and any(path.startswith(prefix) or path == prefix for prefix in prefixes)]
        if not matched:
            continue
        record = generated_record(record_id, title, "generated-or-curated-visual")
        if record_id == "hub-social-symbols":
            record = base_record(record_id, title, "mixed-third-party-brand-symbols")
            record.update(
                {
                    "creator": "Multiple external brand owners; local vector provenance not recorded",
                    "license": {"name": "unresolved mixed brand-icon licensing", "version": None, "evidencePaths": []},
                    "unresolvedEvidence": ["Identify the source and license for every embedded service/brand glyph and review trademark-use boundaries."],
                }
            )
        records[record_id] = record
        for path in matched:
            assignment[path] = record_id

    specific_generation_notes = {
        "game-button-goblin-clicker": {
            "itemLevelFinding": "Scene-anchor manifest records a ChatGPT-named Downloads intake source.",
            "authorityPath": "manifests/academy/games/button-goblin-clicker/academy.button-goblin-clicker.background.scene-anchors.json",
        },
        "game-card-goblin-duel": {
            "itemLevelFinding": "Tabletop intake records a ChatGPT-named original and user-approved generated illustration; other family sheets remain covered only by general generated-visual documentation.",
            "authorityPath": "manifests/academy/games/card-goblin-duel/academy.card-goblin-duel.tabletop-source-intake.json",
        },
        "game-potion-sorter": {
            "itemLevelFinding": "Regenerated source lineage records a ChatGPT-named Downloads original; the older concept remains covered only by general generated-visual documentation.",
            "authorityPath": "manifests/academy/games/potion-sorter/academy.potion-sorter.cleanup-candidate.json",
        },
        "topdown-terrain": {
            "itemLevelFinding": "Six future floor sheets retain ChatGPT-named Downloads origins and hashes; exact model, prompt, and job genealogy remain optional historical metadata.",
            "authorityPath": "assets/academy/topdown/terrain/future-floor-tilesheets/intake/tga-topdown-floor-tilesheets-future-intake-v0.1.json",
        },
        "topdown-walls": {
            "itemLevelFinding": "Regenerated source is identified and hashed; exact provider/model/prompt genealogy is not required for first-party classification.",
            "authorityPath": "manifests/academy/topdown/source/planning/academy.topdown.regenerated-source-intake.json",
        },
        "topdown-objects": {
            "itemLevelFinding": "Regenerated source is identified and hashed; exact provider/model/prompt genealogy is not required for first-party classification.",
            "authorityPath": "manifests/academy/topdown/source/planning/academy.topdown.regenerated-source-intake.json",
        },
    }
    for record_id, note in specific_generation_notes.items():
        if record_id in records:
            records[record_id]["generation"].update(note)

    unassigned = [path for path in asset_paths if path not in assignment]
    if unassigned:
        record = base_record("unclassified-current-asset-payloads", "Current asset payloads requiring manual routing", "unclassified")
        record["unresolvedEvidence"] = ["Assign each file to a coherent source or generated family before remediation closes."]
        records[record["id"]] = record
        for path in unassigned:
            assignment[path] = record["id"]

    for path in asset_paths:
        records[assignment[path]]["files"].append(file_record(path, references))

    for record in records.values():
        record["license"]["evidenceFiles"] = [
            {"path": path, "bytes": (REPO / path).stat().st_size, "sha256": sha256(REPO / path)}
            for path in record["license"].get("evidencePaths", [])
            if (REPO / path).is_file()
        ]

    history = git("log", "--all", "--format=@@%H", "--name-status", "--diff-filter=ADR")
    current = set(tracked)
    history_commit = None
    historical = defaultdict(lambda: {"commits": set(), "statuses": set()})
    for line in history.splitlines():
        if line.startswith("@@"):
            history_commit = line[2:]
            continue
        parts = line.split("\t")
        if len(parts) < 2:
            continue
        path = parts[-1].replace("\\", "/")
        if PurePosixPath(path).suffix.lower() not in MEDIA_EXTENSIONS or path in current:
            continue
        if "/evidence/" in "/" + path or path.startswith("docs/evidence/"):
            continue
        historical[path]["commits"].add(history_commit)
        historical[path]["statuses"].add(parts[0])
    if historical:
        record = base_record("historical-removed-media", "Removed historical media", "historical-exposure")
        record.update(
            {
                "currentPublicExposure": False,
                "historicalPublicExposure": True,
                "recommendedClassification": "license-unclear",
                "confidence": "medium",
                "unresolvedEvidence": ["Three removed Vite/React template assets require no action unless a future history rewrite is independently justified."],
            }
        )
        record["historicalPaths"] = [
            {"path": path, "commits": sorted(info["commits"]), "statuses": sorted(info["statuses"])}
            for path, info in sorted(historical.items())
        ]
        records[record["id"]] = record

    ordered_records = sorted(records.values(), key=lambda item: item["id"])
    inventoried_paths = {
        item["path"] for record in ordered_records for item in record["files"]
    }
    explicitly_excluded_media = []
    unexpected_media = []
    for path in all_media_paths:
        if path in inventoried_paths:
            continue
        normalized = "/" + path.lower()
        if "/evidence/" in normalized or "/captures/" in normalized or path.startswith("docs/evidence/"):
            exclusion_class = "supporting-evidence"
            reason = "supporting H5/H6 or runtime evidence; not an independent pantry asset"
        elif path.startswith("docs/assets/archive/"):
            exclusion_class = "archived-debug-evidence"
            reason = "archived debug/evidence image; not an active asset payload"
        elif any(segment in normalized for segment in ("/node_modules/", "/.cache/", "/dist/", "/build/")):
            exclusion_class = "dependency-cache-or-generated-build"
            reason = "tracked dependency, cache, or generated-build surface explicitly excluded from the asset pantry"
        else:
            unexpected_media.append(path)
            continue
        explicitly_excluded_media.append({"path": path, "exclusionClass": exclusion_class, "reason": reason})

    if unexpected_media:
        raise RuntimeError(
            "Unexpected tracked media outside governed roots: " + ", ".join(unexpected_media)
        )
    output = {
        "schemaVersion": "0.1",
        "auditId": "tga-public-asset-license-audit-2026-07-29",
        "generatedAt": "2026-07-29",
        "repository": "Pantheon-LadderWorks/tiny-goblin-academy",
        "baselineCommit": audit_baseline["head"],
        "scope": {
            "unit": "coherent asset pack or family with per-file path and hash coverage",
            "assetPayloadCount": len(asset_paths),
            "evidencePolicy": "H5/H6 evidence is supporting lineage only and is not counted as independent pantry assets.",
            "excluded": ["node_modules", "package caches", "external heavy evidence", "H5/H6 screenshots, captures, contact sheets, and recordings except as provenance references"],
        },
        "globalMediaCensus": {
            "totalTrackedMediaCandidates": len(all_media_paths),
            "canonicalAssetPayloads": len(inventoried_paths),
            "excludedEvidencePayloads": sum(item["exclusionClass"] == "supporting-evidence" for item in explicitly_excluded_media),
            "otherExplicitlyExcludedMedia": sum(item["exclusionClass"] != "supporting-evidence" for item in explicitly_excluded_media),
            "excludedMediaPayloads": len(explicitly_excluded_media),
            "explicitlyExcludedMedia": explicitly_excluded_media,
            "unexpectedTrackedMedia": unexpected_media,
        },
        "classificationFieldsRemainIndependent": ["legal permission", "provenance completeness", "technical readiness", "runtime approval", "Human approval"],
        "records": ordered_records,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"output": OUTPUT.relative_to(REPO).as_posix(), "assetPayloads": len(asset_paths), "records": len(ordered_records), "unassigned": len(unassigned)}, indent=2))


if __name__ == "__main__":
    main()
