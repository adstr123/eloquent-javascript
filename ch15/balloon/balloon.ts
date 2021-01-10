function inflate(e: KeyboardEvent, char: HTMLElement) {
  if (e.code === "ArrowUp") {
    e.preventDefault();

    const fontStyle =
      window &&
      window.getComputedStyle(char).getPropertyValue("font-size").match(/\d+/);
    const fontSize = fontStyle ? parseInt(fontStyle[0]) : undefined;

    if (fontSize && fontSize > 64) {
      char.textContent = "💥";
    } else if (fontSize) {
      char.style.fontSize = `${fontSize * 1.1}px`;
    } else {
      console.error("bad char fontsize");
    }
  }
}

function deflate(e: KeyboardEvent, char: HTMLElement) {
  if (e.code === "ArrowDown") {
    e.preventDefault();
    const fontStyle =
      window &&
      window.getComputedStyle(char).getPropertyValue("font-size").match(/\d+/);
    const fontSize = fontStyle ? parseInt(fontStyle[0]) : undefined;

    if (char.textContent !== "💥" && fontSize) {
      char.style.fontSize = `${fontSize * 0.9}px`;
    }
  }
}

const balloon = document.getElementById("balloon");

// When you press the up arrow, it should inflate (grow) 10 percent
if (balloon) document.addEventListener("keydown", (e) => inflate(e, balloon));
else console.error("balloon not found");

// when you press the down arrow, it should deflate (shrink) 10 percent
if (balloon) document.addEventListener("keydown", (e) => deflate(e, balloon));
else console.error("balloon not found");
