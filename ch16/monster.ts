import State from "./state.js";
import Vec from "./vec.js";

export default class Monster {
  pos: Vec;
  size: Vec;
  constructor(pos: Vec) {
    this.pos = pos;
    this.size = new Vec(1.2, 2);
  }

  static create(pos: Vec) {
    return new Monster(pos.plus(new Vec(0, -1)));
  }

  collide(state: State) {
    let player = state.player;
    // if player jumps on top of monster
    if (player && player.pos.y + player.size.y < this.pos.y + 0.5) {
      // destroy it
      let filtered = state.actors.filter((a) => a != this);
      return new State(state.level, filtered, state.status);
    } else {
      // else the player loses a life
      return new State(state.level, state.actors, "lost");
    }
  }

  update(time: number, state: State) {
    let player = state.player;
    // chase the player
    let speed = (player && player.pos.x < this.pos.x ? -1 : 1) * time * 4;
    let newPos = new Vec(this.pos.x + speed, this.pos.y);
    if (state.level.touches(newPos, this.size, "wall")) return this;
    else return new Monster(newPos);
  }

  get type() {
    return "monster";
  }
}
