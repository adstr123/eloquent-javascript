/**
 * Returns an array containing all numbers from start to end inclusive
 * @param {number} start
 * @param {number} end
 * @param {number} [step=1]
 * @returns {number[]}
 */
function range(start, end, step = 1) {
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
 * @param {number[]} numbers
 * @returns {number}
 */
function sum(numbers) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return numbers.reduce(reducer);
}

console.log(range(1, 10));
console.log(sum(range(1, 10)));
console.log(range(1, 10, 2));
console.log(sum(range(1, 10, 2)));
