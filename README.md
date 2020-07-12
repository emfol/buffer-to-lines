# Buffer To Lines

The logic necessary to extract lines from a buffer.

## Installation

```bash
npm install --save buffer-to-lines
```

## Usage / Example

```javascript
const bufferToLines = require('buffer-to-lines');

let buffer = Buffer.alloc(256);
let string = 'The essence of all beautiful art,\nall great art,\nis gratitude.\n - Friedrich';
let size = buffer.write(string, 'utf8');
let lines = [];

let remainder = bufferToLines(buffer, size, 'utf8', lines);

// print lines read
console.log('Remainder:', remainder);
// Remainder: 12
console.log('Lines:', JSON.stringify(lines, null, 2));
// Lines: [
//     "The essence of all beautiful art,",
//     "all great art,",
//     "is gratitude."
// ]

// update the buffer since the author is missing
// (the remainder is moved to the beginning of the buffer)
size = remainder + buffer.slice(remainder).write(' Nietzsche\n', 'utf8');

// parse the updated buffer
remainder = bufferToLines(buffer, size, 'utf8', lines);

// print results again
// note that the contents of the lines array is preserved from previous call
console.log('Remainder:', remainder);
// Remainder: 0
console.log('Lines:', JSON.stringify(lines, null, 2));
// Lines: [
//     "The essence of all beautiful art,",
//     "all great art,",
//     "is gratitude.",
//     " - Friedrich Nietzsche"
// ]
```
