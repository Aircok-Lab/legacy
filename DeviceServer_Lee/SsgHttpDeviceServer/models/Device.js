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
          // console.dir(result);
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
     //   console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
     //     console.log("SQL 실행 시 오류 발생함");
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
        productID: productID
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into Device set ?", data, function(
        err,
        result
      ) {
        conn.release(); // 반드시 해제해야 합니다.
    //    console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
    //      console.log("SQL 실행 시 오류 발생함");
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
      var data = [name, phone, ip, positionID, productID, serialNumber];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update Device set name=?, phone=?, ip=?, positionID=? ,productID=? where serialNumber=?",
        data,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
        //  console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
        //    console.log("SQL 실행 시 오류 발생함");
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
       // console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
        //  console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var success = "true";
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
        //"select Building.buildingType, Building.isPublicBuilding, Product.* from Device, Product, Position, Building\
        // where Device.productID = Product.id and Device.PositionID = Position.id and Position.BuildingID = Building.id and \
        // Device.serialNumber=?"         
        /* "select Building.buildingType, Building.isPublicBuilding, Product.id, Product.name, Product.version, Product.ip, Product.firmware, \
         Product.period, Product.indoor, Product.filesize, Product.pm25, Product.pm10, Product.co2, Product.hcho, Product.voc, \
         Product.temperature, Product.humidity, Product.noise, Product.co, Device.ip ethernet_ip, Device.subnet, Device.gateway, Device.dhcp, Device.dns, Device.upload_url, Device.fota_url, Device.send_period \
         from Device, Product, Position, Building  where Device.productID = Product.id and Device.PositionID = Position.id  and Position.BuildingID = Building.id and \
         Device.serialNumber=?", */
         /* `select 
          t1.buildingType, t1.isPublicBuilding, t1.id, t1.name, t1.version, t1.ip, t1.firmware, t1.period, t1.indoor, t1.filesize, 
          t1.pm25, t1.pm10, t1.co2, t1.hcho, t1.voc, t1.temperature, t1.humidity, t1.noise, t1.co, t1.ethernet_ip, t1.subnet, t1.gateway, t1.dhcp, t1.dns, 
          t1.upload_url, t1.fota_url, t1.send_period, 
          t2.serialNumber, t2.pm10_gang_start, t2.pm10_gang_end, t2.pm10_jung_start, t2.pm10_jung_end, t2.pm10_yag_start, t2.pm10_yag_end, t2.pm25_gang_start, t2.pm25_gang_end, 
          t2.pm25_jung_start, t2.pm25_jung_end, t2.pm25_yag_start, t2.pm25_yag_end, t2.temperature as temperature_ir, t2.insertDate,t3.pm10 pm10_value, t3.pm25 pm25_value, t3.temperature temperature_value 
          from 
          (
          select  Device.serialNumber, Building.buildingType, Building.isPublicBuilding, Product.id, Product.name, Product.version, Product.ip, Product.firmware, 
                  Product.period, Product.indoor, Product.filesize, Product.pm25, Product.pm10, Product.co2, Product.hcho, Product.voc, 
                  Product.temperature, Product.humidity, Product.noise, Product.co, Device.ip ethernet_ip, Device.subnet, Device.gateway, Device.dhcp, Device.dns, Device.upload_url, Device.fota_url, Device.send_period 
            from Device, Product, Position, Building  
            where Device.productID = Product.id 
              and Device.PositionID = Position.id  
              and Position.BuildingID = Building.id 
              and Device.serialNumber=? ) t1 LEFT JOIN DeviceIrYul t2 on t1.serialNumber = t2.serialNumber
              LEFT JOIN  RecentData t3 ON t1.serialNumber = t3.deviceSN`, */
         `select 
          t1.buildingType, t1.isPublicBuilding, t1.id, t1.name, t1.version, t1.ip, t1.firmware, t1.period, t1.indoor, t1.filesize, 
          t1.pm25, t1.pm10, t1.co2, t1.hcho, t1.voc, t1.temperature, t1.humidity, t1.noise, t1.co, t1.ethernet_ip, t1.subnet, t1.gateway, t1.dhcp, t1.dns, 
          t1.upload_url, t1.fota_url, t1.send_period,t1.reset_info,t1.window_open, 
          t2.serialNumber, t2.pm10_gang_start, t2.pm10_gang_end, t2.pm10_jung_start, t2.pm10_jung_end, t2.pm10_yag_start, t2.pm10_yag_end, t2.pm25_gang_start, t2.pm25_gang_end, 
          t2.pm25_jung_start, t2.pm25_jung_end, t2.pm25_yag_start, t2.pm25_yag_end, t2.temperature as temperature_ir, t2.insertDate, t2.co2 as co2_ir, t1.checksum,t1.upload_ip,t1.fota_ip
          from 
          (
          select  Device.serialNumber, Building.buildingType, Building.isPublicBuilding, Product.id, Product.name, Device.version, Product.ip, Device.firmware, 
                  Product.period, Product.indoor, Product.filesize, Product.pm25, Product.pm10, Product.co2, Product.hcho, Product.voc, 
                  Product.temperature, Product.humidity, Product.noise, Product.co, 
                  Device.ip ethernet_ip, Device.subnet, Device.gateway, Device.dhcp, Device.dns, 
                  Device.upload_url, Device.fota_url, Device.send_period, Device.reset_info, Device.checksum , Device.upload_ip, Device.fota_ip ,Device.window_open
            from Device, Product, Position, Building  
            where Device.productID = Product.id 
              and Device.PositionID = Position.id  
              and Position.BuildingID = Building.id 
              and Device.serialNumber=? ) t1 LEFT JOIN DeviceIrYul t2 on t1.serialNumber = t2.serialNumber`,
        deviceSerialNumber,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
      //    console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
      //      console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }
      //    console.log(result);
          var info = result[0];
          callback(null, info);
        }
      );
    });
  },  
  getDeviceYul: function(deviceSerialNumber, callback) {
    console.log(
      "getDeviceYul 호출됨 deviceSerialNumber : " + deviceSerialNumber
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
        "select serialNumber, sensorType, min, max, calc from monitoring.DeviceYul where serialNumber =  ? and sensorType is not null",        
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
          //console.log(result);
          var string = JSON.stringify(result);
          //var json = JSON.parse(string);          
          //var infoyul = json;
          callback(null, JSON.parse(string));
        }
      );
    });
  },
  updateDeviceResetInfo: function(    
    serialNumber,    
    callback
  ) {
    console.log("updateDeviceResetInfo 호출됨");

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
      var data = [serialNumber];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update Device set reset_info = '0' where serialNumber=?",
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
  }
};
module.exports = Device;
