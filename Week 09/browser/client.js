const net = require('net');
const parser = require('./parser.js')
class Request{
    constructor(options){
        //在Request的构造器中收集必要的信息
        this.method = options.method || 'GET';
        this.path = options.path || '/'
        this.host = options.host || '127.0.0.1';
        this.port = options.port || 8088;
        this.body = options.body || {}
        this.headers = options.headers || {}
        if(!this.headers['Content-Type']){
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        if(this.headers['Content-Type'] === 'application/json'){
            this.bodyText = JSON.stringify( this.body)
        }else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
            this.bodyText = Object.keys(this.body).map(key=>`${key}=${encodeURIComponent(this.body[key])}`).join('&')
        }
        this.headers['Content-Length'] = this.bodyText.length;
    }
    send(connection){//向服务端发送请求，异步函数，返回Promise
        
        return new Promise((resolve,reject)=>{
            let parser = new ResponseParser()
            //向服务端发送数据
            if(connection){//如果传了一个连接
                connection.write(this.toString())
            }else{
                connection = net.createConnection({
                    host : this.host,
                    port : this.port
                },()=>{
                    // console.log(this.toString())
                    connection.write(this.toString())
                })
            }
            connection.on('data',data=>{//接收到服务端数据后
                // console.log(data.toString())
                parser.receive(data.toString())
                if(parser.isFinished){//解析完成
                    resolve(parser.response)
                    connection.end()//关闭连接
                }

            })
            connection.on('error',err=>{//存在错误
                reject(err)//抛出错误
                connection.end()//关闭连接
            })
        })
    }
    //变成http的格式
    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key=>`${key}:${this.headers[key]}`).join('\r\n')}\r\n
${this.bodyText}`
        
    }
}
//这个类用来解析服务端返回的内容，状态机
class ResponseParser{
    constructor(){
        this.WAITTING_STATUS_LINE = 0;//等待状态行
        this.WAITTING_STATUS_LINE_END = 1;//等待状态行结束
        this.WAITTING_HEADER_NAME = 2;//等待头部的key
        this.WAITTING_HEADER_SPACE = 3;//等待kv之间的：
        this.WAITTING_HEADER_VALUE = 4;//等待头部的value
        this.WAITTING_HEADER_LINE_END = 5;//等待头部结束
        this.WAITTING_HEADER_BLOCK_END = 6;//等待一个空行
        this.WAITTING_BODY = 7//等待响应体

        this.status = this.WAITTING_STATUS_LINE;//初始化状态
        this.statusLine = '';//记录状态行
        this.headers = {}//记录响应体

        //临时存储响应头里的kv
        this.headerName = '';
        this.headerValue = '';
 
        this.bodyPaser = null
    }
    get isFinished(){
        return this.bodyPaser && this.bodyPaser.isFinished
    }
    get response(){//响应内容整理
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\S\s]+)/)
        return {
            statusCode : RegExp.$1,
            statusText : RegExp.$2,
            headers : this.headers,
            content : this.bodyPaser.content.join('')
        }
    }
    receive(string){//将接收到的字符串像状态机那样逐个去处理
        for(let i = 0 ; i < string.length;i++){
            this.receiveChar(string.charAt(i))    
        }
    }
    receiveChar(char){
        if(this.status === this.WAITTING_STATUS_LINE){//等待状态行
            if(char === '\r'){//状态行是否结束
                this.status = this.WAITTING_STATUS_LINE_END
            }else{
                this.statusLine += char //将字符加入到状态行里去存着
            }
        }else if(this.status === this.WAITTING_STATUS_LINE_END){
            if(char === '\n'){
                this.status = this.WAITTING_HEADER_NAME
            }
        }else if(this.status === this.WAITTING_HEADER_NAME){
            if(char === ':'){
                this.status = this.WAITTING_HEADER_SPACE
            }else if(char === '\r'){//空行
                this.status = this.WAITTING_HEADER_BLOCK_END
                if(this.headers['Transfer-Encoding'] === 'chunked'){//header最后一行
                    this.bodyPaser = new TrunkedBodyParser()
                } 
            }else{
                this.headerName += char
            }
        }else if(this.status === this.WAITTING_HEADER_SPACE){
            if(char === ' '){
                this.status = this.WAITTING_HEADER_VALUE
            }
        }else if(this.status === this.WAITTING_HEADER_VALUE){
            if(char === '\r'){
                this.status = this.WAITTING_HEADER_LINE_END
                this.headers[this.headerName] = this.headerValue
                this.headerName = ''
                this.headerValue = ''
            }else{
                this.headerValue+=char
            }
        }else if(this.status === this.WAITTING_HEADER_LINE_END){
            if(char === '\n'){
                this.status = this.WAITTING_HEADER_NAME
            }
        }else if(this.status === this.WAITTING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.status = this.WAITTING_BODY
            }  
        }else if(this.status === this.WAITTING_BODY){//将body部分塞给bodyParser去处理
            this.bodyPaser.receiveChar(char)
        }
    }
}

//这个类来解析响应体的内容
class TrunkedBodyParser{
    constructor(){
        this.WAITTING_LENGTH = 0;//
        this.WAITTING_LENGTH_LINE_END = 1;
        this.READ_TRUNK = 2//读取chunk的状态
        this.WAITTING_NEW_LINE = 3;//等待新行
        this.WAITTING_NEW_LINE_END = 4;//新行结束
        this.content = [];
        this.isFinished = false
        this.length = 0 //预先规定一个长度，当长度为0时，一个空行，表明请求body的结束
        this.status = this.WAITTING_LENGTH//默认状态
    }
    receiveChar(char){
        if(this.status === this.WAITTING_LENGTH){
            if(char === '\r'){//一行读完
                if(this.length === 0){//一行读完长度为0，body解析完成
                    this.isFinished = true
                }
                this.status = this.WAITTING_LENGTH_LINE_END
            }else{//正常读
                this.length *= 16 //用16进制表示
                this.length += parseInt(char,16)
            }
           
        }else if(this.status === this.WAITTING_LENGTH_LINE_END){
            if(char === '\n'){
                this.status = this.READ_TRUNK
            }
        }else if(this.status === this.READ_TRUNK){
            this.content.push(char);
            this.length--;
            if(this.length === 0){
                this.status = this.WAITTING_NEW_LINE
            }
        }else if(this.status === this.WAITTING_NEW_LINE){
            if(char === '\r'){
                this.status = this.WAITTING_NEW_LINE_END
            }
        }else if(this.status === this.WAITTING_NEW_LINE_END){
            if(char === '\n'){
                this.status = this.WAITTING_LENGTH;
            }
        }
    }
}

void async function(){
    let request = new Request({
        host : '127.0.0.1',
        port : 8088,
        path : '/',
        headers : {
            ['X-Foo2'] : 'customed'
        },
        body : {
            name : 'jiliyi'
        }
    })
    let response = await request.send()
    // console.log('mubiao',response.content)
    let dom = parser.parseHTML(response.content)
    console.log(dom)
}()
