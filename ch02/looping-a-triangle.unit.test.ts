import loopingATriangle from "./looping-a-triangle";

const logSpy = jest.spyOn(console, "log").mockImplementation();

test("input 5 prints 5 lines", () => {
  loopingATriangle(5);
  expect(logSpy).toHaveBeenCalledTimes(6);
});

test("input 3 to to print ### on the final line", () => {
  loopingATriangle(3);
  expect(logSpy).toHaveBeenLastCalledWith("###");
});
