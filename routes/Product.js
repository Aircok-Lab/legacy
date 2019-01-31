import {
    OK,
    FAIL
} from "../public/javascripts/defined";
var express = require('express');
var router = express.Router();
var Product=require('../models/Product');

/* INSERT product */
router.post('/addProduct', function(req, res, next) {
    console.log('/addProduct 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramVersion = req.body.version || req.query.version;
    var paramPeriod = req.body.period || req.query.period;
    var paramIndoor = req.body.indoor || req.query.indoor;
    var paramPM25 = req.body.pm25 || req.query.pm25;
    var paramPM10 = req.body.pm10 || req.query.pm10;
    var paramCO2 = req.body.co2 || req.query.co2;
    var paramHCHO = req.body.hcho || req.query.hcho;
    var paramVOC = req.body.voc || req.query.voc;
    var paramTemperature = req.body.temperature || req.query.temperature;
    var paramHumidity = req.body.humidity || req.query.humidity;
    var paramNoise = req.body.noise || req.query.noise;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramName + ',' + paramVersion + ',' + paramPeriod + ',' + paramIndoor + ',' + paramPM25 + ',' + 
                paramPM10 + ',' + paramCO2 + ',' + paramHCHO + ',' + paramVOC + ',' + paramTemperature + ',' + paramHumidity + ',' + paramNoise);

    Product.addProduct(paramName, paramVersion, paramPeriod, paramIndoor, paramPM25, paramPM10, paramCO2, paramHCHO, 
                        paramVOC, paramTemperature, paramHumidity, paramNoise, function(err, addedProduct){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('제품 추가 중 오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedProduct){
            console.dir(addedProduct);
            console.log('추가된 레코드의 아이디 : ' + addedProduct.insertId);
            result.statusCode = OK;
            result.message = '성공';
            result.data = addedProduct.insertId;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* all products list */
router.get('/allProduct', function(req, res, next) {
    console.log('/allProduct 호출됨.');
    var result = {statusCode : null, message : null, data : null};

    Product.getAllProduct(function(err, allProducts){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(allProducts){
            console.dir(allProducts);
            result.statusCode = OK;
            result.message = '성공';
            result.data = allProducts;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

/* Product information of ProductId*/
router.post('/getProductById', function(req, res, next) {
    console.log('/getProductById 호출됨.');

    var paramProductID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramProductID);

    Product.getProductById(paramProductID, function(err, products){
        if(err){
            console.error('오류 발생 :' + err.stack);
            result.statusCode = FAIL;
            result.message = '오류 발생';
            res.send(result);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(products){
            console.dir(products);
            result.statusCode = OK;
            result.message = '성공';
            result.data = products;
            res.send(result);
        } else {
            result.statusCode = FAIL;
            result.message = '실패';
            res.send(result);
        }
    });
});

// router.put('/updateProduct', function(req, res, next) {
//     console.log('/updateProduct 호출됨.');

//     var paramProductID = req.body.id || req.query.id;
//     var paramName = req.body.name || req.query.name;
//     var paramVersion = req.body.version || req.query.version;
//     var paramPeriod = req.body.period || req.query.period;
//     var paramIndoor = req.body.indoor || req.query.indoor;
//     var paramPM25 = req.body.pm25 || req.query.pm25;
//     var paramPM10 = req.body.pm10 || req.query.pm10;
//     var paramCO2 = req.body.co2 || req.query.co2;
//     var paramHCHO = req.body.hcho || req.query.hcho;
//     var paramVOC = req.body.voc || req.query.voc;
//     var paramTemperature = req.body.temperature || req.query.temperature;
//     var paramHumidity = req.body.humidity || req.query.humidity;
//     var paramNoise = req.body.noise || req.query.noise;
//     var result = {statusCode : null, message : null, data : null};

//     console.log('요청 파라미터 : ' + paramProductID + ',' + paramName + ',' + paramVersion + ',' + paramPeriod + ',' + paramIndoor + ',' + paramPM25 + ',' + 
//                 paramPM10 + ',' + paramCO2 + ',' + paramHCHO + ',' + paramVOC + ',' + paramTemperature + ',' + paramHumidity + ',' + paramNoise);

//     Product.updateProduct(paramProductID, paramName, paramVersion, paramPeriod, paramIndoor, paramPM25, paramPM10, paramCO2, paramHCHO, 
//         paramVOC, paramTemperature, paramHumidity, paramNoise, function(err, success){
//         if(err){
//             console.error('제품 정보 수정 중 오류 발생 :' + err.stack);
//             result.statusCode = FAIL;
//             result.message = '오류 발생';
//             res.send(result);
//             return;
//         }

//         //결과 객체 있으면 성공 응답 전송
//         if(success){
//             console.dir(success);
//             result.statusCode = OK;
//             result.message = '성공';
//             res.send(result);
//         } else {
//             result.statusCode = FAIL;
//             result.message = '실패';
//             res.send(result);
//         }
//     });
// });

router.delete('/deleteProduct', function(req, res, next) {
    console.log('/deleteProduct 호출됨.');

    var paramProductID = req.body.id || req.query.id;
    var result = {statusCode : null, message : null, data : null};

    console.log('요청 파라미터 : ' + paramProductID);

    Product.deleteProduct(paramProductID, function(err, success){
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
