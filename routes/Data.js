import {
    PM10,
    PM25,
    CO2,
    HCHO,
    VOC,
    NOISE,
    OK,
    FAIL
} from "../public/javascripts/defined";

var express = require('express');
var router = express.Router();
var Data=require('../models/Data');
var Alarm=require('../models/Alarm');
var Device=require('../models/Device');
var RecentData=require('../models/RecentData');
var E3Core=require('../sensor/E3Core');

/* INSERT user */
router.post('/addData', function(req, res, next) {
    console.log('/addData 호출됨.');

    var paramPM25 = req.body.pm25 || req.query.pm25 || null;
    var paramPM10 = req.body.pm10 || req.query.pm10 || null;
    var paramCO2 = req.body.co2 || req.query.co2 || null;
    var paramHCHO = req.body.hcho || req.query.hcho || null;
    var paramVOC = req.body.voc || req.query.voc || null;
    var paramTemperature = req.body.temperature || req.query.temperature || null;
    var paramHumidity = req.body.humidity || req.query.humidity || null;
    var paramNoise = req.body.noise || req.query.noise || null;
    var paramDate = req.body.date || req.query.date || null;
    var paramDeviceSN = req.body.deviceSN || req.query.deviceSN || null;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramPM25 + ',' + paramPM10 + ',' + paramCO2 + ',' + paramHCHO + ',' + paramVOC + ',' +
                paramTemperature + ',' + paramHumidity + ',' + paramNoise + ',' + paramDate + ',' + paramDeviceSN);

    Data.addData(paramPM25, paramPM10, paramCO2, paramHCHO, paramVOC, paramTemperature, paramHumidity, paramNoise, paramDate, paramDeviceSN, function(err, addedData){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('데이터 추가 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedData){
            console.dir(addedData);
            console.log('추가된 레코드의 아이디 : ' + addedData.insertId);
            
            result.statusCode = OK;
            result.message = '성공';
            result.data = addedData.insertId;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
    Device.getBuildingType(paramDeviceSN, function(err, buildingType){
        if(err){
            console.error('빌딩타입 정보 오류 :' + err.stack);
            return;
        }

        if(buildingType){
            var status = {};
            var totalScore = {};
            status.pm10 = E3Core.getSensorIndex(PM10,paramPM10);
            status.pm25 = E3Core.getSensorIndex(PM25,paramPM25);
            status.co2 = E3Core.getSensorIndex(CO2,paramCO2);
            status.hcho = E3Core.getSensorIndex(HCHO,paramHCHO);
            status.voc = E3Core.getSensorIndex(VOC,paramVOC);
            status.noise = E3Core.getSensorIndex(NOISE,paramNoise);
            status.temperature = E3Core.getTempIndex(paramTemperature);
            status.humidity = E3Core.getHumidityIndex(paramHumidity);
            totalScore = E3Core.calTotalIndex(buildingType, status.pm10.score, status.pm25.score, status.co2.score, status.hcho.score, status.voc.score, status.temperature.score, status.humidity.score, status.noise.score);
            RecentData.updateRecentData(status.pm10, status.pm25, status.co2, status.hcho, status.voc, status.temperature, status.humidity, status.noise, totalScore, paramDate, paramDeviceSN, function(err, success){
                if(err){
                    console.error('최신 데이터 수정 중 오류 발생 :' + err.stack);
                    return;
                }
                if(success){
                    console.log('최신 데이터 수정 완료 ');
                }
            });
            Alarm.addAlarm(status.pm10, status.pm25, status.co2, status.hcho, status.voc, status.temperature, status.humidity, status.noise, totalScore, paramDate, paramDeviceSN, function(err, success){
                if(err){
                    console.error('데이터 추가 중 오류 발생 :' + err.stack);
                    return;
                }
                if(success){
                    console.log('알람 데이터 추가 완료 ');
                }
            });
        }else {
            console.error('빌딩타입 정보 없음');
        }
        
    });
});

/* Data information of DataId*/
router.post('/getDataById', function(req, res, next) {
    console.log('/getDataById 호출됨.');

    var paramDataID = req.body.id || req.query.id;
    var paramDeviceSN = req.body.deviceSN || req.query.deviceSN;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramDataID +','+ paramDeviceSN);

    Data.getDataById(paramDeviceSN, paramDataID, function(err, datas){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(datas){
            console.dir(datas);
            result.statusCode = OK;
            result.message = '성공';
            result.data = datas;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/*router.put('/updateData', function(req, res, next) {
    console.log('/updateData 호출됨.');

    var paramDataID = req.body.id || req.query.id;
    var paramPM25 = req.body.pm25 || req.query.pm25;
    var paramPM10 = req.body.pm10 || req.query.pm10;
    var paramCO2 = req.body.co2 || req.query.co2;
    var paramHCHO = req.body.hcho || req.query.hcho;
    var paramVOC = req.body.voc || req.query.voc;
    var paramTemperature = req.body.temperature || req.query.temperature;
    var paramHumidity = req.body.humidity || req.query.humidity;
    var paramNoise = req.body.noise || req.query.noise;
    var paramDate = req.body.date || req.query.date;
    var paramDeviceSN = req.body.deviceSN || req.query.deviceSN;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramPM25 + ',' + paramPM10 + ',' + paramCO2 + ',' + paramHCHO + ',' + paramVOC + ',' +
                paramTemperature + ',' + paramHumidity + ',' + paramNoise + ',' + paramDate + ',' + paramDeviceSN);

    Data.updateData(paramDataID, paramPM25, paramPM10, paramCO2, paramHCHO, paramVOC, paramTemperature, paramHumidity, paramNoise, paramDate, paramDeviceSN, function(err, success){
        if(err){
            console.error('데이터 정보 수정 중 오류 발생 :' + err.stack);
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
            result.message = '실패';
            res.send(result);
        }
    });
});
  */
router.delete('/deleteData', function(req, res, next) {
    console.log('/deleteData 호출됨.');

    var paramDataID = req.body.id || req.query.id;
    var paramDeviceSN = req.body.deviceSN || req.query.deviceSN;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramDataID);

    Data.deleteData(paramDeviceSN, paramDataID, function(err, success){
        if(err){
            console.error('오류 발생 :' + err.stack);
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
            result.message = '실패';
            res.send(result);
        }
    });
});


module.exports = router;
