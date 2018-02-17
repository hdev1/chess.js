// Note: SAN notation should be prefixed by s, array notation by a
// Note: all internal functions must use array position notation  to avoid confusion
// The game function should convert the input SAN into array position notation.

const MAX_MOVES = 50;

const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const EMPTY_SQUARE = '-';
const COLOR_BLACK = 'b';
const COLOR_WHITE = 'w';
const PIECE_PAWN = 'p';
const PIECE_ROOK = 'r';
const PIECE_KNIGHT = 'n';

// const DEFAULT_BOARD_STATE = [
// 	'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', // 0-7
// 	'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', // 8-15
// 	'-', '-', '-', '-', '-', '-', '-', '-', // 16-23
// 	'-', '-', '-', '-', '-', '-', '-', '-',  // 24-31
// 	'-', '-', '-', '-', '-', '-', '-', '-',  // 32-39
// 	'-', '-', '-', '-', '-', '-', '-', '-',  // 40-47
// 	'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', // 48-55
// 	'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R' // 56-63
// ];

const DEFAULT_BOARD_STATE = [
	'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', // 0-7
	'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', // 8-15
	'-', '-', '-', '-', '-', '-', '-', '-', // 16-23
	'-', '-', '-', '-', 'R', '-', '-', '-',  // 24-31
	'-', '-', '-', '-', '-', '-', '-', '-',  // 32-39
	'-', '-', '-', 'p', '-', '-', '-', '-',  // 40-47
	'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', // 48-55
	'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P' // 56-63
];

const DEFAULT_GAME_STATE = {
	board: DEFAULT_BOARD_STATE,
	turn: COLOR_WHITE,
	fullMoves: 0,
	halfMoves: 0
}

const MOVEMENT_MAP = {
  "p": [
    -8, -16, 8, 16, -9, -7, 9, 7
  ],
  "r": [
  	-1, -2, -3, -4, -5, -6, -7, 1, 2, 3, 4, 5, 6, 7, 8, 16, 24, 32, 40, 48, 56, -8, -16, -24, -32, -40, -48, -56
  ],
  "b": [
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 7],
    [1, -1],
    [2, -2],
    [3, -3],
    [4, -4],
    [5, -5],
    [6, -6],
    [7, -7],
    [-1, 1],
    [-2, 2],
    [-3, 3],
    [-4, 4],
    [-5, 5],
    [-6, 6],
    [-7, 7],
    [-1, -1],
    [-2, -2],
    [-3, -3],
    [-4, -4],
    [-5, -5],
    [-6, -6],
    [-7, -7]
  ],
  "q": [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [-1, 0],
    [-2, 0],
    [-3, 0],
    [-4, 0],
    [-5, 0],
    [-6, 0],
    [-7, 0],
    [0, -1],
    [0, -2],
    [0, -3],
    [0, -4],
    [0, -5],
    [0, -6],
    [0, -7],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 7],
    [1, -1],
    [2, -2],
    [3, -3],
    [4, -4],
    [5, -5],
    [6, -6],
    [7, -7],
    [-1, 1],
    [-2, 2],
    [-3, 3],
    [-4, 4],
    [-5, 5],
    [-6, 6],
    [-7, 7],
    [-1, -1],
    [-2, -2],
    [-3, -3],
    [-4, -4],
    [-5, -5],
    [-6, -6],
    [-7, -7]
  ],
  "k": [
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [0, -1]
  ],
  "n": [
    [1, 2],
    [-1, 2],
    [2, 1],
    [-2, 1]
    [1, -2],
    [-1, -2],
    [2, -1],
    [-2, -1]
  ]
}

