import Phaser from 'phaser';

export type GoblinExpression = 'normal' | 'hurt' | 'defeated';

export interface GoblinSkin {
  skinColor: number;
  skinShadowColor: number;
  tunicColor: number;
  tunicShadowColor: number;
  beltColor: number;
  eyeColor: number;
  pupilColor: number;
  fangVisible: boolean;
  earScale: number;
  earAngle: number;
  name: string;
}

export interface GoblinRigOptions {
  skin?: Partial<GoblinSkin>;
  scale?: number;
}

const DEFAULT_SKIN: GoblinSkin = {
  skinColor: 0x4a6a41,
  skinShadowColor: 0x385231,
  tunicColor: 0x8a5b38,
  tunicShadowColor: 0x5b3929,
  beltColor: 0x2e2119,
  eyeColor: 0xe8dfc7,
  pupilColor: 0x121015,
  fangVisible: true,
  earScale: 1,
  earAngle: 0,
  name: 'baseline-goblin',
};

export const ALT_SKIN: GoblinSkin = {
  ...DEFAULT_SKIN,
  skinColor: 0x557a45,
  skinShadowColor: 0x416238,
  tunicColor: 0x6f4a7a,
  tunicShadowColor: 0x4a3459,
  earScale: 0.92,
  earAngle: -5,
  name: 'alternate-color-proportion',
};

export class GoblinRig {
  public readonly root: Phaser.GameObjects.Container;
  public readonly footBaselineY = 0;
  public readonly actorHeight = 300;
  public readonly hitArea = new Phaser.Geom.Ellipse(0, -155, 250, 305);

  private skin: GoblinSkin;
  private shadow!: Phaser.GameObjects.Ellipse;
  private torso!: Phaser.GameObjects.Container;
  private head!: Phaser.GameObjects.Container;
  private leftEar!: Phaser.GameObjects.Graphics;
  private rightEar!: Phaser.GameObjects.Graphics;
  private normalEyes!: Phaser.GameObjects.Container;
  private xEyes!: Phaser.GameObjects.Container;
  private normalMouth!: Phaser.GameObjects.Container;
  private hurtMouth!: Phaser.GameObjects.Container;
  private leftArm!: Phaser.GameObjects.Container;
  private rightArm!: Phaser.GameObjects.Container;
  private leftLeg!: Phaser.GameObjects.Container;
  private rightLeg!: Phaser.GameObjects.Container;
  private idleTweens: Phaser.Tweens.Tween[] = [];
  private blinkEvent?: Phaser.Time.TimerEvent;
  private earEvent?: Phaser.Time.TimerEvent;
  private baselineX: number;
  private baselineY: number;

  constructor(
    private readonly scene: Phaser.Scene,
    x: number,
    y: number,
    options: GoblinRigOptions = {}
  ) {
    this.skin = { ...DEFAULT_SKIN, ...options.skin };
    this.baselineX = x;
    this.baselineY = y;
    this.root = scene.add.container(x, y).setName('GoblinRigRoot');
    this.root.setScale(options.scale ?? 1);
    this.build();
    this.setExpression('normal');
    this.playIdle();
  }

  public setSkin(skin: Partial<GoblinSkin>) {
    this.skin = { ...this.skin, ...skin };
    this.root.removeAll(true);
    this.stopIdle();
    this.build();
    this.setExpression('normal');
    this.playIdle();
  }

  public playIdle() {
    this.stopIdle();
    this.idleTweens = [
      this.scene.tweens.add({
        targets: this.torso,
        y: this.torso.y - 3,
        duration: 950,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      }),
      this.scene.tweens.add({
        targets: this.head,
        y: this.head.y - 4,
        angle: -1.5,
        duration: 1050,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      }),
      this.scene.tweens.add({
        targets: [this.leftArm, this.rightArm],
        angle: { from: -2, to: 3 },
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      }),
      this.scene.tweens.add({
        targets: this.shadow,
        scaleX: 1.06,
        alpha: 0.32,
        duration: 950,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      }),
    ];

    this.blinkEvent = this.scene.time.addEvent({
      delay: 3200,
      loop: true,
      callback: () => this.blink(),
    });

    this.earEvent = this.scene.time.addEvent({
      delay: 5200,
      loop: true,
      callback: () => this.twitchEar(),
    });
  }

  public stopIdle() {
    for (const tween of this.idleTweens) {
      tween.stop();
      tween.remove();
    }
    this.idleTweens = [];
    this.blinkEvent?.remove(false);
    this.earEvent?.remove(false);
    this.blinkEvent = undefined;
    this.earEvent = undefined;
  }

  public setHover(active: boolean) {
    this.scene.tweens.killTweensOf(this.root);
    this.scene.tweens.add({
      targets: this.root,
      scaleX: active ? 1.025 : 1,
      scaleY: active ? 1.025 : 1,
      angle: active ? -1 : 0,
      duration: 140,
      ease: 'Sine.out',
    });
  }

