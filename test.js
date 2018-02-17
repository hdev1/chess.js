const ludus = require('./ludus');

// TEMPORARY FOR TESTING IGNORE PLS

const DEFAULT_BOARD_STATE = [
	'-', '-', '-', 'p', '-', '-', '-', '-',
	'-', '-', '-', '-', 'p', '-', '', '-',
	'-', '-', '-', '-', '-', 'P', '-', '-',
	'-', '-', '-', '-', '-', '-', '-', '-',
	'-', '-', '-', '-', '-', '-', '-', 'p',
	'-', '-', '-', '-', '-', '-', '-', '-',
	'-', '-', '-', '-', '-', '-', 'P', '-',
	'-', '-', '-', 'R', '-', '-', '-', '-'
];

const DEFAULT_GAME_STATE = {
	board: DEFAULT_BOARD_STATE,
	turn: 'w',
	fullMoves: 0,
	halfMoves: 0
}

let newGame = new ludus.game(DEFAULT_GAME_STATE);

newGame.showBoard();
// newGame.makeMove('C2', 'D3');
newGame.makeMove('D1', 'D8');
newGame.showBoard();
newGame.makeMove('E7', 'F6');
newGame.showBoard();
newGame.makeMove('G2', 'G4');
newGame.showBoard();
newGame.makeMove('H4', 'G3');
newGame.showBoard();