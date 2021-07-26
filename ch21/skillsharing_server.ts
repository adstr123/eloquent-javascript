import { createServer } from "http";
var Router = require("./router");
var ecstatic = require("ecstatic");
import { readFileSync, writeFile } from "fs";
const fileName = "./talks.json";

var router = new Router();
var defaultHeaders = { "Content-Type": "text/plain" };

interface Talk {
  title: string;
  presenter: string;
  summary: string;
}

var SkillShareServer = class SkillShareServer {
  talks: Talk[];
  version: number;
  waiting: never[];
  server;
  talkResponse!: () => {
    body: string;
    headers: { "Content-Type": string; ETag: string; "Cache-Control": string };
  };
  updated: () => void;

  /**
   *
   * @param talks Object whose property names are the talk titles. Talks exposed as HTTP resources.
   */
  constructor(talks: Talk[]) {
    this.talks = talks;
    this.version = 0;
    this.waiting = [];

    // we require support for advanced features like caching
    // therefore we use a robust, well-tested static file server
    // produces request handler function - we have to tell it where to look for files
    // accepts request & response params
    let fileServer = ecstatic({ root: "./public" });
    this.server = createServer((request, response) => {
      let resolved = router.resolve(this, request);
      if (resolved) {
        resolved
          .catch((error: Response) => {
            if (error.status != null) return error;
            return { body: String(error), status: 500 };
          })
          .then(({ body, status = 200, headers = defaultHeaders }) => {
            response.writeHead(status, headers);
            response.end(body);
          });
      } else {
        fileServer(request, response);
      }
    });
  }

  start(port: number) {
    this.server.listen(port);
  }

  stop() {
    this.server.close();
  }
};

const talkPath = /^\/talks\/([^\/]+)$/;

/**
 * Handler for GET requests.
 * Look up a single talk.
 * Responds with either that talk's JSON data or with 404 error.
 */
router.add("GET", talkPath, async (server: SkillShareServer, title: string) => {
  if (title in server.talks) {
    return {
      body: JSON.stringify(server.talks[title]),
      headers: { "Content-Type": "application/json" },
    };
  } else {
    return { status: 404, body: `No talk '${title}' found` };
  }
});

router.add(
  "DELETE",
  talkPath,
  async (server: SkillShareServer, title: string) => {
    if (title in server.talks) {
      delete server.talks[title];
      server.updated();
    }
    return { status: 204 };
  }
);

/**
 * Reads a data stream and turns it into a string.
 * @param {ReadableStream} stream
 * @returns {string}
 */
function readStream(stream) {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("error", reject);
    stream.on("data", (chunk) => (data += chunk.toString()));
    stream.on("end", () => resolve(data));
  });
}

/**
 * Creates new talks.
 */
router.add("PUT", talkPath, async (server, title: string, request: Request) => {
  let requestBody = await readStream(request);
  let talk;

  try {
    talk = JSON.parse(requestBody);
  } catch (_) {
    return { status: 400, body: "Invalid JSON" };
  }

  // validate whether data has presenter & summary properties
  if (
    !talk ||
    typeof talk.presenter != "string" ||
    typeof talk.summary != "string"
  ) {
    return { status: 400, body: "Bad talk data" };
  }

  // if valid, store an object that represents the new talks object
  // may overwrite existing talk with this title
  server.talks[title] = {
    title,
    presenter: talk.presenter,
    summary: talk.summary,
    comments: [],
  };
  server.updated();
  return { status: 204 };
});

/**
 * Creates new comments.
 */
router.add(
  "POST",
  /^\/talks\/([^\/]+)\/comments$/,
  async (server, title: string, request: Request) => {
    let requestBody = await readStream(request);
    let comment;

    try {
      comment = JSON.parse(requestBody);
    } catch (_) {
      return { status: 400, body: "Invalid JSON" };
    }

    // validate whether data has author & message properties
    if (
      !comment ||
      typeof comment.author != "string" ||
      typeof comment.message != "string"
    ) {
      return { status: 400, body: "Bad comment data" };
    } else if (title in server.talks) {
      // if valid, store the new comment
      server.talks[title].comments.push(comment);
      server.updated();
      return { status: 204 };
    } else {
      return { status: 404, body: `No talk '${title}' found` };
    }
  }
);

/**
 * Helper method that builds an array of talks to send to the client.
 * Includes an appropriate ETag header in the response.
 */
SkillShareServer.prototype.talkResponse = function () {
  let talks = [];
  for (let title of Object.keys(this.talks)) {
    talks.push(this.talks[title]);
  }
  return {
    body: JSON.stringify(talks),
    headers: {
      "Content-Type": "application/json",
      ETag: `"${this.version}"`,
      "Cache-Control": "no-store",
    },
  };
};

/**
 * Gets a talk.
 * Deals with both regular GET requests & long-polling requests.
 */
router.add("GET", /^\/talks$/, async (server, request) => {
  // check if If-None-Match and Prefer headers are present
  let tag = /"(.*)"/.exec(request.headers["if-none-match"]);
  let wait = /\bwait=(\d+)/.exec(request.headers["prefer"]);

  if (!tag || tag[1] != server.version) {
    // if no tag was given/tag doesn't match server version
    // send list of talks
    return server.talkResponse();
  } else if (!wait) {
    // if we need to respond straight away, respond with 304
    return { status: 304 };
  } else {
    // if we can delay the response, wait until something changes to notify client
    return server.waitForChanges(Number(wait[1]));
  }
});

/**
 * Handles delayed responses.
 * Store callback functions for delayed request so they can be notified when something changes.
 * Set a timer to respond with 304 if request has waited long enough.
 */
SkillShareServer.prototype.waitForChanges = function (time) {
  return new Promise((resolve) => {
    this.waiting.push(resolve);
    setTimeout(() => {
      if (!this.waiting.includes(resolve)) return;
      this.waiting = this.waiting.filter((r) => r != resolve);
      resolve({ status: 304 });
    }, time * 1000);
  });
};

/**
 * Registers a change by incrementing the version property.
 * Notifies waiting long polling requests about the change by waking up all waiting requests.
 */
SkillShareServer.prototype.updated = function () {
  this.version++;
  let response = this.talkResponse();
  this.waiting.forEach((resolve) => resolve(response));
  this.waiting = [];

  writeFile(fileName, JSON.stringify(this.talks), (e) => {
    if (e) throw e;
  });
};

function loadTalks() {
  let json;
  try {
    json = JSON.parse(readFileSync(fileName, "utf8"));
  } catch (e) {
    json = {};
  }
  return Object.assign(Object.create(null), json);
}

new SkillShareServer(loadTalks()).start(8000);