const ERRORS = {
	OUT_OF_BOUNDS: 'OUT_OF_BOUNDS',
	EMPTY_SQUARE: 'EMPTY_SQUARE',
	IMPOSSIBLE_MOVE: 'IMPOSSIBLE_MOVE',
	WRONG_COLOR: 'WRONG_COLOR',
	FRIENDLY_FIRE: 'FRIENDLY_FIRE',
	PAWN_DIAGONAL_MOVE_ON_EMPTY_SQUARE: 'PAWN_DIAGONAL_MOVE_ON_EMPTY_SQUARE',
	PAWN_VERTICAL_CAPTURE: 'PAWN_VERTICAL_CAPTURE',
	PAWN_SECOND_DOUBLE_MOVE: 'PAWN_SECOND_DOUBLE_MOVE',
	PAWN_INVALID_ENPASSANT: 'PAWN_INVALID_ENPASSANT',
	PATH_BLOCKED: 'PATH_BLOCKED'
}

const validateMove = (gameState, aPositionFrom, aPositionTo) => {
	// Out of bounds check
	if (aPositionFrom < 0 || aPositionFrom > 64 || aPositionTo < 0 || aPositionTo > 64) return ERRORS.OUT_OF_BOUNDS;

	// Get start square (chess piece) and target
	let { board, turn } = gameState;
	let startSquare = board[aPositionFrom];
	let targetSquare = board[aPositionTo];

	// Are we actually moving something?
	if (startSquare == EMPTY_SQUARE) return ERRORS.EMPTY_SQUARE

	// Get color
	let startSquareColor = startSquare == startSquare.toUpperCase() ? COLOR_WHITE : COLOR_BLACK;

	// Is it this colors turn?
	if (turn !== startSquareColor) return ERRORS.WRONG_COLOR;

	// Get real piece name
	let startSquareName = startSquare.toLowerCase();

	// Get difference, check with movement map
	let moveDifference = aPositionTo - aPositionFrom;

	// Check movement map
	if (MOVEMENT_MAP[startSquareName].indexOf(moveDifference) < 0) {
		return ERRORS.IMPOSSIBLE_MOVE;
	}

	// Warning: really vague code ahead...
	// Get possible horizontal moves on same rank. Basically, the problem
	// with my one-dimensional array method is that one diagonal move is the same
	// as for example going 7 moves to the right. So, for each piece I have to specify
	// whether it should be locked into its rank.
	let possibleMovesInRank = [];
	let lockedRank = false;
	let fileFromIndex = aPositionFrom % 8;
	let fileToIndex = aPositionTo % 8;

	// To the left of our square
	for (i=0;i<8;i++) {
		if (fileFromIndex == i-1) break;
		possibleMovesInRank.push(i*-1);
	}

	// To the right of our square
	for (i=0;i<8;i++) {
		if (fileFromIndex + i == 8) break;
		possibleMovesInRank.push(i);
	}

	// Rooks can go 7 to the left or right, but not diagonally
	if (startSquareName == PIECE_ROOK) {
		lockedRank = true;
	}

	// Absolute move difference
	let sign = moveDifference > 0 ? 1 : -1;
	let absoluteMoveDifference = moveDifference*sign; // Always positive

	// If it's locked --> check if the move is possible in this rank
	if (lockedRank && possibleMovesInRank.indexOf(moveDifference) < 0 && absoluteMoveDifference % 8 !== 0 ) {
		return ERRORS.IMPOSSIBLE_MOVE;
	}
	// End of weird magicery

	// Pawn checks
	let pawnSign = gameState.turn === COLOR_WHITE ? -1 : 1;

	if (startSquareName == PIECE_PAWN) {
		// Check if the pawn is going the right direction. Unlike other pieces, the direction the pawn moves is dependant on its color
		if ((startSquareColor == COLOR_WHITE && moveDifference > 0) || (startSquareColor == COLOR_BLACK && moveDifference < 0)) {
			return ERRORS.IMPOSSIBLE_MOVE;
		}

		// Check if it's being moved diagonally on an empty square (enpassant)
		if ((moveDifference == 9*pawnSign || moveDifference == 7*pawnSign) && targetSquare == EMPTY_SQUARE) {
			// En-passant check
			let pawnEnpassantRankRange = startSquareColor == COLOR_WHITE ? [24, 31] : [31, 39];
			
			if ((aPositionFrom >= pawnEnpassantRankRange[0] && aPositionFrom <= pawnEnpassantRankRange[1])) {
				
				// Check if there's a pawn under/above target position depending on color
				let enpassantRelativePosition = startSquareColor == COLOR_WHITE ? 8 : -8; // Relative enpassant position
				let enpassantColor = startSquareColor == COLOR_WHITE ? COLOR_BLACK : COLOR_WHITE; // The color the enpassant piece should have
				let enpassantTargetSquare = board[(aPositionTo + enpassantRelativePosition)]; // Get the enpassant target
				let enpassantTargetSquareName = enpassantTargetSquare.toLowerCase();
				let enpassantTargetSquareColor = enpassantTargetSquare == enpassantTargetSquare.toUpperCase() ? COLOR_WHITE : COLOR_BLACK; // Get the color of the enpassant target
					
				// Valid enpassant?
				if (enpassantTargetSquareName !== PIECE_PAWN || enpassantTargetSquareColor !== enpassantColor) {
					return ERRORS.PAWN_INVALID_ENPASSANT;
				}
			} else {
				return ERRORS.PAWN_INVALID_ENPASSANT;
			}
		}

		// Check if pawn is trying to capture vertically
		if ((moveDifference == 8*pawnSign || moveDifference == 16*pawnSign) && targetSquare !== EMPTY_SQUARE) {
			return ERRORS.PAWN_VERTICAL_CAPTURE;
		}

		// Check if a double move is being made after the pawn has already been moved
		let pawnStartingRankRange = startSquareColor == COLOR_WHITE ? [48, 55] : [8, 15];
		if ((aPositionFrom < pawnStartingRankRange[0] || aPositionFrom > pawnStartingRankRange[1]) && (moveDifference == 16 || moveDifference == -16)) {
			return ERRORS.PAWN_SECOND_DOUBLE_MOVE;
		}
	}

	// Path check. MOVE OUT THE WAY
	if (startSquareName !== PIECE_KNIGHT) {
		if (startSquareName === PIECE_PAWN) {
			// The only time a pawn can be blocked is if it's moving two squares
			if (moveDifference == 16*pawnSign) {
				if (board[aPositionFrom+(8*pawnSign)] !== EMPTY_SQUARE) return ERRORS.PATH_BLOCKED;
			}
		} else {
			// Get direction
			let modifier = 0;

			if (absoluteMoveDifference % 8 == 0) {
				// Going up/down
				modifier = 8*sign;
			} else if (absoluteMoveDifference % 8 == 1 && moveDifference == 9) {
				// Going diagonal /
				modifier = 9*sign;
			} else if (absoluteMoveDifference % 8 == 7 && moveDifference == 7) {
				// Going diagonal \
				modifier = 7*sign;
			} else if (absoluteMoveDifference % 8 >= 1 && absoluteMoveDifference % 8 <= 7) {
				// Going left/right
				modifier = 1*sign;
			}

			// Check the Path
			for (i=1;i<8;i++) {
				let squareToCheck = aPositionFrom + (i * modifier); // Yes
				
				// Are we done?
				if (squareToCheck === aPositionTo) break;

				// Empty or not
				if (board[squareToCheck] !== EMPTY_SQUARE) {
					return ERRORS.PATH_BLOCKED;
				}

			}
		}
	}

	// Empty square? Checks are finished
	if (targetSquare == EMPTY_SQUARE) return true;

	// We know now it's not an empty square. More pawn checks:
	if (startSquareName == PIECE_PAWN && (moveDifference == 8 || moveDifference == 16)) {
		// The pawn can't go diagonally on an empty square
		return ERRORS.PAWN_VERTICAL_CAPTURE;
	}

	// Not empty? Get the target piece's color
	let targetSquareColor = targetSquare == targetSquare.toUpperCase() ? COLOR_WHITE : COLOR_BLACK;

	// Check if both colors match
	if (startSquareColor == targetSquareColor) return ERRORS.FRIENDLY_FIRE;

	return true;
}

