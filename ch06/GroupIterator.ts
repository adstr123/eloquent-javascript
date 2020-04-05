/** Makes the Group class iterable */
class GroupIterator {
  index: number;
  group: Group;
  constructor(group: Group) {
    this.index = 0;
    this.group = group;
  }

  next(): {value: any, done: boolean} {
    if (this.index >= this.group.values.length) {
      return { value: null, done: true };
    } else {
      let result = { value: this.group.values[this.index], done: false };
      this.index++;
      return result;
    }
  }
}

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
