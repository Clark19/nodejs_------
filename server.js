var http = require("http");
var fs = require("fs");
const url = require("url");

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
`;
}

const templateList = (files) => {
  let list = "<ul>";
  files.forEach((file) => (list += `<li><a href="/?id=${file}">${file}</li>`));
  list += "</ul>";
  return list;
};

var app = http.createServer(async function (request, response) {
  var _url = request.url;
  let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;

  console.log("pathname:", pathname);
  console.log("__dirname: ", __dirname);
  console.log("process.argv: ", process.argv);

  if (pathname === "/") {
    if (!queryData.id) {
      const title = "Welcome";
      const description = "Hello, Node.js";
      const files = await fs.readdirSync("./data");
      if (!files) console.log("파일들 없음");
      const list = templateList(files);
      const template = templateHTML(
        title,
        list,
        `<h2>${title}</h2>${description}`
      );

      response.writeHead(200);
      response.end(template);
    } else {
      fs.readFile(`data/${queryData.id}`, "utf-8", async (err, description) => {
        const title = queryData.id;
        const files = await fs.readdirSync("./data");
        if (!files) console.log("파일들 없음");
        const list = templateList(files);
        const template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`
        );

        response.writeHead(200);
        response.end(template);
        // response.end(fs.readFileSync(__dirname + url));
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);
