import { OK, FAIL } from "../public/javascripts/defined";
// import axios from "axios";
var express = require("express");
var router = express.Router();
var Proxy = require("../models/Proxy");
var global = require("../global");

// 위경도를 기상청 grid x,y 로 변경 - http://werty.co.kr/blog/3011
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
function dfsXyConv(code, v1, v2) {
  // LCC DFS 좌표변환을 위한 기초 자료
  //
  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)

  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["nx"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["ny"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs["nx"] = v1;
    rs["ny"] = v2;
    var xn = v1 - XO;
    var yn = ro - v2 + YO;
    ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) -ra;
    var alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) -theta;
      } else theta = Math.atan2(xn, yn);
    }
    var alon = theta / sn + olon;
    rs["lat"] = alat * RADDEG;
    rs["lng"] = alon * RADDEG;
  }
  return rs;
}

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

router.get("/getDust", function(req, res, next) {
  console.log("/getDust 호출됨.");
  const latitude = req.query.latitude || req.body.latitude;
  const longitude = req.query.longitude || req.body.longitude;
  console.log("latitude : " + latitude + " longitude : " + longitude);

  // let coords = proj4("EPSG:4326", "EPSG:5181", [latitude, longitude]);
  // const coordX = coords[0];
  // const coordY = coords[1];
  // console.log("coordX : " + coordX + " coordY : " + coordY);
  const serviceKey = "2swHUoM3iFAky78x2Ljh%2BZBtTvcoy%2Fe7fxxtAYd8Mwa6Lc85ITizobiNA3zVg78ZIbubA2W3Eu%2FWnGxvGQz22g%3D%3D";
  const dustURL =
    "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=" +
    latitude +
    "&tmY=" +
    longitude +
    "&pageNo=1&numOfRows=10&ServiceKey=" +
    serviceKey +
    "&_returnType=json";
  console.log(dustURL);

  var promise = Proxy.get(dustURL);
  promise
    .then(function(response) {
      var dustRes = JSON.parse(response);
      console.log(dustRes);
      // console.log(json);
      // result.data = json;
      // res.send(result);

      // 응답할 데이터에 공공데이터 미세먼지 추가
      // res.data.data[0].publicAirData = {};
      if (dustRes.data.list && dustRes.data.list.length) {
        const stationName = dustRes.data.list[0].stationName;
        const dustURL2 =
          "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=" +
          stationName +
          "&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=" +
          serviceKey +
          "&ver=1.3&_returnType=json";
        var promise2 = Proxy.get(dustURL2);
        promise2
          .then(function(response) {
            var result = { statusCode: null, message: null, data: null };
            var dustData = { pm10Value: "", pm25Value: "" };
            var dustRes2 = JSON.parse(response);
            dustData = dustRes2.data.list[0];
            result.statusCode = OK;
            result.message = "성공";
            result.data = dustData;
            res.send(result);
          })
          .catch(function(err) {
            console.dir(err);
            var result = { statusCode: null, message: null, data: null };
            result.statusCode = FAIL;
            result.message = "실패";
            res.send(result);
          });
      } else {
        var result = { statusCode: null, message: null, data: null };
        var dustData = { pm10Value: "", pm25Value: "" };
        result.statusCode = OK;
        result.message = "성공";
        result.data = dustData;
        res.send(result);
      }
    })
    .catch(function(err) {
      console.dir(err);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

router.get("/getWeather", function(req, res, next) {
  console.log("/ getWeather 호출됨.");
  var latitude = req.query.latitude || req.body.latitude;
  var longitude = req.query.longitude || req.body.longitude;
  console.log("latitude : " + latitude + " longitude : " + longitude);

  const kmaServiceKey = "gv%2BRtk1AAsF%2FoktFHHGyBtBVdDD2gkRmrOFBRT%2BW07julujIwZQyjF0O%2FNtNqoWJ6LQq0GwDv%2BNSiUhhT07SRA%3D%3D";
  const kmaGrid = dfsXyConv("toXY", latitude, longitude); // 위도, 경도를 기상청 grid 로 변환
  const kmaURL = getWeatherUrl(kmaGrid.nx, kmaGrid.ny, kmaServiceKey);
  console.log(kmaURL);
  var promise = Proxy.get(kmaURL);
  promise
    .then(function(response) {
      // res.send(result);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      var json = JSON.parse(response);
      console.log(response);
      console.log(json);
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

  var promise = Proxy.sendSMS("https://sms.gabia.com/api/send/sms", global.smsToken);
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
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

router.post("/sendLMS", function(req, res, next) {
  console.log("/sendLMS 호출됨.");

  var promise = Proxy.sendLMS("https://sms.gabia.com/api/send/lms", global.smsToken);
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
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

module.exports = router;
