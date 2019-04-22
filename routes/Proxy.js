import { OK, FAIL } from "../public/javascripts/defined";
// import axios from "axios";
var express = require("express");
var router = express.Router();
var Proxy = require("../models/Proxy");
var SmsMesage = require("../models/Sms");
var global = require("../global");

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

  const serviceKey = "2swHUoM3iFAky78x2Ljh%2BZBtTvcoy%2Fe7fxxtAYd8Mwa6Lc85ITizobiNA3zVg78ZIbubA2W3Eu%2FWnGxvGQz22g%3D%3D";
  const stationURL =
    "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=" +
    latitude +
    "&tmY=" +
    longitude +
    "&pageNo=1&numOfRows=10&ServiceKey=" +
    serviceKey +
    "&_returnType=json";

  var promise = Proxy.get(stationURL);
  promise
    .then(function(response) {
      var stationRes = JSON.parse(response);
      console.log(stationRes.list);

      if (stationRes.list && stationRes.list.length) {
        var result = { statusCode: null, message: null, data: null };
        result.statusCode = OK;
        result.message = "성공";
        result.data = stationRes.list;
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

  const serviceKey = "2swHUoM3iFAky78x2Ljh%2BZBtTvcoy%2Fe7fxxtAYd8Mwa6Lc85ITizobiNA3zVg78ZIbubA2W3Eu%2FWnGxvGQz22g%3D%3D";
  const dustURL =
    "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=" +
    stationName +
    "&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=" +
    serviceKey +
    "&ver=1.3&_returnType=json";

  var promise = Proxy.get(dustURL);
  promise
    .then(function(response) {
      var dustRes = JSON.parse(response);
      console.log(dustRes.list);

      if (dustRes.list && dustRes.list.length) {
        var result = { statusCode: null, message: null, data: null };
        result.statusCode = OK;
        result.message = "성공";
        result.data = dustRes.list;
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
  console.log(kmaURL);
  var promise = Proxy.get(kmaURL);
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      console.log(response);
      result.data = response;
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

module.exports = router;
