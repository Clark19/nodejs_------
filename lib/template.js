module.exports = {
  html: function (title, list, body, control) {
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
  },

  list: (topics) => {
    let list = "<ul>";
    topics.forEach(
      (topic) =>
        (list += `<li><a href="/?id=${topic.id}">${topic.title}</a></li>`)
    );
    list += "</ul>";
    return list;
  },
};
