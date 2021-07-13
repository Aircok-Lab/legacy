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
              date DATETIME NULL,\
              e3Index TINYINT(3) UNSIGNED NULL,\
              e3Score TINYINT(3) UNSIGNED NULL, ";
      if (productInfo.pm10 === 1) {
        sqlStr =
          sqlStr +
          "pm10 INT NULL,\
        pm10Index TINYINT(3) UNSIGNED NULL,\
        pm10Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.pm25 === 1) {
        sqlStr =
          sqlStr +
          "pm25 INT NULL,\
      pm25Index TINYINT(3) UNSIGNED NULL,\
      pm25Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.co2 === 1) {
        sqlStr =
          sqlStr +
          "co2 INT NULL,\
        co2Index TINYINT(3) UNSIGNED NULL,\
        co2Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.hcho === 1) {
        sqlStr =
          sqlStr +
          "hcho INT NULL,\
        hchoIndex TINYINT(3) UNSIGNED NULL,\
        hchoAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.voc === 1) {
        sqlStr =
          sqlStr +
          "voc INT NULL,\
        vocIndex TINYINT(3) UNSIGNED NULL,\
        vocAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.temperature === 1) {
        sqlStr =
          sqlStr +
          "temperature FLOAT,\
        temperatureIndex TINYINT(3) UNSIGNED NULL,\
        temperatureAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.humidity === 1) {
        sqlStr =
          sqlStr +
          "humidity FLOAT,\
        humidityIndex TINYINT(3) UNSIGNED NULL,\
        humidityAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.noise === 1) {
        sqlStr =
          sqlStr +
          "noise INT NULL,\
        noiseIndex TINYINT(3) UNSIGNED NULL,\
        noiseAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.co === 1) {
        sqlStr =
          sqlStr +
          "co INT NULL,\
        coIndex TINYINT(3) UNSIGNED NULL,\
        coAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      sqlStr =
        sqlStr +
        " PRIMARY KEY (`id`),\
                INDEX " +
        "index_" +
        tableName +
        " (date ASC))";

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
    info,
    co2_org,   // 여기부터, 배율적용으로 인한 추가 
    hcho_org,
    voc_org,
    noise_org,
    co_org,
    pm10_org,
    pm25_org,
    temperature_org,
    humidity_org,  // 여기까지 , 배율적용으로 인한 추가 
    callback
  ) {
    console.log("addData 호출됨");

    //console.log("#######111################:"+pm10_org);
    //console.log("#######111################:"+pm25_org);

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
      var data = { date: date, e3Index: total.index, e3Score: total.score };
      if (info.pm10) {
        data.pm10 = pm10.value;
        data.pm10Index = pm10.index;
        data.pm10Alarm = pm10.alarm;
      }
      if (info.pm25) {
        data.pm25 = pm25.value;
        data.pm25Index = pm25.index;
        data.pm25Alarm = pm25.alarm;
      }
      if (info.co2) {
        data.co2 = co2.value;
        data.co2Index = co2.index;
        data.co2Alarm = co2.alarm;
      }
      if (info.hcho) {
        data.hcho = hcho.value;
        data.hchoIndex = hcho.index;
        data.hchoAlarm = hcho.alarm;
      }
      if (info.voc) {
        data.voc = voc.value;
        data.vocIndex = voc.index;
        data.vocAlarm = voc.alarm;
      }
      if (info.temperature) {
        data.temperature = temperature.value;
        data.temperatureIndex = temperature.index;
        data.temperatureAlarm = temperature.alarm;
      }
      if (info.humidity) {
        data.humidity = humidity.value;
        data.humidityIndex = humidity.index;
        data.humidityAlarm = humidity.alarm;
      }
      if (info.noise) {
        data.noise = noise.value;
        data.noiseIndex = noise.index;
        data.noiseAlarm = noise.alarm;
      }
      if (info.co) {
        data.co = co.value;
        data.coIndex = co.index;
        data.coAlarm = co.alarm;
      }

      // 배율조정...start
      data.pm10_org = pm10_org; 
      data.pm25_org = pm25_org;
      data.co2_org = co2_org;
      data.hcho_org = hcho_org;
      data.voc_org = voc_org;
      data.temperature_org = temperature_org;
      data.humidity_org = humidity_org;
      data.noise_org = noise_org;
      data.co_org = co_org;
      // 배율조정.... end

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
          var success = true;
          callback(null, success);
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
