// Create a bunch of trail elements
const trailElTemplate = document.createElement("div");
trailElTemplate.classList.add("trail");

for (let i = 0; i < 5; i++) {
  document.body.append(trailElTemplate.cloneNode());
}

const trailEls = <HTMLCollectionOf<HTMLElement>>(
  document.getElementsByClassName("trail")
);
const trailPositions: [number, number][] = [];
let scheduled: Event | null = null;
let trailCounter = 0;

window.addEventListener("mousemove", (e) => {
  // debounce to snapshot at set intervals
  if (!scheduled) {
    setTimeout(() => {
      // get current mouse position and store it
      trailPositions.push([e.pageX, e.pageY]);

      // clear the latest of the snapshots, so queue length is always 5
      if (trailPositions.length > 5) trailPositions.shift();

      // move a trail to the most recent snapshot
      for (const [i, pos] of trailPositions.entries()) {
        trailEls[i].style.left = `${pos[0]}px`;
        trailEls[i].style.top = `${pos[1]}px`;
      }

      scheduled = null;
    }, 50);
  }
  scheduled = e;
});
