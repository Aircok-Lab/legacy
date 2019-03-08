var pool = require("../config/database");

var IndexTable = {
  getIndexTableBySensorType: function(sensorType, callback) {
    console.log("getIndexTableBySensorType 호출됨");

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
        "Select * from IndexTable where SensorType=?",
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
          var string = JSON.stringify(result);
          var json = JSON.parse(string);
          console.log(">> json: ", json);
          var sensorIndexInfo = json;

          callback(null, sensorIndexInfo);
        }
      );
    });
  },
  addIndexTable: function(sensorType, grade, min, max, callback) {
    console.log("addIndexTable 호출됨");

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
      var data = { SensorType: sensorType, Grade: grade, Min: min, Max: max };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into IndexTable set ?", data, function(
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
  updateIndexTable: function(sensorType, grade, min, max, callback) {
    console.log("updateIndexTable 호출됨");

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
      var data = [min, max, sensorType, grade];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update IndexTable set Min=?, Max=? where SensorType=? and Grade=?",
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
          var success = false;
          if(result.changedRows > 0)
            success = true;

          callback(null, success);
        }
      );
    });
  },
  deleteIndexTable: function(IndexTableid, callback) {
    console.log("deleteIndexTable 호출됨 IndexTableid : " + IndexTableid);
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
      var queryString = "delete from IndexTable where id=" + IndexTableid;
      // var ids = IndexTableid.split(",");
      // console.log(ids);
      // var queryString = 'delete from IndexTable where ';
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
module.exports = IndexTable;
