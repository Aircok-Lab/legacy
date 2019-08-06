import {
  PM10,
  PM25,
  CO2,
  HCHO,
  VOC,
  CO,
  NOISE
} from "../public/javascripts/defined";

var express = require("express");
var router = express.Router();
var Data = require("../models/Data");
var Alarm = require("../models/Alarm");
var Device = require("../models/Device");
var RecentData = require("../models/RecentData");
var E3Core = require("../sensor/E3Core");
var global = require("../global");
const fs = require("fs");

function dateFormat(dateStr) {
  var year = dateStr.substr(0, 4);
  var mon = dateStr.substr(4, 2);
  var day = dateStr.substr(6, 2);
  var hh = dateStr.substr(8, 2);
  var mm = dateStr.substr(10, 2);
  var result = year + "-" + mon + "-" + day + " " + hh + ":" + mm + ":00";
  return result;
}

function writeLog(date, log) {
  var filename = "/aircok/log/" + date;
  fs.open(filename, "a", function(err, fileId) {
    if (err) throw err;
    fs.write(fileId, log + "\r\n", 0, log.length + 1, null, (err, length) => {
      if (err) throw err;
      console.log(paramData);
      fs.close(fileId, () => {
        console.log("file is updated'");
      });
    });
  });
}

router.post("/", function(req, res, next) {
  var paramData = req.body || req.query || null;
  console.log("/ 호출됨.");

  if (paramData) {
    var result = "";
    var arr = paramData.split("|");
    console.log(arr[1]);
    var paramDeviceSN = arr[1].substring(6);
    console.log(paramDeviceSN);
    var paramDate = dateFormat(arr[0]);
    console.log(paramDate);
    var deviceType = arr[1].substring(2, 4);
    var indoor = arr[1].substring(4, 6);
    var date = arr[0].substr(0, 8);

    writeLog(date, paramData);

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
        //global.filename = info.firmware;
        if (info.indoor) {
          //  스마트 에어콕 실내형
          if (deviceType == 1) {
            // 에코나래
            var paramPM10 = arr[3];
            var paramPM25 = arr[4];
            var paramCO2 = arr[5];
            var paramHCHO = arr[8];
            var paramVOC = arr[6];
            var paramTemperature = (Number(arr[9]) - 1000) / 10;
            var paramHumidity = Number(arr[10]) / 10;
            var paramNoise = arr[7];
            var paramCo = null;
          } else if (deviceType == 3 || deviceType == 4) {
            // HMW
            var paramPM10 = arr[3];
            var paramPM25 = arr[4];
            var paramCO2 = arr[5];
            var paramHCHO = arr[8];
            var paramVOC = arr[6];
            var paramTemperature = (Number(arr[9]) - 1000) / 10;
            var paramHumidity = Number(arr[10]) / 10;
            var paramNoise = arr[7];
            var paramCo = arr[11];
          }
        } else {
          // 스마트 에어콕 실외형
          var paramCO2 = null;
          var paramHCHO = null;
          var paramVOC = null;
          var paramNoise = null;
          var paramCo = null;
          var paramPM10 = arr[3];
          var paramPM25 = arr[4];
          var paramTemperature = (Number(arr[9]) - 1000) / 10;
          var paramHumidity = Number(arr[10]) / 10;
        }
        console.log(
          paramPM10,
          paramPM25,
          paramCO2,
          paramHCHO,
          paramVOC,
          paramTemperature,
          paramHumidity,
          paramNoise,
          paramCo
        );
        // Data.addData(
        //   paramPM25,
        //   paramPM10,
        //   paramCO2,
        //   paramHCHO,
        //   paramVOC,
        //   paramTemperature,
        //   paramHumidity,
        //   paramNoise,
        //   paramCo,
        //   paramDate,
        //   paramDeviceSN,
        //   function(err, addedData) {
        //     if (err) {
        //       console.error("데이터 추가 중 오류 발생 :" + err.stack);
        //       res.statusCode = 200;
        //       res.setHeader("Content-Type", "text/plain");
        //       res.end(result);
        //       return;
        //     }
        //     var urlInfo = "115.178.65.141:13704";
        //     //결과 객체 있으면 성공 응답 전송
        //     if (addedData) {
        //       // 펌웨어 확인
        //       if (info.version !== arr[13]) {
        //         // 버젼 체크
        //         if (deviceType == 1) {
        //           result =
        //             "0|00060" +
        //             "|" +
        //             info.version +
        //             "|" +
        //             info.filesize +
        //             "|!=";
        //         } else if (deviceType == 3) {
        //           result =
        //             "0|" +
        //             "00060" +
        //             "|" +
        //             info.version +
        //             "|" +
        //             info.filesize +
        //             "|" +
        //             urlInfo +
        //             "|!=";
        //         }
        //       }
        //     }
        //     res.statusCode = 200;
        //     res.setHeader("Content-Type", "text/plain");
        //     res.end(result);
        //   }
        // );

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
          status.co = E3Core.getSensorIndex(CO, Number(paramCo));
          status.temperature = E3Core.getTempIndex(
            info.isPublicBuilding,
            paramTemperature
          );
          status.humidity = E3Core.getHumidityIndex(
            info.isPublicBuilding,
            paramHumidity
          );
          totalScore = E3Core.calTotalIndex(
            info.buildingType,
            status.pm10.score,
            status.pm25.score,
            status.co2.score,
            status.hcho.score,
            status.voc.score,
            status.temperature.score,
            status.humidity.score,
            status.noise.score,
            status.co.score
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
            status.co,
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
          Data.addData(
            status.pm10,
            status.pm25,
            status.co2,
            status.hcho,
            status.voc,
            status.temperature,
            status.humidity,
            status.noise,
            status.co,
            totalScore,
            paramDate,
            paramDeviceSN,
            info,
            function(err, addedData) {
              if (err) {
                console.error("데이터 추가 중 오류 발생 :" + err.stack);
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end(result);
                return;
              }
              //var urlInfo = "115.178.65.141:13704";
              //결과 객체 있으면 성공 응답 전송
              if (addedData) {
                // 펌웨어 확인
                if (info.version !== arr[13]) {
                  // 버젼 체크
                  if (deviceType == 1) {
                    result =
                      "0|00060" +
                      "|" +
                      info.version +
                      "|" +
                      info.filesize +
                      "|!=";
                  } else if (deviceType == 3 || deviceType == 4) {
                    result =
                      "0|" +
                      "00060" +
                      "|" +
                      info.version +
                      "|" +
                      info.filesize +
                      "|" +
                      info.ip +
                      "|!=";
                  }
                }
              }
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/plain");
              res.end(result);
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
