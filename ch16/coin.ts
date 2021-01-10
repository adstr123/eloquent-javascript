import State from "./state.js";
import Vec from "./vec.js";

export default class Coin {
  pos: Vec;
  basePos: Vec;
  // tracks the phase of the coins wobble animation
  wobble: number;
  size: Vec;
  constructor(pos: Vec, basePos: Vec, wobble: number) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
    this.size = new Vec(0.6, 0.6);
  }

  static create(pos: Vec) {
    let basePos = pos.plus(new Vec(0.2, 0.1));

    // random start position of the wobble motion ensures all coins are not synchronised
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }

  /**
   * if the player is overlapping a coin, we get a chance to update state
   * this coin vanishes
   * the game updates to "won" if this is the last coin of the level
   */
  collide(state: State) {
    let filtered = state.actors.filter((a) => a != this);
    let status = state.status;
    if (!filtered.some((a) => a.type == "coin")) status = "won";
    return new State(state.level, filtered, status);
  }

  /**
   * Ignore collisions with grid objects because they are just wobbling around inside their own grid field.
   * Increment, then use sin() to find new position on the wave.
   * Coin position is then computes from base & offset based on the wave.
   * @param time
   */
  update(time: number) {
    // wobbleSpeed = 8
    // wobbleDist = 0.07
    let wobble = this.wobble + time * 8;
    let wobblePos = Math.sin(wobble) + 0.07;
    return new Coin(
      this.basePos.plus(new Vec(0, wobblePos)),
      this.basePos,
      wobble
    );
  }

  get type() {
    return "coin";
  }
}
