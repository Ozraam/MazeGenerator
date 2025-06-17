import { MazeManager } from "../mazeManager.js";

/**
 * Generates a maze using the depth-first search algorithm.
 * Uses a stack-based approach to create a maze with a single solution path.
 * The algorithm creates long, winding corridors with fewer dead ends.
 * 
 * @param {MazeManager} mazeManager - The maze manager instance to generate the maze on
 * @param {number} [startRow=0] - Starting row position for maze generation
 * @param {number} [startCol=0] - Starting column position for maze generation
 * @param {number} [sleepTime=5] - Delay in milliseconds between each step for visualization
 * @param {Function} [logger=console.log] - Logging function for progress updates
 * @async
 */
export async function depthFirstGenerator(mazeManager, startRow = 0, startCol = 0, sleepTime = 5, logger = console.log) {
    document.querySelector('.maze').style.setProperty('--current-transition-duration', `0.1s`);
    const startTotalTime = Date.now();
    
    const stack = [];
    const startCell = mazeManager.getCell(startRow, startCol);
    startCell.visited = true;
    stack.push(startCell);

    let visitedCount = 1;
    let deadEndCount = 0;
    let totalCells = mazeManager.rows * mazeManager.cols;

    while (stack.length > 0) {
        const startTime = Date.now();
        const currentCell = stack.pop();
        currentCell.getCellDiv().classList.add('current');
        const unvisitedNeighbors = mazeManager.getUnvisitedNeighbors(currentCell);
        if (unvisitedNeighbors.length > 0) {
            stack.push(currentCell);
            const randomNeighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
            mazeManager.removeWalls(currentCell, randomNeighbor);
            stack.push(randomNeighbor);
            visitedCount++;
            if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
            randomNeighbor.visited = true;
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            const remainingTime = elapsedTime * (totalCells - visitedCount);

            logger('On Going...', `visited: ${visitedCount} / ${totalCells}`, `finished: ${(deadEndCount / totalCells * 100).toFixed(2)}%`, `dead-ends: ${deadEndCount}`, `time remaining: ${Math.floor(remainingTime / 1000)}s`);
        } else {
            currentCell.getCellDiv().classList.add('dead-end');
            deadEndCount++;
        }

        currentCell.getCellDiv().classList.remove('current');
    }

    const endTotalTime = Date.now();
    const elapsedTotalTime = endTotalTime - startTotalTime;

    logger('Done !',
        `visited: ${visitedCount} / ${totalCells}`,
        `finished: ${(deadEndCount / totalCells * 100).toFixed(2)}%`,
        `dead-ends: ${deadEndCount}`,
        `time remaining: 0s`,
        `total time: ${Math.floor(elapsedTotalTime / 1000)}s and ${elapsedTotalTime % 1000}ms`
    );
}