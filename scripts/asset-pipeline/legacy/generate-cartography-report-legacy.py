# Legacy asset census/cartography tool.
# Retained for reference during H5 asset pipeline migration.
# Not the active source of truth for runtime manifests.
# Do not run as part of default validation without explicit approval.

import json
import os

with open('metadata_dump.json', 'r') as f:
    assets = json.load(f)

# Rules for classification based on path/name
def classify(a):
    path = a['repo_path'].replace('\\', '/')
    name = a['filename']
    
    # Defaults
    family = "Unknown"
    op_type = "uncertain-operational-type"
    lifecycle = "concept"
    readiness = ["metadata-inspected", "alpha-inspected", "needs-cleanup", "needs-manifest", "needs-evidence", "needs-human-review"]
    manifest = "uncertain"
    evidence = ["source-metadata-json", "alpha-preview", "dark-background-preview"]
    review = ["visual-quality-review", "transparency-cleanup-review"]
    risk = "medium"
    next_action = "planning"
    notes = ""

    if "itch-cover" in name or "readme-banner" in name:
        family = "Readme / Public Branding Art"
        op_type = "readme-branding-art"
        lifecycle = "integrated"
        readiness = ["runtime-ready"]
        manifest = "none-yet"
        evidence = ["none-yet"]
        review = ["none-yet"]
        risk = "low"
        next_action = "none"

    elif "branding/icon-source" in path:
        family = "Branding / Icon Source"
        op_type = "branding-icon-source"
        lifecycle = "registered"
        readiness = ["source-only"]
        manifest = "favicon-export-manifest"
        evidence = ["favicon-size-preview-sheet"]
        review = ["favicon-legibility-review"]
        risk = "low"
        next_action = "favicon/app icon export pipeline plan"
        notes = "No favicon outputs yet"

    elif "creatures/goblin" in path:
        family = "Goblin Creature Sheets"
        op_type = "character-animation-sheet"
        manifest = "animation-manifest"
        evidence += ["animation-contact-sheet", "animation-sequence-preview"]
        review += ["semantic-label-review", "animation-sequence-review", "pivot-hitbox-review"]
        readiness += ["needs-semantic-labeling", "needs-animation-arrays", "needs-pivots", "needs-hitboxes"]
        risk = "high"
        next_action = "animation cleanup pilot"

    elif "creatures/slime" in path:
        family = "Slime Creature Sheets"
        op_type = "character-animation-sheet"
        manifest = "animation-manifest"
        evidence += ["animation-contact-sheet", "animation-sequence-preview"]
        review += ["semantic-label-review", "animation-sequence-review", "pivot-hitbox-review"]
        readiness += ["needs-semantic-labeling", "needs-animation-arrays", "needs-pivots", "needs-hitboxes"]
        risk = "high"
        next_action = "animation cleanup pilot"

    elif "creatures/soldier" in path:
        family = "Soldier / Enemy Sheets"
        op_type = "enemy-animation-sheet"
        manifest = "animation-manifest"
        evidence += ["animation-contact-sheet", "animation-sequence-preview"]
        review += ["semantic-label-review", "animation-sequence-review", "pivot-hitbox-review"]
        readiness += ["needs-semantic-labeling", "needs-animation-arrays", "needs-pivots", "needs-hitboxes"]
        risk = "high"
        next_action = "animation cleanup pilot"

    elif "creatures/training-dummy" in path:
        family = "Training Dummy Sheets"
        op_type = "enemy-animation-sheet"
        manifest = "animation-manifest"
        evidence += ["animation-contact-sheet", "animation-sequence-preview"]
        review += ["semantic-label-review", "animation-sequence-review", "pivot-hitbox-review"]
        readiness += ["needs-semantic-labeling", "needs-animation-arrays", "needs-pivots", "needs-hitboxes"]
        risk = "high"
        next_action = "animation cleanup pilot"

    elif "games/card-goblin-duel" in path:
        family = "Game 04 Card Goblin Duel"
        op_type = "ui-icon-sheet"
        manifest = "regions-manifest"
        evidence += ["bbox-overlay", "numbered-contact-sheet", "candidate-regions-json"]
        review += ["semantic-label-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "low"
        next_action = "cleanup and region detection pilot"

    elif "games/dice-duel-tavern" in path:
        family = "Game 03 Dice Duel Tavern"
        op_type = "static-prop-sheet"
        manifest = "regions-manifest"
        evidence += ["bbox-overlay", "numbered-contact-sheet", "candidate-regions-json"]
        review += ["semantic-label-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "low"
        next_action = "cleanup and region detection pilot"

    elif "games/dungeon-platformer" in path:
        family = "Game 05 Dungeon / Platformer Mixed"
        op_type = "mixed-sheet"
        manifest = "regions-manifest"
        evidence += ["bbox-overlay", "numbered-contact-sheet", "candidate-regions-json"]
        review += ["semantic-label-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "medium"
        next_action = "cleanup and region detection pilot"

    elif "games/farm-settlement" in path:
        family = "Game 06 / Game 10 Farm Settlement"
        op_type = "tile-sheet"
        manifest = "tile-terrain-manifest"
        evidence += ["tile-alignment-preview"]
        review += ["semantic-label-review", "tile-alignment-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "medium"
        next_action = "cleanup and region detection pilot"

    elif "games/one-room-platformer/tga-one-room-platformer-background" in path:
        family = "Game 08 One-Room Platformer"
        op_type = "scene-anchor-background"
        manifest = "scene-anchor-manifest"
        evidence = ["source-metadata-json", "scene-anchor-overlay", "runtime-integration-screenshot"]
        review = ["scene-anchor-placement-review", "visual-quality-review"]
        readiness = ["source-only", "needs-anchors", "needs-evidence", "needs-human-review"]
        risk = "low"
        next_action = "background prep + anchor manifest planning"
        notes = "No sprite detection"
        lifecycle = "registered"
    
    elif "games/one-room-platformer" in path:
        family = "Game 08 One-Room Platformer"
        op_type = "platform-construction-sheet"
        manifest = "platform-construction-manifest"
        evidence += ["tile-alignment-preview"]
        review += ["semantic-label-review", "tile-alignment-review"]
        readiness += ["needs-semantic-labeling", "needs-anchors"]
        risk = "medium"
        next_action = "cleanup and region detection pilot"

    elif "games/pet-campfire/backgrounds" in path:
        family = "Game 07 Pet Campfire"
        op_type = "background-stage"
        lifecycle = "registered"
        readiness = ["source-only", "needs-anchors", "needs-evidence", "needs-human-review"]
        manifest = "scene-anchor-manifest"
        evidence = ["source-metadata-json", "scene-anchor-overlay", "runtime-integration-screenshot"]
        review = ["scene-anchor-placement-review", "visual-quality-review"]
        next_action = "background prep + anchor manifest planning"
        notes = "No sprite detection"
        risk = "low"

    elif "games/pet-campfire" in path:
        family = "Game 07 Pet Campfire"
        op_type = "pet-animation-sheet"
        manifest = "animation-manifest"
        evidence += ["animation-contact-sheet", "animation-sequence-preview"]
        review += ["semantic-label-review", "animation-sequence-review", "pivot-hitbox-review"]
        readiness += ["needs-semantic-labeling", "needs-animation-arrays", "needs-pivots", "needs-hitboxes"]
        risk = "high"
        next_action = "animation cleanup pilot"

    elif "games/potion-sorter" in path:
        family = "Game 02 Potion Sorter"
        op_type = "static-prop-sheet"
        manifest = "regions-manifest"
        evidence += ["bbox-overlay", "numbered-contact-sheet", "candidate-regions-json"]
        review += ["semantic-label-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "low"
        next_action = "cleanup and region detection pilot"
        
    elif "games/top-down-slime-quest" in path:
        family = "Game 09 Top-Down Slime Quest"
        op_type = "tile-sheet"
        manifest = "tile-terrain-manifest"
        evidence += ["tile-alignment-preview"]
        review += ["semantic-label-review", "tile-alignment-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "medium"
        next_action = "cleanup and region detection pilot"

    elif "hub/banner" in path:
        family = "Hub Banner"
        op_type = "hub-banner-source"
        lifecycle = "registered"
        readiness = ["source-only"]
        manifest = "boot-asset-manifest"
        evidence = ["banner-responsive-preview"]
        review = ["banner-responsive-review", "visual-quality-review"]
        risk = "low"
        next_action = "hub banner cleanup + responsive integration plan"
        notes = "no hub wiring yet"

    elif "hub/derived" in path:
        family = "Hub Icons"
        op_type = "derived-cleaned-sheet"
        if "transparent" in name:
            lifecycle = "integrated"
            readiness = ["runtime-ready"]
            manifest = "hub-icon-source-region-manifest"
            evidence = ["none-yet"]
            review = ["none-yet"]
            next_action = "none"
            risk = "low"
        else:
            lifecycle = "derived-candidate"
            readiness = ["needs-human-review"]
            manifest = "hub-icon-source-region-manifest"
            evidence = ["cleaned-candidate-preview"]
            review = ["transparency-cleanup-review"]
            next_action = "human review"
            risk = "low"

    elif "hub" in path:
        family = "Hub Icons"
        op_type = "hub-icon-sheet"
        lifecycle = "reviewed"
        manifest = "hub-icon-source-region-manifest"
        evidence = ["candidate-regions-json"]
        review = ["visual-quality-review"]
        readiness = ["mapped-only"]
        next_action = "none"
        risk = "low"

    elif "shared-core" in path:
        family = "Shared Academy Core"
        op_type = "static-prop-sheet"
        manifest = "regions-manifest"
        evidence += ["bbox-overlay", "numbered-contact-sheet", "candidate-regions-json"]
        review += ["semantic-label-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "low"
        next_action = "cleanup and region detection pilot"

    elif "shared-fx" in path:
        family = "Shared FX / Feedback"
        op_type = "fx-sheet"
        manifest = "regions-manifest"
        evidence += ["bbox-overlay", "numbered-contact-sheet", "candidate-regions-json", "animation-sequence-preview"]
        review += ["semantic-label-review", "animation-sequence-review"]
        readiness += ["needs-semantic-labeling", "needs-animation-arrays"]
        risk = "medium"
        next_action = "cleanup and region detection pilot"

    elif "topdown/objects" in path:
        family = "Top-down Terrain / Walls / Objects"
        op_type = "static-prop-sheet"
        manifest = "regions-manifest"
        evidence += ["bbox-overlay", "numbered-contact-sheet", "candidate-regions-json"]
        review += ["semantic-label-review", "pivot-hitbox-review"]
        readiness += ["needs-semantic-labeling", "needs-pivots", "needs-hitboxes"]
        risk = "low"
        next_action = "cleanup and region detection pilot"

    elif "topdown/terrain" in path:
        family = "Top-down Terrain / Walls / Objects"
        op_type = "terrain-sheet"
        manifest = "tile-terrain-manifest"
        evidence += ["tile-alignment-preview"]
        review += ["semantic-label-review", "tile-alignment-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "medium"
        next_action = "cleanup and region detection pilot"

    elif "topdown/walls" in path:
        family = "Top-down Terrain / Walls / Objects"
        op_type = "wall-boundary-sheet"
        manifest = "wall-boundary-manifest"
        evidence += ["tile-alignment-preview"]
        review += ["semantic-label-review", "tile-alignment-review"]
        readiness += ["needs-semantic-labeling"]
        risk = "medium"
        next_action = "cleanup and region detection pilot"

    elif "academy_review" in path:
        family = "Academy Review Candidates"
        op_type = "review-candidate"
        lifecycle = "review-candidate"
        manifest = "uncertain"
        evidence = ["none-yet"]
        review = ["visual-quality-review"]
        readiness = ["needs-human-review"]
        risk = "low"
        next_action = "human review"

    elif "studio/glyphforge-games" in path:
        family = "Studio / Boot Assets"
        op_type = "boot-studio-art"
        manifest = "boot-asset-manifest"
        evidence = ["runtime-integration-screenshot"]
        review = ["visual-quality-review", "runtime-integration-review"]
        readiness = ["metadata-inspected", "needs-evidence", "needs-human-review"]
        risk = "low"
        next_action = "integration planning"
        
    return {
        "repo_path": a['repo_path'],
        "asset_family": family,
        "operational_asset_type": op_type,
        "lifecycle_state": lifecycle,
        "readiness_state": readiness,
        "width": a['width'],
        "height": a['height'],
        "image_mode": a['mode'],
        "alpha_transparency_state": a['alpha_state_detected'],
        "fake_transparency_risk": "high" if risk == "high" else ("medium" if risk == "medium" else "low"),
        "required_manifest_contract": manifest,
        "required_evidence": evidence,
        "required_human_review_type": review,
        "runtime_eligibility": "eligible" if "runtime-ready" in readiness else "not eligible",
        "next_safe_action": next_action,
        "risk_level": risk,
        "notes": notes
    }

classified_assets = [classify(a) for a in assets]

with open('docs/assets/TINY_GOBLIN_ACADEMY_H4_0_OPERATIONAL_ASSET_CARTOGRAPHY.json', 'w', encoding='utf-8') as f:
    json.dump({"schemaVersion": "0.1.0", "censusScope": "assets/", "assets": classified_assets}, f, indent=2)

md = '''# Tiny Goblin Academy H4.0 Operational Asset Cartography

* **Task Name:** H4.0 - Operational Asset Cartography Census
* **Baseline Commit SHA:** 4e53441 fix: reconcile academy manifest validation
* **Validator Baseline:** Passed (cademy.games.json, hub.icon-regions.json)

## Asset Doctrine Summary
* Source art must never be overwritten.
* Source/concept assets are pantry inputs, not runtime truth.
* No sheet goes directly into a game or hub without manifest/planning/evidence.
* Background-stage assets are not sprite-detected.
* Animation sheets are dangerous cleanup candidates and need pilot review.
* Hub icon regions currently have the strongest implemented manifest/crop pattern.
* This census classifies and plans future tasks; no assets were modified.

## Census Scope
Inspected ssets/ including cademy, studio, and cademy_review directories. Checked {count} images via metadata script (width, height, mode, alpha presence/range, size, fake transparency risk).

## Operational Taxonomy Legend
* **Asset Families:** Shared Academy Core, UI / HUD, Hub Icons, Hub Banner, Branding / Icon Source, Studio / Boot Assets, Goblin Creature Sheets, Slime Creature Sheets, Soldier / Enemy Sheets, Training Dummy Sheets, Game 02 Potion Sorter, Game 03 Dice Duel Tavern, Game 04 Card Goblin Duel, Game 05 Dungeon / Platformer Mixed, Game 06 / Game 10 Farm Settlement, Game 07 Pet Campfire, Game 08 One-Room Platformer, Game 09 Top-Down Slime Quest, Shared FX / Feedback, Top-down Terrain / Walls / Objects, Academy Review Candidates, Readme / Public Branding Art.
* **Operational Asset Types:** background-stage, scene-anchor-background, ui-icon-sheet, hub-icon-sheet, hub-banner-source, branding-icon-source, static-prop-sheet, tile-sheet, terrain-sheet, wall-boundary-sheet, platform-construction-sheet, character-animation-sheet, enemy-animation-sheet, pet-animation-sheet, fx-sheet, mixed-sheet, review-candidate, derived-cleaned-sheet, runtime-approved-sheet, boot-studio-art, readme-branding-art.
* **Manifest Contract:** none-yet, regions-manifest, animation-manifest, scene-anchor-manifest, tile-terrain-manifest, wall-boundary-manifest, platform-construction-manifest, runtime-asset-registry, candidate-regions-manifest, reviewed-regions-manifest, hub-icon-source-region-manifest, favicon-export-manifest, boot-asset-manifest, uncertain.
* **Lifecycle State:** source, concept, registered, review-candidate, derived-candidate, mapped-candidate, reviewed, runtime-approved, integrated, deprecated-archive, unknown.
* **Readiness State:** source-only, concept-only, registered-only, metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-semantic-labeling, needs-animation-arrays, needs-anchors, needs-pivots, needs-hitboxes, needs-evidence, needs-human-review, mapped-only, runtime-ready, integrated, blocked, unknown.
* **Evidence Type:** source-metadata-json, alpha-preview, dark-background-preview, cleaned-candidate-preview, cleaned-alpha-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json, human-reviewed-regions-json, animation-contact-sheet, animation-sequence-preview, scene-anchor-overlay, tile-alignment-preview, runtime-integration-screenshot, favicon-size-preview-sheet, banner-responsive-preview, none-yet, uncertain.
* **Human Review Type:** visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review, scene-anchor-placement-review, tile-alignment-review, runtime-integration-review, favicon-legibility-review, banner-responsive-review, none-yet, uncertain.

## Summary Counts by Asset Family
'''.replace('{count}', str(len(classified_assets)))

families = {}
op_types = {}
for a in classified_assets:
    families[a['asset_family']] = families.get(a['asset_family'], 0) + 1
    op_types[a['operational_asset_type']] = op_types.get(a['operational_asset_type'], 0) + 1

for k, v in families.items():
    md += f"* {k}: {v}\n"

md += "\n## Summary Counts by Operational Asset Type\n"
for k, v in op_types.items():
    md += f"* {k}: {v}\n"

md += "\n## Recommended Next Prompt Sequence\n"
md += "1. H4.1 Hub Banner Cleanup + Responsive Integration Plan\n"
md += "2. H4.2 App Icon / Favicon Export Pipeline Plan\n"
md += "3. H4.3 Pet Campfire Background Prep + Scene Anchor Manifest Plan\n"
md += "4. H4.4 Hub Visual Shell Modular Component Plan\n"
md += "5. H4.5 First Static Sheet Pilot: choose one low-risk static sheet\n"
md += "6. H4.6 Evidence Tooling: metadata, alpha preview, dark-bg preview, bbox overlay, numbered contact sheet\n"
md += "7. H4.7 Character Animation Sheet Pilot: only after evidence tooling exists\n"

md += "\n## Explicit Confirmation (Not Done)\n"
md += "* No image pixels modified.\n"
md += "* No images cropped/resized/compressed.\n"
md += "* No derived assets created.\n"
md += "* No favicon exports created.\n"
md += "* No hub/game wiring added.\n"
md += "* No runtime behavior changed.\n"
md += "* No CodeCraft Native changes.\n"

md += "\n## Asset Table\n"
md += "| Repo Path | Family | Op Type | Lifecycle | Readiness | Dimensions | Alpha State | Fake Trans. Risk | Manifest Contract | Evidence | Review | Runtime Elig. | Next Action | Risk | Notes |\n"
md += "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
for a in classified_assets:
    md += f"| {a['repo_path']} | {a['asset_family']} | {a['operational_asset_type']} | {a['lifecycle_state']} | {', '.join(a['readiness_state'])} | {a['width']}x{a['height']} | {a['alpha_transparency_state']} | {a['fake_transparency_risk']} | {a['required_manifest_contract']} | {', '.join(a['required_evidence'])} | {', '.join(a['required_human_review_type'])} | {a['runtime_eligibility']} | {a['next_safe_action']} | {a['risk_level']} | {a['notes']} |\n"

with open('docs/assets/TINY_GOBLIN_ACADEMY_H4_0_OPERATIONAL_ASSET_CARTOGRAPHY.md', 'w', encoding='utf-8') as f:
    f.write(md)

print("Report created successfully.")
