var pool = require("../config/database");

var Alarm = {
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
      var tableName = "Alarm_" + serialNumber;
      var sqlStr =
        "CREATE TABLE " +
        tableName +
        "  (\
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,\
                Date DATETIME NULL,\
                e3Index TINYINT(3) UNSIGNED NULL,\
                e3Score TINYINT(3) UNSIGNED NULL, ";
      if (productInfo.pm10 === 1) {
        sqlStr =
          sqlStr +
          "pm10Index TINYINT(3) UNSIGNED NULL,\
                pm10Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.pm25 === 1) {
        sqlStr =
          sqlStr +
          "pm25Index TINYINT(3) UNSIGNED NULL,\
                pm25Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.co2 === 1) {
        sqlStr =
          sqlStr +
          "co2Index TINYINT(3) UNSIGNED NULL,\
                co2Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.hcho === 1) {
        sqlStr =
          sqlStr +
          "hchoIndex TINYINT(3) UNSIGNED NULL,\
                hchoAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.voc === 1) {
        sqlStr =
          sqlStr +
          "vocIndex TINYINT(3) UNSIGNED NULL,\
                vocAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.temperature === 1) {
        sqlStr =
          sqlStr +
          "temperatureIndex TINYINT(3) UNSIGNED NULL,\
                temperatureAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.humidity === 1) {
        sqlStr =
          sqlStr +
          "humidityIndex TINYINT(3) UNSIGNED NULL,\
                humidityAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.noise === 1) {
        sqlStr =
          sqlStr +
          "noiseIndex TINYINT(3) UNSIGNED NULL,\
                noiseAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.co === 1) {
        sqlStr =
          sqlStr +
          "coIndex TINYINT(3) UNSIGNED NULL,\
                coAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
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
  getAlarmById: function(deviceSN, id, callback) {
    console.log("getAlarmById 호출됨");

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
      var tableName = "Alarm_" + deviceSN;
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
  addAlarm: function(
    pm10,
    pm25,
    co2,
    hcho,
    voc,
    temperature,
    humidity,
    noise,
    co,
    total,
    date,
    deviceSN,
    callback
  ) {
    console.log("addAlarm 호출됨");

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
      var tableName = "Alarm_" + deviceSN;
      var data = { Date: date, e3Index: total.index, e3Score: total.score };
      if (pm10.value) {
        data.pm10Index = pm10.index;
        data.pm10Alarm = pm10.alarm;
      }
      if (pm25.value) {
        data.pm25Index = pm25.index;
        data.pm25Alarm = pm25.alarm;
      }
      if (co2.value) {
        data.co2Index = co2.index;
        data.co2Alarm = co2.alarm;
      }
      if (hcho.value) {
        data.hchoIndex = hcho.index;
        data.hchoAlarm = hcho.alarm;
      }
      if (voc.value) {
        data.vocIndex = voc.index;
        data.vocAlarm = voc.alarm;
      }
      if (temperature.value) {
        data.temperatureIndex = temperature.index;
        data.temperatureAlarm = temperature.alarm;
      }
      if (humidity.value) {
        data.humidityIndex = humidity.index;
        data.humidityAlarm = humidity.alarm;
      }
      if (noise.value) {
        data.noiseIndex = noise.index;
        data.noiseAlarm = noise.alarm;
      }
      if (co.value) {
        data.coIndex = co.index;
        data.coAlarm = co.alarm;
      }

      // SQL문을 실행합니다.
      var exec = conn.query(
        "insert into " + tableName + " set ?",
        data,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }
          var success = true;

          callback(null, success);
        }
      );
    });
  },
  deleteAlarm: function(deviceSN, dataId, callback) {
    console.log("deleteAlarm 호출됨 dataId : " + dataId);
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
      var tableName = "Alarm_" + deviceSN;
      var queryString =
        "delete from " + tableName + " where id in(" + dataId + ")";
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
        var oldTableName = "Alarm_" + serials[i];
        var newTableName = "Alarm_" + serials[i] + "_backup_" + date;
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
module.exports = Alarm;
