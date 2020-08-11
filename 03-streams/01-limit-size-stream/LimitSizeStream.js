const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.myLimit = options.limit || 0;
    this.curLimit = 0;
  }

  _transform(chunk, encoding, callback) {
    let stringSize = chunk.length;
    
    this.curLimit += stringSize;

    if ( this.curLimit > this.myLimit ) {
      callback (new LimitExceededError ( ));
      return;
    } else {
      callback (null, chunk);
    }
  }
}

module.exports = LimitSizeStream;