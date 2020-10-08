var bigOak = require("./crow-tech").bigOak;
var defineRequestType = require("./crow-tech").defineRequestType;
var everywhere = require("./crow-tech").everywhere;

/*********** */
/* CALLBACKS */
/*********** */

// Look up a food cache in "Big Oak" nest, using callback approach
bigOak.readStorage("food caches", (caches) => {
  let firstCache = caches[0];
  bigOak.readStorage(firstCache, (info) => {
    console.log(info);
  });
});

// Define the request type "note" to send between nests
// The 4th argument given to the handler function is done()
// If we had used the handler's return value as the response value,
// that would mean that a request handler itself can't perform asynchronous actions.
defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

/*
 * Send a request between nests
 * @param string - target nest
 * @param string - type of request
 * @param string - request content
 * @param Function - callback to execute when response received
 */
bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7pm", () => {
  console.log("Note delivered.");
});

/********** */
/* PROMISES */
/********** */

// A promise is an asynchronous action that may complete at some point and produce a value
let fifteen = Promise.resolve(15);
fifteen.then((value) => console.log(`Got ${value}`));

// A promise-based interface for crow-tech's "readStorage" function
// Promise() constructor accepts function, which it immediately calls
// Line 3 resolves. Works this way so it is scoped to ensure only the code that created the promise can resolve it
function storage(nest, name) {
  return new Promise((resolve) => {
    nest.readStorage(name, (result) => resolve(result));
  });
}

storage(bigOak, "enemies").then((value) => console.log("Got", value));

// argument 2 is a function to reject the new promise
new Promise((_, reject) => reject(new Error("Fail")))
  .then((value) => console.log("Handler 1"))
  .catch((reason) => {
    console.log("Caught failure " + reason);
    return "nothing";
  })
  .then((value) => console.log("Handler 2", value));

// timeout may not always trigger rejection - could simply prevent fallback from firing
class Timeout extends Error {}
function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    // recursive function
    // regular loop doesn't let us stop & wait for an asynchronous action
    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      // wait for response
      // if none received, send another one, or reject promise
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}

// complete rewrite to Promise-based system by wrapping "defineRequestType" in a Promise handler
function requestType(name, handler) {
  defineRequestType(name, (nest, content, source, callback) => {
    // have to use try/catch to ensure exceptions are passed directly to the callback
    try {
      // convert handler to Promise, if request response isn't ready
      Promise.resolve(handler(nest, content, source)).then(
        (response) => callback(null, response),
        (failure) => callback(failure)
      );
    } catch (exception) {
      callback(exception);
    }
  });
}

