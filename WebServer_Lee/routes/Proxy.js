import { OK, FAIL } from "../public/javascripts/defined";
// import axios from "axios";
var express = require("express");
var router = express.Router();
var Proxy = require("../models/Proxy");
var SmsMesage = require("../models/Sms");
var global = require("../global");
var NotiMessage = require("../models/Noti");

// 기상청 온도, 습도 조회 URL 생성
function getWeatherUrl(nx, ny, serviceKey) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();

  if (minutes < 30) {
    // 30분보다 작으면 한시간 전 값
    hours = hours - 1;
    if (hours < 0) {
      // 자정 이전은 전날로 계산
      today.setDate(today.getDate() - 1);
      dd = today.getDate();
      mm = today.getMonth() + 1;
      yyyy = today.getFullYear();
      hours = 23;
    }
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0" + dd;
  }

  var _nx = nx,
    _ny = ny,
    apikey = serviceKey,
    today = yyyy + "" + mm + "" + dd,
    basetime = hours + "00",
    fileName = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastTimeData";
  fileName += "?ServiceKey=" + apikey;
  fileName += "&base_date=" + today;
  fileName += "&base_time=" + basetime;
  fileName += "&nx=" + _nx + "&ny=" + _ny;
  fileName += "&pageNo=1&numOfRows=100";
  fileName += "&_type=json";

  return fileName;
}

router.post("/getStation", function(req, res, next) {
  console.log("/getStation 호출됨.");
  const latitude = req.query.latitude || req.body.latitude;
  const longitude = req.query.longitude || req.body.longitude;
  console.log("latitude : " + latitude + " longitude : " + longitude);

  let serviceKey = "31S4nflH1AiLDJKl%2FGNpLNGtX%2BAjV%2BF0fBINwijd0J4Ae5iKVa93pUgKwanhykObOgR12hzq1fUyQKA7hR5BqA%3D%3D";
  const stationURL = 
   "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX="+
    latitude +
    "&tmY="+
    longitude +
    "&pageNo=1&numOfRows=10&ServiceKey="+ 
    serviceKey +
    "&returnType=json";

  var promise = Proxy.get(stationURL);
  promise
   .
      then(function(response) {
        var stationRes = JSON.parse(response);
        var stationTotalCount = stationRes.response.body.totalCount;
        // console.log(stationTotalCount);
      if (stationTotalCount > 1) {
        var result = { statusCode: null, message: null, data: null };
        result.statusCode = OK;
        result.message = "성공";
        result.data = stationRes.response.body.items;
        res.send(result);
      } else {
        var result = { statusCode: null, message: null, data: null };
        result.statusCode = FAIL;
        result.message = "근처 측정기 리스트 로딩 실패";
        res.send(result);
      }
    })
    .catch(function(err) {
      var result = { statusCode: null, message: null, data: null };
      console.dir(err);
      result.statusCode = FAIL;
      result.message = "전송 실패";
      res.send(result);
    });
});

router.post("/getDust", function(req, res, next) {
  console.log("/getDust 호출됨.");
  const stationName = req.query.stationName || req.body.stationName;
  console.log("stationName : " + stationName);

  let serviceKey = "31S4nflH1AiLDJKl%2FGNpLNGtX%2BAjV%2BF0fBINwijd0J4Ae5iKVa93pUgKwanhykObOgR12hzq1fUyQKA7hR5BqA%3D%3D";
  const dustURL =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=" +
    serviceKey +
    "&returnType=json&numOfRows=10&pageNo=1&stationName=" 
    + encodeURI(stationName) +
    "&dataTerm=month&ver=1.3";

  var promise = Proxy.get(dustURL);
  promise
    .then(function(response) {
      var dustRes = JSON.parse(response);
      var dustTotalCount = dustRes.response.body.totalCount;
      console.log(dustRes);
      console.log(dustTotalCount);
      if (dustTotalCount > 1) {
        var result = { statusCode: null, message: null, data: null };
        result.statusCode = OK;
        result.message = "성공";
        result.data = dustRes.response.body.items;
        res.send(result);
      } else {
        var result = { statusCode: null, message: null, data: null };
        result.statusCode = FAIL;
        result.message = "근처 측정 데이터 로딩 실패";
        res.send(result);
      }
    })
    .catch(function(err) {
      var result = { statusCode: null, message: null, data: null };
      console.dir(err);
      result.statusCode = FAIL;
      result.message = "전송 실패";
      res.send(result);
    });
});

