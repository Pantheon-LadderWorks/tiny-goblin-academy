# Dungeon Key Run private actor overlay v0.1

Status: implemented local-development pilot. Ruin Hall, Hub Ledger publication, and the Patrol Tension readability treatment are active.

## Selected architecture

GlyphForge owns the ignored restricted runtime bundle. TGA deterministically materializes a verified copy into:

```text
games/tier-1/05-dungeon-key-run/public/__private_runtime__/dungeon-key-actors/
```

That projection is explicitly ignored, disposable, and reproducible. Vite serves it in development and copies it into generated static output, so the same relative URLs are compatible with the local Tauri-hosted game surface. Game source contains no GlyphForge filesystem path.

The game Vite config removes only `dist/__private_runtime__` before every build. This prevents an earlier private build from leaking stale actor strips into a later fallback build; a currently materialized valid projection is then copied back normally by Vite.

Direct external mounting was rejected because Vite filesystem exposure and static/Tauri packaging would diverge. Build-only injection was rejected because development would need a separate mechanism. `.private-review` remains evidence and is never consumed.

## Local commands

Generate the private bundle in GlyphForge first. Then, from the TGA root:

```powershell
$env:TGA_DUNGEON_KEY_ACTOR_OVERLAY = '<path-to-generated-private-overlay-root>'
node tools/private-overlays/dungeon-key-actor-overlay.mjs materialize
node tools/private-overlays/dungeon-key-actor-overlay.mjs verify
pnpm --filter tga-05-dungeon-key-run build
node tools/private-overlays/dungeon-key-actor-overlay.mjs clean
```

`TGA_DUNGEON_KEY_ACTOR_OVERLAY` is local configuration and must not be committed. The source may be the overlay directory or its `manifest.json`.

## Resolver states

- `available`: both actors, all 16 strips, authority, and hashes passed.
- `fallback-active`: private actors are absent or the complete bundle was rejected.
- fallback reasons: `missing`, `invalid-manifest`, `hash-mismatch`, `unsupported-version`.

The resolver never accepts one actor alone and never downloads private art. Without the overlay, the existing code-native player/enemy markers remain functional. The isolated `overlay-proof.html` fixture reports developer status without adding licensing chrome to the game face.

## Distribution boundary

The local static build proof shows path compatibility, not permission to publish a finished package containing CraftPix derivatives. Public-source redistribution, public export, and finished-package release remain unapproved by this pilot.
