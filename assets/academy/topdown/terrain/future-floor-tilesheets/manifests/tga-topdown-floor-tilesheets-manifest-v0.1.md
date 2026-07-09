# Tiny Goblin Academy — Topdown Floor Tilesheets Manifest v0.1

Scope: six 8×8 full-cell topdown ground/floor tilesheets. The road/path overlay sheet is intentionally excluded.

Runtime note: these are draft semantic labels for cataloging and generator vocabulary. They do **not** approve collision, pathfinding, hazard, portal, speed, trigger, loot, or other gameplay behavior. Marker/rune/glow-looking tiles are visual-only until separately approved.

Grid: 8 columns × 8 rows, 128 px cells, tile indices 1–64 left-to-right/top-to-bottom.

## Grass / Dirt Outdoor Ground (`terrain.grass-dirt.v0.1`)

Theme: outdoor grass, dirt, path, meadow, roots, light mud

### Row 1: primary grass base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 1 | 1 | plain grass | none-approved |
| 2 | 2 | light wild grass | none-approved |
| 3 | 3 | dark dense grass | none-approved |
| 4 | 4 | trampled grass patch | none-approved |
| 5 | 5 | tall grass | none-approved |
| 6 | 6 | mossy damp grass | none-approved |
| 7 | 7 | wildflower meadow grass | none-approved |
| 8 | 8 | rooty grass mat | none-approved |

### Row 2: dirt base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 9 | 1 | plain dirt | none-approved |
| 10 | 2 | light pebbled dirt | none-approved |
| 11 | 3 | cracked dry dirt | none-approved |
| 12 | 4 | dark damp dirt | none-approved |
| 13 | 5 | dense pebble dirt | none-approved |
| 14 | 6 | dark leaf-litter dirt | none-approved |
| 15 | 7 | dirt with grass invasion | none-approved |
| 16 | 8 | exposed root dirt | none-approved |

### Row 3: grass/dirt path shapes

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 17 | 1 | horizontal dirt path through grass | none-approved |
| 18 | 2 | vertical dirt path through grass | none-approved |
| 19 | 3 | dirt path corner | none-approved |
| 20 | 4 | curved dirt path | none-approved |
| 21 | 5 | round dirt clearing | none-approved |
| 22 | 6 | winding dirt path | none-approved |
| 23 | 7 | dirt path Y-fork | none-approved |
| 24 | 8 | dirt path T-junction | none-approved |

### Row 4: worn ground and noisy variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 25 | 1 | grass with bare patch | none-approved |
| 26 | 2 | grass with stone scatter | none-approved |
| 27 | 3 | grass with clover scatter | none-approved |
| 28 | 4 | baked cracked dirt | none-approved |
| 29 | 5 | rutted dirt track | none-approved |
| 30 | 6 | mixed grass and dirt | none-approved |
| 31 | 7 | gravelly dirt patch | none-approved |
| 32 | 8 | worn plain dirt | none-approved |

### Row 5: decorative ground detail tiles

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 33 | 1 | leaf litter ground | none-approved |
| 34 | 2 | dense wildflower patch | none-approved |
| 35 | 3 | pebble scatter dirt | none-approved |
| 36 | 4 | dry exposed roots | none-approved |
| 37 | 5 | mossy ground patch | none-approved |
| 38 | 6 | dense clover patch | none-approved |
| 39 | 7 | mixed flower grass | none-approved |
| 40 | 8 | muddy puddle dirt | none-approved |

### Row 6: terrain state candidates, visual-only

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 41 | 1 | wet grass mud | visual-only |
| 42 | 2 | muddy track | visual-only |
| 43 | 3 | thorny grass patch | visual-only |
| 44 | 4 | black wet mud | visual-only |
| 45 | 5 | cursed purple grass | visual-only |
| 46 | 6 | yellow mossy grass | visual-only |
| 47 | 7 | cracked drought dirt | visual-only |
| 48 | 8 | deep rutted dirt | visual-only |

### Row 7: path readability and landmarks

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 49 | 1 | vertical path strip | none-approved |
| 50 | 2 | curving path strip | none-approved |
| 51 | 3 | crossroad path | none-approved |
| 52 | 4 | dead-end path circle | none-approved |
| 53 | 5 | large dirt clearing | none-approved |
| 54 | 6 | small scorch marker clearing | none-approved |
| 55 | 7 | pebble spiral marker | none-approved |
| 56 | 8 | narrow worn path | none-approved |

