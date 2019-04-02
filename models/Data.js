var pool = require("../config/database");

var Data = {
  createTable: function(serialNumber, productInfo, callback) {
    console.log("createTable 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      var tableName = "Data_" + serialNumber;
      var sqlStr =
        "CREATE TABLE " +
        tableName +
        "  (\
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,\
                Date DATETIME NULL, ";
      if (productInfo.pm10 === 1) sqlStr = sqlStr + "pm10 INT NULL, ";
      if (productInfo.pm25 === 1) sqlStr = sqlStr + "pm25 INT NULL, ";
      if (productInfo.co2 === 1) sqlStr = sqlStr + "co2 INT NULL, ";
      if (productInfo.hcho === 1) sqlStr = sqlStr + "hcho INT NULL, ";
      if (productInfo.voc === 1) sqlStr = sqlStr + "voc INT NULL, ";
      if (productInfo.temperature === 1)
        sqlStr = sqlStr + "temperature FLOAT, ";
      if (productInfo.humidity === 1) sqlStr = sqlStr + "humidity FLOAT, ";
      if (productInfo.noise === 1) sqlStr = sqlStr + "noise INT NULL, ";
      sqlStr =
        sqlStr +
        " PRIMARY KEY (`id`),\
                INDEX " +
        "index_" +
        tableName +
        " (Date ASC))";

      // SQL문을 실행합니다.
      var exec = conn.query(sqlStr, function(err, result) {
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
        console.log(">> json: ", json);
        var dataTableInfo = json;

        callback(null, dataTableInfo);
      });
    });
  },
  getDataById: function(deviceSN, id, callback) {
    console.log("getDataById 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // SQL문을 실행합니다.
      var tableName = "Data_" + deviceSN;
      var exec = conn.query(
        "Select * from " + tableName + " where id=?",
        id,
        function(err, result) {
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
          console.log(">> json: ", json);
          var dataInfo = json;

          callback(null, dataInfo);
        }
      );
    });
  },
  addData: function(
    pm25,
    pm10,
    co2,
    hcho,
    voc,
    temperature,
    humidity,
    noise,
    //co,
    date,
    deviceSN,
    callback
  ) {
    console.log("addData 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // 데이터를 객체로 만듭니다.
      var tableName = "Data_" + deviceSN;
      var data = { date: date };
      if (pm25) data.pm25 = pm25;
      if (pm10) data.pm10 = pm10;
      if (co2) data.co2 = co2;
      if (hcho) data.hcho = hcho;
      if (voc) data.voc = voc;
      if (temperature) data.temperature = temperature;
      if (humidity) data.humidity = humidity;
      if (noise) data.noise = noise;
      //if (co) data.co = co;

      // SQL문을 실행합니다.
      var exec = conn.query(
        "insert into " + tableName + " set ?",
        data,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          //add data on recentdata table

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }

          callback(null, result);
        }
      );
    });
  },

  deleteData: function(deviceSN, dataId, callback) {
    console.log("deleteData 호출됨 dataId : " + dataId);
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // 데이터를 객체로 만듭니다.
      var tableName = "Data_" + deviceSN;
      var queryString =
        "delete from " + tableName + " where id in(" + dataId + ")";

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
        var success = "true";
        callback(null, success);
      });
    });
  },

  changeTableName: function(deviceSN) {
    console.log("changeTableName 호출됨 deviceSN : " + deviceSN);
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      var serials = deviceSN.split(",");
      console.log(serials);

      for (i in serials) {
        var rightNow = new Date();
        var date = rightNow
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        var oldTableName = "Data_" + serials[i];
        var newTableName = "Data_" + serials[i] + "_backup_" + date;
        var queryString =
          "ALTER TABLE monitoring." +
          oldTableName +
          " RENAME TO  monitoring." +
          newTableName;

        conn.query(queryString);
      }
      conn.release();
    });
  }
};
module.exports = Data;
