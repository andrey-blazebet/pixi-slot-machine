/**
 * Just for simplicity and demonstration purposes, no specific JavaScript framework or state management library has
 * been used.
 */

import * as PIXI from 'pixi.js';
import FPSDisplay from './components/FPSDisplay';
import PlayButton from './components/PlayButton';
import Reels from './components/Reels';
import SelectPlayMode from './components/SelectPlayMode';
import { config } from './config';

import './style.css';

const { gameWidth, gameHeight } = config;

function createApplication(): PIXI.Application {
  const app = new PIXI.Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight
  });
  return app;
}

function loadAssets(onComplete: () => void): void {
  const loader = PIXI.Loader.shared;
  loader.onComplete.once(onComplete);
  loader.load();
}

function render(app: PIXI.Application) {
  document.body.appendChild(app.view);
}

window.onload = () =>
  loadAssets(() => {
    const app = createApplication();
    const stage = app.stage;

    const button = new PlayButton(config);
    stage.addChild(button);

    const select = new SelectPlayMode(config);
    stage.addChild(select);

    const reels = new Reels(config, app.ticker);
    stage.addChild(reels);

    const fpsDisplay = new FPSDisplay(config, app.ticker);
    stage.addChild(fpsDisplay);

    button.on('click', function (this: PlayButton) {
      if (!reels.areSpinning()) {
        this.setDisabled();
        reels.spin(() => {
          this.setInactive();
        });
      }
    });

    select.on('click', function (this: SelectPlayMode) {
      reels.setEasyMode(this.isOn());
    });

    render(app);
  });
