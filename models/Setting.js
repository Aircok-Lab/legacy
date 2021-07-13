var pool = require("../config/database");

var Setting = {
  getSettingById: function(id, callback) {
    console.log("getSettingById 호출됨");

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
      var exec = conn.query("Select * from Setting where id=?", id, function(
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
        var settingInfo = json;

        callback(null, settingInfo);
      });
    });
  },
  addSetting: function(scrollRow, scrollTime, monitoringTime, callback) {
    console.log("addSetting 호출됨");

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
        ScrollRow: scrollRow,
        ScrollTime: scrollTime,
        MonitoringTime: monitoringTime
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into Setting set ?", data, function(
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
  updateSetting: function(id, scrollRow, scrollTime, monitoringTime, callback) {
    console.log("updateSetting 호출됨");

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
      var data = [scrollRow, scrollTime, monitoringTime, id];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update Setting set scrollRow=?, scrollTime=?, monitoringTime=? where id=?",
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
          if (result.changedRows > 0) success = true;

          callback(null, success);
        }
      );
    });
  },
  deleteSetting: function(settingId, callback) {
    console.log("deleteSetting 호출됨 settingId : " + settingId);
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
      var queryString = "delete from Setting where id in(" + settingId + ")";

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
  updateIrSetting: function(serialNumber, pm10_gang_start, pm10_gang_end, pm10_jung_start, pm10_jung_end, pm10_yag_start,
                            pm10_yag_end, pm25_gang_start, pm25_gang_end, pm25_jung_start, pm25_jung_end, pm25_yag_start,   
                            pm25_yag_end, temperature, co2, callback) {
    console.log("updateIrSetting 호출됨");

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
        pm10_gang_start:pm10_gang_start,     
        pm10_gang_end:pm10_gang_end,         
        pm10_jung_start:pm10_jung_start,     
        pm10_jung_end:pm10_jung_end,         
        pm10_yag_start:pm10_yag_start,       
        pm10_yag_end:pm10_yag_end,           
        pm25_gang_start:pm25_gang_start,     
        pm25_gang_end:pm25_gang_end,         
        pm25_jung_start:pm25_jung_start,     
        pm25_jung_end:pm25_jung_end,         
        pm25_yag_start:pm25_yag_start,       
        pm25_yag_end:pm25_yag_end,           
        temperature:temperature,
        co2:co2
      };                                     


      // 데이터를 객체로 만듭니다.
      //var data = [scrollRow, scrollTime, monitoringTime, id];
      var data = [value, serialNumber];
      // SQL문을 실행합니다.
      var exec = conn.query(
        // "update Setting set scrollRow=?, scrollTime=?, monitoringTime=? where id=?",
        "update DeviceIrYul set ? where serialNumber=?",
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
          if (result.changedRows > 0) success = true;

          callback(null, success);
        }
      );
    });
  },
  getIrSettingBySn: function(serialNumber, callback) {
    console.log("getIrSettingBySn 호출됨");

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
      var exec = conn.query("Select * from DeviceIrYul where serialNumber=?", serialNumber, function(
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
        var settingInfo = json;

        callback(null, settingInfo);
      });
    });
  },
  addIrSetting: function(serialNumber, pm10_gang_start, pm10_gang_end, pm10_jung_start, pm10_jung_end, 
    pm10_yag_start, pm10_yag_end, pm25_gang_start, pm25_gang_end, pm25_jung_start, 
    pm25_jung_end, pm25_yag_start, pm25_yag_end, temperature, co2, callback) {
    console.log("addIrSetting 호출됨");

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
        serialNumber:serialNumber, 
        pm10_gang_start:pm10_gang_start, 
        pm10_gang_end:pm10_gang_end, 
        pm10_jung_start:pm10_jung_start, 
        pm10_jung_end:pm10_jung_end, 
        pm10_yag_start:pm10_yag_start, 
        pm10_yag_end:pm10_yag_end, 
        pm25_gang_start:pm25_gang_start, 
        pm25_gang_end:pm25_gang_end, 
        pm25_jung_start:pm25_jung_start, 
        pm25_jung_end:pm25_jung_end, 
        pm25_yag_start:pm25_yag_start, 
        pm25_yag_end:pm25_yag_end, 
        temperature:temperature, 
        co2:co2
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into DeviceIrYul set ?", data, function(
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
  getIrSettings: function(serialNumber, callback) {
    console.log("getIrSettingBySn 호출됨");

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
      var exec = conn.query("Select * from DeviceIrYul ", serialNumber, function(
        err,
        result
      ) {
        conn.release(); // 반드시 해제해야 합니다.
        // console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        // console.log(">> json: ", json);
        var settingInfo = json;

        callback(null, settingInfo);
      });
    });
  }
};
module.exports = Setting;
