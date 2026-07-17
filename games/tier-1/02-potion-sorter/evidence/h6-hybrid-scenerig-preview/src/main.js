import { STAGE } from './config.js';
import { PreviewScene } from './PreviewScene.js';

await document.fonts.ready;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'preview',
  backgroundColor: '#09060d',
  width: STAGE.width,
  height: STAGE.height,
  transparent: false,
  render: { antialias: true, roundPixels: false, pixelArt: false },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [PreviewScene],
});