### Row 8: reserve / extra ground variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 57 | 1 | flower field grass | none-approved |
| 58 | 2 | grass with rocks | none-approved |
| 59 | 3 | trampled grass dirt | none-approved |
| 60 | 4 | bright moss ground | none-approved |
| 61 | 5 | sandy dirt | none-approved |
| 62 | 6 | rooty moss ground | none-approved |
| 63 | 7 | cobblestone patch | none-approved |
| 64 | 8 | clean packed dirt | none-approved |

## Stone Ruin / Dungeon Ground (`terrain.stone-ruin.v0.1`)

Theme: stone slabs, broken dungeon floor, moss, carved floor markers

### Row 1: clean stone base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 1 | 1 | large dark stone slabs | none-approved |
| 2 | 2 | offset large slab corner | none-approved |
| 3 | 3 | small cobble mosaic | none-approved |
| 4 | 4 | carved circular stone plate | none-approved |
| 5 | 5 | diamond pattern stone | none-approved |
| 6 | 6 | large slab grid | none-approved |
| 7 | 7 | cracked tile grid | none-approved |
| 8 | 8 | shattered stone slab | none-approved |

### Row 2: cracked and broken stone

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 9 | 1 | branching cracked stone | none-approved |
| 10 | 2 | star cracked slab | none-approved |
| 11 | 3 | broken mosaic stone | none-approved |
| 12 | 4 | circular cracked stone | none-approved |
| 13 | 5 | stone with gravel pocket | none-approved |
| 14 | 6 | small cracked cobble | none-approved |
| 15 | 7 | rubble-filled cracks | none-approved |
| 16 | 8 | broken flagstone | none-approved |

### Row 3: mossy stone variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 17 | 1 | mossy large slabs | none-approved |
| 18 | 2 | mossy slab patch | none-approved |
| 19 | 3 | mossy cobble floor | none-approved |
| 20 | 4 | mossy round pattern | none-approved |
| 21 | 5 | missing slab with moss | none-approved |
| 22 | 6 | mossy cobble scatter | none-approved |
| 23 | 7 | mossy diamond pattern | none-approved |
| 24 | 8 | mossy crossed pattern | none-approved |

### Row 4: dark dungeon stone

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 25 | 1 | dark wet slabs | none-approved |
| 26 | 2 | black cracked stone | none-approved |
| 27 | 3 | dark small cobble | none-approved |
| 28 | 4 | dark circular plate | none-approved |
| 29 | 5 | dark missing slab moss | none-approved |
| 30 | 6 | muddy dark stone | none-approved |
| 31 | 7 | broken dark mosaic | none-approved |
| 32 | 8 | dark tile grid | none-approved |

### Row 5: dirt-stone mixed ruin floor

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 33 | 1 | dirt and stone mixed edge | none-approved |
| 34 | 2 | dirt cracked slab | none-approved |
| 35 | 3 | dirt small cobble | none-approved |
| 36 | 4 | mossy dirt cobble | none-approved |
| 37 | 5 | tilted broken slabs | none-approved |
| 38 | 6 | large rubble tile | none-approved |
| 39 | 7 | cracked dirt stone | none-approved |
| 40 | 8 | old worn stone floor | none-approved |

### Row 6: rubble and collapse variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 41 | 1 | large rubble scatter | none-approved |
| 42 | 2 | broken slab rubble | none-approved |
| 43 | 3 | rubble ring center | none-approved |
| 44 | 4 | circular pit floor | none-approved |
| 45 | 5 | dark gravel scatter | none-approved |
| 46 | 6 | jagged rubble | none-approved |
| 47 | 7 | cracked earth stone | none-approved |
| 48 | 8 | raised broken ledge | none-approved |

### Row 7: carved marker tiles, visual-only

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 49 | 1 | carved knot tile | visual-only |
| 50 | 2 | rune tablet tile | visual-only |
| 51 | 3 | compass circle tile | visual-only |
| 52 | 4 | diamond rune tile | visual-only |
| 53 | 5 | zodiac circle tile | visual-only |
| 54 | 6 | spiral rune tile | visual-only |
| 55 | 7 | maze carving tile | visual-only |
| 56 | 8 | compass star tile | visual-only |

