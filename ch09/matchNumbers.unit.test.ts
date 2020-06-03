import matchNumbers from './matchNumbers'

describe("when provided with JavaScript-style numbers in a string as input", () => {
  it("should match positive numbers", () => {
    expect(matchNumbers("1")).toBeTruthy();
  })
  it("should match negative numbers", () => {
    expect(matchNumbers("-1")).toBeTruthy();
  })
  it("should match prefix positive numbers", () => {
    expect(matchNumbers("+15")).toBeTruthy();
  })
  it("should match decimal numbers", () => {
    expect(matchNumbers("1.55")).toBeTruthy();
  })
  it("should match decimal numbers with no preceding digit", () => {
    expect(matchNumbers(".5")).toBeTruthy();
  })
  it("should match decimal numbers with no following digit", () => {
    expect(matchNumbers("5.")).toBeTruthy();
  })
  it("should match valid exponent notation", () => {
    expect(matchNumbers("1.3e2")).toBeTruthy();
  })
  it("should match explicitly negative exponent notation", () => {
    expect(matchNumbers("1E-4")).toBeTruthy();
  })
  it("should match explicitly positive exponent notation", () => {
    expect(matchNumbers("1e+12")).toBeTruthy();
  })
})

describe("when provided with non-JavaScript-style numbers in a string as input", () => {
  it("shouldn't match a number followed by a letter", () => {
    expect(matchNumbers("1a")).toBeFalsy();
  })
  it("shouldn't match numbers with two signs", () => {
    expect(matchNumbers("+-1")).toBeFalsy();
  })
  it("shouldn't match numbers with multiple decimals", () => {
    expect(matchNumbers("1.2.3")).toBeFalsy();
  })
  it("shouldn't match expressions", () => {
    expect(matchNumbers("1+1")).toBeFalsy();
  })
  it("shouldn't match invalid exponent notation", () => {
    expect(matchNumbers("1e4.5")).toBeFalsy();
  })
  it("shouldn't match numbers with both a preceding and following decimal", () => {
    expect(matchNumbers(".5.")).toBeFalsy();
  })
  it("shouldn't match hexadecimal numbers", () => {
    expect(matchNumbers("1f5")).toBeFalsy();
  })
  it("shouldn't match lone decimals", () => {
    expect(matchNumbers(".")).toBeFalsy();
  })
})