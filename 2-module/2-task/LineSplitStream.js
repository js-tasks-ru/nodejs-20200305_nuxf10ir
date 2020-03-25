const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._part = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString();
    if (!~chunkString.indexOf(os.EOL)) {
      this._part += chunkString;
    } else {
      const splitLines = chunk.toString().split(os.EOL);
      this.push(this._part + splitLines.shift());
      this._part = splitLines.pop();
      while (splitLines.length > 0) {
        this.push(splitLines.shift());
      }
    }
    callback();
  }

  _flush(callback) {
    this.push(this._part);
    callback();
  }
}

module.exports = LineSplitStream;