### Row 8: extra ruin floor variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 57 | 1 | vertical old cobble | none-approved |
| 58 | 2 | rounded pebble cobble | none-approved |
| 59 | 3 | mossy cobble path | none-approved |
| 60 | 4 | warm mossy stone | none-approved |
| 61 | 5 | scattered ruin stone | none-approved |
| 62 | 6 | leaf-litter stone | none-approved |
| 63 | 7 | plain worn slab | none-approved |
| 64 | 8 | tan slab floor | none-approved |

## Wood / Indoor Ground (`terrain.wood-indoor.v0.1`)

Theme: wood plank floors, parquet, rugs, stone/wood threshold variants

### Row 1: light wood base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 1 | 1 | light horizontal planks | none-approved |
| 2 | 2 | light vertical planks | none-approved |
| 3 | 3 | clean horizontal planks | none-approved |
| 4 | 4 | clean vertical planks | none-approved |
| 5 | 5 | light herringbone parquet | none-approved |
| 6 | 6 | light chevron parquet | none-approved |
| 7 | 7 | mixed board corner panel | none-approved |
| 8 | 8 | light diagonal planks | none-approved |

### Row 2: dark wood base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 9 | 1 | dark wide planks | none-approved |
| 10 | 2 | dark aged planks | none-approved |
| 11 | 3 | dark patched planks | none-approved |
| 12 | 4 | dark cracked planks | none-approved |
| 13 | 5 | amber dark planks | none-approved |
| 14 | 6 | nailed plank floor | none-approved |
| 15 | 7 | scuffed plank floor | none-approved |
| 16 | 8 | dark repair patch floor | none-approved |

### Row 3: decorative wood panels

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 17 | 1 | warm horizontal planks | none-approved |
| 18 | 2 | warm vertical planks | none-approved |
| 19 | 3 | framed rectangular planks | none-approved |
| 20 | 4 | square parquet center | none-approved |
| 21 | 5 | framed square panel | none-approved |
| 22 | 6 | warm herringbone panel | none-approved |
| 23 | 7 | warm parquet square | none-approved |
| 24 | 8 | purple dark parquet | none-approved |

### Row 4: wood and stone mixed floors

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 25 | 1 | wood with stone side border | none-approved |
| 26 | 2 | decorative stone wood inlay | none-approved |
| 27 | 3 | wood floor with stone frame | none-approved |
| 28 | 4 | framed herringbone stone | none-approved |
| 29 | 5 | gray stone threshold | none-approved |
| 30 | 6 | stone strip with wood side | none-approved |
| 31 | 7 | checkered wood stone | none-approved |
| 32 | 8 | planks with stone side | none-approved |

### Row 5: worn and damaged wood

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 33 | 1 | scratched planks | none-approved |
| 34 | 2 | nailed patch planks | none-approved |
| 35 | 3 | stained planks | none-approved |
| 36 | 4 | paint-splattered planks | none-approved |
| 37 | 5 | dirty scuffed planks | none-approved |
| 38 | 6 | footprint planks | none-approved |
| 39 | 7 | mossy edge planks | none-approved |
| 40 | 8 | broken plank floor | none-approved |

### Row 6: rug and carved floor markers, visual-only

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 41 | 1 | blue ornate rug tile | visual-only |
| 42 | 2 | red ornate rug tile | visual-only |
| 43 | 3 | green ornate rug tile | visual-only |
| 44 | 4 | purple ornate rug tile | visual-only |
| 45 | 5 | carved wooden compass | visual-only |
| 46 | 6 | carved wooden flower | visual-only |
| 47 | 7 | blue diamond rug tile | visual-only |
| 48 | 8 | white gold rug tile | visual-only |

### Row 7: framed indoor panels

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 49 | 1 | framed vertical plank panel | none-approved |
| 50 | 2 | polished vertical plank panel | none-approved |
| 51 | 3 | herringbone framed panel | none-approved |
| 52 | 4 | plain framed panel | none-approved |
| 53 | 5 | framed herringbone rectangle | none-approved |
| 54 | 6 | cross-braced wood panel | none-approved |
| 55 | 7 | clean planks with border | none-approved |
| 56 | 8 | warm plain panel | none-approved |

