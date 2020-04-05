"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the minimum value of a and b
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
exports.minimum = (a, b) => (a < b ? a : b);
console.log(exports.minimum(22, -2));
