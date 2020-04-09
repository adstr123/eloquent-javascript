/**
 * Prints the '#' character followed by a newline, increasing by 1 with each iteration
 * @param count - The number of iterations
 */
export default function loopingATriangle(count: number): void {
  for (let i = 0; i <= count; i++) {
    console.log("#".repeat(i));
  }
}

//loopingATriangle(7);