### Row 8: extra indoor variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 57 | 1 | dark wide wood extra | none-approved |
| 58 | 2 | old dark wood extra | none-approved |
| 59 | 3 | mossy planks | none-approved |
| 60 | 4 | metal patch planks | none-approved |
| 61 | 5 | mixed repaired planks | none-approved |
| 62 | 6 | scratched plank floor extra | none-approved |
| 63 | 7 | cobblestone border floor | none-approved |
| 64 | 8 | cracked stone corner floor | none-approved |

## Cave / Rock Ground (`terrain.cave-rock.v0.1`)

Theme: rock, gravel, wet cave floor, crystals, ore, cave paths

### Row 1: dark rock base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 1 | 1 | flat dark rock | none-approved |
| 2 | 2 | rounded rock patch | none-approved |
| 3 | 3 | large cracked rock | none-approved |
| 4 | 4 | dark gravel rock | none-approved |
| 5 | 5 | cracked dark slab | none-approved |
| 6 | 6 | spiral rock formation | none-approved |
| 7 | 7 | black pebble gravel | none-approved |
| 8 | 8 | cracked rock plate | none-approved |

### Row 2: dirt and gravel cave floor

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 9 | 1 | plain cave dirt | none-approved |
| 10 | 2 | rocky cave dirt | none-approved |
| 11 | 3 | dusty cave path | none-approved |
| 12 | 4 | mixed cave gravel | none-approved |
| 13 | 5 | dense pebble dirt | none-approved |
| 14 | 6 | light cave gravel | none-approved |
| 15 | 7 | golden gravel dirt | none-approved |
| 16 | 8 | dark gravel floor | none-approved |

### Row 3: wet cave variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 17 | 1 | wet mud stones | none-approved |
| 18 | 2 | damp gray rock | none-approved |
| 19 | 3 | small cave puddle | none-approved |
| 20 | 4 | wet cracked stone | none-approved |
| 21 | 5 | moss in rock cracks | none-approved |
| 22 | 6 | muddy rock mix | none-approved |
| 23 | 7 | wet brown stone | none-approved |
| 24 | 8 | water pool stone | none-approved |

### Row 4: deep dark stone variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 25 | 1 | dark rock plate | none-approved |
| 26 | 2 | shattered dark rock | none-approved |
| 27 | 3 | layered black rock | none-approved |
| 28 | 4 | blue-black rock | none-approved |
| 29 | 5 | slate strata floor | none-approved |
| 30 | 6 | jagged dark stone | none-approved |
| 31 | 7 | purple-tinted rock | none-approved |
| 32 | 8 | cracked dark edge | none-approved |

### Row 5: cracks and unstable floor

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 33 | 1 | cracked stone network | none-approved |
| 34 | 2 | branching cracks | none-approved |
| 35 | 3 | broken crack intersection | none-approved |
| 36 | 4 | cracked floor tiles | none-approved |
| 37 | 5 | pebbles in crack gap | none-approved |
| 38 | 6 | large cracked hole | none-approved |
| 39 | 7 | cave rubble edge | none-approved |
| 40 | 8 | gravel wall shadow | none-approved |

### Row 6: mineral and moss variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 41 | 1 | green luminous mineral floor | none-approved |
| 42 | 2 | blue crystal floor | none-approved |
| 43 | 3 | purple crystal floor | none-approved |
| 44 | 4 | gold ore floor | none-approved |
| 45 | 5 | mossy rock gravel | none-approved |
| 46 | 6 | pale moss stone | none-approved |
| 47 | 7 | green moss rocks | none-approved |
| 48 | 8 | turquoise mineral gravel | none-approved |

### Row 7: cave path variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 49 | 1 | vertical dirt cave path | none-approved |
| 50 | 2 | soft dirt cave path | none-approved |
| 51 | 3 | rocky dirt path | none-approved |
| 52 | 4 | pebble dirt path | none-approved |
| 53 | 5 | wide cave trail | none-approved |
| 54 | 6 | narrow cave trail | none-approved |
| 55 | 7 | packed cave trail | none-approved |
| 56 | 8 | rough cave trail | none-approved |

### Row 8: extra cave ground variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 57 | 1 | dark stone swirl | none-approved |
| 58 | 2 | black gravel extra | none-approved |
| 59 | 3 | white mineral patch | none-approved |
| 60 | 4 | slate floor extra | none-approved |
| 61 | 5 | rust ore patch | none-approved |
| 62 | 6 | blue-gray rock | none-approved |
| 63 | 7 | mud stone floor | none-approved |
| 64 | 8 | blue speckled crystal rock | none-approved |

