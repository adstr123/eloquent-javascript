"use strict";
/**
 * Recursively tests whether a positive integer is even
 */
function isEven(number) {
    if (number < 0)
        throw new RangeError("Input must be a positive integer");
    if (number === 0) {
        return true;
    }
    else if (number === 1) {
        return false;
    }
    else {
        return isEven(number - 2);
    }
}
console.log(isEven(50));
console.log(isEven(75));
console.log(isEven(-1));
