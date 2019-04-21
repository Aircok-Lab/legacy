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
        "where Device.serialNumber = " +
        serialNumber +
        "and instr(User.positionList, /" +
        positionID +
        ",/) > 0 " +
        "and User.userType = manager " +
        "and RecentData.deviceSN = " +
        serialNumber;

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

        callback(null, smsInfo);
      });
    });
  }
};
module.exports = SmsMesage;
