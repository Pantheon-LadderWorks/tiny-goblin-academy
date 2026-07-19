import Phaser from 'phaser';

import { projectCubeFaces } from './dierig/cube-projection';
import { DieRig } from './dierig/dierig';
import { orientationForTop } from './dierig/dierig-model';
import type { DieMotionMode, DieMotionPhase } from './dierig/motion-plan';
import { computeProductionDieScale, type ProductionDieScaleMetrics } from './live-die-layout';
import type { DiePresentation, LiveRollRequest } from './live-duel-controller';

const LOGICAL_WIDTH = 1200;
const LOGICAL_HEIGHT = 650;
const HALF_SIZE = 82;
const READY_X_BY_MODE: Record<DieMotionMode, number> = { full: -310, reduced: -92 };
const READY_Y_BY_MODE: Record<DieMotionMode, number> = { full: 10, reduced: 4 };

export const LIVE_DIERIG_ACTOR_ID = 'dierig-h6-10-actor-001';

const projectedWidthAtScaleOne = () => {
  const visible = projectCubeFaces(orientationForTop(4, 0.43), HALF_SIZE, 520).filter(({ visible }) => visible);
  const xValues = visible.flatMap(({ points }) => points.map(({ x }) => x));
  return Math.max(...xValues) - Math.min(...xValues);
};

export interface LiveDieRigSnapshot {
  actorId: string;
  activeRequestId: string | null;
  requestedFace: number | null;
  settledFace: number;
  mode: DieMotionMode;
  busy: boolean;
  ready: boolean;
  settledRatio: number;
  settledScale: number;
  launchScale: number;
  trayInnerWidthCss: number;
  projectedWidthCss: number;
  requestCount: number;
  completionCount: number;
  impactCount: number;
  phase: string;
}

