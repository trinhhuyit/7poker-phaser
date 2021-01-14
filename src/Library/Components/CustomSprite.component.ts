class CustomSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    scene.children.add(this);
  }
}

export default CustomSprite;
