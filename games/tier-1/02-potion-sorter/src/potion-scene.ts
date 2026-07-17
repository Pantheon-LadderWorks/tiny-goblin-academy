import Phaser from 'phaser';

import type { RoundController } from './controller';
import { AlchemyLightingRig, PotionRoomRig } from './scene-rig/environment-rigs';
import { ASSET_KEYS, ASSET_URLS, POTION_FRAMES, RECEIVER_FRAMES, STAGE } from './scene-rig/config';
import { ConveyorRig, InspectionApertureRig, SortingStationRig } from './scene-rig/machine-rigs';
import { PotionQueuePresentation } from './scene-rig/potion-rigs';
import { PointerDragGesture } from './scene-rig/drag-interaction';
import type { PotionType, RoundState } from './simulation';

interface SceneDiagnostics {
  getActorContinuitySnapshot(): object[];
  getRoundState(): RoundState;
  getDragState(): { pointerId: number | null; dragging: boolean };
  getEnvironmentDepthSnapshot(): object;
  getInteractionAudit(): object[];
}

export class PotionScene extends Phaser.Scene {
  private readonly controller: RoundController;
  private queue!: PotionQueuePresentation;
  private stations!: SortingStationRig;
  private isRouting = false;
  private pendingState: RoundState | null = null;
  private readonly dragGesture = new PointerDragGesture(14);
  private readonly interactionAudit: object[] = [];
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(controller: RoundController) {
    super('PotionScene');
    this.controller = controller;
  }

  preload(): void {
    this.load.image(ASSET_KEYS.potionSheet, ASSET_URLS.potionSheet);
    this.load.image(ASSET_KEYS.timber, ASSET_URLS.timber);
    this.load.image(ASSET_KEYS.masonry, ASSET_URLS.masonry);
    this.load.image(ASSET_KEYS.iron, ASSET_URLS.iron);
    this.load.image(ASSET_KEYS.brass, ASSET_URLS.brass);
    this.load.image(ASSET_KEYS.parchment, ASSET_URLS.parchment);
  }

