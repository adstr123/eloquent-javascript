import Coin from "./coin";
import Lava from "./lava";
import Level from "./level.js";
import Player, { Keys } from "./player";
import State from "./state.js";

interface Attributes {
  [key: string]: string;
}

/**
 * helper function provides a succinct way to create an element & provide attributes/child noes
 * @param name
 * @param attrs
 * @param children
 */
function elt(name: string, attrs: Attributes, ...children: HTMLElement[]) {
  let dom = document.createElement(name);

  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }

  return dom;
}

// create a display by giving a parent element, to which it should append itself, & a level
export class DOMDisplay {
  dom: HTMLElement;
  actorLayer: null | HTMLElement;

  constructor(parent: HTMLElement, level: Level) {
    // background grid never changes & is drawn once
    this.dom = elt("div", { class: "game" }, drawGrid(level));
    // actors are redrawn each time display is updated with a new state
    // actorLayer tracks the element that holds the actors, for easy removal/replacing
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  /**
   * make display show a given state
   */
  syncState(state: State) {
    // first, remove old actor graphics (if any)
    if (this.actorLayer) this.actorLayer.remove();
    // redraw the actors in their new positions, instead of reusing old elements
    // reusing old elements would require much more verbose state
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    // style the player differently based on whether the game is won or lost
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
  }

  /**
   * ensures that if the level protrudes outside the viewport, we scroll viewport to ensure the player is near its center
   * find player position & update the wrapping element's scroll position
   * update scroll position by manipulating scrollLeft & scrollTop properties
   */
  scrollPlayerIntoView(state: State) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3;

    // the viewport
    let left = this.dom.scrollLeft,
      right = left + width;
    let top = this.dom.scrollTop,
      bottom = top + height;

    let player = state.player;
    let center = player?.pos.plus(player.size.times(0.5)).times(scale);

    // it would be simpler to always scroll the player to the center of the viewport
    // but this may be jarring - better to define a 'natural' area the player can walk around
    if (center && center.x < left + margin) {
      this.dom.scrollLeft = center.x - margin;
    } else if (center && center.x > right - margin) {
      this.dom.scrollLeft = center.x + margin - width;
    }
    if (center && center.y < top + margin) {
      this.dom.scrollTop = center.y - margin;
    } else if (center && center.y > bottom - margin) {
      this.dom.scrollTop = center.y + margin - height;
    }
  }

  clear() {
    this.dom.remove();
  }
}

// grid tiles must be scaled up from individual pixels, else game would be too small
const scale = 20;

function drawGrid(level: Level) {
  return elt(
    "table",
    {
      class: "background",
      style: `width: ${level.width * scale}px`,
    },
    ...level.rows.map((row) =>
      elt(
        "tr",
        { style: `height: ${scale}px` },
        ...row.map((type) => elt("td", { class: type }))
      )
    )
  );
}

/**
 * draw each actor by creating a DOM element & setting position/size based on that actor's properties
 * ensure they are multiplied by the scale to match the grid size
 * @param actors
 */
function drawActors(actors: (Coin | Lava | Player)[]) {
  return elt(
    "div",
    {},
    ...actors.map((actor) => {
      let rect = elt("div", { class: `actor ${actor.type}` });
      rect.style.width = `${actor.size.x * scale}px`;
      rect.style.height = `${actor.size.y * scale}px`;
      rect.style.left = `${actor.pos.x * scale}px`;
      rect.style.top = `${actor.pos.y * scale}px`;
      return rect;
    })
  );
}

/**
 * Wraps requestAnimationFrame setup into a convenient interface
 * @param frameFunc
 */
function runAnimation(frameFunc: (timeStep: number) => any) {
  let lastTime: number | null = null;

  function frame(time: number) {
    if (lastTime != null) {
      // max framestep is 0.1s
      // if window is tabbed out/in, game won't jump jarringly
      // convert time step to seconds, easier to think about
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/**
 * To know when to stop and restart the animation, a level that is
 * being displayed may be in three `running` states:
 * * "yes":     Running normally.
 * * "no":      Paused, animation isn't running
 * * "pausing": Must pause, but animation is still running
 *
 * The key handler, when it notices escape being pressed, will do a
 * different thing depending on the current state. When running is
 * "yes" or "pausing", it will switch to the other of those two
 * states. When it is "no", it will restart the animation and switch
 * the state to "yes".
 *
 * The animation function, when state is "pausing", will set the state
 * to "no" and return false to stop the animation.
 * @param level
 * @param Display
 */
function runLevel(level: Level, Display: typeof DOMDisplay) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  let running = "yes";

  return new Promise((resolve) => {
    function escHandler(event: KeyboardEvent) {
      if (event.key != "Escape") return;
      event.preventDefault();

      if (running == "no") {
        running = "yes";
        runAnimation(frame);
      } else if (running == "yes") {
        running = "pausing";
      } else {
        running = "yes";
      }
    }
    window.addEventListener("keydown", escHandler);
    const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

    function frame(time: number) {
      if (running == "pausing") {
        running = "no";
        return false;
      }

      state = state.update(time, arrowKeys);
      display.syncState(state);

      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        window.removeEventListener("keydown", escHandler);
        arrowKeys.unregister();
        resolve(state.status);
        return false;
      }
    }
    runAnimation(frame);
  });
}

/**
 * Track the current keys pressed. Effect of pressing a key stays active as long as it is held.
 * @param keys the keys that this function should track the state of
 * @returns {Object} object describing current position of the keys specified in args
 */
function trackKeys(keys: string[]): Keys {
  let down = Object.create(null);
  function track(event: KeyboardEvent) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault;
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);

  down.unregister = () => {
    window.removeEventListener("keydown", track);
    window.removeEventListener("keyup", track);
  };

  return down;
}

/**
 * Describes a game as a sequence of levels.
 * When the player dies, the current level is restarted.
 * When a level is completed, progress to the next level.
 * @param plans level plans in string format
 * @param Display
 */
export default async function runGame(
  plans: string[],
  Display: typeof DOMDisplay
) {
  let lives = 3;

  for (let level = 0; level < plans.length; ) {
    console.log(`You have ${lives} lives remaining`);
    let status = await runLevel(new Level(plans[level]), Display);
    if (status === "lost") {
      lives--;
      if (lives === 0) {
        console.log("Game over");
        level = 0;
        lives = 3;
      }
    } else if (status === "won") level++;
  }
  console.log("You've won!");
}
