import CustomSprite from './CustomSprite.component';
class Card extends CustomSprite {
  public suit: string; // of_clubs, of_diamonds, of_hearts, of_spades //black, red
  public kind: string; //1,2,3,4,5,6,7,8,9,J,Q,K //joker
  constructor({ scene, x, y, suit, kind }) {
    const frame = `${suit}_${kind}.png`;
    super(scene, x, y, 'cards', frame);
    this.suit = suit;
    this.kind = kind;
  }
}

export default Card;
