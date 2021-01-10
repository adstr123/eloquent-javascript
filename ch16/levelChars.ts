import Coin from "./coin.js";
import Lava from "./lava.js";
import Player from "./player.js";
import Monster from "./monster.js";

const levelChars: {
  [index: string]: string | Player | Coin | Lava | Monster;
} = {
  ".": "empty",
  "#": "wall",
  "+": "lava",
  "@": Player,
  o: Coin,
  "=": Lava,
  "|": Lava,
  v: Lava,
  M: Monster,
};

export default levelChars;
