// MySQL 데이터베이스를 사용할 수 있는 mysql 모듈 불러오기
var mysql = require("mysql");

// MySQL 데이터베이스 연결 설정
var pool = mysql.createPool({
  connectionLimit: "2",
  host: "192.168.0.105",
  user: "root",
  password: "ethree0310",
  port: 3306,
  database: "monitoring",
  debug: false
});

module.exports = pool;