const getArrayPositionFromSAN = (sPosition) => {
	// Get the current row, but invert the result because top left = 8 instead of 1.
	// After that, just add the rank index onto it.
	let fileIndex = FILES.indexOf(sPosition[0]);
	let rank = (8 * (8-sPosition[1]));
	return fileIndex + rank;
}

const getSANFromArrayPosition = (aPosition) => {
	if (aPosition < 0) return false;

	// Get rank
	let rank = Math.floor(aPosition/8);
	let fileIndex = aPosition % 8;
	let SAN = `${FILES[fileIndex]}${8-rank}`;
	return SAN;
}

// Debugging functions
function error(i) { console.log(`\n\x1b[31m\x1b[1mERROR:\x1b[0m ${i}`) }
function debug(i) { console.log(`\n\x1b[34m\x1b[1mDEBUG:\x1b[0m ${i}`) }
function todo(i) { console.log(`\n\x1b[32m\x1b[1mDEBUG:\x1b[0m ${i}`) }

function game(gameState) {
	// Set game state
	if (typeof gameState === 'undefined') gameState = DEFAULT_GAME_STATE;

	// Return game instance
	return {
		getGameState: function() {
			return gameState;
		},

		getMoves: function(aPositionFrom) {
			// Get moves for a piece through looping through movement
			let { board } = gameState;
			let startSquare = board[aPositionFrom];
			let startSquareName = startSquare.toLowerCase();
			let validMoves = [];

			// Loop through the movement map
			MOVEMENT_MAP[startSquareName].map(moveDifference => {
				let aPositionTo = aPositionFrom + moveDifference;
				let moveIsValid = validateMove(gameState, aPositionFrom, aPositionTo) === true;
				let sPositionTo = getSANFromArrayPosition(aPositionTo);
				let sPositionFrom = getSANFromArrayPosition(aPositionFrom);
				
				if (moveIsValid) validMoves.push(sPositionTo);
			});

			return validMoves;
		},

		getAllMoves: function() {
			let { board, turn } = gameState;
			let validMoves = [];

			// Loop through board, match color
			board.map((square, squareNumber) => {
				if (square !== EMPTY_SQUARE) {
					// Check moves
					let squareColor = square === square.toUpperCase() ? COLOR_WHITE : COLOR_BLACK;
					let possibleMoves = this.getMoves(squareNumber)
					if (squareColor == turn && possibleMoves.length > 0) {
						validMoves.push({ square: getSANFromArrayPosition(squareNumber), moves: possibleMoves });
					}
				}
			});
			return validMoves;
		},
		
		makeMove: function(sPositionFrom, sPositionTo) {
			// Convert to array positions
			let aPositionFrom = getArrayPositionFromSAN(sPositionFrom);
			let aPositionTo = getArrayPositionFromSAN(sPositionTo);
			let validMove = validateMove(gameState, aPositionFrom, aPositionTo);

			debug(`Attempting move ${sPositionFrom} to ${sPositionTo}`);

			// Move validation
			if (validMove == true) {
				// Move piece
				gameState.board[aPositionTo] = gameState.board[aPositionFrom];
				gameState.board[aPositionFrom] = '-';

				// Change turn
				gameState.turn = gameState.turn == COLOR_WHITE ? COLOR_BLACK : COLOR_WHITE;
			} else {
				error(`Invalid move attempt from ${sPositionFrom} to ${sPositionTo}: ${validMove}`);
			}
		},

		// Temporary function for debugging purposes
		showBoard: function() {
			text = '';
			for (i=0; i<64; i++) {
				if (i%8 == 0 || i == 0) {
					text += `\n ${8-(i/8)} |`;
				}
				text += ` ${gameState.board[i]} `;
			}
			text += '\n    ------------------------\n     A  B  C  D  E  F  G  H'
			console.log(text)
		}
	}
}

module.exports = {
	game
}