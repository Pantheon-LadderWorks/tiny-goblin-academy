(() => {
  "use strict";

  const DATA = window.H5101_MATERIALS;
  const canvas = document.querySelector("#audition");
  const ctx = canvas.getContext("2d");
  const params = new URLSearchParams(location.search);
  const activeSheet = params.get("sheet") || "coherence";
  document.body.dataset.capture = params.get("capture") === "1" ? "true" : "false";

  const C = {
    ink: "#1a1119", soot: "#171221", plum: "#2b2035", plum2: "#3c2942",
    cream: "#f0d9a7", paper: "#ead3a2", brass: "#d8a953", brass2: "#8f592b",
    teal: "#63b9b2", cyan: "#70d4df", ember: "#e77735", red: "#d85055",
    blue: "#4aa5d5", green: "#65ad68", muted: "#a79a9f", line: "#6c4b55"
  };
  const loaded = {};
  const patternCache = new Map();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function loadImage(source) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { loaded[source.key] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = source.url;
    });
  }

  function rr(x, y, w, h, r = 18) {
    const p = new Path2D();
    p.roundRect(x, y, w, h, r);
    return p;
  }

  function fillPath(path, sourceKey, tint = null, alpha = 1, scale = 0.42) {
    const img = loaded[sourceKey];
    ctx.save();
    ctx.clip(path);
    if (img) {
      const cacheKey = `${sourceKey}:${scale}`;
      let pattern = patternCache.get(cacheKey);
      if (!pattern) {
        pattern = ctx.createPattern(img, "repeat");
        if (pattern?.setTransform) pattern.setTransform(new DOMMatrix().scale(scale));
        patternCache.set(cacheKey, pattern);
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pattern;
      ctx.fillRect(-100, -100, 1900, 1200);
    } else {
      ctx.fillStyle = C.plum2;
      ctx.fill(path);
    }
    if (tint) {
      ctx.globalAlpha = 0.42;
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = tint;
      ctx.fill(path);
    }
    ctx.restore();
  }

  function stroke(path, color = C.ink, width = 5) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.stroke(path);
  }

  function text(value, x, y, size = 24, color = C.cream, align = "left", family = "Outfit", weight = 500) {
    ctx.font = `${weight} ${size}px "${family}"`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic";
    ctx.fillText(value, x, y);
  }

  function wrapped(value, x, y, maxWidth, lineHeight = 26, size = 19, color = C.muted) {
    const words = value.split(/\s+/); let line = ""; let yy = y;
    ctx.font = `500 ${size}px "Outfit"`; ctx.fillStyle = color; ctx.textAlign = "left";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, yy); line = word; yy += lineHeight; }
      else line = test;
    }
    if (line) ctx.fillText(line, x, yy);
    return yy;
  }

  function backdrop(w, h) {
    const g = ctx.createRadialGradient(w * .5, h * .32, 20, w * .5, h * .45, w * .7);
    g.addColorStop(0, "#342235"); g.addColorStop(.55, C.soot); g.addColorStop(1, "#090711");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = .11; ctx.fillStyle = C.brass;
    for (let i = -h; i < w; i += 72) ctx.fillRect(i, 0, 1, h);
    ctx.globalAlpha = 1;
  }

  function frame(title, kicker, note = "Same geometry · source-backed materials · no runtime approval") {
    backdrop(1600, 900);
    ctx.fillStyle = "rgba(20,14,27,.92)"; ctx.fill(rr(30, 28, 1540, 844, 28));
    stroke(rr(30, 28, 1540, 844, 28), "#6f4b55", 2);
    text(kicker.toUpperCase(), 72, 82, 16, C.teal, "left", "Outfit", 700);
    text(title, 72, 132, 38, C.cream, "left", "Cinzel", 700);
    ctx.fillStyle = C.brass; ctx.fillRect(72, 151, 92, 3);
    text(note, 1528, 842, 15, C.muted, "right", "Outfit", 500);
  }

  function card(x, y, w, h, label, status, accent = C.teal) {
    ctx.fillStyle = "rgba(43,32,53,.88)"; ctx.fill(rr(x, y, w, h, 18));
    stroke(rr(x, y, w, h, 18), "#5c4252", 2);
    text(label, x + 22, y + 34, 17, C.cream, "left", "Outfit", 700);
    const tw = Math.max(92, ctx.measureText(status).width + 26);
    ctx.fillStyle = accent; ctx.globalAlpha = .18; ctx.fill(rr(x + w - tw - 16, y + 14, tw, 29, 14)); ctx.globalAlpha = 1;
    text(status.toUpperCase(), x + w - 29, y + 34, 11, accent, "right", "Outfit", 700);
    return { x: x + 20, y: y + 58, w: w - 40, h: h - 78 };
  }

  function beam(x, y, w, h, source, warm = false, supportSource = null) {
    const p = rr(x, y, w, h, 14); fillPath(p, source, warm ? "#7e4528" : "#43303a", 1, .5); if (supportSource) fillPath(p, supportSource, null, .12, .32); stroke(p, "#21151b", 6);
    ctx.fillStyle = warm ? "rgba(255,184,84,.18)" : "rgba(120,218,215,.08)"; ctx.fill(rr(x + 8, y + 8, w - 16, 14, 7));
    for (const px of [x + 28, x + w - 28]) { ctx.fillStyle = "#2a1820"; ctx.beginPath(); ctx.arc(px, y + h / 2, 8, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "rgba(30,15,18,.65)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + w * .32, y + 10); ctx.lineTo(x + w * .44, y + h - 10); ctx.stroke();
  }

  function masonryArch(x, y, w, h, source, warm = false, supportSource = null) {
    const outer = rr(x, y, w, h, 26); fillPath(outer, source, warm ? "#6d4129" : "#3f3945", 1, .38); if (supportSource) fillPath(outer, supportSource, null, .1, .28); stroke(outer, "#211820", 6);
    const hole = new Path2D(); hole.moveTo(x + w * .31, y + h); hole.lineTo(x + w * .31, y + h * .53); hole.arc(x + w * .5, y + h * .53, w * .19, Math.PI, 0); hole.lineTo(x + w * .69, y + h); hole.closePath();
    ctx.fillStyle = "#100c18"; ctx.fill(hole); stroke(hole, "#251822", 6);
    ctx.strokeStyle = "rgba(240,217,167,.22)"; ctx.lineWidth = 3;
    for (let i = 1; i < 5; i++) { const xx = x + i * w / 5; ctx.beginPath(); ctx.moveTo(xx, y + 6); ctx.lineTo(xx, y + h * .28); ctx.stroke(); }
  }

  function ironRail(x, y, w, h, source, warm = false, supportSource = null) {
    const rail = rr(x, y, w, h, 10); fillPath(rail, source, warm ? "#5d382b" : "#30313d", 1, .43); if (supportSource) fillPath(rail, supportSource, null, .09, .3); stroke(rail, "#151117", 6);
    ctx.fillStyle = warm ? "rgba(255,188,88,.24)" : "rgba(190,230,230,.12)"; ctx.fillRect(x + 7, y + 7, w - 14, 6);
    for (let px = x + 30; px < x + w - 15; px += 76) { ctx.fillStyle = "#171018"; ctx.beginPath(); ctx.arc(px, y + h / 2, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.brass; ctx.beginPath(); ctx.arc(px - 1, y + h / 2 - 2, 2, 0, Math.PI * 2); ctx.fill(); }
  }

  function gear(x, y, r, bodySource, accentMode = "small", warm = false) {
    ctx.save(); ctx.translate(x, y);
    const teeth = new Path2D();
    for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; const rad = i % 2 ? r * .83 : r; const px = Math.cos(a) * rad, py = Math.sin(a) * rad; i ? teeth.lineTo(px, py) : teeth.moveTo(px, py); }
    teeth.closePath(); fillPath(teeth, bodySource, warm ? "#5a3529" : "#2d2b36", 1, .38); stroke(teeth, "#171016", 7);
    ctx.fillStyle = C.soot; ctx.beginPath(); ctx.arc(0, 0, r * .38, 0, Math.PI * 2); ctx.fill();
    const accentR = accentMode === "broad" ? r * .68 : r * .43;
    ctx.beginPath(); ctx.arc(0, 0, accentR, 0, Math.PI * 2); ctx.arc(0, 0, r * .29, 0, Math.PI * 2, true); ctx.closePath();
    fillPath(ctx.currentPath || new Path2D(), "Metal008", null, 1, .3);
    // Rebuild because currentPath is not portable.
    ctx.beginPath(); ctx.arc(0, 0, accentR, 0, Math.PI * 2); ctx.arc(0, 0, r * .29, 0, Math.PI * 2, true); ctx.fillStyle = ctx.createPattern(loaded.Metal008, "repeat") || C.brass; ctx.fill("evenodd");
    ctx.strokeStyle = "#5c351d"; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = C.brass; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  function parchment(x, y, w, h, source, title, body, warm = false) {
    const p = rr(x, y, w, h, 16); fillPath(p, source, warm ? "#b8753c" : "#d9c18c", 1, .48); stroke(p, "#58331e", 5);
    ctx.strokeStyle = "rgba(102,55,28,.45)"; ctx.lineWidth = 2; ctx.stroke(rr(x + 10, y + 10, w - 20, h - 20, 10));
    text(title, x + w / 2, y + 56, 25, "#33201e", "center", "Cinzel", 700);
    wrapped(body, x + 28, y + 96, w - 56, 24, 18, "#432a25");
    ctx.fillStyle = C.brass2; ctx.beginPath(); ctx.arc(x + w - 24, y + 24, 8, 0, Math.PI * 2); ctx.fill();
  }

  function bottle(x, y, color, label, warm = false, scale = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.shadowColor = color; ctx.shadowBlur = 24;
    const liquid = new Path2D(); liquid.moveTo(-48, 15); liquid.quadraticCurveTo(-68, 40, -54, 86); liquid.quadraticCurveTo(0, 108, 54, 86); liquid.quadraticCurveTo(68, 40, 48, 15); liquid.closePath();
    ctx.fillStyle = color; ctx.globalAlpha = .78; ctx.fill(liquid); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    const glass = new Path2D(); glass.moveTo(-24, -70); glass.lineTo(-24, -16); glass.quadraticCurveTo(-74, 30, -58, 91); glass.quadraticCurveTo(0, 116, 58, 91); glass.quadraticCurveTo(74, 30, 24, -16); glass.lineTo(24, -70); glass.closePath();
    ctx.fillStyle = warm ? "rgba(255,215,151,.14)" : "rgba(191,241,240,.12)"; ctx.fill(glass); ctx.strokeStyle = warm ? "#f3c67c" : "#9ed9d5"; ctx.lineWidth = 7; ctx.stroke(glass);
    ctx.fillStyle = "rgba(255,255,255,.62)"; ctx.fill(rr(-42, 13, 9, 54, 5));
    ctx.fillStyle = "#805a35"; ctx.fill(rr(-29, -83, 58, 24, 5)); stroke(rr(-29, -83, 58, 24, 5), "#3c271f", 4);
    ctx.fillStyle = C.paper; ctx.fill(rr(-34, 48, 68, 31, 6)); text(label, 0, 70, 15, "#2b1b20", "center", "Cinzel", 700);
    ctx.restore();
  }

  function specimenTriptych(title, subtitle, items, renderer) {
    frame(title, "H5.101 neutral specimen audition", subtitle);
    const xs = [72, 584, 1096];
    items.forEach((item, i) => { const inner = card(xs[i], 188, 432, 586, item.label, item.status, item.accent); renderer(inner, item, i); });
  }

  function timberSheet() {
    specimenTriptych("Timber beam · identity before grain", "Same beam silhouette · neutral and warm samples", [
      { label: "Kenney fantasy + restrained grain", status: "default", accent: C.teal, src: "kenney-wall-timber", support: "WoodSiding008", note: "Chunky readable planks carry the identity." },
      { label: "DeadKir hand-painted wood", status: "alternate", accent: C.brass, src: "deadkir-wood", note: "Rich hero-furniture candidate; busier small." },
      { label: "ambientCG siding alone", status: "deferred", accent: C.red, src: "WoodSiding008", note: "Convincing wood, but too photographic alone." }
    ], (p, item) => { beam(p.x + 18, p.y + 72, p.w - 36, 96, item.src, false, item.support); beam(p.x + 18, p.y + 206, p.w - 36, 96, item.src, true, item.support); text("NEUTRAL", p.x + 18, p.y + 48, 12, C.muted, "left", "Outfit", 700); text("WARM", p.x + 18, p.y + 198, 12, C.brass, "left", "Outfit", 700); wrapped(item.note, p.x + 18, p.y + 358, p.w - 36, 25, 18); });
  }

  function masonrySheet() {
    specimenTriptych("Masonry arch · authored block rhythm", "Texture must support the arch, not replace it", [
      { label: "Kenney chunky stone", status: "default", accent: C.teal, src: "kenney-wall-stone", support: "Bricks089", note: "Best balance of readable blocks and quiet depth." },
      { label: "Kenney irregular rock", status: "alternate", accent: C.brass, src: "kenney-wall-rock", note: "Useful cave-facing alternate with rougher edges." },
      { label: "ambientCG bricks alone", status: "deferred", accent: C.red, src: "Bricks089", note: "Grain competes with code-authored voussoirs." }
    ], (p, item) => { masonryArch(p.x + 45, p.y + 54, p.w - 90, 250, item.src, false, item.support); wrapped(item.note, p.x + 18, p.y + 360, p.w - 36, 25, 18); });
  }

  function conveyorSheet() {
    frame("Conveyor slats · repetition and wear", "H5.101 neutral specimen audition", "The recipe must survive repetition without visual soup");
    const p = card(72, 190, 1456, 575, "Kenney plank identity + authored wear + DeadKir iron brackets", "recommended construction", C.teal);
    for (let row = 0; row < 3; row++) {
      const yy = p.y + 38 + row * 135;
      for (let i = 0; i < 5; i++) { beam(p.x + 34 + i * 244, yy, 210, 82, i === 2 && row === 1 ? "deadkir-wood" : "kenney-wood-planks", row === 2); }
      ironRail(p.x + 12, yy + 73, p.w - 24, 28, "deadkir-metal", row === 2);
    }
    text("Neutral", p.x + 8, p.y + 29, 14, C.muted); text("Wear variation", p.x + p.w / 2, p.y + 29, 14, C.teal, "center"); text("Warm mechanism light", p.x + p.w - 8, p.y + 29, 14, C.brass, "right");
  }

  function ironSheet() {
    specimenTriptych("Iron rail + bracket · painted plate language", "Same hardware silhouette · edge response remains geometry-led", [
      { label: "DeadKir metal + quiet grain", status: "default", accent: C.teal, src: "deadkir-metal", support: "Metal046B", note: "Hand-painted plate reads immediately." },
      { label: "ambientCG dark iron", status: "small hardware", accent: C.brass, src: "Metal046B", note: "Strong support for bolts and narrow rails." },
      { label: "rust-heavy realistic iron", status: "deferred", accent: C.red, src: "Metal053C", note: "Rust tells a louder story than the object." }
    ], (p, item) => { ironRail(p.x + 16, p.y + 82, p.w - 32, 82, item.src, false, item.support); ironRail(p.x + 75, p.y + 220, p.w - 150, 118, item.src, true, item.support); wrapped(item.note, p.x + 18, p.y + 392, p.w - 36, 25, 18); });
  }

  function gearSheet() {
    frame("Gear + valve · realistic brass earns focus", "H5.101 constrained focal accent", "Metal008 is approved here only as limited focal hardware");
    const configs = [
      { x: 72, label: "No brass", status: "flat", mode: "none", note: "Iron-on-iron loses the interaction target." },
      { x: 584, label: "Constrained brass hub", status: "recommended", mode: "small", note: "A small realistic response gives the mechanism a clear focal point." },
      { x: 1096, label: "Broad brass coverage", status: "rejected", mode: "broad", note: "The realistic surface takes over the entire object." }
    ];
    configs.forEach((item) => { const p = card(item.x, 188, 432, 586, item.label, item.status, item.mode === "small" ? C.teal : item.mode === "broad" ? C.red : C.muted); if (item.mode === "none") { gear(p.x + p.w / 2, p.y + 218, 138, "deadkir-metal", "small"); ctx.fillStyle = "rgba(25,15,23,.9)"; ctx.beginPath(); ctx.arc(p.x + p.w / 2, p.y + 218, 64, 0, Math.PI * 2); ctx.fill(); } else gear(p.x + p.w / 2, p.y + 218, 138, "deadkir-metal", item.mode, true); wrapped(item.note, p.x + 18, p.y + 410, p.w - 36, 25, 18); });
  }

  function parchmentSheet() {
    specimenTriptych("Parchment · live type stays sovereign", "Illustration supports the recipe; it does not bake the words", [
      { label: "Luke illustrated parchment", status: "default", accent: C.teal, src: "luke-parchment", title: "MOON TONIC", body: "Blue vial · two measures. Sort toward the owl-marked shelf." },
      { label: "ambientCG clean fiber", status: "small-label alt", accent: C.brass, src: "Paper006", title: "EMBER SALT", body: "Red vial · one measure. Keep clear of moss spirits." },
      { label: "Over-textured treatment", status: "rejected", accent: C.red, src: "SurfaceImperfections015", title: "NOPE", body: "The surface event has become louder than the instruction." }
    ], (p, item) => parchment(p.x + 24, p.y + 42, p.w - 48, 360, item.src, item.title, item.body, true));
  }

  function bottleSheet() {
    frame("Potion bottles · code-authored glass", "H5.101 classification color test", "No bottle texture · glass is shape, transparency, rim, highlight, and shadow");
    const p = card(72, 188, 1456, 586, "Red / blue / green classification survives neutral and warm light", "recommended recipe", C.teal);
    const colors = [[C.red, "RED"], [C.blue, "BLUE"], [C.green, "GREEN"]];
    colors.forEach(([color, label], i) => { bottle(p.x + 210 + i * 430, p.y + 245, color, label, false, 1.45); bottle(p.x + 330 + i * 430, p.y + 245, color, label, true, .88); });
    text("Neutral hero", p.x + 28, p.y + 56, 14, C.muted); text("Warm companion", p.x + p.w - 28, p.y + 56, 14, C.brass, "right");
  }

  function fxSheet() {
    frame("FX helper board · ingredients, not effects", "H5.101 source sprite audition", "Emitter behavior remains code; these images are only the visual atoms");
    const fx = [
      ["kenney-particle-light_01", "Glow", "potion focus"], ["kenney-particle-spark_01", "Spark", "mechanism feedback"],
      ["kenney-particle-dirt_02", "Dust", "slat release"], ["kenney-particle-smoke_06", "Steam", "cauldron breath"], ["deadkir-ooze", "Ooze", "liquid support"]
    ];
    fx.forEach(([key, label, note], i) => { const x = 72 + i * 292; const p = card(x, 202, 268, 520, label, "candidate", i === 4 ? C.cyan : C.teal); const img = loaded[key]; if (img) { ctx.save(); ctx.shadowColor = i === 4 ? C.cyan : C.brass; ctx.shadowBlur = 24; ctx.globalAlpha = .92; ctx.drawImage(img, p.x + 18, p.y + 35, p.w - 36, p.w - 36); ctx.restore(); } wrapped(note, p.x + 18, p.y + 292, p.w - 36, 24, 17); text("SOURCE ONLY", p.x + 18, p.y + 390, 11, C.muted, "left", "Outfit", 700); });
  }

  function lightingSheet() {
    frame("Neutral light vs warm mechanism light", "H5.101 paired condition", "Same palette, geometry, texture scale, and coverage on both sides");
    [[72, false, "NEUTRAL EXAM LIGHT"], [816, true, "WARM MECHANISM LIGHT"]].forEach(([x, warm, label]) => {
      const p = card(x, 186, 712, 590, label, warm ? "amber condition" : "baseline", warm ? C.brass : C.teal);
      masonryArch(p.x + 22, p.y + 38, 250, 240, "kenney-wall-stone", warm, "Bricks089");
      beam(p.x + 298, p.y + 60, 330, 82, "kenney-wall-timber", warm, "WoodSiding008");
      ironRail(p.x + 298, p.y + 181, 330, 62, "deadkir-metal", warm, "Metal046B");
      gear(p.x + 430, p.y + 364, 94, "deadkir-metal", "small", warm);
      bottle(p.x + 110, p.y + 395, C.blue, "BLUE", warm, .92);
    });
  }

  function paletteSheet() {
    frame("Provisional Potion Sorter material palette", "H5.101 recommended recipe family", "Provisional until human review · zero runtime approvals");
    const swatches = [
      ["Chunky timber", "kenney-wall-timber", "Primary structure"], ["Stone blocks", "kenney-brick-stone", "Primary masonry"],
      ["Painted iron", "deadkir-metal", "Rails + machinery"], ["Real brass", "Metal008", "Focal accents only"],
      ["Illustrated paper", "luke-parchment", "Recipes + labels"], ["Authored wear", "kenney-ground-dirt", "Masked surface events"]
    ];
    swatches.forEach(([label, key, role], i) => { const col = i % 3, row = Math.floor(i / 3); const x = 72 + col * 492, y = 196 + row * 260; const p = rr(x, y, 450, 218, 18); fillPath(p, key, i === 3 ? null : "#564034", 1, .38); stroke(p, "#6b4a50", 3); ctx.fillStyle = "rgba(15,10,20,.78)"; ctx.fill(rr(x + 14, y + 142, 422, 61, 12)); text(label, x + 28, y + 170, 20, C.cream, "left", "Cinzel", 700); text(role, x + 28, y + 192, 13, i === 3 ? C.brass : C.teal); });
  }

  function verdictSheet() {
    frame("Material recipe verdicts", "H5.101 provisional decision table", "Recommendations are recipe-level; source pantry acceptance remains unchanged");
    const rows = DATA.recipes;
    const x = 72, y = 184, rowH = 33;
    const cols = [x, x + 490, x + 820, x + 1130];
    ["ROLE", "RECIPE", "VERDICT", "RUNTIME"].forEach((v, i) => text(v, cols[i], y, 13, C.teal, "left", "Outfit", 700));
    rows.forEach((r, i) => { const yy = y + 30 + i * rowH; ctx.fillStyle = i % 2 ? "rgba(54,39,60,.55)" : "rgba(32,24,42,.66)"; ctx.fillRect(x - 10, yy - 22, 1455, 29); const verdict = r.provisionalStatus; const color = verdict === "recommended-default" ? C.teal : verdict === "constrained-accent" ? C.brass : verdict === "deferred" ? C.red : C.muted; text(r.semanticMaterialRole, cols[0], yy, 13, C.cream); text(r.recipeId, cols[1], yy, 13, C.muted); text(verdict, cols[2], yy, 12, color, "left", "Outfit", 700); text("FALSE", cols[3], yy, 12, C.red, "left", "Outfit", 700); });
  }

  function rejectedSheet() {
    frame("Constrained and rejected treatments", "H5.101 boundary evidence", "A useful source can still be wrong at a particular scale or coverage");
    const entries = [
      ["Broad realistic brass", "REJECT", "Metal008 dominates when it becomes the whole machine.", "Metal008"],
      ["Photographic timber identity", "DEFER", "Keep ambientCG grain as subtle support, not the room's voice.", "WoodSiding008"],
      ["Rust-heavy broad iron", "DEFER", "Rust implies neglect and steals semantic focus.", "Metal053C"],
      ["Grime as a repeating fill", "REJECT", "Wear is a placed event or mask, never wallpaper.", "SurfaceImperfections015"]
    ];
    entries.forEach(([label, status, note, key], i) => { const x = 72 + (i % 2) * 744, y = 190 + Math.floor(i / 2) * 288; const p = card(x, y, 712, 246, label, status, status === "REJECT" ? C.red : C.brass); const sample = rr(p.x + 14, p.y + 20, 205, 135, 14); fillPath(sample, key, null, 1, .33); stroke(sample, "#1b121a", 4); wrapped(note, p.x + 250, p.y + 54, p.w - 270, 27, 19, C.cream); });
  }

  function coherenceSheet() {
    frame("The alchemist’s material examination bench", "H5.101 coherence board", "One object family · stylized identity · restrained realistic support · no room implementation");
    const p = card(72, 176, 1456, 608, "Provisional hybrid palette assembled on code-authored specimens", "human review passed", C.teal);
    masonryArch(p.x + 30, p.y + 62, 360, 350, "kenney-wall-stone", true, "Bricks089");
    beam(p.x + 370, p.y + 58, 620, 90, "kenney-wall-timber", true, "WoodSiding008");
    for (let i = 0; i < 4; i++) beam(p.x + 420 + i * 194, p.y + 330, 174, 72, i === 2 ? "deadkir-wood" : "kenney-wood-planks", true);
    ironRail(p.x + 397, p.y + 411, 825, 48, "deadkir-metal", true, "Metal046B");
    gear(p.x + 1050, p.y + 183, 124, "deadkir-metal", "small", true);
    parchment(p.x + 420, p.y + 168, 352, 140, "luke-parchment", "SORTING ORDER", "Red → furnace · Blue → moon shelf · Green → moss rack", true);
    bottle(p.x + 820, p.y + 255, C.red, "RED", true, .72); bottle(p.x + 935, p.y + 255, C.blue, "BLUE", true, .72); bottle(p.x + 1050, p.y + 255, C.green, "GREEN", true, .72);
    text("STYLIZED PRIMARY", p.x + 26, p.y + p.h - 23, 12, C.teal, "left", "Outfit", 700);
    text("REALISTIC BRASS: FOCAL ONLY", p.x + p.w - 26, p.y + p.h - 23, 12, C.brass, "right", "Outfit", 700);
  }

  const renderers = { timber: timberSheet, masonry: masonrySheet, conveyor: conveyorSheet, iron: ironSheet, gear: gearSheet, parchment: parchmentSheet, bottle: bottleSheet, fx: fxSheet, lighting: lightingSheet, palette: paletteSheet, verdicts: verdictSheet, rejected: rejectedSheet, coherence: coherenceSheet };

  function render() {
    resize();
    ctx.save();
    const scale = Math.min(innerWidth / 1600, innerHeight / 900);
    const ox = (innerWidth - 1600 * scale) / 2, oy = (innerHeight - 900 * scale) / 2;
    ctx.translate(ox, oy); ctx.scale(scale, scale);
    (renderers[activeSheet] || coherenceSheet)();
    ctx.restore();
  }

  function buildNav() {
    const nav = document.querySelector("#sheet-nav");
    [...new Map(DATA.sheets.map((s) => [s.id, s])).values()].forEach((sheet) => {
      const a = document.createElement("a"); a.href = `?sheet=${sheet.id}`; a.textContent = sheet.id; if (sheet.id === activeSheet) a.setAttribute("aria-current", "page"); nav.append(a);
    });
  }

  Promise.all([document.fonts.ready, ...Object.values(DATA.sources).map(loadImage)]).then(() => {
    buildNav(); render(); window.__H5101_READY__ = true; document.body.dataset.ready = "true";
  });
  addEventListener("resize", () => { patternCache.clear(); render(); });
})();
