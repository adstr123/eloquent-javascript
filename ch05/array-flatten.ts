/**
 * 'Flattens' an array of arrays into a single array that has all elements of the original array
 */
export default function flatten(arrays: any[]): any[] {
  const reducer = (accumulator: any, innerArray: any[]) =>
    accumulator.concat(innerArray);
  return arrays.reduce(reducer);
}

/*
let arrays = [[1, 2, 3], [4, 5], [6]];
console.log(flatten(arrays));
*/
