import Phaser from 'phaser';

import { STAGE } from './config';

const GEARBOX_REAR_DEPTH = 3;
export const GEARBOX_MECHANISM_DEPTH = 5;
const GEARBOX_HOUSING_DEPTH = 6;
export const SERVICE_BAY_FOREGROUND_DEPTH = 7;

export class GearboxRig {
  readonly rearRoot: Phaser.GameObjects.Container;
  readonly mechanismRoot: Phaser.GameObjects.Container;
  readonly housingRoot: Phaser.GameObjects.Container;
  readonly serviceRoot: Phaser.GameObjects.Container;
  private readonly gears: Phaser.GameObjects.Container[] = [];

  constructor(private readonly scene: Phaser.Scene, reducedMotion: boolean) {
    this.rearRoot = scene.add.container(0, 0).setDepth(GEARBOX_REAR_DEPTH);
    this.mechanismRoot = scene.add.container(0, 0).setDepth(GEARBOX_MECHANISM_DEPTH);
    this.housingRoot = scene.add.container(0, 0).setDepth(GEARBOX_HOUSING_DEPTH);
    this.serviceRoot = scene.add.container(0, 0).setDepth(SERVICE_BAY_FOREGROUND_DEPTH);
    this.build(reducedMotion);
  }

  private build(reducedMotion: boolean): void {
    const backplate = this.scene.add.tileSprite(1342, 410, 300, 350, 'iron').setTint(0x342d38).setAlpha(0.9);
    const rearShade = this.scene.add.graphics()
      .fillStyle(0x151018, 0.82).fillRoundedRect(1195, 225, 315, 380, 42)
      .lineStyle(12, 0x24191f, 1).strokeRoundedRect(1195, 225, 315, 380, 42);
    this.rearRoot.add([rearShade, backplate]);

    const large = this.makeGear(1280, 350, 72, 14, 0x59454a);
    const medium = this.makeGear(1392, 425, 54, 12, 0x473b45);
    const small = this.makeGear(1308, 505, 37, 10, 0x684944);
    this.gears.push(large, medium, small);
    this.mechanismRoot.add(this.gears);

    const axleBrackets = this.scene.add.graphics()
      .lineStyle(12, 0x251b21, 1).beginPath().moveTo(1248, 350).lineTo(1423, 425).strokePath()
      .lineStyle(4, 0xb27b42, 0.8).beginPath().moveTo(1248, 350).lineTo(1423, 425).strokePath();
    this.mechanismRoot.add(axleBrackets);

    const housingRim = this.scene.add.graphics()
      .lineStyle(13, 0x2b2025, 1).strokeRoundedRect(1205, 235, 285, 350, 34)
      .lineStyle(4, 0x9e713f, 0.9).strokeRoundedRect(1217, 247, 261, 326, 28);
    const brace = this.scene.add.graphics()
      .fillStyle(0x2d2328, 1).fillRoundedRect(1430, 315, 28, 185, 9)
      .lineStyle(3, 0xa7753e, 0.85).strokeRoundedRect(1430, 315, 28, 185, 9);
    const accessPlate = this.scene.add.graphics()
      .fillStyle(0x30262c, 1).fillRoundedRect(1368, 505, 75, 54, 10)
      .lineStyle(5, 0x171117, 1).strokeRoundedRect(1368, 505, 75, 54, 10)
      .lineStyle(2, 0xb68449, 0.9).strokeRoundedRect(1376, 513, 59, 38, 7);
    for (const [x, y] of [[1380, 517], [1431, 517], [1380, 547], [1431, 547]]) {
      accessPlate.fillStyle(0xc29453, 1).fillCircle(x, y, 4).lineStyle(1, 0x50331f, 1).strokeCircle(x, y, 4);
    }
    this.housingRoot.add([housingRim, brace, accessPlate]);
    this.buildServiceBay();

    if (!reducedMotion) {
      this.scene.tweens.add({ targets: large, angle: 360, duration: 22000, repeat: -1 });
      this.scene.tweens.add({ targets: medium, angle: -360, duration: 17300, repeat: -1 });
      this.scene.tweens.add({ targets: small, angle: 360, duration: 11300, repeat: -1 });
    }
  }

