import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var IndexTable = require("../models/IndexTable");

/* INSERT setting */
router.post("/addIndexTable", function(req, res, next) {
  console.log("/addIndexTable 호출됨.");

  var paramSensorType = req.body.sensorType || req.query.sensorType;
  var paramGrade = req.body.grade || req.query.grade;
  var paramMin = req.body.min || req.query.min;
  var paramMax = req.body.max || req.query.max;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSensorType +
      "," +
      paramGrade +
      "," +
      paramMin +
      "," +
      paramMax
  );

  IndexTable.addIndexTable(
    paramSensorType,
    paramGrade,
    paramMin,
    paramMax,
    function(err, addedIndexTable) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
      if (err) {
        console.error("셋팅 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (addedIndexTable) {
        console.dir(addedIndexTable);
        console.log("추가된 레코드의 아이디 : " + addedIndexTable.insertId);
        result.statusCode = OK;
        result.message = "성공";
        result.data = addedIndexTable.insertId;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

/* IndexTable information of IndexTableId*/
router.post("/getIndexTableBySensorType", function(req, res, next) {
  console.log("/getIndexTableById 호출됨.");

  var paramSensorType = req.body.sensorType || req.query.sensorType;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSensorType);

  IndexTable.getIndexTableBySensorType(paramSensorType, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      console.dir(sensorIndexInfo);
      result.statusCode = OK;
      result.message = "성공";
      result.data = sensorIndexInfo;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.put('/updateMinIndexTable', function(req, res, next) {
    console.log('/updateMinIndexTable 호출됨.');

    var paramSensorType = req.body.sensorType || req.query.sensorType;
    var paramGrade = req.body.grade || req.query.grade;
    var paramMin = req.body.min || req.query.min;
    var result = {statusCode : null, message : null, data : null};
    
    console.log('요청 파라미터 : ' + paramSensorType + ',' + paramGrade + ',' + paramMin);

    IndexTable.updateMinIndexTable(paramSensorType, paramGrade, paramMin, function(err, success){
        if(err){
            console.error('셋팅 정보 수정 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            result.statusCode = OK;
            result.message = '성공';
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '수정된 내용이 없습니다.';
            res.send(result);
        }
    });
});

router.put('/updateMaxIndexTable', function(req, res, next) {
    console.log('/updateMaxIndexTable 호출됨.');

    var paramSensorType = req.body.sensorType || req.query.sensorType;
    var paramGrade = req.body.grade || req.query.grade;
    var paramMax = req.body.max || req.query.max;
    var result = {statusCode : null, message : null, data : null};
    
    console.log('요청 파라미터 : ' + paramSensorType + ',' + paramGrade + ',' + paramMax);

    IndexTable.updateMaxIndexTable(paramSensorType, paramGrade, paramMax, function(err, success){
        if(err){
            console.error('셋팅 정보 수정 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            result.statusCode = OK;
            result.message = '성공';
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '수정된 내용이 없습니다.';
            res.send(result);
        }
    });
});

router.delete("/deleteIndexTable", function(req, res, next) {
  console.log("/deleteIndexTable 호출됨.");

  var paramIndexTableID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramIndexTableID);

  IndexTable.deleteIndexTable(paramIndexTableID, function(err, success) {
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

router.post("/allIndexTable", function(req, res, next) {
  console.log("/allIndexTable 호출됨.");

  var result = { statusCode: null, message: null, data: null };

  IndexTable.allIndexTable(function(err, sensorData) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorData) {
      console.dir(sensorData);
      result.statusCode = OK;
      result.message = "성공";
      result.data = sensorData;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

module.exports = router;
