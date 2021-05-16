const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const archiver = require('archiver')

const child_process = require('child_process')

const client_id = 'Iv1.862d67b9cc855d00';

const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

//1打开 https://github.com/login/oauth/authorize
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=${client_id}`)


//3创建server 接受token 点击发布

http.createServer((req,res)=>{
    let query = qs.parse(req.url.match(/^\/\?([\s\S]+)$/)[1])
    publish(query.token)
}).listen(8083)

function publish(token){
    let request = http.request({
    host : '127.0.0.1',
    port : 8082,
    path : '/publish?token=' + token,
    method : 'post',
    headers : {
        'Content-Type' : 'application-octet-stream'
    }
},(res)=>{
    console.log(res)
})
    archive.directory('./sample/', false);
    archive.finalize()
    archive.pipe(request)
}

// let request = http.request({
//     host : '127.0.0.1',
//     port : 8082,
//     method : 'post',
//     headers : {
//         'Content-Type' : 'application-octet-stream'
//     }
// },(res)=>{
//     console.log(res)
// })


// let file = fs.createWriteStream('./tmp.zip');


//   archive.directory('sample/', false);
//   archive.finalize() //为压缩工具填了内容
//   archive.pipe(request)

// file.pipe(request)
// file.on('end',()=>request.end())



// file.on('data',chunk=>{
//     request.write(chunk)
// })

// file.on('end',chunk=>{
//         console.log('finish')
//         request.end()
// })