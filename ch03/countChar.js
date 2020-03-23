/**
 * Counts occurrences of a specified character in an input string
 * @param {string} input
 * @param {string} searchCharacter
 * @param {boolean} caseSensitive indicates whether the search should ignore case when counting characters
 * @returns {number}
 */
function countChar(input, searchCharacter, caseSensitive = false) {
  let count = 0;
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
