class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }
  public create() {
    this.scene.manager.start('LoadScene');
  }
}

export default BootScene;
