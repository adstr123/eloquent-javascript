import singleToDoubleQuotes from './quoteStyle'

const test = "'I'm the cook,' he said, 'it's my job.'";
it("should replace single quotes only at the start/end of quotes with double quotes", () => {
  expect(singleToDoubleQuotes(test)).toBe("\"I'm the cook,\" he said, \"it's my job.\"");
})