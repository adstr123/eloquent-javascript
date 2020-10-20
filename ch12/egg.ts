declare interface IExpression {
  type: "value" | "word" | "apply";
  value?: string | number;
  name?: string;
  operator?: IExpression;
  args?: IExpression[];
}

export function parseExpression(program: string) {
  program = skipSpace(program);
  let match: null | RegExpExecArray, expr: IExpression;
  if ((match = /^"([^"]*)"/.exec(program))) {
    expr = { type: "value", value: match[1] };
  } else if ((match = /^\d+\b/.exec(program))) {
    expr = { type: "value", value: Number(match[0]) };
  } else if ((match = /^[^\s(),#"]+/.exec(program))) {
    expr = { type: "word", name: match[0] };
  } else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }

  return parseApply(expr, program.slice(match[0].length));
}

// Exercise 3: Comments
export function skipSpace(string: string): string {
  let skippable = string.match(/^(\s|#.*)*/);
  if (!skippable) return "";
  return string.slice(skippable[0].length);
}

export function parseApply(
  expr: IExpression,
  program: string
): { expr: IExpression; rest: string } {
  program = skipSpace(program);
  if (program[0] != "(") {
    return { expr: expr, rest: program };
  }

  program = skipSpace(program.slice(1));
  expr = { type: "apply", operator: expr, args: [] };
  while (expr.args && program[0] != ")") {
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  return parseApply(expr, program.slice(1));
}

export function parse(program: string) {
  let { expr, rest } = parseExpression(program);
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return expr;
}

export function evaluate(
  expr: IExpression,
  scope: { [name: string]: string | number | Function }
): any {
  if (expr.type == "value") {
    return expr.value;
  } else if (expr.type == "word") {
    if (expr.name && expr.name in scope) {
      return scope[expr.name];
    } else {
      throw new ReferenceError(`Undefined binding: ${expr.name}`);
    }
  } else if (expr.type == "apply") {
    let { operator, args } = expr;
    if (
      operator &&
      operator.name &&
      operator.type == "word" &&
      operator.name in specialForms
    ) {
      return specialForms[operator.name](expr.args, scope);
    } else if (operator) {
      let op = evaluate(operator, scope);
      if (typeof op == "function" && args) {
        return op(...args.map((arg) => evaluate(arg, scope)));
      } else {
        throw new TypeError("Applying a non-function.");
      }
    }
  } else {
    throw new Error("Undefined binding or applying a non-function");
  }
}

export const specialForms = Object.create(null);

specialForms.if = (args: IExpression["args"], scope: {}) => {
  if (args && args.length != 3) {
    throw new SyntaxError("Wrong number of args to if");
  } else if (args && evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else if (args) {
    return evaluate(args[2], scope);
  }
};

specialForms.while = (args: IExpression["args"], scope: {}) => {
  if (args && args.length != 2) {
    throw new SyntaxError("Wrong number of args to while");
  }
  while (args && evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }
  return false;
};

specialForms.do = (args: IExpression["args"], scope: {}) => {
  let value = false;
  if (args) {
    for (let arg of args) {
      value = evaluate(arg, scope);
    }
  }
  return value;
};

specialForms.define = (
  args: IExpression["args"],
  scope: { [name: string]: string | number | Function }
) => {
  if (args) {
    if (args.length != 2 || args[0].type != "word") {
      throw new SyntaxError("Incorrect use of define");
    }
    let value = evaluate(args[1], scope);
    if (args[0].name) scope[args[0].name] = value;
    return value;
  }
};

specialForms.fun = (
  args: IExpression["args"],
  scope: { [name: string]: string | number | Function }
) => {
  if (!args || (args && !args.length)) {
    throw new SyntaxError("Functions need a body");
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map((expr) => {
    if (expr.type != "word") {
      throw new SyntaxError("Parameter names must be words");
    }
    return expr.name;
  });

  return function () {
    if (arguments.length != params.length) {
      throw new TypeError("Wrong number of arguments");
    }
    let localScope = Object.create(scope);
    for (let i = 0; i < arguments.length; i++) {
      if (params[i]) localScope[params[i]!] = arguments[i];
    }

    return evaluate(body, localScope);
  };
};

export const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}

topScope.print = (value: any) => {
  console.log(value);
  return value;
};

// Exercise 1 - Arrays
topScope.array = (...values: any[]) => values;

topScope.length = (array: any[]) => array.length;

topScope.element = (array: any[], n: number) => array[n];

export default function run(program: string) {
  return evaluate(parse(program), Object.create(topScope));
}

// Exercise 4 - Fixing Scope
specialForms.set = (
  args: IExpression["args"],
  env: { [name: string]: string | number | Function }
) => {
  if (args) {
    if (args.length != 2 || args[0].type != "word") {
      throw new SyntaxError("Bad use of set");
    }
    let varName = args[0].name;
    let value = evaluate(args[1], env);

    for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
      if (varName && Object.prototype.hasOwnProperty.call(scope, varName)) {
        scope[varName] = value;
        return value;
      }
    }
  }
  throw new ReferenceError(`Setting undefined variable`);
};
