var pool = require("../config/database");

var Building = {
  getAllBuilding: function(callback) {
    console.log("getAllBuilding 호출됨");

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
      var exec = conn.query("Select * from Building", function(err, result) {
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
        var allBuildings = json;

        callback(null, allBuildings);
      });
    });
  },
  getBuildingById: function(buildingId, callback) {
    console.log("getBuildingById 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      var queryString =
        "Select * from Building where id in(" + buildingId + ")";

      // var ids = buildingId.split(",");
      // console.log(ids);
      // var queryString = 'Select * from Building where ';
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
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        console.log(">> json: ", json);
        var builingInfo = json;

        callback(null, builingInfo);
      });
    });
  },
  addBuilding: function(name, address, latitude, longitude, callback) {
    console.log("addBuilding 호출됨");

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
        Name: name,
        Address: address,
        Latitude: latitude,
        Longitude: longitude
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into Building set ?", data, function(
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
  updateBuilding: function(id, name, address, latitude, longitude, callback) {
    console.log("updateBuilding 호출됨");

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
      var data = [name, address, latitude, longitude, id];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update Building set Name=?, Address=?, Latitude=?, Longitude=? where id=?",
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
          // console.log('>> result: ', result );
          var string = JSON.stringify(result);
          // console.log('>> string: ', string );
          var json = JSON.parse(string);
          console.log(">> json: ", json);
          var builingInfo = json;

          callback(null, builingInfo);
        }
      );
    });
  },
  deleteBuilding: function(buildingId, callback) {
    console.log("deleteBuilding 호출됨 buildingId : " + buildingId);
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
      var queryString = "delete from Building where id=" + buildingId;

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
module.exports = Building;
