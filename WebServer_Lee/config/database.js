// MySQL 데이터베이스를 사용할 수 있는 mysql 모듈 불러오기
var mysql = require("mysql");

// MySQL 데이터베이스 연결 설정
var pool = mysql.createPool({
  connectionLimit: "100",
  host: "database.cluster-cwqpmlxa7law.ap-northeast-2.rds.amazonaws.com",
  port: "3306",
  user: "aircok",
  password: "aircok180115!",
  database: "monitoring",
  debug: false
});

module.exports = pool;
