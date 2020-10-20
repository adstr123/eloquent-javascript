import run, {
  parseExpression,
  skipSpace,
  parseApply,
  parse,
  evaluate,
  specialForms,
  topScope,
} from "./egg";

it("should print the expression object when asked to parse a simple operation", () => {
  expect(parse("+(a, 10)")).toMatchObject({
    type: "apply",
    operator: { type: "word", name: "+" },
    args: [
      { type: "word", name: "a" },
      { type: "value", value: 10 },
    ],
  });
});

test("This program should print variable total with value 55", () => {
  const log55Spy = jest.spyOn(console, "log").mockImplementation();

  run(`
    do(define(total, 0),
      define(count, 1),
      while(<(count, 11),
        do(define(total, +(total, count)),
          define(count, +(count, 1)))),
      print(total))
  `);

  expect(log55Spy).toHaveBeenLastCalledWith(55);
});

test("This program should print variable total with value 11", () => {
  const log11Spy = jest.spyOn(console, "log").mockImplementation();

  run(`
    do(define(pow, fun(base, exp,
      if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))))),
      print(pow(2, 10)))
  `);

  expect(log11Spy).toHaveBeenLastCalledWith(1024);
});

test("This program should print variable total with value 1024", () => {
  const log1024Spy = jest.spyOn(console, "log").mockImplementation();

  run(`
    do(define(plusOne, fun(a, +(a, 1))),
      print(plusOne(10)))
  `);

  expect(log1024Spy).toHaveBeenLastCalledWith(11);
});

test("This program should print variable total with value 6", () => {
  const log6Spy = jest.spyOn(console, "log").mockImplementation();

  run(`
    do(define(sum, fun(array,
        do(define(i, 0),
            define(sum, 0),
            while(<(i, length(array)),
              do(define(sum, +(sum, element(array, i))),
                define(i, +(i, 1)))), 
            sum))),
      print(sum(array(1, 2, 3))))
  `);

  expect(log6Spy).toHaveBeenLastCalledWith(6);
});

it("should print the expression object without comments when including # characters at the start of a line", () => {
  expect(parse("# hello\nx")).toMatchObject({
    type: "word",
    name: "x",
  });

  expect(parse("a # one\n   # two\n()")).toMatchObject({
    type: "apply",
    operator: { type: "word", name: "a" },
    args: [],
  });
});

test("This program should print variable total with value 50", () => {
  const log50Spy = jest.spyOn(console, "log").mockImplementation();

  run(`
  do(define(x, 4),
    define(setx, fun(val, set(x, val))),
    setx(50),
    print(x))
  `);

  expect(log50Spy).toHaveBeenLastCalledWith(50);
});

it("should throw a ReferenceError when a variable is not defined in any scope", () => {
  expect(() => run(`set(quux, true)`)).toThrowError(ReferenceError);
});
