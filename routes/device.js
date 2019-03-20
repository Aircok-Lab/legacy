import {
  PM10,
  PM25,
  CO2,
  HCHO,
  VOC,
  NOISE
} from "../public/javascripts/defined";

var express = require("express");
var router = express.Router();
var Data = require("../models/Data");
var Alarm = require("../models/Alarm");
var Device = require("../models/Device");
var RecentData = require("../models/RecentData");
var E3Core = require("../sensor/E3Core");

function dateFormat(dateStr) {
  var year = dateStr.substr(0, 4);
  var mon = dateStr.substr(4, 2);
  var day = dateStr.substr(6, 2);
  var hh = dateStr.substr(8, 2);
  var mm = dateStr.substr(10, 2);
  var result = year + "-" + mon + "-" + day + " " + hh + ":" + mm + ":00";
  return result;
}

router.post("/", function(req, res, next) {
  console.log("/ 호출됨.");
  console.dir(req.body);
  if (req.body) {
    var result = "";
    var arr = req.body.split("|");
    console.log(arr[1]);
    var paramDeviceSN = arr[1].substring(6);
    console.log(paramDeviceSN);
    var paramDate = dateFormat(arr[0]);
    console.log(paramDate);
    Device.getDeviceInfo(paramDeviceSN, function(err, info) {
      // indoor, BuildingType, version 정보 얻어옴
      if (err) {
        console.error("데이터 추가 중 오류 발생 :" + err.stack);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(result);
        return;
      }
      if (info) {
        console.log(info.indoor);
        if (info.indoor) {
          //  스마트 에어콕 실내형
          var paramPM10 = arr[3];
          var paramPM25 = arr[4];
          var paramCO2 = arr[5];
          var paramHCHO = arr[8];
          var paramVOC = arr[6];
          var paramTemperature = (Number(arr[9]) - 1000) / 10;
          var paramHumidity = Number(arr[10]) / 10;
          var paramNoise = arr[7];
        } else {
          // 스마트 에어콕 실외형
          var paramCO2 = null;
          var paramHCHO = null;
          var paramVOC = null;
          var paramNoise = null;
          var paramPM10 = arr[3];
          var paramPM25 = arr[4];
          var paramTemperature = (Number(arr[9]) - 1000) / 10;
          var paramHumidity = Number(arr[10]) / 10;
        }

        Data.addData(
          paramPM25,
          paramPM10,
          paramCO2,
          paramHCHO,
          paramVOC,
          paramTemperature,
          paramHumidity,
          paramNoise,
          paramDate,
          paramDeviceSN,
          function(err, addedData) {
            if (err) {
              console.error("데이터 추가 중 오류 발생 :" + err.stack);
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/plain");
              res.end(result);
              return;
            }

            //결과 객체 있으면 성공 응답 전송
            if (addedData) {
              // 펌웨어 확인
              if (info.version !== arr[12]) {
                // 버젼 체크
                result = "0|00060" + "|" + info.version + "|" + "700000|!=";
              }
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end(result);
          }
        );

        if (info.buildingType) {
          // 빌딩의 타입에 따른 지수 계산
          var status = {};
          var totalScore = {};
          status.pm10 = E3Core.getSensorIndex(PM10, Number(paramPM10));
          status.pm25 = E3Core.getSensorIndex(PM25, Number(paramPM25));
          status.co2 = E3Core.getSensorIndex(CO2, Number(paramCO2));
          status.hcho = E3Core.getSensorIndex(HCHO, Number(paramHCHO));
          status.voc = E3Core.getSensorIndex(VOC, Number(paramVOC));
          status.noise = E3Core.getSensorIndex(NOISE, Number(paramNoise));
          status.temperature = E3Core.getTempIndex(paramTemperature);
          status.humidity = E3Core.getHumidityIndex(paramHumidity);
          totalScore = E3Core.calTotalIndex(
            info.buildingType,
            status.pm10.score,
            status.pm25.score,
            status.co2.score,
            status.hcho.score,
            status.voc.score,
            status.temperature.score,
            status.humidity.score,
            status.noise.score
          );
          RecentData.updateRecentData(
            status.pm10,
            status.pm25,
            status.co2,
            status.hcho,
            status.voc,
            status.temperature,
            status.humidity,
            status.noise,
            totalScore,
            paramDate,
            paramDeviceSN,
            function(err, success) {
              if (err) {
                console.error("최신 데이터 수정 중 오류 발생 :" + err.stack);
                return;
              }
              if (success) {
                console.log("최신 데이터 수정 완료 ");
              }
            }
          );
          Alarm.addAlarm(
            status.pm10,
            status.pm25,
            status.co2,
            status.hcho,
            status.voc,
            status.temperature,
            status.humidity,
            status.noise,
            totalScore,
            paramDate,
            paramDeviceSN,
            function(err, success) {
              if (err) {
                console.error("데이터 추가 중 오류 발생 :" + err.stack);
                return;
              }
              if (success) {
                console.log("알람 데이터 추가 완료 ");
              }
            }
          );
        }
      } else {
        // indoor, BuildingType, version 정보를 못 가지고 오는 경우
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(result);
      }
    });
  }
});

module.exports = router;