  public playBonkReaction(damage: 1 | 2 = 1) {
    this.setExpression('hurt');
    this.scene.tweens.killTweensOf([this.root, this.head, this.torso, this.leftLeg, this.rightLeg]);

    const recoil = damage === 2 ? 18 : 11;
    const headAngle = damage === 2 ? -11 : -7;

    this.scene.tweens.add({
      targets: this.root,
      scaleX: damage === 2 ? 1.12 : 1.08,
      scaleY: damage === 2 ? 0.88 : 0.92,
      y: this.root.y + (damage === 2 ? 14 : 9),
      duration: 75,
      yoyo: true,
      ease: 'Quad.out',
      onComplete: () => {
        this.root.setScale(1);
        this.root.y = this.baselineY;
      },
    });

    this.scene.tweens.add({
      targets: this.head,
      x: -recoil,
      angle: headAngle,
      duration: 90,
      yoyo: true,
      ease: 'Back.out',
      onComplete: () => this.setExpression('normal'),
    });

    this.scene.tweens.add({
      targets: this.rightLeg,
      angle: damage === 2 ? 14 : 8,
      duration: 90,
      yoyo: true,
      ease: 'Quad.out',
    });
  }

  public playDefeat() {
    this.stopIdle();
    this.setExpression('defeated');
    this.scene.tweens.killTweensOf([this.root, this.head, this.torso, this.leftArm, this.rightArm]);
    this.scene.tweens.add({
      targets: this.root,
      angle: 9,
      y: 518,
      scaleY: 0.9,
      duration: 280,
      ease: 'Back.out',
    });
    this.scene.tweens.add({
      targets: this.head,
      angle: -16,
      y: this.head.y + 12,
      duration: 260,
      ease: 'Quad.out',
    });
    this.scene.tweens.add({
      targets: this.shadow,
      scaleX: 1.25,
      alpha: 0.42,
      duration: 260,
      ease: 'Quad.out',
    });
  }

  public reset(x = 400, y = 500) {
    this.scene.tweens.killTweensOf(this.root);
    this.baselineX = x;
    this.baselineY = y;
    this.root.setPosition(x, y);
    this.root.setScale(1);
    this.root.setAngle(0);
    this.root.setAlpha(1);
    this.setExpression('normal');
    this.resetPartTransforms();
    this.playIdle();
  }

  public destroy() {
    this.stopIdle();
    this.root.destroy(true);
  }

