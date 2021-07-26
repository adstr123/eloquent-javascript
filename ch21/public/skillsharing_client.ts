interface Action {
  message: string;
  summary: string;
  talks: Object[];
  talk: string;
  title: string;
  type: string;
  user: string;
}

interface Talk {
  comments: string[];
  presenter: string;
  summary: string;
  title: string;
}

/**
 * UI doesn't directly manipulate state or send HTTP requests.
 * It emits actions that updates app state with the result of user actions.
 * @param state List of talks & name of user.
 * @param action Describes what the user is trying to do.
 * @returns
 */
function handleAction(
  state: { talks: Object[]; user: string },
  action: Action
) {
  if (action.type == "setUser") {
    // store user's name so it can be restored when page is loaded
    localStorage.setItem("userName", action.user);
    return Object.assign({}, state, { user: action.user });
  } else if (action.type == "setTalks") {
    return Object.assign({}, state, { talks: action.talks });
  } else if (action.type == "newTalk") {
    // involve the server by making a PUT HTTP request
    fetchOK(talkURL(action.title), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        presenter: state.user,
        summary: action.summary,
      }),
    }).catch(reportError);
  } else if (action.type == "deleteTalk") {
    // involve the server by making a DELETE HTTP request
    fetchOK(talkURL(action.talk), { method: "DELETE" }).catch(reportError);
  } else if (action.type == "newComment") {
    // involve the server by making a POST HTTP request
    fetchOK(talkURL(action.talk) + "/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: state.user,
        message: action.message,
      }),
    }).catch(reportError);
  }

  return state;
}

/**
 * Wrapper function ensures the returned promise is rejected when server returns an error code.
 */
function fetchOK(url: string, options: Object) {
  return fetch(url, options).then((response) => {
    if (response.status < 400) return response;
    else throw new Error(response.statusText);
  });
}

/**
 * Helper function builds up a url for a talk with a given title.
 */
function talkURL(title: string) {
  return "talks/" + encodeURIComponent(title);
}

/**
 * Ensure the page doesn't do nothing when a request fails, by showing the client a dialog.
 */
function reportError(error: Error) {
  alert(String(error));
}

/**
 * Shows the field where the user can enter their name.
 * Doesn't need to update, so no update method required.
 */
function renderUserField(name: string, dispatch: Function) {
  return elt(
    "label",
    {},
    "Your name: ",
    elt("input", {
      type: "text",
      value: name,
      onchange(event) {
        dispatch({ type: "setUser", user: event.target.value });
      },
    })
  );
}

/**
 * Helper function used to construct DOM elements.
 */
function elt(type: string, props?: Object | null, ...children: (string | HTMLElement)[]) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);

  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }

  return dom;
}

/**
 * Wrapper around elt helper function, specifically to render talks.
 * This looks extremely messy - the reason that JSX exists.
 */
function renderTalk(talk: Talk, dispatch: Function) {
  return elt(
    "section",
    { className: "talk" },
    elt(
      "h2",
      null,
      talk.title,
      " ",
      elt(
        "button",
        {
          type: "button",
          onclick() {
            dispatch({ type: "deleteTalk", talk: talk.title });
          },
        },
        "Delete"
      )
    ),
    elt("div", null, "by ", elt("strong", null, talk.presenter)),
    elt("p", null, talk.summary),
    ...talk.comments.map(renderComment),
    elt(
      "form",
      {
        onsubmit(event: Event) {
          event.preventDefault();
          let form = <HTMLFormElement>event.target;

          if (form) {
            dispatch({
              type: "newComment",
              talk: talk.title,
              message: form.elements.comment.value,
            });
            form.reset();
          }
        },
      },
      elt("input", { type: "text", name: "comment" }),
      " ",
      elt("button", { type: "submit" }, "Add comment")
    )
  );
}

/**
 * Render a comment.
 */
function renderComment(comment: { author: string; message: string }) {
  return elt(
    "p",
    { className: "comment" },
    elt("strong", null, comment.author),
    ": ",
    comment.message
  );
}

/**
 * Render the form that the user uses to create a new talk.
 */
function renderTalkForm(dispatch: Function) {
  let title = elt("input", { type: "text" });
  let summary = elt("input", { type: "text" });

  return elt(
    "form",
    {
      onsubmit(event) {
        event.preventDefault();
        dispatch({
          type: "newTalk",
          title: title.value,
          summary: summary.value,
        });
        event.target.reset();
      },
    },
    elt("h3", null, "Submit a Talk"),
    elt("label", null, "Title: ", title),
    elt("label", null, "Summary: ", summary),
    elt("button", { type: "submit" }, "Submit")
  );
}

/**
 * Keeps polling the server for /talks & calls a callback when a new set is available.
 * Initial load is closely related to the polling process.
 */
async function pollTalks(update: Function) {
  let tag = undefined;

  // infinite loop
  for (;;) {
    let response;

    // retrieve the list of talks
    // either normally or, if first request, with appropriate headers
    try {
      response = await fetchOK("/talks", {
        headers: tag && { "If-None-Match": tag, Prefer: "wait=90" },
      });
    } catch (e) {
      console.log("Request failed: " + e);
      // if the request failed, wait a moment - then try again
      await new Promise((resolve) => setTimeout(resolve, 500));
      continue;
    }

    // if request timed out, immediately start a new one
    if (response.status == 304) continue;

    // if request is OK
    // read the body & pass to callback
    // store ETag header value for next iteraiton
    tag = response.headers.get("ETag");
    update(await response.json());
  }
}

var SkillShareApp = class SkillShareApp {
  dispatch: Function;
  talkDOM: HTMLElement;
  dom: HTMLElement;
  talks: Object[] | undefined;

  // create the UI
  constructor(state, dispatch: Function) {
    this.dispatch = dispatch;
    this.talkDOM = elt("div", { className: "talks" });
    this.dom = elt(
      "div",
      null,
      renderUserField(state.user, dispatch),
      this.talkDOM,
      renderTalkForm(dispatch)
    );
    this.syncState(state);
  }

  // when talks change, redraw all components
  syncState(state) {
    if (state.talks != this.talks) {
      this.talkDOM.textContent = "";
      for (let talk of state.talks) {
        this.talkDOM.appendChild(renderTalk(talk, this.dispatch));
      }
      this.talks = state.talks;
    }
  }
};

// main
function runApp() {
  let user = localStorage.getItem("userName") || "Anon";
  let state, app;

  function dispatch(action: Action) {
    state = handleAction(state, action);
    app.syncState(state);
  }

  pollTalks((talks: Talk[]) => {
    if (!app) {
      state = { user, talks };
      app = new SkillShareApp(state, dispatch);
      document.body.appendChild(app.dom);
    } else {
      dispatch({ type: "setTalks", talks });
    }
  }).catch(reportError);
}

runApp();
