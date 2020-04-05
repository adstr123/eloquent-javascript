/**
 * Recursively tests whether a number is even
 * @param {number} number positive, whole
 * @returns {boolean|Function}
 */

function isEven(number: number): boolean | Function {
  if (number < 0) throw new RangeError("Input must be a positive integer");

  if (number === 0) {
    return true;
  } else if (number === 1) {
    return false;
  } else {
    return isEven(number - 2);
  }
}

console.log(isEven(50));
console.log(isEven(75));
console.log(isEven(-1));
