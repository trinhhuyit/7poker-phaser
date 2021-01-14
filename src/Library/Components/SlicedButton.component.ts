import { NineSlice, NineSliceConfig, PositionConfig } from 'phaser3-nineslice';

interface SlicedButtonConfig {
  scene: Phaser.Scene;
  config: NineSliceConfig;
  position: PositionConfig;
  onClick: any;
  normalColor: integer;
  hoverColor: integer;
  pressedColor: integer;
  disabledColor: integer;
}
class SlicedButton extends NineSlice {
  private normalColor: integer;
  private hoverColor: integer;
  private pressedColor: integer;
  private disabledColor: integer;
  private isActive: boolean = true;
  constructor({
    scene,
    config,
    position,
    onClick,
    normalColor = 0xfff,
    hoverColor = 0xfff,
    pressedColor = 0xfff,
    disabledColor = 0xfff,
  }: SlicedButtonConfig) {
    super(scene, config, position);
    this.normalColor = normalColor;
    this.hoverColor = hoverColor;
    this.pressedColor = pressedColor;
    this.disabledColor = disabledColor;

    this.setButtonState(true);
    this.setInteractive()
      .on('pointerdown', () => {
        if (!this.isActive) return;
        this.setTint(this.pressedColor || this.normalColor);
        onClick(this);
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
  public changeNormalColor = (newColor) => {
    this.normalColor = newColor;
    this.setTint(this.normalColor);
  };
  public changeHoverColor = (newColor) => {
    this.hoverColor = newColor;
  };
}
export default SlicedButton;
