const cellContainer = document.querySelector('#cellContainer');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');
const grid3Btn = document.querySelector('#grid3');
const grid5Btn = document.querySelector('#grid5');

// Game state variables
let currentPlayer = 'X';
let running = false;
let options = [];
let boardSize = 3;
let winConditions = [];

// Grid section buttons
grid3Btn.addEventListener('click', () => initializeGame(3));
grid5Btn.addEventListener('click', () => initializeGame(5));
restartBtn.addEventListener('click', restartGame); 

function generateWinConditions(size) {  
    const conditions = [];  

    // Generate horizontal win conditions
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) { 
            row.push(i * size + j);
        }
        conditions.push(row);
    }

    // Generate vertical win conditions
    for (let i = 0; i < size; i++) {
        const col = [];
        for (let j = 0; j < size; j++) {
            col.push(j * size + i);
        }
        conditions.push(col);
    }

    // diagonal
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    conditions.push(diag1);
    conditions.push(diag2);

    return conditions;
}

function createBoard(size) {
    cellContainer.innerHTML = '';
    const totalCells = size * size;
    
    cellContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('cellIndex', i);
        cellContainer.appendChild(cell);
    }
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', cellClicked);
    });
}

function initializeGame(size) {
    boardSize = size;
    document.getElementById('gridSelection').style.display = 'none';
    winConditions = generateWinConditions(size);  
    options = Array(size * size).fill('');
    currentPlayer = 'X';
    running = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    restartBtn.style.display = 'block';
    createBoard(size);
}

function updateCell(cell, index) {  
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.setAttribute('data-player', currentPlayer);
}

function cellClicked() {
    const cellIndex = this.getAttribute('cellIndex');

    if (options[cellIndex] !== '' || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();  
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {  
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cells = condition.map(idx => options[idx]);

        if (cells.every(cell => cell === cells[0] && cell !== '')) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes('')) {
        statusText.textContent = 'Draw!';
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    document.getElementById('gridSelection').style.display = 'block';
    restartBtn.style.display = 'none';
    cellContainer.innerHTML = '';
    currentPlayer = 'X';
    options = [];
    running = false;
    statusText.textContent = '';
}