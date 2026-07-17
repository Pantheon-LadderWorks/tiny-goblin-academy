import { ASSETS, DESTINATIONS, PERSPECTIVE, POTION_FRAMES, STAGE, queryOptions } from './config.js';
import { AlchemyLightingRig, PotionRoomRig } from './environment-rigs.js';
import { ConveyorRig, InspectionApertureRig, SortingStationRig } from './machine-rigs.js';
import { PotionQueuePresentation } from './potion-rigs.js';

const CANONICAL_OCCUPANCY = Object.freeze({
  initial: { 'queue.rear': 'green', 'queue.middle': 'blue', inspection: 'red' },
  'red-accepted': { 'queue.middle': 'green', inspection: 'blue', 'destination.red': 'red' },
  'blue-accepted': { inspection: 'green', 'destination.red': 'red', 'destination.blue': 'blue' },
  finished: { 'destination.red': 'red', 'destination.blue': 'blue', 'destination.green': 'green' },
});

export class PreviewScene extends Phaser.Scene {
  constructor() {
    super('PotionSorterHybridPreview');
    this.options = queryOptions();
    this.timelinePhase = 'boot';
    this.timelineAudit = [];
  }

  preload() {
    Object.entries(ASSETS).forEach(([key, url]) => this.load.image(key === 'potionSheet' ? 'potion-sheet' : key, url));
  }

  create() {
    this.registerPotionFrames();
    this.cameras.main.setBackgroundColor('#09060d');
    this.room = new PotionRoomRig(this, this.options.reducedMotion);
    this.conveyor = new ConveyorRig(this);
    this.aperture = new InspectionApertureRig(this);
    this.sorting = new SortingStationRig(this);
    this.queue = new PotionQueuePresentation(this, this.aperture);
    this.actors = this.queue.actorsById;
    this.lighting = new AlchemyLightingRig(this, this.options.reducedMotion);
    this.createHud();
    this.applyState(this.options.state);
    if (this.options.silhouette) {
      this.room.root.setAlpha(0.16);
      this.lighting.root.setVisible(false);
      this.hudObjects.forEach((object) => object.setVisible(false));
    }
    this.applyResponsiveCamera(this.scale.width, this.scale.height);
    this.scale.on('resize', ({ width, height }) => this.applyResponsiveCamera(width, height));
    if (this.options.debug) this.createDiagnostics();
    if (this.options.perspective) this.createPerspectiveGuide();
    this.publishState();
    if (this.options.autoplay && !this.options.reducedMotion) this.runDemoCycle();
  }

  registerPotionFrames() {
    const texture = this.textures.get('potion-sheet');
    for (const [name, frame] of Object.entries(POTION_FRAMES)) {
      if (!texture.has(name)) texture.add(name, 0, frame.x, frame.y, frame.width, frame.height);
    }
  }

  actor(id) { return this.actors.get(id); }

