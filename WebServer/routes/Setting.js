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


module.exports = router;
