import isEven from "./isEven";

test("returns true for even input 50", () => {
  expect(isEven(50)).toBe(true);
});

test("returns false for odd input 75", () => {
  expect(isEven(75)).toBe(false);
});

test("returns false for odd input -1", () => {
  expect(isEven(-1)).toBe(false);
});
