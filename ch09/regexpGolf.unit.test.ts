import { one, two, three, four, five, six, seven } from './regexpGolf'

it("should only match a string containing substrings 'cat' or 'car'", () => {
  expect(one.test("my car")).toBeTruthy();
  expect(one.test("bad cats")).toBeTruthy();
  expect(one.test("camper")).toBeFalsy();
  expect(one.test("high art")).toBeFalsy();
})

it("should only match a string containing substrings 'pop' or 'prop'", () => {
  expect(two.test("pop culture")).toBeTruthy();
  expect(two.test("mad props")).toBeTruthy();
  expect(two.test("plop")).toBeFalsy();
  expect(two.test("prrrop")).toBeFalsy();
})

it("should only match a string containing substrings 'ferret' or 'ferry', 'ferrari'", () => {
  expect(three.test("ferret")).toBeTruthy();
  expect(three.test("ferry")).toBeTruthy();
  expect(three.test("ferrari")).toBeTruthy();
  expect(three.test("ferrum")).toBeFalsy();
  expect(three.test("transfer A")).toBeFalsy();
})

it("should only match a word ending in 'ious'", () => {
  expect(four.test("how delicious")).toBeTruthy();
  expect(four.test("spacious room")).toBeTruthy();
  expect(four.test("ruinous")).toBeFalsy();
  expect(four.test("consciousness")).toBeFalsy();
})

it("it should only match a whitespace character followed by a period, comma, colon, or semicolon", () => {
  expect(five.test("bad punctuation .")).toBeTruthy();
  expect(five.test("escape the dot")).toBeFalsy();
})

it("should only match a word longer than six letters", () => {
  expect(six.test("hottentottententen")).toBeTruthy();
  expect(six.test("no")).toBeFalsy();
  expect(six.test("hotten totten tenten")).toBeFalsy();
})

it("should only match a word without the characters 'e' or 'E'", () => {
  expect(seven.test("red platypus")).toBeTruthy();
  expect(seven.test("wobbling nest")).toBeTruthy();
  expect(seven.test("earth bed")).toBeFalsy();
  expect(seven.test("learning ape")).toBeFalsy();
  expect(seven.test("BEET")).toBeFalsy();
})