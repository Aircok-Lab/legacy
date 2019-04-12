import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var report = require("../models/Report");

router.post("/getAVGe3ScoreByDate", function(req, res, next) {
  console.log("/getAVGe3ScoreByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSerialNumber + "," + paramStartDate + "," + paramEndDate);

  report.getAVGe3ScoreByDate(
    paramSerialNumber,
    paramStartDate,
    paramEndDate,
    function(err, addedAverage) {
    // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
    
    if (err) {
      console.error("스코어 추가 중 오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (addedAverage) {
      console.dir(addedAverage);
      console.log("추가된 레코드의 아이디 : " + addedAverage);
      result.statusCode = OK;
      result.message = "성공";
      result.data = addedAverage;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.post("/getCountE3Index", function(req, res, next) {
  console.log("/getCountE3Index 호출됨.");
  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var paramE3Index = req.body.e3Index || req.query.e3Index;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSerialNumber + "," + paramStartDate + "," + paramEndDate + "," + paramE3Index);

  report.getCountE3Index(
    paramSerialNumber,
    paramStartDate,
    paramEndDate,
    paramE3Index,
    function(err, countedIndex) {
    // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
    
    if (err) {
      console.error("인덱스 카운트 중 오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (countedIndex) {
      console.dir(countedIndex);
      console.log("추가된 레코드의 아이디 : " + countedIndex);
      result.statusCode = OK;
      result.message = "성공";
      result.data = countedIndex;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

module.exports = router;
