let http = require('http');
let https = require('https');
let fs = require('fs');
let unzipper = require('unzipper');
let qs = require('querystring');

const client_id = 'Iv1.862d67b9cc855d00';
const client_secret = '8fdedc352624418019733c7abd3956c2811136f2'

//2auth路由：接收code，用code+client_id+client_secret换token
function auth(request, response) {
    let query = qs.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function(info) {
        console.log(info);
        response.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`)
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request({
        hostname: "github.com",
        path: `/login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${client_secret}`,
        port: 443,
        method: "POST"
    }, function(response){
        let body = "";
        response.on('data', chunk => {
            body += (chunk.toString());
        })
        response.on('end', chunk => {
            callback(qs.parse(body));
        })
    });
    request.end();
}


function publish(request, response) {
    let query = qs.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    if (query.token) {
        getUser(query.token, function(info) {
            if (info.login === 'jiliyi') {
                request.pipe(unzipper.Extract({ path: '../server/public/' }))
                request.on('end', function() {
                    response.end('success!');
                })
            }
        });
    }
}

function getUser(token, callback) {
    let request = https.request({
        hostname: "api.github.com",
        path: `/user`,
        port: 443,
        method: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": 'toy-publishabc123'
        }
    }, function(response){
        let body = "";
        response.on('data', chunk => {
            body += (chunk.toString());
        })
        response.on('end', chunk => {
            callback(JSON.parse(body));
        })
    });
    request.end();
}

http.createServer(function(request, response) {
    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response);
    }
    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }
    // console.log("request");
    
    // let outFile = fs.createWriteStream("../server/public/tmp.zip");
    // request.pipe(outFile);
    
    /*
    request.on('data', chunk => {
        outFile.write(chunk);
    })
    request.on('end', chunk => {
        outFile.end();
        response.end("success")
    })
    */
}).listen(8082);