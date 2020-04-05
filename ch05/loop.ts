/**
 * HOF implementation of for loop functionality
 * @param value - Current value
 * @param test - Tests if conditions are still being met to continue loop execution
 * @param body - Perform some operation on the current value
 * @param update - Update the value and restart the loop
 */
function loop(value: any, test: (value: any) => boolean, body: Function, update: (value: any) => any): void {
  while (test(value) !== false) {
    body(value);
    value = update(value);
  }
}

loop(
  3,
  n => n > 0,
  console.log,
  n => n - 1
);
// → 3
// → 2
// → 1
