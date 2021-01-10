export default class Vec {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plus(other: Vec) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  // scales a vector by a given number
  // useful when multiplying speed by time to get distance travelled
  times(factor: number) {
    return new Vec(this.x * factor, this.y * factor);
  }
}
