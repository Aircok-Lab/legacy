var pool = require("../config/database");

var SmsMesage = {
  makeMessage: function(serialNumber, positionID, callback) {
    console.log("makeMessage 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      sqlStr =
        "select User.phone as phone, Device.name as deviceName, RecentData.* from Device, User, RecentData " +
        "where Device.serialNumber = '" +
        serialNumber +
        "' and Device.positionID = '" +
        positionID +
        "' and User.userType = 'master' and RecentData.deviceSN = Device.serialNumber";

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
        var smsInfo = json;
        let alarmCnt = 0;
        let message = "";

        if (smsInfo.length) {
          var deviceInfo = json[0];
          message = deviceInfo.deviceName + " 측정기는";
          if (deviceInfo.phone) {
            if (deviceInfo.pm10Alarm) {
              alarmCnt++;
              message += " 미세먼지,";
            }
            if (deviceInfo.pm25Alarm) {
              alarmCnt++;
              message += " 초미세먼지,";
            }
            if (deviceInfo.co2Alarm) {
              alarmCnt++;
              message += " 이산화탄소,";
            }
            if (deviceInfo.hchoAlarm) {
              alarmCnt++;
              message += " 포름알데히드,";
            }
            if (deviceInfo.vocAlarm) {
              alarmCnt++;
              message += " 휘발성유기화합물,";
            }
            if (deviceInfo.humidityAlarm) {
              alarmCnt++;
              message += " 습도,";
            }
            if (deviceInfo.temperatureAlarm) {
              alarmCnt++;
              message += " 온도,";
            }
            
            if (deviceInfo.noiseAlarm) {
              alarmCnt++;
              message += " 소음,";
            }
            if (deviceInfo.coAlarm) {
              alarmCnt++;
              message += " 일산화탄소,";
            }
            if (alarmCnt > 0) {
              if (message.endsWith(",")) message = message.slice(0, -1);
              message = message + " 총 " + alarmCnt + "건의 알람이 발생하였습니다.";
            } else message = message + " 알람 내역 없이 잘 관리되고 있습니다.";
          } else {
            message = message + " 관리자가 없습니다.";
          }
        }
        console.log(message);
        smsInfo.message = message;

        callback(null, smsInfo);
      });
    });
  }
};
module.exports = SmsMesage;
