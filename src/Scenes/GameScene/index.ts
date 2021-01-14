import { find } from 'lodash';
import { map, forEach, toNumber, reduce, floor } from 'lodash';
import MessageToast from './Components/MessageToast/MessageToast.component';
import Text from '../../Library/Components/Text.component';
import Card from '../../Library/Components/Card.component';

import { centralizeObject } from '../../Utils/Phaser.utils';

import { round, times } from 'lodash';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'GameScene',
};

class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }
  public cards: Card[] = [];
  public txtMoney: Text;
  create() {
    const camera = this.cameras.main;
    camera.backgroundColor = Phaser.Display.Color.HexStringToColor('#000000');

    const totalCard: number = 7;
    const cardWidth: number = 100;
    console.log('camera.midPoint.x', camera.midPoint.x);
    times(totalCard, (i) => {
      const card = new Card({
        scene: this,
        x: camera.midPoint.x,
        y: 45,
        suit: 'of_clubs',
        kind: '1',
      });
      centralizeObject(card);
      this.cards.push(card);
    });

    this.txtMoney = new Text({
      scene: this,
      x: camera.midPoint.x,
      y: 45,
      text: '150',
      fontSize: 60,
      align: 'center',
    });
  }
}

export default GameScene;
