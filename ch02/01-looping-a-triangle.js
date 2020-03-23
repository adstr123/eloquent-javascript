/**
 * Prints the '#' character followed by a newline, increasing by 1 with each iteration
 * @param {number} count the number of iterations
 */
function loopingATriangle(count) {
  for (let i = 0; i <= count; i++) {
    console.log("#".repeat(i));
  }
}

loopingATriangle(7);
