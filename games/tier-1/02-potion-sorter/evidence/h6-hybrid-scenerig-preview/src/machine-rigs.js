import { DESTINATIONS, PERSPECTIVE } from './config.js';

export class ConveyorRig {
  constructor(scene) {
    this.scene = scene;
    this.root = scene.add.container(0, 0).setDepth(15);
    this.queueAnchors = PERSPECTIVE.queue;
    this.build();
  }

  build() {
    const scene = this.scene;
    const bed = scene.add.graphics();
    bed.fillStyle(0x241419, 0.98).fillPoints([
      PERSPECTIVE.conveyor.farLeft, PERSPECTIVE.conveyor.farRight,
      PERSPECTIVE.conveyor.nearRight, PERSPECTIVE.conveyor.nearLeft,
    ], true);
    bed.lineStyle(12, 0x3d2727, 1).strokePoints([
      PERSPECTIVE.conveyor.farLeft, PERSPECTIVE.conveyor.farRight,
      PERSPECTIVE.conveyor.nearRight, PERSPECTIVE.conveyor.nearLeft,
    ], true);
    bed.lineStyle(4, 0xd09a4f, 0.82).strokePoints([
      { x: 710, y: 253 }, { x: 890, y: 253 },
      { x: 1365, y: 892 }, { x: 235, y: 892 },
    ], true);
    this.root.add(bed);

    for (let i = 0; i < 8; i += 1) {
      const t = i / 7;
      const x = 800;
      const y = Phaser.Math.Linear(270, 850, t);
      const width = Phaser.Math.Linear(155, 1050, t);
      const slat = scene.add.tileSprite(x, y, width, 28, 'timber')
        .setTint(0x81503a).setAlpha(0.9);
      this.root.add(slat);
    }

    const side = scene.add.graphics();
    side.lineStyle(18, 0x2c2023, 1).beginPath().moveTo(700, 245).lineTo(215, 900).strokePath();
    side.beginPath().moveTo(900, 245).lineTo(1385, 900).strokePath();
    side.lineStyle(5, 0xba7b38, 0.9).beginPath().moveTo(700, 245).lineTo(215, 900).strokePath();
    side.beginPath().moveTo(900, 245).lineTo(1385, 900).strokePath();
    this.root.add(side);
  }
}

export class InspectionApertureRig {
  constructor(scene) {
    this.scene = scene;
    this.corridorRoot = scene.add.container(0, 0).setDepth(16);
    this.focusRoot = scene.add.container(0, 0).setDepth(26);
    this.root = scene.add.container(0, 0).setDepth(28);
    this.center = PERSPECTIVE.aperture;
    this.depthContract = Object.freeze({
      corridor: 16,
      boundedFocus: 26,
      rearPotion: 27,
      upperCrossbar: 28,
      middlePotion: 30,
      activePotion: 32,
      foregroundRim: 34,
      broadOpaqueInterior: false,
      continuousConveyor: true,
    });
    this.build();
  }

  build() {
    const scene = this.scene;
    const corridorShade = scene.add.graphics();
    corridorShade.fillStyle(0x100b12, 0.44).fillRoundedRect(650, 365, 300, 285, 72);
    const corridorRails = scene.add.graphics();
    corridorRails.lineStyle(10, 0x2b2022, 0.92).beginPath().moveTo(710, 365).lineTo(650, 650).strokePath();
    corridorRails.beginPath().moveTo(890, 365).lineTo(950, 650).strokePath();
    corridorRails.lineStyle(3, 0xb77d3e, 0.72).beginPath().moveTo(716, 365).lineTo(662, 650).strokePath();
    corridorRails.beginPath().moveTo(884, 365).lineTo(938, 650).strokePath();
    this.corridorRoot.add([corridorShade, corridorRails]);

    for (const [y, width] of [[405, 180], [468, 220], [532, 260], [602, 292]]) {
      this.corridorRoot.add(scene.add.tileSprite(800, y, width, 22, 'timber').setTint(0x4b3029).setAlpha(0.55));
    }

    const focusField = scene.add.ellipse(800, 565, 218, 230, 0x0b0810, 0.5);
    this.focusRoot.add(focusField);

    const housingTop = scene.add.tileSprite(800, 345, 430, 56, 'iron').setTint(0x4f4149).setAlpha(0.96);
    const housingLeft = scene.add.tileSprite(610, 505, 52, 320, 'iron').setTint(0x4f4149).setAlpha(0.96);
    const housingRight = scene.add.tileSprite(990, 505, 52, 320, 'iron').setTint(0x4f4149).setAlpha(0.96);
    const housingBottom = scene.add.tileSprite(800, 665, 430, 48, 'iron').setTint(0x4f4149).setAlpha(0.96);
    const frame = scene.add.graphics();
    frame.lineStyle(24, 0x392a2b, 1).strokeRoundedRect(615, 330, 370, 350, 95);
    frame.lineStyle(9, 0xc3914b, 0.96).strokeRoundedRect(635, 350, 330, 310, 82);
    frame.lineStyle(3, 0xf0c771, 0.75).strokeRoundedRect(652, 367, 296, 276, 70);
    const brassTop = scene.add.tileSprite(800, 357, 230, 8, 'brass').setTint(0xd8a55b).setAlpha(0.82);
    const brassBottom = scene.add.tileSprite(800, 653, 230, 8, 'brass').setTint(0xd8a55b).setAlpha(0.82);
    const brassLeft = scene.add.tileSprite(642, 505, 8, 190, 'brass').setTint(0xd8a55b).setAlpha(0.76);
    const brassRight = scene.add.tileSprite(958, 505, 8, 190, 'brass').setTint(0xd8a55b).setAlpha(0.76);
    this.root.add([housingTop, housingLeft, housingRight, housingBottom, frame, brassTop, brassBottom, brassLeft, brassRight]);

    for (const [x, y] of [[642, 357], [958, 357], [642, 653], [958, 653]]) {
      const bolt = scene.add.circle(x, y, 10, 0xd1a55d).setStrokeStyle(3, 0x5b3b23);
      this.root.add(bolt);
    }
    const label = scene.add.text(800, 315, 'INSPECTION APERTURE', {
      fontFamily: 'Cinzel', fontSize: '19px', color: '#f0c36e', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5).setVisible(false);
    this.root.add(label);

    this.maskShape = scene.make.graphics({ x: 0, y: 0, add: false });
    this.maskShape.fillStyle(0xffffff).fillRoundedRect(650, 365, 300, 285, 72);
    this.mask = this.maskShape.createGeometryMask();

    this.foregroundRim = scene.add.graphics().setDepth(34);
    this.foregroundRim.lineStyle(12, 0x392a2b, 1).strokeRoundedRect(635, 350, 330, 310, 82);
    this.foregroundRim.lineStyle(4, 0xe0b45e, 0.9).beginPath()
      .moveTo(670, 642).lineTo(930, 642).strokePath();
  }

  applyLocalMask(displayObject) {
    displayObject.setMask(this.mask);
  }
}

export class SortingStationRig {
  constructor(scene) {
    this.scene = scene;
    this.root = scene.add.container(0, 0).setDepth(35);
    this.stations = new Map();
    this.build();
  }

