var pool = require("../config/database");

var AlarmTable = {
  getAlarmBySensorType: function(sensorType, callback) {
    console.log("getAlarmTableBySensorType 호출됨");

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
      var exec = conn.query(
        "Select AlarmValue from AlarmTable where SensorType=?",
        sensorType,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }
          console.log(">> result[0].AlarmValue: " + result[0].AlarmValue);
          var sensorAlarmInfo = result[0].AlarmValue;

          callback(null, sensorAlarmInfo);
        }
      );
    });
  },
  addAlarmTable: function(sensorType, alarmValue, callback) {
    console.log("addAlarmTable 호출됨");

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
      var data = { SensorType: sensorType, AlarmTable: alarmValue };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into AlarmTable set ?", data, function(
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
  updateAlarmTable: function(sensorType, alarmValue, callback) {
    console.log("updateAlarmTable 호출됨");

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
      var data = [alarmValue, sensorType];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update AlarmTable set AlarmValue=? where SensorType=?",
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
          var string = JSON.stringify(result);
          var json = JSON.parse(string);
          console.log(">> json: ", json);
          var sensorAlarmInfo = json;

          callback(null, sensorAlarmInfo);
        }
      );
    });
  },
  deleteAlarmTable: function(id, callback) {
    console.log("deleteAlarmTable 호출됨 id : " + id);
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
      // var ids = id.split(",");
      // console.log(ids);
      // var queryString = 'delete from AlarmTable where ';
      // for (i in ids){
      //     let str = 'id='+ids[i];
      //     queryString = queryString + str;
      //     if( i < (ids.length-1))
      //         queryString = queryString + ' or ';
      // }

      // SQL문을 실행합니다.
      var exec = conn.query("delete from AlarmTable where id = ?", id, function(
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
        var success = "true";
        callback(null, success);
      });
    });
  }
};
module.exports = AlarmTable;
