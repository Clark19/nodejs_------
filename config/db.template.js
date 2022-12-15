var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "11",
  database: "board",
});
db.connect();
module.exports = db;
