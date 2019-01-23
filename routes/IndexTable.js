var express = require('express');
var router = express.Router();
var IndexTable=require('../models/IndexTable');

/* GET IndexTable listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* INSERT setting */
router.post('/addIndexTable', function(req, res, next) {
    console.log('/addIndexTable 호출됨.');

    var paramSensorType = req.body.sensorType || req.query.sensorType;
    var paramGrade = req.body.grade || req.query.grade;
    var paramMin = req.body.min || req.query.min;
    var paramMax = req.body.max || req.query.max;

    console.log('요청 파라미터 : ' + paramSensorType + ',' + paramGrade + ',' + paramMin + ',' + paramMax);

    IndexTable.addIndexTable(paramSensorType, paramGrade, paramMin, paramMax, function(err, addedIndexTable){
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
        if(addedIndexTable){
            console.dir(addedIndexTable);
            console.log('inserted' + addedIndexTable.affectedRows + 'rows');
            console.log('추가된 레코드의 아이디 : ' + addedIndexTable.insertId);

            res.send(addedIndexTable);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>셋팅 추가 실패</h2>');
            res.end();
        }
    });
});

/* IndexTable information of IndexTableId*/
router.post('/getIndexTableBySensorType', function(req, res, next) {
    console.log('/getIndexTableById 호출됨.');

    var paramSensorType = req.body.sensorType || req.query.sensorType;

    console.log('요청 파라미터 : ' + paramSensorType);

    IndexTable.getIndexTableBySensorType(paramSensorType, function(err, sensorIndexInfo){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(sensorIndexInfo){
            console.dir(sensorIndexInfo);
            res.send(sensorIndexInfo);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 셋팅 찾기 실패</h2>');
            res.end();
        }
    });
});

router.put('/updateIndexTable', function(req, res, next) {
    console.log('/updateIndexTable 호출됨.');

    var paramSensorType = req.body.sensorType || req.query.sensorType;
    var paramGrade = req.body.grade || req.query.grade;
    var paramMin = req.body.min || req.query.min;
    var paramMax = req.body.max || req.query.max;

    console.log('요청 파라미터 : ' + paramSensorType + ',' + paramGrade + ',' + paramMin + ',' + paramMax);

    IndexTable.updateIndexTable(paramSensorType, paramGrade, paramMin, paramMax, function(err, success){
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

router.delete('/deleteIndexTable', function(req, res, next) {
    console.log('/deleteIndexTable 호출됨.');

    var paramIndexTableID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramIndexTableID);

    IndexTable.deleteIndexTable(paramIndexTableID, function(err, success){
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
