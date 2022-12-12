var http = require("http");
var fs = require("fs");
const url = require("url");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  let queryData = url.parse(_url, true).query;
  let title = queryData.id;
  console.log("쿼리스트링:", queryData);
  if (_url == "/") {
    // url = "/index.html";
    title = "Welcome";
  }
  if (_url == "/favicon.ico") {
    return response.writeHead(404);
  }

  console.log(__dirname + "박");

  fs.readFile(`data/${title}`, "utf-8", (err, description) => {
    let template = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      <p>${description}
      </p>
    </body>
    </html>
    `;

    response.writeHead(200);
    response.end(template);
    // response.end(fs.readFileSync(__dirname + url));
  });
});
app.listen(3000);
