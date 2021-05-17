const http = require("http");
const https = require("https");
const unzipper = require("unzipper");
const querystring = require("querystring");

const client_id = 'Iv1.862d67b9cc855d00';
const client_secret = '8fdedc352624418019733c7abd3956c2811136f2'

function auth(request, response) {
  const query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, (info) => {
    response.write(
      `<a href="http://localhost:8083?token=${info.access_token}">publish</a>`
    );
    response.end();
  });
}

function getToken(code, callback) {
  const request = https.request(
    {
      hostname: "github.com",
      port: 443,
      path: `/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
      method: "POST",
    },
    function (response) {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", () => {
        callback(querystring.parse(body));
      });
    }
  );
  request.end();
}

function getUser(token, callback) {
  const request = https.request(
    {
      hostname: "api.github.com",
      port: 443,
      path: '/user',
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "toy-publish"
      },
    },
    function (response) {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", () => {
        callback(JSON.parse(body));
      });
    }
  );
  request.end();
}

function publish(request, response) {
  const query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  getUser(query.token, (user) => {
    if (user.login === "jiliyi"){
      request.pipe(unzipper.Extract({ path: "../server/public" }));
      request.on("end", () => {
        response.end("success");
      });
    }
  });
}

http
  .createServer(function (request, response) {
    if (request.url.match(/^\/auth\?/)) {
      auth(request, response);
    } else if (request.url.match(/^\/publish\?/)) {
      publish(request, response);
    }
  })
  .listen(8082);

