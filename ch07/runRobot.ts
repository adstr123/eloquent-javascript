import VillageState from "./VillageState";
import { randomRobot, routeRobot } from "./buildRobot";

export default function runRobot(
  state: VillageState,
  roadGraph: Robot.Graph,
  robot: Function,
  memory?: any
): void {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length === 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, roadGraph, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

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

runRobot(VillageState.random(roadGraph), roadGraph, randomRobot);
runRobot(VillageState.random(roadGraph), roadGraph, routeRobot, []);
