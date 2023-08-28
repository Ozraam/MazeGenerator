import { MazeManager } from "../mazeManager.js";

/**
 * Generates a maze using the depth first algorithm
 * @param {MazeManager} mazeManager 
 */
export async function depthFirstGenerator(mazeManager, startRow = 0, startCol = 0, sleepTime = 5) {
    const stack = [];
    const startCell = mazeManager.getCell(startRow, startCol);
    startCell.visited = true;
    stack.push(startCell);
    while (stack.length > 0) {
        const currentCell = stack.pop();
        currentCell.getCellDiv().classList.add('current');
        const unvisitedNeighbors = mazeManager.getUnvisitedNeighbors(currentCell);
        if (unvisitedNeighbors.length > 0) {
            stack.push(currentCell);
            const randomNeighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
            mazeManager.removeWalls(currentCell, randomNeighbor);
            randomNeighbor.visited = true;
            stack.push(randomNeighbor);
        } else {
            currentCell.getCellDiv().classList.add('dead-end');
        }
        if (sleepTime > 0) await new Promise(resolve => setTimeout(resolve, sleepTime));
        currentCell.getCellDiv().classList.remove('current');
    }
}