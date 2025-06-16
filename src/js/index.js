import { MazeManager } from './mazeManager.js';
import { depthFirstGenerator } from './generatorAlgo/depthFirstAlgo.js';
import { kruskalGenerator } from './generatorAlgo/kruskalAlgo.js';
import { aldousBroderGenerator } from './generatorAlgo/AldousBroderAlgo.js';
import { logToStatus } from './logger.js';

const mazeDiv = document.querySelector('.maze');

const genAlgorithm = [
    depthFirstGenerator,
    kruskalGenerator,
    aldousBroderGenerator
]


let isGenerating = false;

const mazeWidth = document.querySelector(".board_section").offsetWidth;
const mazeHeight = window.innerHeight;

const col = Math.floor(mazeWidth / 50);
const row = Math.floor(mazeHeight / 50);


let mazeManager = new MazeManager(row, col);

mazeManager.draw(mazeDiv);

generateMaze();

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

document.querySelector('#generate').addEventListener('click', async () => {
    generateMaze();
});

function toogleInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.disabled = !input.disabled);

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = !button.disabled);
}

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