requestType("ping", () => "pong");
function availableneighbors(nest) {
  let requests = nest.neighbors.map((neighbour) => {
    return request(nest, neighbour, "ping").then(
      () => true,
      () => false
    );
  });
  // returns a promise that waists for all promises in an array to resolve
  // resolves itself to an array of those returned values
  return Promise.all(requests).then((result) => {
    // filter results for successes
    // else if one fails, whole promise is rejected
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

// implement mechanisms to broadcast information to the whole network
// initialise an array (empty) of gossip already seen
everywhere((nest) => (nest.state.gossip = []));
requestType("gossip", (nest, message, source) => {
  // if a duplicate piece of gossip is received, ignore
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip '${message}' from #{source}`);
  // if a new piece of gossip received, inform all neighbors
  sendGossip(nest, message, source);
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbour of nest.neighbors) {
    if (neighbour == exceptFor) continue;
    request(nest, neighbour, "gossip", message);
  }
}

// spread knowledge about all nests, so we can build up enough knowledge to route messages
requestType("connections", (nest, { name, neighbors }, source) => {
  let connections = nest.state.connections;
  // use flooding again
  // instead of checking if a message has already been received, check if updated set of neighbors for a given nest matches the current set previously saved
  if (JSON.stringify(connections.get(name)) == JSON.stringify(neighbors))
    return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbour of nest.neighbors) {
    if (neighbour == exceptFor) continue;
    request(nest, neighbour, "connections", {
      name,
      neighbors: nest.state.connections.get(name),
    });
  }
}

everywhere((nest) => {
  nest.state.connections = new Map();
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});

// logic to send a message to a specific nest
requestType("route", (nest, { target, type, content }) => {
  return routeRequest(nest, target, type, content);
});

// resembles the route-finding robot algorithm from CH7
function findRoute(from, to, connections) {
  // work is updated to build route
  // each nest returns a step rather than a whole route
  // therefore each node is continuously deciding where to send the message next
  let work = [{ at: from, via: null }];
  for (let i = 0; i < work.length; i++) {
    let { at, via } = work[i];
    for (let next of connections.get(at) || []) {
      // we have arrived, so return the finished route
      if (next == to) return via;
      if (!work.some((w) => w.at == nest)) {
        work.push({ at: next, via: via || next });
      }
    }
  }
  return null;
}

function routeRequest(nest, target, type, content) {
  if (nest.neighbours.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, targt, nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route", { target, type, content });
  }
}

/***************** */
/* ASYNC FUNCTIONS */
/***************** */

// Example: each nest stores information. There is redundancy across nests.
requestType("storage", (nest, name) => storage(nest, name));
function network(nest) {
  // "connections" is a map, so Object.keys returns iterator rather than array
  return Array.from(nest.state.connections.keys());
}

// Problems with the following information retrieval code:
// 1. Awkward - multiple Promises chained in unclear ways
// 2. Requires multiple levels of recursive functions
// 3. Task itself is linear - would be simpler to express in a synchronous framework
function findInStorage(nest, name) {
  return storage(nest, name).then((found) => {
    if (found != null) return found;
    else return findInRemoteStorage(nest, name);
  });
}
function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter((n) => n != nest.name);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      // randomly choose a new nest to query for the required info
      let source = sources[Math.floor(Math.random() * sources.length)];
      sources = sources.filter((n) => n != source);
      return routeRequest(nest, source, "storage", name).then(
        (value) => (value != null ? value : next(), next)
      );
    }
  }
  return next();
}

// Asynchronous version of the above code:
// async functions implicitly return a Promise
async function findInStorage(nest, name) {
  // can "await" other Promises in a manner that looks synchronous
  let local = await storage(nest, name);
  if (local != null) return local;

  let sources = network(nest).filter((n) => n != nest.name);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() * sources.length)];
    sources = sources.filter((n) => n != source);
    try {
      let found = await routeRequest(nest, source, "storage", name);
      if (found != null) return found;
    } catch (_) {}
  }
  throw new Error("Not found");
}

// Introducing the "pause" mechanic means there are opportunities for bugs
function anyStorage(nest, source, name) {
  if (source == nest.name) return storage(nest, name);
  else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {
  let list = "";
  // waits for all nests, returns array of Promises
  await Promise.all(
    network(nest).map(async (name) => {
      // problem here
      // this reassignment takes the value of list at the point of execution
      // when await statement finishes, sets list to the value at point of execution, PLUS the added string
      // but there is a gap between point of execution and await finish
      // map() actually finishes running before anything has been added to the list
      // each += therefore starts from an empty string!
      list += `${name}: ${await anyStorage(nest, name, `chicks in ${year}`)}\n`;
    })
  );
  return list;
}

// the solution:
async function chicksFixed(nest, year) {
  let lines = network(nest).map(async (name) => {
    // return lines from mapped promises, instead of immediately calling Promise.all() on them
    return name + ": " + (await anyStorage(nest, name, `chicks in ${year}`));
  });
  // join results, instead of building list by repeatedly reassigning a variable
  return (await Promise.all(lines)).join("\n");
}

// Generators can also pause & resume:
// * denotes generator function
// generator function always returns iterators (ch. 6)
function* powers(n) {
  for (let current = n; ; current *= n) {
    yield current;
  }
}

// function is frozen at start initially
// when it meets yield, it pauses and triggers yielded value to become the next value produced by iterator
// we proceed onward by calling next
for (let power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}
