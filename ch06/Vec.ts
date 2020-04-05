/** Represents a vector in 2-dimensional space */
class Vec {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    /**
     * Create a vector
     * @param {number} x - The x value
     * @param {number} y - The y value
     */
    this.x = x;
    this.y = y;
  }

  /**
   * Finds the sum of this & an input vectors' x & y values
   * @param {Vec} vector
   * @returns {Vec} a new vector with summed x & y values
   */
  plus(vector: Vec): Vec {
    let summedVector = new Vec(0, 0);
    summedVector.x = this.x + vector.x;
    summedVector.y = this.y + vector.y;

    return summedVector;
  }

  /**
   * Finds the difference between this & an input vectors' x & y values
   * @param {Vec} vector
   * @returns {Vec} a new vector with subtracted x & y values
   */
  minus(vector: Vec): Vec {
    let subbedVector = new Vec(0, 0);
    subbedVector.x = this.x - vector.x;
    subbedVector.y = this.y - vector.y;

    return subbedVector;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5
