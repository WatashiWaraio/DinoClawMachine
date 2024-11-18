class GameState {
    constructor() {
        this.coins = 0;
        this.attempts = 0;
        this.score = 0;
        this.status = 'Esperando Moneda';
    }

    insertCoin() {
        if (this.coins === 0) {
            this.coins = 1;
            this.attempts = 3;
            this.status = 'Listo para Jugar';
            return true;
        }
        return false;
    }

    useAttempt() {
        if (this.attempts > 0) {
            this.attempts--;
            return true;
        }
        return false;
    }

    incrementScore() {
        this.score++;
    }

    resetGame() {
        this.coins = 0;
        this.attempts = 0;
        this.status = 'Esperando Moneda';
    }
}

class ClawMachine {
    constructor() {
        this.gridSize = 3;
        this.state = new GameState();
        this.clawPosition = { x: 1, y: 1 };
        
        this.initializeDOM();
        this.setupEventListeners();
    }

    initializeDOM() {
        this.grid = document.getElementById('gameGrid');
        this.outputZone = document.getElementById('outputZone');
        this.coinButton = document.getElementById('coinButton');
        this.machineStatus = document.getElementById('machineStatus');
        this.coinCount = document.getElementById('coinCount');
        this.attemptCount = document.getElementById('attemptCount');
        this.scoreCount = document.getElementById('scoreCount');

        this.createGrid();
        this.createClaw();
        this.updateDisplay();
    }

    createGrid() {
        this.grid.innerHTML = '';
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i;

            if (i === this.gridSize * this.gridSize - 1) {
                cell.classList.add('output-zone');
                cell.textContent = 'Salida';
            } else if (Math.random() > 0.6) {
                const plushie = document.createElement('div');
                plushie.classList.add('plushie');
                plushie.textContent = '🧸';
                cell.appendChild(plushie);
            }

            this.grid.appendChild(cell);
        }
    }

    createClaw() {
        const claw = document.createElement('div');
        claw.classList.add('claw');
        this.grid.querySelector(`[data-index="${this.clawPosition.y * this.gridSize + this.clawPosition.x}"]`).appendChild(claw);
    }

    setupEventListeners() {
        this.coinButton.addEventListener('click', () => this.insertCoin());
        
        document.addEventListener('keydown', (event) => {
            if (this.state.coins === 0) return;

            switch(event.key) {
                case 'w': this.moveClaw(0, -1); break;
                case 's': this.moveClaw(0, 1); break;
                case 'a': this.moveClaw(-1, 0); break;
                case 'd': this.moveClaw(1, 0); break;
                case ' ': this.grabPlushie(); break;
            }
        });
    }

    insertCoin() {
        if (this.state.insertCoin()) {
            this.updateDisplay();
            this.machineStatus.textContent = this.state.status;
            this.machineStatus.style.color = 'green';
        }
    }

    moveClaw(dx, dy) {
        const newX = Math.max(0, Math.min(this.gridSize - 1, this.clawPosition.x + dx));
        const newY = Math.max(0, Math.min(this.gridSize - 1, this.clawPosition.y + dy));

        const currentCell = this.grid.querySelector(`[data-index="${this.clawPosition.y * this.gridSize + this.clawPosition.x}"]`);
        const claw = currentCell.querySelector('.claw');
        currentCell.removeChild(claw);

        this.clawPosition = { x: newX, y: newY };
        const newCell = this.grid.querySelector(`[data-index="${this.clawPosition.y * this.gridSize + this.clawPosition.x}"]`);
        newCell.appendChild(claw);
    }

    grabPlushie() {
        if (!this.state.useAttempt()) return;

        const currentCell = this.grid.querySelector(`[data-index="${this.clawPosition.y * this.gridSize + this.clawPosition.x}"]`);
        const plushie = currentCell.querySelector('.plushie');

        if (plushie && Math.random() > 0.5) {
            currentCell.removeChild(plushie);
            this.state.incrementScore();
            
            // Move plushie to output zone
            this.outputZone.appendChild(plushie);
        }

        this.updateDisplay();

        if (this.state.attempts === 0) {
            this.state.resetGame();
            this.machineStatus.textContent = this.state.status;
            this.machineStatus.style.color = 'red';
        }
    }

    updateDisplay() {
        this.coinCount.textContent = this.state.coins;
        this.attemptCount.textContent = this.state.attempts;
        this.scoreCount.textContent = this.state.score;
        this.machineStatus.textContent = this.state.status;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ClawMachine();
});