  private buildServiceBay(): void {
    const servicePipe = this.scene.add.graphics()
      .lineStyle(16, 0x251a20, 1).beginPath().moveTo(1470, 275).lineTo(1470, 505).lineTo(1438, 537).strokePath()
      .lineStyle(6, 0xb47f43, 0.95).beginPath().moveTo(1470, 275).lineTo(1470, 505).lineTo(1438, 537).strokePath();

    const pressureGauge = this.scene.add.container(1470, 310);
    const gaugeFace = this.scene.add.circle(0, 0, 23, 0x2a2027).setStrokeStyle(6, 0x171117);
    const gaugeRim = this.scene.add.circle(0, 0, 19, 0xd0a35a).setStrokeStyle(3, 0x684223);
    const gaugeDial = this.scene.add.circle(0, 0, 14, 0xe0d0a5).setStrokeStyle(2, 0x5d4935);
    const gaugeNeedle = this.scene.add.graphics()
      .lineStyle(3, 0x7c2f2f, 1).beginPath().moveTo(0, 3).lineTo(7, -7).strokePath()
      .fillStyle(0x3b2924, 1).fillCircle(0, 2, 3);
    pressureGauge.add([gaugeFace, gaugeRim, gaugeDial, gaugeNeedle]);

    const valveWheel = this.scene.add.container(1470, 452);
    const valve = this.scene.add.graphics()
      .lineStyle(7, 0x281b20, 1).strokeCircle(0, 0, 25)
      .lineStyle(4, 0xb17b42, 1).strokeCircle(0, 0, 21)
      .fillStyle(0x3b292a, 1).fillCircle(0, 0, 7)
      .lineStyle(5, 0xa36d3b, 1);
    for (let index = 0; index < 6; index += 1) {
      const angle = (Math.PI * 2 * index) / 6;
      valve.beginPath().moveTo(Math.cos(angle) * 7, Math.sin(angle) * 7)
        .lineTo(Math.cos(angle) * 20, Math.sin(angle) * 20).strokePath();
    }
    valveWheel.add(valve);

    const pipeFasteners = this.scene.add.graphics();
    for (const y of [350, 410, 500]) {
      pipeFasteners.fillStyle(0x2a1c21, 1).fillRoundedRect(1457, y - 7, 26, 14, 5)
        .lineStyle(2, 0xc08c4c, 0.9).strokeRoundedRect(1459, y - 5, 22, 10, 4);
    }

    this.serviceRoot.add([servicePipe, pressureGauge, valveWheel, pipeFasteners]);
  }

  private makeGear(x: number, y: number, radius: number, teeth: number, color: number): Phaser.GameObjects.Container {
    const gear = this.scene.add.container(x, y);
    const face = this.scene.add.graphics()
      .fillStyle(color, 1).fillCircle(0, 0, radius)
      .lineStyle(7, 0x21171d, 1).strokeCircle(0, 0, radius)
      .fillStyle(0x171117, 1).fillCircle(0, 0, radius * 0.25);
    const spoke = this.scene.add.graphics().lineStyle(Math.max(5, radius * 0.1), 0x9b7045, 0.88);
    for (let index = 0; index < 6; index += 1) {
      const angle = (Math.PI * 2 * index) / 6;
      spoke.beginPath().moveTo(Math.cos(angle) * radius * 0.28, Math.sin(angle) * radius * 0.28)
        .lineTo(Math.cos(angle) * radius * 0.78, Math.sin(angle) * radius * 0.78).strokePath();
    }
    gear.add([face, spoke]);
    for (let index = 0; index < teeth; index += 1) {
      const angle = (Math.PI * 2 * index) / teeth;
      const gearTooth = this.scene.add.rectangle(
        Math.cos(angle) * (radius + 7), Math.sin(angle) * (radius + 7),
        Math.max(14, radius * 0.28), Math.max(10, radius * 0.18), color
      ).setRotation(angle).setStrokeStyle(2, 0x21171d);
      gear.add(gearTooth);
    }
    const hub = this.scene.add.circle(0, 0, radius * 0.16, 0xc29352).setStrokeStyle(4, 0x4d311f);
    const axleCap = this.scene.add.circle(0, 0, radius * 0.06, 0xf0c675);
    gear.add([hub, axleCap]);
    return gear;
  }

  snapshot(): object {
    return {
      rearDepth: this.rearRoot.depth,
      mechanismDepth: this.mechanismRoot.depth,
      housingDepth: this.housingRoot.depth,
      serviceBayDepth: this.serviceRoot.depth,
      gearAngles: this.gears.map((gear) => Number(gear.angle.toFixed(2)))
    };
  }
}

export class PotionRoomRig {
  readonly root: Phaser.GameObjects.Container;
  readonly gearbox: GearboxRig;

  constructor(private readonly scene: Phaser.Scene, reducedMotion: boolean) {
    this.root = scene.add.container(0, 0).setDepth(0);
    this.buildBackground();
    this.addShelf(60, 205, 'BOTANICALS', 2);
    this.addPipes();
    this.gearbox = new GearboxRig(scene, reducedMotion);
  }

