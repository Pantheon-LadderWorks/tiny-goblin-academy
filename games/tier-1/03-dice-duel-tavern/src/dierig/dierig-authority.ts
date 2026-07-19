import type { DieRollCompletion, DieRollRequest } from './motion-plan';

export class DieRigAuthority {
  readonly actorId = 'dierig-h6-10-actor-001';
  busy = false;
  activeRequest: DieRollRequest | null = null;

  request(request: DieRollRequest): boolean {
    if (this.busy) return false;
    this.busy = true;
    this.activeRequest = { ...request };
    return true;
  }

  complete(): DieRollCompletion | null {
    if (!this.busy || !this.activeRequest) return null;
    const completion: DieRollCompletion = { actorId: this.actorId, result: this.activeRequest.result, completed: true };
    this.busy = false;
    this.activeRequest = null;
    return completion;
  }

  cancel(): void {
    this.busy = false;
    this.activeRequest = null;
  }

  destroy(): void {
    this.cancel();
  }
}
