import buildChessboard from "./chessboard";

test("6x6 chessboard to be 42 chars in length", () => {
  expect(buildChessboard(7, 7)).toHaveLength(56);
});
