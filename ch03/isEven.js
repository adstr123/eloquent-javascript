"use strict";
/**
 * Recursively tests whether an integer is even
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isEven(number) {
    if (number === 0) {
        return true;
    }
    else if (number === 1) {
        return false;
    }
    else if (number < 0) {
        return isEven(-number);
    }
    else {
        return isEven(number - 2);
    }
}
exports.default = isEven;
//console.log(isEven(50));
//console.log(isEven(75));
//console.log(isEven(-1));
