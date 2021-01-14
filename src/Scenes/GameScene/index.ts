import { find } from 'lodash';
import { map, forEach, toNumber, reduce, floor } from 'lodash';
import MessageToast from './Components/MessageToast/MessageToast.component';
import Text from '../../Library/Components/Text.component';
import Card from '../../Library/Components/Card.component';
import SlicedButton from '../../Library/Components/SlicedButton.component';
import CardsService from '../../Library/Services/Cards.service';
import PlayerService from '../../Library/Services/Player.service';
import CustomSlicedButton from '../../Library/Components/CustomSlicedButton';

import { centralizeObject } from '../../Utils/Phaser.utils';

import { round, times } from 'lodash';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'GameScene',
};
const TOTAL_CARDS: number = 7;
const CARD_WIDTH: number = 200;
class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }
  public turn: number = 1;
  public cards: Card[] = [];
  public cardsService: CardsService;
  public playerService: PlayerService;
  public canBid: boolean;
  public txtCredits: Text;
  public txtTurns: Text;
  public txtBidValue: Text;

  updatePlayerUI = () => {
    this.txtCredits.text = `Credit : ${this.playerService.credits}$`;
    this.txtTurns.text = `Turn : ${this.turn}`;
  };
  createPlayerUI = () => {
    const camera = this.cameras.main;
    camera.backgroundColor = Phaser.Display.Color.HexStringToColor('#000000');
    const centerX = camera.midPoint.x;
    const centerY = camera.midPoint.y;
    this.txtCredits = new Text({
      scene: this,
      x: 15,
      y: 25,
      text: 'Credits : xxx',
      fontSize: 60,
      align: 'left',
    });
    this.children.add(this.txtCredits);
    this.txtTurns = new Text({
      scene: this,
      x: centerX,
      y: 25,
      text: 'Turn : xxx',
      fontSize: 60,
      align: 'center',
    });
    this.txtTurns.originX = 0.5;
    this.children.add(this.txtTurns);
  };
  public createButtons = () => {
    const camera = this.cameras.main;

    const centerX = camera.midPoint.x;
    const centerY = camera.midPoint.y;

    const centerButtonSpace = 140;
    const btnBid = new CustomSlicedButton({
      scene: this,
      x: centerX - centerButtonSpace,
      y: centerY + 450,
      text: 'Bid (20$)',
      onClick: () => {
        this.playerService.bidCredit();
        this.updatePlayerUI();
      },
    });
    btnBid.visible = false;
    this.children.add(btnBid);

    this.txtBidValue = new Text({
      scene: this,
      x: centerX - centerButtonSpace,
      y: centerY + 450 - 100,
      text: 'Bidded: 20',
      fontSize: 60,
      align: 'center',
    });
    this.txtBidValue.originX = 0.5;
    this.txtBidValue.originY = 0.5;
    this.children.add(this.txtBidValue);

    const btnOpen = new CustomSlicedButton({
      scene: this,
      x: centerX + centerButtonSpace,
      y: centerY + 450,
      text: 'Open',
      onClick: () => {
        this.playerService.bidCredit();
        this.updatePlayerUI();
      },
    });
    btnOpen.visible = false;
    this.children.add(btnOpen);

    const btnNewGame = new CustomSlicedButton({
      scene: this,
      x: 150,
      y: centerY + 450,
      text: 'New Game (20$)',
      onClick: () => {
        if (this.playerService.useCredits(20)) {
          this.newGame();
          this.updatePlayerUI();
          btnBid.visible = true;
          btnOpen.visible = true;
        }
      },
    });
    this.children.add(btnNewGame);
  };
  public openCard = (cardId: number, time: number, faceUp: boolean = false) => {
    const handler = () => {
      const currentCard: Card = this.cards[cardId];
      currentCard.visible = true;
      if (faceUp) currentCard.faceUp();
    };
    if (time === 0) return handler();
    setTimeout(() => handler(), time);
  };
  public updateCardsTurn = () => {
    if (this.turn === 1) {
      this.openCard(0, 0, true);
      this.openCard(1, 100);
      this.openCard(2, 200, true);
    }
  };
  public newGame = () => {
    try {
      const camera = this.cameras.main;
      const centerX = camera.midPoint.x;
      const centerY = camera.midPoint.y;
      const minX = centerX - ((TOTAL_CARDS - 1) * CARD_WIDTH) / 2;
      const minY = centerY;
      this.cardsService.generateCardData();
      times(TOTAL_CARDS, (i) => {
        const { suit, kind } = this.cardsService.cardsData[i];
        const x = minX + i * CARD_WIDTH;
        const y = minY + (i % 2 === 0 ? 0 : 50);
        let card = this.cards[i];
        if (!card) {
          card = new Card({
            scene: this,
            x,
            y,
            suit,
            kind,
            isFaceDown: true,
          });
          this.children.add(card);
          this.cards.push(card);
        }
        card.updateSuitAndKind({ suit, kind });
        card.visible = false;
      });
      this.turn = 1;
      this.updateCardsTurn();
    } catch (error) {
      console.log('error', error);
    }
  };
  public setupCamera = () => {
    const camera = this.cameras.main;
    camera.backgroundColor = Phaser.Display.Color.HexStringToColor('#000000');
  };
  create() {
    try {
      this.cardsService = new CardsService(TOTAL_CARDS);
      this.playerService = new PlayerService();

      this.createPlayerUI();
      this.updatePlayerUI();
      this.createButtons();
    } catch (error) {
      console.log('error', error);
    }
  }
}

export default GameScene;
