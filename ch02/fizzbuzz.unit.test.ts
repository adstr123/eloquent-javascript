import fizzBuzz from "./fizzbuzz";

const logSpy = jest.spyOn(console, "log").mockImplementation();

test("input 3 calls console.log 2 times", () => {
  fizzBuzz(3);
  expect(logSpy).toHaveBeenCalledTimes(2);
});

test("input 0 prints FizzBuzz", () => {
  fizzBuzz(0);
  expect(logSpy).toHaveBeenCalledWith("FizzBuzz");
});

test("input 3 prints Fizz", () => {
  fizzBuzz(3);
  expect(logSpy).toHaveBeenCalledWith("Fizz");
});

test("input 5 prints all 3 strings", () => {
  fizzBuzz(5);
  expect(logSpy).toHaveBeenCalledWith("FizzBuzz");
  expect(logSpy).toHaveBeenCalledWith("Fizz");
  expect(logSpy).toHaveBeenCalledWith("Buzz");
});
