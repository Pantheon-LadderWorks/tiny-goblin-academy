import Phaser from 'phaser';

import type { PotionType, RoundPotion, RoundState } from '../simulation';
import { PERSPECTIVE, POTION_FRAMES } from './config';
import type { InspectionApertureRig, SortingStationRig } from './machine-rigs';

export class PotionActorRig {
  readonly root: Phaser.GameObjects.Container;
  readonly sprite: Phaser.GameObjects.Image;
  readonly glow: Phaser.GameObjects.Arc;
  ownerRig = 'PotionQueuePresentation';
  anchorState = 'hidden.future';
  activeMask: string | null = null;

  constructor(scene: Phaser.Scene, readonly entity: RoundPotion) {
    this.root = scene.add.container(PERSPECTIVE.queue[0].x, PERSPECTIVE.queue[0].y).setVisible(false);
    const tint = POTION_FRAMES[entity.type].tint ?? 0xe8b665;
    const shadow = scene.add.ellipse(0, 89, 112, 27, 0x050308, 0.5);
    this.glow = scene.add.circle(0, 2, 90, tint, 0.12).setBlendMode(Phaser.BlendModes.ADD);
    this.sprite = scene.add.image(0, 0, 'potion-sheet', entity.type).setOrigin(0.5);
    this.root.add([shadow, this.glow, this.sprite]);
  }

  setOwner(ownerRig: string, anchorState: string): this {
    this.ownerRig = ownerRig;
    this.anchorState = anchorState;
    return this;
  }

  applyMask(mask: Phaser.Display.Masks.GeometryMask, name: string): this {
    this.root.setMask(mask);
    this.activeMask = name;
    return this;
  }

  clearMask(): this {
    this.root.clearMask();
    this.activeMask = null;
    return this;
  }

  snapshot(): object {
    return {
      actorId: this.entity.id,
      potionType: this.entity.type,
      ownerRig: this.ownerRig,
      anchorState: this.anchorState,
      activeMask: this.activeMask,
      visible: this.root.visible,
      alpha: Number(this.root.alpha.toFixed(2)),
      depth: this.root.depth,
      position: { x: Math.round(this.root.x), y: Math.round(this.root.y) },
      scale: Number(this.root.scaleX.toFixed(3))
    };
  }
}

const ROUND_ENTITIES: RoundPotion[] = [
  { id: 'potion-0', type: 'sun' },
  { id: 'potion-1', type: 'moon' },
  { id: 'potion-2', type: 'star' },
  { id: 'potion-3', type: 'sun' },
  { id: 'potion-4', type: 'moon' },
  { id: 'potion-5', type: 'star' }
];

