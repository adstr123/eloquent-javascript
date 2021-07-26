var { parse } = require("url");

interface Route {
  method: string;
  url: RegExp;
  handler: Function;
}

/**
 * Helps dispatch a request to a function that can handle it.
 * E.G. PUT requests with path /talks/some-talk-title can be handled by function X.
 * Also helps extract meaningful parts of the path and passes them to handler.
 */
module.exports = class Router {
  routes: Route[];

  constructor() {
    this.routes = [];
  }

  /**
   * Registers a new handler.
   */
  add(method: string, url: RegExp, handler: Function) {
    this.routes.push({ method, url, handler });
  }

  /**
   * Resolves an incoming request.
   * @returns A response when a handler is found.
   */
  resolve(context, request): Function | null {
    let path = parse(request.url).pathname;

    // try routes one at a time
    for (let { method, url, handler } of this.routes) {
      // match strings for any groups the route defined in its regex
      let match = url.exec(path);
      if (!match || request.method != method) continue;
      // strings must be URL-decoded since raw URL may contain %20-style codes
      let urlParts = match.slice(1).map(decodeURIComponent);
      return handler(context, ...urlParts, request);
    }
    return null;
  }
};
