import { MazeManager } from "../mazeManager.js";

/**
 * Generates a maze using the Aldous-Broder algorithm.
 * Creates an unbiased maze by performing a random walk until all cells are visited.
 * The algorithm guarantees that every possible maze has an equal probability of being generated.
 * Can be slow for large mazes as it may revisit cells many times.
 * 
 * @param {MazeManager} mazeManager - The maze manager instance to generate the maze on
 * @param {number} [startRow=0] - Starting row position (algorithm chooses random start)
 * @param {number} [startCol=0] - Starting column position (algorithm chooses random start)
 * @param {number} [sleepTime=5] - Delay in milliseconds between each step for visualization
 * @param {Function} [logger=console.log] - Logging function for progress updates
 * @async
 */
export async function aldousBroderGenerator(mazeManager, startRow = 0, startCol = 0, sleepTime = 5, logger = console.log) {
    document.querySelector('.maze').style.setProperty('--current-transition-duration', `0s`);
    const startTotalTime = Date.now();

    const startRandomRow = Math.floor(Math.random() * mazeManager.rows);
    const startRandomCol = Math.floor(Math.random() * mazeManager.cols);

    const startCell = mazeManager.getCell(startRandomRow, startRandomCol);
    startCell.visited = true;
    let visitedCount = 1;
    let totalCells = mazeManager.rows * mazeManager.cols;
    let currentCell = startCell;
    currentCell.getCellDiv().classList.add('current');

    while (visitedCount < totalCells) {
        let nextCell = mazeManager.getRandomNeighbor(currentCell);
        currentCell.getCellDiv().classList.remove('current');
        nextCell.getCellDiv().classList.add('current');
        if (!nextCell.visited) {
            mazeManager.removeWalls(currentCell, nextCell);
            nextCell.visited = true;
            visitedCount++;
        }
        if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
        
        currentCell = nextCell;

        logger('On Going...', `visited: ${visitedCount} / ${totalCells}`, `finished: ${(visitedCount / totalCells * 100).toFixed(2)}%`);
    }
    currentCell.getCellDiv().classList.remove('current');
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