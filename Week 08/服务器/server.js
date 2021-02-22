const http = require('http')

http.createServer((req,res)=>{
    let body = [];
    req.on('error',(err)=>{
        console.log(err)
    })
    req.on('data',chunk=>{
        body.push(chunk.toString())
    })
    req.on('end',()=>{
        body = Buffer.concat(body).toString()
        console.log('body',body)
        res.writeHead(200,{'Content-Type': 'text/html'})
        res.end('hello world')
    })
    
}).listen(8088)
console.log('server listen on 8088')