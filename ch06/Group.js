/** Data structure which holds a collection of values. Values can only exist once in the structure */
class Group {
  constructor() {
    this.values = [];
  }

  /**
   * Returns a boolean that reflects whether the specified value already exists in the group
   * @param {*} value
   * @returns {boolean}
   */
  has(value) {
    if (this.values.indexOf(value) !== -1) {
      return true;
    }
    return false;
  }

  /**
   * Adds a new value to the group, if it isn't already present
   * @param {*} newValue - The new value to add
   */
  add(newValue) {
    if (!this.has(newValue)) {
      this.values.push(newValue);
    }
  }

  /**
   * Removes the specified value from the group, if it exists in it
   * @param {*} oldValue - The value to remove
   */
  delete(oldValue) {
    if (!this.has(oldValue)) {
      this.values = this.values.filter(value => value !== oldValue);
    }
  }

  static from(values) {
    const group = new Group();
    values.forEach(value => group.add(value));
    return group;
  }

  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
