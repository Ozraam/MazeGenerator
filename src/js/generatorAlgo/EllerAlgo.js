import { MazeManager } from "../mazeManager.js";

/**
 * 
 * @param {MazeManager} mazeManager 
 * @param {number} startRow 
 * @param {number} startCol 
 * @param {number} sleepTime 
 * @param {(...String) -> void} logger 
 */
export async function EllerGenerator(mazeManager, startRow = 0, startCol = 0, sleepTime = 5, logger = console.log) {
    document.querySelector('.maze').style.setProperty('--current-transition-duration', `0s`);
    const startTotalTime = Date.now();

    const sets = [];
    let visitedCount = 0;
    let totalCells = mazeManager.rows * mazeManager.cols;

    const numberOfRows = mazeManager.rows;


    for (let col = 0; col < mazeManager.cols; col++) {
        const cell = mazeManager.getCell(0, col);
        sets.push(col);
    }

    for (let row = 0; row < numberOfRows - 1; row++) {
        // Merge sets in the current row
        for (let col = 0; col < mazeManager.cols - 1; col++) {
            const currentCell = mazeManager.getCell(row, col);
            currentCell.getCellDiv().classList.add('current');
            if (sets[col] !== sets[col + 1] && Math.random() < 0.5) {
                mazeManager.removeWalls(mazeManager.getCell(row, col), mazeManager.getCell(row, col + 1));
                const oldSet = sets[col + 1];
                const newSet = sets[col];
                for (let i = 0; i < sets.length; i++) {
                    if (sets[i] === oldSet) {
                        sets[i] = newSet;
                    }
                }
            }
            if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
            currentCell.getCellDiv().classList.remove('current');
        }

        
        // store the indexes of all the cell in each set
        let indexesOfCellSets  = sets.reduce((acc, set, index) => {
            if (!acc[set]) acc[set] = [];
            acc[set].push(index);
            return acc;
        }, {});
        
        const downConnections = [];
        // Create down connections by randomly choosing at least one cell from each set
        for (let set in indexesOfCellSets) {
            const indexes = indexesOfCellSets[set];
            if (indexes.length > 0) {
                let numberOfDownConnections =  1; // At least one connection
                while (numberOfDownConnections > 0) {
                    const randomIndex = Math.floor(Math.random() * indexes.length);
                    const col = indexes[randomIndex];
                    if (!downConnections.includes(col)) {
                        downConnections.push(col);
                        numberOfDownConnections--;
                    }
                }
            }
        }
        
        // get the biggest set number to use it for the next row
        let lastSet = Math.max(...sets);
        let newSets = [];


        // Create new sets for the next row
        for (let col = 0; col < mazeManager.cols; col++) {
            const currentCell = mazeManager.getCell(row + 1, col);
            if (downConnections.includes(col)) {
                // If the cell is in a set that has a down connection, it belongs to the same set
                mazeManager.removeWalls(currentCell, mazeManager.getCell(row, col));
                newSets.push(sets[col]);
                if (col > 0 && sets[col] === sets[col - 1]) {
                    mazeManager.removeWalls(mazeManager.getCell(row + 1, col - 1), currentCell);
                }
            } else {
                // Otherwise, create a new set
                lastSet++;
                newSets.push(lastSet);
            }

        }

        // Update the sets for the next row
        sets.length = 0; // Clear the old sets
        for (let i = 0; i < newSets.length; i++) {
            sets.push(newSets[i]);
        }
    }

    // Last row: connect all cells in the same set
    for (let col = 0; col < mazeManager.cols - 1; col++) {
        const currentCell = mazeManager.getCell(numberOfRows - 1, col);
        currentCell.getCellDiv().classList.add('current');
        if (sets[col] !== sets[col + 1] && Math.random() < 0.5) {
            mazeManager.removeWalls(mazeManager.getCell(numberOfRows - 1, col), mazeManager.getCell(numberOfRows - 1, col + 1));
            const oldSet = sets[col + 1];
            const newSet = sets[col];
            for (let i = 0; i < sets.length; i++) {
                if (sets[i] === oldSet) {
                    sets[i] = newSet;
                }
            }
        }
        if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
        currentCell.getCellDiv().classList.remove('current');
    }

    // Mark all cells as visited
    mazeManager.cells.forEach(row => row.forEach(cell => {
        cell.visited = true;
        cell.getCellDiv().classList.add('visited', 'dead-end');
        cell.getCellDiv().classList.remove('current', 'path');
        visitedCount++;
    }));

    const endTotalTime = Date.now();
    const elapsedTotalTime = endTotalTime - startTotalTime;

    logger('Done !',
        `visited: ${visitedCount} / ${totalCells}`,
        `finished: ${(visitedCount / totalCells * 100).toFixed(2)}%`,
        `time remaining: 0s`,
        `total time: ${Math.floor(elapsedTotalTime / 1000)}s and ${elapsedTotalTime % 1000}ms`
    );
}