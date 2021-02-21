class MyRequest{
    constructor(options){
        this.method = options.method || 'get';
        this.method.host = options.host || '127.0.0.1';
        this.method.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.options.headers = options.headers || {}
        if(!this.headers['Content-type']){
            this.headers['Content-type'] = 'application/x-www-form-urlencoded'
        }
        if(this.headers['Content-type'] === 'application/x-www-form-urlencoded'){
            this.bodyText = Object.keys(this.body).map(key=>`${key}=${encodeURIComponent(this.body[key])}`).join('&')
        }else if(this.headers['Content-type'] === 'application/json'){
            this.bodyText = JSON.stringify(this.body)
        }
        this.headers['Content-length'] = this.bodyText.length;
    }
    send(connection) {
        return new Promise((resolve, reject) => {
          const parser = new ResponseParser();

          if (connection) {
            connection.write(this.toString());
          } else {
            connection = net.createConnection(
              {
                host: this.host,
                port: this.port,
              },
              () => {
                connection.write(this.toString());
              }
            );
          }

          connection.on('data', data => {
            console.log(data.toString());
            parser.receive(data.toString());
    
            if (parser.isFinished) {
              resolve(parser.response);
              connection.end();
            }
          });

          connection.on('error', err => {
            reject(err);
            connection.end();
          });
        });
      }

      toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
          ${Object.keys(this.headers)
            .map(key => `${key}: ${this.headers[key]}`)
            .join('\r\n')}\r\r
          ${this.bodyText}`;
      }
}



  class ResponseParser {
    constructor() {
      this.state = this.waitingStatusLine;
      this.statusLine = '';
      this.headers = {};
      this.headerName = '';
      this.headerValue = '';
      this.bodyParser = null;
    }
  
    receive(string) {
      for (let i = 0; i < string.length; i++) {
        this.state = this.state(string.charAt(i));
      }
    }
  
    receiveEnd(char) {
      return receiveEnd;
    }
  

    waitingStatusLine(char) {
      if (char === '\r') return this.waitingStatusLineEnd;
      this.statusLine += char;
      return this.waitingStatusLine;
    }
  

    waitingStatusLineEnd(char) {
      if (char === '\n') return this.waitingHeaderName;
      return this.waitingStatusLineEnd;
    }
  

    waitingHeaderName(char) {
      if (char === ':') return this.waitingHeaderSpace;
      if (char === '\r') return this.waitingHeaderBlockEnd;
      this.headerName += char;
      return this.waitingHeaderName;
    }
  

    waitingHeaderSpace(char) {
      if (char === ' ') return this.waitingHeaderValue;
      return this.waitingHeaderSpace;
    }

    waitingHeaderValue(char) {
      if (char === '\r') {
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
        return this.waitingHeaderLineEnd;
      }
      this.headerValue += char;
      return this.waitingHeaderValue;
    }
  

    waitingHeaderLineEnd(char) {
      if (char === '\n') return this.waitingHeaderName;
      return this.waitingHeaderLineEnd;
    }
  

    waitingHeaderBlockEnd(char) {
      if (char === '\n') return this.waitingBody;
      return this.waitingHeaderBlockEnd;
    }
  
    waitingBody(char) {
      console.log(char);
      return this.waitingBody;
    }
  }

  class ResponseParser {
    constructor() {
      this.state = this.waitingStatusLine;
      this.statusLine = '';
      this.headers = {};
      this.headerName = '';
      this.headerValue = '';
      this.bodyParser = null;
    }
  
    get isFinished() {
      return this.bodyParser && this.bodyParser.isFinished;
    }
  
    get response() {
      this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
      return {
        statusCode: RegExp.$1,
        statusText: RegExp.$2,
        headers: this.headers,
        body: this.bodyParser.content.join(''),
      };
    }
  
    receive(string) {
      for (let i = 0; i < string.length; i++) {
        this.state = this.state(string.charAt(i));
      }
    }
  
    receiveEnd(char) {
      return receiveEnd;
    }
  

    waitingStatusLine(char) {
      if (char === '\r') return this.waitingStatusLineEnd;
      this.statusLine += char;
      return this.waitingStatusLine;
    }
  

    waitingStatusLineEnd(char) {
      if (char === '\n') return this.waitingHeaderName;
      return this.waitingStatusLineEnd;
    }
  

    waitingHeaderName(char) {
      if (char === ':') return this.waitingHeaderSpace;
      if (char === '\r') {
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ChunkedBodyParser();
        }
        return this.waitingHeaderBlockEnd;
      }
      this.headerName += char;
      return this.waitingHeaderName;
    }
  
 
    waitingHeaderSpace(char) {
      if (char === ' ') return this.waitingHeaderValue;
      return this.waitingHeaderSpace;
    }
  

    waitingHeaderValue(char) {
      if (char === '\r') {
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
        return this.waitingHeaderLineEnd;
      }
      this.headerValue += char;
      return this.waitingHeaderValue;
    }
  

    waitingHeaderLineEnd(char) {
      if (char === '\n') return this.waitingHeaderName;
      return this.waitingHeaderLineEnd;
    }
  

    waitingHeaderBlockEnd(char) {
      if (char === '\n') return this.waitingBody;
      return this.waitingHeaderBlockEnd;
    }
  

    waitingBody(char) {
      this.bodyParser.receiveChar(char);
      return this.waitingBody;
    }
  }
  

  class ChunkedBodyParser {
    constructor() {
      this.state = this.waitingLength;
      this.length = 0;
      this.content = [];
      this.isFinished = false;
    }
  
    receiveChar(char) {
      this.state = this.state(char);
    }
  

    waitingLength(char) {
      if (char === '\r') {
        if (this.length === 0) this.isFinished = true;
        return this.waitingLengthLineEnd;
      } else {
        
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
      return this.waitingLength;
    }
  

    waitingLengthLineEnd(char) {
      if (char === '\n') return this.readingTrunk;
      return this.waitingLengthLineEnd;
    }
  

    readingTrunk(char) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) return this.waitingNewLine;
      return this.readingTrunk;
    }
  

    waitingNewLine(char) {
      if (char === '\r') return this.waitingNewLineEnd;
      return this.waitingNewLine;
    }
  

    waitingNewLineEnd(char) {
      if (char === '\n') return this.waitingLength;
      return this.waitingNewLineEnd;
    }
  }