interface ButtonConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string | Phaser.Textures.Texture;
  frame: string | integer;
  onClick: any;
  normalColor: integer;
  hoverColor: integer;
  pressedColor: integer;
  disabledColor: integer;
}
class Button extends Phaser.GameObjects.Sprite {
  private normalColor: integer;
  private hoverColor: integer;
  private pressedColor: integer;
  private disabledColor: integer;
  private isActive: boolean = true;
  constructor({
    scene,
    x,
    y,
    texture,
    frame,
    onClick,
    normalColor = 0xfff,
    hoverColor = 0xfff,
    pressedColor = 0xfff,
    disabledColor = 0xfff,
  }: ButtonConfig) {
    super(scene, x, y, texture, frame);
    this.normalColor = normalColor;
    this.hoverColor = hoverColor;
    this.pressedColor = pressedColor;
    this.disabledColor = disabledColor;

    this.setButtonState(true);
    this.setInteractive()
      .on('pointerdown', () => {
        if (!this.isActive) return;
        onClick(this);
        this.setTint(this.pressedColor || this.normalColor);
      })
      .on('pointerover', () => {
        if (!this.isActive) return;
        this.setTint(this.hoverColor || this.normalColor);
      })
      .on('pointerup', () => {
        if (!this.isActive) return;
        this.setTint(this.normalColor);
      })
      .on('pointerout', () => {
        if (!this.isActive) return;
        this.setTint(this.normalColor);
      });
  }
  public setButtonState = (isActive) => {
    this.isActive = isActive;
    this.setTint(isActive ? this.normalColor : this.disabledColor);
  };
}

export default Button;
