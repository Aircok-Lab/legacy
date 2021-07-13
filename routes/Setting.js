import {
    OK,
    FAIL
} from "../public/javascripts/defined";
var express = require('express');
var router = express.Router();
var Setting=require('../models/Setting');

/* INSERT setting */
router.post('/addSetting', function(req, res, next) {
    console.log('/addSetting 호출됨.');

    var paramScrollRow = req.body.scrollRow || req.query.scrollRow;
    var paramScrollTime = req.body.scrollTime || req.query.scrollTime;
    var paramMonitoringTime = req.body.monitoringTime || req.query.monitoringTime;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramScrollRow + ',' + paramScrollTime + ',' + paramMonitoringTime);

    Setting.addSetting(paramScrollRow, paramScrollTime, paramMonitoringTime, function(err, addedSetting){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('셋팅 추가 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '셋팅 추가 중 오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedSetting){
            console.dir(addedSetting);
            console.log('추가된 레코드의 아이디 : ' + addedSetting.insertId);
            result.statusCode = OK;
            result.message = '성공';
            result.data = addedSetting.insertId;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* Setting information of SettingId*/
router.post('/getSettingById', function(req, res, next) {
    console.log('/getSettingById 호출됨.');

    var paramSettingID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramSettingID);

    Setting.getSettingById(paramSettingID, function(err, settings){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(settings){
            console.dir(settings);
            result.statusCode = OK;
            result.message = '성공';
            result.data = settings;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.put('/updateSetting', function(req, res, next) {
    console.log('/updateSetting 호출됨.');


    var paramSettingID = req.body.id || req.query.id;
    var paramScrollRow = req.body.scrollRow || req.query.scrollRow;
    var paramScrollTime = req.body.scrollTime || req.query.scrollTime;
    var paramMonitoringTime = req.body.monitoringTime || req.query.monitoringTime;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramSettingID + ',' + paramScrollRow + ',' + paramScrollTime + ',' + paramMonitoringTime);

    Setting.updateSetting(paramSettingID, paramScrollRow, paramScrollTime, paramMonitoringTime, function(err, success){
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

router.delete('/deleteSetting', function(req, res, next) {
    console.log('/deleteSetting 호출됨.');

    var paramSettingID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramSettingID);

    Setting.deleteSetting(paramSettingID, function(err, success){
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

router.put('/updateIrSetting', function(req, res, next) {
    console.log('/updateIrSetting 호출됨.');


    //var paramSettingID = req.body.id || req.query.id;
    //var paramScrollRow = req.body.scrollRow || req.query.scrollRow;
    //var paramScrollTime = req.body.scrollTime || req.query.scrollTime;
    //var paramMonitoringTime = req.body.monitoringTime || req.query.monitoringTime;
    var paramSerialNumber      = req.body.serialNumber || req.query.serialNumber;                    
    var paramPm10_gang_start   = req.body.pm10_gang_start || req.query.pm10_gang_start;              
    var paramPm10_gang_end     = req.body.pm10_gang_end || req.query.pm10_gang_end;                  
    var paramPm10_jung_start   = req.body.pm10_jung_start || req.query.pm10_jung_start;              
    var paramPm10_jung_end     = req.body.pm10_jung_end || req.query.pm10_jung_end;                  
    var paramPm10_yag_start    = req.body.pm10_yag_start || req.query.pm10_yag_start;                
    var paramPm10_yag_end      = req.body.pm10_yag_end || req.query.pm10_yag_end;                    
    var paramPm25_gang_start   = req.body.pm25_gang_start || req.query.pm25_gang_start;              
    var paramPm25_gang_end     = req.body.pm25_gang_end || req.query.pm25_gang_end;                  
    var paramPm25_jung_start   = req.body.pm25_jung_start || req.query.pm25_jung_start;              
    var paramPm25_jung_end     = req.body.pm25_jung_end || req.query.pm25_jung_end;                  
    var paramPm25_yag_start    = req.body.pm25_yag_start || req.query.pm25_yag_start;                
    var paramPm25_yag_end      = req.body.pm25_yag_end || req.query.pm25_yag_end;                    
    var paramTemperature       = req.body.temperature || req.query.temperature;
    var paramCo2               = req.body.co2 || req.query.co2;
    var result = {statusCode : null, message : null, data : null};

    //console.log('요청 파라미터 : ' + paramSettingID + ',' + paramScrollRow + ',' + paramScrollTime + ',' + paramMonitoringTime);
    paramSerialNumber, paramPm10_gang_start, paramPm10_gang_end, paramPm10_jung_start, paramPm10_jung_end, paramPm10_yag_start, paramPm10_yag_end, paramPm25_gang_start, paramPm25_gang_end, paramPm25_jung_start, paramPm25_jung_end, paramPm25_yag_start, paramPm25_yag_end, paramTemperature, 
    Setting.updateIrSetting(paramSerialNumber, paramPm10_gang_start, paramPm10_gang_end, paramPm10_jung_start, paramPm10_jung_end, 
                            paramPm10_yag_start, paramPm10_yag_end, paramPm25_gang_start, paramPm25_gang_end, paramPm25_jung_start, 
                            paramPm25_jung_end, paramPm25_yag_start, paramPm25_yag_end, paramTemperature, paramCo2, function(err, success){
        if(err){
            console.error('IR 설정 정보 수정 중 오류 발생 :' + err.stack);
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

router.post('/getIrSettingBySn', function(req, res, next) {
    console.log('/getIrSettingBySn 호출됨.');

    var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramSerialNumber);

    Setting.getIrSettingBySn(paramSerialNumber, function(err, settings){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(settings){
            console.dir(settings);
            result.statusCode = OK;
            result.message = '성공';
            result.data = settings;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.post('/addIrSetting', function(req, res, next) {
    console.log('/addIrSetting 호출됨.');

    //var paramScrollRow = req.body.scrollRow || req.query.scrollRow;
    //var paramScrollTime = req.body.scrollTime || req.query.scrollTime;
    //var paramMonitoringTime = req.body.monitoringTime || req.query.monitoringTime;
    
    var paramSerialNumber      = req.body.serialNumber || req.query.serialNumber;                    
    var paramPm10_gang_start   = req.body.pm10_gang_start || req.query.pm10_gang_start;              
    var paramPm10_gang_end     = req.body.pm10_gang_end || req.query.pm10_gang_end;                  
    var paramPm10_jung_start   = req.body.pm10_jung_start || req.query.pm10_jung_start;              
    var paramPm10_jung_end     = req.body.pm10_jung_end || req.query.pm10_jung_end;                  
    var paramPm10_yag_start    = req.body.pm10_yag_start || req.query.pm10_yag_start;                
    var paramPm10_yag_end      = req.body.pm10_yag_end || req.query.pm10_yag_end;                    
    var paramPm25_gang_start   = req.body.pm25_gang_start || req.query.pm25_gang_start;              
    var paramPm25_gang_end     = req.body.pm25_gang_end || req.query.pm25_gang_end;                  
    var paramPm25_jung_start   = req.body.pm25_jung_start || req.query.pm25_jung_start;              
    var paramPm25_jung_end     = req.body.pm25_jung_end || req.query.pm25_jung_end;                  
    var paramPm25_yag_start    = req.body.pm25_yag_start || req.query.pm25_yag_start;                
    var paramPm25_yag_end      = req.body.pm25_yag_end || req.query.pm25_yag_end;                    
    var paramTemperature       = req.body.temperature || req.query.temperature;
    var paramCo2               = req.body.co2 || req.query.co2;
    var result = {statusCode : null, message : null, data : null};

    // console.log('요청 파라미터 : ' + paramScrollRow + ',' + paramScrollTime + ',' + paramMonitoringTime);

    Setting.addIrSetting(paramSerialNumber, paramPm10_gang_start, paramPm10_gang_end, paramPm10_jung_start, paramPm10_jung_end, 
        paramPm10_yag_start, paramPm10_yag_end, paramPm25_gang_start, paramPm25_gang_end, paramPm25_jung_start, 
        paramPm25_jung_end, paramPm25_yag_start, paramPm25_yag_end, paramTemperature, paramCo2, function(err, addedIrSetting){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('Ir 셋팅 추가 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = 'Ir 셋팅 추가 중 오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedIrSetting){
            console.dir(addedIrSetting);
            console.log('추가된 레코드의 아이디 : ' + addedIrSetting.insertId);
            result.statusCode = OK;
            result.message = '성공';
            result.data = addedIrSetting.insertId;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.get('/getIrSettings', function(req, res, next) {
    console.log('/getIrSettings 호출됨.');

    // var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
    var paramSerialNumber = "";
    var result = {statusCode : null, message : null, data : null};

    // console.log('요청 파라미터 : ' + paramSerialNumber);

    Setting.getIrSettings(paramSerialNumber, function(err, settings){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(settings){
            console.dir(settings);
            result.statusCode = OK;
            result.message = '성공';
            result.data = settings;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

module.exports = router;