  build() {
    const scene = this.scene;
    const bench = scene.add.tileSprite(800, 815, 1450, 170, 'timber').setTint(0x68402f).setAlpha(0.84);
    const benchTrim = scene.add.graphics();
    benchTrim.fillStyle(0x21141a, 0.96).fillPoints([{ x: 150, y: 675 }, { x: 1450, y: 675 }, { x: 1570, y: 900 }, { x: 30, y: 900 }], true);
    benchTrim.lineStyle(8, 0x352026, 1).beginPath().moveTo(150, 675).lineTo(1450, 675).strokePath();
    benchTrim.lineStyle(4, 0xc18a45, 0.9).beginPath().moveTo(170, 690).lineTo(1430, 690).strokePath();
    this.root.add([bench, benchTrim]);

    for (const spec of DESTINATIONS) {
      const root = scene.add.container(spec.x, spec.y);
      const housing = scene.add.graphics();
      housing.fillStyle(0x130d14, 0.96).fillRoundedRect(-130, -95, 260, 205, 34);
      housing.lineStyle(9, 0x39242a, 1).strokeRoundedRect(-130, -95, 260, 205, 34);
      housing.lineStyle(5, spec.color, 0.96).strokeRoundedRect(-115, -80, 230, 170, 28);
      const plate = scene.add.circle(0, 5, 84, 0x130d14, 0.92).setStrokeStyle(7, spec.color, 0.95);
      const slot = scene.add.image(0, 0, 'potion-sheet', spec.frame).setDisplaySize(165, 159).setAlpha(0.94);
      const tag = scene.add.tileSprite(0, 105, 180, 42, 'parchment').setTint(0xe1bd7c);
      const text = scene.add.text(0, 104, spec.label, {
        fontFamily: 'Cinzel', fontSize: '17px', color: '#2c1c18', fontStyle: 'bold', letterSpacing: 2,
      }).setOrigin(0.5);
      const socket = scene.add.circle(98, -68, 13, 0x1a1118).setStrokeStyle(3, 0x8a6845);
      root.add([housing, plate, slot, socket, tag, text]);
      this.root.add(root);

      const maskShape = scene.make.graphics({ x: 0, y: 0, add: false });
      maskShape.fillStyle(0xffffff).fillRoundedRect(spec.x - 76, spec.y - 70, 152, 142, 42);
      this.stations.set(spec.id, { ...spec, root, mask: maskShape.createGeometryMask() });
    }

    this.foregroundLip = scene.add.graphics().setDepth(52);
    for (const spec of DESTINATIONS) {
      this.foregroundLip.fillStyle(0x24171b, 1).fillRoundedRect(spec.x - 115, spec.y + 25, 230, 62, 18);
      this.foregroundLip.lineStyle(5, 0x7a4d30, 1).strokeRoundedRect(spec.x - 115, spec.y + 25, 230, 62, 18);
      this.foregroundLip.lineStyle(3, 0xd09a4f, 0.76).beginPath().moveTo(spec.x - 98, spec.y + 37).lineTo(spec.x + 98, spec.y + 37).strokePath();
    }
  }

  station(id) { return this.stations.get(id); }
}
