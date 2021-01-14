class Text extends Phaser.GameObjects.BitmapText {
  constructor({ scene, x, y, text, fontSize, align }) {
    super(scene, x, y, 'tabita', text, fontSize, align);
  }
}

export default Text;
