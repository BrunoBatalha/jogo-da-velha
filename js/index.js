window.onload = () => {
    const SYMBOL_X = 'x';
    const SYMBOL_O = 'o';
    const MODE_VS_IA = 'VS IA';
    const MODE_VS_PLAYER = 'VS JOGADOR';
    let gameMode = sessionStorage.getItem('mode') || MODE_VS_PLAYER;
    let someoneWin = false;
    let draw = false;
    let areasWins = [];
    const btnVs1 = document.getElementById('1vs1');
    const btnVsIA = document.getElementById('1vsIA');
    const btnVoltar = document.getElementById('voltar')
    const btnMenu = document.getElementById('menu');
    const btnNewGame = document.getElementById('new-game');
    const title = document.getElementById('title');
    const scoreX = document.querySelectorAll('.score-X')
    const scoreO = document.querySelectorAll('.score-O')
    const areaGame = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
    const waysToWin =
        [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            0, 3, 6,
            1, 4, 7,
            2, 5, 8,
            0, 4, 8,
            2, 4, 6,
        ];
    const buttons = document.querySelectorAll('.btn-area');

    sessionStorage.setItem('mode', gameMode);
    sessionStorage.setItem('play', 'p1');
    sessionStorage.setItem('scoreX', 0);
    sessionStorage.setItem('scoreO', 0);

    newGame();

    btnMenu.addEventListener('click', e => {
        const modal = document.querySelector('.modal');
        modal.classList.add('d-flex');
        modal.classList.remove('d-none');
    });

    btnVoltar.addEventListener('click', e => {
        const modal = document.querySelector('.modal');
        modal.classList.add('d-none');
        modal.classList.remove('d-flex');
    });

    btnNewGame.addEventListener('click', newGame);

    btnVs1.addEventListener('click', e => changeModeGame(MODE_VS_PLAYER));
    btnVsIA.addEventListener('click', e => changeModeGame(MODE_VS_IA));

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', e => eventClick(e, index));

        btn.addEventListener('mouseover', mouseOver);

        btn.addEventListener('mouseout', mouseOut);
    });

    function eventClick(e, index) {
        let playerCanPlay = false;
        if (gameMode === MODE_VS_IA) {
            if (getTurnPlay() === 'p1') {
                playerCanPlay = true;
            }
        } else {
            playerCanPlay = true
        }
        if (playerCanPlay && areaGame[index] === -1) {
            click(e);
            listenerPlays(index);
            listenerStateGame();
        }

    }

    setInterval(() => {
        if (gameMode === MODE_VS_IA && getTurnPlay() === 'p2') {
            const indexPlayed = playIA();
            const btn = { target: buttons[indexPlayed] }
            click(btn)
            listenerPlays(indexPlayed);
            listenerStateGame();
        }
    }, 500);

    function click({ target: button }) {
        //if (isFill(button)) {
        button.classList.remove('normal-font', 'increase-font');
        button.classList.add('btn-selected');
        button.innerHTML = getTurnPlay() === 'p1' ? 'X' : 'O';
        //}
    }

    function mouseOver({ target: button }) {
        if (button.innerHTML === '') {
            effectFontSize(button);
            button.innerHTML = getSymbolTurnCurrent();
        }
    }

    function mouseOut({ target: button }) {
        if (isFill(button)) {
            effectFontSize(button);
            button.innerHTML = button.innerHTML !== '' ? '' : button.innerHTML
        }
    }

    function toggleTurn() {
        setTurnPlay(getTurnPlay() == 'p1' ? 'p2' : 'p1');
    }

    function isFill(button) {
        return button.innerHTML === '' ||
            button.innerHTML === SYMBOL_X ||
            button.innerHTML === SYMBOL_O;
    }

    function effectFontSize(button) {
        button.classList.toggle('normal-font');
        button.classList.toggle('increase-font');
    }

    function getSymbolTurnCurrent() {
        return getTurnPlay() === 'p1' ? SYMBOL_X : SYMBOL_O
    }

    function getTurnPlay() {
        return sessionStorage.getItem('play');
    }

    function setTurnPlay(newTurn) {
        sessionStorage.setItem('play', newTurn);
    }



    function changeColorButtons() {
        areasWins.forEach(e => {
            buttons[e].style.color = '#ff9419';
        });
    }

    function newGame() {
        title.innerHTML = 'partida em andamento, ' + gameMode;
        buttons.forEach(btn => {
            btn.innerHTML = '';
            btn.classList.remove('btn-selected');
        });
        buttons.forEach(e => {
            e.removeAttribute('disabled');
            e.style.color = '#fff';
        });
        btnNewGame.setAttribute('disabled', 'disabled');
        title.classList.remove('blink')
        scoreO.forEach(e => e.classList.remove('blink'));
        scoreX.forEach(e => e.classList.remove('blink'));

        for (let i = 0; i < areaGame.length; i++)areaGame[i] = -1;
        someoneWin = false;
        draw = false
        areasWins = [];
        if ((Math.round(Math.random() * 2) + 1) == 1) toggleTurn();
    }

    function listenerPlays(index) {
        let sequence = 0;
        areaGame[index] = getSymbolTurnCurrent();
        for (let i = 0; i < waysToWin.length; i++) {
            if (i % 3 === 0) {
                sequence = 0;
                areasWins = [];
            }
            const symbol = areaGame[waysToWin[i]];
            if (symbol === getSymbolTurnCurrent()) {
                sequence += 1;
                areasWins.push(waysToWin[i]);
            }
            if (sequence >= 3) {
                someoneWin = true;
                return;
            }
        }
        const empty = areaGame.filter(e => e === -1);
        if (empty.length === 0) draw = true;

    }

    function listenerStateGame() {
        if (someoneWin) {
            changeColorButtons();
            finishWithWinner();
        } else if (draw) finishWithDraw();
        else toggleTurn();
    }

    function playIA() {
        const symbol = getTurnPlay() === 'p1' ? 'X' : 'O';
        let played = false;
        let areaI;
        do {
            areaI = Math.round(Math.random() * 10);
            if (areaGame[areaI] === -1) {
                areaGame[areaI] = getSymbolTurnCurrent();
                buttons[areaI].innerHTML = symbol;
                played = true
            }
        } while (!played);
        return areaI;
    }


    function finishWithWinner() {
        const symbol = getSymbolTurnCurrent();
        title.innerHTML = 'parabéns <i>' + getSymbolTurnCurrent() + '</i>, você venceu!';
        title.classList.add('blink')
        buttons.forEach(e => e.setAttribute('disabled', 'disabled'));
        btnNewGame.removeAttribute('disabled');
        if (symbol === SYMBOL_X) {
            const newPoints = Number(sessionStorage.getItem('scoreX')) + 1
            sessionStorage.setItem('scoreX', newPoints);
            scoreX.forEach(e => {
                e.innerHTML = sessionStorage.getItem('scoreX');
                e.classList.add('blink');
            });
        } else if (symbol === SYMBOL_O) {
            const newPoints = Number(sessionStorage.getItem('scoreO')) + 1
            sessionStorage.setItem('scoreO', newPoints);
            scoreO.forEach(e => {
                e.innerHTML = sessionStorage.getItem('scoreO');
                e.classList.add('blink');
            });
        }
    }

    function finishWithDraw() {
        title.innerHTML = 'Empate...';
        buttons.forEach(e => e.setAttribute('disabled', 'disabled'));
        btnNewGame.removeAttribute('disabled');
    }



    function changeModeGame(newMode) {
        gameMode = newMode;
        sessionStorage.setItem('mode', gameMode);
        newGame();
    }

}