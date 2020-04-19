import { everyLoop, everySome } from "./array-every";

describe("when testing a condition for every item in a collection, in a for loop", () => {
  test("for input array containing 1, 3, 5, the test item < 10 should return true", () => {
    expect(everyLoop([1, 3, 5], (n) => n < 10)).toBeTruthy();
  });
  test("for input array containing 2, 4, 16, the test item < 10 should return false", () => {
    expect(everyLoop([2, 4, 16], (n) => n < 10)).toBeFalsy();
  });
  test("for an empty array, the test item < 10 should return true", () => {
    expect(everyLoop([], (n) => n < 10)).toBeTruthy();
  });
});

describe("when testing a condition for every item in a collection, using .some()", () => {
  test("for input array containing 1, 3, 5, the test item < 10 should return true", () => {
    expect(everySome([1, 3, 5], (n) => n < 10)).toBeTruthy();
  });
  test("for input array containing 2, 4, 16, the test item < 10 should return false", () => {
    expect(everySome([2, 4, 16], (n) => n < 10)).toBeFalsy();
  });
  test("for an empty array, the test item < 10 should return true", () => {
    expect(everySome([], (n) => n < 10)).toBeTruthy();
  });
});
