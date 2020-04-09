import buildChessboard from "./chessboard";

test("7x7 chessboard to be 56 chars in length", () => {
  expect(buildChessboard(7, 7)).toHaveLength(56);
});

test("6x6 chessboard to be 42 chars in length", () => {
  expect(buildChessboard(6)).toHaveLength(42);
});
