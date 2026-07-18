import Phaser from 'phaser';
import { createAcademyPhaserTextStyle } from '../../../../../assets/academy/fonts/runtime/academy-typography';

import type { PotionType } from '../simulation';
import { DESTINATIONS, PERSPECTIVE, RECEIVER_FRAMES } from './config';

export class ConveyorRig {
  readonly root: Phaser.GameObjects.Container;
  readonly queueAnchors = PERSPECTIVE.queue;

  constructor(scene: Phaser.Scene) {
    this.root = scene.add.container(0, 0).setDepth(15);
    const bed = scene.add.graphics().fillStyle(0x241419, 0.98).fillPoints([
      new Phaser.Math.Vector2(700, 245), new Phaser.Math.Vector2(900, 245), new Phaser.Math.Vector2(1385, 900), new Phaser.Math.Vector2(215, 900)
    ], true).lineStyle(12, 0x3d2727, 1).strokePoints([
      new Phaser.Math.Vector2(700, 245), new Phaser.Math.Vector2(900, 245), new Phaser.Math.Vector2(1385, 900), new Phaser.Math.Vector2(215, 900)
    ], true).lineStyle(4, 0xd09a4f, 0.82).strokePoints([
      new Phaser.Math.Vector2(710, 253), new Phaser.Math.Vector2(890, 253), new Phaser.Math.Vector2(1365, 892), new Phaser.Math.Vector2(235, 892)
    ], true);
    this.root.add(bed);
    for (let i = 0; i < 8; i += 1) {
      const t = i / 7;
      this.root.add(scene.add.tileSprite(800, Phaser.Math.Linear(270, 850, t), Phaser.Math.Linear(155, 1050, t), 28, 'timber')
        .setTint(0x81503a).setAlpha(0.9));
    }
  }
}

export class InspectionApertureRig {
  readonly mask: Phaser.Display.Masks.GeometryMask;
  readonly center = PERSPECTIVE.aperture;

  constructor(scene: Phaser.Scene) {
    const corridor = scene.add.container(0, 0).setDepth(16);
    corridor.add(scene.add.graphics().fillStyle(0x100b12, 0.44).fillRoundedRect(650, 365, 300, 285, 72)
      .lineStyle(10, 0x2b2022, 0.92).beginPath().moveTo(710, 365).lineTo(650, 650).moveTo(890, 365).lineTo(950, 650).strokePath());
    for (const [y, width] of [[405, 180], [468, 220], [532, 260], [602, 292]]) {
      corridor.add(scene.add.tileSprite(800, y, width, 22, 'timber').setTint(0x4b3029).setAlpha(0.55));
    }
    scene.add.ellipse(800, 565, 218, 230, 0x0b0810, 0.5).setDepth(26);
    const frameRoot = scene.add.container(0, 0).setDepth(28);
    frameRoot.add([
      scene.add.tileSprite(800, 345, 430, 56, 'iron').setTint(0x4f4149).setAlpha(0.96),
      scene.add.tileSprite(610, 505, 52, 320, 'iron').setTint(0x4f4149).setAlpha(0.96),
      scene.add.tileSprite(990, 505, 52, 320, 'iron').setTint(0x4f4149).setAlpha(0.96),
      scene.add.tileSprite(800, 665, 430, 48, 'iron').setTint(0x4f4149).setAlpha(0.96),
      scene.add.graphics().lineStyle(24, 0x392a2b, 1).strokeRoundedRect(615, 330, 370, 350, 95)
        .lineStyle(9, 0xc3914b, 0.96).strokeRoundedRect(635, 350, 330, 310, 82)
        .lineStyle(3, 0xf0c771, 0.75).strokeRoundedRect(652, 367, 296, 276, 70)
    ]);
    const maskShape = scene.add.graphics().setVisible(false).fillRoundedRect(650, 365, 300, 285, 72);
    this.mask = maskShape.createGeometryMask();
    scene.add.graphics().setDepth(34).lineStyle(12, 0x392a2b, 1).strokeRoundedRect(635, 350, 330, 310, 82)
      .lineStyle(4, 0xe0b45e, 0.9).beginPath().moveTo(670, 642).lineTo(930, 642).strokePath();
  }
}

