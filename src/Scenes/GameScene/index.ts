import {
  find,
  map,
  forEach,
  toNumber,
  reduce,
  floor,
  filter,
  includes,
  omit,
  replace,
  keys,
} from 'lodash';
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
  public txtResult: Text;
  public txtBidValue: Text;
  public btnBid: CustomSlicedButton;
  public btnSkip: CustomSlicedButton;
  public btnOpen: CustomSlicedButton;
  updatePlayerUI = () => {
    this.txtCredits.text = `Credit : ${this.playerService.credits}$`;
    this.txtTurns.text = `Turn : ${this.turn}`;
    this.txtBidValue.text = `Bid : ${this.playerService.bid}`;
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

    this.txtResult = new Text({
      scene: this,
      x: centerX,
      y: 150,
      text: '',
      fontSize: 60,
      align: 'center',
    });
    this.txtResult.originX = 0.5;
    this.children.add(this.txtResult);
  };
  public createButtons = () => {
    const camera = this.cameras.main;

    const centerX = camera.midPoint.x;
    const centerY = camera.midPoint.y;

    const centerButtonSpace = 300;
    this.btnBid = new CustomSlicedButton({
      scene: this,
      x: centerX - centerButtonSpace,
      y: centerY + 450,
      text: 'Bid (20$)',
      onClick: () => {
        if (!this.canBid) return;
        if (this.playerService.bidCredit()) {
          this.updatePlayerUI();
          this.turn += 1;
          this.updateCardsTurn();
        }
      },
    });
    this.btnBid.visible = false;
    this.children.add(this.btnBid);

    this.btnSkip = new CustomSlicedButton({
      scene: this,
      x: centerX,
      y: centerY + 450,
      text: 'Skip',
      onClick: () => {
        if (!this.canBid) return;
        this.updatePlayerUI();
        this.turn += 1;
        this.updateCardsTurn();
      },
    });
    this.btnSkip.visible = false;
    this.children.add(this.btnSkip);

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

    this.btnOpen = new CustomSlicedButton({
      scene: this,
      x: centerX + centerButtonSpace,
      y: centerY + 450,
      text: 'Open',
      onClick: () => {
        this.openCardsSet();
      },
    });
    this.btnOpen.visible = false;
    this.children.add(this.btnOpen);

    const btnNewGame = new CustomSlicedButton({
      scene: this,
      x: 150,
      y: centerY + 450,
      text: 'New Game (20$)',
      onClick: () => {
        if (this.playerService.bidCredit()) {
          this.newGame();
          this.updatePlayerUI();
          this.btnBid.visible = true;
          this.btnSkip.visible = true;
          this.btnOpen.visible = true;
          this.canBid = true;
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
    this.updateRewardTexts();
    if (this.turn === 1) {
      this.openCard(0, 0, true);
      this.openCard(1, 100);
      this.openCard(2, 200, true);
    }
    if (this.turn === 2) {
      this.openCard(3, 0);
      this.openCard(4, 100, true);
    }
    if (this.turn === 3) {
      this.openCard(5, 0, true);
    }
    if (this.turn === 4) {
      this.openCard(6, 0, true);
      this.openCard(1, 200, true);
      this.openCard(3, 200, true);
      this.checkWin();
    }
  };
  public getReward = (result) => {
    const {
      isRoyalFlush,
      isFiveOfAKind,
      isStraightFlush,
      isFourOfAKind,
      isFullHouse,
      isFlush,
      isStraight,
      isThreeOfAKind,
      isTwoOfAKind,
    } = result;
    const totalBid = this.playerService.bid / 20;
    if (isRoyalFlush) return 10000 * totalBid;
    if (isFiveOfAKind) return 4000 * totalBid;
    if (isStraightFlush) return 2400 * totalBid;
    if (isFourOfAKind) return 1000 * totalBid;
    if (isFullHouse) return 140 * totalBid;
    if (isFlush) return 100 * totalBid;
    if (isStraight) return 60 * totalBid;
    if (isThreeOfAKind) return 40 * totalBid;
    if (isTwoOfAKind) return 20 * totalBid;
  };
  //['isRoyalFlush',]
  public rewardTexts: any[] = [];
  public createRewardText = () => {
    const rewardData = [
      'isRoyalFlush',
      'isFiveOfAKind',
      'isStraightFlush',
      'isFourOfAKind',
      'isFullHouse',
      'isFlush',
      'isStraight',
      'isThreeOfAKind',
      'isTwoOfAKind',
    ];
    forEach(rewardData, (reward, i) => {
      const rewardText = replace(reward, 'is', '')
        .match(/[A-Z][a-z]+/g)
        .join(' ');
      const text = new Text({
        scene: this,
        x: 1920 - 600,
        y: 25 + i * 35,
        text: `${rewardText} ${this.getReward({ [reward]: true })}`,
        fontSize: 30,
        align: 'right',
      });
      this.children.add(text);
      this.rewardTexts.push({
        text,
        reward,
        rewardText,
      });
    });
  };
  public updateRewardTexts = () => {
    console.trace('I');
    forEach(this.rewardTexts, ({ text, reward, rewardText }) => {
      text.text = `${rewardText} ${this.getReward({ [reward]: true })}`;
    });
  };
  public handleWinEffect = (result) => {
    const { group, withJokers } = result;
    const includesCardsIds = map(group, '_id');
    console.log('includesCardsIds', includesCardsIds);
    const includedCards = filter(this.cards, (card) =>
      includes(includesCardsIds, card._id),
    );
    forEach(includedCards, (card) => card.setTint(0xffd700));
    if (withJokers > 0) {
      const allJokers = filter(this.cards, (card) => card.kind === 'joker');
      for (let i = 0; i < withJokers; i++) {
        const jokerCard = allJokers[i];
        jokerCard.setTint(0xffd700);
      }
    }
    const reward = keys(omit(result, ['group', 'withJokers']))[0];

    const rewardText = find(this.rewardTexts, { reward });
    rewardText.text.alpha = 0.5;
  };
  public checkWin = () => {
    let result;
    if (this.turn === 1) {
      result = this.cardsService.checkResult(3);
    } else if (this.turn === 2) {
      result = this.cardsService.checkResult(5);
    } else if (this.turn === 4) {
      result = this.cardsService.checkResult(7);
    }
    console.log('result', result);
    if (result) {
      const reward = this.getReward(result);
      this.txtResult.text = `You got ${reward}`;
      this.playerService.credits += reward;
      this.updatePlayerUI();
      this.handleWinEffect(result);
    } else {
      this.txtResult.text = `Loss`;
    }
    this.canBid = false;
    this.playerService.bid = 0;
    this.btnBid.visible = false;
    this.btnSkip.visible = false;
    this.btnOpen.visible = false;
  };
  public openCardsSet = () => {
    if (this.turn === 1) {
      this.openCard(1, 0, true);
      this.checkWin();
    }
    if (this.turn === 2) {
      this.openCard(1, 0, true);
      this.openCard(3, 0, true);
      this.checkWin();
    }
  };
  public clearUI = () => {
    this.txtResult.text = '';
  };
  public newGame = () => {
    try {
      this.clearUI();
      this.updatePlayerUI();
      forEach(this.rewardTexts, ({ text }) => {
        text.alpha = 1;
      });
      const camera = this.cameras.main;
      const centerX = camera.midPoint.x;
      const centerY = camera.midPoint.y;
      const minX = centerX - ((TOTAL_CARDS - 1) * CARD_WIDTH) / 2;
      const minY = centerY;
      this.cardsService.generateCardData();
      times(TOTAL_CARDS, (i) => {
        const { suit, kind, _id } = this.cardsService.cardsData[i];
        const x = minX + i * CARD_WIDTH;
        const y = minY + (i % 2 === 0 ? 0 : 50);
        let card = this.cards[i];
        if (!card) {
          card = new Card({
            scene: this,
            x,
            y,
            suit,
            _id,
            kind,
            isFaceDown: true,
          });
          this.children.add(card);
          this.cards.push(card);
        }
        card.updateSuitAndKind({ suit, kind, _id });
        card.updateFrame();
        card.setTint(0xffffff);
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
      this.createButtons();
      this.updatePlayerUI();
      this.createRewardText();
    } catch (error) {
      console.log('error', error);
    }
  }
}

export default GameScene;
