/// <reference path="../typings/index.d.ts" />

import VillageState from "./VillageState";

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

let initial = new VillageState(
  "Post Office",
  [{ place: "Post Office", address: "Alice's House" }],
  roadGraph
);

test("creating a new VillageState with a single parcel should create an object with appropriate properties", () => {
  expect(initial.place).toBe("Post Office");
  expect(initial.parcels).toHaveLength(1);
  expect(Object.keys(initial.roadGraph)).toHaveLength(11);
});

let next = initial.move("Alice's House");
test("moving to the single specified address should update the place property appropriately", () => {
  expect(next.place).toBe("Alice's House");
});

test("moving to the single specified address should deliver the parcel", () => {
  expect(next.parcels).toHaveLength(0);
});

test("moving to a new address should update state immutably", () => {
  expect(next).not.toBe(initial);
  expect(initial.place).toBe("Post Office");
  expect(initial.parcels).toHaveLength(1);
});

let randomWorldParcels = VillageState.random(roadGraph, 5).parcels;

test("generating a random world with 5 parcels should create an object with appropriate properties", () => {
  expect(randomWorldParcels).toHaveLength(5);
});

test("a random world should have no parcels with destinations equal to their origin", () => {
  let flag = false;
  for (let parcel of randomWorldParcels) {
    if ((parcel.place = parcel.address)) flag = true;
  }
  expect(flag).toBeFalsy;
});
