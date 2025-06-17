import { MazeManager } from "../mazeManager.js";

/**
 * Generates a maze using Kruskal's algorithm.
 * Creates a minimum spanning tree by randomly selecting walls and removing them
 * if they connect different components. Results in a maze with many short dead ends
 * and a more uniform distribution of passages.
 * 
 * @param {MazeManager} mazeManager - The maze manager instance to generate the maze on
 * @param {number} [_startRow=0] - Starting row position (unused in this algorithm)
 * @param {number} [_startCol=0] - Starting column position (unused in this algorithm)
 * @param {number} [sleepTime=5] - Delay in milliseconds between each step for visualization
 * @param {Function} [logger=console.log] - Logging function for progress updates
 * @async
 */
export async function kruskalGenerator(mazeManager, _startRow = 0, _startCol = 0, sleepTime = 5, logger = console.log) {

    document.querySelector('.maze').style.setProperty('--current-transition-duration', `0s`);
    const startTotalTime = Date.now();

    const walls = [];
    const cells = [];
    const totalCells = mazeManager.rows * mazeManager.cols;
    const startTime = Date.now();
    // Initialize all cells as their own set
    for (let i = 0; i < mazeManager.rows; i++) {
        for (let j = 0; j < mazeManager.cols; j++) {
            const cell = mazeManager.getCell(i, j);
            cell.getCellDiv().classList.add('current');
            cells.push(cell);
            if (i > 0) {
                const topWall = [cell, mazeManager.getCell(i - 1, j)];
                walls.push(topWall);
            }
            if (j < mazeManager.cols - 1) {
                const rightWall = [cell, mazeManager.getCell(i, j + 1)];
                walls.push(rightWall);
            }
            cell.getCellDiv().classList.remove('current');
        }
    }

    while (walls.length > 0) {
        const randomWallIndex = Math.floor(Math.random() * walls.length);
        const randomWall = walls[randomWallIndex];
        const [cell1, cell2] = randomWall;
        if (cell1.isSameSet(cell2)) {
            walls.splice(randomWallIndex, 1);
            continue;
        }
        cell1.getCellDiv().classList.add('current');
        cell2.getCellDiv().classList.add('current');
        mazeManager.removeWalls(cell1, cell2);
        cell1.union(cell2);
        walls.splice(randomWallIndex, 1);
        if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const remainingTime = elapsedTime * (totalCells - walls.length);

        cell1.getCellDiv().classList.remove('current');
        cell2.getCellDiv().classList.remove('current');

        logger('On Going...', `visited: ${totalCells - walls.length} / ${totalCells}`, `finished: ${(totalCells - walls.length) / totalCells * 100}%`, `time remaining: ${Math.floor(remainingTime / 1000)}s`);
    }

    const endTotalTime = Date.now();
    const elapsedTotalTime = endTotalTime - startTotalTime;

    logger('Done !',
        `visited: ${totalCells - walls.length} / ${totalCells}`,
        `finished: ${(totalCells - walls.length) / totalCells * 100}%`,
        `time remaining: 0s`,
        `total time: ${Math.floor(elapsedTotalTime / 1000)}s and ${elapsedTotalTime % 1000}ms`
    );

    mazeManager.cells.forEach(row => row.forEach(cell => cell.getCellDiv().classList.add('dead-end')));
}