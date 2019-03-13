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
                E3Index TINYINT(3) UNSIGNED NULL,\
                E3Score TINYINT(3) UNSIGNED NULL, ";
      if (productInfo.PM10 === 1) {
        sqlStr =
          sqlStr +
          "PM10Index TINYINT(3) UNSIGNED NULL,\
                PM10Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.PM25 === 1) {
        sqlStr =
          sqlStr +
          "PM25Index TINYINT(3) UNSIGNED NULL,\
                PM25Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.CO2 === 1) {
        sqlStr =
          sqlStr +
          "CO2Index TINYINT(3) UNSIGNED NULL,\
                CO2Alarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.HCHO === 1) {
        sqlStr =
          sqlStr +
          "HCHOIndex TINYINT(3) UNSIGNED NULL,\
                HCHOAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.VOC === 1) {
        sqlStr =
          sqlStr +
          "VOCIndex TINYINT(3) UNSIGNED NULL,\
                VOCAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.Temperature === 1) {
        sqlStr =
          sqlStr +
          "TemperatureIndex TINYINT(3) UNSIGNED NULL,\
                TemperatureAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.Humidity === 1) {
        sqlStr =
          sqlStr +
          "HumidityIndex TINYINT(3) UNSIGNED NULL,\
                HumidityAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
      }
      if (productInfo.Noise === 1) {
        sqlStr =
          sqlStr +
          "NoiseIndex TINYINT(3) UNSIGNED NULL,\
                NoiseAlarm TINYINT(4) UNSIGNED NULL DEFAULT 0, ";
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
      var data = { Date: date, E3Index: total.index, E3Score: total.score };
      if (pm10.value) {
        data.PM10Index = pm10.index;
        data.PM10Alarm = pm10.alarm;
      }
      if (pm25.value) {
        data.PM25Index = pm25.index;
        data.PM25Alarm = pm25.alarm;
      }
      if (co2.value) {
        data.CO2Index = co2.index;
        data.CO2Alarm = co2.alarm;
      }
      if (hcho.value) {
        data.HCHOIndex = hcho.index;
        data.HCHOAlarm = hcho.alarm;
      }
      if (voc.value) {
        data.VOCIndex = voc.index;
        data.VOCAlarm = voc.alarm;
      }
      if (temperature.value) {
        data.TemperatureIndex = temperature.index;
        data.TemperatureAlarm = temperature.alarm;
      }
      if (humidity.value) {
        data.HumidityIndex = humidity.index;
        data.HumidityAlarm = humidity.alarm;
      }
      if (noise.value) {
        data.NOISEIndex = noise.index;
        data.NOISEAlarm = noise.alarm;
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
  // updateAlarm: function(
  //   id,
  //   pm25,
  //   pm10,
  //   co2,
  //   hcho,
  //   voc,
  //   temperature,
  //   humidity,
  //   noise,
  //   date,
  //   deviceSN,
  //   callback
  // ) {
  //   console.log("updateAlarm 호출됨");

  //   pool.getConnection(function(err, conn) {
  //     if (err) {
  //       if (conn) {
  //         conn.release(); // 반드시 해제해야 합니다.
  //       }

  //       callback(err, null);
  //       return;
  //     }
  //     console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

  //     // 데이터를 객체로 만듭니다.
  //     var tableName = "Alarm_" + deviceSN;
  //     var data = [
  //       pm25,
  //       pm10,
  //       co2,
  //       hcho,
  //       voc,
  //       temperature,
  //       humidity,
  //       noise,
  //       date,
  //       deviceSN,
  //       id
  //     ];

  //     // SQL문을 실행합니다.
  //     var exec = conn.query(
  //       "update " +
  //         tableName +
  //         " set PM25=?, PM10=?, CO2=?, HCHO=?, VOC=?, Temperature=?, Humidity=?, Noise=?, Date=?, DeviceSN=? where id=?",
  //       data,
  //       function(err, result) {
  //         conn.release(); // 반드시 해제해야 합니다.
  //         console.log("실행 대상 SQL : " + exec.sql);

  //         if (err) {
  //           console.log("SQL 실행 시 오류 발생함");
  //           console.dir(err);

  //           callback(err, null);
  //           return;
  //         }
  //         var string = JSON.stringify(result);
  //         var json = JSON.parse(string);
  //         console.log(">> json: ", json);
  //         var dataInfo = json;

  //         callback(null, dataInfo);
  //       }
  //     );
  //   });
  // },
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
      // var ids = dataId.split(",");
      // console.log(ids);

      // var queryString = 'delete from '+tableName+' where ';
      // for (i in ids){
      //     let str = 'id='+ids[i];
      //     queryString = queryString + str;
      //     if( i < (ids.length-1))
      //         queryString = queryString + ' or ';
      // }

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
  }
};
module.exports = Alarm;
