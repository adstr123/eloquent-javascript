/** Data structure which holds a collection of values. Values can only exist once in the structure */
export class Group {
  values: any[];
  constructor() {
    this.values = [];
  }

  /**
   * Returns a boolean that reflects whether the specified value already exists in the group
   */
  has(value: any): boolean {
    if (this.values.indexOf(value) !== -1) {
      return true;
    }
    return false;
  }

  /**
   * Adds a new value to the group, if it isn't already present
   */
  add(newValue: any): void {
    if (!this.has(newValue)) {
      this.values.push(newValue);
    }
  }

  /**
   * Removes the specified value from the group, if it exists in it
   */
  delete(oldValue: any): void {
    if (!this.has(oldValue)) {
      this.values = this.values.filter((value) => value !== oldValue);
    }
  }

  /**
   * Creates a group from an existing array
   */
  static from(values: any[]): Group {
    const group: Group = new Group();
    values.forEach((value) => group.add(value));
    return group;
  }

  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

/** Makes the Group class iterable */
export class GroupIterator {
  index: number;
  group: Group;
  constructor(group: Group) {
    this.index = 0;
    this.group = group;
  }

  next(): { value: any; done: boolean } {
    if (this.index >= this.group.values.length) {
      return { value: null, done: true };
    } else {
      let result = { value: this.group.values[this.index], done: false };
      this.index++;
      return result;
    }
  }
}

/*
let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));

// test GroupIterator
for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
*/
