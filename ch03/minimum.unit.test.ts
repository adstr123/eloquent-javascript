import { minimum } from "./minimum";

test("return -2 for inputs 22 & -2", () => {
  expect(minimum(22, -2)).toBe(-2);
});

test("return -2 for inputs -2 & 22", () => {
  expect(minimum(-2, 22)).toBe(-2);
});
