const ludus = require('./ludus');

// TEMPORARY FOR TESTING IGNORE PLS

let newGame = new ludus.game();
newGame.showBoard();

newGame.makeMove('B2', 'B4')
newGame.showBoard();

newGame.makeMove('G8', 'F6')

newGame.showBoard();
// Congratulations, you played yourself.
