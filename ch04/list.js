/**
 * Builds a list data structure from an array
 * @param {Array} array an array of any data type, to turn into a list
 * @returns {Object} a nested set of objects, each referencing the following one
 */
function arrayToList(array) {
  let list = null;
  // iterates from back to front
  // first list element added is { value: // last array element, rest: null }
  // second list element added is {value: // penultimate array element, rest: {value: // last array element, rest: null }}
  // etc.
  for (let i = array.length - 1; i >= 0; i--) {
    list = { value: array[i], rest: list };
  }
  return list;
}

/**
 * Builds an Array from a list
 * @param {Object} list a list of any data type, to turn into an array
 * @returns {Array}
 */
function listToArray(list) {
  let array = [];
  array.push(list.value);

  let temp = list.rest;
  while (temp) {
    array.push(temp.value);
    temp = temp.rest;
  }
  return array;
}

/**
 * Returns a new list that adds a specified element to the front of that list
 * @param {Object} listElement list element to add
 * @param {Object} list the list to add to
 * @returns {Object}
 */
function prepend(listElement, list) {
  return { value: listElement, rest: list };
}

/**
 * Returns the element at the nth position of a specified list
 * @param {number} index element position to retrieve
 * @param {Object} list the list to add to
 */
function nth(list, index) {
  if (!list) {
    return undefined;
  } else if (index === 0) {
    return list.value;
  } else {
    return nth(list.rest, index - 1);
  }
}

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