  private buildBackground(): void {
    const stone = this.scene.add.tileSprite(800, 450, 1600, 900, 'masonry').setTint(0x504257).setAlpha(0.62);
    const shade = this.scene.add.graphics()
      .fillStyle(0x120b18, 0.54).fillRect(0, 0, 1600, 900)
      .fillStyle(0x20132b, 0.78).fillRect(0, 0, 1600, 120)
      .fillStyle(0x0b0710, 0.62).fillRect(0, 790, 1600, 110);
    const leftWing = this.scene.add.tileSprite(105, 450, 210, 900, 'timber').setTint(0x5c3529).setAlpha(0.82);
    const rightWing = this.scene.add.tileSprite(1550, 450, 100, 900, 'timber').setTint(0x5c3529).setAlpha(0.82);
    const trim = this.scene.add.graphics()
      .lineStyle(18, 0x2a1718, 1).strokeRect(15, 15, 1570, 870)
      .lineStyle(4, 0xc08a45, 0.85).strokeRect(28, 28, 1544, 844)
      .fillStyle(0x1d111d, 0.9).fillRect(150, 140, 1300, 620)
      .lineStyle(42, 0x39272d, 0.96).strokeRoundedRect(430, 145, 740, 620, 300)
      .lineStyle(8, 0x98673b, 0.95).strokeRoundedRect(448, 163, 704, 585, 280)
      .lineStyle(3, 0xc99a55, 0.55).strokeRoundedRect(462, 177, 676, 555, 268);
    this.root.add([stone, shade, leftWing, rightWing, trim]);
  }

  private addShelf(x: number, y: number, label: string, depth: number): void {
    const shelf = this.scene.add.container(x, y).setDepth(depth);
    const backing = this.scene.add.tileSprite(0, 0, 250, 310, 'timber').setOrigin(0).setTint(0x714130).setAlpha(0.88);
    const frame = this.shelfFrame();
    shelf.add([backing, frame, this.shelfTitle(label)]);
    this.addBottleGrid(shelf);
  }

  private shelfFrame(): Phaser.GameObjects.Graphics {
    return this.scene.add.graphics()
      .lineStyle(8, 0x2d1718).strokeRoundedRect(0, 0, 250, 310, 12)
      .lineStyle(3, 0xb17b42).strokeRoundedRect(8, 8, 234, 294, 8)
      .fillStyle(0x1c1119, 0.9).fillRect(10, 48, 230, 12).fillRect(10, 150, 230, 12).fillRect(10, 252, 230, 12);
  }

  private shelfTitle(label: string): Phaser.GameObjects.Text {
    return this.scene.add.text(125, 23, label, {
      fontFamily: 'Cinzel, Georgia, serif', fontSize: '15px', color: '#e1b768', fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  private addBottleGrid(root: Phaser.GameObjects.Container, all = true): void {
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        if (!all && col === 0) continue;
        const color = [0x8e435f, 0x527f67, 0x4d6589, 0xaa783e][(row + col) % 4];
        root.add(this.makeBottle(30 + col * 48, 73 + row * 101, color));
      }
    }
  }

  private makeBottle(x: number, y: number, color: number): Phaser.GameObjects.Graphics {
    return this.scene.add.graphics().fillStyle(color, 0.86).fillRoundedRect(x, y, 24, 38, 9)
      .fillStyle(0xd9b56d, 0.8).fillRect(x + 8, y - 8, 8, 10);
  }

  private addPipes(): void {
    const pipes = this.scene.add.graphics().lineStyle(18, 0x34252c, 1);
    pipes.beginPath().moveTo(20, 120).lineTo(300, 120).lineTo(300, 185).strokePath();
    pipes.beginPath().moveTo(1580, 110).lineTo(1320, 110).lineTo(1320, 195).strokePath();
    pipes.lineStyle(5, 0xb68643, 0.9);
    pipes.beginPath().moveTo(20, 120).lineTo(300, 120).lineTo(300, 185).strokePath();
    pipes.beginPath().moveTo(1580, 110).lineTo(1320, 110).lineTo(1320, 195).strokePath();
    this.root.add(pipes);
  }

  snapshot(): object {
    return this.gearbox.snapshot();
  }
}

export class AlchemyLightingRig {
  readonly root: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, reducedMotion: boolean) {
    this.root = scene.add.container(0, 0).setDepth(80);
    for (const spec of [
      { x: 710, y: 425, r: 270, color: 0xe3914a, alpha: 0.085 },
      { x: 1180, y: 675, r: 250, color: 0x61b6cf, alpha: 0.055 }
    ]) {
      const glow = scene.add.circle(spec.x, spec.y, spec.r, spec.color, spec.alpha).setBlendMode(Phaser.BlendModes.ADD);
      this.root.add(glow);
      if (!reducedMotion) scene.tweens.add({ targets: glow, alpha: spec.alpha * 1.5, duration: 1500, yoyo: true, repeat: -1 });
    }
    this.root.add(scene.add.graphics().fillStyle(0x08050c, 0.28).fillRect(0, 0, STAGE.width, 85)
      .fillStyle(0x08050c, 0.34).fillRect(0, 825, STAGE.width, 75));
  }
}
