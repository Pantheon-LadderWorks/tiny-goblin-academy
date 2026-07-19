import type { DieFace } from './dierig/face-mapping';
import type { DieMotionMode } from './dierig/motion-plan';
import type { D6RollSource } from './roll-source';
import { act, beginRoll, completeRoll, createDuel, type Action, type Duel } from './simulation';

export interface LiveRollRequest {
  requestId: string;
  actorId: string;
  result: DieFace;
  mode: DieMotionMode;
  motionSeed: number;
}

export interface DiePresentation {
  readonly actorId: string;
  startRoll(request: LiveRollRequest, completion: (request: LiveRollRequest) => void): boolean;
  directSettle(request: LiveRollRequest, completion: (request: LiveRollRequest) => void): void;
  returnToReady(completion: () => void): void;
  leaveSettled(): void;
  destroy(): void;
}

export interface LiveControllerDiagnostics {
  actorId: string;
  activeRequestId: string | null;
  requestedFace: DieFace | null;
  settledFace: DieFace | null;
  mode: DieMotionMode;
  busyState: 'ready' | 'rolling' | 'action' | 'returning' | 'terminal';
  fallbackCount: number;
}

export class LiveDuelController {
  state: Duel = createDuel();
  readonly diagnostics: LiveControllerDiagnostics;
  private requestNumber = 0;
  private activeRequest: LiveRollRequest | null = null;
  private dieReady = true;
  private readonly onChange: () => void;
  private readonly motionMode: DieMotionMode;

  constructor(
    private readonly rollSource: D6RollSource,
    private readonly presentation: DiePresentation,
    options: { motionMode?: DieMotionMode; onChange?: () => void } = {},
  ) {
    this.motionMode = options.motionMode ?? 'full';
    this.onChange = options.onChange ?? (() => undefined);
    this.diagnostics = {
      actorId: presentation.actorId,
      activeRequestId: null,
      requestedFace: null,
      settledFace: null,
      mode: this.motionMode,
      busyState: 'ready',
      fallbackCount: 0,
    };
  }

  get canRequestRoll(): boolean {
    return this.state.phase === 'roll' && this.dieReady && this.activeRequest === null;
  }

  get canChooseAction(): boolean {
    return this.state.phase === 'action' && this.activeRequest === null;
  }

  requestRoll(): boolean {
    if (!this.canRequestRoll) return false;
    const result = this.rollSource.nextFace();
    this.state = beginRoll(this.state, result);
    this.dieReady = false;
    const request: LiveRollRequest = {
      requestId: `live-roll-${++this.requestNumber}`,
      actorId: this.presentation.actorId,
      result,
      mode: this.motionMode,
      motionSeed: (this.requestNumber * 97) + (result * 13),
    };
    this.activeRequest = request;
    Object.assign(this.diagnostics, {
      activeRequestId: request.requestId,
      requestedFace: result,
      mode: request.mode,
      busyState: 'rolling',
    });
    this.onChange();
    if (!this.presentation.startRoll(request, (completion) => this.handleSettle(completion))) {
      this.diagnostics.fallbackCount += 1;
      this.presentation.directSettle(request, (completion) => this.handleSettle(completion));
    }
    return true;
  }

  chooseAction(action: Action): boolean {
    if (!this.canChooseAction) return false;
    const next = act(this.state, action);
    if (next === this.state) return false;
    this.state = next;
    if (next.phase === 'won' || next.phase === 'lost') {
      this.diagnostics.busyState = 'terminal';
      this.presentation.leaveSettled();
    } else {
      this.diagnostics.busyState = 'returning';
      this.presentation.returnToReady(() => {
        if (this.state.phase !== 'roll') return;
        this.dieReady = true;
        this.diagnostics.busyState = 'ready';
        this.onChange();
      });
    }
    this.onChange();
    return true;
  }

  destroy(): void {
    this.activeRequest = null;
    this.presentation.destroy();
  }

  private handleSettle(completion: LiveRollRequest): void {
    const active = this.activeRequest;
    if (!active
      || completion.requestId !== active.requestId
      || completion.actorId !== active.actorId
      || completion.result !== active.result
      || this.state.phase !== 'rolling'
      || this.state.roll !== active.result) return;
    this.activeRequest = null;
    this.state = completeRoll(this.state);
    Object.assign(this.diagnostics, {
      activeRequestId: null,
      requestedFace: null,
      settledFace: completion.result,
      busyState: 'action',
    });
    this.onChange();
  }
}
