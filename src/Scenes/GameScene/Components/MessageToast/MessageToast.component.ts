import { centralizeObject } from '../../../../Utils/Phaser.utils';
import Text from '../../../../Library/Components/Text.component';
import { millisToMinutesAndSeconds } from '../../../../Utils/Time.utils';
import { NineSlice } from 'phaser3-nineslice';
import SlicedButton from '../../../../Library/Components/SlicedButton.component';

class MessageToast extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, time, profit }) {
    super(scene, x, y);
    scene.add.existing(this);
    const camera = scene.cameras.main;

    const sprBackground = new Phaser.GameObjects.TileSprite(
      scene,
      camera.midPoint.x + 50,
      camera.midPoint.y,
      1080,
      1920,
      'gameplay_bg',
    )
      .setScale(1.2, 1)
      .setTint(0x736960);
    this.add(sprBackground);

    const txtWelcomeBack = new Text({
      scene,
      x: camera.midPoint.x,
      y: 140,
      text: 'Welcome back\ncapitalist!',
      fontSize: 120,
      align: 1,
    }).setTint(0x529cc1);
    centralizeObject(txtWelcomeBack);
    this.add(txtWelcomeBack);

    const txttime = new Text({
      scene,
      x: camera.midPoint.x,
      y: 400,
      text: `You were offline for ${millisToMinutesAndSeconds(time)}`,
      fontSize: 60,
      align: 1,
    });
    centralizeObject(txttime);
    this.add(txttime);

    const sprWhiteBackground = new NineSlice(
      scene,
      {
        sourceKey: 'ui',
        sourceFrame: 'investment-button.png',
        sourceLayout: {
          topLeft: {
            width: 25,
            height: 20,
          },
          topRight: {
            width: 25,
            height: 20,
          },
          bottomLeft: {
            width: 25,
            height: 20,
          },
          bottomRight: {
            width: 25,
            height: 20,
          },
        },
      },
      {
        x: camera.midPoint.x,
        y: camera.midPoint.y,
        width: 716,
        height: 340,
      },
    ).setTint(0xffffff);
    this.add(sprWhiteBackground);
    centralizeObject(sprWhiteBackground);

    const txtYouEarn = new Text({
      scene,
      x: camera.midPoint.x,
      y: camera.midPoint.y - 100,
      text: `You earned`,
      fontSize: 60,
      align: 1,
    });
    centralizeObject(txtYouEarn);
    this.add(txtYouEarn);

    const txtprofit = new Text({
      scene,
      x: camera.midPoint.x,
      y: camera.midPoint.y,
      text: `${profit}$`,
      fontSize: 90,
      align: 1,
    }).setTint(0x99bf6b);
    centralizeObject(txtprofit);
    this.add(txtprofit);

    const txtWhileYouWereGone = new Text({
      scene,
      x: camera.midPoint.x,
      y: camera.midPoint.y + 100,
      text: `while you were gone`,
      fontSize: 60,
      align: 1,
    });
    centralizeObject(txtWhileYouWereGone);
    this.add(txtWhileYouWereGone);

    const btnContinue = new SlicedButton({
      scene,
      config: {
        sourceKey: 'ui',
        sourceFrame: 'null.png',
        sourceLayout: {
          topLeft: {
            width: 20,
            height: 20,
          },
        },
      },
      position: {
        x: camera.midPoint.x,
        y: camera.midPoint.y + 700,
        width: 302,
        height: 101,
      },
      normalColor: 0xff974d,
      hoverColor: 0xff974d,
      pressedColor: 0xe0803c,
      disabledColor: 0x6c6358,
      onClick: () => {
        this.visible = false;
      },
    });
    centralizeObject(btnContinue);
    this.add(btnContinue);

    const txtContinue = new Text({
      scene,
      x: camera.midPoint.x,
      y: camera.midPoint.y + 700,
      text: `Continue`,
      fontSize: 60,
      align: 1,
    });
    centralizeObject(txtContinue);
    this.add(txtContinue);
  }
}

export default MessageToast;