## Swamp / Slime Ground (`terrain.swamp-slime.v0.1`)

Theme: marsh grass, mud, slime, bog water, roots, bubbles, strange corruption

### Row 1: swamp grass base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 1 | 1 | tall swamp grass | none-approved |
| 2 | 2 | sparse muddy grass | none-approved |
| 3 | 3 | dark marsh grass | none-approved |
| 4 | 4 | mossy pond scum | none-approved |
| 5 | 5 | moss water patches | none-approved |
| 6 | 6 | dark swamp grass | none-approved |
| 7 | 7 | algae bubble grass | none-approved |
| 8 | 8 | tangled swamp grass | none-approved |

### Row 2: mud and slime base variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 9 | 1 | plain swamp mud | none-approved |
| 10 | 2 | dark wet mud | none-approved |
| 11 | 3 | cracked swamp mud | none-approved |
| 12 | 4 | reed mud | none-approved |
| 13 | 5 | slimy puddle mud | none-approved |
| 14 | 6 | gravel mud | none-approved |
| 15 | 7 | mossy mud | none-approved |
| 16 | 8 | bubbling slime pool | none-approved |

### Row 3: mud path shapes

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 17 | 1 | vertical muddy path | none-approved |
| 18 | 2 | curving muddy path | none-approved |
| 19 | 3 | mud path corner | none-approved |
| 20 | 4 | narrow mud path | none-approved |
| 21 | 5 | mud clearing | none-approved |
| 22 | 6 | winding mud path | none-approved |
| 23 | 7 | mud path fork | none-approved |
| 24 | 8 | mud path T-junction | none-approved |

### Row 4: bog water and mixed swamp floor

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 25 | 1 | bog water patch | none-approved |
| 26 | 2 | algae water patch | none-approved |
| 27 | 3 | glowing moss patch | none-approved |
| 28 | 4 | wet cracked mud | none-approved |
| 29 | 5 | root tangle floor | none-approved |
| 30 | 6 | gravel moss floor | none-approved |
| 31 | 7 | wet pebbles floor | none-approved |
| 32 | 8 | muddy stones floor | none-approved |

### Row 5: details and bubble variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 33 | 1 | leaf litter swamp | none-approved |
| 34 | 2 | green slime bubbles | none-approved |
| 35 | 3 | pebble bog | none-approved |
| 36 | 4 | thick root floor | none-approved |
| 37 | 5 | plain green slime | none-approved |
| 38 | 6 | tan mushroom ring | none-approved |
| 39 | 7 | thick swamp reeds | none-approved |
| 40 | 8 | wet bog bubbles | none-approved |

### Row 6: corruption and hazard-looking tiles, visual-only

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 41 | 1 | plain muddy ground | visual-only |
| 42 | 2 | slimy root floor | visual-only |
| 43 | 3 | large slime bubbles | visual-only |
| 44 | 4 | purple corruption slime | visual-only |
| 45 | 5 | yellow slime flow | visual-only |
| 46 | 6 | magic sparkle marsh | visual-only |
| 47 | 7 | purple mushroom patch | visual-only |
| 48 | 8 | glowing slime cracks | visual-only |

### Row 7: swamp path and marker variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 49 | 1 | vertical mud trail | none-approved |
| 50 | 2 | curving mud trail | none-approved |
| 51 | 3 | rocky mud trail | none-approved |
| 52 | 4 | stepping-stone mud path | none-approved |
| 53 | 5 | mud swirl marker | none-approved |
| 54 | 6 | slime swirl marker | none-approved |
| 55 | 7 | bubble cluster marker | none-approved |
| 56 | 8 | muddy grass patch | none-approved |

### Row 8: extra slime and swamp variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 57 | 1 | dense slime mass | none-approved |
| 58 | 2 | slime roots and bubbles | none-approved |
| 59 | 3 | green bubble slime | none-approved |
| 60 | 4 | dark algae slime | none-approved |
| 61 | 5 | mud with green speckles | none-approved |
| 62 | 6 | slime pebble floor | none-approved |
| 63 | 7 | root net floor | none-approved |
| 64 | 8 | glowing mud rune marker | none-approved |

