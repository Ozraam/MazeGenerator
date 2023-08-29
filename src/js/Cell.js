export class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this._visited = false;
        this.set = new Set([this]);
    }

    set visited(value) {
        this._visited = value;
        const cellDiv = this.getCellDiv();
        if (value) {
            cellDiv.classList.add('visited');
        } else {
            cellDiv.classList.remove('visited');
        }
    }

    get visited() {
        return this._visited;
    }

    getCellDiv() {
        return document.querySelector(`.cell[data-row="${this.row}"][data-col="${this.col}"]`);
    }

    isSameSet(cell) {
        return this.set === cell.set;
    }

    union(cell) {
        const newSet = new Set([...this.set, ...cell.set]);
        for (let cell of newSet) {
            cell.set = newSet;
        }
    }
}