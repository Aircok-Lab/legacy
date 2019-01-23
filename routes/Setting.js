var express = require('express');
var router = express.Router();
var Setting=require('../models/Setting');

/* GET Setting listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* INSERT setting */
router.post('/addSetting', function(req, res, next) {
    console.log('/addSetting 호출됨.');

    var paramScrollRow = req.body.scrollRow || req.query.scrollRow;
    var paramScrollTime = req.body.scrollTime || req.query.scrollTime;
    var paramMonitoringTime = req.body.monitoringTime || req.query.monitoringTime;

    console.log('요청 파라미터 : ' + paramScrollRow + ',' + paramScrollTime + ',' + paramMonitoringTime);

    Setting.addSetting(paramScrollRow, paramScrollTime, paramMonitoringTime, function(err, addedSetting){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('셋팅 추가 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>셋팅 추가 중 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedSetting){
            console.dir(addedSetting);
            console.log('inserted' + addedSetting.affectedRows + 'rows');
            console.log('추가된 레코드의 아이디 : ' + addedSetting.insertId);

            res.send(addedSetting);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>셋팅 추가 실패</h2>');
            res.end();
        }
    });
});

/* Setting information of SettingId*/
router.post('/getSettingById', function(req, res, next) {
    console.log('/getSettingById 호출됨.');

    var paramSettingID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramSettingID);

    Setting.getSettingById(paramSettingID, function(err, settings){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(settings){
            console.dir(settings);
            res.send(settings);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 셋팅 찾기 실패</h2>');
            res.end();
        }
    });
});

router.put('/updateSetting', function(req, res, next) {
    console.log('/updateSetting 호출됨.');


    var paramSettingID = req.body.id || req.query.id;
    var paramScrollRow = req.body.scrollRow || req.query.scrollRow;
    var paramScrollTime = req.body.scrollTime || req.query.scrollTime;
    var paramMonitoringTime = req.body.monitoringTime || req.query.monitoringTime;

    console.log('요청 파라미터 : ' + paramSettingID + ',' + paramScrollRow + ',' + paramScrollTime + ',' + paramMonitoringTime);

    Setting.updateSetting(paramSettingID, paramScrollRow, paramScrollTime, paramMonitoringTime, function(err, success){
        if(err){
            console.error('셋팅 정보 수정 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>셋팅 정보 수정 중 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 셋팅 정보 변경 완료</h2>');
            res.end();
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>셋팅 정보 변경 실패</h2>');
            res.end();
        }
    });
});

router.delete('/deleteSetting', function(req, res, next) {
    console.log('/deleteSetting 호출됨.');

    var paramSettingID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramSettingID);

    Setting.deleteSetting(paramSettingID, function(err, success){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 셋팅 삭제 완료</h2>');
            res.end();
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 셋팅 삭제 실패</h2>');
            res.end();
        }
    });
});


module.exports = router;
