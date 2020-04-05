"use strict";
/**
 * Checks whether a and b are equal in both value and type
 * For objects, it checks whether they are equal by comparing property values, NOT by comparing identity as with the === operator
 * @param {*} a
 * @param {*} b
 */
function deepEqual(a, b) {
    // if null, ignore
    if (a === null ||
        b === null ||
        typeof a !== "object" ||
        typeof b !== "object") {
        if (a === b)
            return true;
        else
            return false;
    }
    else if (typeof a === "object" && typeof b === "object") {
        if (Object.keys(a).length !== Object.keys(b).length) {
            console.log("key lengths don't match");
            return false;
        }
        for (let key in a) {
            if (!Object.keys(b).includes(key) || !deepEqual(a[key], b[key])) {
                console.log(`object b doesn't include key: ${key}`);
                return false;
            }
        }
        return true;
    }
    // we have covered all data types, but just in case (and to keep TS happy, which doesn't realise this), we throw an error if all the conditions return false
    throw new TypeError("Invalid input type (shouldn't be reachable)");
}
let obj = { here: { is: "an" }, object: 2 };
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, { here: 1, object: 2 }));
// → false
console.log(deepEqual(obj, { here: { is: "an" }, object: 2 }));
// → true
