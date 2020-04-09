/**
 * Prints the numbers in range of limit param
 * Numbers divisible by 3 are replaced by "Fizz"
 * Numbers divisible by 5 are replaced by "Buzz"
 * Numbers divisible by both are replaced by "FizzBuzz"
 * @param limit the number of iterations
 */
function fizzBuzz(limit: number): void {
  for (let i = 0; i <= limit; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}

fizzBuzz(100);
