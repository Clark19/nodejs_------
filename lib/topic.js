const db = require("../db/db.template");
var fs = require("fs");
const qs = require("querystring");
const template = require("./template");
const path = require("path"); // 사용자로 부터 들어오는 입력정보 보안 위해 사용.

exports.home = async (request, response) => {
  db.query(`select * from topic`, function (error, results, fields) {
    if (error) throw error;
    console.log(results);

    const title = "Welcome";
    const description = "Hello, Node.js";

    const list = template.list(results);
    console.log("type", typeof results);
    const html = template.html(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );

    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response, queryData) {
  db.query(`select * from topic`, (error, topics) => {
    if (error) throw error;

    db.query(
      `select * from topic where id=?`,
      [queryData.id],
      (error, topic) => {
        if (error) throw error;
        const title = topic[0].title;
        const description = topic[0].description;

        const list = template.list(topics);
        const html = template.html(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create"> 생성 </a>
       <a href="/update?id=${queryData.id}"> 수정 </a>
       <form action="delete_process" method="post" onsubmit="if (!confirm('delete?')) return false;">
        <input type="hidden" name="id" value="${queryData.id}">
        <input type="submit" value="삭제">
       </form>
      `
        );

        response.writeHead(200);
        response.end(html);
        // response.end(fs.readFileSync(__dirname + url));
      }
    );
  });
};

exports.create = async function (request, response) {
  const title = "Create";
  const files = await fs.readdirSync("./data");
  if (!files) console.log("파일들 없음");
  const list = template.list(files);
  const html = template.html(
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
  response.end(html);
};

exports.create_process = function (request, response) {
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
    const filteredTitle = path.parse(title).base;
    fs.writeFile(`data/${filteredTitle}`, description, "utf-8", (err) => {
      if (err) throw err;
      console.log("The file has been saved.");
      response.writeHead(302, { Location: `/?id=${encodeURI(title)}` });
      response.end();
    });
  });
};

exports.update = function (request, response, queryData) {
  const filteredId = path.parse(queryData.id).base;
  fs.readFile(`data/${filteredId}`, "utf-8", async (err, description) => {
    const title = filteredId;
    const files = await fs.readdirSync("./data");
    if (!files) console.log("파일들 없음");
    const list = template.list(files);
    const html = template.html(
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
    response.end(html);
  });
};

exports.update_process = function (request, response) {
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
    const filteredId = path.parse(id).base;
    const filteredTitle = path.parse(title).base;
    fs.rename(`data/${filteredId}`, `data/${filteredTitle}`, (err) => {
      if (err) throw err;
      console.log("File renamed1");
      fs.writeFile(`data/${filteredTitle}`, description, "utf-8", (err) => {
        if (err) throw err;
        console.log("The file has been saved.");
        response.writeHead(302, {
          Location: `/?id=${encodeURI(filteredTitle)}`,
        });
        response.end();
      });
    });
  });
};

exports.delete_process = function (request, response) {
  let body = "";
  let post = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  request.on("end", function () {
    post = qs.parse(body);
    const id = post.id;
    console.log("삭제:", post);
    const filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, async (err) => {
      if (err) throw err;
      console.log("File deleted.");
      response.writeHead(302, { Location: `/` });
      response.end();
    });
  });
};