router.post("/getWeather", function(req, res, next) {
  console.log("/ getWeather 호출됨.");
  var nx = req.query.nx || req.body.nx;
  var ny = req.query.ny || req.body.ny;
  console.log("nx : " + nx + " ny : " + ny);

  const serviceKey = "gv%2BRtk1AAsF%2FoktFHHGyBtBVdDD2gkRmrOFBRT%2BW07julujIwZQyjF0O%2FNtNqoWJ6LQq0GwDv%2BNSiUhhT07SRA%3D%3D";
  const kmaURL = getWeatherUrl(nx, ny, serviceKey);
  var promise = Proxy.get(kmaURL);
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      result.data = JSON.parse(response).response.body.items;
      res.send(result);
    })
    .catch(function(err) {
      console.dir(err);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

/* INSERT setting */
router.post("/getToken", function(req, res, next) {
  console.log("/getToken 호출됨.");

  var promise = Proxy.getToken("https://sms.gabia.com/oauth/token");
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      var json = JSON.parse(response);
      global.smsToken = json.access_token;
      res.send(result);
    })
    .catch(function(err) {
      console.dir(err);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

router.post("/sendSMS", function(req, res, next) {
  console.log("/sendSMS 호출됨.");
  const serialNumber = req.query.serialNumber || req.body.serialNumber;
  const positionID = req.query.positionID || req.body.positionID;
  console.log("serialNumber : " + serialNumber + " positionID : " + positionID);
  var result = { statusCode: null, message: null, data: null };

  SmsMesage.makeMessage(serialNumber, positionID, function(err, smsInfo) {
    if (err) {
      result.statusCode = FAIL;
      result.message = "SMS 전송 실패";
      res.send(result);
      return;
    }

    if (smsInfo.length) {
      var phoneNumber = "";
      for (var i = 0; i < smsInfo.length; i++) {
        phoneNumber += smsInfo[i].phone + ",";
      }

      var promise = Proxy.sendSMS(phoneNumber, smsInfo.message);
      promise
        .then(function(response) {
          result.statusCode = OK;
          result.data = result.message = "SMS 전송 " + i + "건 성공";
          res.send(result);
        })
        .catch(function(err) {
          console.dir(err);
          result.statusCode = FAIL;
          result.message = "SMS 전송 " + i + "건 실패";
          res.send(result);
        });
    } else {
      result.statusCode = FAIL;
      result.message = "SMS 전송 실패";
      res.send(result);
    }
  });
});

router.post("/sendLMS", function(req, res, next) {
  console.log("/sendLMS 호출됨.");
  const serialNumber = req.query.serialNumber || req.body.serialNumber;
  const positionID = req.query.positionID || req.body.positionID;
  console.log("serialNumber : " + serialNumber + " positionID : " + positionID);
  var result = { statusCode: null, message: null, data: null };

  SmsMesage.makeMessage(serialNumber, positionID, function(err, smsInfo) {
    if (err) {
      result.statusCode = FAIL;
      result.message = "LMS 전송 실패";
      res.send(result);
      return;
    }

    if (smsInfo.length) {
      var phoneNumber = "";
      for (var i = 0; i < smsInfo.length; i++) {
        phoneNumber += smsInfo[i].phone + ",";
      }

      var promise = Proxy.sendLMS(phoneNumber, smsInfo.message);
      promise
        .then(function(response) {
          result.statusCode = OK;
          result.data = result.message = "LMS 전송 " + i + "건 성공";
          res.send(result);
        })
        .catch(function(err) {
          console.dir(err);
          result.statusCode = FAIL;
          result.message = "LMS 전송 " + i + "건 실패";
          res.send(result);
        });
    } else {
      result.statusCode = FAIL;
      result.message = "LMS 전송 실패";
      res.send(result);
    }
  });
});

router.post("/sendPush", function(req, res, next) {
  console.log("/sendPush 호출됨.");
  // sensortype, buildingtype, months

  var paramDeviceData = req.body.deviceData || req.query.deviceData || null;
  var result = { statusCode: null, message: null, data: null };
  if (!paramDeviceData) {
    console.log("deviceData 정보가 없음");
    result.statusCode = FAIL;
    result.message = "deviceData 정보가 없음";
    res.send(result);
    return;
  }
  
  console.log("요청 파라미터 : " + paramDeviceData);
  var properties = paramDeviceData.split(', ');
  var obj = {};
  
  properties.forEach(function(property) {
    var tup = property.split(': ');
    obj[tup[0]] = tup[1];
  });  

  var v_deviceSN = obj.deviceSN;    // 356170063539143  
  var v_date = obj.date.substr(5,2); //  2020-12-10T11:34:00.000Z
  var v_jisuGubun = obj.jisuGubun; 
  var v_token = obj.token;
  var v_pm10 = obj.pm10; // 
  var v_pm25 = obj.pm25;
  var v_co2 = obj.co2; 
  var v_hcho = obj.hcho;
  var v_voc = obj.voc; 
  var v_temperature = obj.temperature;
  var v_humidity = obj.humidity;
  var v_noise = obj.noise;  
  var v_co = obj.co;  
  var v_positionName = obj.positionName;
  var v_deviceName = obj.deviceName;
  
  var v_positionID="";
  var v_buildingID="";
  var v_buildingType ="";

  /* console.log(v_deviceSN);
  console.log(v_date);
  console.log(v_jisuGubun);
  console.log(v_token);
  console.log(v_pm10);
  console.log(v_pm25);
  console.log(v_co2);
  console.log(v_hcho);
  console.log(v_voc);
  console.log(v_temperature);
  console.log(v_humidity);
  console.log(v_noise);
  console.log(v_co);  
  console.log(v_positionName);
  console.log(v_deviceName); */

  NotiMessage.deviceInfo(v_deviceSN,function(err,deviceInfo){
    if (err) {
      result.statusCode = FAIL;
      result.message = "Push 전송 실패, Device정보 read error";
      res.send(result);
      return;
    }
    /* console.log("positionID 임 :" + deviceInfo.positionID);
    console.log("buildingID 임 :" + deviceInfo.buildingID);
    console.log("buildingType 임 :" + deviceInfo.buildingType); */

    if (deviceInfo) {                      
        v_positionID=deviceInfo.positionID;
        v_buildingID=deviceInfo.buildingID;
        v_buildingType =deviceInfo.buildingType;   
        /////
        NotiMessage.makeMessage(v_deviceSN,v_date,v_jisuGubun,v_pm10,v_pm25,v_co2,v_hcho,v_voc,v_temperature,v_humidity,v_noise,v_co, v_positionName, v_deviceName, v_buildingID, v_positionID,v_buildingType, function(err, smsInfo) {
          if (err) {
            result.statusCode = FAIL;
            result.message = "Push 전송 실패 makeMessage";
            res.send(result);
            return;
          }
      
          if (smsInfo.length) {            
            var sendMessage = smsInfo.message + '|'+ v_deviceSN + '|' + v_positionID  + '|' +  v_buildingID  + '|' + v_jisuGubun;
            console.log("smsInfo.message : "+smsInfo.message);  //  Web화면 표시용
            console.log("sendMessage : "+sendMessage);  //  push 전송용

            /* var promise = Proxy.sendPush(v_token, sendMessage);
            promise
              .then(function(response) {
                result.statusCode = OK;
                result.data = result.message = "Push전송 성공";
                res.send(result);
              })
              .catch(function(err) {
                console.dir(err);
                result.statusCode = FAIL;
                result.message = "Push전송 Message 전송 실패";
                res.send(result);
              }); */
              // 테스트후 삭제 시작
              result.statusCode = OK;
              result.data = result.message = "Push전송 성공";
              res.send(result);
              // 테스트후 삭제 끝
          } else {
            result.statusCode = FAIL;
            result.message = "Push 전송 실패";
            res.send(result);
          }
        });
        /////
    } else {
      result.statusCode = FAIL;
      result.message = "Push 전송 실패: Unknown Error";
      res.send(result);
    }
  });  
});

module.exports = router;
