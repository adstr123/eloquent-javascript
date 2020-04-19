import flatten from "./array-flatten";

test("flattening 3 arrays with numbers 1-6 should produce an array with 6 elements, the numbers 1 through 6", () => {
  expect(flatten([[1, 2, 3], [4, 5], [6]])).toStrictEqual([1, 2, 3, 4, 5, 6]);
});
