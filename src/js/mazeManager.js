import { Cell } from './Cell.js';

export class MazeManager {
    constructor(rows = 10, cols = 10) {
        this.cells = [];
        this.rows = rows;
        this.cols = cols;
        for (let i = 0; i < rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < cols; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }
    }

    getCell(row, col) {
        return this.cells[row][col];
    }

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

    getUnvisitedNeighbors(cell) {
        return this.getNeighbors(cell).filter(neighbor => !neighbor.visited);
    }

    /**
     * drawn the maze on the board by adding and removing divs
     * @param {HTMLDivElement} board 
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
    }

    getCellDiv(row, col) {
        return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }

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
    }

}