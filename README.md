# Ludus
Performance-oriented, pure JavaScript chess engine.

## Usage
```js
const ludus = require('ludus') // or: <script src="./ludus.min.js>

let game = new ludus.game({}); // Initialize game

game.makeMove({
  from: 'A2',
  to: 'A3',
  promotion: 'p'
})
```