export interface StationContract {
  type: PotionType;
  x: number;
  y: number;
  mask: Phaser.Display.Masks.GeometryMask;
  hitbox: Phaser.GameObjects.Zone;
  dropBounds: Phaser.Geom.Rectangle;
  hoverHalo: Phaser.GameObjects.Ellipse;
}

export class SortingStationRig {
  readonly root: Phaser.GameObjects.Container;
  readonly stations = new Map<PotionType, StationContract>();

  constructor(scene: Phaser.Scene, onChoose: (type: PotionType) => void) {
    this.root = scene.add.container(0, 0).setDepth(35);
    this.root.add([
      scene.add.tileSprite(800, 815, 1450, 170, 'timber').setTint(0x68402f).setAlpha(0.84),
      scene.add.graphics().fillStyle(0x21141a, 0.96).fillPoints([
        new Phaser.Math.Vector2(150, 675), new Phaser.Math.Vector2(1450, 675), new Phaser.Math.Vector2(1570, 900), new Phaser.Math.Vector2(30, 900)
      ], true).lineStyle(8, 0x352026, 1).beginPath().moveTo(150, 675).lineTo(1450, 675).strokePath()
    ]);
    for (const spec of DESTINATIONS) {
      const stationRoot = scene.add.container(spec.x, spec.y);
      stationRoot.add([
        scene.add.graphics().fillStyle(0x130d14, 0.96).fillRoundedRect(-130, -95, 260, 205, 34)
          .lineStyle(9, 0x39242a, 1).strokeRoundedRect(-130, -95, 260, 205, 34)
          .lineStyle(5, spec.color, 0.96).strokeRoundedRect(-115, -80, 230, 170, 28),
        scene.add.image(0, 0, 'potion-sheet', `${spec.type}-receiver`).setDisplaySize(165, 159).setAlpha(0.94),
        scene.add.tileSprite(0, 105, 180, 42, 'parchment').setTint(0xe1bd7c),
        scene.add.text(0, 104, spec.label, createAcademyPhaserTextStyle('compact-label', {
          fontSize: '17px', color: '#2c1c18', align: 'center', stroke: 'transparent', strokeThickness: 0
        })).setOrigin(0.5)
      ]);
      this.root.add(stationRoot);
      const mask = scene.add.graphics().setVisible(false).fillRoundedRect(spec.x - 76, spec.y - 70, 152, 142, 42).createGeometryMask();
      const hoverHalo = scene.add.ellipse(spec.x, spec.y - 2, 246, 196, spec.color, 0)
        .setStrokeStyle(8, spec.color, 0.95).setDepth(69);
      const hitbox = scene.add.zone(spec.x, spec.y, 280, 230).setDepth(70).setInteractive({ useHandCursor: true });
      hitbox.on('pointerdown', () => onChoose(spec.type));
      const dropBounds = new Phaser.Geom.Rectangle(spec.x - 125, spec.y - 100, 250, 200);
      this.stations.set(spec.type, { type: spec.type, x: spec.x, y: spec.y, mask, hitbox, dropBounds, hoverHalo });
      void RECEIVER_FRAMES[spec.type];
    }
    const lip = scene.add.graphics().setDepth(52);
    for (const spec of DESTINATIONS) {
      lip.fillStyle(0x24171b, 1).fillRoundedRect(spec.x - 115, spec.y + 25, 230, 62, 18)
        .lineStyle(5, 0x7a4d30, 1).strokeRoundedRect(spec.x - 115, spec.y + 25, 230, 62, 18)
        .lineStyle(3, 0xd09a4f, 0.76).beginPath().moveTo(spec.x - 98, spec.y + 37).lineTo(spec.x + 98, spec.y + 37).strokePath();
    }
  }

  station(type: PotionType): StationContract {
    const station = this.stations.get(type);
    if (!station) throw new Error(`Missing sorting station for ${type}.`);
    return station;
  }

  receiverAt(x: number, y: number): PotionType | null {
    for (const [type, station] of this.stations) {
      if (Phaser.Geom.Rectangle.Contains(station.dropBounds, x, y)) return type;
    }
    return null;
  }

  setDragHover(type: PotionType | null): void {
    this.stations.forEach(({ hoverHalo }, stationType) => hoverHalo.setFillStyle(hoverHalo.fillColor, stationType === type ? 0.12 : 0));
  }

  setEnabled(enabled: boolean): void {
    this.stations.forEach(({ hitbox }) => { hitbox.input!.enabled = enabled; });
  }
}
