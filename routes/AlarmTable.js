import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var alarmTable = require("../models/AlarmTable");

/* INSERT setting */
router.post("/addAlarmValue", function(req, res, next) {
  console.log("/addAlarmValue 호출됨.");

  var paramSensorType = req.body.sensorType || req.query.sensorType;
  var paramAlarmValue = req.body.alarmValue || req.query.alarmValue;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSensorType + "," + paramAlarmValue);

  alarmTable.addAlarmValue(paramSensorType, paramAlarmValue, function(
    err,
    addedValue
  ) {
    // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
    if (err) {
      console.error("셋팅 추가 중 오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (addedValue) {
      console.dir(addedValue);
      console.log("추가된 레코드의 아이디 : " + addedValue.insertId);
      result.statusCode = OK;
      result.message = "성공";
      result.data = addedValue.insertId;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* IndexTable information of IndexTableId*/
router.post("/getAlarmValue", function(req, res, next) {
  console.log("/getAlarmValue 호출됨.");

  var result = { statusCode: null, message: null, data: null };

  alarmTable.getAlarmValue(function(err, alarmReferenceInfo) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (alarmReferenceInfo) {
      console.dir(alarmReferenceInfo);
      var returnVal = {};
      alarmReferenceInfo.map(sensor => {
        returnVal[`${sensor.SensorType}`] = sensor.AlarmValue;
      });

      result.statusCode = OK;
      result.message = "성공";
      result.data = returnVal;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.put("/updateAlarmValue", function(req, res, next) {
  console.log("/updateAlarmValue 호출됨.");

  var paramSensorType = req.body.sensorType || req.query.sensorType;
  var paramAlarmValue = req.body.alarmValue || req.query.alarmValue;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSensorType + "," + paramAlarmValue);

  alarmTable.updateAlarmValue(paramSensorType, paramAlarmValue, function(
    err,
    success
  ) {
    if (err) {
      console.error("셋팅 정보 수정 중 오류 발생 :" + err.stack);
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
  });
});

router.delete("/deleteAlarmValue", function(req, res, next) {
  console.log("/deleteAlarmValue 호출됨.");

  var paramSensorType = req.body.sensorType || req.query.sensorType;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSensorType);

  alarmTable.deleteAlarmValue(paramSensorType, function(err, success) {
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
