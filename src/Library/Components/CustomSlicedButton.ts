import { centralizeObject } from '../../Utils/Phaser.utils';
import Text from './Text.component';
import SlicedButton from './SlicedButton.component';

class CustomSlicedButton extends Phaser.GameObjects.Container {
  protected btnBid: SlicedButton;
  protected txtBid: Text;

  private addText = (scene, text) => {
    this.txtBid = new Text({
      scene,
      x: 0,
      y: 0,
      text,
      fontSize: 29,
      align: 0,
    });
    this.txtBid.setOrigin(0.5, 0.5);
    this.add(this.txtBid);
  };
  private addBackground = (scene, onClick) => {
    this.btnBid = new SlicedButton({
      scene,
      config: {
        sourceKey: 'ui',
        sourceFrame: 'investment-button.png',
        sourceLayout: {
          topLeft: {
            width: 25,
            height: 20,
          },
        },
      },
      position: {
        x: 0,
        y: 0,
        width: 220,
        height: 81,
      },
      normalColor: 0xff974d,
      hoverColor: 0xff974d,
      pressedColor: 0xe0803c,
      disabledColor: 0x6c6358,
      onClick: onClick,
    });
    this.add(this.btnBid);
    centralizeObject(this.btnBid);
  };
  constructor({ scene, x, y, onClick, text }) {
    super(scene, x, y);
    scene.add.existing(this);
    this.addBackground(scene, onClick);
    this.addText(scene, text);
  }
}

export default CustomSlicedButton;
