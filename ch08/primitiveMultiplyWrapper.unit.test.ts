import primitiveMultipleWrapper from './primitiveMultiplyWrapper';

it("should handle all errors and eventually return a calculation result", () => {
  expect(primitiveMultipleWrapper(8, 8)).toBe(64);
})