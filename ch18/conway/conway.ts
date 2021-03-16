class Grid {
  gridEl: HTMLElement;
  gridCells: Cell[];
  length: number;
  sideLength: number;
  constructor(gridEl: HTMLElement, numCells: number) {
    this.gridEl = gridEl;
    this.gridCells = [];

    this.length = numCells;
    this.sideLength = Math.sqrt(numCells);

    this.init();
  }

  init() {
    this.generateGrid();
    this.populateGrid();
    this.gridCells.forEach((cell) => cell.initAdjacentCells());
  }

  // display a grid of checkboxes
  generateGrid() {
    if (this.sideLength % 1 != 0)
      throw new RangeError("numCells must create a square");

    const checkboxTemplate = document.createElement("input");
    checkboxTemplate.type = "checkbox";

    if (this.gridEl)
      this.gridEl.style.gridTemplateColumns = `repeat(${this.sideLength}, 1fr)`;

    for (let i = 0; i < this.sideLength; i++) {
      for (let ii = 0; ii < this.sideLength; ii++) {
        this.gridEl?.append(checkboxTemplate.cloneNode());

        this.gridCells.push(
          new Cell(
            this,
            this.gridEl.childNodes[
              i * this.sideLength + ii
            ] as HTMLInputElement,
            i,
            ii
          )
        );
      }
    }
  }

  // populate grid with random pattern initially using Math.random
  populateGrid() {
    for (const cell of this.gridCells) {
      if (Math.random() > 0.5) cell.cellEl.checked = true;
    }
  }

  advanceGeneration() {
    // loop through adjacent cells (inc diagonal) and check:
    for (const cell of this.gridCells) {
      const liveNeighbours = cell.adjacentCells.filter(
        (adjacentCell) => adjacentCell?.cellEl.checked
      ).length;
      // 1. any live cell with fewer than two/more than three live neighbors dies (default newState), do nothing
      // 2. any live cell with two or three live neighbors lives on
      if (cell.cellEl.checked && 2 <= liveNeighbours && liveNeighbours <= 3)
        cell.newState = true;
      // 3. any dead cell with three live neighbors becomes live
      if (!cell.cellEl.checked && liveNeighbours === 3) cell.newState = true;
      // changes happening to neighbors during this generation do not influence new state of a given cell
    }

    this.gridCells.forEach((cell) => (cell.cellEl.checked = cell.newState));
    this.gridCells.forEach((cell) => (cell.newState = false));
  }

  getCellByIndex(row: number, column: number): Cell | null {
    if (
      row > 0 ||
      column > 0 ||
      row < this.sideLength ||
      column < this.sideLength
    ) {
      for (const cell of this.gridCells) {
        if (cell.rowIndex === row && cell.columnIndex === column) return cell;
      }
    }

    return null;
  }
}

class Cell {
  masterGrid: Grid;
  cellEl: HTMLInputElement;
  rowIndex: number;
  columnIndex: number;
  adjacentCells: (Cell | null)[];
  newState: boolean;

  /**
   * Create a cell.
   * @param adjacentCells - reference adjacent cells in clockwise order: top, top-right, right, bottom-right, bottom, bottom-left, left, top-left
   */
  constructor(
    gridEl: Grid,
    cellEl: HTMLInputElement,
    rowIndex: number,
    columnIndex: number
  ) {
    this.masterGrid = gridEl;
    this.cellEl = cellEl;
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
    this.adjacentCells = [];
    this.newState = false;
  }

  initAdjacentCells() {
    this.adjacentCells[0] = this.masterGrid.getCellByIndex(
      this.rowIndex - 1,
      this.columnIndex
    );
    // top-right
    this.adjacentCells[1] = this.masterGrid.getCellByIndex(
      this.rowIndex - 1,
      this.columnIndex + 1
    );
    // right
    this.adjacentCells[2] = this.masterGrid.getCellByIndex(
      this.rowIndex,
      this.columnIndex + 1
    );
    // bottom-right
    this.adjacentCells[3] = this.masterGrid.getCellByIndex(
      this.rowIndex + 1,
      this.columnIndex + 1
    );
    // bottom
    this.adjacentCells[4] = this.masterGrid.getCellByIndex(
      this.rowIndex + 1,
      this.columnIndex
    );
    // bottom-left
    this.adjacentCells[5] = this.masterGrid.getCellByIndex(
      this.rowIndex + 1,
      this.columnIndex - 1
    );
    // left
    this.adjacentCells[6] = this.masterGrid.getCellByIndex(
      this.rowIndex,
      this.columnIndex - 1
    );
    // top-left
    this.adjacentCells[7] = this.masterGrid.getCellByIndex(
      this.rowIndex - 1,
      this.columnIndex - 1
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gridObj = new Grid(document.getElementById("grid")!, 10000);
  const advanceBtn = document.getElementById("advance");

  // when button is clicked, advance generation
  advanceBtn?.addEventListener("click", () => {
    gridObj.advanceGeneration();
  });
});
