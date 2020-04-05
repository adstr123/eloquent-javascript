/**
 * Counts occurrences of a specified character in an input string
 * @param caseSensitive indicates whether the search should ignore case when counting characters
 */
function countChar(input: string, searchCharacter: string, caseSensitive: boolean = false): number {
  let count: number = 0;
  for (let i = 0; i < input.length; i++) {
    if (caseSensitive) {
      if (input[i] === searchCharacter) {
        count++;
      }
    } else {
      if (input[i].toLowerCase() === searchCharacter) {
        count++;
      }
    }
  }
  return count;
}

console.log(countChar("Hello!", "h"));