## Arcane Metal / Academy Tech Ground (`terrain.arcane-metal.v0.1`)

Theme: metal plates, vents, grates, glowing blue circuits, runes, machinery floor

### Row 1: clean metal plate bases

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 1 | 1 | riveted clean metal plate | none-approved |
| 2 | 2 | bronze clean metal plate | none-approved |
| 3 | 3 | octagonal metal plate | none-approved |
| 4 | 4 | worn steel plate | none-approved |
| 5 | 5 | worn copper plate | none-approved |
| 6 | 6 | plain circuit panel | none-approved |
| 7 | 7 | blue circuit square panel | none-approved |
| 8 | 8 | diamond metal panel | none-approved |

### Row 2: weathered metal variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 9 | 1 | scratched metal plate | none-approved |
| 10 | 2 | blue oxidized metal | none-approved |
| 11 | 3 | smoky burnished metal | none-approved |
| 12 | 4 | cracked metal plate | none-approved |
| 13 | 5 | dented metal plate | none-approved |
| 14 | 6 | dark dirty plate | none-approved |
| 15 | 7 | blue stained plate | none-approved |
| 16 | 8 | split riveted panel | none-approved |

### Row 3: arcane circuit markers, visual-only

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 17 | 1 | rune circle plate | visual-only |
| 18 | 2 | cross arcane circuit | visual-only |
| 19 | 3 | tri-node circle plate | visual-only |
| 20 | 4 | arcane square circle | visual-only |
| 21 | 5 | diamond node rune | visual-only |
| 22 | 6 | small blue node panel | visual-only |
| 23 | 7 | rune strip panel | visual-only |
| 24 | 8 | matrix rune panel | visual-only |

### Row 4: grates and vents

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 25 | 1 | square grate | none-approved |
| 26 | 2 | lattice grate | none-approved |
| 27 | 3 | vertical vent grate | none-approved |
| 28 | 4 | round vent grate | none-approved |
| 29 | 5 | honeycomb grate | none-approved |
| 30 | 6 | double lattice grate | none-approved |
| 31 | 7 | fine mesh grate | none-approved |
| 32 | 8 | turbine fan vent | none-approved |

### Row 5: industrial panels

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 33 | 1 | plain conduit plate | none-approved |
| 34 | 2 | control rod plate | none-approved |
| 35 | 3 | bolted rectangle panel | none-approved |
| 36 | 4 | diamond tread plate | none-approved |
| 37 | 5 | hatch ladder panel | none-approved |
| 38 | 6 | louvered vent panel | none-approved |
| 39 | 7 | angular metal panel | none-approved |
| 40 | 8 | plain circuitry panel | none-approved |

### Row 6: powered circuit floor, visual-only

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 41 | 1 | blue energy cross | visual-only |
| 42 | 2 | blue round energy node | visual-only |
| 43 | 3 | blue square energy node | visual-only |
| 44 | 4 | maze circuit panel | visual-only |
| 45 | 5 | blue track panel | visual-only |
| 46 | 6 | blue radial node | visual-only |
| 47 | 7 | branching blue circuit | visual-only |
| 48 | 8 | blue X-node circuit | visual-only |

### Row 7: damaged metal variants

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 49 | 1 | scratched steel floor | none-approved |
| 50 | 2 | bullet-dented plate | none-approved |
| 51 | 3 | cracked metal floor | none-approved |
| 52 | 4 | claw-scratched plate | none-approved |
| 53 | 5 | pockmarked plate | none-approved |
| 54 | 6 | scuffed metal plate | none-approved |
| 55 | 7 | slashed metal plate | none-approved |
| 56 | 8 | diamond tread metal | none-approved |

### Row 8: directional and core markers, visual-only

| Index | Column | Draft name | Runtime behavior |
|---:|---:|---|---|
| 57 | 1 | chevron arrow panel | visual-only |
| 58 | 2 | powered bridge panel | visual-only |
| 59 | 3 | industrial strip panel | visual-only |
| 60 | 4 | central power line panel | visual-only |
| 61 | 5 | circular rune core | visual-only |
| 62 | 6 | octagonal rune core | visual-only |
| 63 | 7 | gear rune core | visual-only |
| 64 | 8 | diamond rune core | visual-only |
