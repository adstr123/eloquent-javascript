/**
 * Returns true when test returns true for every element in array
 * @param {*[]} array
 * @param {Function} test
 * @returns {boolean}
 */
function everyLoop(array, test) {
  for (let el of array) {
    if (test(el) === false) {
      return false;
    }
  }
  return true;
}

/**
 * Returns true when test returns true for every element in array
 * @param {*[]} array
 * @param {Function} test
 * @returns {boolean}
 */
function everySome(array, test) {
  return !array.some(element => !test(element));
}

console.log(everyLoop([1, 3, 5], n => n < 10));
// → true
console.log(everyLoop([2, 4, 16], n => n < 10));
// → false
console.log(everyLoop([], n => n < 10));
// → true

console.log(everySome([1, 3, 5], n => n < 10));
// → true
console.log(everySome([2, 4, 16], n => n < 10));
// → false
console.log(everySome([], n => n < 10));
// → true
