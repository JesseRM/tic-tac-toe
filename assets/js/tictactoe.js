let liveBoard;
let game = {
    human: "X",
    aiPlayer: "O",
    difficulty: "easy",
    gameOver: true
};
const cells = document.querySelectorAll(".cell");
const startBtn = document.querySelector("#start");
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startBtn.addEventListener("click", start);

function start() {
    game.gameOver = false;
    liveBoard = Array.from(Array(9).keys());
    clearBoard();
    setOptions();
    startEventListeners();
}

function hover(square) {
    if (game.gameOver === false) {
        if (square.textContent === "" && typeof liveBoard[square.id] === 'number') {
            square.textContent = game.human;
            square.classList.add("hover");
        }
    }
}

function removeHover(square){
    if (game.gameOver === false) {
        if (square.classList.contains("hover") && typeof liveBoard[square.id] === 'number') {
            square.classList.remove("hover");
            square.textContent = "";
        }
    }
}

function checkSquare(square) {
    if (game.gameOver === false) {
        if (typeof liveBoard[square.id] === 'number') {
            turn(square, game.human);
            if (game.gameOver === false) {
                if (game.difficulty === "easy") {
                    turn(randomSquare(), game.aiPlayer);
                } else if (game.difficulty === "hard") {
                    turn(bestSpot(), game.aiPlayer);
                }
            }
        }
    }
}

function clearBoard() {
    cells.forEach((item) => {
        item.classList.remove("win", "tie", "lose");
        item.textContent = "";
    });
}

function turn(square, player) {
    liveBoard[square.id] = player;
        square.textContent = player;
        if (square.classList.contains("hover")) {
            square.classList.remove("hover");
        }
        let win = checkWin(liveBoard, player);
        if (win) {
            gameOver(win, player);
        } else if (checkTie()) {
            game.gameOver = true;
            displayTie();
        }
}

function displayTie() {
    cells.forEach(item => {
        item.classList.add("tie");
    });
}

function gameOver(winSquares, player) {
    game.gameOver = true;
    if (player === game.human) {
        for (let index of winCombos[winSquares.index]) {
            cells[index].classList.add("win");
        }
    } else {
        for (let index of winCombos[winSquares.index]) {
            cells[index].classList.add("lose");
        }
    }
}

function checkTie() {
    if (emptySquares(liveBoard).length === 0) {
        return true;
    } else {
        return false;
    }
}

function startEventListeners() {
    cells.forEach((item) => {
        item.addEventListener("mouseenter", function() {
            hover(item);
        });
        item.addEventListener("mouseleave", function() {
            removeHover(item);
        });
        item.addEventListener("click", function() {
            checkSquare(item);
        });
    });
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i): a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function emptySquares(board) {
    return board.filter(square => typeof square === 'number');
}

function setOptions() {
    if (document.querySelector("#x").checked) {
        game.human = "X";
        game.aiPlayer = "O";
    } else {
        game.human = "O";
        game.aiPlayer = "X";
    }

    if (document.querySelector("#easy").checked) {
        game.difficulty = "easy";
    } else {
        game.difficulty = "hard";
    }
}

function randomSquare() {
    let empty = emptySquares(liveBoard);

    return cells[empty[Math.floor(Math.random() * empty.length)]];
}

function cloneBoard(board){
    return board.splice(0);
}

function minimax(tempBoard, player){
    let aSquares = emptySquares(tempBoard);

    if (checkWin(tempBoard, game.human)) {
        return {score: -10};
    } else if (checkWin(tempBoard, game.aiPlayer)) {
        return {score: 10};
    } else if (aSquares.length === 0) {
        return {score: 0};
    }

    let moves = [];

    for (let i = 0; i < aSquares.length; i++) {
        let move = {};

        move.index = tempBoard[aSquares[i]];
        tempBoard[aSquares[i]] = player;

        if (player == game.aiPlayer) {
            let result = minimax(tempBoard, game.human);
            move.score = result.score;
        } else {
            let result = minimax(tempBoard, game.aiPlayer);
            move.score = result.score;
        }
        tempBoard[aSquares[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === game.aiPlayer) {
        let bestScore = -100;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 100;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function bestSpot() {
    return cells[minimax(liveBoard, game.aiPlayer).index];
}