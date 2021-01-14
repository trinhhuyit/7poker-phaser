class Card extends Phaser.GameObjects.Sprite {
  public suit: string; // of_clubs, of_diamonds, of_hearts, of_spades //black, red
  public kind: string; //1,2,3,4,5,6,7,8,9,J,Q,K //joker
  public isFaceDown: boolean;
  public currentFrame: string;
  constructor({ scene, x, y, suit, kind, isFaceDown }) {
    super(scene, x, y, 'cards', '');

    this.scale = 0.5;
    this.isFaceDown = isFaceDown;
    this.updateSuitAndKind({ suit, kind });
    this.updateFrame();
  }
  public updateSuitAndKind({ suit, kind }) {
    this.suit = suit;
    this.kind = kind;
  }
  public updateFrame = () => {
    this.currentFrame = `${this.kind}_${this.suit}.png`;
    const finalFrame = this.isFaceDown ? 'face_down.png' : this.currentFrame;
    this.setFrame(finalFrame);
  };
  public faceUp = () => {
    this.isFaceDown = false;
    this.updateFrame();
  };
}

export default Card;
