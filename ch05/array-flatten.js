"use strict";
/**
 * 'Flattens' an array of arrays into a single array that has all elements of the original array
 * @param {Array[]} arrays
 * @returns {*[]}
 */
function flatten(arrays) {
    const reducer = (accumulator, innerArray) => accumulator.concat(innerArray);
    return arrays.reduce(reducer);
}
let arrays = [[1, 2, 3], [4, 5], [6]];
console.log(flatten(arrays));