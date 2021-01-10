import Level from "./level";
import State from "./state";
import { DOMDisplay } from "./draw";

const simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

// we can create a level instance
let simpleLevel = new Level(simpleLevelPlan);

// display levels on the screen
let display = new DOMDisplay(document.body, simpleLevel);

// model time & motion inside them
display.syncState(State.start(simpleLevel));
