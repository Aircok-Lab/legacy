import {
    OK,
    FAIL
} from "../public/javascripts/defined";
var express = require('express');
var router = express.Router();
var Building=require('../models/Building');
var User=require('../models/User');
var Position =require('../models/Position');

/* INSERT user */
router.post('/addBuilding', function(req, res, next) {
    console.log('/addBuilding 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramAddress = req.body.address || req.query.address;
    var paramLatitude = req.body.latitude || req.query.latitude;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramUserID = req.body.userID || req.query.userID;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramName + ',' + paramAddress + ',' + paramLatitude + ',' + paramLongitude + ',' + paramUserID);

    Building.addBuilding(paramName, paramAddress, paramLatitude, paramLongitude, function(err, addedBuilding){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('빌딩 추가 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedBuilding){
            console.dir(addedBuilding);
            console.log('추가된 레코드의 아이디 : ' + addedBuilding.insertId);
            result.statusCode = OK;
            result.message = '성공';
            result.data = addedBuilding.insertId;
            res.send(result);

            User.getUserInfo(paramUserID, function(err, userInfo){
                if(err){
                    console.error('층 추가 중 오류 발생 :' + err.stack);
                    return;
                }

                if(userInfo){
                    userInfo.BuildingList = userInfo.BuildingList + ','+addedBuilding.insertId;
                    User.updateUser(userInfo.id, userInfo.Password, userInfo.Name, userInfo.Email, userInfo.Department, userInfo.Manager, 
                        userInfo.Phone, userInfo.BuildingList, userInfo.PositionList, function(err, success){
                        if(err){
                            console.error('사용자 정보 수정중 오류 발생 :' + err.stack);
                            return;
                        }
                        
                        if(success){
                            console.log('사용자 정보 수정 완료');
                        }
                        else{
                            console.log('사용자 정보 없음');
                        }
                    });
                }
            });
        } else {
            console.log('빌딩 추가 정보 없음');
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* all building list */
router.get('/allBuilding', function(req, res, next) {
    console.log('/allBuilding 호출됨.');
    var result = {statusCode : null, message : null, data : null};

    Building.getAllBuilding(function(err, allBuildings){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(allBuildings){
            console.dir(allBuildings);
            result.statusCode = OK;
            result.message = '성공';
            result.data = allBuildings;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* Building information of BuildingId*/
router.post('/getBuildingById', function(req, res, next) {
    console.log('/getBuildingById 호출됨.');

    var paramBuildingID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramBuildingID);

    Building.getBuildingById(paramBuildingID, function(err, buildings){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(buildings){
            console.dir(buildings);
            result.statusCode = OK;
            result.message = '성공';
            result.data = buildings;
            res.send(result);
        } else {
            console.log('빌딩 정보 없음');
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.put('/updateBuilding', function(req, res, next) {
    console.log('/updateBuilding 호출됨.');

    var paramBuildingID = req.body.id || req.query.id;
    var paramName = req.body.name || req.query.name;
    var paramAddress = req.body.address || req.query.address;
    var paramLatitude = req.body.latitude || req.query.latitude;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramBuildingID + ',' + paramName + ',' + paramAddress + ',' + paramLatitude + ',' + paramLongitude);

    Building.updateBuilding(paramBuildingID, paramName, paramAddress, paramLatitude, paramLongitude, function(err, success){
        if(err){
            console.error('빌딩 정보 수정 중 오류 발생 :' + err.stack);
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

router.delete('/deleteBuilding', function(req, res, next) {
    console.log('/deleteBuilding 호출됨.');

    var paramBuildingID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramBuildingID);
    Position.getPositionCountByBuildingId(paramBuildingID, function(err, positionCount){
        if(err){
            console.error('오류 발생 :' + err.stack);
            return;
        }
        console.error('positionCount :' + positionCount);
        if(positionCount == 0){
            Building.deleteBuilding(paramBuildingID, function(err, success){
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
        }
        else{
            result.statusCode = FAIL;
            result.message = '층이 존재합니다. 층을 삭제 후 삭제 바랍니다.';
            res.send(result);
        }
    });
});


module.exports = router;
