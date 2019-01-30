import {
    OK,
    FAIL
} from "../public/javascripts/defined";
var express = require('express');
var router = express.Router();
var Device=require('../models/Device');
var Data=require('../models/Data');
var Alarm=require('../models/Alarm');
var Product=require('../models/Product');
var RecentData=require('../models/RecentData');

/* INSERT user */
router.post('/addDevice', function(req, res, next) {
    console.log('/addDevice 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramSerialNumber= req.body.serialNumber || req.query.serialNumber;
    var paramPhone= req.body.phone || req.query.phone;
    var paramPositionID = req.body.positionID || req.query.positionID;
    var paramProductID = req.body.productID || req.query.productID;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramName + ',' + paramSerialNumber + ',' + paramPhone + ',' + paramPositionID + ',' + paramProductID);

    Device.addDevice(paramName, paramSerialNumber, paramPhone, paramPositionID, paramProductID, function(err, addedDevice){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('디바이스 추가 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedDevice){
            console.dir(addedDevice);
            console.log('추가된 레코드의 아이디 : ' + addedDevice.insertId);
            result.statusCode = OK;
            result.message = '성공';
            result.data = addedDevice.insertId;
            res.send(result);

            Product.getProductById(paramProductID, function(err, productInfo){
                if(err){
                    console.error('Data table 추가 중 오류 발생 :' + err.stack);
                    return;
                }
                if(productInfo){
                    Data.createTable(paramSerialNumber, productInfo[0], function(err, createDataTable){
                        if(err){
                            console.error('Data table 추가 중 오류 발생 :' + err.stack);
                            return;
                        }
                        if(createDataTable){
                            console.log("Data table 추가 성공");
                        }
                        else {
                            console.log("createDataTable 정보가 없음");
                        }
                    });

                    Alarm.createTable(paramSerialNumber, productInfo[0], function(err, createAlarmTable){
                        if(err){
                            console.error('Alarm table 추가 중 오류 발생 :' + err.stack);
                            return;
                        }
                        if(createAlarmTable){
                            console.log("Alarm table 추가 성공");
                        }
                        else {
                            console.log("createAlarmTable 정보가 없음");
                        }
                    });
                }
                else {
                    console.log("Product 정보가 없음");
                }
            });
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* all building list */
router.get('/allDevice', function(req, res, next) {
    console.log('/allDevice 호출됨.');
    var result = {statusCode : null, message : null, data : null};

    Device.getAllDevice(function(err, allDevices){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(allDevices){
            console.dir(allDevices);
            result.statusCode = OK;
            result.message = '성공';
            result.data = allDevices;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* Device information of DeviceId*/
router.post('/getDeviceBySerialNumber', function(req, res, next) {
    console.log('/getDeviceById 호출됨.');

    var paramDeviceSerialNumber = req.body.serialNumber || req.query.serialNumber;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramDeviceSerialNumber);

    Device.getDeviceById(paramDeviceSerialNumber, function(err, devices){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(devices){
            console.dir(devices);
            result.statusCode = OK;
            result.message = '성공';
            result.data = devices;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.post('/getDeviceByPositionId', function(req, res, next) {
    console.log('/getDeviceByPositionId 호출됨.');

    var paramPositionID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramPositionID);

    Device.getDeviceByPositionId(paramPositionID, function(err, devices){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(devices){
            console.dir(devices);
            result.statusCode = OK;
            result.message = '성공';
            result.data = devices;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

router.put('/updateDevice', function(req, res, next) {
    console.log('/updateDevice 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramSerialNumber= req.body.serialNumber || req.query.serialNumber;
    var paramPhone= req.body.phone || req.query.phone;
    var paramPositionID = req.body.positionID || req.query.positionID;
    var paramProductID = req.body.productID || req.query.productID;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + ',' + paramName + ',' + paramSerialNumber + ',' + paramPhone + ',' + paramPositionID + ',' + paramProductID);

    Device.updateDevice(paramName, paramSerialNumber, paramPhone, paramPositionID, paramProductID, function(err, success){
        if(err){
            console.error('디바이스 정보 수정 중 오류 발생 :' + err.stack);
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

router.delete('/deleteDevice', function(req, res, next) {
    console.log('/deleteDevice 호출됨.');

    var paramDeviceSerialNumber = req.body.serialNumber || req.query.serialNumber;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramDeviceSerialNumber);

    Device.deleteDevice(paramDeviceSerialNumber, function(err, success){
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
            RecentData.deleteRecentDataBySN(paramDeviceSerialNumber, function(err, success){
                if(err){
                    console.error('오류 발생 :' + err.stack);
                    return;
                }
        
                //결과 객체 있으면 성공 응답 전송
                if(success){
                    console.log(success);
                } else {
                    console.log("실패");
                }
            });
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});


module.exports = router;
