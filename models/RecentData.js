var pool = require("../config/database");

var RecentData = {
  getRecentDataById: function(id, callback) {
    console.log("getRecentDataById 호출됨");

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
      var exec = conn.query("Select * from RecentData where id=?", id, function(
        err,
        result
      ) {
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
        var recentDataInfo = json;

        callback(null, recentDataInfo);
      });
    });
  },
  getRecentDataByPositionId: function(positionID, callback) {
    console.log("getRecentDataById 호출됨");

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
      var queryString =
        "Select Building.name as buildingName , Position.name as positionName, RecentData.* from RecentData, Position, Building, Device\
        where RecentData.deviceSN = Device.serialNumber and  Device.positionID = Position.id and Position.buildingID = Building.id and Position.id in(" +
        positionID +
        ")";
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
        console.log(">> json: ", json);
        var recentDataInfo = json;

        callback(null, recentDataInfo);
      });
    });
  },
  getRecentDataByDeviceSN: function(deviceSN, callback) {
    console.log("getRecentDataById 호출됨");

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
      var queryString =
        "select Building.Name as buildingName , Position.Name as positionName, RecentData.* from RecentData, Position, Building, Device\
        where RecentData.DeviceSN = Device.SerialNumber and  Device.PositionID = Position.id and Position.BuildingID = Building.id and RecentData.deviceSN in(" +
        deviceSN +
        ")";
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
        console.log(">> json: ", json);
        var recentDataInfo = json;

        callback(null, recentDataInfo);
      });
    });
  },
  addRecentData: function(
    pm10,
    pm25,
    co2,
    hcho,
    voc,
    temperature,
    humidity,
    noise,
    totalScore,
    date,
    deviceSN,
    callback
  ) {
    console.log("addRecentData 호출됨");

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
      var data = {
        pm10: pm10.value,
        pm25: pm25.value,
        co2: co2.value,
        hcho: hcho.value,
        voc: voc.value,
        temperature: temperature.value,
        humidity: humidity.value,
        noise: noise.value,
        date: date,
        deviceSN: deviceSN,
        e3Index: totalScore,
        pm10Index: pm10.index,
        pm25Index: pm25.index,
        co2Index: co2.index,
        hchoIndex: hcho.index,
        vocIndex: voc.index,
        temperatureIndex: temperature.index,
        humidityIndex: humidity.index,
        noiseIndex: noise.index,
        pm10Alarm: pm10.alarm,
        pm25Alarm: pm25.alarm,
        co2Alarm: co2.alarm,
        hchoAlarm: hcho.alarm,
        vocAlarm: voc.alarm,
        temperatureAlarm: temperature.alarm,
        humidityAlarm: humidity.alarm,
        noiseAlarm: noise.alarm
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into RecentData set ?", data, function(
        err,
        result
      ) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }

        callback(null, result);
      });
    });
  },
  updateRecentData: function(
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
    console.log("updateRecentData 호출됨");

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
      var value = {
        pm10: pm10.value,
        pm25: pm25.value,
        co2: co2.value,
        hcho: hcho.value,
        voc: voc.value,
        temperature: temperature.value,
        humidity: humidity.value,
        noise: noise.value,
        date: date,
        insertDate: new Date(),
        e3Index: total.index,
        e3Score: total.score,
        pm10Index: pm10.index,
        pm25Index: pm25.index,
        co2Index: co2.index,
        hchoIndex: hcho.index,
        vocIndex: voc.index,
        temperatureIndex: temperature.index,
        humidityIndex: humidity.index,
        noiseIndex: noise.index,
        pm10Alarm: pm10.alarm,
        pm25Alarm: pm25.alarm,
        co2Alarm: co2.alarm,
        hchoAlarm: hcho.alarm,
        vocAlarm: voc.alarm,
        temperatureAlarm: temperature.alarm,
        humidityAlarm: humidity.alarm,
        noiseAlarm: noise.alarm
      };

      var data = [value, deviceSN];
      // SQL문을 실행합니다.
      var exec = conn.query(
        "update RecentData set ? where deviceSN=?",
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
  deleteRecentDataByID: function(dataId, callback) {
    console.log("deleteRecentData 호출됨 dataId : " + dataId);
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
      var queryString = "delete from RecentData where id in(" + dataId + ")";

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
        var success = true;
        callback(null, success);
      });
    });
  },
  deleteRecentDataBySN: function(serialNumber, callback) {
    console.log("deleteRecentData 호출됨 serialNumber : " + serialNumber);
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
      var serials = serialNumber.split(",");
      console.log(serials);
      var queryString = "delete from RecentData where ";
      for (i in serials) {
        let str = "deviceSN='" + serials[i] + "'";
        queryString = queryString + str;
        if (i < serials.length - 1) queryString = queryString + " or ";
      }

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
        var success = true;
        callback(null, success);
      });
    });
  }
};
module.exports = RecentData;
