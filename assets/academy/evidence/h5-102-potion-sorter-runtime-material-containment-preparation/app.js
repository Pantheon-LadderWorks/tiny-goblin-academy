(() => {
  "use strict";

  const DATA = window.H5102_PREPARED;
  const params = new URLSearchParams(location.search);
  const activeSheet = params.get("sheet") || "harness";
  const captureMode = params.get("capture") === "1";
  document.body.dataset.capture = captureMode ? "true" : "false";
  window.__H5102_STATE__ = { ready: false, sheet: activeSheet, interactionProbe: false };

  const C = {
    soot: 0x100b17, ink: 0x17101d, plum: 0x281c33, plum2: 0x352440,
    cream: 0xf1d8a2, paper: 0xe8c98f, brass: 0xd8a44e, brassDark: 0x7d4628,
    teal: 0x63c8c1, cyan: 0x72dce0, red: 0xe15b5e, blue: 0x52aee0,
    green: 0x79ba65, muted: 0xb2a3aa, line: 0x684652, white: 0xfff7e2
  };

  const materialKey = (role) => `material:${role}`;
  const skinFrame = (id) => id;

  class PreparationScene extends Phaser.Scene {
    constructor() { super("PreparationScene"); }

    preload() {
      this.load.image("potion-sheet", `/${DATA.skins[0].cleanedAssetPath}`);
      DATA.materials.forEach((material) => this.load.image(materialKey(material.semanticRole), material.sourceUrl));
    }

    create() {
      const texture = this.textures.get("potion-sheet");
      DATA.skins.forEach((skin) => {
        const r = skin.frameRect;
        if (!texture.has(skinFrame(skin.sourceRegionId))) texture.add(skinFrame(skin.sourceRegionId), 0, r.x, r.y, r.w, r.h);
      });
      this.root = this.add.container(0, 0);
      this.maskShapes = [];
      this.renderSheet();
      this.scale.on("resize", () => this.layoutRoot());
      this.layoutRoot();
      window.__H5102_STATE__.ready = true;
      document.body.dataset.ready = "true";
    }

    layoutRoot() {
      const width = this.scale.width, height = this.scale.height;
      const scale = Math.min(width / 1600, height / 900);
      this.root.setScale(scale).setPosition((width - 1600 * scale) / 2, (height - 900 * scale) / 2);
    }

    addToRoot(object) { this.root.add(object); return object; }

    graphics() { return this.addToRoot(this.add.graphics()); }

    text(value, x, y, size = 22, color = C.cream, options = {}) {
      const object = this.add.text(x, y, value, {
        fontFamily: options.family || "Outfit",
        fontSize: `${size}px`,
        fontStyle: options.style || "normal",
        fontWeight: options.weight || "500",
        color: `#${color.toString(16).padStart(6, "0")}`,
        align: options.align || "left",
        wordWrap: options.width ? { width: options.width, useAdvancedWrap: true } : undefined,
        lineSpacing: options.lineSpacing || 3
      }).setOrigin(options.originX || 0, options.originY || 0);
      return this.addToRoot(object);
    }

    backdrop() {
      const g = this.graphics();
      g.fillGradientStyle(0x35233a, 0x23172f, 0x100b17, 0x09070e, 1);
      g.fillRect(0, 0, 1600, 900);
      g.lineStyle(1, 0x79505d, .22);
      for (let x = 36; x < 1600; x += 72) g.lineBetween(x, 0, x, 900);
      for (let y = 36; y < 900; y += 72) g.lineBetween(0, y, 1600, y);
      g.fillStyle(C.ink, .94).fillRoundedRect(30, 28, 1540, 844, 28);
      g.lineStyle(2, 0x76515c, 1).strokeRoundedRect(30, 28, 1540, 844, 28);
    }

    frame(title, kicker, footer = "Evidence harness · not Potion Sorter runtime · no runtime approval") {
      this.backdrop();
      this.text(kicker.toUpperCase(), 72, 68, 16, C.teal, { weight: "700" }).setDepth(100);
      this.text(title, 72, 101, 37, C.cream, { family: "Cinzel", weight: "700" }).setDepth(100);
      const g = this.graphics().setDepth(100); g.fillStyle(C.brass, 1).fillRect(72, 151, 94, 3);
      this.text(footer, 1528, 838, 14, C.muted, { originX: 1, family: "Caudex" }).setDepth(100);
    }

    card(x, y, w, h, title, badge, accent = C.teal) {
      const g = this.graphics();
      g.fillStyle(C.plum, .94).fillRoundedRect(x, y, w, h, 18);
      g.lineStyle(2, C.line, 1).strokeRoundedRect(x, y, w, h, 18);
      this.text(title, x + 22, y + 18, 17, C.cream, { family: "Caudex", weight: "700", width: w - 170 }).setDepth(100);
      const badgeW = Math.max(94, badge.length * 7 + 30);
      g.fillStyle(accent, .18).fillRoundedRect(x + w - badgeW - 16, y + 14, badgeW, 30, 15);
      this.text(badge.toUpperCase(), x + w - 28, y + 22, 11, accent, { weight: "700", originX: 1 }).setDepth(100);
      return { x: x + 20, y: y + 58, w: w - 40, h: h - 78 };
    }

    potion(id, x, y, height = 190, options = {}) {
      const skin = DATA.skins.find((item) => item.sourceRegionId === id);
      const image = this.add.image(x, y, "potion-sheet", skinFrame(id));
      image.setOrigin(options.originX ?? skin.defaultAnchor.x, options.originY ?? skin.defaultAnchor.y);
      image.setDisplaySize(height * skin.dimensions.w / skin.dimensions.h, height);
      if (options.tint) image.setTint(options.tint);
      if (options.alpha !== undefined) image.setAlpha(options.alpha);
      if (options.depth !== undefined) image.setDepth(options.depth);
      return this.addToRoot(image);
    }

    prop(id, x, y, width, options = {}) {
      const skin = DATA.skins.find((item) => item.sourceRegionId === id);
      const image = this.add.image(x, y, "potion-sheet", skinFrame(id));
      image.setOrigin(options.originX ?? .5, options.originY ?? .5);
      image.setDisplaySize(width, width * skin.dimensions.h / skin.dimensions.w);
      if (options.depth !== undefined) image.setDepth(options.depth);
      return this.addToRoot(image);
    }

    tile(role, x, y, w, h, options = {}) {
      const tile = this.add.tileSprite(x, y, w, h, materialKey(role));
      tile.setOrigin(options.originX ?? .5, options.originY ?? .5);
      tile.setTileScale(options.tileScale || .35);
      if (options.tint) tile.setTint(options.tint);
      if (options.alpha !== undefined) tile.setAlpha(options.alpha);
      if (options.depth !== undefined) tile.setDepth(options.depth);
      return this.addToRoot(tile);
    }

    rail(x, y, w, warm = false, depth = 20) {
      const tile = this.tile("primary-painted-iron", x, y, w, 56, { tileScale: .42, tint: warm ? 0x9c674d : 0xffffff, depth });
      const g = this.graphics().setDepth(depth + 1);
      g.lineStyle(6, 0x120d14, 1).strokeRoundedRect(x - w / 2, y - 28, w, 56, 10);
      g.lineStyle(4, warm ? C.brass : 0xb4d7d5, .22).lineBetween(x - w / 2 + 8, y - 19, x + w / 2 - 8, y - 19);
      for (let px = x - w / 2 + 32; px < x + w / 2 - 10; px += 74) {
        g.fillStyle(0x140d13, 1).fillCircle(px, y, 7);
        g.fillStyle(C.brass, 1).fillCircle(px - 1, y - 2, 2);
      }
      return tile;
    }

    slat(x, y, w, h, depth = 5) {
      const tile = this.tile("primary-structural-timber", x, y, w, h, { tileScale: .48, tint: 0xa57559, depth });
      const g = this.graphics().setDepth(depth + 1);
      g.lineStyle(6, 0x20131a, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 12);
      g.fillStyle(0x2a1720, 1).fillCircle(x - w / 2 + 26, y, 7).fillCircle(x + w / 2 - 26, y, 7);
      return tile;
    }

    geometryMaskRect(x, y, w, h, radius = 0) {
      const maskGraphics = this.add.graphics();
      if (radius) maskGraphics.fillStyle(0xffffff).fillRoundedRect(x, y, w, h, radius);
      else maskGraphics.fillStyle(0xffffff).fillRect(x, y, w, h);
      const mask = maskGraphics.createGeometryMask();
      maskGraphics.setVisible(false);
      this.root.add(maskGraphics);
      this.maskShapes.push(maskGraphics);
      return { mask, graphics: maskGraphics };
    }

    inventoryCard(item, x, y, w, h) {
      const accent = item.runtimePreparationStatus.includes("constrained") ? C.brass : C.teal;
      const g = this.graphics();
      g.fillStyle(C.plum, .96).fillRoundedRect(x, y, w, h, 14);
      g.lineStyle(2, C.line, 1).strokeRoundedRect(x, y, w, h, 14);
      const preview = this.tile(item.semanticRole, x + 64, y + 74, 92, 64, { tileScale: .24 });
      const badgeW = Math.max(86, item.runtimePreparationStatus.replace("prepared-", "").length * 6 + 24);
      g.fillStyle(accent, .18).fillRoundedRect(x + w - badgeW - 14, y + 12, badgeW, 24, 12);
      const badge = this.text(item.runtimePreparationStatus.replace("prepared-", "").toUpperCase(), x + w - 26, y + 18, 10, accent, { originX: 1, weight: "700" });
      const title = this.text(item.evidenceLabel, x + 16, y + 14, 18, C.cream, { family: "Caudex", weight: "700", width: w - badgeW - 58 });
      const id = this.text(item.sourceKey, x + 126, y + 50, 11, C.teal, { weight: "600", width: w - 146 });
      const details = this.text(`${item.dimensions.w}×${item.dimensions.h} · ${item.format} · ${item.wrapExpectation}`, x + 126, y + 79, 11, C.muted, { width: w - 146 });
      this.inventoryLayoutObjects.push({ item, card: { x, y, w, h }, preview, badge, title, id, details });
    }

    destinationStation(cx, cy, definition, state = "accepted", debug = false, scale = 1) {
      const stateY = { approach: cy - 72 * scale, partial: cy + 18 * scale, accepted: cy + 130 * scale }[state];
      const slotWidth = 250 * scale;
      const cavity = this.graphics().setDepth(2);
      cavity.fillStyle(0x120d17, 1).fillRoundedRect(cx - 90 * scale, cy - 60 * scale, 180 * scale, 170 * scale, 32 * scale);
      cavity.lineStyle(5 * scale, definition.color, .35).strokeRoundedRect(cx - 90 * scale, cy - 60 * scale, 180 * scale, 170 * scale, 32 * scale);
      this.prop(definition.slot, cx, cy + 20 * scale, slotWidth, { depth: 3 });
      const maskRect = { x: cx - 76 * scale, y: cy - 300 * scale, w: 152 * scale, h: 397 * scale, radius: 28 * scale };
      const mask = this.geometryMaskRect(maskRect.x, maskRect.y, maskRect.w, maskRect.h, maskRect.radius);
      const bottle = this.potion(definition.potion, cx, stateY, 190 * scale, { depth: 10 });
      bottle.setMask(mask.mask);
      const lip = this.graphics().setDepth(20);
      lip.fillStyle(0x261620, 1).fillRoundedRect(cx - 80 * scale, cy + 68 * scale, 160 * scale, 24 * scale, 10 * scale);
      lip.lineStyle(4 * scale, definition.color, .9).lineBetween(cx - 63 * scale, cy + 72 * scale, cx + 63 * scale, cy + 72 * scale);
      if (debug) {
        const overlay = this.graphics().setDepth(40);
        overlay.lineStyle(3 * scale, C.brass, .9).strokeRoundedRect(maskRect.x, maskRect.y, maskRect.w, maskRect.h, maskRect.radius);
        overlay.lineStyle(2 * scale, C.teal, .85).strokeRect(cx - 105 * scale, cy - 155 * scale, 210 * scale, 282 * scale);
        overlay.fillStyle(C.red, 1).fillCircle(cx, cy + 68 * scale, 5 * scale);
        this.text("MASK", cx + 82 * scale, cy - 150 * scale, 11 * scale, C.brass, { weight: "700" });
        this.text("INTERACTION", cx + 108 * scale, cy - 126 * scale, 11 * scale, C.teal, { weight: "700" });
        this.text("ANCHOR", cx + 10 * scale, cy + 61 * scale, 11 * scale, C.red, { weight: "700" });
      }
      return { bottle, maskRect };
    }

    apertureState(cx, cy, state, debug = false) {
      const positions = { approach: { y: cy - 88, scale: .82 }, partial: { y: cy - 6, scale: .74 }, exit: { y: cy + 78, scale: .66 } };
      const pose = positions[state];
      this.tile("primary-masonry", cx, cy + 15, 330, 390, { tileScale: .36, tint: 0x82716d, depth: 2 });
      const opening = this.graphics().setDepth(3);
      opening.fillStyle(C.plum, 1).fillRoundedRect(cx - 92, cy - 145, 184, 290, 82);
      const mask = this.geometryMaskRect(cx - 82, cy - 300, 164, 440, 70);
      const bottle = this.potion("potion-sorter.purple-square-potion", cx, pose.y, 255, { depth: 10 });
      bottle.setScale(bottle.scaleX * pose.scale, bottle.scaleY * pose.scale).setMask(mask.mask);
      const rim = this.graphics().setDepth(20);
      rim.lineStyle(16, 0x352330, 1).strokeRoundedRect(cx - 100, cy - 153, 200, 306, 90);
      rim.lineStyle(4, C.brass, .5).strokeRoundedRect(cx - 91, cy - 144, 182, 288, 81);
      if (debug) {
        const overlay = this.graphics().setDepth(40);
        overlay.lineStyle(3, C.brass, .9).strokeRoundedRect(cx - 82, cy - 300, 164, 440, 70);
        overlay.lineStyle(2, C.teal, .85).strokeRect(cx - 115, cy - 220, 230, 420);
      }
      return bottle;
    }

    materialsSheet() {
      this.frame("Runtime-prepared material inventory", "H5.102 bounded source promotion", "18 direct local sources · no derivatives · all runtimeApproved false");
      this.inventoryLayoutObjects = [];
      DATA.materials.forEach((item, i) => {
        const col = i % 4, row = Math.floor(i / 4), x = 72 + col * 370, y = 180 + row * 126;
        this.inventoryCard(item, x, y, 346, 112);
      });
      this.finishInventoryAudit("four-column-primary", 18);
    }

    materialsMinimumSheet(page) {
      this.frame(`Material inventory · minimum plate ${page}/2`, "1024×640 readable evidence contract", "Two logical columns · nine records per plate · canonical source IDs preserved");
      this.inventoryLayoutObjects = [];
      const start = (page - 1) * 9;
      DATA.materials.slice(start, start + 9).forEach((item, i) => {
        const col = i % 2, row = Math.floor(i / 2), x = 72 + col * 744, y = 180 + row * 126;
        this.inventoryCard(item, x, y, 712, 112);
      });
      this.finishInventoryAudit(`minimum-plate-${page}`, 18);
    }

    finishInventoryAudit(layout, minimumFontSize) {
      const failures = [];
      this.inventoryLayoutObjects.forEach(({ item, card, preview, badge, title, id, details }) => {
        const within = (object) => { const b = object.getBounds(); return b.x >= card.x && b.y >= card.y && b.right <= card.x + card.w && b.bottom <= card.y + card.h; };
        if (![preview, badge, title, id, details].every(within)) failures.push(`${item.sourceKey}: overflow`);
        const titleBounds = title.getBounds(), badgeBounds = badge.getBounds(), previewBounds = preview.getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(titleBounds, badgeBounds)) failures.push(`${item.sourceKey}: title-badge collision`);
        if (Phaser.Geom.Intersects.RectangleToRectangle(titleBounds, previewBounds)) failures.push(`${item.sourceKey}: title-image collision`);
        if (Phaser.Geom.Intersects.RectangleToRectangle(titleBounds, id.getBounds())) failures.push(`${item.sourceKey}: title-id collision`);
        if (Phaser.Geom.Intersects.RectangleToRectangle(id.getBounds(), details.getBounds())) failures.push(`${item.sourceKey}: id-details collision`);
        if (Phaser.Geom.Intersects.RectangleToRectangle(previewBounds, id.getBounds())) failures.push(`${item.sourceKey}: image-id collision`);
      });
      window.__H5102_STATE__.layoutAudit = { layout, minimumFontSize, cardCount: this.inventoryLayoutObjects.length, failures, passed: failures.length === 0 };
    }

    skinsSheet() {
      this.frame("Potion and prop skin inventory", "H5.48C atlas + H5.49 exclusions", "32 authority records · 30 prepared · 2 hard denials preserved");
      DATA.skins.forEach((skin, i) => {
        const col = i % 8, row = Math.floor(i / 8), x = 64 + col * 190, y = 178 + row * 155;
        const denied = skin.runtimePreparationStatus === "denied-reference-only";
        const g = this.graphics();
        g.fillStyle(denied ? 0x3a1b29 : C.plum, .95).fillRoundedRect(x, y, 170, 135, 14);
        g.lineStyle(2, denied ? C.red : C.line, 1).strokeRoundedRect(x, y, 170, 135, 14);
        const image = this.prop(skin.sourceRegionId, x + 85, y + 58, Math.min(88, 86 * skin.dimensions.w / skin.dimensions.h));
        image.setDisplaySize(image.displayWidth, Math.min(88, image.displayHeight));
        this.text(`${skin.index}. ${skin.label}`, x + 10, y + 104, 11, denied ? C.red : C.cream, { width: 150, weight: "700" });
        if (denied) {
          g.lineStyle(7, C.red, .88).lineBetween(x + 25, y + 20, x + 145, y + 92).lineBetween(x + 145, y + 20, x + 25, y + 92);
          this.text("H5.49 DENIED", x + 85, y + 118, 10, C.red, { originX: .5, weight: "700" });
        }
      });
    }

    diagramSheet() {
      this.frame("Layering-first containment contract", "Local containment, not scene-scale masking", "Back surface → bottle → foreground lip; mask only for genuine clipping");
      const methods = [
        { x: 72, n: "01", title: "Depth layering", badge: "first", color: C.teal, lines: ["holder back plate", "potion sprite", "foreground lip / rail"], note: "Shallow seating and rails need no mask." },
        { x: 584, n: "02", title: "Geometry mask", badge: "second", color: C.brass, lines: ["holder-local clip geometry", "potion sprite remains intact", "painted foreground rim"], note: "Deep bins and apertures clip locally." },
        { x: 1096, n: "03", title: "Alpha mask", badge: "only if required", color: C.red, lines: ["irregular authored opening", "alignment burden", "fragile responsive coupling"], note: "Not required by the tested H5.48C holders." }
      ];
      methods.forEach((m) => {
        const p = this.card(m.x, 190, 432, 570, `${m.n} · ${m.title}`, m.badge, m.color);
        m.lines.forEach((line, i) => {
          const y = p.y + 42 + i * 110;
          const g = this.graphics(); g.fillStyle(i === 1 ? C.plum2 : m.color, i === 1 ? 1 : .18).fillRoundedRect(p.x + 30, y, p.w - 60, 72, 14);
          g.lineStyle(2, m.color, .72).strokeRoundedRect(p.x + 30, y, p.w - 60, 72, 14);
          this.text(line, p.x + p.w / 2, y + 23, 17, i === 1 ? C.cream : m.color, { originX: .5, weight: "700" });
          if (i < 2) { g.lineStyle(3, m.color, .65).lineBetween(p.x + p.w / 2, y + 75, p.x + p.w / 2, y + 102); g.fillTriangle(p.x + p.w / 2 - 6, y + 96, p.x + p.w / 2 + 6, y + 96, p.x + p.w / 2, y + 105); }
        });
        this.text(m.note, p.x + 24, p.y + 390, 17, C.muted, { family: "Caudex", width: p.w - 48 });
      });
    }

    cradleSheet() {
      this.frame("Conveyor cradle · layering only", "Actual H5.48C red potion skin", "No geometry mask · source sprite remains intact · foreground lip sells containment");
      const p = this.card(104, 190, 1392, 570, "Back surface → potion anchor → front rail", "depth layering", C.teal);
      this.prop("potion-sorter.wood-sorter-slot", 800, 480, 390, { depth: 2 });
      this.slat(800, 632, 850, 104, 3);
      this.potion("potion-sorter.red-round-potion-bottle", 800, 568, 260, { depth: 10 });
      this.rail(800, 620, 720, true, 20);
      this.text("BACK PLATE", 315, 346, 14, C.muted, { weight: "700" });
      this.text("POTION SKIN", 800, 292, 14, C.teal, { weight: "700", originX: .5 });
      this.text("FOREGROUND LIP", 1280, 610, 14, C.brass, { weight: "700", originX: .5 });
    }

    railSheet() {
      this.frame("Foreground rail crossing · occlusion without clipping", "Actual H5.48C blue vial skin", "The rail crosses at a higher depth; the bottle texture is never cropped or masked");
      this.card(104, 190, 1392, 570, "Partially occluded potion remains a complete renderer object", "depth layering", C.teal);
      this.slat(800, 635, 1050, 112, 3);
      const bottle = this.potion("potion-sorter.blue-tall-vial", captureMode ? 800 : 470, 608, 330, { depth: 10 });
      this.rail(800, 570, 1120, false, 20);
      if (!captureMode) this.tweens.add({ targets: bottle, x: 1130, duration: 2600, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      this.text("COMPLETE SPRITE BEHIND RAIL", 800, 286, 16, C.teal, { originX: .5, weight: "700" });
    }

    binSheet() {
      this.frame("Single-color receiving rig · three containment states", "Actual H5.48C destination faces and matching potions", "Approach → partial entry → accepted; invisible local masks and lower foreground lips");
      const defs = [
        { slot: "potion-sorter.red-sorter-slot", potion: "potion-sorter.red-round-potion-bottle", color: C.red, label: "RED · APPROACH", state: "approach" },
        { slot: "potion-sorter.blue-sorter-slot", potion: "potion-sorter.blue-tall-vial", color: C.blue, label: "BLUE · PARTIAL", state: "partial" },
        { slot: "potion-sorter.green-sorter-slot", potion: "potion-sorter.green-round-potion-bottle", color: C.green, label: "GREEN · ACCEPTED", state: "accepted" }
      ];
      defs.forEach((definition, i) => {
        const x = 310 + i * 490;
        this.card(x - 205, 190, 410, 570, definition.label, "presentation", definition.color);
        this.destinationStation(x, 490, definition, definition.state, false, 1.12);
      });
    }

    apertureSheet() {
      this.frame("Machine aperture · synchronized three-state passage", "Actual H5.48C purple bottle · one local geometry contract", "Position, scale, depth, and clip remain aligned from approach through exit");
      ["approach", "partial", "exit"].forEach((state, i) => {
        const x = 310 + i * 490;
        this.card(x - 205, 190, 410, 570, `${i + 1}. ${state.toUpperCase()}`, "presentation", C.brass);
        this.apertureState(x, 495, state, false);
      });
    }

    boundsSheet() {
      this.frame("Interaction bounds remain independent", "Partially occluded H5.48C blue vial", "Pointer probe clicks outside visible bounds but inside generous interaction bounds");
      this.card(104, 190, 1392, 570, "Visible, mask, interaction, and sorting/drop geometry are four different contracts", "pointer proof", C.teal);
      this.prop("potion-sorter.blue-sorter-slot", 800, 585, 440, { depth: 2 });
      const mask = this.geometryMaskRect(690, 350, 220, 260, 34);
      const bottle = this.potion("potion-sorter.blue-tall-vial", 800, 610, 330, { depth: 10 });
      bottle.setMask(mask.mask);
      this.rail(800, 525, 500, false, 20);
      const hit = this.add.rectangle(720, 450, 360, 430, 0xffffff, 0).setInteractive({ useHandCursor: true }).setDepth(50);
      this.addToRoot(hit);
      const label = this.text("POINTER PROBE: WAITING", 1240, 690, 15, C.muted, { originX: .5, weight: "700" });
      hit.on("pointerdown", () => {
        window.__H5102_STATE__.interactionProbe = true;
        label.setText("POINTER PROBE: PASSED").setColor("#63c8c1");
      });
      const g = this.graphics().setDepth(45);
      g.lineStyle(4, C.teal, 1).strokeRect(540, 235, 360, 430);
      g.lineStyle(4, C.blue, 1).strokeRect(731, 280, 138, 330);
      g.lineStyle(4, C.brass, 1).strokeRoundedRect(690, 350, 220, 260, 34);
      g.lineStyle(4, C.red, 1).strokeRect(925, 485, 230, 130);
      const legend = [[C.teal, "interaction"], [C.blue, "visible"], [C.brass, "mask"], [C.red, "sorting/drop"]];
      legend.forEach(([color, value], i) => { g.fillStyle(color, 1).fillRect(1060, 292 + i * 54, 32, 5); this.text(value, 1108, 278 + i * 54, 16, color, { weight: "700" }); });
    }

    irregularSheet() {
      this.frame("Irregular opening assessment · alpha mask not required", "Actual H5.48C red sorter slot", "Painted frame supplies irregular edge language; simple holder-local geometry supplies functional clipping");
      const left = this.card(104, 190, 650, 570, "Presentation view", "mask invisible", C.teal);
      this.destinationStation(left.x + left.w / 2, left.y + 300, { slot: "potion-sorter.red-sorter-slot", potion: "potion-sorter.red-round-potion-bottle", color: C.red }, "partial", false, 1.25);
      const right = this.card(846, 190, 650, 570, "Debug view", "contour labeled", C.brass);
      this.destinationStation(right.x + right.w / 2, right.y + 300, { slot: "potion-sorter.red-sorter-slot", potion: "potion-sorter.red-round-potion-bottle", color: C.red }, "partial", true, 1.25);
      this.text("ALPHA MASK: NOT JUSTIFIED", 800, 733, 16, C.red, { originX: .5, weight: "700" });
    }

    destinationBoardSheet() {
      this.frame("Three-color destination containment board", "Regions 17, 18, and 19 as actual receiving identities", "Matching accepted potion skins · consistent holder geometry · no four-slot organizer");
      const defs = [
        { slot: "potion-sorter.red-sorter-slot", potion: "potion-sorter.red-round-potion-bottle", color: C.red, label: "RED DESTINATION" },
        { slot: "potion-sorter.blue-sorter-slot", potion: "potion-sorter.blue-tall-vial", color: C.blue, label: "BLUE DESTINATION" },
        { slot: "potion-sorter.green-sorter-slot", potion: "potion-sorter.green-round-potion-bottle", color: C.green, label: "GREEN DESTINATION" }
      ];
      defs.forEach((definition, i) => { const x = 310 + i * 490; this.card(x - 205, 190, 410, 570, definition.label, "accepted", definition.color); this.destinationStation(x, 490, definition, "accepted", false, 1.12); });
    }

    deepDebugSheet() {
      this.frame("Deep containment · presentation and debug separation", "Same green holder, bottle, anchor, and local geometry", "Left is finished presentation; right exposes only thin diagnostic contours");
      const left = this.card(104, 190, 650, 570, "Presentation", "mask invisible", C.green);
      const right = this.card(846, 190, 650, 570, "Debug overlay", "diagnostic only", C.brass);
      const definition = { slot: "potion-sorter.green-sorter-slot", potion: "potion-sorter.green-round-potion-bottle", color: C.green };
      this.destinationStation(left.x + left.w / 2, left.y + 300, definition, "accepted", false, 1.28);
      this.destinationStation(right.x + right.w / 2, right.y + 300, definition, "accepted", true, 1.28);
    }

    apertureDebugSheet() {
      this.frame("Machine aperture · approach, partial, exit with debug geometry", "One holder-local clip and independent interaction envelope", "Thin contours are diagnostic overlays; presentation pixels remain unchanged");
      ["approach", "partial", "exit"].forEach((state, i) => { const x = 310 + i * 490; this.card(x - 205, 190, 410, 570, state.toUpperCase(), "debug", C.brass); this.apertureState(x, 495, state, true); });
    }

    bindingSheet() {
      this.frame("Runtime material binding proof", "Direct local texture sources + actual potion skin", "Stable repeat scale · brass focal only · classification survives warm treatment");
      const p = this.card(72, 190, 1456, 570, "One bounded construction vocabulary—not a room composition", "prepared, not approved", C.teal);
      this.tile("primary-masonry", p.x + 145, p.y + 238, 250, 350, { tileScale: .34, tint: 0x9b7e68, depth: 2 });
      const arch = this.graphics().setDepth(3); arch.fillStyle(C.plum, 1).fillRoundedRect(p.x + 88, p.y + 220, 115, 235, 56);
      this.slat(p.x + 515, p.y + 150, 430, 92, 4);
      this.rail(p.x + 515, p.y + 288, 430, true, 10);
      this.tile("primary-parchment", p.x + 520, p.y + 410, 390, 105, { tileScale: .42, tint: 0xd6a96e, depth: 4 });
      this.text("SORTING ORDER", p.x + 520, p.y + 384, 20, 0x3a221e, { family: "Cinzel", weight: "700", originX: .5 });
      this.potion("potion-sorter.green-round-potion-bottle", p.x + 905, p.y + 455, 290, { depth: 8 });
      const hub = this.tile("constrained-realistic-brass-focal-accent", p.x + 1205, p.y + 265, 150, 150, { tileScale: .28, depth: 7 });
      const mask = this.geometryMaskRect(p.x + 1130, p.y + 190, 150, 150, 75); hub.setMask(mask.mask);
      const hg = this.graphics().setDepth(9); hg.lineStyle(16, 0x251620, 1).strokeCircle(p.x + 1205, p.y + 265, 83); hg.fillStyle(C.ink, 1).fillCircle(p.x + 1205, p.y + 265, 34); hg.fillStyle(C.brass, 1).fillCircle(p.x + 1205, p.y + 265, 10);
      this.text("BRASS ≤ FOCAL HUB", p.x + 1205, p.y + 390, 14, C.brass, { originX: .5, weight: "700" });
    }

    harnessSheet() {
      this.frame("Potion containment preparation bench", "H5.102 Phaser proof harness", "Evidence harness only · no room · no conveyor SceneRig · no gameplay mutation");
      const cards = [
        [72, 184, 454, 270, "Shallow cradle", "layering", C.teal],
        [573, 184, 454, 270, "Single destination", "geometry mask", C.brass],
        [1074, 184, 454, 270, "Interaction", "separate bounds", C.teal],
        [72, 485, 706, 280, "Material binding", "direct local", C.teal],
        [822, 485, 706, 280, "Irregular opening", "no alpha mask", C.brass]
      ];
      cards.forEach(([x, y, w, h, title, badge, accent]) => this.card(x, y, w, h, title, badge, accent));
      this.prop("potion-sorter.wood-sorter-slot", 299, 335, 190, { depth: 2 }); this.potion("potion-sorter.red-round-potion-bottle", 299, 398, 170, { depth: 10 }); this.rail(299, 380, 260, true, 20);
      this.destinationStation(800, 338, { slot: "potion-sorter.green-sorter-slot", potion: "potion-sorter.green-round-potion-bottle", color: C.green }, "accepted", false, .68);
      this.potion("potion-sorter.blue-tall-vial", 1190, 405, 190, { depth: 10 }); const ig = this.graphics().setDepth(22); ig.lineStyle(4, C.teal, 1).strokeRect(1110, 230, 210, 200); ig.lineStyle(4, C.blue, 1).strokeRect(1150, 260, 95, 160);
      this.tile("primary-masonry", 210, 636, 220, 180, { tileScale: .32, tint: 0x8b776c }); this.slat(500, 595, 310, 65, 4); this.rail(500, 690, 310, true, 10); this.potion("potion-sorter.teal-flask", 698, 700, 170, { depth: 15 });
      this.destinationStation(1035, 642, { slot: "potion-sorter.red-sorter-slot", potion: "potion-sorter.red-round-potion-bottle", color: C.red }, "partial", false, .72);
      this.text("30 PREPARED SKINS", 1250, 594, 14, C.teal, { weight: "700" }); this.text("2 H5.49 DENIALS", 1250, 628, 14, C.red, { weight: "700" }); this.text("0 RUNTIME APPROVALS", 1250, 662, 14, C.brass, { weight: "700" });
    }

    verdictsSheet() {
      this.frame("Runtime-preparation verdicts", "H5.102 decision table", "Preparation is not runtime approval; H6 remains separately gated");
      DATA.verdicts.verdicts.forEach((item, i) => {
        const x = 72 + (i % 2) * 744, y = 184 + Math.floor(i / 2) * 150;
        const color = item.verdict.includes("geometry") ? C.brass : item.verdict.includes("no-alpha") ? C.red : C.teal;
        const p = this.card(x, y, 712, 128, item.subject.replaceAll("-", " "), item.verdict, color);
        this.text(item.finding, p.x + 6, p.y + 12, 16, C.muted, { family: "Caudex", width: p.w - 12 });
      });
    }

    rejectedSheet() {
      this.frame("Rejected and deferred containment approaches", "H5.102 guardrail evidence", "The smallest honest technique wins; complexity is not a curriculum trophy");
      const entries = [
        ["Alpha mask for red sorter slot", "REJECTED", "Painted foreground plus rounded geometry already solves the opening."],
        ["Mask bounds reused as hit bounds", "REJECTED", "Pretty clipping must never make a partially hidden bottle hard to select."],
        ["Crop or overwrite potion pixels", "REJECTED", "The illustrated sprite skin remains intact and reusable."],
        ["Glowing green / gold sparkle skins", "H5.49 DENIED", "Preserved as guardrail records; never selected by the harness."],
        ["Broad realistic brass", "REJECTED", "Metal008 stays on focal hubs, rims, valves, fittings, and fasteners."],
        ["Scene-wide lighting mask", "DEFERRED", "Dungeon Key Run retains the deeper environmental masking lesson."]
      ];
      entries.forEach(([title, badge, note], i) => {
        const col = i % 2, row = Math.floor(i / 2), x = 72 + col * 744, y = 184 + row * 190;
        const p = this.card(x, y, 712, 166, title, badge, badge === "DEFERRED" ? C.brass : C.red);
        this.text(note, p.x + 8, p.y + 20, 18, C.cream, { family: "Caudex", width: p.w - 16 });
      });
    }

    renderSheet() {
      const renderers = {
        materials: () => this.materialsSheet(), "materials-min-1": () => this.materialsMinimumSheet(1), "materials-min-2": () => this.materialsMinimumSheet(2), skins: () => this.skinsSheet(), diagram: () => this.diagramSheet(),
        cradle: () => this.cradleSheet(), rail: () => this.railSheet(), bin: () => this.binSheet(),
        aperture: () => this.apertureSheet(), bounds: () => this.boundsSheet(), irregular: () => this.irregularSheet(),
        binding: () => this.bindingSheet(), harness: () => this.harnessSheet(), verdicts: () => this.verdictsSheet(),
        rejected: () => this.rejectedSheet(), destinations: () => this.destinationBoardSheet(), "deep-debug": () => this.deepDebugSheet(), "aperture-debug": () => this.apertureDebugSheet()
      };
      (renderers[activeSheet] || renderers.harness)();
    }
  }

  const uniqueSheets = [...new Map(DATA.harness.evidenceSheets.map((sheet) => [sheet.id, sheet])).values()];
  const nav = document.querySelector("#sheet-nav");
  uniqueSheets.forEach((sheet) => {
    const link = document.createElement("a");
    link.href = `?sheet=${sheet.id}`;
    link.textContent = sheet.id;
    if (sheet.id === activeSheet) link.setAttribute("aria-current", "page");
    nav.append(link);
  });

  document.fonts.ready.then(() => {
    new Phaser.Game({
      type: Phaser.CANVAS,
      parent: "harness",
      backgroundColor: "#100b17",
      transparent: false,
      scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
      render: { antialias: true, pixelArt: false, roundPixels: false },
      audio: { noAudio: true },
      scene: PreparationScene
    });
  });
})();
