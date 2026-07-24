import {
  buildAnchorSnapshot,
  handSlotAnchorId,
  type AnchorSnapshot,
  type RectLike,
} from './anchors';
import { CARD_RIG_ANCHOR_IDS } from './card-rig-routes';

export const BASE_REQUIRED_ANCHORS = Object.freeze([
  CARD_RIG_ANCHOR_IDS.playerDrawOrigin,
  CARD_RIG_ANCHOR_IDS.playedCardTarget,
  'resolution-center',
  'enemy-center',
  'enemy-impact',
  'player-center',
  'player-impact',
  CARD_RIG_ANCHOR_IDS.playerDiscardTarget,
  CARD_RIG_ANCHOR_IDS.enemyCardOrigin,
  'phase-banner',
] as const);

export type AnchorBridge = Readonly<{
  refresh: () => void;
  getSnapshot: () => AnchorSnapshot;
  destroy: () => void;
}>;

type BridgeOptions = Readonly<{
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  onSnapshot: (snapshot: AnchorSnapshot) => void;
  onError?: (error: Error) => void;
}>;

const rectLike = (rect: DOMRect): RectLike => ({
  left: rect.left,
  top: rect.top,
  width: rect.width,
  height: rect.height,
});

const requiredAnchorIds = (root: HTMLElement): string[] => {
  const handCount = root.querySelectorAll("#hand .card-btn[data-stage-anchor^='hand-slot-']").length;
  return [
    ...BASE_REQUIRED_ANCHORS,
    ...Array.from({ length: handCount }, (_, index) => handSlotAnchorId(index)),
  ];
};

const measureAnchors = (root: HTMLElement) => Array.from(
  root.querySelectorAll<HTMLElement>('[data-stage-anchor]'),
  (element) => ({
    id: element.dataset.stageAnchor ?? '',
    rect: rectLike(element.getBoundingClientRect()),
  }),
);

export const createAnchorBridge = (options: BridgeOptions): AnchorBridge => {
  let snapshot: AnchorSnapshot = Object.freeze({});
  let frameId: number | null = null;
  let destroyed = false;

  const measure = (): void => {
    frameId = null;
    if (destroyed || !options.canvas.isConnected) return;

    try {
      snapshot = buildAnchorSnapshot({
        canvasRect: rectLike(options.canvas.getBoundingClientRect()),
        canvasSize: {
          width: options.canvas.width,
          height: options.canvas.height,
        },
        anchors: measureAnchors(options.root),
        required: requiredAnchorIds(options.root),
      });
      options.onSnapshot(snapshot);
    } catch (error) {
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const schedule = (): void => {
    if (destroyed || frameId !== null) return;
    frameId = window.requestAnimationFrame(measure);
  };

  const resizeObserver = new ResizeObserver(schedule);
  resizeObserver.observe(options.root);
  resizeObserver.observe(options.canvas);

  const mutationObserver = new MutationObserver(schedule);
  mutationObserver.observe(options.root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-stage-anchor', 'class'],
  });

  window.addEventListener('resize', schedule, { passive: true });
  schedule();

  return Object.freeze({
    refresh: schedule,
    getSnapshot: () => snapshot,
    destroy: () => {
      destroyed = true;
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', schedule);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
    },
  });
};
