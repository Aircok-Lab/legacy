var pool = require("../config/database");

var Device = {
  getAllDeviceByPositionId: function(positionId, callback) {
    console.log("getAllDeviceByPositionId 호출됨");

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
        "select Building.Name as buildingName , Position.Name as positionName, Device.* from  Position, Building, Device, Product where Device.positionID in (" +
        positionId +
        ") and Device.productID = Product.id and Device.positionID = Position.id and Position.buildingID = Building.id order by buildingName, positionName desc";

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
        var allDevices = json;

        callback(null, allDevices);
      });
    });
  },
  getDeviceById: function(serialNumber, callback) {
    console.log("getDeviceById 호출됨");

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
        "Select * from Device where serialNumber=?",
        serialNumber,
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
          var DeviceInfo = json;

          callback(null, DeviceInfo);
        }
      );
    });
  },
  getBuildingType: function(deviceSN, callback) {
    console.log("getBuildingType 호출됨 deviceSN : " + deviceSN);
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
        "select buildingType from Device where serialNumber = ?",
        deviceSN,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }
          console.dir(result);
          var buildingType = result[0].buildingType;

          callback(null, buildingType);
        }
      );
    });
  },
  getDeviceByPositionId: function(positionId, callback) {
    console.log("getDeviceByPositionId 호출됨 positionId : " + positionId);
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
      var queryString =
        "select Device.*,  Product.name as productName, Product.period from Device, Product where Device.positionID in (" +
        positionId +
        ") and Device.productID = Product.id";

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
        var deviceByPositionId = json;

        callback(null, deviceByPositionId);
      });
    });
  },
  getDeviceCountByPositionId: function(positionId, callback) {
    console.log("getDeviceCountByPositionId 호출됨 positionId : " + positionId);
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
        "select * from Device where positionID=?",
        positionId,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }
          var deviceCountByPositionId = result;

          callback(null, deviceCountByPositionId);
        }
      );
    });
  },
  getDeviceByBuildingId: function(buildingId, callback) {
    console.log("getDeviceByBuildingId 호출됨 buildingId : " + buildingId);
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
        "select Device.*,  Product.name as productName, Product.period from Device, Product where Device.positionID in (\
                select Position.id as positionID\
                from Building, Position\
                where  Building.id in (" +
        buildingId +
        ") and Building.id = Position.buildingID) and Device.productID = Product.id";

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
        var deviceByBuildingId = json;

        callback(null, deviceByBuildingId);
      });
    });
  },
  addDevice: function(
    name,
    serialNumber,
    phone,
    ip,
    positionID,
    productID,
    imei,
    gateway,
    subnet,
    networkType,
    callback
  ) {
    console.log("addDevice 호출됨");

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
        name: name,
        serialNumber: serialNumber,
        phone: phone,
        ip: ip,
        positionID: positionID,
        productID: productID,
        imei: imei,
        gateway: gateway,
        subnet: subnet,
        networkType: networkType
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into Device set ?", data, function(
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
  updateDevice: function(
    name,
    serialNumber,
    phone,
    ip,
    positionID,
    productID,
    imei,
    gateway,
    subnet,
    networkType,
    callback
  ) {
    console.log("updateDevice 호출됨");

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
      var data = [
        name,
        phone,
        ip,
        positionID,
        productID,
        imei,
        gateway,
        subnet,
        networkType,
        serialNumber
      ];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update Device set name=?, phone=?, ip=?, positionID=?, productID=?, imei=?, gateway=?, subnet=?, networkType=? where serialNumber=?",
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
  deleteDevice: function(deviceSerialNumber, callback) {
    console.log(
      "deleteDevice 호출됨 deviceSerialNumber : " + deviceSerialNumber
    );
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
      var serials = deviceSerialNumber.split(",");
      console.log(serials);
      var queryString = "delete from Device where ";
      for (i in serials) {
        let str = "serialNumber='" + serials[i] + "'";
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
  },
  getDeviceInfo: function(deviceSerialNumber, callback) {
    console.log(
      "getDeviceInfo 호출됨 deviceSerialNumber : " + deviceSerialNumber
    );
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      var exec = conn.query(
        "select buildingType, version, period, indoor from Device, Product where Device.productID = Product.id and Device.serialNumber=?",
        deviceSerialNumber,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }
          console.log(result);
          var info = result[0];
          callback(null, info);
        }
      );
    });
  }
};
module.exports = Device;
