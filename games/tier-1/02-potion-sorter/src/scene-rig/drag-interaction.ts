export type DragGestureEvent =
  | { kind: 'none' | 'armed' | 'ignored' | 'cancel' }
  | { kind: 'tap' | 'drag-start' | 'drag-move' | 'drop'; x: number; y: number };

export class PointerDragGesture {
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private dragging = false;

  constructor(private readonly threshold: number) {}

  pointerDown(pointerId: number, x: number, y: number, enabled: boolean): DragGestureEvent {
    if (!enabled || this.pointerId !== null) return { kind: 'ignored' };
    this.pointerId = pointerId;
    this.startX = x;
    this.startY = y;
    this.dragging = false;
    return { kind: 'armed' };
  }

  pointerMove(pointerId: number, x: number, y: number): DragGestureEvent {
    if (pointerId !== this.pointerId) return { kind: 'none' };
    if (!this.dragging && Math.hypot(x - this.startX, y - this.startY) >= this.threshold) {
      this.dragging = true;
      return { kind: 'drag-start', x, y };
    }
    return this.dragging ? { kind: 'drag-move', x, y } : { kind: 'none' };
  }

  pointerUp(pointerId: number, x: number, y: number): DragGestureEvent {
    if (pointerId !== this.pointerId) return { kind: 'none' };
    const kind = this.dragging ? 'drop' : 'tap';
    this.reset();
    return { kind, x, y };
  }

  cancel(pointerId: number): DragGestureEvent {
    if (pointerId !== this.pointerId) return { kind: 'none' };
    this.reset();
    return { kind: 'cancel' };
  }

  snapshot(): { pointerId: number | null; dragging: boolean } {
    return { pointerId: this.pointerId, dragging: this.dragging };
  }

  private reset(): void {
    this.pointerId = null;
    this.dragging = false;
  }
}
