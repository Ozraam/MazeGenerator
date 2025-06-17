import { MazeManager } from "../mazeManager.js";

/**
 * Generates a maze using Wilson's algorithm.
 * Creates an unbiased maze by performing loop-erased random walks from unvisited cells
 * to the existing maze. Like Aldous-Broder, it guarantees uniform distribution but is
 * generally faster. The algorithm performs random walks and erases loops when they occur.
 * 
 * @param {MazeManager} mazeManager - The maze manager instance to generate the maze on
 * @param {number} [startRow=0] - Starting row position (algorithm chooses random start)
 * @param {number} [startCol=0] - Starting column position (algorithm chooses random start)
 * @param {number} [sleepTime=5] - Delay in milliseconds between each step for visualization
 * @param {Function} [logger=console.log] - Logging function for progress updates
 * @async
 */
export async function WilsonGenerator(mazeManager, startRow = 0, startCol = 0, sleepTime = 5, logger = console.log) {
    document.querySelector('.maze').style.setProperty('--current-transition-duration', `0s`);
    const startTotalTime = Date.now();

    const totalCells = mazeManager.rows * mazeManager.cols;
    let visitedCount = 0;

    // Initialize all cells as unvisited
    mazeManager.cells.forEach(row => row.forEach(cell => cell.visited = false));

    // Start with a random cell
    const startCell = mazeManager.getRandomUnvisitedCell();
    startCell.visited = true;
    visitedCount++;
    logger('Starting Wilson\'s Algorithm', `visited: ${visitedCount} / ${totalCells}`, `finished: ${(visitedCount / totalCells * 100).toFixed(2)}%`);

    while (visitedCount < totalCells) {
        const startRandomRow = Math.floor(Math.random() * mazeManager.rows);
        const startRandomCol = Math.floor(Math.random() * mazeManager.cols);
        const startCell = mazeManager.getCell(startRandomRow, startRandomCol);

        if (startCell.visited) continue;

        const path = [startCell];
        startCell.getCellDiv().classList.add('path');

        while (path[path.length - 1].visited === false) {
            path[path.length - 1].getCellDiv().classList.remove('current');
            const nextCell = mazeManager.getRandomNeighbor(path[path.length - 1], [path[path.length - 2]]); // Get a random neighbor excluding the previous cell
            if (!nextCell.visited) {
                if (path.includes(nextCell)) {
                    const loopIndex = path.indexOf(nextCell);
                    path.splice(loopIndex, path.length - loopIndex).map(c => c.getCellDiv().classList.remove("path")); // Remove the path after the loop
                }


                nextCell.getCellDiv().classList.add('current');
                nextCell.getCellDiv().classList.add('path');
                path.push(nextCell);
            } else {
                // If we reach a visited cell, we can break the loop
                path.push(nextCell);
                break;
            }
            if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
        }

        // Mark the path cells as visited
        path.forEach(cell => {
            if (!cell.visited) {
                cell.visited = true;
                visitedCount++;
            }
            cell.getCellDiv().classList.remove('path', 'current');
            cell.getCellDiv().classList.add('dead-end');
        });

        // Remove walls along the path
        for (let i = 0; i < path.length - 1; i++) {
            mazeManager.removeWalls(path[i], path[i + 1]);
        }

        logger('On Going...', `visited: ${visitedCount} / ${totalCells}`, `finished: ${(visitedCount / totalCells * 100).toFixed(2)}%`);
    }

    const endTotalTime = Date.now();
    const elapsedTotalTime = endTotalTime - startTotalTime;

    logger('Done !',
        `visited: ${visitedCount} / ${totalCells}`,
        `finished: ${(visitedCount / totalCells * 100).toFixed(2)}%`,
        `time remaining: 0s`,
        `total time: ${Math.floor(elapsedTotalTime / 1000)}s and ${elapsedTotalTime % 1000}ms`
    );
    
    mazeManager.cells.forEach(row => row.forEach(cell => cell.getCellDiv().classList.add('dead-end')));
}