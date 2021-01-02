function byTagName(node: HTMLElement, tagName: string) {
  // returns an array containing all descendant element nodes with the given tag name
  const descendants: HTMLElement[] = [];

  function traverse(node: HTMLElement) {
    for (const child of node.childNodes) {
      if (child.nodeName.toLowerCase() === tagName)
        descendants.push(child as HTMLElement);

      traverse(child as HTMLElement);
    }
  }

  traverse(node);
  return descendants;
}

console.log(byTagName(document.body, "h1").length);
// → 1
console.log(byTagName(document.body, "span").length);
// → 3
let para = document.querySelector("p");
if (para) console.log(byTagName(para, "span").length);
// → 2
