interface Pixel {
  x: number;
  y: number;
  color: string;
}

type Tool = "draw" | "fill" | "rectangle" | "pick";

interface State {
  tool: Tool;
  color: string;
  picture: Picture;
  done: Picture[] | [];
  doneAt: number;
}

interface Position {
  x: number;
  y: number;
}

interface Action {
  undo: boolean;
  picture: Picture;
}

type Controls = (
  | typeof ToolSelect
  | typeof ColorSelect
  | typeof SaveButton
  | typeof LoadButton
  | typeof UndoButton
)[];

/**
 * tools - maps names that appear in the tools dropdown to functions that implement those tools
 * controls - constructors for the UI elements that appear below the picture
 * dispatch - update state function
 */
interface PixelEditorConfig {
  tools: { [index: string]: Function };
  controls: Controls;
  dispatch: (state: State, tools?: Object, controls?: Function) => void;
}

/**
 * stores width, height & content of a picture
 * @param {number} width
 * @param {number} height
 * @param {Pixel[]} pixels - matrix of image pixels stored row by row, from top to bottom
 */
class Picture {
  width: number;
  height: number;
  pixels: Pixel[];
  constructor(width: number, height: number, pixels: Pixel[]) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  /**
   * create a picture with all pixels the same colour
   * @param {number} width
   * @param {number} height
   * @param {string} color
   * @returns
   */
  static empty(width: number, height: number, color: string) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  pixel(x: number, y: number) {
    return this.pixels[x + y * this.width];
  }

