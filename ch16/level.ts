import levelChars from "./levelChars.js";
import Vec from "./vec.js";
import Player from "./player";
import Coin from "./coin";
import Lava from "./lava";

interface Size {
  x: number;
  y: number;
}

export default class Level {
  height: number;
  width: number;
  startActors: (Player | Coin | Lava)[];
  rows: string[][];
  constructor(plan: string) {
    // argument is the string that defines the level
    // use trim so we can nicely format our level files with whitespace at the start
    // split each row of the level grid on subsequent newlines
    // spread each row into an array of characters representing elements
    let rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    // separate moving elements from the static grid
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        // levelchars maps bg elements to strings, actor characters to classes
        let type = levelChars[ch];
        if (typeof type == "string") return type;
        // when character is an actor, return empty for this grid field's bg
        this.startActors.push(type.create(new Vec(x, y), ch));
        return "empty";
      });
    });
  }

  /**
   * tells us whether a rectangle touches a grid element of the given type
   * computes the set of grid squares that the body overlaps with using floor & ceil
   * by rounding up/down, we get the range of background squares that the box touches
   */
  touches = (pos: Vec, size: Size, type: string): boolean => {
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);

    // loop over the grid tiles & return true when a matching square is found
    // squares outside the level are always treated as "wall" to ensure the player can't leave the world
    for (var y = yStart; y < yEnd; y++) {
      for (var x = xStart; x < xEnd; x++) {
        let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
        let here = isOutside ? "wall" : this.rows[y][x];
        if (here == type) return true;
      }
    }
    return false;
  };
}
