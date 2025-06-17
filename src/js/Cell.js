/**
 * Represents a single cell in the maze grid.
 * Each cell has walls on four sides, position coordinates, and tracks its visited state.
 */
export class Cell {
    /**
     * Creates a new Cell instance.
     * @param {number} row - The row position of the cell in the maze grid
     * @param {number} col - The column position of the cell in the maze grid
     */
    constructor(row, col) {
        /** @type {number} - Row position in the maze grid */
        this.row = row;
        /** @type {number} - Column position in the maze grid */
        this.col = col;
        /** @type {Object} - Wall configuration for the cell */
        this.walls = {
            /** @type {boolean} - Whether the top wall exists */
            top: true,
            /** @type {boolean} - Whether the right wall exists */
            right: true,
            /** @type {boolean} - Whether the bottom wall exists */
            bottom: true,
            /** @type {boolean} - Whether the left wall exists */
            left: true
        };
        /** @type {boolean} - Private visited state */
        this._visited = false;
        /** @type {Set<Cell>} - Set containing this cell, used for union-find operations */
        this.set = new Set([this]);
    }    
    
    /**
     * Sets the visited state of the cell and updates the DOM element.
     * @param {boolean} value - The new visited state
     */
    set visited(value) {
        this._visited = value;
        const cellDiv = this.getCellDiv();
        if (value) {
            cellDiv.classList.add('visited');
        } else {
            cellDiv.classList.remove('visited');
        }
    }

    /**
     * Gets the visited state of the cell.
     * @returns {boolean} Whether the cell has been visited
     */
    get visited() {
        return this._visited;
    }

    /**
     * Gets the DOM element representing this cell.
     * @returns {HTMLElement|null} The DOM element for this cell
     */
    getCellDiv() {
        return document.querySelector(`.cell[data-row="${this.row}"][data-col="${this.col}"]`);
    }

    /**
     * Checks if this cell is in the same set as another cell (for union-find operations).
     * @param {Cell} cell - The cell to compare with
     * @returns {boolean} True if both cells are in the same set
     */
    isSameSet(cell) {
        return this.set === cell.set;
    }

    /**
     * Unions this cell's set with another cell's set.
     * Merges the two sets and updates all cells in both sets to reference the new combined set.
     * @param {Cell} cell - The cell whose set should be merged with this cell's set
     */
    union(cell) {
        const newSet = new Set([...this.set, ...cell.set]);
        for (let cell of newSet) {
            cell.set = newSet;
        }
    }
}