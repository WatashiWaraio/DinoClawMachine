class GameState {
    constructor() {
        this.coins = 0;
        this.attempts = 0;
        this.status = 'Esperando Moneda';
    }

    insertCoin() {
        if (this.coins === 0) {
            this.coins = 1;
            this.attempts = 3;
            this.status = 'Activo';
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
        this.clawX=265;
        this.clawY=230;
        this.images=["'peluche1.png'","'peluche2.png'","'peluche3.png'"]
        this.initializeDOM();
        this.setupEventListeners();
    }

    initializeDOM() {
        this.grid = document.getElementById('gameGrid');
        this.outputZone = document.getElementById('outputZone');
        this.coinButton = document.getElementById('coinButton');
        this.machineStatus = document.getElementById('machineStatus');
        this.attemptCount = document.getElementById('attemptCount');
        document.getElementById('garra').textContent="x";
        this.createGrid();
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
            } else if (Math.random() > 0.3) {
                const plushie = document.createElement('div');
                const n=Math.floor(Math.random()*3);
                plushie.setAttribute("n",n);
                plushie.classList.add('plushie');
                plushie.style.backgroundImage="url("+this.images[n]+")";
                cell.appendChild(plushie);
            }

            this.grid.appendChild(cell);
        }
        console.log(this.grid.style.top)
    }
    

    setupEventListeners() {
        this.coinButton.addEventListener('click', () => this.insertCoin());
        
        document.addEventListener('keypress', (event) => {
            if (this.state.coins === 0) return;
            switch(event.key) {
                case 'w': this.moveClaw(0, -1); break;
                case 's': this.moveClaw(0, 1); break;
                case 'a': this.moveClaw(-1, 0); break;
                case 'd': this.moveClaw(1, 0); break;
                case 'k': this.grabPlushie(); break;
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
        const garra =document.getElementById("garra");
        this.clawY += dy;
        garra.style.top =this.clawY+"px";
        this.clawX += dx;
        garra.style.left =this.clawX+"px";
        if(this.clawY<-30){
            this.clawY =-30;
            garra.style.top ="-30px";
        }else if(this.clawY>273){
            this.clawY =273;
            garra.style.top ="273px";
        }
        if(this.clawX<0){
            this.clawX =0;
            garra.style.left ="0px";
        }else if(this.clawX>304){
            this.clawX =304;
            garra.style.left ="304px";
        }
    }

    grabPlushie() {
        if (!this.state.useAttempt()) return;

        const currentCell = this.grid.querySelector(`[data-index="${parseInt(this.clawY/110) * this.gridSize + parseInt(this.clawX/115)}"]`);
        const plushie = currentCell.querySelector('.plushie');

        if (plushie&&(
                (plushie.getAttribute("n")==0 && this.clawX%115>25 && this.clawX%115<35 && this.clawY%110>16 && this.clawY%110<26)||
                (plushie.getAttribute("n")==1 && this.clawX%115>22 && this.clawX%115<32 && this.clawY%110>16 && this.clawY%110<26)||
                (plushie.getAttribute("n")==2 && this.clawX%115>27 && this.clawX%115<37 && this.clawY%110>2 && this.clawY%110<12)
            )) {
            currentCell.removeChild(plushie);
            const garra =document.getElementById("garra");
            garra.style.backgroundImage="url("+this.images[plushie.getAttribute("n")]+")";
            this.state.status="peluche agarrado";
            this.clawX=265;
            this.clawY=230;
            garra.style.transition="all 0.5s ease";
            garra.style.left ="265px";
            garra.style.top ="230px";
            setTimeout(() => (garra.style.transition="all 0s ease",garra.style.backgroundImage=null,this.state.resetGame(),this.updateDisplay(),this.machineStatus.style.color = 'red'), 1000);
        }

        this.updateDisplay();

        if (this.state.attempts === 0) {
            this.state.resetGame();
            this.clawX=265;
            this.clawY=230;
            garra.style.left ="265px";
            garra.style.top ="230px";
            this.machineStatus.textContent = this.state.status;
            this.machineStatus.style.color = 'red';
        }
    }

    updateDisplay() {
        this.attemptCount.textContent = this.state.attempts;
        this.machineStatus.textContent = this.state.status;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ClawMachine();
});
