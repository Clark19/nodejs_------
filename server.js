const http = require("http");
const url = require("url");

const topic = require("./lib/topic");

const app = http.createServer(async function (request, response) {
  var _url = request.url;
  let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;

  console.log("pathname:", pathname);
  console.log("__dirname: ", __dirname);
  console.log("process.argv: ", process.argv);

  if (pathname === "/") {
    if (!queryData.id) {
      topic.home(request, response);
    } else {
      topic.page(request, response, queryData);
    }
  } else if (pathname === "/create") {
    topic.create(request, response);
  } else if (pathname === "/create_process") {
    topic.create_process(request, response);
  } else if (pathname === "/update") {
    topic.update(request, response, queryData);
  } else if (pathname === "/update_process") {
    topic.update_process(request, response);
  } else if (pathname === "/delete_process") {
    topic.delete_process(request, response);
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);
