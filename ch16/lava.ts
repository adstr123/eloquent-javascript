import State from "./state.js";
import Vec from "./vec.js";

export default class Lava {
  pos: Vec;
  speed: Vec;
  // if this property is present, lava will drip; else it will bounce
  reset: any;
  size: Vec;
  constructor(pos: Vec, speed: Vec, reset?: Vec) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
    this.size = new Vec(1, 1);
  }

  /**
   * creates an object representing lava
   * need to initialise differently depending on the character it is based on
   * @param pos
   * @param ch
   */
  static create(pos: Vec, ch: string) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }

  /**
   * if the player is overlapping lava, we get a chance to update state with "lost"
   */
  collide(state: State) {
    return new State(state.level, state.actors, "lost");
  }

  /**
   * Computes a new position by adding the product of time & speed to the old position.
   * Moves to the new grid field; if blocked by an obstacle: dripping lava resets, bouncing lava inverts speed
   * @param time
   * @param state
   */
  update(time: number, state: State) {
    let newPos = this.pos.plus(this.speed.times(time));
    if (!state.level.touches(newPos, this.size, "wall")) {
      return new Lava(newPos, this.speed, this.reset);
    } else if (this.reset) {
      return new Lava(this.reset, this.speed, this.reset);
    } else {
      return new Lava(this.pos, this.speed.times(-1));
    }
  }

  get type() {
    return "lava";
  }
}
