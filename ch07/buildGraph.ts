/// <reference path="../typings/index.d.ts" />

/**
 * Given an array of edges describing connected points, creates a map object that stores an array of connected nodes as individual elements, for each node
 * @param edges - An array of strings describing edges; must be of the format "[A]-[B]", separating character "-" is used
 */
export default function buildGraph(edges: string[]): Robot.Graph {
  let graph: Robot.Graph = Object.create(null);
  /**
   * Adds a connected node; if the originating destination doesn't exist, add it to the list of points; if it does, add another connected point
   * @param from - Point A
   * @param to - Point B
   */
  function addEdge(from: string, to: string): void {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }

  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }

  return graph;
}
