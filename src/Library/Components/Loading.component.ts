import LoadingForeground from './LoadingForeground.component';
class Loading extends Phaser.GameObjects.Container {
  protected imgBackground: Phaser.GameObjects.Image;
  protected imgForeground: LoadingForeground;
  protected percentage: number = 0;
  protected atlasName: string;
  constructor({
    scene,
    x,
    y,
    backgroundName,
    backgroundImage,
    foregroundImage,
    foregroundName,
    atlasName = '',
  }) {
    super(scene, x, y);
    scene.add.existing(this);
    this.atlasName = atlasName;
    this.addBackground(scene, backgroundName);
    this.addForeground(scene, foregroundName);
  }

  private addBackground = (scene, backgroundName) => {
    this.imgBackground = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      this.atlasName,
      backgroundName,
    );
    this.add(this.imgBackground);
  };

  private addForeground = (scene, foregroundName) => {
    this.imgForeground = new LoadingForeground({
      scene,
      x: 0,
      y: 0,
      foregroundName,
      atlasName: this.atlasName,
    });
    this.imgForeground.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    this.add(this.imgForeground);
  };
  drawPercentange(percentage: number): void {
    this.imgForeground.drawMask(percentage);
  }

  public setOrigin = (originX, originY) => {
    this.list.forEach((go: any) => {
      if (go.setOrigin) go.setOrigin(originX, originY);
    });
  };
}

export default Loading;
