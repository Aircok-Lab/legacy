var pool = require("../config/database");

var Report = {
  getAVGe3ScoreByDate: function(serialNumber, startDate, endDate, callback) {
    console.log("getAVGe3ScoreByDate 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Alarm_" + serialNumber;
      var queryString =
        "select ROUND(AVG(e3Score)) as avg from " +
        tableName +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'";
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        callback(null, result[0].avg);
      });
    });
  },

  getCountE3Index: function(
    serialNumber,
    startDate,
    endDate,
    e3Index,
    callback
  ) {
    console.log("getCountE3Index 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Alarm_" + serialNumber;
      var queryString =
        "select count(e3Index) as count from " +
        tableName +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'" +
        " and e3Index = " +
        e3Index;
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);
          callback(err, null);
          return;
        }
        callback(null, result[0].count);
      });
    });
  },
  getChartDataByDate: function(serialNumber, startDate, endDate, callback) {
    console.log("getChartDataByDate 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Data_" + serialNumber;
      var queryString =
        "select * from " +
        tableName +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'";
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var chartData = json;
        console.dir(chartData);
        callback(null, chartData);
      });
    });
  }
};

module.exports = Report;
