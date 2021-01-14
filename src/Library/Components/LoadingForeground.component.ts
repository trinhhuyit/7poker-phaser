class LoadingForeground extends Phaser.GameObjects.Image {
  protected percentage: number = 0.5;
  protected maskForeground: Phaser.GameObjects.Graphics;
  protected maskX: number;
  protected masky: number;
  constructor({ scene, x, y, foregroundName, atlasName }) {
    super(scene, x, y, atlasName, foregroundName);
    scene.add.existing(this);
    this.maskForeground = new Phaser.GameObjects.Graphics(scene);
    this.mask = new Phaser.Display.Masks.BitmapMask(scene, this.maskForeground);
    this.setMaskPosition(x, y);
  }

  setMaskPosition = (x: number, y: number) => {
    this.maskX = x;
    this.maskX = y;
    this.maskForeground.x = x - this.width * this.originX;
    this.maskForeground.y = y - this.height * this.originY;
  };

  public drawMask = (percentage: number) => {
    if (percentage !== this.percentage) {
      this.percentage = percentage;
      const width = this.width * percentage;
      const height = this.height;
      if (
        this.maskForeground.x !== this.parentContainer.x ||
        this.maskForeground.y !== this.parentContainer.y
      ) {
        this.setMaskPosition(this.parentContainer.x, this.parentContainer.y);
      }
      this.maskForeground.clear();
      this.maskForeground.fillStyle(0xffffff).fillRect(0, 0, width, height);
    }
  };
}

export default LoadingForeground;
