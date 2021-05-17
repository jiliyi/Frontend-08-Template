const http = require("http");
const archiver = require("archiver");
const child_process = require("child_process");
const querystring = require("querystring");
const client_id = 'Iv1.862d67b9cc855d00';
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=${client_id}`);


http.createServer(function (request, response) {
    const query = querystring.parse((request.url.match(/^\/\?([\s\S]+)$/))[1]);
    console.log(query)
    publish(query.token);
    response.end("success");
  })
  .listen(8083);

function publish(token) {
  const request = http.request(
    {
      hostname: "127.0.0.1",
      port: 8082,
      method: "POST",
      path: `/publish?token=${token}`,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    },
    (response) => {
      response.on("end", () => {
        response.end();
      });
    }
  );

  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  archive.directory("./sample/", false);
  archive.pipe(request); 
  archive.finalize(); 
}