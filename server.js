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
      <li><a href="1.html">HTML</a></li>
      <li><a href="2.html">CSS</a></li>
      <li><a href="3.html">JavaScript</a></li>
    </ul>
    <h2>${title}</h2>
    <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
    <img src="coding.jpg" width="100%">
    </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
    </p>
  </body>
  </html>
  `;

  response.writeHead(200);
  response.end(template);
  // response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);
