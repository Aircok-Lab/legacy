import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var RecentData = require("../models/RecentData");

/* INSERT user */
// router.post('/addRecentData', function(req, res, next) {
//     console.log('/addRecentData 호출됨.');

//     var paramPM25 = req.body.pm25 || req.query.pm25;
//     var paramPM10 = req.body.pm10 || req.query.pm10;
//     var paramCO2 = req.body.co2 || req.query.co2;
//     var paramHCHO = req.body.hcho || req.query.hcho;
//     var paramVOC = req.body.voc || req.query.voc;
//     var paramTemperature = req.body.temperature || req.query.temperature;
//     var paramHumidity = req.body.humidity || req.query.humidity;
//     var paramNoise = req.body.noise || req.query.noise;
//     var paramDate = req.body.date || req.query.date;
//     var paramDeviceSN = req.body.devuceSN || req.query.devuceSN;

//     console.log('요청 파라미터 : ' + paramPM25 + ',' + paramPM10 + ',' + paramCO2 + ',' + paramHCHO + ',' + paramVOC + ',' +
//                 paramTemperature + ',' + paramHumidity + ',' + paramNoise + ',' + paramDate + ',' + paramDeviceSN);

//     RecentData.addRecentData(paramPM25, paramPM10, paramCO2, paramHCHO, paramVOC, paramTemperature, paramHumidity, paramNoise, paramDate, paramDeviceSN, function(err, addedRecentData){
//         // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
//         if(err){
//             console.error('데이터 추가 중 오류 발생 :' + err.stack);

//             res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
//             res.write('<h2>데이터 추가 중 오류 발생</h2>');
//             res.write('<p>'+err.stack+'</p>');
//             res.end();

//             return;
//         }

//         //결과 객체 있으면 성공 응답 전송
//         if(addedRecentData){
//             console.dir(addedRecentData);
//             console.log('inserted' + addedRecentData.affectedRows + 'rows');
//             console.log('추가된 레코드의 아이디 : ' + addedRecentData.insertId);

//             res.send(addedRecentData);
//         } else {
//             res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
//             res.write('<h2>데이터 추가 실패</h2>');
//             res.end();
//         }
//     });
// });

/* RecentData information of RecentDataId*/
router.post("/getRecentDataById", function(req, res, next) {
  console.log("/getRecentDataById 호출됨.");

  var paramRecentDataID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramRecentDataID);

  RecentData.getRecentDataById(paramRecentDataID, function(err, datas) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (datas) {
      console.dir(datas);
      result.statusCode = OK;
      result.message = "성공";
      result.data = datas;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.post("/getRecentDataByPositionId", function(req, res, next) {
  console.log("/getRecentDataByPositionId 호출됨.");

  var paramPositionID = req.body.positionID || req.query.positionID;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramPositionID);

  RecentData.getRecentDataByPositionId(paramPositionID, function(err, datas) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (datas) {
      console.dir(datas);
      result.statusCode = OK;
      result.message = "성공";
      result.data = datas;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

// router.put('/updateRecentData', function(req, res, next) {
//     console.log('/updateRecentData 호출됨.');

//     var paramRecentDataID = req.body.id || req.query.id;
//     var paramPM25 = req.body.pm25 || req.query.pm25;
//     var paramPM10 = req.body.pm10 || req.query.pm10;
//     var paramCO2 = req.body.co2 || req.query.co2;
//     var paramHCHO = req.body.hcho || req.query.hcho;
//     var paramVOC = req.body.voc || req.query.voc;
//     var paramTemperature = req.body.temperature || req.query.temperature;
//     var paramHumidity = req.body.humidity || req.query.humidity;
//     var paramNoise = req.body.noise || req.query.noise;
//     var paramDate = req.body.date || req.query.date;
//     var paramDeviceSN = req.body.devuceSN || req.query.devuceSN;

//     console.log('요청 파라미터 : ' + paramPM25 + ',' + paramPM10 + ',' + paramCO2 + ',' + paramHCHO + ',' + paramVOC + ',' +
//                 paramTemperature + ',' + paramHumidity + ',' + paramNoise + ',' + paramDate + ',' + paramDeviceSN);

//     RecentData.updateRecentData(paramRecentDataID, paramPM25, paramPM10, paramCO2, paramHCHO, paramVOC, paramTemperature, paramHumidity, paramNoise, paramDate, paramDeviceSN, function(err, success){
//         if(err){
//             console.error('데이터 정보 수정 중 오류 발생 :' + err.stack);

//             res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
//             res.write('<h2>데이터 정보 수정 중 오류 발생</h2>');
//             res.write('<p>'+err.stack+'</p>');
//             res.end();

//             return;
//         }

//         //결과 객체 있으면 성공 응답 전송
//         if(success){
//             console.dir(success);
//             res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
//             res.write('<h2> 데이터 정보 변경 완료</h2>');
//             res.end();
//         } else {
//             res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
//             res.write('<h2>데이터 정보 변경 실패</h2>');
//             res.end();
//         }
//     });
// });

router.delete("/deleteRecentDataByID", function(req, res, next) {
  console.log("/deleteRecentDataByID 호출됨.");

  var paramRecentDataID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramRecentDataID);

  RecentData.deleteRecentDataByID(paramRecentDataID, function(err, success) {
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
