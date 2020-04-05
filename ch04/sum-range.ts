/**
 * Returns an array containing all numbers from start to end inclusive
 */
function range(start: number, end: number, step: number = 1): number[] {
  if (end < start) {
    throw new RangeError("Start value must be less than or equal to end value");
  }
  if (typeof start !== "number" || typeof end !== "number") {
    throw new TypeError("Arguments must be numbers");
  }

  const numbers = [];
  for (let i = start; i <= end; i += step) {
    numbers.push(i);
  }
  return numbers;
}

/**
 * Returns the sum of all values in a given array
 */
function sum(numbers: number[]): number {
  const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
  return numbers.reduce(reducer);
}

console.log(range(1, 10));
console.log(sum(range(1, 10)));
console.log(range(1, 10, 2));
console.log(sum(range(1, 10, 2)));
