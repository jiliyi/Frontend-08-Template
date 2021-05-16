const http = require('http');
const https = require('https')
const fs = require('fs')
const unzipper = require('unzipper')
const qs = require('querystring')

const client_id = 'Iv1.862d67b9cc855d00';
const client_secret = '8fdedc352624418019733c7abd3956c2811136f2'
//2 auth路由： 接受code 用code+client_id+client_secret换token

function auth(req,res){
    let query = qs.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1])
    getToken(query.code,info=>{
        res.write(`<a href='http://localhost:8083?token=${info.access_token}'>publish</a>`)
        res.end()
    })
}

function getToken(code,callback){
    let request = https.request({
        host : 'github.com',
        port : 443,
        method : 'POST',
        path : `/login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${client_secret}`
    },res=>{
        let body = '';
        res.on('data',chunk=>{
            body += (chunk.toString());            
        })
        res.on('end',()=>{
            callback(qs.parse(body))
        })
    })
    request.end()
}

function publish(req,res){
    let query = qs.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1])

    getUser(query.token,info=>{
        if(info.login === 'jiliyi'){
            
            req.pipe(unzipper.Extract({ path: '../server/public/' }))
            req.on('end',()=>{
                res.end('success')
            })
        }
    })

    req.on('end',()=>{
        res.end('success')
    })
}

function getUser(token,callback){
    let request = https.request({
        host : 'api.github.com',
        port : 443,
        method : 'GET',
        path : `/user`,
        headers : {
            Authorization: `token ${token}`,
            'User-Agent' : 'toy-publishabc123'
        }
    },res=>{
        let body = '';
        res.on('data',chunk=>{
            body += (chunk.toString());            
        })
        res.on('end',()=>{
            callback(qs.parse(body))
        })
    })
    request.end()
}

http.createServer((req,res)=>{
    if(req.url.match(/^\/auth\?/)){
        return auth(req,res)
    }else if(req.url.match(/^\/publish\?/)){
        return publish(req,res)
    }
    // let file = fs.createWriteStream('../server/public/tmp.zip')
    // req.pipe(file)
}).listen(8082)

// fs.createReadStream('../server/public/tmp.zip')
//   .pipe(unzipper.Extract({ path: './tem' }));