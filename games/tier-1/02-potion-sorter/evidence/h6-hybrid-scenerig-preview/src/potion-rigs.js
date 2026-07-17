import { PERSPECTIVE } from './config.js';

export class PotionActorRig {
  constructor(scene, potionId, x, y, scale = 1, depth = 25) {
    this.scene = scene;
    this.potionId = potionId;
    this.actorId = `potion-${potionId}`;
    this.ownerRig = 'PotionQueuePresentation';
    this.anchorState = 'unassigned';
    this.activeMask = null;
    this.root = scene.add.container(x, y).setDepth(depth).setScale(scale);
    this.shadow = scene.add.ellipse(0, 89, 112, 27, 0x050308, 0.5);
    this.glow = scene.add.circle(0, 2, 90, this.colorFor(potionId), 0.12).setBlendMode(Phaser.BlendModes.ADD);
    this.sprite = scene.add.image(0, 0, 'potion-sheet', potionId).setOrigin(0.5);
    this.root.add([this.shadow, this.glow, this.sprite]);
  }

  colorFor(id) {
    return { red: 0xef625b, blue: 0x5ab7ef, green: 0x75ca78 }[id] || 0xe8b665;
  }

  setOwner(ownerRig, anchorState) {
    this.ownerRig = ownerRig;
    this.anchorState = anchorState;
    return this;
  }

  applyMask(mask, maskName) {
    this.root.setMask(mask);
    this.activeMask = maskName;
    return this;
  }

  clearMask() {
    this.root.clearMask();
    this.activeMask = null;
    return this;
  }

  setVisible(value) { this.root.setVisible(value); return this; }
  setAlpha(value) { this.root.setAlpha(value); return this; }
  setPosition(x, y) { this.root.setPosition(x, y); return this; }
  setScale(value) { this.root.setScale(value); return this; }
  setDepth(value) { this.root.setDepth(value); return this; }

  snapshot() {
    return {
      actorId: this.actorId,
      potionId: this.potionId,
      ownerRig: this.ownerRig,
      anchorState: this.anchorState,
      depth: this.root.depth,
      activeMask: this.activeMask,
      visible: this.root.visible,
      alpha: this.root.alpha,
      position: { x: Math.round(this.root.x), y: Math.round(this.root.y) },
      scale: Number(this.root.scaleX.toFixed(3)),
    };
  }
}

export class PotionQueuePresentation {
  constructor(scene, aperture) {
    this.scene = scene;
    this.actors = [
      new PotionActorRig(scene, 'green', PERSPECTIVE.queue[0].x, PERSPECTIVE.queue[0].y, PERSPECTIVE.queue[0].scale, PERSPECTIVE.queue[0].depth)
        .setOwner('PotionQueuePresentation', 'queue.rear'),
      new PotionActorRig(scene, 'blue', PERSPECTIVE.queue[1].x, PERSPECTIVE.queue[1].y, PERSPECTIVE.queue[1].scale, PERSPECTIVE.queue[1].depth)
        .setOwner('PotionQueuePresentation', 'queue.middle'),
      new PotionActorRig(scene, 'red', PERSPECTIVE.aperture.x, PERSPECTIVE.aperture.y, 0.88, 32)
        .setOwner('InspectionApertureRig', 'inspection')
        .applyMask(aperture.mask, 'aperture-local'),
    ];
    this.actorsById = new Map(this.actors.map((actor) => [actor.potionId, actor]));
  }

  actor(id) { return this.actorsById.get(id); }
}
