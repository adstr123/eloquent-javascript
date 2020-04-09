/**
 * Builds a chessboard-style grid of spaces and hashes as a string, alternating columns row-by-row
 * @param gridSizeX - The width of the chessboard
 * @param gridSizeY - The height of the chessboard
 */
export default function buildChessboard(
  gridSizeX: number,
  gridSizeY: number = gridSizeX
): string {
  let chessboard: string = "";

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

//console.log(buildChessboard(8));