  /**
   * updates multiple pixels at a time
   * @param {Pixel[]} pixels
   * @returns {Picture} - picture with updated pixel content (overwritten)
   */
  draw(pixels: Pixel[]): Picture {
    // slice without arguments copies entire array (default start: 0 default end: array length)
    let copy = this.pixels.slice();
    for (let { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

/**
 * dispatch action as an object whose properties overwrite properties of the previous state
 * @param {State} state - current state
 * @param {Object} action - new state properties
 * @returns
 */
function updateState(state: State, action: Object) {
  return { ...state, ...action };
}

/**
 * verbose DOM manipulation methods wrapped in helper function
 * @param {string} type
 * @param {Object} props - assign properties to DOM nodes. Can't set arbitrary attributes anymore, but can now set properties which aren't strings
 * @param  {string | HTMLElement} children
 * @returns {HTMLElement}
 */
function elt(
  type: string,
  props?: Object | null,
  ...children: (string | HTMLElement)[]
): HTMLElement {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (child != "string") dom.appendChild(<HTMLElement>child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

// draw each pixel as a 10-by-10 square
const scale = 10;

/**
 * part of the interface
 * displays a picture as a grid of coloured boxes
 * communicated pointer events on the picture to the rest of the application
 * while the mouse is pressed over the canvas, call a given callback to trigger mouse interaction
 * @param {Picture} picture
 * @param {Function} pointerDown
 */
class PictureCanvas {
  dom: HTMLCanvasElement;
  mouse!: (
    downEvent: MouseEvent,
    onDown: (pos: Position) => ((pos: Position) => Position) | undefined
  ) => void;
  touch!: (
    startEvent: TouchEvent,
    onDown: (pos: Position) => ((pos: Position) => Position) | undefined
  ) => void;
  picture!: Picture;

  constructor(
    picture: Picture,
    pointerDown: (pos: Position) => ((pos: Position) => Position) | undefined
  ) {
    this.dom = <HTMLCanvasElement>elt("canvas", {
      onmousedown: (event: MouseEvent) => this.mouse(event, pointerDown),
      ontouchstart: (event: TouchEvent) => this.touch(event, pointerDown),
    });
    this.syncState(picture);
  }

  /**
   * keep track of current picture
   * only redraw when given a new picture
   * @param {Picture} picture
   * @returns
   */
  syncState(picture: Picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}

/**
 * do the work of drawing a picture onto a canvas
 * create a canvas based on the scale & the picture size
 * fill the canvas with a series of squares for each pixel
 * @param {Picture} picture
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale
 */
function drawPicture(
  picture: Picture,
  canvas: HTMLCanvasElement,
  scale: number
) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      if (cx) cx.fillStyle = picture.pixel(x, y);
      if (cx) cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

/**
 * may call another callback to notify when pointer is moved to a different pixel, whilst the button is held down
 */
PictureCanvas.prototype.mouse = function (
  downEvent: MouseEvent,
  onDown: (pos: Position) => ((pos: Position) => Position) | undefined
) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);

  let onMove = onDown(pos);
  if (!onMove) return;

  let move = (moveEvent: MouseEvent) => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove!(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

/**
 * use the position of the canvas & the mouse event coordinates to deduce picture coordinates
 */
function pointerPosition(pos: MouseEvent | Touch, domNode: HTMLElement) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale),
  };
}

PictureCanvas.prototype.touch = function (startEvent, onDown) {
  // when touching, account for different event types
  // when touching, clientX & clientY aren't available directly on event object
  // use coordinated of the first touch object in .touches instead
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  // when touching, prevent panning
  startEvent.preventDefault();

  if (!onMove) return;

  let move = (moveEvent: TouchEvent) => {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove!(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};

/**
 * the main component - a shell around a canvas & a set of tools
 */
class PixelEditor {
  state: State;
  canvas: PictureCanvas;
  controls: Controls;
  dom: HTMLElement;
  constructor(state: State, config: PixelEditorConfig) {
    let { tools, controls, dispatch } = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, (pos) => {
      let tool = tools[this.state.tool];
      // create a tool specified in this PixelEditor's config.tools available tools
      // provide the tool with the current picture position, application state, and a dispatch function
      let onMove = tool(pos, this.state, dispatch);
      // if the tool also returns a move handler, adapt it to also receive state
      if (onMove) return (pos) => onMove(pos, this.state);
    });

    // update controls property so we can update it when state changes
    this.controls = controls.map((Control) => new Control(state, config));

    this.dom = elt(
      "div",
      {},
      this.canvas.dom,
      elt("br"),
      ...this.controls.reduce((a, c) => a.concat(" ", c.dom), [])
    );
  }

  syncState(state: State) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}

/**
 * A control.
 * Shows this PixelEditor's available tools as a dropdown.
 * Registers a "change" handler that updates PixelEditor state upon tool selection.
 */
class ToolSelect {
  select!: HTMLSelectElement;
  dom!: HTMLLabelElement;
  constructor(
    state: State,
    { tools, dispatch }: { tools: Object; dispatch: Function }
  ) {
    this.select = <HTMLSelectElement>elt(
      "select",
      {
        onchange: () => dispatch({ tool: this.select.value }),
      },
      ...Object.keys(tools).map((name) =>
        elt(
          "option",
          {
            selected: name == state.tool,
          },
          name
        )
      )
    );
    this.dom = <HTMLLabelElement>elt("label", null, "Tool: ", this.select);
  }

  syncState(state: State) {
    this.select.value = state.tool;
  }
}

/**
 * A control.
 * Displays an input of type "color".
 * Registers a "change" handler that updates PixelEditor state upon colour selection.
 */
class ColorSelect {
  input: HTMLInputElement;
  dom: HTMLLabelElement;
  constructor(state: State, { dispatch }: { dispatch: Function }) {
    this.input = <HTMLInputElement>elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({ color: this.input.value }),
    });
    this.dom = <HTMLLabelElement>elt("label", null, "Color: ", this.input);
  }

  syncState(state: State) {
    this.input.value = state.color;
  }
}

/**
 * changes the target pixel to the currently selected colour
 * dispatches an action to update the picture state with the new pixel value
 */
function draw(pos: Position, state: State, dispatch: Function) {
  function drawPixel({ x, y }: Position, state: State) {
    let drawn = { x, y, color: state.color };
    dispatch({ picture: state.picture.draw([drawn]) });
  }

  // immediately update pixel
  // also return the same function to also update newly clicked/touched pixels (when clicking & dragging)
  drawPixel(pos, state);
  return drawPixel;
}

/**
 * draw a rectangle between the point where you start dragging and the point you drag to
 * drawn on the picture from the original state, so you can resize while creating without intermediate rectangles persisting
 */
function rectangle(start: Position, state: State, dispatch: Function) {
  function drawRectangle(pos: Position) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }

  drawRectangle(start);
  return drawRectangle;
}

/**
 * fill the pixel under the pointer + adjacent pixels of the same colour, with the currently selected colour
 * "adjacent" means horizontally or vertically adjacent (not diagonally)
 * searches a grid to find the "connected" pixels, keeping track of possible routes
 */
function fill({ x, y }: Position, state: State, dispatch: Function) {
  const around = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
  ];

  let targetColor = state.picture.pixel(x, y);
  // doubles as this function's work list
  let drawn = [{ x, y, color: state.color }];

  for (let done = 0; done < drawn.length; done++) {
    for (let { dx, dy } of around) {
      let x = drawn[done].x + dx,
        y = drawn[done].y + dy;

      // for each pixel, check if adjacent pixels have the same colour & haven't already been painted
      // loop counter lags behind length of drawn, as new pixels are added
      // pixels ahead of it still need to be explored
      // when it catches up, no unexplored pixels remain, and we are don
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        state.picture.pixel(x, y) == targetColor &&
        !drawn.some((p) => p.x == x && p.y == y)
      ) {
        drawn.push({ x, y, color: state.color });
      }
    }
  }

