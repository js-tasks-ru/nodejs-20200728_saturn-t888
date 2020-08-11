const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding || 'utf-8';
    this.separator = options.separator || os.EOL;
    this.intmStr = '';
  }

  _transform(chunk, encoding, callback) {
    this.intmStr = this.intmStr + chunk;
    let outStr = this.intmStr.split (this.separator);

    if (outStr.length > 1) {
      /*
      В this.intmStr сохраняем последний элемент.
      outStr убавляем на этот же элемент, и выводим.
      */
      this.intmStr = outStr [outStr.length - 1];
      outStr.length -= 1;

      for (let i = 0; i < outStr.length; ++i) { 
        this.push (outStr [i]);
      }
    } else {
      this.intmStr = outStr [0];
    }  
    
    callback ();
  }

  _flush(callback) {
    
    /* Выводим оставшийся элемент */
    this.push (this.intmStr);
    
    callback ();
  }
}

module.exports = LineSplitStream;
