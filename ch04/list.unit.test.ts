import { arrayToList, listToArray, prepend, nth } from "./list";

test("input array converts to object with corresponding property values", () => {
  expect(arrayToList([10, 20])).toStrictEqual({
    value: 10,
    rest: { value: 20, rest: null },
  });
});

test("input array with length 0 throws an error", () => {
  expect(() => {
    arrayToList([]);
  }).toThrowError(TypeError);
});

test("input list object converts to array with corresponding values", () => {
  expect(
    listToArray({
      value: 10,
      rest: {
        value: 20,
        rest: {
          value: 30,
          rest: null,
        },
      },
    })
  ).toStrictEqual([10, 20, 30]);
});

test("when prepending 2 values to an empty list, a corresponding list object is created with correct property values", () => {
  expect(prepend(10, prepend(20, null))).toStrictEqual({
    value: 10,
    rest: { value: 20, rest: null },
  });
});

test("requesting the element with index 1 of list with values 10, 20, 30 returns 20", () => {
  expect(
    nth(
      {
        value: 10,
        rest: {
          value: 20,
          rest: {
            value: 30,
            rest: null,
          },
        },
      },
      1
    )
  ).toBe(20);
});
