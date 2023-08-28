import { MazeManager } from './mazeManager.js';
import { depthFirstGenerator } from './generatorAlgo/depthFirstAlgo.js';

const mazeDiv = document.querySelector('.maze');

let sleepTime = 0;

let isGenerating = false;

const mazeWidth = document.querySelector(".board_section").offsetWidth;
const mazeHeight = window.innerHeight;

const col = Math.floor(mazeWidth / 50);
const row = Math.floor(mazeHeight / 50);


let mazeManager = new MazeManager(row, col);


mazeManager.draw(mazeDiv);

depthFirstGenerator(mazeManager, 0, 0, sleepTime);

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
    console.log('generate');
    mazeManager.draw(mazeDiv);
    isGenerating = true;
    await depthFirstGenerator(mazeManager, 0, 0, sleepTime);
    isGenerating = false;
});

document.querySelector('#sleepTime').addEventListener('input', (e) => {
    sleepTime = e.target.value;
});