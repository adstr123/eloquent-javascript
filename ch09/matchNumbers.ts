export default function matchNumbers(string: string) {
  // digits
  // numbers with optional minus or plus sign in front
  // numbers with the decimal dot in front or behind
  // no lone decimals not followed/preceded by digits
  // exponent notation e.g. 5e-3 or 1E10, with an optional sign in front
  return /^[+\-]?(\d+(\.\d*)?|\.\d+)([eE][+\-]?\d+)?$/.test(string);
}