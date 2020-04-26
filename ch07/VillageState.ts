/// <reference path="../typings/index.d.ts" />
import { randomPick } from "./buildRobot";

/** Describes the state of the world through a robot's current location, and a list of undelivered parcels */
export default class VillageState {
  place: string;
  parcels: Robot.Parcel[];
  roadGraph: Robot.Graph;
  constructor(place: string, parcels: Robot.Parcel[], roadGraph: Robot.Graph) {
    this.place = place;
    this.parcels = parcels;
    this.roadGraph = roadGraph;
  }

  /**
   * Update the world state in an immutable fashion by creating a new VillageState object according to a parcel's movement
   * @param destination - The address in roadGraph to move to
   * @returns - An updated (new) VillageState
   */
  move(destination: string): VillageState {
    if (!this.roadGraph[this.place].includes(destination)) {
      // destination doesn't exist, robot cannot move
      return this;
    } else {
      // deliver parcels who are addressed to this updated location; retain those that aren't
      let parcels = this.parcels
        .map((parcel) => {
          if (parcel.place != this.place) return parcel;
          return { place: destination, address: parcel.address };
        })
        .filter((parcel) => parcel.place != parcel.address);
      return new VillageState(destination, parcels, this.roadGraph);
    }
  }

  /**
   * Generate a random world state
   * @param parcelCount - The number of parcels to be delivered in the world
   */
  static random(roadGraph: Robot.Graph, parcelCount: number = 5): VillageState {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      // ensure no parcels are sent from the same place they were addressed to
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({ place, address });
    }
    return new VillageState("Post Office", parcels, roadGraph);
  }
}
