import { range, sum } from "./sum-range";

test("requesting a range of numbers from 1-10 produces an array with those values", () => {
  expect(range(1, 10)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("requesting a range of numbers from a start value that is more than the end value throws an error", () => {
  expect(() => {
    range(10, 1);
  }).toThrowError(RangeError);
});

test("requesting the sum of numbers 1 through 10 should equal 55", () => {
  expect(sum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(55);
});
