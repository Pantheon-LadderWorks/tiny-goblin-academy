import { STAGE } from './config.js';

export class PotionRoomRig {
  constructor(scene, reducedMotion = false) {
    this.scene = scene;
    this.root = scene.add.container(0, 0).setDepth(0);
    this.build(reducedMotion);
  }

  build(reducedMotion) {
    const { scene, root } = this;
    const stone = scene.add.tileSprite(800, 450, 1600, 900, 'masonry')
      .setTint(0x504257).setAlpha(0.62);
    root.add(stone);

    const shade = scene.add.graphics();
    shade.fillStyle(0x120b18, 0.54).fillRect(0, 0, 1600, 900);
    shade.fillStyle(0x20132b, 0.78).fillRect(0, 0, 1600, 120);
    shade.fillStyle(0x0b0710, 0.62).fillRect(0, 790, 1600, 110);
    root.add(shade);

    const leftWing = scene.add.tileSprite(105, 450, 210, 900, 'timber').setTint(0x5c3529).setAlpha(0.82);
    const rightWing = scene.add.tileSprite(1550, 450, 100, 900, 'timber').setTint(0x5c3529).setAlpha(0.82);
    root.add([leftWing, rightWing]);

    const trim = scene.add.graphics();
    trim.lineStyle(18, 0x2a1718, 1).strokeRect(15, 15, 1570, 870);
    trim.lineStyle(4, 0xc08a45, 0.85).strokeRect(28, 28, 1544, 844);
    trim.fillStyle(0x1d111d, 0.9).fillRect(150, 140, 1300, 620);
    trim.lineStyle(42, 0x39272d, 0.96).strokeRoundedRect(430, 145, 740, 620, 300);
    trim.lineStyle(8, 0x98673b, 0.95).strokeRoundedRect(448, 163, 704, 585, 280);
    trim.lineStyle(3, 0xc99a55, 0.55).strokeRoundedRect(462, 177, 676, 555, 268);
    root.add(trim);

    this.addShelf(60, 205, 250, 'BOTANICALS');
    this.addShelf(1300, 205, 250, 'TOOLS');
    this.addPipes();
    this.addLeftDetails();
    this.addRightMachinery(reducedMotion);
  }

