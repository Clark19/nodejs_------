var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "11",
  database: "board_egoing",
});
db.connect();
// db.query("SELECT * FROM topic", function (error, results, fields) {
//   if (error) throw error;
//   console.log(results);
// });
// db.end();
module.exports = db;
