import { randomPick, randomRobot } from "./randomRobot";
import VillageState from "./VillageState";

let destinations = ["oxford", "bristol", "cardiff", "london", "aviemore"];

test("should select a string that exists in the original array", () => {
  expect(destinations.includes(randomPick(destinations))).toBeTruthy();
});

const roadGraph = {
  "Alice's House": ["Bob's House", "Cabin", "Post Office"],
  "Bob's House": ["Alice's House", "Town Hall"],
  Cabin: ["Alice's House"],
  "Post Office": ["Alice's House", "Marketplace"],
  "Town Hall": ["Bob's House", "Daria's House", "Marketplace", "Shop"],
  "Daria's House": ["Ernie's House", "Town Hall"],
  "Ernie's House": ["Daria's House", "Grete's House"],
  "Grete's House": ["Ernie's House", "Farm", "Shop"],
  Farm: ["Grete's House", "Marketplace"],
  Shop: ["Grete's House", "Marketplace", "Town Hall"],
  Marketplace: ["Farm", "Post Office", "Shop", "Town Hall"],
};
const initialState = new VillageState(
  "Post Office",
  [{ place: "Post Office", address: "Alice's House" }],
  roadGraph
);

test("should select a random direction that exists in the road network", () => {
  expect(
    Object.keys(roadGraph).includes(
      randomRobot(initialState, roadGraph).direction
    )
  );
});