  addShelf(x, y, width, label) {
    const scene = this.scene;
    const shelf = scene.add.container(x, y);
    const backing = scene.add.tileSprite(0, 0, width, 310, 'timber').setOrigin(0).setTint(0x714130).setAlpha(0.88);
    const frame = scene.add.graphics();
    frame.lineStyle(8, 0x2d1718).strokeRoundedRect(0, 0, width, 310, 12);
    frame.lineStyle(3, 0xb17b42).strokeRoundedRect(8, 8, width - 16, 294, 8);
    frame.fillStyle(0x1c1119, 0.9).fillRect(10, 48, width - 20, 12);
    frame.fillRect(10, 150, width - 20, 12);
    frame.fillRect(10, 252, width - 20, 12);
    shelf.add([backing, frame]);
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const hue = [0x8e435f, 0x527f67, 0x4d6589, 0xaa783e][(row + col) % 4];
        const bottle = scene.add.graphics();
        bottle.fillStyle(hue, 0.86).fillRoundedRect(30 + col * 48, 73 + row * 101, 24, 38, 9);
        bottle.fillStyle(0xd9b56d, 0.8).fillRect(38 + col * 48, 65 + row * 101, 8, 10);
        shelf.add(bottle);
      }
    }
    const title = scene.add.text(width / 2, 23, label, {
      fontFamily: 'Cinzel', fontSize: '15px', color: '#e1b768', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5);
    shelf.add(title);
    this.root.add(shelf);
  }

  addPipes() {
    const g = this.scene.add.graphics();
    g.lineStyle(18, 0x34252c, 1);
    g.beginPath().moveTo(20, 120).lineTo(300, 120).lineTo(300, 185).strokePath();
    g.beginPath().moveTo(1580, 110).lineTo(1320, 110).lineTo(1320, 195).strokePath();
    g.lineStyle(5, 0xb68643, 0.9);
    g.beginPath().moveTo(20, 120).lineTo(300, 120).lineTo(300, 185).strokePath();
    g.beginPath().moveTo(1580, 110).lineTo(1320, 110).lineTo(1320, 195).strokePath();
    this.root.add(g);
  }

  addLeftDetails() {
    const scene = this.scene;
    const crate = scene.add.container(80, 575);
    const wood = scene.add.tileSprite(0, 0, 190, 125, 'timber').setOrigin(0).setTint(0x72422e).setAlpha(0.94);
    const brace = scene.add.graphics();
    brace.lineStyle(9, 0x321b1b, 1).strokeRect(0, 0, 190, 125);
    brace.lineStyle(7, 0xa46d36, 0.9).beginPath().moveTo(12, 12).lineTo(178, 113).strokePath();
    brace.beginPath().moveTo(178, 12).lineTo(12, 113).strokePath();
    crate.add([wood, brace]);
    this.root.add(crate);

    const tray = scene.add.graphics();
    tray.fillStyle(0x211419, 1).fillRoundedRect(305, 610, 230, 88, 18);
    tray.lineStyle(6, 0x99643a, 1).strokeRoundedRect(305, 610, 230, 88, 18);
    for (let i = 0; i < 5; i += 1) {
      tray.fillStyle([0x638c58, 0x9c6741, 0x6d4f85][i % 3], 0.9).fillCircle(340 + i * 38, 650 + (i % 2) * 8, 13);
    }
    this.root.add(tray);
    this.root.add(scene.add.text(420, 720, 'DRIED ROOTS · NIGHTCAP · MOSS', {
      fontFamily: 'Caudex', fontSize: '14px', color: '#caa56a', fontStyle: 'italic',
    }).setOrigin(0.5));
  }

  addRightMachinery(reducedMotion) {
    const scene = this.scene;
    const plate = scene.add.tileSprite(1330, 405, 220, 300, 'iron').setTint(0x40353f).setAlpha(0.72);
    const bracket = scene.add.graphics();
    bracket.lineStyle(9, 0x2b2025, 1).strokeRoundedRect(1215, 240, 230, 340, 30);
    bracket.lineStyle(3, 0xb97d3f, 0.82).strokeRoundedRect(1226, 251, 208, 318, 24);
    this.root.add([plate, bracket]);

    const gearA = this.makeGear(1280, 340, 70, 0x74503a);
    const gearB = this.makeGear(1380, 445, 52, 0x4f4147);
    this.root.add([gearA, gearB]);
    if (!reducedMotion) {
      scene.tweens.add({ targets: gearA, angle: 360, duration: 18000, repeat: -1 });
      scene.tweens.add({ targets: gearB, angle: -360, duration: 13500, repeat: -1 });
    }

    const valve = scene.add.container(1285, 525);
    const rim = scene.add.circle(0, 0, 42, 0x2b2024).setStrokeStyle(8, 0xc0904e);
    const hub = scene.add.circle(0, 0, 11, 0xd3a45a).setStrokeStyle(3, 0x51301f);
    const spokes = scene.add.graphics();
    spokes.lineStyle(7, 0xa8733d, 1);
    spokes.beginPath().moveTo(-36, 0).lineTo(36, 0).moveTo(0, -36).lineTo(0, 36).strokePath();
    valve.add([rim, spokes, hub]);
    this.root.add(valve);

    const chain = scene.add.graphics();
    chain.lineStyle(5, 0x8d6745, 0.9);
    for (let y = 150; y <= 610; y += 20) chain.strokeEllipse(1480 + ((y / 20) % 2) * 4, y, 12, 23);
    this.root.add(chain);
  }

  makeGear(x, y, radius, color) {
    const scene = this.scene;
    const gear = scene.add.container(x, y);
    const g = scene.add.graphics();
    g.fillStyle(color, 1).fillCircle(0, 0, radius);
    g.lineStyle(7, 0x25181d, 1).strokeCircle(0, 0, radius);
    g.fillStyle(0x1b1117, 1).fillCircle(0, 0, radius * 0.28);
    g.lineStyle(8, 0xb68348, 0.78);
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      g.beginPath().moveTo(Math.cos(angle) * radius * 0.3, Math.sin(angle) * radius * 0.3)
        .lineTo(Math.cos(angle) * radius * 0.82, Math.sin(angle) * radius * 0.82).strokePath();
      const tooth = scene.add.rectangle(Math.cos(angle) * (radius + 5), Math.sin(angle) * (radius + 5), 22, 16, color)
        .setRotation(angle);
      gear.add(tooth);
    }
    gear.add(g);
    return gear;
  }
}

export class AlchemyLightingRig {
  constructor(scene, reducedMotion) {
    this.scene = scene;
    this.root = scene.add.container(0, 0).setDepth(80);
    const lights = [
      { x: 710, y: 425, r: 270, color: 0xe3914a, alpha: 0.085 },
      { x: 1180, y: 675, r: 250, color: 0x61b6cf, alpha: 0.055 },
      { x: 410, y: 330, r: 170, color: 0xa25bd1, alpha: 0.04 },
    ];
    for (const spec of lights) {
      const glow = scene.add.circle(spec.x, spec.y, spec.r, spec.color, spec.alpha)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.root.add(glow);
      if (!reducedMotion) {
        scene.tweens.add({ targets: glow, alpha: spec.alpha * 1.55, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
    }
    const vignette = scene.add.graphics();
    vignette.fillStyle(0x08050c, 0.28).fillRect(0, 0, STAGE.width, 85);
    vignette.fillStyle(0x08050c, 0.34).fillRect(0, 825, STAGE.width, 75);
    this.root.add(vignette);
  }
}
