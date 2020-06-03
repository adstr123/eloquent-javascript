export default function singleToDoubleQuotes(string: string) {
  return string.replace(/(^|\W)'|'(\W|$)/g, '$1"$2');
}