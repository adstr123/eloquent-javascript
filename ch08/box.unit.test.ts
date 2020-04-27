import { IBox } from "./box";
import withBoxUnlocked from "./box";

const box: IBox = {
  locked: true,
  unlock() {
    this.locked = false;
  },
  lock() {
    this.locked = true;
  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  },
};

test("adding content should update the contents property appropriately", () => {
  withBoxUnlocked(box, function () {
    box.content.push("gold piece");
  });
  expect(withBoxUnlocked(box, function () {
    return box.content;
  })).toHaveLength(1);
});

test("triggering an error when executing an unlockFunction should always leave the box locked regardless", () => {
  try {
    withBoxUnlocked(box, function () {
      throw new Error("Pirates on the horizon! Abort!");
    });
  } catch (e) {
    console.log("Error raised:", e);
  }
  expect(box.locked).toBeTruthy();
});
