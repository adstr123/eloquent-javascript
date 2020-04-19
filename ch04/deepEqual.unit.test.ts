import deepEqual from "./deepEqual";

describe("given a primitive", () => {
  test("two numbers of equal value are equal", () => {
    expect(deepEqual(1, 1)).toBe(true);
  });

  test("two strings with the same characters in the same locations are equal", () => {
    expect(deepEqual("hello", "hello")).toBe(true);
  });

  test("a string containing a number character is not equal to that number", () => {
    expect(deepEqual("1", 1)).toBe(false);
  });

  test("NaN is not equal to NaN, undefined is equal to undefined", () => {
    expect(deepEqual(NaN, NaN)).toBe(false);
    expect(deepEqual(undefined, undefined)).toBe(true);
  });
});

let obj = { here: { is: "an" }, object: 2 };
describe("given an object", () => {
  test("a variable referring to an object is equal to itself", () => {
    expect(deepEqual(obj, obj)).toBe(true);
  });

  test("objects with different properties are not equal", () => {
    expect(deepEqual(obj, { here: 1, object: 2 })).toBe(false);
  });

  test("a variable referring to an object is equal to a new object with the same properties in the same order", () => {
    expect(deepEqual(obj, { here: { is: "an" }, object: 2 })).toBe(true);
  });
});
