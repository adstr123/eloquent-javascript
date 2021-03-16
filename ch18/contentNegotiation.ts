fetch("https://eloquentjavascript.net/author", {
  headers: { Accept: "text/plain" },
})
  .then((resp) => resp.text())
  .then((text) => console.log(text));

fetch("https://eloquentjavascript.net/author", {
  headers: { Accept: "text/html" },
})
  .then((resp) => resp.text())
  .then((text) => console.log(text));

fetch("https://eloquentjavascript.net/author", {
  headers: { Accept: "application/json" },
})
  .then((resp) => resp.text())
  .then((text) => console.log(text));

fetch("https://eloquentjavascript.net/author", {
  headers: { Accept: "application/rainbows+unicorns" },
})
  .then((resp) => resp.text())
  .then((text) => console.log(text));
