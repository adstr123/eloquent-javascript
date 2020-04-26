import VillageState from "./VillageState";

/**
 * Chooses a random destination from an array of destinations (as strings)
 * @param array
 */
export function randomPick(array: string[]): string {
  let choice: number = Math.floor(Math.random() * array.length);
  return array[choice];
}

function findRoute(graph: Robot.Graph, from: string, to: string) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some((w) => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

/**
 * Creates a robot with a delivery strategy of randomly selecting destinations until all parcels have been delivered
 * @param state - The current world state
 * @param roadGraph - The road network to sample the next destination from
 */
export function randomRobot(
  state: VillageState,
  roadGraph: Robot.Graph
): { direction: string } {
  return {
    direction: randomPick(roadGraph[state.place]),
  };
}

export function routeRobot(
  state: VillageState,
  roadGraph: Robot.Graph,
  memory: string[]
) {
  if (memory.length === 0) {
    memory = [
      "Alice's House",
      "Cabin",
      "Alice's House",
      "Bob's House",
      "Town Hall",
      "Daria's House",
      "Ernie's House",
      "Grete's House",
      "Shop",
      "Grete's House",
      "Farm",
      "Marketplace",
      "Post Office",
    ];
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

function goalOrientedRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}