  dispatch({ picture: state.picture.draw(drawn) });
}

/**
 * updates state with a new currently selected colour
 */
function pick(pos: Position, state: State, dispatch: Function) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

/**
 * controls the Save button in the app
 * button downloads the current picture in state as an image file
 * @param {Object} state
 */
class SaveButton {
  picture: Picture;
  dom: HTMLButtonElement;
  constructor(state: State) {
    this.picture = state.picture;
    this.dom = <HTMLButtonElement>elt(
      "button",
      {
        onclick: () => this.save(),
      },
      "Save"
    );
  }

  save() {
    let canvas = <HTMLCanvasElement>elt("canvas");
    // use a canvas to create the image file - this time with a scale of one square per pixel
    // .toDataUrl() creates a data URL (starting with data:) which contains the whole resource
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png",
    });

    // create a ghost link and click it to show a save file dialog
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  syncState(state: State) {
    this.picture = state.picture;
  }
}

/**
 * controls the Load button in the app
 * load existing local image files into the app
 */
class LoadButton {
  dom: HTMLButtonElement;
  constructor(_, { dispatch }: { dispatch: Function }) {
    this.dom = <HTMLButtonElement>elt(
      "button",
      {
        onclick: () => startLoad(dispatch),
      },
      "Load"
    );
  }

  syncState() {}
}

function startLoad(dispatch: Function) {
  // user must select a file through a file input
  // we don't want the load button to look like a file input field, so create button on Load button click and hijack that click
  let input = <HTMLInputElement>elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files && input.files[0], dispatch),
  });

  document.body.appendChild(input);
  input.click();
  input.remove();
}

/**
 * get access to the loaded image file's contents as a data URL
 */
function finishLoad(file: File | null, dispatch: Function) {
  if (file == null) return;

  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = <HTMLImageElement>elt("img", {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
        }),
      src: reader.result,
    });
  });

  // .readAsDataURL gets access to the file, but not its pixel content
  reader.readAsDataURL(file);
}

/**
 * get access to an image file's pixel content by drawing it to a canvas
 */
function pictureFromImage(image: CanvasImageSource) {
  // limit image size to 100x100
  // anything larger at 10 scale will likely overflow the viewport and impact performance
  let width = Math.min(100, <number>image.width);
  let height = Math.min(100, <number>image.height);
  let canvas = <HTMLCanvasElement>elt("canvas", { width, height });
  let cx = canvas.getContext("2d");
  if (cx) cx.drawImage(image, 0, 0);
  let pixels = [];

  function hex(n: number) {
    return n.toString(16).padStart(2, "0");
  }

  // utilise canvas' .getImageData to read pixels
  // returns an array of colour components
  // components contain four values corresponding to RGBA
  if (cx) {
    let { data } = cx.getImageData(0, 0, width, height);

    for (let i = 0; i < data.length; i += 4) {
      let [r, g, b] = data.slice(i, i + 3);
      pixels.push("#" + hex(r) + hex(g) + hex(b));
    }
  }

  return new Picture(width, height, pixels);
}

/**
 * since Picture is immutable, storing previous versions is simplified
 * @param {State} state
 * @param {[]} state.done - stores historical pictures at specified time intervals
 * @param {Object} action
 * @returns
 */
function historyUpdateState(state: State, action: Action) {
  if (action.undo == true) {
    // if action is an undo action, replace current picture in state with the most recent picture in state.done
    // set doneAt to 0, so the next change is guaranteed to store the picture back in state.done
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0,
    });
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    // if action contains a new picture and the history is more than a second old...
    // update .done & .doneAt to reflect previous picture
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now(),
    });
  } else {
    return Object.assign({}, state, action);
  }
}

/**
 * controls the Undo button in the app
 * undo most recent change to the state's current picture
 */
class UndoButton {
  dom: HTMLButtonElement;
  constructor(state: State, { dispatch }: { dispatch: Function }) {
    this.dom = <HTMLButtonElement>elt(
      "button",
      {
        onclick: () => dispatch({ undo: true }),
        disabled: state.done.length == 0,
      },
      "Undo"
    );
  }

  syncState(state: State) {
    this.dom.disabled = state.done.length == 0;
  }
}

// default start state
const startState = {
  tool: "draw" as Tool,
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0,
};

// default tools
const baseTools = { draw, fill, rectangle, pick };

// default controls
const baseControls = [
  ToolSelect,
  ColorSelect,
  SaveButton,
  LoadButton,
  UndoButton,
];

/**
 * dispatch function to pass to PixelEditor to create the main component
 */
function startPixelEditor({
  state = startState,
  tools = baseTools,
  controls = baseControls,
}) {
  // use = when destructuring to provide default value, if it is missing/undefined
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    },
  });
  return app.dom;
}
