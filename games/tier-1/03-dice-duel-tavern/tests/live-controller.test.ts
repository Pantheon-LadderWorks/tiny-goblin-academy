import { describe, expect, it } from 'vitest';

import { LiveDuelController, type DiePresentation, type LiveRollRequest } from '../src/live-duel-controller';
import { SequenceD6RollSource } from '../src/roll-source';

class FakePresentation implements DiePresentation {
  readonly actorId = 'dierig-h6-10-actor-001';
  requests: LiveRollRequest[] = [];
  completion: ((request: LiveRollRequest) => void) | null = null;
  returnCompletion: (() => void) | null = null;
  leftSettled = false;

  startRoll(request: LiveRollRequest, completion: (request: LiveRollRequest) => void) {
    this.requests.push(request);
    this.completion = completion;
    return true;
  }
  directSettle(request: LiveRollRequest, completion: (request: LiveRollRequest) => void) { completion(request); }
  returnToReady(completion: () => void) { this.returnCompletion = completion; }
  leaveSettled() { this.leftSettled = true; }
  destroy() {}
}

describe('H6.11 live duel controller', () => {
  it('commits one face before motion and unlocks actions only after matching settle', () => {
    const presentation = new FakePresentation();
    const controller = new LiveDuelController(new SequenceD6RollSource([4]), presentation, { motionMode: 'full' });
    expect(controller.requestRoll()).toBe(true);
    expect(controller.state).toMatchObject({ phase: 'rolling', roll: 4 });
    expect(controller.canChooseAction).toBe(false);
    presentation.completion?.(presentation.requests[0]);
    expect(controller.state).toMatchObject({ phase: 'action', roll: 4 });
    expect(controller.state.log.at(-1)).toBe('You rolled 4.');
    expect(controller.canChooseAction).toBe(true);
  });

  it('rejects duplicate and stale completions without duplicating logs or changing a result', () => {
    const presentation = new FakePresentation();
    const controller = new LiveDuelController(new SequenceD6RollSource([6, 2]), presentation);
    controller.requestRoll();
    const first = presentation.requests[0];
    presentation.completion?.(first);
    presentation.completion?.(first);
    expect(controller.state.log.filter((entry) => entry === 'You rolled 6.')).toHaveLength(1);
    controller.chooseAction('block');
    presentation.returnCompletion?.();
    controller.requestRoll();
    presentation.completion?.(first);
    expect(controller.state).toMatchObject({ phase: 'rolling', roll: 2 });
  });

  it('keeps Roll locked through return-to-ready and preserves one actor across turns', () => {
    const presentation = new FakePresentation();
    const controller = new LiveDuelController(new SequenceD6RollSource([3, 5]), presentation);
    controller.requestRoll();
    presentation.completion?.(presentation.requests[0]);
    expect(controller.chooseAction('heal')).toBe(true);
    expect(controller.state.phase).toBe('roll');
    expect(controller.requestRoll()).toBe(false);
    presentation.returnCompletion?.();
    expect(controller.requestRoll()).toBe(true);
    expect(presentation.requests).toHaveLength(2);
    expect(controller.diagnostics.actorId).toBe('dierig-h6-10-actor-001');
  });

  it('leaves the same actor settled on terminal outcome', () => {
    const presentation = new FakePresentation();
    const controller = new LiveDuelController(new SequenceD6RollSource([6]), presentation);
    controller.state = { ...controller.state, enemyHp: 6 };
    controller.requestRoll();
    presentation.completion?.(presentation.requests[0]);
    controller.chooseAction('attack');
    expect(controller.state.phase).toBe('won');
    expect(presentation.leftSettled).toBe(true);
    expect(presentation.returnCompletion).toBeNull();
  });
});
