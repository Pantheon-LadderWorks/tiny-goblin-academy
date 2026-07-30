import Phaser from 'phaser';
import {resolvePrivateActorOverlay, RuntimeActor} from './privateActorOverlay';

declare global {
  interface Window { __TGA_OVERLAY_PROOF__?: unknown; }
}

const statusElement = document.querySelector<HTMLParagraphElement>('#overlay-status');
const resolution = await resolvePrivateActorOverlay();

class OverlayProofScene extends Phaser.Scene {
  preload() {
    if (resolution.status !== 'available' || !resolution.manifest) return;
    for (const actor of resolution.manifest.actors) {
      const idle = actor.animations.find((animation) => animation.action === 'idle' && animation.direction === 'down');
      if (idle?.strip.url) this.load.spritesheet(actor.actor_id, idle.strip.url, {frameWidth: 256, frameHeight: 256});
    }
  }

  create() {
    this.add.text(24, 22, resolution.status === 'available' ? 'Private overlay available' : 'Public fallback active', {color: '#fff0c9', fontSize: '18px'});
    const positions: Record<string, number> = {'female-goblin': 150, thug: 360};
    if (resolution.status === 'available' && resolution.manifest) {
      for (const actor of resolution.manifest.actors) this.addActor(actor, positions[actor.actor_id]);
    } else {
      this.addFallback(150, 0x65c96f, 'PLAYER');
      this.addFallback(360, 0xd05757, 'ENEMY');
    }
  }

  private addActor(actor: RuntimeActor, x: number) {
    const idle = actor.animations.find((animation) => animation.action === 'idle' && animation.direction === 'down');
    if (!idle) return;
    const animationKey = `${actor.actor_id}.idle.down`;
    this.anims.create({key: animationKey, frames: this.anims.generateFrameNumbers(actor.actor_id, {start: 0, end: idle.frame_count - 1}), duration: idle.duration_ms, repeat: -1});
    const normalizedCanvasSide = 48 * actor.normalized_canvas[1] / actor.visible_content_height_px;
    this.add.ellipse(x, 226, 28, 9, 0x000000, 0.35);
    this.add.sprite(x, 226, actor.actor_id).setOrigin(actor.phaser_origin[0], actor.phaser_origin[1]).setDisplaySize(normalizedCanvasSide, normalizedCanvasSide).play(animationKey);
    this.add.text(x, 252, actor.actor_id, {color: '#e7ca91', fontSize: '13px'}).setOrigin(0.5, 0);
  }

  private addFallback(x: number, color: number, label: string) {
    this.add.ellipse(x, 226, 28, 9, 0x000000, 0.35);
    this.add.circle(x, 204, 20, color).setStrokeStyle(3, 0x1a1021);
    this.add.text(x, 252, label, {color: '#e7ca91', fontSize: '13px'}).setOrigin(0.5, 0);
  }
}

new Phaser.Game({type: Phaser.AUTO, width: 510, height: 300, parent: 'proof-canvas', backgroundColor: '#21172c', scene: OverlayProofScene});
if (statusElement) statusElement.textContent = resolution.status === 'available'
  ? `Overlay ${resolution.manifest?.bundle_identity_sha256.slice(0, 12)}… verified; Female Goblin and Thug loaded.`
  : `Fallback active (${resolution.reason}). No private network acquisition attempted.`;
window.__TGA_OVERLAY_PROOF__ = resolution;
