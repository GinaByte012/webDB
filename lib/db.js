var mysql = require('mysql');

var db = mysql.createConnection({
  host      : 'localhost',  // 데이터베이스 서버가 있는 주고. Node.js와 같은 서버에 있으므로 localhost
  user      : 'nodejs',     // 데이터베이스에 접근하기 위한 ID
  password  : 'nodejs',     // 데이터베이스에 접근하기 위한 Password
  database  : 'webdb2022'   // 접근하고자 하는 데이터베이스 이름
});
db.connect();
module.exports = db;