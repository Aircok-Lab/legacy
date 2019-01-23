var express = require('express');
var router = express.Router();
var Position=require('../models/Position');
var User=require('../models/User');
var Device=require('../models/Device');

/* GET Position listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* INSERT user */
router.post('/addPosition', function(req, res, next) {
    console.log('/addPosition 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramPosition = req.body.position || req.query.position;
    var paramBuildingID = req.body.buildingID || req.query.buildingID;
    var paramUserID = req.body.userID || req.query.userID;

    console.log('요청 파라미터 : ' + paramName + ',' + paramPosition + ',' + paramBuildingID + ',' + paramUserID);

    Position.addPosition(paramName, paramPosition, paramBuildingID, paramUserID, function(err, addedPosition){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('층 추가 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>층 추가 중 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedPosition){
            console.dir(addedPosition);
            console.log('inserted' + addedPosition.affectedRows + 'rows');
            console.log('추가된 레코드의 아이디 : ' + addedPosition.insertId);
            User.getUserInfo(paramUserID, function(err, userInfo){
                if(err){
                    console.error('층 추가 중 오류 발생 :' + err.stack);
        
                    res.send(addedPosition);
                    return;
                }

                if(userInfo){
                    console.dir(userInfo);
                    userInfo.PositionList = userInfo.PositionList + ','+addedPosition.insertId;
                    User.updateUser(userInfo.id, userInfo.Password, userInfo.Name, userInfo.Email, userInfo.Department, userInfo.Manager, 
                        userInfo.Phone, userInfo.BuildingList, userInfo.PositionList, function(err, success){
                        if(err){
                            console.error('사용자 정보 수정중 오류 발생 :' + err.stack);
        
                            res.send(addedPosition);
                            return;
                        }
                        
                        if(success){
                            console.error('사용자 정보 수정 완료:' + err.stack);
                        }
                        else{
                            console.log('사용자 정보 없음');
                        }
                    });
                }
            });
            res.send(addedPosition);
        } else {
            console.log('층 추가 정보 없음');
        }
    });
});

/* all building list */
router.get('/allPosition', function(req, res, next) {
    console.log('/allPosition 호출됨.');

    Position.getAllPosition(function(err, allPositions){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>모든 층 리스트 가져오기 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(allPositions){
            console.dir(allPositions);
            res.send(allPositions);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>모든 층 리스트 가져오기 실패</h2>');
            res.end();
        }
    });
});

/* Position information of PositionId*/
router.post('/getPositionById', function(req, res, next) {
    console.log('/getPositionById 호출됨.');

    var paramPositionID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramPositionID);

    Position.getPositionById(paramPositionID, function(err, positions){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(positions){
            console.dir(positions);
            res.send(positions);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 층 찾기 실패</h2>');
            res.end();
        }
    });
});

router.post('/getPositionByBuildingId', function(req, res, next) {
    console.log('/getPositionByBuildingId 호출됨.');

    var paramBuildingID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramBuildingID);

    Position.getPositionByBuildingId(paramBuildingID, function(err, positions){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(positions){
            console.dir(positions);
            res.send(positions);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 층 찾기 실패</h2>');
            res.end();
        }
    });
});

router.put('/updatePosition', function(req, res, next) {
    console.log('/updatePosition 호출됨.');

    var paramPositionID = req.body.id || req.query.id;
    var paramName = req.body.name || req.query.name;
    var paramPosition = req.body.position || req.query.position;
    var paramBuildingID = req.body.buildingID || req.query.buildingID;

    console.log('요청 파라미터 : ' + paramPositionID + ',' + paramName + ',' + paramPosition + ',' + paramBuildingID);

    Position.updatePosition(paramPositionID, paramName, paramPosition, paramBuildingID, function(err, success){
        if(err){
            console.error('층 정보 수정 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>층 정보 수정 중 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 층 정보 변경 완료</h2>');
            res.end();
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>층 정보 변경 실패</h2>');
            res.end();
        }
    });
});

router.delete('/deletePosition', function(req, res, next) {
    console.log('/deletePosition 호출됨.');

    var paramPositionID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramPositionID);

    Device.getDeviceCountByPositionId(paramPositionID, function(err, deviceCount){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }
        console.error('deviceCount :' + deviceCount);
        if(deviceCount == 0) {
            Position.deletePosition(paramPositionID, function(err, success){
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
                    res.write('<h2> 층 삭제 완료</h2>');
                    res.end();
                } else {
                    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                    res.write('<h2> 층 삭제 실패</h2>');
                    res.end();
                }
            });
        }else{
            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>디바이스가 존재합니다. 디바이스를 삭제 후 삭제 바랍니다.</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();
        }
    });
});


module.exports = router;
