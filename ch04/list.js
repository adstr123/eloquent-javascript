"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Builds a list data structure from an array
 * @param array - An array of any data type, to turn into a list
 */
function arrayToList(array) {
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
    }
    else {
        throw new TypeError("Input must be an array containing at least one element");
    }
}
/**
 * Builds an Array from a list
 * @param list - A list of any data type, to turn into an array
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
 * Returns a new list that adds a specified element to the front of a specified list
 * If the specified list is null, it creates a new list whose only value is the new value added
 */
function prepend(value, list) {
    return { value, rest: list };
}
/**
 * Returns the element at the nth position of a specified list
 * @param {number} index element position to retrieve
 * @param {List} list the list to add to
 */
function nth(list, index) {
    if (!list) {
        return undefined;
    }
    else if (index === 0) {
        return list.value;
    }
    else {
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
