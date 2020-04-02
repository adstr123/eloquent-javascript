/** Makes the Group class iterable */
class GroupIterator {
  constructor(group) {
    this.index = 0;
    this.group = group;
  }

  next() {
    if (this.index >= this.group.values.length) {
      return { done: true };
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