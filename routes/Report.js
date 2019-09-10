import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var report = require("../models/Report");
var Product = require("../models/Product");

router.post("/getAVGe3ScoreByDate", function(req, res, next) {
  console.log("/getAVGe3ScoreByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

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
    }
  );
});

router.post("/getCountE3Index", function(req, res, next) {
  console.log("/getCountE3Index 호출됨.");
  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var paramE3Index = req.body.e3Index || req.query.e3Index;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate +
      "," +
      paramE3Index
  );

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
    }
  );
});

router.post("/getChartDataByDate", function(req, res, next) {
  console.log("/getChartDataByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  report.getChartDataByDate(
    paramSerialNumber,
    paramStartDate,
    paramEndDate,
    function(err, chartData) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

      if (err) {
        console.error("데이터 로드중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (chartData) {
        result.statusCode = OK;
        result.message = "성공";
        result.data = chartData;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.post("/get5minDataByDate", function(req, res, next) {
  console.log("/get5minDataByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  Product.getProductBySerialNumber(paramSerialNumber, function(
    err,
    productInfo
  ) {
    if (err) {
      console.error("Data table 추가 중 오류 발생 :" + err.stack);
      return;
    }
    if (productInfo) {
      report.get5minDataByDate(
        productInfo,
        paramSerialNumber,
        paramStartDate,
        paramEndDate,
        function(err, data) {
          if (err) {
            console.error("Data table 추가 중 오류 발생 :" + err.stack);
            return;
          }
          if (data) {
            console.log("Data 성공");
            result.statusCode = OK;
            result.message = "성공";
            result.data = data;
            res.send(result);
          } else {
            console.log("data 정보가 없음");
            result.statusCode = FAIL;
            result.message = "data 정보가 없음";
            res.send(result);
          }
        }
      );
    } else {
      console.log("Product 정보가 없음");
      result.statusCode = FAIL;
      result.message = "Product 정보가 없음";
      res.send(result);
    }
  });
});

router.post("/getHourDataByDate", function(req, res, next) {
  console.log("/getHourDataByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  Product.getProductBySerialNumber(paramSerialNumber, function(
    err,
    productInfo
  ) {
    if (err) {
      console.error("Data table 추가 중 오류 발생 :" + err.stack);
      return;
    }
    if (productInfo) {
      report.getHourDataByDate(
        productInfo,
        paramSerialNumber,
        paramStartDate,
        paramEndDate,
        function(err, data) {
          if (err) {
            console.error("Data table 추가 중 오류 발생 :" + err.stack);
            return;
          }
          if (data) {
            console.log("Data 성공");
            result.statusCode = OK;
            result.message = "성공";
            result.data = data;
            res.send(result);
          } else {
            console.log("data 정보가 없음");
            result.statusCode = FAIL;
            result.message = "data 정보가 없음";
            res.send(result);
          }
        }
      );
    } else {
      console.log("Product 정보가 없음");
      result.statusCode = FAIL;
      result.message = "Product 정보가 없음";
      res.send(result);
    }
  });
});

module.exports = router;
