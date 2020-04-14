import countChar from "./countChar";

test("character h should appear 1 time in the word Hello", () => {
  expect(countChar("Hello", "h")).toBe(1);
});

test("character h should appear 0 times in the word Hello when case sensitivity is specified", () => {
  expect(countChar("Hello", "h", true)).toBe(0);
});

test("character H should appear 1 time in the word Hello when case sensitivity is specified", () => {
  expect(countChar("Hello", "H", true)).toBe(1);
});

test("inputting more than 1 character should throw an error", () => {
  expect(() => {
    countChar("Hello", "he");
  }).toThrow();
});
