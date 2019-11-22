import { GAME_LEVELS } from './src/levels/levels.js';
import { DOMDisplay } from './src/models/DOMDisplay.js';
import { Level } from './src/models/level.js';
import { State } from './src/models/state.js';

function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys =
  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}

async function runGame(plans, Display) {
  let lives = 3;
  for (let level = 0; level < plans.length && lives > 0;) {
    let status = await runLevel(new Level(plans[level]), Display);
    if (status == "lost") lives--;
    if (status == "won") level++;
  }
  if (lives > 0) {
    console.log("You've won!");
  } else {
    console.log("You've lost!");
  }
}

runGame(GAME_LEVELS, DOMDisplay);