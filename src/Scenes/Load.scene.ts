import { centralizeGraphics } from '../Utils/Phaser.utils';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'LoadScene',
};
class LoadScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }
  preload() {
    const camera = this.cameras.main;
    camera.backgroundColor = Phaser.Display.Color.HexStringToColor('#3498db');

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);

    const pgBoxRect = centralizeGraphics({
      x: camera.midPoint.x,
      y: camera.midPoint.y,
      width: 640,
      height: 100,
    });
    progressBox.fillRect(
      pgBoxRect.x,
      pgBoxRect.y,
      pgBoxRect.width,
      pgBoxRect.height,
    );

    this.add
      .text(camera.midPoint.x, camera.midPoint.y, 'Loading')
      .setFontSize(30)
      .setFontFamily('Arial')
      .setOrigin(0.5);
    this.load.atlas('ui', 'assets/images/ui.png', 'assets/images/ui.json');

    this.load.multiatlas(
      'cards',
      'assets/images/cards/cards.json',
      'assets/images/cards',
    );

    this.load.bitmapFont(
      'tabita',
      'assets/fonts/tabita.png',
      'assets/fonts/tabita.fnt',
    );

    this.load.image('level1_bg', 'assets/images/back/game_bg.png');
    this.load.image('gameplay_bg', 'assets/images/background.png');

    this.load.audio('bgm', ['assets/sound/bgm/Runaway_Technology.ogg']);
    this.load.audio('buy', ['assets/sound/buy.ogg']);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      const pgBarRect = centralizeGraphics({
        x: camera.midPoint.x,
        y: camera.midPoint.y,
        width: 600,
        height: 60,
      });
      progressBar.fillRect(
        pgBarRect.x,
        pgBarRect.y,
        600 * value,
        pgBarRect.height,
      );
    });
    this.load.on('complete', (value) => {
      this.scene.manager.start('GameScene');
    });
    this.load.start();
  }
}

export default LoadScene;
