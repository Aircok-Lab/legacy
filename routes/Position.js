import {
    OK,
    FAIL
} from "../public/javascripts/defined";
var express = require('express');
var router = express.Router();
var Position=require('../models/Position');
var User=require('../models/User');
var Device=require('../models/Device');

/* INSERT user */
router.post('/addPosition', function(req, res, next) {
    console.log('/addPosition 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramPosition = req.body.position || req.query.position;
    var paramBuildingID = req.body.buildingID || req.query.buildingID;
    var paramUserID = req.body.userID || req.query.userID;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramName + ',' + paramPosition + ',' + paramBuildingID + ',' + paramUserID);

    Position.addPosition(paramName, paramPosition, paramBuildingID, function(err, addedPosition){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('층 추가 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedPosition){
            console.dir(addedPosition);
            console.log('추가된 레코드의 아이디 : ' + addedPosition.insertId);
            result.statusCode = OK;
            result.message = '성공';
            result.data = addedPosition.insertId;
            res.send(result);

            User.getUserInfo(paramUserID, function(err, userInfo){
                if(err){
                    console.error('층 추가 중 오류 발생 :' + err.stack);
                    return;
                }

                if(userInfo){
                    console.dir(userInfo);
                    userInfo.PositionList = userInfo.PositionList + ','+addedPosition.insertId;
                    User.updateUser(userInfo.id, userInfo.Password, userInfo.Name, userInfo.Email, userInfo.Department, userInfo.Manager, 
                        userInfo.Phone, userInfo.BuildingList, userInfo.PositionList, function(err, success){
                        if(err){
                            console.error('사용자 정보 수정중 오류 발생 :' + err.stack);
                            return;
                        }
                        
                        if(success){
                            console.error('사용자 정보 수정 완료');
                        }
                        else{
                            console.log('사용자 정보 없음');
                        }
                    });
                }
            });
        } else {
            console.log('층 추가 정보 없음');
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* all building list */
router.get('/allPosition', function(req, res, next) {
    console.log('/allPosition 호출됨.');
    var result = {statusCode : null, message : null, data : null};
    
    Position.getAllPosition(function(err, allPositions){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(allPositions){
            console.dir(allPositions);
            result.statusCode = OK;
            result.message = '성공';
            result.data = allPositions;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* Position information of PositionId*/
router.post('/getPositionById', function(req, res, next) {
    console.log('/getPositionById 호출됨.');

    var paramPositionID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramPositionID);

    Position.getPositionById(paramPositionID, function(err, positions){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(positions){
            console.dir(positions);
            result.statusCode = OK;
            result.message = '성공';
            result.data = positions;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.post('/getPositionByBuildingId', function(req, res, next) {
    console.log('/getPositionByBuildingId 호출됨.');

    var paramBuildingID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramBuildingID);

    Position.getPositionByBuildingId(paramBuildingID, function(err, positions){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(positions){
            console.dir(positions);
            result.statusCode = OK;
            result.message = '성공';
            result.data = positions;
            res.send(positions);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.put('/updatePosition', function(req, res, next) {
    console.log('/updatePosition 호출됨.');

    var paramPositionID = req.body.id || req.query.id;
    var paramName = req.body.name || req.query.name;
    var paramPosition = req.body.position || req.query.position;
    var paramBuildingID = req.body.buildingID || req.query.buildingID;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramPositionID + ',' + paramName + ',' + paramPosition + ',' + paramBuildingID);

    Position.updatePosition(paramPositionID, paramName, paramPosition, paramBuildingID, function(err, success){
        if(err){
            console.error('층 정보 수정 중 오류 발생 :' + err.stack);
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

router.delete('/deletePosition', function(req, res, next) {
    console.log('/deletePosition 호출됨.');

    var paramPositionID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramPositionID);

    Device.getDeviceCountByPositionId(paramPositionID, function(err, deviceCount){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }
        console.error('deviceCount :' + deviceCount);
        if(deviceCount == 0) {
            Position.deletePosition(paramPositionID, function(err, success){
                if(err){
                    console.error('오류 발생 :' + err.stack);
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
        }else{
            result.statusCode = FAIL;
            result.message = '디바이스가 존재합니다. 디바이스를 삭제 후 삭제 바랍니다.';
            res.send(result);
        }
    });
});


module.exports = router;
