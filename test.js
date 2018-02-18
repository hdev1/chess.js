const ludus = require('./ludus');

// TEMPORARY FOR TESTING IGNORE PLS

let newGame = new ludus.game();
newGame.showBoard();

// newGame.makeMove('A3', 'H3')
console.log(newGame.getAllMoves('w'));
newGame.showBoard();

// Congratulations, you played yourself.
