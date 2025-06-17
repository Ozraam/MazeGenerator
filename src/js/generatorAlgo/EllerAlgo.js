import { MazeManager } from "../mazeManager.js";

/**
 * Optimized Eller's Algorithm for maze generation
 * @param {MazeManager} mazeManager 
 * @param {number} startRow 
 * @param {number} startCol 
 * @param {number} sleepTime 
 * @param {(...String) => void} logger 
 */
export async function EllerGenerator(mazeManager, startRow = 0, startCol = 0, sleepTime = 5, logger = console.log) {
    document.querySelector('.maze').style.setProperty('--current-transition-duration', `0s`);
    const startTotalTime = Date.now();    
    const numberOfRows = mazeManager.rows;
    const numberOfCols = mazeManager.cols;
    const totalCells = numberOfRows * numberOfCols;

    // Initialize sets for the first row
    let sets = Array.from({ length: numberOfCols }, (_, i) => i);
    let nextSetId = numberOfCols;

    let visitedCount = 0;

    for (let row = 0; row < numberOfRows - 1; row++) {
        // Phase 1: Randomly merge adjacent cells in current row
        for (let col = 0; col < numberOfCols - 1; col++) {
            const currentCell = mazeManager.getCell(row, col);
            if(sleepTime > 0) currentCell.getCellDiv().classList.add('current');
            
            if (sets[col] !== sets[col + 1] && Math.random() < 0.5) {
                mazeManager.removeWalls(currentCell, mazeManager.getCell(row, col + 1));
                
                // Optimized set merging: replace all occurrences in one pass
                const oldSet = sets[col + 1];
                const newSet = sets[col];
                for (let i = 0; i < numberOfCols; i++) {
                    if (sets[i] === oldSet) {
                        sets[i] = newSet;
                    }
                }
            }
            
        }
        visitedCount += numberOfCols;
        if (sleepTime > 0) {
            mazeManager.getCell(row, numberOfCols-1).getCellDiv().classList.add('current');
            await new Promise(resolve => setTimeout(resolve, sleepTime));
            // Remove 'current' class from all cells in the row
            for (let col = 0; col < numberOfCols; col++) {
                const cell = mazeManager.getCell(row, col);
                cell.getCellDiv().classList.remove('current');
                cell.getCellDiv().classList.add('visited', 'dead-end');
            }
            const endTime = Date.now();
            const elapsedTime = endTime - startTotalTime;
            const remainingTime = elapsedTime * (totalCells - visitedCount);
            logger('On Going...',
                `visited: ${visitedCount} / ${totalCells}`,
                `finished: ${(visitedCount / totalCells * 100).toFixed(2)}%`,
                `time remaining: ${Math.floor(remainingTime / 1000)}s`
            );
        }

        // Phase 2: Create vertical connections
        // Group cells by their set for efficient processing
        const setGroups = new Map();
        for (let col = 0; col < numberOfCols; col++) {
            const setId = sets[col];
            if (!setGroups.has(setId)) {
                setGroups.set(setId, []);
            }
            setGroups.get(setId).push(col);
        }

        const downConnections = new Set();
        
        // For each set, randomly choose at least one cell for vertical connection
        for (const [setId, columns] of setGroups) {
            // Ensure at least one connection per set
            const mandatoryConnection = columns[Math.floor(Math.random() * columns.length)];
            downConnections.add(mandatoryConnection);
            
            // Optionally add more connections (probability decreases with set size)
            for (const col of columns) {
                if (col !== mandatoryConnection && Math.random() < 0.3) {
                    downConnections.add(col);
                }
            }
        }

        // Phase 3: Create new row sets efficiently
        const newSets = new Array(numberOfCols);
        
        for (let col = 0; col < numberOfCols; col++) {
            const currentCell = mazeManager.getCell(row + 1, col);
            
            if (downConnections.has(col)) {
                // Maintain the same set
                mazeManager.removeWalls(currentCell, mazeManager.getCell(row, col));
                newSets[col] = sets[col];
            } else {
                // Create new set
                newSets[col] = nextSetId++;
            }
        }

        // Update sets for next iteration
        sets = newSets;
    }

    // Final row: Connect all disjoint sets
    const lastRow = numberOfRows - 1;
    for (let col = 0; col < numberOfCols - 1; col++) {
        const currentCell = mazeManager.getCell(lastRow, col);
        currentCell.getCellDiv().classList.add('current');
        
        if (sets[col] !== sets[col + 1]) {
            mazeManager.removeWalls(currentCell, mazeManager.getCell(lastRow, col + 1));
            
            // Merge sets
            const oldSet = sets[col + 1];
            const newSet = sets[col];
            for (let i = 0; i < numberOfCols; i++) {
                if (sets[i] === oldSet) {
                    sets[i] = newSet;
                }
            }
        }
        visitedCount++;
        if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
        currentCell.getCellDiv().classList.remove('current');
        currentCell.getCellDiv().classList.add('visited', 'dead-end');
    }
    visitedCount ++;
    // Mark the last cell as visited
    const lastCell = mazeManager.getCell(lastRow, numberOfCols - 1);
    lastCell.getCellDiv().classList.add('visited', 'dead-end');

    const endTotalTime = Date.now();
    const elapsedTotalTime = endTotalTime - startTotalTime;

    logger('Done !',
        `visited: ${visitedCount} / ${totalCells}`,
        `finished: ${(visitedCount / totalCells * 100).toFixed(2)}%`,
        `time remaining: 0s`,
        `total time: ${Math.floor(elapsedTotalTime / 1000)}s and ${elapsedTotalTime % 1000}ms`
    );
}