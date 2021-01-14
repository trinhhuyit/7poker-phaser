class FrameBasedSprite extends Phaser.GameObjects.Sprite {
  constructor({ scene, x, y, texture, prefix, end, key, zeroPad }) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    const frames = scene.anims.generateFrameNames(texture, {
      prefix,
      end,
      zeroPad,
      skipMissedFrames: true,
      frameRate: 1,
    });
    const anim = scene.anims.create({
      key,
      frames,
      repeat: -1,
    });
    anim.frames.forEach((frame) => {
      frame.frame.pivotX = 0.5;
      frame.frame.pivotY = 0.5;
    });
    this.setOriginFromFrame();
    this.play(key);
  }
}

export default FrameBasedSprite;
