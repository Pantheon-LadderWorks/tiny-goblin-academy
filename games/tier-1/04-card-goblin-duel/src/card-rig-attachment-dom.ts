import {
  planCardRigAttachment,
  type CardRigAttachmentAuthority,
  type CardRigAttachmentPlan,
} from './card-rig-composition';

export type CardRigAttachmentSample = Readonly<{
  authority: CardRigAttachmentAuthority['kind'];
  anchorId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type CardRigAttachmentTelemetry = Readonly<{
  plan: CardRigAttachmentPlan;
  samples: readonly CardRigAttachmentSample[];
}>;

export type DomCardRigAttachmentOptions = Readonly<{
  root: HTMLElement;
  resolveAnchor(anchorId: string): HTMLElement | undefined;
  onSample?(sample: CardRigAttachmentSample): void;
}>;

const snapshot = (
  authority: CardRigAttachmentAuthority['kind'],
  anchorId: string,
  element: Element,
): CardRigAttachmentSample => {
  const rect = element.getBoundingClientRect();
  return Object.freeze({
    authority,
    anchorId,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  });
};

export class DomCardRigAttachmentController {
  private readonly temporaryNodes = new Set<HTMLElement>();
  private readonly ownerMounts = new Set<HTMLElement>();
  private readonly samples: CardRigAttachmentSample[] = [];
  private frameId: number | undefined;
  private active?: Readonly<{
    authority: CardRigAttachmentAuthority;
    plan: CardRigAttachmentPlan;
    element: HTMLElement;
    diagnostic: HTMLElement;
  }>;

  constructor(private readonly options: DomCardRigAttachmentOptions) {}

  private resolveElement(
    authority: CardRigAttachmentAuthority,
    plan: CardRigAttachmentPlan,
  ): HTMLElement | undefined {
    if (plan.mountSelector) {
      return this.options.root.querySelector<HTMLElement>(plan.mountSelector) ?? undefined;
    }
    if (authority.kind === 'travel') {
      return this.options.root.querySelector<HTMLElement>(
        `[data-card-rig-id="${authority.rigId}"]`,
      ) ?? undefined;
    }
    return this.options.resolveAnchor(plan.anchorId);
  }

  private update = (): void => {
    this.frameId = undefined;
    if (!this.active) return;
    const { authority, plan, element, diagnostic } = this.active;
    const sample = snapshot(authority.kind, plan.anchorId, element);
    this.samples.push(sample);
    this.options.onSample?.(sample);

    if (plan.follow !== 'owner-transform') {
      const rootRect = this.options.root.getBoundingClientRect();
      diagnostic.style.left = `${sample.x - rootRect.x + sample.width / 2}px`;
      diagnostic.style.top = `${sample.y - rootRect.y + sample.height / 2}px`;
    }

    this.frameId = window.requestAnimationFrame(this.update);
  };

  activate(authority: CardRigAttachmentAuthority): CardRigAttachmentPlan {
    this.cleanup();
    this.samples.length = 0;
    const plan = planCardRigAttachment(authority);
    const element = this.resolveElement(authority, plan);
    if (!element) throw new Error(`Attachment anchor unavailable: ${plan.anchorId}`);

    const diagnostic = document.createElement('span');
    diagnostic.className = plan.follow === 'owner-transform'
      ? 'card-rig-diagnostic-active'
      : 'card-rig-attachment-diagnostic';
    diagnostic.dataset.cardRigDiagnostic = authority.kind;
    diagnostic.dataset.cardRigAttachmentId = plan.anchorId;
    diagnostic.setAttribute('aria-hidden', 'true');

    if (plan.follow === 'owner-transform') {
      element.classList.add('card-rig-diagnostic-active');
      this.ownerMounts.add(element);
    } else {
      this.options.root.append(diagnostic);
      this.temporaryNodes.add(diagnostic);
    }

    this.active = Object.freeze({ authority, plan, element, diagnostic });
    this.update();
    return plan;
  }

  telemetry(): CardRigAttachmentTelemetry | undefined {
    if (!this.active) return undefined;
    return Object.freeze({
      plan: this.active.plan,
      samples: Object.freeze([...this.samples]),
    });
  }

  counts(): Readonly<{ temporaryNodes: number; ownerClasses: number; animationFrames: number }> {
    return Object.freeze({
      temporaryNodes: this.temporaryNodes.size,
      ownerClasses: this.ownerMounts.size,
      animationFrames: this.frameId === undefined ? 0 : 1,
    });
  }

  cleanup(): void {
    if (this.frameId !== undefined) window.cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
    for (const node of this.temporaryNodes) node.remove();
    this.temporaryNodes.clear();
    for (const mount of this.ownerMounts) mount.classList.remove('card-rig-diagnostic-active');
    this.ownerMounts.clear();
    this.active = undefined;
  }
}
