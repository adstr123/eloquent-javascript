/**
 * Builds a chessboard-style grid of spaces and hashes, alternating columns row-by-row
 * @param {number} gridSizeX
 * @param {number} [gridSizeY=gridSizeX]
 * @returns {string}
 */
function buildChessboard(gridSizeX, gridSizeY = gridSizeX) {
  let chessboard = "";

  for (let y = 0; y < gridSizeY; y++) {
    for (let x = 0; x < gridSizeX; x++) {
      if ((x + y) % 2 == 0) {
        chessboard += " ";
      } else {
        chessboard += "#";
      }
    }
    chessboard += "\n";
  }

  return chessboard;
}

console.log(buildChessboard(8));
