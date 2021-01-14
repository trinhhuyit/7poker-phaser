import * as Phaser from 'phaser';

import BootScene from './Scenes/Boot.scene';
import LoadScene from './Scenes/Load.scene';
import GameScene from './Scenes/GameScene';
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'AdCap',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    width: 1920,
    height: 1080,
  },
  plugins: {
    global: [NineSlicePlugin.DefaultCfg],
  },
  parent: 'canvasholder',
  scene: [BootScene, LoadScene, GameScene],
};

export const game = new Phaser.Game(gameConfig);
