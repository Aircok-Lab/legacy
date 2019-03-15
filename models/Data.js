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
                Date DATETIME NULL, ";
      if (productInfo.PM10 === 1) sqlStr = sqlStr + "PM10 INT NULL, ";
      if (productInfo.PM25 === 1) sqlStr = sqlStr + "PM25 INT NULL, ";
      if (productInfo.CO2 === 1) sqlStr = sqlStr + "CO2 INT NULL, ";
      if (productInfo.HCHO === 1) sqlStr = sqlStr + "HCHO INT NULL, ";
      if (productInfo.VOC === 1) sqlStr = sqlStr + "VOC INT NULL, ";
      if (productInfo.Temperature === 1)
        sqlStr = sqlStr + "Temperature FLOAT, ";
      if (productInfo.Humidity === 1) sqlStr = sqlStr + "Humidity FLOAT, ";
      if (productInfo.Noise === 1) sqlStr = sqlStr + "Noise INT NULL, ";
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
    pm25,
    pm10,
    co2,
    hcho,
    voc,
    temperature,
    humidity,
    noise,
    date,
    deviceSN,
    callback
  ) {
    console.log("addData 호출됨");

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
      var data = { Date: date };
      if (pm25) data.PM25 = pm25;
      if (pm10) data.PM10 = pm10;
      if (co2) data.CO2 = co2;
      if (hcho) data.HCHO = hcho;
      if (voc) data.VOC = voc;
      if (temperature) data.Temperature = temperature;
      if (humidity) data.Humidity = humidity;
      if (noise) data.Noise = noise;
      // {PM25:pm25, PM10:pm10, CO2:co2, HCHO:hcho, VOC:voc,
      //     Temperature:temperature, Humidity:humidity, Noise:noise, Date:date, DeviceSN:deviceSN};

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

          callback(null, result);
        }
      );
    });
  },
  // updateData:function(id, pm25, pm10, co2, hcho, voc, temperature, humidity, noise, date, deviceSN, callback){
  //     console.log('updateData 호출됨');

  //     pool.getConnection(function(err, conn){
  //         if(err){
  //             if(conn){
  //                 conn.release(); // 반드시 해제해야 합니다.
  //             }

  //             callback(err, null);
  //             return;
  //         }
  //         console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

  //         // 데이터를 객체로 만듭니다.
  //         var tableName = 'Data_'+deviceSN;
  //         var data = [pm25, pm10, co2, hcho, voc, temperature, humidity, noise, date, deviceSN, id];

  //         // SQL문을 실행합니다.
  //         var exec = conn.query('update '+tableName+' set PM25=?, PM10=?, CO2=?, HCHO=?, VOC=?, Temperature=?, Humidity=?, Noise=?, Date=?, where id=?', data, function(err, result){
  //             conn.release(); // 반드시 해제해야 합니다.
  //             console.log('실행 대상 SQL : ' + exec.sql);

  //             if(err) {
  //                 console.log('SQL 실행 시 오류 발생함');
  //                 console.dir(err);

  //                 callback(err, null);
  //                 return;
  //             }
  //             var string=JSON.stringify(result);
  //             var json =  JSON.parse(string);
  //             console.log('>> json: ', json);
  //             var dataInfo = json;

  //             callback(null, dataInfo);
  //         });
  //     });
  // },
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
