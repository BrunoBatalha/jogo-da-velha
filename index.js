window.onload = () => {
    let someoneWin = false;
    let draw = false;
    let areasWins = [];
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

    sessionStorage.setItem('play', 'p1');
    sessionStorage.setItem('scoreX', 0);
    sessionStorage.setItem('scoreO', 0);

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', e => eventClick(e, index));

        btn.addEventListener('mouseover', mouseOver);

        btn.addEventListener('mouseout', mouseOut);
    });

    function eventClick(e, index) {
        click(e);
        listernerPlays(index);
        if (someoneWin) {
            changeColorButtons();
            finishWithWinner();
        } else if (draw) finishWithDraw();
        else toggleTurn();
    }

    function click({ target: button }) {
        if (isFill(button)) {
            button.classList.remove('normal-font', 'increase-font');
            button.classList.add('btn-selected');
            button.innerHTML = getTurnPlay() === 'p1' ? 'X' : 'O';
        }
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
            button.innerHTML === 'x' ||
            button.innerHTML === 'o';
    }

    function effectFontSize(button) {
        button.classList.toggle('normal-font');
        button.classList.toggle('increase-font');
    }

    function getSymbolTurnCurrent() {
        return getTurnPlay() === 'p1' ? 'x' : 'o'
    }

    function getTurnPlay() {
        return sessionStorage.getItem('play');
    }

    function setTurnPlay(newTurn) {
        sessionStorage.setItem('play', newTurn);
    }

    const btnNewGame = document.getElementById('new-game');

    btnNewGame.addEventListener('click', newGame);

    function changeColorButtons() {
        areasWins.forEach(e => {
            buttons[e].style.color = '#ff9419';
        });
    }

    function newGame() {
        title.innerHTML = 'partida em andamento';
        buttons.forEach(btn => {
            btn.innerHTML = '';
            btn.classList.remove('btn-selected');
        });
        buttons.forEach(e => {
            e.removeAttribute('disabled');
            e.style.color = '#fff';
        });

        title.classList.remove('blink')
        scoreO.forEach(e => e.classList.remove('blink'));
        scoreX.forEach(e => e.classList.remove('blink'));

        for (let i = 0; i < areaGame.length; i++)areaGame[i] = -1;
        someoneWin = false;
        draw = false
        areasWins = [];
    }

    function listernerPlays(index) {
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

    function finishWithWinner() {
        const symbol = getSymbolTurnCurrent();
        title.innerHTML = 'parabéns <i>' + getSymbolTurnCurrent() + '</i>, você venceu!';
        title.classList.add('blink')
        buttons.forEach(e => e.setAttribute('disabled', 'disabled'));

        if (symbol === 'x') {
            const newPoints = Number(sessionStorage.getItem('scoreX')) + 1
            sessionStorage.setItem('scoreX', newPoints);
            scoreX.forEach(e => {
                e.innerHTML = sessionStorage.getItem('scoreX');
                e.classList.add('blink');
            });
        } else if (symbol === 'o') {
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
    }

}