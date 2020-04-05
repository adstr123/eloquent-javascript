/**
 * Returns a new array that has the elements of the input array but in reverse order
 * @param {*[]} numbers
 * @returns {*[]}
 */
function reverseArray(numbers: any[]): any[] {
  const numbersReversed = [];
  for (let i = 0; i < numbers.length; i++) {
    numbersReversed.push(numbers[numbers.length - 1 - i]);
  }
  return numbersReversed;
}

/**
 * Modified the input array to reverse the order of its elements
 * @param {number[]} numbers
 * @returns {number[]}
 */
function reverseArrayInPlace(numbers: any[]): any[] {
  // use Math.floor() in case length is odd
  for (var i = 0; i <= Math.floor((numbers.length - 1) / 2); i++) {
    // remember temp el
    let el = numbers[i];
    // reverse elements using indexing & reverse indexing
    numbers[i] = numbers[numbers.length - 1 - i];
    numbers[numbers.length - 1 - i] = el;
  }
  return numbers;
}

console.log(reverseArray([1, 2, 3]));
console.log(reverseArrayInPlace(["one", "two", "three"]));
