import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var Device = require("../models/Device");
var Data = require("../models/Data");
var Alarm = require("../models/Alarm");
var Product = require("../models/Product");
// var RecentData = require("../models/RecentData");
var User = require("../models/User");

/* INSERT user */
router.post("/addDevice", function(req, res, next) {
  console.log("/addDevice 호출됨.");

  var paramName = req.body.name || req.query.name;
  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramPhone = req.body.phone || req.query.phone || null;
  var paramIP = req.body.ip || req.query.ip || null;
  var paramPositionID = req.body.positionID || req.query.positionID;
  var paramProductID = req.body.productID || req.query.productID;
  var paramIMEI = req.body.imei || req.query.imei || null;
  var paramGateway = req.body.gateway || req.query.gateway || null;
  var paramSubnet = req.body.subnet || req.query.subnet || null;
  var paramNetworkType =
    req.body.networkType || req.query.networkType || "cellular";
  var paramReportType = req.body.reportType || req.query.reportType;
  var paramDhcp = req.body.dhcp || req.query.dhcp;
  var result = { statusCode: null, message: null, data: null };
  // 20200727 kod 추가
  var paramDns = req.body.dns || req.query.dns;
  var paramUpload_url = req.body.upload_url || req.query.upload_url;
  var paramFota_url = req.body.fota_url || req.query.fota_url;
  var paramSend_period = req.body.send_period || req.query.send_period;
  var paramReset_info = req.body.reset_info || req.query.reset_info;

  var paramVersion = req.body.version || req.query.version;
  var paramFirmware = req.body.firmware || req.query.firmware;
  var paramChecksum = req.body.checksum || req.query.checksum;
  var paramUpload_ip = req.body.upload_ip || req.query.upload_ip;
  var paramFota_ip = req.body.fota_ip || req.query.fota_ip;

  if (!paramName || !paramSerialNumber || !paramPositionID || !paramProductID) {
    result.statusCode = FAIL;
    result.message = "입력 값을 확인하세요";
    res.send(result);
    return;
  }

  console.log(
    "요청 파라미터 : " +
      paramName +
      "," +
      paramSerialNumber +
      "," +
      paramPhone +
      "," +
      paramIP +
      "," +
      paramPositionID +
      "," +
      paramProductID +
      "," +
      paramIMEI +
      "," +
      paramGateway +
      "," +
      paramSubnet +
      "," +
      paramNetworkType +
      "," +
      paramReportType +
      "," +
      paramDhcp
  );

  Device.addDevice(
    paramName,
    paramSerialNumber,
    paramPhone,
    paramIP,
    paramPositionID,
    paramProductID,
    paramIMEI,
    paramGateway,
    paramSubnet,
    paramNetworkType,
    paramReportType,
    paramDhcp,
    paramDns,
    paramUpload_url,
    paramFota_url,
    paramSend_period,
    paramReset_info,
    paramVersion,  
    paramFirmware, 
    paramChecksum, 
    paramUpload_ip,
    paramFota_ip,
    function(err, addedDevice) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
      if (err) {
        console.error("디바이스 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (addedDevice) {
        console.dir(addedDevice);
        console.log("추가된 레코드의 아이디 : " + addedDevice.insertId);
        result.statusCode = OK;
        result.message = "성공";
        result.data = addedDevice.insertId;
        res.send(result);

        Product.getProductById(paramProductID, function(err, productInfo) {
          if (err) {
            console.error("Data table 추가 중 오류 발생 :" + err.stack);
            return;
          }
          if (productInfo) {
            Data.createTable(paramSerialNumber, productInfo[0], function(
              err,
              createDataTable
            ) {
              if (err) {
                console.error("Data table 추가 중 오류 발생 :" + err.stack);
                return;
              }
              if (createDataTable) {
                console.log("Data table 추가 성공");
              } else {
                console.log("createDataTable 정보가 없음");
              }
            });

            // Alarm.createTable(paramSerialNumber, productInfo[0], function(
            //   err,
            //   createAlarmTable
            // ) {
            //   if (err) {
            //     console.error("Alarm table 추가 중 오류 발생 :" + err.stack);
            //     return;
            //   }
            //   if (createAlarmTable) {
            //     console.log("Alarm table 추가 성공");
            //   } else {
            //     console.log("createAlarmTable 정보가 없음");
            //   }
            // });
          } else {
            console.log("Product 정보가 없음");
          }
        });
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.post("/addDevice2", function(req, res, next) {
  console.log("/addDevice2 호출됨.");

  var paramName = req.body.name || req.query.name;
  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramPositionID = req.body.positionID || req.query.positionID;
  var paramProductID = req.body.productID || req.query.productID;
  var paramParam1 = req.body.param1 || req.query.param1;
  var paramParam2 = req.body.param2 || req.query.param2;
  var paramParam3 = req.body.param3 || req.query.param3;
  var paramParam4 = req.body.param4 || req.query.param4;
  var paramParam5 = req.body.param5 || req.query.param5;
  var paramParam6 = req.body.param6 || req.query.param6;
  var paramParam7 = req.body.param7 || req.query.param7;
  var paramParam8 = req.body.param8 || req.query.param8;
  var paramParam9 = req.body.param9 || req.query.param9;
  var paramParam10 = req.body.param10 || req.query.param10;
  var paramParam11 = req.body.param11 || req.query.param11;
  var paramParam12 = req.body.param12 || req.query.param12;
  var paramParam13 = req.body.param13 || req.query.param13;
  var paramParam14 = req.body.param14 || req.query.param14;
  var paramParam15 = req.body.param15 || req.query.param15;
  var paramParam16 = req.body.param16 || req.query.param16;
  var paramParam17 = req.body.param17 || req.query.param17;
  var paramParam18 = req.body.param18 || req.query.param18;
  var paramParam19 = req.body.param19 || req.query.param19;
  var paramParam20 = req.body.param20 || req.query.param20;
  var paramParam21 = req.body.param21 || req.query.param21;
  var paramParam22 = req.body.param22 || req.query.param22;
  var paramParam23 = req.body.param23 || req.query.param23;
  var paramParam24 = req.body.param24 || req.query.param24;
  var paramParam25 = req.body.param25 || req.query.param25;
  var paramParam26 = req.body.param26 || req.query.param26;
  var paramParam27 = req.body.param27 || req.query.param27;
  var paramParam28 = req.body.param28 || req.query.param28;
  var paramParam29 = req.body.param29 || req.query.param29;
  var paramParam30 = req.body.param30 || req.query.param30;

  var result = { statusCode: null, message: null, data: null };
  // 20200727 kod 추가
  if (!paramName || !paramSerialNumber || !paramPositionID || !paramProductID) {
    result.statusCode = FAIL;
    result.message = "입력 값을 확인하세요";
    res.send(result);
    return;
  }

  console.log(
    "요청 파라미터 : " +
      paramName +
      "," +
      paramSerialNumber 
  );

  Device.addDevice2(
    paramName,
    paramSerialNumber,
    paramPositionID,
    paramProductID,
    paramParam1,
    paramParam2,
    paramParam3,
    paramParam4,
    paramParam5,
    paramParam6,
    paramParam7,
    paramParam8,
    paramParam9,
    paramParam10,
    paramParam11,
    paramParam12,
    paramParam13,
    paramParam14,
    paramParam15,
    paramParam16,
    paramParam17,
    paramParam18,
    paramParam19,
    paramParam20,
    paramParam21,
    paramParam22,
    paramParam23,
    paramParam24,
    paramParam25,
    paramParam26,
    paramParam27,
    paramParam28,
    paramParam29,
    paramParam30,
    function(err, addedDevice) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
      if (err) {
        console.error("디바이스 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (addedDevice) {
        console.dir(addedDevice);
        console.log("추가된 레코드의 아이디 : " + addedDevice.insertId);
        result.statusCode = OK;
        result.message = "성공";
        result.data = addedDevice.insertId;
        res.send(result);

        Product.getProductById(paramProductID, function(err, productInfo) {
          if (err) {
            console.error("Data table 추가 중 오류 발생 :" + err.stack);
            return;
          }
          if (productInfo) {
            Data.createTable(paramSerialNumber, productInfo[0], function(
              err,
              createDataTable
            ) {
              if (err) {
                console.error("Data table 추가 중 오류 발생 :" + err.stack);
                return;
              }
              if (createDataTable) {
                console.log("Data table 추가 성공");
              } else {
                console.log("createDataTable 정보가 없음");
              }
            });

            // Alarm.createTable(paramSerialNumber, productInfo[0], function(
            //   err,
            //   createAlarmTable
            // ) {
            //   if (err) {
            //     console.error("Alarm table 추가 중 오류 발생 :" + err.stack);
            //     return;
            //   }
            //   if (createAlarmTable) {
            //     console.log("Alarm table 추가 성공");
            //   } else {
            //     console.log("createAlarmTable 정보가 없음");
            //   }
            // });
          } else {
            console.log("Product 정보가 없음");
          }
        });
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});


/* all building list */
router.get("/getAllDeviceByPositionId", function(req, res, next) {
  console.log("/getAllDeviceByPositionId 호출됨.");
  var paramPositionID = req.body.positionID || req.query.positionID;
  var result = { statusCode: null, message: null, data: null };

  Device.getAllDeviceByPositionId(paramPositionID, function(err, allDevices) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (allDevices) {
      console.dir(allDevices);
      result.statusCode = OK;
      result.message = "성공";
      result.data = allDevices;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* Device information of DeviceId*/
router.post("/getDeviceBySerialNumber", function(req, res, next) {
  console.log("/getDeviceById 호출됨.");

  var paramDeviceSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramDeviceSerialNumber);

  Device.getDeviceById(paramDeviceSerialNumber, function(err, devices) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (devices) {
      console.dir(devices);
      result.statusCode = OK;
      result.message = "성공";
      result.data = devices;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.post("/getDeviceByPositionId", function(req, res, next) {
  console.log("/getDeviceByPositionId 호출됨. 000000", req.body);

  var paramPositionID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramPositionID);

  Device.getDeviceByPositionId(paramPositionID, function(err, devices) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (devices) {
      console.dir(devices);
      result.statusCode = OK;
      result.message = "성공";
      result.data = devices;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.post("/getDeviceByBuildingId", function(req, res, next) {
  console.log("/getDeviceByBuildingId 호출됨.");

  var paramBuildingID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramBuildingID);

  Device.getDeviceByBuildingId(paramBuildingID, function(err, devices) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (devices) {
      console.dir(devices);
      result.statusCode = OK;
      result.message = "성공";
      result.data = devices;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.post("/getDeviceFaultListByBuildingId", function(req, res, next) {
  console.log("/getDeviceFaultListByBuildingId 호출됨.");

  var paramBuildingID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramBuildingID);

  Device.getDeviceFaultListByBuildingId(paramBuildingID, function(err, devices) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (devices) {
      console.dir(devices);
      result.statusCode = OK;
      result.message = "성공";
      result.data = devices;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.post("/getBuildingListByVer12", function(req, res, next) {
  console.log("/getBuildingListByVer12 호출됨.");

  var paramBuildingID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  // console.log("요청 파라미터 : " + paramBuildingID);

  Device.getBuildingListByVer12(paramBuildingID, function(err, devices) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (devices) {
      console.dir(devices);
      result.statusCode = OK;
      result.message = "성공";
      result.data = devices;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.put("/updateDevice", function(req, res, next) {
  console.log("/updateDevice 호출됨.");

  var paramName = req.body.name || req.query.name;
  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramPhone = req.body.phone || req.query.phone;
  var paramIP = req.body.ip || req.query.ip;
  var paramPositionID = req.body.positionID || req.query.positionID;
  var paramProductID = req.body.productID || req.query.productID;
  var paramIMEI = req.body.imei || req.query.imei;
  var paramGateway = req.body.gateway || req.query.gateway;
  var paramSubnet = req.body.subnet || req.query.subnet;
  var paramNetworkType = req.body.networkType || req.query.networkType;
  var paramReportType = req.body.reportType || req.query.reportType;
  var paramDhcp = req.body.dhcp || req.query.dhcp;
  var result = { statusCode: null, message: null, data: null };
  // 20200727 kod 추가
  var paramDns = req.body.dns || req.query.dns;
  var paramUpload_url = req.body.upload_url || req.query.upload_url;
  var paramFota_url = req.body.fota_url || req.query.fota_url;
  var paramSend_period = req.body.send_period || req.query.send_period;
  var paramReset_info = req.body.reset_info || req.query.reset_info;

  var paramVersion = req.body.version || req.query.version;
  var paramFirmware = req.body.firmware || req.query.firmware;
  var paramChecksum = req.body.checksum || req.query.checksum;
  var paramUpload_ip = req.body.upload_ip || req.query.upload_ip;
  var paramFota_ip = req.body.fota_ip || req.query.fota_ip;

  console.log(
    "요청 파라미터 : " +
      "," +
      paramName +
      "," +
      paramSerialNumber +
      "," +
      paramPhone +
      "," +
      paramIP +
      "," +
      paramPositionID +
      "," +
      paramProductID +
      "," +
      paramIMEI +
      "," +
      paramGateway +
      "," +
      paramSubnet +
      "," +
      paramNetworkType +
      "," +
      paramReportType +
      "," +
      paramDhcp
  );

  Device.updateDevice(
    paramName,
    paramSerialNumber,
    paramPhone,
    paramIP,
    paramPositionID,
    paramProductID,
    paramIMEI,
    paramGateway,
    paramSubnet,
    paramNetworkType,
    paramReportType,
    paramDhcp,
    paramDns,
    paramUpload_url,
    paramFota_url,
    paramSend_period,
    paramReset_info,
    paramVersion,  
    paramFirmware, 
    paramChecksum, 
    paramUpload_ip,
    paramFota_ip,
    function(err, success) {
      if (err) {
        console.error("디바이스 정보 수정 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (success) {
        console.dir(success);
        result.statusCode = OK;
        result.message = "성공";
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "수정된 내용이 없습니다.";
        res.send(result);
      }
    }
  );
});

router.delete("/deleteDevice", function(req, res, next) {
  console.log("/deleteDevice 호출됨.");

  var paramDeviceSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramUserID = req.body.userID || req.query.userID;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramDeviceSerialNumber);

  Device.deleteDevice(paramDeviceSerialNumber, function(err, success) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (success) {
      console.dir(success);
      result.statusCode = OK;
      result.message = "성공";
      res.send(result);
      // RecentData.deleteRecentDataBySN(paramDeviceSerialNumber, function(
      //   err,
      //   success
      // ) {
      //   if (err) {
      //     console.error("오류 발생 :" + err.stack);
      //     return;
      //   }

      //   //결과 객체 있으면 성공 응답 전송
      //   if (success) {
      //     console.log(success);
      //   } else {
      //     console.log("실패");
      //   }
      // });
      // User.getUserByDeviceSN(paramDeviceSerialNumber, function(err, users) {
      //   if (users) {
      //     users.map(user => {
      //       let delStr = "/" + paramDeviceSerialNumber + ",/";
      //       let inStr = "/";
      //       let deviceList = user.deviceList.replace(delStr, inStr);

      //       User.updateUserBuildingList(user.id, deviceList);
      //       if (user.id == paramUserID) {
      //         user.deviceList = deviceList;
      //         let userData = userPattern.deletePattern(user);
      //         result.statusCode = OK;
      //         result.message = "성공";
      //         result.data = userData;
      //         res.send(result);
      //       }
      //     });
      //   }
      // });
      User.updateUserDeviceList(paramUserID, false, paramDeviceSerialNumber);
      User.getUserInfo(paramUserID, function(err, userInfo) {
        if (userInfo) {
          let userData = userPattern.deletePattern(userInfo);
          result.statusCode = OK;
          result.message = "성공";
          result.data = userData;
          res.send(result);
        }
      });
      // Alarm.changeTableName(paramDeviceSerialNumber);
      Data.changeTableName(paramDeviceSerialNumber);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* INSERT DeviceYul*/
router.post("/addDeviceYul", function(req, res, next) {
  console.log("/addDeviceYul 호출됨.");

  var param_serialNumber = req.body.serialNumber || req.query.serialNumber;
  var param_sensorType = req.body.sensorType || req.query.sensorType;
  var param_min = req.body.min || req.query.min || null;
  var param_max = req.body.max || req.query.max || null;
  var param_calc = req.body.calc || req.query.calc;  
  var result = { statusCode: null, message: null, data: null };

  Device.addDeviceYul(
    param_serialNumber,
    param_sensorType,
    param_min,
    param_max,
    param_calc,
    function(err, addedDeviceYul) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
      if (err) {
        console.error("디바이스 배율 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (addedDeviceYul) {
        console.dir(addedDeviceYul);
        console.log("추가된 레코드의 아이디 : " + addedDeviceYul.insertId);
        result.statusCode = OK;
        result.message = "성공";
        result.data = addedDeviceYul.insertId;
        res.send(result);
        
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.get('/getDeviceYulBySerailNumber', function(req, res, next) {
  console.log("/getDeviceYulBySerailNumber 호출됨.", req.body);

  // var param_serialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramSerialNumber = "";
  var result = { statusCode: null, message: null, data: null };
  

  Device.getDeviceYulBySerailNumber(paramSerialNumber, function(err, devicesyul) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (devicesyul) {
      console.dir(devicesyul);
      result.statusCode = OK;
      result.message = "성공";
      result.data = devicesyul;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.put("/updateDeviceYul", function(req, res, next) {
  console.log("/updateDeviceYul 호출됨.");
  
  var param_id = req.body.id || req.query.id;
  var param_serialNumber = req.body.serialNumber || req.query.serialNumber;
  var param_sensorType = req.body.sensorType || req.query.sensorType;
  var param_min = req.body.min || req.query.min || null;
  var param_max = req.body.max || req.query.max || null;
  var param_calc = req.body.calc || req.query.calc;    
  var result = { statusCode: null, message: null, data: null };

  Device.updateDeviceYul(
    param_id,
    param_serialNumber,
    param_sensorType,
    param_min,
    param_max,
    param_calc,
    function(err, success) {
      if (err) {
        console.error("디바이스 배율 정보 수정 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (success) {
        console.dir(success);
        result.statusCode = OK;
        result.message = "성공";
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "수정된 내용이 없습니다.";
        res.send(result);
      }
    }
  );
});

router.delete("/deleteDeviceYul", function(req, res, next) {
  console.log("/deleteDeviceYul 호출됨.");

  var param_id = req.body.id || req.query.id;  
  var result = { statusCode: null, message: null, data: null };

  // console.log("요청 파라미터 : " + paramDeviceSerialNumber);

  Device.deleteDeviceYul(param_id, function(err, success) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (success) {
      console.dir(success);
      result.statusCode = OK;
      result.message = "성공";
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});


router.delete("/deleteIrDevice", function(req, res, next) {
  console.log("/deleteIrDevice 호출됨.");

  var param_id = req.body.id || req.query.id;  
  var result = { statusCode: null, message: null, data: null };

  // console.log("요청 파라미터 : " + paramDeviceSerialNumber);

  Device.deleteIrDevice(param_id, function(err, success) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (success) {
      console.dir(success);
      result.statusCode = OK;
      result.message = "성공";
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

module.exports = router;
