/**
 * A list data structure - nested set of objects, each referencing the following one in rest prop
 * @typedef {Object} List
 * @property {*} value the list element value to store
 * @property {Object} rest reference to the rest of the list (same format as this object)
 */
import { IList } from "../types";

/**
 * Builds a list data structure from an array
 * @param {*[]} array an array of any data type, to turn into a list
 * @returns {List}
 */
function arrayToList(array: any[]): IList | null {
  if (array.length > 0) {
    let list = null;
    // iterates from back to front
    // first list element added is { value: // last array element, rest: null }
    // second list element added is {value: // penultimate array element, rest: {value: // last array element, rest: null }}
    // etc.
    for (let i = array.length - 1; i >= 0; i--) {
      list = { value: array[i], rest: list };
    }
    return list;
  } else {
    throw new TypeError("Input must be an array containing at least one element");
  }
}

/**
 * Builds an Array from a list
 * @param {List} list a list of any data type, to turn into an array
 * @returns {*[]}
 */
function listToArray(list: IList): any[] {
  let array = [];
  array.push(list.value);

  let temp: IList | null = list.rest;
  while (temp) {
    array.push(temp.value);
    temp = temp.rest;
  }
  return array;
}

/**
 * Returns a new list that adds a specified element to the front of a specified list
 * If the specified list is null, it creates a new list whose only value is the new value added
 * @param {*} value list element to add
 * @param {List} list the list to add to
 * @returns {List}
 */
function prepend(value: any, list: IList | null): IList {
  return { value, rest: list };
}

/**
 * Returns the element at the nth position of a specified list
 * @param {number} index element position to retrieve
 * @param {List} list the list to add to
 */
function nth(list: IList | null, index: number): any {
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
