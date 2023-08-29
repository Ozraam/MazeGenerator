import { MazeManager } from "../mazeManager.js";

/**
 * Generates a maze using the depth first algorithm
 * @param {MazeManager} mazeManager 
 */
export async function depthFirstGenerator(mazeManager, startRow = 0, startCol = 0, sleepTime = 5, logger = console.log) {
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
            randomNeighbor.visited = true;
            stack.push(randomNeighbor);
            visitedCount++;
            if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            const remainingTime = elapsedTime * (totalCells - visitedCount);

            logger(`visited: ${visitedCount} / ${totalCells}`, `finished: ${(deadEndCount / totalCells * 100).toFixed(2)}%`, `dead-ends: ${deadEndCount}`, `time remaining: ${Math.floor(remainingTime / 1000)}s`);
        } else {
            currentCell.getCellDiv().classList.add('dead-end');
            deadEndCount++;
        }
        
        currentCell.getCellDiv().classList.remove('current');
    }
}