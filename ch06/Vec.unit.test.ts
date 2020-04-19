import Vec from "./Vec";

test("creating a Vec object from 1, 2 should result in an object with x, y properties equal to 1, 2", () => {
  expect(new Vec(1, 2)).toEqual({ x: 1, y: 2 });
});

describe("with a Vec object with x, y properties equal to 1, 2", () => {
  test("adding a vector with x, y = 2, 3 to test vector should result in a vector with x, y = 3, 5", () => {
    expect(new Vec(1, 2).plus(new Vec(2, 3))).toStrictEqual(new Vec(3, 5));
  });
  test("subtracting a vector with x, y = 2, 3 from test vector should result in a vector with x, y = -1, -1", () => {
    expect(new Vec(1, 2).minus(new Vec(2, 3))).toStrictEqual(new Vec(-1, -1));
  });
  test("the length of a 3, 4 vector should be 5", () => {
    expect(new Vec(3, 4)).toHaveLength(5);
  });
});
