import Phaser from 'phaser';

import { projectCubeFaces } from './cube-projection';
import { DieRigAuthority } from './dierig-authority';
import { DIE_FACE_MAPPINGS, DIE_SHEET_SIZE, type DieFace } from './face-mapping';
import type { Quaternion } from './dierig-model';
import { createMotionPlan, sampleMotion, type DieMotionPhase, type DieRollCompletion, type DieRollRequest } from './motion-plan';

export interface DieRigTelemetry {
  actorId: string;
  requestCount: number;
  completionCount: number;
  rejectedOverlapCount: number;
  impactCount: number;
  requestedFace: DieFace | null;
  lastRequestedFace: DieFace;
  settledFace: DieFace;
  mode: DieRollRequest['mode'];
  seed: number;
  phase: DieMotionPhase;
  phaseTrail: DieMotionPhase[];
  elapsed: number;
  totalDuration: number;
  phaseTimings: Array<{ phase: DieMotionPhase; start: number; end: number }>;
  finalPosition: { x: number; y: number };
  finalOrientation: Quaternion;
  busy: boolean;
}

export class DieRig extends Phaser.GameObjects.Mesh2D {
  readonly authority = new DieRigAuthority();
  readonly actorId = this.authority.actorId;
  readonly shadow: Phaser.GameObjects.Ellipse;
  readonly backing: Phaser.GameObjects.Graphics;
  readonly contactRing: Phaser.GameObjects.Graphics;
  readonly diagnostic: Phaser.GameObjects.Graphics;

  private activeStartedAt = 0;
  private baseX = 0;
  private baseY = 0;
  private halfSize = 82;
  private completionHandler: ((completion: DieRollCompletion) => void) | null = null;
  private diagnosticsVisible = false;

  readonly telemetry: DieRigTelemetry = {
    actorId: this.actorId,
    requestCount: 0,
    completionCount: 0,
    rejectedOverlapCount: 0,
    impactCount: 0,
    requestedFace: null,
    lastRequestedFace: 1,
    settledFace: 1,
    mode: 'full',
    seed: 41,
    phase: 'idle',
    phaseTrail: [],
    elapsed: 0,
    totalDuration: 0,
    phaseTimings: [],
    finalPosition: { x: 0, y: 0 },
    finalOrientation: { x: 0, y: 0, z: 0, w: 1 },
    busy: false,
  };