export class PotionQueuePresentation {
  readonly actors = new Map<string, PotionActorRig>();
  private readonly resolved = new Set<string>();
  private activeId: string | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly aperture: InspectionApertureRig,
    private readonly stations: SortingStationRig,
    onPointerDown: (pointer: Phaser.Input.Pointer) => void
  ) {
    ROUND_ENTITIES.forEach((entity) => this.actors.set(entity.id, new PotionActorRig(scene, entity)));
    const activeHitbox = scene.add.zone(PERSPECTIVE.aperture.x, PERSPECTIVE.aperture.y, 210, 250)
      .setDepth(71).setInteractive({ useHandCursor: true });
    activeHitbox.on('pointerdown', onPointerDown);
    this.activeHitbox = activeHitbox;
  }

  private readonly activeHitbox: Phaser.GameObjects.Zone;

  sync(state: RoundState): void {
    this.activeId = state.activePotionId;
    const queueIds = new Set([state.activePotionId, ...state.upcomingPotions.slice(0, 2).map((potion) => potion.id)]);
    this.actors.forEach((actor, id) => {
      if (this.resolved.has(id)) return;
      actor.root.setVisible(queueIds.has(id)).setAlpha(1);
      actor.sprite.clearTint();
    });

    if (state.activePotionId) {
      const active = this.actor(state.activePotionId);
      active.root.setPosition(PERSPECTIVE.aperture.x, PERSPECTIVE.aperture.y)
        .setScale(PERSPECTIVE.aperture.scale).setDepth(PERSPECTIVE.aperture.depth).setVisible(true);
      active.setOwner('InspectionApertureRig', 'inspection').applyMask(this.aperture.mask, 'aperture-local');
      active.glow.setAlpha(state.selectedPotion ? 0.34 : 0.12);
    }

    const [middle, rear] = state.upcomingPotions;
    if (middle) this.placeQueued(this.actor(middle.id), PERSPECTIVE.queue[1], 'queue.middle');
    if (rear) this.placeQueued(this.actor(rear.id), PERSPECTIVE.queue[0], 'queue.rear');
    this.activeHitbox.input!.enabled = !state.roundComplete && Boolean(state.activePotionId);
  }

  private placeQueued(actor: PotionActorRig, anchor: typeof PERSPECTIVE.queue[number], state: string): void {
    actor.clearMask().setOwner('PotionQueuePresentation', state);
    actor.root.setPosition(anchor.x, anchor.y).setScale(anchor.scale).setDepth(anchor.depth).setVisible(true);
  }

  beginActiveDrag(x: number, y: number): void {
    if (!this.activeId) return;
    const actor = this.actor(this.activeId);
    actor.setOwner('PotionQueuePresentation', 'drag.owned');
    this.moveActiveDrag(x, y);
  }

  moveActiveDrag(x: number, y: number): void {
    if (!this.activeId) return;
    const actor = this.actor(this.activeId);
    actor.root.setPosition(x, y).setDepth(PERSPECTIVE.branch.depth).setVisible(true);
    if (actor.activeMask && (x < 650 || x > 950 || y > 640)) actor.clearMask();
  }

  async returnActiveToInspection(reducedMotion: boolean): Promise<void> {
    if (!this.activeId) return;
    const actor = this.actor(this.activeId);
    actor.clearMask().setOwner('PotionQueuePresentation', 'drag.returning').root.setDepth(PERSPECTIVE.branch.depth);
    if (!reducedMotion) {
      await this.tween(actor.root, {
        x: PERSPECTIVE.aperture.x,
        y: PERSPECTIVE.aperture.y,
        scaleX: PERSPECTIVE.aperture.scale,
        scaleY: PERSPECTIVE.aperture.scale,
        duration: 260
      });
    } else {
      actor.root.setPosition(PERSPECTIVE.aperture.x, PERSPECTIVE.aperture.y).setScale(PERSPECTIVE.aperture.scale);
    }
    actor.root.setDepth(PERSPECTIVE.aperture.depth);
    actor.setOwner('InspectionApertureRig', 'inspection.selected').applyMask(this.aperture.mask, 'aperture-local');
  }

  async routeActive(destination: PotionType, correct: boolean, reducedMotion: boolean, fromDrag = false): Promise<void> {
    if (!this.activeId) return;
    const actor = this.actor(this.activeId);
    const station = this.stations.station(destination);
    actor.clearMask().setOwner('PotionQueuePresentation', 'branch.transit');
    actor.root.setDepth(PERSPECTIVE.branch.depth);

    if (!reducedMotion && !fromDrag) {
      await this.tween(actor.root, { x: PERSPECTIVE.branch.x, y: PERSPECTIVE.branch.y, scaleX: 0.84, scaleY: 0.84, duration: 280 });
      await this.tween(actor.root, { x: station.x, y: station.y - 8, scaleX: 0.62, scaleY: 0.62, duration: 390 });
    } else if (!reducedMotion) {
      await this.tween(actor.root, { x: station.x, y: station.y - 8, scaleX: 0.62, scaleY: 0.62, duration: 240 });
    } else {
      actor.root.setPosition(station.x, station.y - 8).setScale(0.62);
    }

    actor.setOwner('SortingStationRig', `${destination}.${correct ? 'accepted' : 'rejected'}`)
      .applyMask(station.mask, `receiver-${destination}-local`);
    this.resolved.add(actor.entity.id);
    if (!correct) {
      actor.sprite.setTint(0xe57575);
      if (!reducedMotion) await this.tween(actor.root, { alpha: 0, duration: 260, delay: 180 });
      else actor.root.setAlpha(0);
      actor.setOwner('SortingStationRig', `${destination}.rejected-resolved`);
    }
  }

  snapshot(): object[] {
    return [...this.actors.values()].map((actor) => actor.snapshot());
  }

  setInputEnabled(enabled: boolean): void {
    this.activeHitbox.input!.enabled = enabled;
  }

  private actor(id: string): PotionActorRig {
    const actor = this.actors.get(id);
    if (!actor) throw new Error(`Missing stable PotionActorRig for ${id}.`);
    return actor;
  }

  private tween(target: Phaser.GameObjects.Container, config: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    alpha?: number;
    duration: number;
    delay?: number;
  }): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({ targets: target, ease: 'Sine.inOut', ...config, onComplete: () => resolve() });
    });
  }
}
