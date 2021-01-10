import State from "./state";
import Vec from "./vec.js";

export interface Keys {
  ArrowUp: boolean;
  ArrowRight: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  unregister: Function;
}

export default class Player {
  pos: Vec;
  speed: Vec;
  size: Vec;

  /**
   * creates an object representing the player
   * @param {Vec} pos - coordinates of this player's top-left corner
   * @param {Vec} speed - simulates momentum & gravity
   * @param {Vec} size - defines how many grid tiles the actor spans
   */
  constructor(pos: Vec, speed: Vec) {
    this.pos = pos;
    this.speed = speed;
    this.size = new Vec(0.8, 1.5);
  }

  /**
   * used by Level to create an actor from a character in the level plan
   * because a player is 1.5 tiles tall, it starts half a tile above where the character appears in the level plan
   * */
  static create(pos: Vec) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }

  /**
   * Motion handled separately for each axis because hitting the floor shouldn't prevent horizontal motion, hitting a wall shouldn't stop falling/jumping motion
   * @param time
   * @param state
   * @param keys
   */
  update(time: number, state: State, keys: Keys) {
    // playerXSpeed = 7
    // gravity = 30
    // jumpSpeed = 17
    let pos = this.pos;

    let xSpeed = 0;
    if (keys.ArrowLeft) xSpeed -= 7;
    if (keys.ArrowRight) xSpeed += 7;
    let movedX = pos.plus(new Vec(xSpeed * time, 0));
    if (!state.level.touches(movedX, this.size, "wall")) {
      pos = movedX;
    }

    let ySpeed = this.speed.y + time * 30;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, "wall")) {
      pos = movedY;
    } else if (keys.ArrowUp && ySpeed > 0) {
      ySpeed = -17;
    } else {
      ySpeed = 0;
    }

    return new Player(pos, new Vec(xSpeed, ySpeed));
  }

  get type() {
    return "player";
  }
}
