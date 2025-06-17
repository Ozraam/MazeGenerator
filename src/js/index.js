/**
 * Main application entry point for the maze generator.
 * Handles user interface interactions and coordinates maze generation algorithms.
 */

import { MazeManager } from './mazeManager.js';
import { depthFirstGenerator } from './generatorAlgo/depthFirstAlgo.js';
import { kruskalGenerator } from './generatorAlgo/kruskalAlgo.js';
import { aldousBroderGenerator } from './generatorAlgo/AldousBroderAlgo.js';
import { WilsonGenerator } from './generatorAlgo/WilsonAlgo.js';
import { EllerGenerator } from './generatorAlgo/EllerAlgo.js';
import { logToStatus } from './logger.js';

/** @type {HTMLElement} - The DOM element that contains the maze visualization */
const mazeDiv = document.querySelector('.maze');

/** @type {Function[]} - Array of available maze generation algorithms */
const genAlgorithm = [
    depthFirstGenerator,
    kruskalGenerator,
    aldousBroderGenerator,
    WilsonGenerator,
    EllerGenerator
]

/** @type {boolean} - Flag to prevent multiple simultaneous maze generations */
let isGenerating = false;

// Calculate initial maze dimensions based on viewport size
const mazeWidth = document.querySelector(".board_section").offsetWidth;
const mazeHeight = window.innerHeight;

const col = Math.floor(mazeWidth / 50);
const row = Math.floor(mazeHeight / 50);

/** @type {MazeManager} - The main maze manager instance */
let mazeManager = new MazeManager(row, col);

// Initial maze drawing and generation
mazeManager.draw(mazeDiv);
generateMaze();

// Event listener for cell size changes
document.querySelector('#cell_size').addEventListener('change', (e) => {
    if (isGenerating) {
        e.preventDefault();
        return;
    }
    const cellSize = e.target.value;
    const mazeWidth = document.querySelector(".board_section").offsetWidth;
    const mazeHeight = window.innerHeight;
    console.log(mazeWidth, mazeHeight);
    const col = Math.floor(mazeWidth / cellSize);
    const row = Math.floor(mazeHeight / cellSize);
    
    mazeDiv.style.setProperty('--cell-size', `${cellSize}px`);
    
    mazeManager = new MazeManager(row, col);
    mazeManager.draw(mazeDiv);
});

// Event listener for manual maze generation trigger
document.querySelector('#generate').addEventListener('click', async () => {
    generateMaze();
});

/**
 * Toggles the disabled state of all input elements and buttons.
 * Used to prevent user interaction during maze generation.
 */
function toogleInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.disabled = !input.disabled);

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = !button.disabled);
}

/**
 * Generates a new maze using the selected algorithm.
 * Resets the current maze, disables UI controls during generation,
 * and runs the selected generation algorithm.
 * @async
 */
async function generateMaze() {
    if (isGenerating) return;

    const algoNumber = document.querySelector('#algo_gen_choice').value;

    console.log('generate');
    mazeManager.reset();
    mazeManager.draw(mazeDiv);
    isGenerating = true;
    toogleInputs();
    await genAlgorithm[algoNumber](mazeManager, 0, 0, document.querySelector('#sleepTime').value, logToStatus);
    toogleInputs();
    isGenerating = false;
}