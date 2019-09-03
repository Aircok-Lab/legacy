import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var global = require("../global");

router.post("/getTemperatureScore", function(req, res, next) {
  console.log("/getTemperatureScore 호출됨.");

  var paramTemperature = req.body.temperature || req.query.temperature;
  var paramIsPublicBuilding =
    req.body.isPublicBuilding || req.query.isPublicBuilding;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramTemperature + paramIsPublicBuilding);
  var temp = Number(paramTemperature);
  var isPublicBuilding = Number(paramIsPublicBuilding);
  var d = new Date();
  var month = d.getMonth() + 1;
  var cMax = 0,
    cMin = 0,
    cOpt = 0;
  var score = 0;
  var data = 0;

  if (paramTemperature == null) {
    result.statusCode = FAIL;
    result.message = "온도 값이 없음";
    res.send(result);
    return;
  }

  if (isPublicBuilding) {
    data = global.sensorTable.temperaturePublic;
  } else {
    data = global.sensorTable.temperature;
  }
  console.log("data : " + data);

  if (month > 2 && month < 6) {
    cMin = data[0].min;
    cMax = data[0].max;
  } else if (month > 5 && month < 9) {
    cMin = data[1].min;
    cMax = data[1].max;
  } else if (month > 8 && month < 12) {
    cMin = data[2].min;
    cMax = data[2].max;
  } else {
    cMin = data[3].min;
    cMax = data[3].max;
  }
  console.log("cMin : " + cMin + " cMax : " + cMax);
  cOpt = (cMin + cMax) / 2;
  score = 100 * (Math.abs(temp - cOpt) / (cMax - cMin)) * 2;
  console.log("cOpt : " + cOpt + " score : " + score);
  result.statusCode = OK;
  result.message = "성공";
  result.data = score;
  res.send(result);
});

router.post("/getHumidityScore", function(req, res, next) {
  console.log("/getHumidityScore 호출됨.");

  var paramHumidity = req.body.humidity || req.query.humidity;
  var paramIsPublicBuilding =
    req.body.isPublicBuilding || req.query.isPublicBuilding;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramHumidity + paramIsPublicBuilding);
  var humidity = Number(paramHumidity);
  var isPublicBuilding = Number(paramIsPublicBuilding);
  var d = new Date();
  var month = d.getMonth() + 1;
  var cMax = 0,
    cMin = 0,
    cOpt = 0;
  var score = 0;
  var data = 0;

  if (paramHumidity == null) {
    result.statusCode = FAIL;
    result.message = "습도 값이 없음";
    res.send(result);
    return;
  }

  if (isPublicBuilding) {
    data = global.sensorTable.humidityPublic;
  } else {
    data = global.sensorTable.humidity;
  }

  if (month > 2 && month < 6) {
    cMin = data[0].min;
    cMax = data[0].max;
  } else if (month > 5 && month < 9) {
    cMin = data[1].min;
    cMax = data[1].max;
  } else if (month > 8 && month < 12) {
    cMin = data[2].min;
    cMax = data[2].max;
  } else {
    cMin = data[3].min;
    cMax = data[3].max;
  }
  cOpt = (cMin + cMax) / 2;
  score = 100 * (Math.abs(humidity - cOpt) / (cMax - cMin)) * 2;

  result.statusCode = OK;
  result.message = "성공";
  result.data = score;
  res.send(result);
});

module.exports = router;
