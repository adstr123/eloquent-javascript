import loop from "./loop";

const logSpy = jest.spyOn(console, "log").mockImplementation();

test("for 3 through 0 (exclusive), print the current value repeatedly, decrementing it by 1 each iteration", () => {
  loop(
    3,
    (n) => n > 0,
    console.log,
    (n) => n - 1
  );
  expect(logSpy).toHaveBeenCalledTimes(3);
  expect(logSpy).toHaveBeenLastCalledWith(1);
});
