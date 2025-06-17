import { Cell } from './Cell.js';

/**
 * Manages the maze structure and provides methods for maze generation and manipulation.
 * Handles cell creation, neighbor relationships, wall removal, and maze drawing.
 */
export class MazeManager {
    /**
     * Creates a new MazeManager instance with a grid of cells.
     * @param {number} [rows=10] - The number of rows in the maze grid
     * @param {number} [cols=10] - The number of columns in the maze grid
     */
    constructor(rows = 10, cols = 10) {
        /** @type {Cell[][]} - 2D array containing all cells in the maze */
        this.cells = [];
        /** @type {number} - Number of rows in the maze */
        this.rows = rows;
        /** @type {number} - Number of columns in the maze */
        this.cols = cols;
        for (let i = 0; i < rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < cols; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }
    }

    /**
     * Returns the cell at the specified row and column.
     * @param {number} row 
     * @param {number} col 
     * @returns {Cell} The cell at the specified row and column.
     */
    getCell(row, col) {
        return this.cells[row][col];
    }

    /**
     * Gets all neighboring cells of a given cell (up, right, down, left).
     * @param {Cell} cell - The cell to find neighbors for
     * @returns {Cell[]} Array of neighboring cells that exist within the maze bounds
     */
    getNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;
        if (row > 0) {
            neighbors.push(this.cells[row - 1][col]);
        }
        if (col < this.cols - 1) {
            neighbors.push(this.cells[row][col + 1]);
        }
        if (row < this.rows - 1) {
            neighbors.push(this.cells[row + 1][col]);
        }
        if (col > 0) {
            neighbors.push(this.cells[row][col - 1]);
        }
        return neighbors;
    }    
    
    /**
     * Pushes a new row of cells to the maze.
     * Throws an error if the row length does not match the number of columns.
     * @param {Cell[]} row - Array of cells to add as a new row
     * @throws {Error} When row length doesn't match the number of columns
     */
    pushNewRow(row) {
        if (row.length !== this.cols) {
            throw new Error(`Row length must be equal to cols (${this.cols})`);
        }
        this.cells.push(row);
        this.rows++;
    }    
    
    /**
     * Pushes a new column of cells to the maze.
     * @param {Cell[]} col - Array of cells to add as a new column
     * @throws {Error} If the number of cells in each row does not match the number of rows.
     */
    pushNewCol(col) {
        if (this.cells.length !== this.rows) {
            throw new Error(`Number of rows must be equal to the number of cells in each row (${this.cells.length})`);
        }
        for (let i = 0; i < this.rows; i++) {
            this.cells[i].push(col[i]);
        }
        this.cols++;
    }

    /**
     * Removes walls between two adjacent cells and updates the corresponding DOM elements.
     * Determines the direction between cells and removes the appropriate walls.
     * @param {Cell} cell1 - The first cell
     * @param {Cell} cell2 - The second cell (must be adjacent to cell1)
     */
    removeWalls(cell1, cell2) {
        const rowDiff = cell1.row - cell2.row;
        const colDiff = cell1.col - cell2.col;
        if (rowDiff === 1) {
            cell1.walls.top = false;
            cell2.walls.bottom = false;
            // remove class from cell1 div and cell2 div
            const cell1Div = this.getCellDiv(cell1.row, cell1.col);
            const cell2Div = this.getCellDiv(cell2.row, cell2.col);
            cell1Div.classList.remove('top');
            cell2Div.classList.remove('bottom');

        } else if (rowDiff === -1) {
            cell1.walls.bottom = false;
            cell2.walls.top = false;
            // remove class from cell1 div and cell2 div
            const cell1Div = this.getCellDiv(cell1.row, cell1.col);
            const cell2Div = this.getCellDiv(cell2.row, cell2.col);
            cell1Div.classList.remove('bottom');
            cell2Div.classList.remove('top');
        }
        if (colDiff === 1) {
            cell1.walls.left = false;
            cell2.walls.right = false;

            const cell1Div = this.getCellDiv(cell1.row, cell1.col);
            const cell2Div = this.getCellDiv(cell2.row, cell2.col);
            cell1Div.classList.remove('left');
            cell2Div.classList.remove('right');

        } else if (colDiff === -1) {
            cell1.walls.right = false;
            cell2.walls.left = false;

            const cell1Div = this.getCellDiv(cell1.row, cell1.col);
            const cell2Div = this.getCellDiv(cell2.row, cell2.col);
            cell1Div.classList.remove('right');
            cell2Div.classList.remove('left');
        }
    }    
    
    /**
     * Returns a random unvisited cell from the maze.
     * @param {Cell} cell - The cell to check neighbors for
     * @returns {Cell[]} Array of unvisited neighboring cells
     */
    getUnvisitedNeighbors(cell) {
        return this.getNeighbors(cell).filter(neighbor => !neighbor.visited);
    }    
    
    /**
     * Returns a random neighbor of the given cell, visited or not.
     * @param {Cell} cell - The cell to find neighbors for
     * @param {Cell[]} [exclude=[]] - An array of cells to exclude from the selection
     * @returns {Cell|null} A random neighbor cell or null if no neighbors exist
     */
    getRandomNeighbor(cell, exclude = []) {
        const neighbors = this.getNeighbors(cell).filter(neighbor => !exclude.includes(neighbor));
        if (neighbors.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * neighbors.length);
        return neighbors[randomIndex];
    }    
    
    /**
     * Draws the maze on the board by adding and removing divs.
     * Creates DOM elements for each cell with appropriate wall classes.
     * @param {HTMLElement} maze - The DOM element to render the maze into
     */
    draw(maze) {
        maze.innerHTML = '';
        for (let i = 0; i < this.rows; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < this.cols; j++) {
                const cell = this.cells[i][j];
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.dataset.row = cell.row;
                cellDiv.dataset.col = cell.col;
                if (cell.walls.top) {
                    cellDiv.classList.add('top');
                }
                if (cell.walls.right) {
                    cellDiv.classList.add('right');
                }
                if (cell.walls.bottom) {
                    cellDiv.classList.add('bottom');
                }
                if (cell.walls.left) {
                    cellDiv.classList.add('left');
                }
                row.appendChild(cellDiv);
            }
            maze.appendChild(row);
        }
    }    /**
     * Gets the DOM element for a cell at the specified coordinates.
     * @param {number} row - The row index of the cell
     * @param {number} col - The column index of the cell
     * @returns {HTMLElement|null} The DOM element representing the cell
     */
    getCellDiv(row, col) {
        return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }

    /**
     * Resets the maze to its initial state.
     * All cells become unvisited, walls are restored, and visual classes are removed.
     */
    reset() {
        for (let row of this.cells) {
            for (let cell of row) {
                cell.visited = false;
                cell.getCellDiv().classList.remove('dead-end');
                cell.getCellDiv().classList.remove('current');
                cell.walls = {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true
                };
                cell.set = new Set([cell]);
            }
        }
    }    /**
     * Gets all unvisited cells in the maze.
     * @returns {Cell[]} Array of all unvisited cells
     */
    getUnvisitedCells() {
        return this.cells.flat().filter(cell => !cell.visited);
    }

    /**
     * Gets a random unvisited cell from the maze.
     * @returns {Cell|null} A random unvisited cell or null if all cells are visited
     */
    getRandomUnvisitedCell() {
        const unvisitedCells = this.getUnvisitedCells();
        if (unvisitedCells.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * unvisitedCells.length);
        return unvisitedCells[randomIndex];
    }
}