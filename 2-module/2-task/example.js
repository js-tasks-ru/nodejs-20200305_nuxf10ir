const LineSplitStream = require('./LineSplitStream');
const os = require('os');

let iterator = 0;

const lines = new LineSplitStream({
  encoding: 'utf-8',
});

function onData(line) {
  console.log(++iterator + ' ' + line);
}

lines.on('data', onData);

lines.write('a');
lines.write(`b${os.EOL}c`);
lines.write(`d${os.EOL}e`);
lines.write('f');

lines.end();

