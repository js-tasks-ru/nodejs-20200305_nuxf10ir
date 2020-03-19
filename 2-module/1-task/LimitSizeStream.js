const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    const {limit} = options;
    this._limit = limit;
  }

  _transform(chunk, encoding, callback) {
    const buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, encoding);
    const bufferLength = buffer.length;
    if (bufferLength <= this._limit) {
      callback(null, chunk);
      this._limit -= bufferLength;
    } else {
      callback(new LimitExceededError());
      this.close();
    }
  }
}

module.exports = LimitSizeStream;
