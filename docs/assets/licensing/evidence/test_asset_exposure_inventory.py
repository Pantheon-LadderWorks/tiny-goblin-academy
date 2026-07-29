"""Regression contracts for the public asset exposure inventory."""

from __future__ import annotations

import json
import subprocess
import unittest
from pathlib import Path, PurePosixPath


REPO = Path(__file__).resolve().parents[4]
BUILDER = REPO / "docs/assets/licensing/evidence/build_asset_exposure_inventory.py"
INVENTORY = REPO / "docs/assets/licensing/TGA_PUBLIC_ASSET_EXPOSURE_INVENTORY.json"
BASELINE = REPO / "docs/assets/licensing/evidence/audit-baseline.json"
MEDIA_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".icns",
    ".ttf", ".otf", ".woff", ".woff2", ".wav", ".mp3", ".ogg", ".webm",
    ".mp4", ".zip",
}


class AssetExposureInventoryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        subprocess.run(["python", str(BUILDER)], cwd=REPO, check=True, capture_output=True, text=True)
        cls.inventory = json.loads(INVENTORY.read_text(encoding="utf-8"))

    def test_reference_categories_keep_nonproduction_surfaces_out_of_runtime(self) -> None:
        """Catches evidence, tests, captures, or docs being counted as production use."""
        required = {
            "productionRuntimeReferences",
            "testFixtureReferences",
            "evidenceAndCaptureReferences",
            "documentationReferences",
        }
        for record in self.inventory["records"]:
            for asset_file in record["files"]:
                self.assertTrue(required.issubset(asset_file), asset_file["path"])
                self.assertNotIn("runtimeReferenceObserved", asset_file)
                self.assertNotIn("runtimeReferencePaths", asset_file)
                for reference in asset_file["productionRuntimeReferences"]:
                    normalized = "/" + reference.lower()
                    self.assertNotIn("/evidence/", normalized)
                    self.assertNotIn("/tests/", normalized)
                    self.assertNotIn("capture", normalized)
                    self.assertFalse(reference.startswith("docs/"), reference)

    def test_inventory_uses_recorded_audit_baseline_not_current_head(self) -> None:
        """Catches regeneration changing the inventory merely because the audit was committed."""
        baseline = json.loads(BASELINE.read_text(encoding="utf-8"))
        self.assertEqual(baseline["head"], self.inventory["baselineCommit"])

    def test_audit_packet_does_not_count_its_own_documentation_references(self) -> None:
        """Catches the committed audit changing the pre-audit reference census."""
        for record in self.inventory["records"]:
            for asset in record["files"]:
                self.assertFalse(
                    any(
                        reference.startswith("docs/assets/licensing/")
                        for reference in asset["documentationReferences"]
                    ),
                    asset["path"],
                )

    def test_global_media_census_accounts_for_every_tracked_candidate(self) -> None:
        """Catches a media file outside canonical roots escaping both inventory and exclusions."""
        tracked = subprocess.check_output(
            ["git", "ls-files"], cwd=REPO, text=True, encoding="utf-8"
        ).splitlines()
        media = {
            path
            for path in tracked
            if PurePosixPath(path).suffix.lower() in MEDIA_EXTENSIONS
        }
        census = self.inventory["globalMediaCensus"]
        inventoried = {
            item["path"]
            for record in self.inventory["records"]
            for item in record["files"]
        }
        excluded = {item["path"] for item in census["explicitlyExcludedMedia"]}
        unexpected = set(census["unexpectedTrackedMedia"])
        self.assertEqual(media, inventoried | excluded | unexpected)
        self.assertFalse(inventoried & excluded)
        self.assertFalse(inventoried & unexpected)
        self.assertEqual(census["totalTrackedMediaCandidates"], len(media))
        self.assertEqual(census["canonicalAssetPayloads"], len(inventoried))
        self.assertEqual(census["excludedMediaPayloads"], len(excluded))
        self.assertEqual([], census["unexpectedTrackedMedia"])
        for item in census["explicitlyExcludedMedia"]:
            self.assertTrue(item["reason"].strip(), item["path"])
            self.assertTrue(item["exclusionClass"].strip(), item["path"])
        supporting_evidence = sum(
            item["exclusionClass"] == "supporting-evidence"
            for item in census["explicitlyExcludedMedia"]
        )
        self.assertEqual(census["excludedEvidencePayloads"], supporting_evidence)
        self.assertEqual(
            census["otherExplicitlyExcludedMedia"], len(excluded) - supporting_evidence
        )


if __name__ == "__main__":
    unittest.main()
