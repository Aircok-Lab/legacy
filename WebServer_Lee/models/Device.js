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
        "select Building.Name as buildingName , Position.Name as positionName, Product.Name as productName, Product.period, Device.* from  Position, Building, Device, Product where Device.positionID in (" +
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
  getDeviceFaultListByBuildingId: function(buildingId, callback) {
    console.log("getDeviceFaultListByBuildingId 호출됨 buildingId : " + buildingId);
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      var queryString = " select deviceId, branchName, facilityName, deviceName, deviceCode, v_PM10, v_PM25, v_CO2, v_HCHO, v_VOC, v_TEMPERATURE, v_HUMIDITY, v_NOISE, v_CO, ";
          queryString += "       v_MEASURED_AT, v_M, v_H, v_D, v_GUBUN, v_IMPT ";
          queryString += "from ";
          queryString += "( ";
          queryString += "select ver1.deviceId, ver1.branchName, ver1.facilityName, ver1.deviceName, ver1.deviceCode,  ";
          queryString += "               max(ver1.v_PM10)        as v_PM10, ";
          queryString += "               max(ver1.v_PM25)        as v_PM25, ";        
          queryString += "               max(ver1.v_CO2)         as v_CO2,  ";        
          queryString += "               max(ver1.v_HCHO)        as v_HCHO, ";        
          queryString += "               max(ver1.v_VOC)         as v_VOC,  ";        
          queryString += "               max(ver1.v_TEMPERATURE) as v_TEMPERATURE, ";
          queryString += "               max(ver1.v_HUMIDITY)    as v_HUMIDITY, ";
          queryString += "			   max(ver1.v_NOISE)       as v_NOISE, ";
          queryString += "               0                       as v_CO, ";
          queryString += "               max(ver1.measured_at)   as v_MEASURED_AT, ";
          queryString += "               max(ver1.M)   as v_M, ";
          queryString += "               max(ver1.H)   as v_H, ";
          queryString += "               max(ver1.D)   as v_D, ";
          queryString += "               '1' as v_GUBUN, ";
          queryString += "               max(IMPT) as v_IMPT ";
          queryString += "        from ";
          queryString += "        (  ";
          queryString += "        SELECT t1.id as deviceId, t4.name as branchName,  t1.facility_name as facilityName, t1.name as deviceName, ";
          queryString += "			   t1.device_code as deviceCode,  ";
          queryString += "               t1.device_number as deviceNumber, ";
          queryString += "			   t2.measure_code as measureCode, t2.value, "; 	   			   
          queryString += "               if (t2.measure_code = 'PM10', t2.value, -99) as v_PM10, ";
          queryString += "               if (t2.measure_code = 'PM2.5', t2.value, -99) as v_PM25, ";
          queryString += "               if (t2.measure_code = 'CO2', t2.value, -99) as v_CO2, ";
          queryString += "               if (t2.measure_code = 'HCHO', t2.value, -99) as v_HCHO, ";
          queryString += "               if (t2.measure_code = 'VOC', t2.value, -99) as v_VOC, ";
          queryString += "               if (t2.measure_code = 'TEMPERATURE', t2.value, -99) as v_TEMPERATURE, ";
          queryString += "               if (t2.measure_code = 'HUMIDITY', t2.value, -99) as v_HUMIDITY, ";
          queryString += "               if (t2.measure_code = 'NOISE', t2.value, -99) as v_NOISE, ";
          queryString += "               t1.measured_at, ";
          queryString += "               TIMESTAMPDIFF(MINUTE ,t1.measured_at , now()) M, ";
          queryString += " 			   TIMESTAMPDIFF(HOUR  ,t1.measured_at, now()) H , ";
          queryString += "               TIMESTAMPDIFF(DAY  , t1.measured_at, now()) D, ";
          queryString += "               t5.impt as IMPT ";
          queryString += "		FROM lguplus_test.device t1 ";
          queryString += "        LEFT JOIN lguplus_test.measure_data_temp t2 ON t1.id = t2.device_id AND t2.measured_at = (SELECT MAX(measured_at) FROM lguplus_test.measure_data_temp WHERE device_id = t1.id) ";
          queryString += "		INNER JOIN lguplus_test.branch t4 ON t1.branch_id = t4.id ";
          queryString += "        LEFT JOIN  monitoring.deviceExcept t5 ON t1.device_code = t5.imei  ";
          queryString += "        WHERE t5.gubun = '1' AND t5.bigo = '유지' ";
          if (buildingId && buildingId.length > 2) {                
            queryString += "        and t4.name = '"+buildingId+"'";    
          }                                                         
          queryString += "        ) ver1  ";
          queryString += "        group by ver1.deviceId, ver1.branchName, ver1.facilityName, ver1.deviceName, ver1.deviceCode  ";
          queryString += "  UNION ALL ";
          queryString += "Select t1.serialNumber, t3.name as buildingName , t2.name as positionName, t1.name as deviceName,  t1.imei, ";
          queryString += "       t4.pm10,  ";
          queryString += "       t4.pm25,  ";
          queryString += "       t4.co2, "; 
          queryString += "       t4.hcho, "; 
          queryString += "       t4.voc,  ";
          queryString += "       t4.temperature,  ";
          queryString += "       t4.humidity,  ";
          queryString += "       t4.noise,  ";
          queryString += "       t4.co, ";
          queryString += "       t4.date, ";
          queryString += "       TIMESTAMPDIFF(MINUTE ,t4.date, now()) M, ";
          queryString += "	   TIMESTAMPDIFF(HOUR  ,t4.date, now()) H , ";
          queryString += "       TIMESTAMPDIFF(DAY  ,t4.date, now()) D, ";
          queryString += "       '2' as v_GUBUN, ";
          queryString += "       t5.impt as v_IMPT ";
          queryString += "from monitoring.Device t1 ";
          queryString += " inner join  monitoring.Position t2 on t1.positionID = t2.id  ";
          queryString += " inner join  monitoring.Building t3 on t2.buildingID = t3.id ";
          queryString += " left  join  monitoring.RecentData t4 on t1.serialNumber = t4.deviceSN ";
          queryString += " LEFT JOIN  monitoring.deviceExcept t5 ON t1.serialNumber = t5.serialNumber  ";
          queryString += " WHERE t5.gubun = '2' AND t5.bigo = '유지' ";
          if (buildingId && buildingId.length > 2) {                  
            queryString += " and t3.name = '"+buildingId+"'";  
          } 
          queryString += ") mas ORDER BY branchName, facilityName, deviceName ";

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
  getBuildingListByVer12: function(buildingId, callback) {
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
                    "select distinct name from\
                    (\
                    select id,'1' as gubun, name from lguplus_test.branch\
                    union all\
                    select id, '2' as gubun, name from monitoring.Building\
                    ) m  order by m.name";

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
    reportType,
    dhcp,
    dns,
    upload_url,
    fota_url,
    send_period,
    reset_info,
    version,  
    firmware, 
    checksum, 
    upload_ip,
    fota_ip,
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
        networkType: networkType,
        reportType: reportType,
        dhcp: dhcp,
        dns:dns,
        upload_url:upload_url,
        fota_url:fota_url,
        send_period:send_period,
        reset_info:reset_info,
        version:version,  
        firmware:firmware, 
        checksum:checksum, 
        upload_ip:upload_ip,
        fota_ip:fota_ip
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
  addDevice2: function(
    name,
    serialNumber,
    positionID,
    productID,
    param1,
    param2,
    param3,
    param4,
    param5,
    param6,
    param7,
    param8,
    param9,
    param10,
    param11,
    param12,
    param13,
    param14,
    param15,
    param16,
    param17,
    param18,
    param19,
    param20,
    param21,
    param22,
    param23,
    param24,
    param25,
    param26,
    param27,
    param28,
    param29,
    param30,
    callback
  ) {
    console.log("addDevice2 호출됨");

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
        positionID: positionID,
        productID: productID,
        param1 :  param1,
        param2 :  param2,
        param3 :  param3,
        param4 :  param4,
        param5 :  param5,
        param6 :  param6,
        param7 :  param7,
        param8 :  param8,
        param9 :  param9,
        param10 : param10,
        param11 : param11,
        param12 : param12,
        param13 : param13,
        param14 : param14,
        param15 : param15,
        param16 : param16,
        param17 : param17,
        param18 : param18,
        param19 : param19,
        param20 : param20,
        param21 : param21,
        param22 : param22,
        param23 : param23,
        param24 : param24,
        param25 : param25,
        param26 : param26,
        param27 : param27,
        param28 : param28,
        param29 : param29,
        param30 : param30,
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into Device2 set ?", data, function(
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
    reportType,
    dhcp,
    dns,
    upload_url,
    fota_url,
    send_period,
    reset_info,
    version,  
    firmware, 
    checksum, 
    upload_ip,
    fota_ip,
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
        reportType,
        dhcp,        
        dns,
        upload_url,
        fota_url,
        send_period,
        reset_info,
        version,  
        firmware, 
        checksum, 
        upload_ip,
        fota_ip,
        serialNumber        
      ];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update Device set name=?, phone=?, ip=?, positionID=?, productID=?, imei=?, gateway=?, subnet=?,\
           networkType=?, reportType=?, dhcp=?, dns=?, upload_url=?, fota_url=?, send_period=?, reset_info=?,\
           version=?, firmware=?, checksum=?, upload_ip=?, fota_ip=? where serialNumber=?",
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
  },
  addDeviceYul: function(
    serialNumber,
    sensorType,
    min,
    max,
    calc,
    callback
  ) {
    console.log("addDeviceYul 호출됨");

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
        serialNumber: serialNumber,
        sensorType: sensorType,
        min: min,
        max: max,
        calc: calc
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into DeviceYul set ?", data, function(
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
  getDeviceYulBySerailNumber: function(serialNumber, callback) {
    console.log("getDeviceYulBySerailNumber 호출됨");
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
      var exec = conn.query("select  * from monitoring.DeviceYul ", function(
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
        var devicesyul = json;

        callback(null, devicesyul);
      });
    });
  },
  updateDeviceYul: function(
    id,
    serialNumber,
    sensorType,
    min,
    max,
    calc,
    callback
  ) {
    console.log("updateDeviceYul 호출됨");

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
        serialNumber,
        sensorType,
        min,
        max,
        calc,
        id
      ];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update DeviceYul set serialNumber=?, sensorType=?, min=?, max=?, calc=? where id=?",
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
  deleteDeviceYul: function(id, callback) {
    console.log( "deleteDeviceYul 호출됨 id : " + id );
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

   
      var queryString = "delete from DeviceYul where id = "+ id;
   

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
  deleteIrDevice: function(id, callback) {
    console.log( "deleteDeviceYul 호출됨 id : " + id );
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

   
      var queryString = "delete from DeviceIrYul where serialNumber = "+ id;
   

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
module.exports = Device;