export class LiveDieRigPresentation implements DiePresentation {
  readonly die: DieRig;
  readonly actorId: string;
  private readonly group: Phaser.GameObjects.Container;
  private readonly resizeObserver: ResizeObserver;
  private returnTween: Phaser.Tweens.Tween | null = null;
  private entryTween: Phaser.Tweens.Tween | Phaser.Tweens.TweenChain | null = null;
  private trayOffset = { x: 0, y: 0 };
  private metrics: ProductionDieScaleMetrics = {
    targetWidthCss: 0,
    settledScale: 1,
    launchScale: 1.07,
    settledRatio: 0.245,
  };
  private trayInnerWidthCss = 0;
  private activeRequestId: string | null = null;
  private ready = true;
  private lastMode: DieMotionMode = 'full';
  private evidenceFreezePhase: DieMotionPhase | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    textureKey: string,
    private readonly stageElement: HTMLElement,
    private readonly trayElement: HTMLElement,
    private readonly readyDockElement: HTMLElement,
  ) {
    const center = this.trayCenterLogical();
    this.die = new DieRig(scene, textureKey, center.x, center.y);
    this.actorId = this.die.actorId;
    if (this.actorId !== LIVE_DIERIG_ACTOR_ID) throw new Error(`Unexpected DieRig actor ID: ${this.actorId}`);
    this.group = scene.add.container(0, 0, [
      this.die.shadow,
      this.die.contactRing,
      this.die.backing,
      this.die,
      this.die.diagnostic,
    ]).setDepth(30);
    this.updateLayout();
    this.moveGroupToReady();
    this.die.contactRing.setVisible(false);
    this.resizeObserver = new ResizeObserver(() => this.updateLayout());
    this.resizeObserver.observe(stageElement);
    this.resizeObserver.observe(readyDockElement);
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.handleEvidenceFreeze, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  freezeAtPhase(phase: DieMotionPhase): void {
    this.evidenceFreezePhase = phase;
  }

  resumePresentation(): void {
    this.evidenceFreezePhase = null;
    this.scene.game.loop.wake();
  }

  startRoll(request: LiveRollRequest, completion: (request: LiveRollRequest) => void): boolean {
    this.returnTween?.stop();
    this.returnTween = null;
    this.entryTween?.stop();
    this.entryTween = null;
    this.activeRequestId = request.requestId;
    this.lastMode = request.mode;
    this.ready = false;
    const accepted = this.die.requestRoll({
      result: request.result,
      mode: request.mode,
      motionSeed: request.motionSeed,
    }, ({ actorId, result }) => {
      this.activeRequestId = null;
      completion({ ...request, actorId, result });
    });
    if (accepted) {
      const ready = this.readyOffset();
      const finalX = this.die.telemetry.finalPosition.x || 0;
      const finalY = this.die.telemetry.finalPosition.y || 0;
      const start = {
        x: ready.x + ((finalX - READY_X_BY_MODE[request.mode]) * this.metrics.settledScale),
        y: ready.y + ((finalY - READY_Y_BY_MODE[request.mode]) * this.metrics.settledScale),
      };
      this.setGroupTransform(start.x, start.y, this.metrics.settledScale);
      if (request.mode === 'full') {
        const peakGroupScale = this.metrics.launchScale / 1.03;
        const startBase = {
          x: start.x + (this.metrics.settledScale * this.die.x),
          y: start.y + (this.metrics.settledScale * this.die.y),
        };
        const endBase = {
          x: this.trayOffset.x + (this.metrics.settledScale * this.die.x),
          y: this.trayOffset.y + (this.metrics.settledScale * this.die.y),
        };
        const peakBase = {
          x: Phaser.Math.Linear(startBase.x, endBase.x, 0.6),
          y: Phaser.Math.Linear(startBase.y, endBase.y, 0.6),
        };
        this.entryTween = this.scene.tweens.chain({
          tweens: [
            {
              targets: this.group,
              x: peakBase.x - (peakGroupScale * this.die.x),
              y: peakBase.y - (peakGroupScale * this.die.y),
              scaleX: peakGroupScale,
              scaleY: peakGroupScale,
              duration: 360,
              ease: 'Sine.easeOut',
            },
            {
              targets: this.group,
              x: this.trayOffset.x,
              y: this.trayOffset.y,
              scaleX: this.metrics.settledScale,
              scaleY: this.metrics.settledScale,
              duration: 240,
              ease: 'Sine.easeInOut',
            },
          ],
          onComplete: () => { this.entryTween = null; },
        });
      } else {
        this.entryTween = this.scene.tweens.add({
          targets: this.group,
          x: this.trayOffset.x,
          y: this.trayOffset.y,
          duration: 300,
          ease: 'Sine.easeInOut',
          onComplete: () => { this.entryTween = null; },
        });
      }
    }
    return accepted;
  }

  directSettle(request: LiveRollRequest, completion: (request: LiveRollRequest) => void): void {
    const accepted = this.die.requestRoll({ result: request.result, mode: 'reduced', motionSeed: request.motionSeed }, ({ actorId, result }) => {
      this.activeRequestId = null;
      completion({ ...request, actorId, result });
    });
    if (accepted) return;
    this.scene.time.delayedCall(80, () => completion(request));
  }

  returnToReady(completion: () => void): void {
    const target = this.readyOffset();
    this.returnTween?.stop();
    this.returnTween = this.scene.tweens.add({
      targets: this.group,
      x: target.x,
      y: target.y,
      duration: 230,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.returnTween = null;
        this.activeRequestId = null;
        this.ready = true;
        this.die.contactRing.setVisible(false);
        completion();
      },
    });
  }

  leaveSettled(): void {
    this.returnTween?.stop();
    this.returnTween = null;
    this.ready = false;
  }

  snapshot(): LiveDieRigSnapshot {
    const projectedWidthCss = this.metrics.targetWidthCss;
    return {
      actorId: this.actorId,
      activeRequestId: this.activeRequestId,
      requestedFace: this.die.telemetry.requestedFace,
      settledFace: this.die.telemetry.settledFace,
      mode: this.lastMode,
      busy: this.die.telemetry.busy || Boolean(this.entryTween) || Boolean(this.returnTween),
      ready: this.ready,
      settledRatio: this.metrics.settledRatio,
      settledScale: this.metrics.settledScale,
      launchScale: this.metrics.launchScale,
      trayInnerWidthCss: this.trayInnerWidthCss,
      projectedWidthCss,
      requestCount: this.die.telemetry.requestCount,
      completionCount: this.die.telemetry.completionCount,
      impactCount: this.die.telemetry.impactCount,
      phase: this.die.telemetry.phase,
    };
  }

  destroy(): void {
    this.resizeObserver?.disconnect();
    this.entryTween?.stop();
    this.entryTween = null;
    this.returnTween?.stop();
    this.returnTween = null;
    this.scene?.events.off(Phaser.Scenes.Events.UPDATE, this.handleEvidenceFreeze, this);
    this.scene?.events.off(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
    this.group?.destroy(true);
  }

  private updateLayout(): void {
    const stage = this.stageElement.getBoundingClientRect();
    const tray = this.trayElement.getBoundingClientRect();
    if (!stage.width || !tray.width) return;
    const trayBorder = 18;
    this.trayInnerWidthCss = Math.max(1, tray.width - trayBorder);
    this.metrics = computeProductionDieScale({
      trayInnerWidthCss: this.trayInnerWidthCss,
      canvasWidthCss: stage.width,
      logicalCanvasWidth: LOGICAL_WIDTH,
      projectedWidthAtScaleOne: projectedWidthAtScaleOne(),
    });
    const center = this.trayCenterLogical();
    this.trayOffset = {
      x: center.x - (this.metrics.settledScale * this.die.x),
      y: center.y - (this.metrics.settledScale * this.die.y),
    };
    if (this.ready) this.moveGroupToReady();
    else if (!this.entryTween && !this.returnTween) this.setGroupTransform(this.trayOffset.x, this.trayOffset.y, this.metrics.settledScale);
  }

  private trayCenterLogical() {
    const stage = this.stageElement.getBoundingClientRect();
    const tray = this.trayElement.getBoundingClientRect();
    return {
      x: ((tray.left + (tray.width / 2) - stage.left) / stage.width) * LOGICAL_WIDTH,
      y: ((tray.top + (tray.height / 2) - stage.top) / stage.height) * LOGICAL_HEIGHT,
    };
  }

  private readyOffset() {
    const stage = this.stageElement.getBoundingClientRect();
    const dock = this.readyDockElement.getBoundingClientRect();
    const center = {
      x: ((dock.left + (dock.width * 0.62) - stage.left) / stage.width) * LOGICAL_WIDTH,
      y: ((dock.top + (dock.height * 0.48) - stage.top) / stage.height) * LOGICAL_HEIGHT,
    };
    return {
      x: center.x - (this.metrics.settledScale * this.die.x),
      y: center.y - (this.metrics.settledScale * this.die.y),
    };
  }

  private moveGroupToReady(): void {
    const target = this.readyOffset();
    this.setGroupTransform(target.x, target.y, this.metrics.settledScale);
  }

  private setGroupTransform(x: number, y: number, scale: number): void {
    this.group.setPosition(x, y).setScale(scale);
  }

  private handleEvidenceFreeze(): void {
    if (!this.evidenceFreezePhase || this.die.telemetry.phase !== this.evidenceFreezePhase) return;
    this.evidenceFreezePhase = null;
    this.scene.game.loop.sleep();
  }
}
