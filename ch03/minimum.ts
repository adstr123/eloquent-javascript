/**
 * Returns the minimum value of a and b
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const minimum: Function = (a: number, b: number): number => (a < b ? a : b);

console.log(minimum(22, -2));
