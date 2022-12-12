var http = require("http");
var fs = require("fs");
const url = require("url");
const qs = require("querystring");

function templateHTML(title, list, body, control) {
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
    ${control}
    ${body}
  </body>
  </html>
`;
}

const templateList = (files) => {
  let list = "<ul>";
  files.forEach(
    (file) => (list += `<li><a href="/?id=${file}">${file}</a></li>`)
  );
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
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
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
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );

        response.writeHead(200);
        response.end(template);
        // response.end(fs.readFileSync(__dirname + url));
      });
    }
  } else if (pathname === "/create") {
    const title = "Create";
    const files = await fs.readdirSync("./data");
    if (!files) console.log("파일들 없음");
    const list = templateList(files);
    const template = templateHTML(
      title,
      list,
      `
      <form action="/create_process" method="post">
        <p>
          <input type="text" name="title" placeholder="title" />
        </p>
        <p><textarea placeholder="description" name="description" cols="30" rows="10"></textarea></p>
        <p><input type="submit" value="submit" /></p>
      </form>
      `,
      ""
    );

    response.writeHead(200);
    response.end(template);
  } else if (pathname === "/create_process") {
    let body = "";
    let post = "";
    request.on("data", function (data) {
      body += data;
      if (body.length > 1e6) request.connection.destroy();
    });
    request.on("end", function () {
      post = qs.parse(body);
      const { title, description } = post;
      console.log(post);
      fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
        if (err) throw err;
        console.log("The file has been saved.");
        response.writeHead(302, { Location: `/?id=${encodeURI(title)}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readFile(`data/${queryData.id}`, "utf-8", async (err, description) => {
      const title = queryData.id;
      const files = await fs.readdirSync("./data");
      if (!files) console.log("파일들 없음");
      const list = templateList(files);
      const template = templateHTML(
        title,
        list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}"  />
          <p>
            <input type="text" name="title" placeholder="title" value=${title} />
          </p>
          <p><textarea placeholder="description" name="description" cols="30" rows="10">${description}</textarea></p>
          <p><input type="submit" value="submit" /></p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );

      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/update_process") {
    let body = "";
    let post = "";
    request.on("data", function (data) {
      body += data;
      if (body.length > 1e6) request.connection.destroy();
    });
    request.on("end", function () {
      post = qs.parse(body);
      const { id, title, description } = post;
      console.log(post);
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        if (err) throw err;
        console.log("File renamed1");
        fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
          if (err) throw err;
          console.log("The file has been saved.");
          response.writeHead(302, { Location: `/?id=${encodeURI(title)}` });
          response.end();
        });
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);
