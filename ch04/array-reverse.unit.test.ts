import { reverseArray, reverseArrayInPlace } from "./array-reverse";

it("returns 3, 2, 1 in an array for input array containing 1, 2, 3", () => {
  expect(reverseArray([1, 2, 3])).toStrictEqual([3, 2, 1]);
});

it("returns three two one in an array for input array containing strings one two three", () => {
  expect(reverseArrayInPlace(["one", "two", "three"])).toStrictEqual([
    "three",
    "two",
    "one",
  ]);
});