  constructor(scene: Phaser.Scene, texture: string, x: number, y: number) {
    // The reviewed atlas is authored top-down; Mesh2D's WebGL UV space is bottom-up.
    super(scene, x, y, texture, [], [], true);
    this.baseX = x;
    this.baseY = y;
    this.setRenderAsTriangles(true);
    this.setDepth(30);

    this.shadow = scene.add.ellipse(x, y + 96, 176, 42, 0x120c12, 0.52).setDepth(18);
    this.backing = scene.add.graphics().setDepth(29);
    this.contactRing = scene.add.graphics().setDepth(19);
    this.diagnostic = scene.add.graphics().setDepth(40);
    scene.add.existing(this);

    this.drawContactRing();
    this.applySample(sampleMotion({ result: 1, mode: 'reduced', motionSeed: 41 }, createMotionPlan('reduced').totalDuration));
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.handleUpdate, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  requestRoll(request: DieRollRequest, onComplete?: (completion: DieRollCompletion) => void): boolean {
    if (!this.authority.request(request)) {
      this.telemetry.rejectedOverlapCount += 1;
      return false;
    }
    this.activeStartedAt = this.scene.time.now;
    this.completionHandler = onComplete ?? null;
    this.telemetry.requestCount += 1;
    this.telemetry.requestedFace = request.result;
    this.telemetry.lastRequestedFace = request.result;
    this.telemetry.mode = request.mode;
    this.telemetry.seed = request.motionSeed;
    this.telemetry.phase = 'anticipation';
    this.telemetry.phaseTrail = ['anticipation'];
    this.telemetry.elapsed = 0;
    const plan = createMotionPlan(request.mode);
    let phaseStart = 0;
    this.telemetry.totalDuration = plan.totalDuration;
    this.telemetry.phaseTimings = plan.phases.map(({ phase, duration }) => {
      const timing = { phase, start: phaseStart, end: phaseStart + duration };
      phaseStart += duration;
      return timing;
    });
    this.telemetry.busy = true;
    this.contactRing.setVisible(false);
    return true;
  }

  setDiagnosticVisible(value: boolean): void {
    this.diagnosticsVisible = value;
    this.diagnostic.setVisible(value);
    if (!value) this.diagnostic.clear();
  }

  private handleUpdate(time: number): void {
    const request = this.authority.activeRequest;
    if (!request) return;
    const elapsed = Math.max(0, time - this.activeStartedAt);
    const plan = createMotionPlan(request.mode);
    const sample = sampleMotion(request, elapsed);
    this.applySample(sample);
    this.telemetry.elapsed = Math.min(plan.totalDuration, Math.round(elapsed));
    this.telemetry.finalPosition = { x: Number(sample.x.toFixed(3)), y: Number((sample.y - sample.height).toFixed(3)) };
    this.telemetry.finalOrientation = Object.fromEntries(
      Object.entries(sample.orientation).map(([key, value]) => [key, Number(value.toFixed(6))]),
    ) as unknown as Quaternion;
    if (this.telemetry.phase !== sample.phase) {
      this.telemetry.phase = sample.phase;
      this.telemetry.phaseTrail.push(sample.phase);
      if (sample.phase === 'impact-one' || sample.phase === 'impact-two') this.telemetry.impactCount += 1;
    }
    if (elapsed < plan.totalDuration) return;

    const completion = this.authority.complete();
    if (!completion) return;
    this.telemetry.completionCount += 1;
    this.telemetry.settledFace = completion.result;
    this.telemetry.requestedFace = null;
    this.telemetry.busy = false;
    this.contactRing.setVisible(true);
    const handler = this.completionHandler;
    this.completionHandler = null;
    handler?.(completion);
  }

  private applySample(sample: ReturnType<typeof sampleMotion>): void {
    this.setPosition(this.baseX + sample.x, this.baseY + sample.y - sample.height);
    this.setScale(sample.scale);
    this.shadow.setPosition(this.baseX + sample.x, this.baseY + 96 + sample.y)
      .setScale(sample.shadowScale, Math.max(0.72, sample.shadowScale))
      .setAlpha(sample.shadowAlpha);

    const projected = projectCubeFaces(sample.orientation, this.halfSize, 520);
    const vertices: number[] = [];
    const indices: number[] = [];
    let vertexIndex = 0;
    for (const face of projected.filter(({ visible }) => visible)) {
      const mapping = DIE_FACE_MAPPINGS[face.face - 1];
      // The reviewed 128 px atlas cells retain transparent presentation padding.
      // Crop inside that padding at render time so the persistent planes meet.
      const inset = 20;
      const u0 = (mapping.rect.x + inset) / DIE_SHEET_SIZE;
      const v0 = (mapping.rect.y + inset) / DIE_SHEET_SIZE;
      const u1 = (mapping.rect.x + mapping.rect.w - inset) / DIE_SHEET_SIZE;
      const v1 = (mapping.rect.y + mapping.rect.h - inset) / DIE_SHEET_SIZE;
      const uvs = [[u0, v1], [u1, v1], [u1, v0], [u0, v0]];
      face.points.forEach((point, index) => vertices.push(point.x, point.y, uvs[index][0], uvs[index][1]));
      indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2, 0, vertexIndex, vertexIndex + 2, vertexIndex + 3, 0);
      vertexIndex += 4;
    }
    this.vertices = vertices;
    this.indices = indices;
    const visibleFaces = projected.filter(({ visible }) => visible);
    this.drawBacking(visibleFaces);
    this.drawDiagnostic(visibleFaces);
  }

  private drawBacking(faces: ReturnType<typeof projectCubeFaces>): void {
    this.backing.clear();
    this.backing.fillStyle(0x332126, 1);
    this.backing.lineStyle(3, 0x130d14, 0.95);
    for (const face of faces) {
      const points = face.points.map(({ x, y }) => new Phaser.Math.Vector2(this.x + x, this.y + y));
      this.backing.fillPoints(points, true);
      this.backing.strokePoints(points, true);
    }
  }

  private drawContactRing(): void {
    this.contactRing.clear();
    this.contactRing.lineStyle(4, 0xd9a84e, 0.72);
    this.contactRing.strokeEllipse(this.baseX, this.baseY + 95, 202, 58);
    this.contactRing.lineStyle(1, 0xffe5a3, 0.55);
    this.contactRing.strokeEllipse(this.baseX, this.baseY + 95, 176, 42);
  }

  private drawDiagnostic(faces: ReturnType<typeof projectCubeFaces>): void {
    if (!this.diagnosticsVisible) return;
    this.diagnostic.clear();
    for (const face of faces) {
      const points = face.points.map(({ x, y }) => ({ x: this.x + x, y: this.y + y }));
      this.diagnostic.lineStyle(2, 0x77f2cb, 0.9);
      this.diagnostic.beginPath();
      this.diagnostic.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => this.diagnostic.lineTo(point.x, point.y));
      this.diagnostic.closePath();
      this.diagnostic.strokePath();
    }
  }

  override destroy(fromScene?: boolean): void {
    this.scene?.events.off(Phaser.Scenes.Events.UPDATE, this.handleUpdate, this);
    this.authority.destroy();
    this.completionHandler = null;
    this.shadow?.destroy();
    this.backing?.destroy();
    this.contactRing?.destroy();
    this.diagnostic?.destroy();
    super.destroy(fromScene);
  }
}