  public getHitBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(-125, -308, 250, 308);
  }

  private build() {
    this.shadow = this.scene.add
      .ellipse(0, 5, 155, 34, 0x0e0b10, 0.28)
      .setName('shadow');
    this.root.add(this.shadow);

    this.leftArm = this.createArm(-62, -160, true);
    this.rightArm = this.createArm(62, -160, false);
    this.leftLeg = this.createLeg(-30, -42);
    this.rightLeg = this.createLeg(30, -42);
    this.torso = this.createTorso();
    this.head = this.createHead();

    this.root.add([this.leftArm, this.leftLeg, this.rightLeg, this.torso, this.rightArm, this.head]);
  }

  private createTorso() {
    const torso = this.scene.add.container(0, -125).setName('torso');
    const body = this.scene.add.graphics();
    body.fillStyle(this.skin.tunicShadowColor, 1);
    body.fillRoundedRect(-56, -62, 112, 116, 20);
    body.fillStyle(this.skin.tunicColor, 1);
    body.fillRoundedRect(-50, -66, 100, 112, 18);
    body.fillStyle(this.skin.tunicShadowColor, 1);
    body.fillTriangle(-50, 32, -28, 68, -6, 32);
    body.fillTriangle(-8, 32, 14, 68, 36, 32);
    body.fillTriangle(28, 32, 50, 64, 56, 32);
    body.fillStyle(this.skin.beltColor, 1);
    body.fillRoundedRect(-52, 4, 104, 16, 5);
    body.fillStyle(0xc99b5c, 1);
    body.fillRoundedRect(-10, 2, 20, 20, 4);
    torso.add(body);
    return torso;
  }

  private createHead() {
    const head = this.scene.add.container(0, -255).setName('head');
    this.leftEar = this.createEar(-62, -4, true);
    this.rightEar = this.createEar(62, -4, false);

    const face = this.scene.add.graphics();
    face.fillStyle(this.skin.skinShadowColor, 1);
    face.fillCircle(0, 8, 78);
    face.fillStyle(this.skin.skinColor, 1);
    face.fillCircle(0, 0, 78);

    this.normalEyes = this.createNormalEyes();
    this.xEyes = this.createXEyes();
    this.normalMouth = this.createNormalMouth();
    this.hurtMouth = this.createHurtMouth();

    head.add([
      this.leftEar,
      this.rightEar,
      face,
      this.normalEyes,
      this.xEyes,
      this.normalMouth,
      this.hurtMouth,
    ]);
    return head;
  }

  private createEar(x: number, y: number, left: boolean) {
    const ear = this.scene.add.graphics().setName(left ? 'left-ear' : 'right-ear');
    const direction = left ? -1 : 1;
    const angleOffset = this.skin.earAngle * direction;
    ear.fillStyle(this.skin.skinShadowColor, 1);
    ear.fillTriangle(
      x,
      y,
      x + direction * 64 * this.skin.earScale,
      y - 32 + angleOffset,
      x + direction * 22 * this.skin.earScale,
      y + 38
    );
    ear.fillStyle(this.skin.skinColor, 1);
    ear.fillTriangle(
      x + direction * 4,
      y + 2,
      x + direction * 55 * this.skin.earScale,
      y - 26 + angleOffset,
      x + direction * 21 * this.skin.earScale,
      y + 31
    );
    return ear;
  }

  private createNormalEyes() {
    const eyes = this.scene.add.container(0, -18).setName('normal-eyes');
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.skin.eyeColor, 1);
    graphics.fillCircle(-28, 0, 17);
    graphics.fillCircle(28, 0, 17);
    graphics.fillStyle(this.skin.pupilColor, 1);
    graphics.fillCircle(-28, 0, 7);
    graphics.fillCircle(28, 0, 7);
    eyes.add(graphics);
    return eyes;
  }

  private createXEyes() {
    const eyes = this.scene.add.container(0, -18).setName('x-eyes');
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(5, this.skin.pupilColor, 1);
    for (const center of [-28, 28]) {
      graphics.strokeLineShape(new Phaser.Geom.Line(center - 10, -10, center + 10, 10));
      graphics.strokeLineShape(new Phaser.Geom.Line(center + 10, -10, center - 10, 10));
    }
    eyes.add(graphics);
    return eyes;
  }

  private createNormalMouth() {
    const mouth = this.scene.add.container(0, 35).setName('normal-mouth');
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x221111, 1);
    graphics.fillRoundedRect(-24, -10, 48, 15, 4);
    if (this.skin.fangVisible) {
      graphics.fillStyle(this.skin.eyeColor, 1);
      graphics.fillTriangle(-8, -10, -2, 3, 4, -10);
    }
    mouth.add(graphics);
    return mouth;
  }

  private createHurtMouth() {
    const mouth = this.scene.add.container(0, 34).setName('hurt-mouth');
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x221111, 1);
    graphics.fillEllipse(0, 0, 30, 38);
    mouth.add(graphics);
    return mouth;
  }

  private createArm(x: number, y: number, rear: boolean) {
    const arm = this.scene.add.container(x, y).setName(rear ? 'rear-arm' : 'front-arm');
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(18, rear ? this.skin.skinShadowColor : this.skin.skinColor, 1);
    graphics.lineBetween(0, 0, rear ? -35 : 35, 66);
    graphics.fillStyle(rear ? this.skin.skinShadowColor : this.skin.skinColor, 1);
    graphics.fillCircle(rear ? -38 : 38, 70, 15);
    arm.add(graphics);
    return arm;
  }

  private createLeg(x: number, y: number) {
    const leg = this.scene.add.container(x, y).setName(x < 0 ? 'rear-leg' : 'front-leg');
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.skin.skinShadowColor, 1);
    graphics.fillRoundedRect(-16, -8, 32, 48, 12);
    graphics.fillStyle(this.skin.skinColor, 1);
    graphics.fillRoundedRect(-13, -10, 26, 45, 11);
    graphics.fillStyle(this.skin.skinShadowColor, 1);
    graphics.fillEllipse(x < 0 ? -12 : 12, 44, 54, 22);
    leg.add(graphics);
    return leg;
  }

  private setExpression(expression: GoblinExpression) {
    this.normalEyes.setVisible(expression === 'normal');
    this.normalMouth.setVisible(expression === 'normal');
    this.xEyes.setVisible(expression !== 'normal');
    this.hurtMouth.setVisible(expression !== 'normal');
  }

  private blink() {
    if (!this.normalEyes.visible) return;
    this.scene.tweens.add({
      targets: this.normalEyes,
      scaleY: 0.08,
      duration: 55,
      yoyo: true,
      ease: 'Quad.out',
    });
  }

  private twitchEar() {
    this.scene.tweens.add({
      targets: this.leftEar,
      angle: -7,
      duration: 60,
      yoyo: true,
      repeat: 1,
      ease: 'Quad.out',
    });
  }

  private resetPartTransforms() {
    for (const part of [
      this.torso,
      this.head,
      this.leftArm,
      this.rightArm,
      this.leftLeg,
      this.rightLeg,
      this.normalEyes,
      this.shadow,
    ]) {
      this.scene.tweens.killTweensOf(part);
      part.setScale(1);
      part.setAngle(0);
    }
    this.torso.setPosition(0, -125);
    this.head.setPosition(0, -255);
    this.leftArm.setPosition(-62, -160);
    this.rightArm.setPosition(62, -160);
    this.leftLeg.setPosition(-30, -42);
    this.rightLeg.setPosition(30, -42);
    this.shadow.setPosition(0, 5);
    this.shadow.setAlpha(0.28);
  }
}