  createHud() {
    this.hudObjects = [];
    const metrics = [
      { x: 390, label: 'TIME  00:45' },
      { x: 800, label: 'SCORE  0120' },
      { x: 1210, label: 'COMBO  ×2' },
    ];
    for (const metric of metrics) {
      const plate = this.add.tileSprite(metric.x, 68, 310, 64, 'parchment').setTint(0xd6b073).setDepth(91);
      const border = this.add.graphics().setDepth(92);
      border.lineStyle(5, 0x39232a, 1).strokeRoundedRect(metric.x - 160, 32, 320, 72, 28);
      border.lineStyle(2, 0xc68f4a, 0.9).strokeRoundedRect(metric.x - 151, 41, 302, 54, 22);
      const text = this.add.text(metric.x, 68, metric.label, {
        fontFamily: 'Cinzel', fontSize: '20px', color: '#2d1b1a', fontStyle: 'bold', letterSpacing: 2,
      }).setOrigin(0.5).setDepth(93);
      this.hudObjects.push(plate, border, text);
    }
    const instructionPlate = this.add.tileSprite(800, 158, 620, 82, 'parchment').setTint(0xd6b073).setDepth(91);
    this.instruction = this.add.text(800, 145, 'CURRENT FORMULA: EMBER RED', {
      fontFamily: 'Cinzel', fontSize: '18px', color: '#2b1a18', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5).setDepth(92);
    this.status = this.add.text(800, 178, 'SELECT POTION · CHOOSE DESTINATION', {
      fontFamily: 'Caudex', fontSize: '15px', color: '#4a2b21', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(92);
    this.hudObjects.push(instructionPlate, this.instruction, this.status);
  }

  applyResponsiveCamera(width, height) {
    const zoom = Math.max(width / STAGE.width, height / STAGE.height);
    this.cameras.main.setZoom(zoom).centerOn(STAGE.centerX, STAGE.centerY);
    this.viewportAudit = {
      viewport: { width, height }, logicalStage: STAGE, zoom,
      horizontalCrop: Math.max(0, STAGE.width - width / zoom),
      verticalCrop: Math.max(0, STAGE.height - height / zoom),
      protectedCenterVisible: width / zoom >= 1420 && height / zoom >= 850,
      blackVoid: false,
    };
  }

  resetActors() {
    for (const actor of this.queue.actors) actor.clearMask().setVisible(true).setAlpha(1);
  }

  placeQueue(id, role) {
    const anchor = role === 'rear' ? PERSPECTIVE.queue[0] : PERSPECTIVE.queue[1];
    this.actor(id).clearMask().setPosition(anchor.x, anchor.y).setScale(anchor.scale).setDepth(anchor.depth)
      .setOwner('PotionQueuePresentation', `queue.${role}`);
  }

  placeInspection(id) {
    this.actor(id).clearMask().setPosition(PERSPECTIVE.aperture.x, PERSPECTIVE.aperture.y).setScale(0.88).setDepth(32)
      .setOwner('InspectionApertureRig', 'inspection').applyMask(this.aperture.mask, 'aperture-local');
  }

  placeDestination(id) {
    const station = this.sorting.station(id);
    this.actor(id).clearMask().setPosition(station.x, station.y).setScale(0.78).setDepth(42)
      .setOwner('SortingStationRig', `destination.${id}`).applyMask(station.mask, `destination-${id}-local`);
  }

  applyState(state) {
    this.resetActors();
    this.placeQueue('green', 'rear');
    this.placeQueue('blue', 'middle');
    this.placeInspection('red');
    this.instruction.setText(this.options.reducedMotion ? 'REDUCED MOTION · EMBER RED READY' : 'CURRENT FORMULA: EMBER RED');

    if (state === 'red-travelling') {
      this.actor('red').clearMask().setPosition(PERSPECTIVE.branch.x, PERSPECTIVE.branch.y).setScale(PERSPECTIVE.branch.scale).setDepth(46)
        .setOwner('ForegroundTransferPath', 'transit.red');
    } else if (state === 'red-accepted') {
      this.placeDestination('red'); this.placeQueue('green', 'middle'); this.placeInspection('blue');
      this.instruction.setText('EMBER FORMULA · ACCEPTED');
    } else if (state === 'blue-travelling') {
      this.placeDestination('red'); this.placeQueue('green', 'middle');
      this.actor('blue').clearMask().setPosition(PERSPECTIVE.branch.x, PERSPECTIVE.branch.y).setScale(PERSPECTIVE.branch.scale).setDepth(46)
        .setOwner('ForegroundTransferPath', 'transit.blue');
    } else if (state === 'blue-accepted') {
      this.placeDestination('red'); this.placeDestination('blue'); this.placeInspection('green');
      this.instruction.setText('MOON FORMULA · ACCEPTED');
    } else if (state === 'green-travelling') {
      this.placeDestination('red'); this.placeDestination('blue');
      this.actor('green').clearMask().setPosition(PERSPECTIVE.branch.x, PERSPECTIVE.branch.y).setScale(PERSPECTIVE.branch.scale).setDepth(46)
        .setOwner('ForegroundTransferPath', 'transit.green');
    } else if (state === 'finished') {
      for (const id of ['red', 'blue', 'green']) this.placeDestination(id);
      this.instruction.setText('ALL FORMULAE CORRECTLY CONTAINED');
      this.add.text(800, 520, 'SORTING COMPLETE', {
        fontFamily: 'Cinzel Decorative', fontSize: '28px', color: '#f2cc78', fontStyle: 'bold', letterSpacing: 2,
      }).setOrigin(0.5).setDepth(55);
    }
    this.timelinePhase = state === 'queue' ? 'initial' : state;
  }

  createDiagnostics() {
    const g = this.add.graphics().setDepth(100);
    g.fillStyle(0x34b9d8, 0.045).fillRect(690, 235, 220, 130);
    g.fillStyle(0xe2a84c, 0.045).fillRect(560, 365, 480, 250);
    g.fillStyle(0xe85db6, 0.04).fillRect(120, 635, 1360, 250);
    g.lineStyle(3, 0x49dcff, 0.9);
    for (const actor of this.queue.actors) g.strokeRect(actor.root.x - 70 * actor.root.scaleX, actor.root.y - 96 * actor.root.scaleY, 140 * actor.root.scaleX, 192 * actor.root.scaleY);
    g.lineStyle(3, 0xffa23f, 0.95).strokeRoundedRect(650, 365, 300, 285, 72);
    g.lineStyle(3, 0x65f29a, 0.9);
    for (const spec of DESTINATIONS) g.strokeRoundedRect(spec.x - 76, spec.y - 70, 152, 142, 42);
    g.lineStyle(2, 0xf45ce3, 0.9);
    for (const spec of DESTINATIONS) g.strokeRoundedRect(spec.x - 130, spec.y - 110, 260, 235, 34);
    g.lineStyle(2, 0xffed65, 0.95);
    for (const point of [...this.conveyor.queueAnchors, PERSPECTIVE.approach, this.aperture.center, ...DESTINATIONS]) {
      g.beginPath().moveTo(point.x - 10, point.y).lineTo(point.x + 10, point.y)
        .moveTo(point.x, point.y - 10).lineTo(point.x, point.y + 10).strokePath();
    }
    const actorLines = this.queue.actors.map((actor) => {
      const s = actor.snapshot();
      return `${s.actorId} · ${s.ownerRig}\n${s.anchorState} · z${s.depth} · ${s.activeMask || 'no-mask'} · visible=${s.visible} α=${s.alpha}`;
    }).join('\n\n');
    this.add.text(42, 128, `ACTOR IDENTITY / OWNERSHIP\n\n${actorLines}`, {
      fontFamily: 'Outfit', fontSize: '14px', color: '#f7edf8', backgroundColor: '#130d18ee', padding: { x: 14, y: 12 },
    }).setDepth(101);
  }

  createPerspectiveGuide() {
    const g = this.add.graphics().setDepth(104);
    g.lineStyle(4, 0xffeb62, 0.95).beginPath().moveTo(800, 150).lineTo(800, 895).strokePath();
    g.lineStyle(4, 0x4ee4ff, 0.95).beginPath().moveTo(700, 245).lineTo(215, 900).strokePath();
    g.beginPath().moveTo(900, 245).lineTo(1385, 900).strokePath();
    g.fillStyle(0xffeb62, 1).fillCircle(PERSPECTIVE.vanishingPoint.x, PERSPECTIVE.vanishingPoint.y, 10);
    g.lineStyle(3, 0xffeb62, 1);
    for (const point of [...PERSPECTIVE.queue, PERSPECTIVE.approach, PERSPECTIVE.aperture, PERSPECTIVE.branch, ...DESTINATIONS]) {
      g.strokeCircle(point.x, point.y, 13);
      g.beginPath().moveTo(point.x - 18, point.y).lineTo(point.x + 18, point.y)
        .moveTo(point.x, point.y - 18).lineTo(point.x, point.y + 18).strokePath();
    }
    this.add.text(820, 210, 'VANISHING POINT', { fontFamily: 'Outfit', fontSize: '15px', color: '#fff49a', backgroundColor: '#100b14cc', padding: { x: 8, y: 5 } }).setDepth(105);
    this.add.text(820, 675, 'FOREGROUND BRANCH', { fontFamily: 'Outfit', fontSize: '15px', color: '#fff49a', backgroundColor: '#100b14cc', padding: { x: 8, y: 5 } }).setDepth(105);
  }

  moveActor(actor, point, duration, ownerRig, anchorState, depth) {
    actor.clearMask().setVisible(true).setAlpha(1).setOwner(ownerRig, anchorState).setDepth(depth);
    return new Promise((resolve) => {
      this.tweens.add({ targets: actor.root, x: point.x, y: point.y, scale: point.scale, duration, ease: 'Sine.inOut', onComplete: resolve });
    });
  }

  setTimelinePhase(phase) {
    this.timelinePhase = phase;
    const audit = this.auditActorLifecycle(phase);
    this.timelineAudit.push(audit);
    this.publishState();
    if (!audit.passed) throw new Error(`Actor lifecycle violation at ${phase}: ${audit.errors.join('; ')}`);
  }

  occupancy() {
    return Object.fromEntries(this.queue.actors.map((actor) => [actor.anchorState, actor.potionId]));
  }

  auditActorLifecycle(phase) {
    const actors = this.queue.actors.map((actor) => actor.snapshot());
    const errors = [];
    const ids = actors.map((actor) => actor.actorId);
    if (actors.length !== 3 || new Set(ids).size !== 3) errors.push('expected exactly three stable actor IDs');
    if (actors.some((actor) => !actor.ownerRig)) errors.push('every actor must have exactly one owner');
    const inTransit = actors.filter((actor) => actor.anchorState.startsWith('transit.') || actor.anchorState.includes('approach'));
    if (inTransit.some((actor) => !actor.visible || actor.alpha <= 0)) errors.push('in-transit actor became invisible');
    if (inTransit.some((actor) => actor.activeMask)) errors.push('in-transit actor received a premature mask');
    const expected = CANONICAL_OCCUPANCY[phase];
    if (expected) {
      const actual = this.occupancy();
      const occupancyMatches = Object.keys(actual).length === Object.keys(expected).length
        && Object.entries(expected).every(([anchor, potion]) => actual[anchor] === potion);
      if (!occupancyMatches) errors.push(`occupancy ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
    }
    return { phase, passed: errors.length === 0, errors, actors, occupancy: this.occupancy() };
  }

  async advanceToInspection(id, fromRole, nextQueueMove = null) {
    const actor = this.actor(id);
    const approachDuration = this.options.evidencePacing ? 1500 : 620;
    const entryDuration = this.options.evidencePacing ? 1700 : 680;
    this.setTimelinePhase(`${id}-approach`);
    const advance = (async () => {
      await this.moveActor(actor, PERSPECTIVE.approach, approachDuration, 'PotionQueuePresentation', `approach.${id}`, PERSPECTIVE.approach.depth);
      await this.moveActor(actor, { ...PERSPECTIVE.aperture, scale: 0.88 }, entryDuration, 'InspectionApertureRig', `inspection-entry.${id}`, 32);
      actor.setOwner('InspectionApertureRig', 'inspection').applyMask(this.aperture.mask, 'aperture-local');
    })();
    await Promise.all([advance, nextQueueMove || Promise.resolve()]);
  }

  async advanceRearToMiddle(actor) {
    const crossing = { x: 800, y: 372, scale: 0.41 };
    const behindDuration = this.options.evidencePacing ? 5200 : 420;
    const emergeDuration = this.options.evidencePacing ? 1800 : 340;
    await this.moveActor(actor, crossing, behindDuration, 'PotionQueuePresentation', `gantry-crossing.${actor.potionId}`, this.aperture.depthContract.rearPotion);
    await this.moveActor(actor, PERSPECTIVE.queue[1], emergeDuration, 'PotionQueuePresentation', 'queue.middle', this.aperture.depthContract.middlePotion);
  }

  async sortActor(id) {
    const actor = this.actor(id);
    const station = this.sorting.station(id);
    const receiverDuration = this.options.evidencePacing ? 2200 : 900;
    actor.clearMask();
    await this.moveActor(actor, PERSPECTIVE.branch, 520, 'ForegroundTransferPath', `transit.${id}`, 46);
    this.setTimelinePhase(`${id}-receiver-entry`);
    await this.moveActor(actor, { x: station.x, y: station.y, scale: 0.78 }, receiverDuration, 'ForegroundTransferPath', `transit.${id}`, 46);
    actor.setDepth(42).setOwner('SortingStationRig', `destination.${id}`).applyMask(station.mask, `destination-${id}-local`);
  }

  async runDemoCycle() {
    const wait = (duration) => new Promise((resolve) => this.time.delayedCall(duration, resolve));
    const checkpointHold = this.options.evidencePacing ? 6000 : 700;
    this.applyState('initial');
    this.setTimelinePhase('initial');
    await wait(this.options.evidencePacing ? 1200 : 650);

    this.instruction.setText('EMBER FORMULA · SORTING');
    await this.sortActor('red');
    const greenToMiddle = this.advanceRearToMiddle(this.actor('green'));
    await this.advanceToInspection('blue', 'middle', greenToMiddle);
    this.instruction.setText('EMBER FORMULA · ACCEPTED');
    this.setTimelinePhase('red-accepted');
    await wait(checkpointHold);

    this.instruction.setText('MOON FORMULA · SORTING');
    await this.sortActor('blue');
    await this.advanceToInspection('green', 'middle');
    this.instruction.setText('MOON FORMULA · ACCEPTED');
    this.setTimelinePhase('blue-accepted');
    await wait(checkpointHold);

    this.instruction.setText('MOSS FORMULA · SORTING');
    await this.sortActor('green');
    this.instruction.setText('ALL FORMULAE CORRECTLY CONTAINED');
    this.setTimelinePhase('finished');
    await wait(checkpointHold);
    this.demoComplete = true;
    this.publishState();
  }

  publishState() {
    const actorSnapshots = this.queue.actors.map((actor) => actor.snapshot());
    window.__H6_PREVIEW_STATE__ = {
      ready: true,
      composition: 'C-hybrid',
      state: this.options.state,
      timelinePhase: this.timelinePhase,
      reducedMotion: this.options.reducedMotion,
      demoComplete: Boolean(this.demoComplete),
      viewportAudit: this.viewportAudit,
      rigParts: ['PotionRoomRig', 'ConveyorRig', 'InspectionApertureRig', 'SortingStationRig', 'PotionActorRig', 'PotionQueuePresentation', 'AlchemyLightingRig'],
      masks: { aperture: 'geometry-local', destinations: 'geometry-local', alphaMask: false, sceneMask: false },
      boundsIndependent: true,
      actorLifecycle: {
        passed: this.timelineAudit.every((audit) => audit.passed),
        stableActorIds: actorSnapshots.map((actor) => actor.actorId),
        visualActorCount: actorSnapshots.length,
        actors: actorSnapshots,
        occupancy: this.occupancy(),
        timelineAudit: this.timelineAudit,
        clonesCreated: false,
        invisibleHandoffs: false,
      },
      spatialContract: {
        vanishingPoint: PERSPECTIVE.vanishingPoint,
        apertureCenter: PERSPECTIVE.aperture,
        queueAnchors: [...PERSPECTIVE.queue, PERSPECTIVE.approach],
        conveyor: PERSPECTIVE.conveyor,
        branchPoint: PERSPECTIVE.branch,
        destinationCenters: DESTINATIONS.map(({ id, x, y }) => ({ id, x, y })),
        detachedSideModule: false,
        dominantDiagonalFeed: false,
        continuousPath: true,
        inspectionGantry: this.aperture.depthContract,
      },
    };
  }
}
