import { Group } from "./Group";

test("creating a Group object from an array with values 10, 20 should result in an object with value property equal to an array with elements 10, 20", () => {
  expect(Group.from([10, 20])).toEqual({ values: [10, 20] });
});

describe("with a Group containing elements 10, 20", () => {
  let group = Group.from([10, 20]);

  it("contains element with value 10", () => {
    expect(group.has(10)).toBeTruthy();
  });
  it("doesn't contain element with value 30", () => {
    expect(group.has(30)).toBeFalsy();
  });

  it("shouldn't change when adding duplicate value 10", () => {
    let group2 = Group.from([10, 20]);
    group2.add(10);

    expect(group).toStrictEqual(group2);
  });

  it("should have one less value when deleting element with value 10", () => {
    group.delete(10);
    expect(group.delete(10)).toBeFalsy();
  });
});

test("Group object should be iterable", () => {
  let group = Group.from(["a", "b", "c"]);
  expect(typeof group[Symbol.iterator]).toBe("function");

  const logSpy = jest.spyOn(console, "log").mockImplementation();
  for (let value of group) {
    console.log(value);
  }
  expect(logSpy).toHaveBeenCalledTimes(3);
  expect(logSpy).toHaveBeenLastCalledWith("c");
});