  create(): void {
    this.registerApprovedFrames();
    const room = new PotionRoomRig(this, this.reducedMotion);
    new ConveyorRig(this);
    const aperture = new InspectionApertureRig(this);
    this.stations = new SortingStationRig(this, (type) => void this.chooseDestination(type));
    this.queue = new PotionQueuePresentation(this, aperture, this.stations, (pointer) => this.handlePointerDown(pointer));
    new AlchemyLightingRig(this, this.reducedMotion);
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.handlePointerMove(pointer));
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => void this.handlePointerUp(pointer));
    this.input.on('pointerupoutside', (pointer: Phaser.Input.Pointer) => void this.cancelPointer(pointer));
    this.input.on('gameout', () => void this.cancelOwnedPointer());

    this.controller.subscribe((state) => {
      if (state.roundComplete && this.dragGesture.snapshot().pointerId !== null) {
        const pointerId = this.dragGesture.snapshot().pointerId!;
        this.dragGesture.cancel(pointerId);
        this.stations.setDragHover(null);
        this.interactionAudit.push({ kind: 'drag-disabled-round-complete', pointerId });
      }
      if (this.isRouting) this.pendingState = state;
      else this.queue.sync(state);
    });
    this.scale.on('resize', () => this.fitComposition());
    this.fitComposition();

    const diagnostics: SceneDiagnostics = {
      getActorContinuitySnapshot: () => this.queue.snapshot(),
      getRoundState: () => this.controller.getState(),
      getDragState: () => this.dragGesture.snapshot(),
      getEnvironmentDepthSnapshot: () => room.snapshot(),
      getInteractionAudit: () => [...this.interactionAudit]
    };
    (window as unknown as { __TGA_POTION_SCENE__: SceneDiagnostics }).__TGA_POTION_SCENE__ = diagnostics;
  }

  private registerApprovedFrames(): void {
    const texture = this.textures.get(ASSET_KEYS.potionSheet);
    (Object.entries(POTION_FRAMES) as Array<[PotionType, (typeof POTION_FRAMES)[PotionType]]>).forEach(([type, frame]) => {
      texture.add(type, 0, frame.x, frame.y, frame.width, frame.height);
    });
    (Object.entries(RECEIVER_FRAMES) as Array<[PotionType, (typeof RECEIVER_FRAMES)[PotionType]]>).forEach(([type, frame]) => {
      texture.add(`${type}-receiver`, 0, frame.x, frame.y, frame.width, frame.height);
    });
  }

  private async chooseDestination(destination: PotionType, fromDrag = false): Promise<void> {
    const before = this.controller.getState();
    if (before.roundComplete || before.activePotion === null || this.isRouting) return;
    if (!before.selectedPotion) {
      this.controller.placePotion(destination);
      return;
    }

    this.isRouting = true;
    this.pendingState = null;
    this.stations.setEnabled(false);
    this.queue.setInputEnabled(false);
    this.stations.setDragHover(null);
    const correct = destination === before.activePotion;
    this.controller.placePotion(destination);
    const after = this.controller.getState();
    this.interactionAudit.push({
      kind: 'resolution',
      mode: fromDrag ? 'drag' : 'tap',
      actorId: before.activePotionId,
      destination,
      correct,
      potionIndexBefore: before.potionIndex,
      potionIndexAfter: after.potionIndex
    });
    await this.queue.routeActive(destination, correct, this.reducedMotion, fromDrag);
    this.isRouting = false;
    this.stations.setEnabled(!this.controller.getState().roundComplete);
    this.queue.sync(this.pendingState ?? this.controller.getState());
    this.queue.setInputEnabled(!this.controller.getState().roundComplete);
    this.pendingState = null;
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    const state = this.controller.getState();
    this.dragGesture.pointerDown(pointer.id, pointer.worldX, pointer.worldY,
      !this.isRouting && !state.roundComplete && state.activePotionId !== null);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (this.controller.getState().roundComplete) {
      this.dragGesture.cancel(pointer.id);
      this.stations.setDragHover(null);
      return;
    }
    const event = this.dragGesture.pointerMove(pointer.id, pointer.worldX, pointer.worldY);
    if (event.kind !== 'drag-start' && event.kind !== 'drag-move') return;
    if (event.kind === 'drag-start' && !this.controller.getState().selectedPotion) this.controller.selectPotion();
    if (event.kind === 'drag-start') {
      this.interactionAudit.push({ kind: 'drag-start', actorId: this.controller.getState().activePotionId, pointerId: pointer.id });
      this.queue.beginActiveDrag(event.x, event.y);
    }
    else this.queue.moveActiveDrag(event.x, event.y);
    this.stations.setDragHover(this.stations.receiverAt(event.x, event.y));
  }

  private async handlePointerUp(pointer: Phaser.Input.Pointer): Promise<void> {
    if (this.controller.getState().roundComplete) {
      this.dragGesture.cancel(pointer.id);
      this.stations.setDragHover(null);
      return;
    }
    const event = this.dragGesture.pointerUp(pointer.id, pointer.worldX, pointer.worldY);
    if (event.kind === 'tap') {
      this.interactionAudit.push({ kind: 'tap-select', actorId: this.controller.getState().activePotionId, pointerId: pointer.id });
      this.controller.selectPotion();
      return;
    }
    if (event.kind !== 'drop') return;
    const destination = this.stations.receiverAt(event.x, event.y);
    this.stations.setDragHover(null);
    if (destination) await this.chooseDestination(destination, true);
    else {
      const actorId = this.controller.getState().activePotionId;
      await this.queue.returnActiveToInspection(this.reducedMotion);
      this.interactionAudit.push({ kind: 'drag-return', actorId, destination: null });
    }
  }

  private async cancelPointer(pointer: Phaser.Input.Pointer): Promise<void> {
    if (this.dragGesture.cancel(pointer.id).kind === 'cancel') {
      this.stations.setDragHover(null);
      await this.queue.returnActiveToInspection(this.reducedMotion);
      this.interactionAudit.push({ kind: 'drag-cancel', actorId: this.controller.getState().activePotionId, pointerId: pointer.id });
    }
  }

  private async cancelOwnedPointer(): Promise<void> {
    const pointerId = this.dragGesture.snapshot().pointerId;
    if (pointerId !== null && this.dragGesture.cancel(pointerId).kind === 'cancel') {
      this.stations.setDragHover(null);
      await this.queue.returnActiveToInspection(this.reducedMotion);
      this.interactionAudit.push({ kind: 'drag-cancel', actorId: this.controller.getState().activePotionId, pointerId });
    }
  }

  private fitComposition(): void {
    const camera = this.cameras.main;
    const zoom = Math.max(this.scale.width / STAGE.width, this.scale.height / STAGE.height);
    camera.setZoom(zoom);
    camera.centerOn(STAGE.centerX, STAGE.centerY);
  }
}
