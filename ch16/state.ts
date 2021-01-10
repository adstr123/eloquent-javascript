import Coin from "./coin";
import Lava from "./lava";
import Monster from "./monster";
import Level from "./level";
import Player, { Keys } from "./player";

export default class State {
  level: Level;
  status: "playing" | "won" | "lost";
  actors: (Coin | Lava | Player | Monster)[];

  constructor(
    level: Level,
    actors: (Coin | Lava | Player | Monster)[],
    status: "playing" | "won" | "lost"
  ) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  /**
   * @param time - a time step
   * @param keys - tells us which keys are being held down
   */
  update(time: number, keys: Keys): State {
    // firstly, update all actors & produce an array of updated actors
    // they also get the time step, keys, and state (although only player actually uses keys)
    let actors = this.actors.map((actor) => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);

    // if the game is over, no further processing required
    if (newState.status != "playing") return newState;

    // if the player is touching background lava, the game is lost
    let player = newState.player;
    if (player && this.level.touches(player.pos, player.size, "lava")) {
      return new State(this.level, actors, "lost");
    }

    // if the game is still playing, check whether any other actors overlap the player
    for (let actor of actors) {
      if (player && actor != player && overlap(actor, player)) {
        // @ts-ignore
        newState = actor.collide(newState);
      }
    }
    return newState;
  }

  static start(level: Level) {
    // state is a persistent data structure
    // updating game state creates a new one, leaving the old one intact
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find((a) => a.type == "player");
  }
}

/**
 * actors are "touching" when they overlap along both x & y axes
 * @param actor1
 * @param actor2
 */
function overlap(
  actor1: Coin | Lava | Player | Monster,
  actor2: Coin | Lava | Player | Monster
): boolean {
  return (
    actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y
  );
}
