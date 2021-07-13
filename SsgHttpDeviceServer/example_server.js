/* import {
    PM10,
    PM25,
    CO2,
    HCHO,
    VOC,
    CO,
    NOISE
  } from "./public/javascripts/defined"; */ 

const PM10 = "pm10";
const PM25 = "pm25";
const CO2 = "co2";
const HCHO = "hcho";
const VOC = "voc";
const NOISE = "noise";
const CO = "co";

  //var express = require("express");
  //var router = express.Router();
  var Data = require("./models/Data");
  var Alarm = require("./models/Alarm");
  var Device = require("./models/Device");
  var RecentData = require("./models/RecentData");
  const E3Core = require("./sensor/E3Core_Combo");
  var global = require("./global");
  //const fs = require("fs");
  //var os = require("os"); */
  
/* Serial Number */
var deviceVersion = "v3.1.3";
var serialNum = "20IEADT119";

var net = require('net');
// creates the server
var server = net.createServer();
var responseData = null;

//emitted when server closes ...not emitted until all connections closes.

function dateFormat(dateStr) {
    var year = dateStr.substr(0, 4);
    var mon = dateStr.substr(4, 2);
    var day = dateStr.substr(6, 2);
    var hh = dateStr.substr(8, 2);
    var mm = dateStr.substr(10, 2);
    var result = year + "-" + mon + "-" + day + " " + hh + ":" + mm + ":00";
    return result;
}

server.on('close',function(){
    console.log('Server closed !');
});

// emitted when new client connects
server.on('connection',function(socket){

    //var no_of_connections =  server.getConnections(); // sychronous version
    server.getConnections(function(error,count){
        console.log('Number of concurrent connections to the server : ' + count);
    });

    socket.setEncoding('utf8');

    socket.on('data',function(data){
        console.log('Client sent : ' + data.toString());       
        // responseData = data.toString() + '|01|3C00|200';
        responseData = 'OK|'+data.toString();
        //socket.write(responseData);        
        //console.log('response data : ', (new Date()).toString(), responseData);
        responseData = null;
        // 여기부터
        var paramData = data.toString();
        console.log("/ 호출됨.");
        console.log("paramData:"+paramData);

        if (paramData) {
            var result = "";
            var arr = paramData.split("|");
            console.log(arr[1]);
            var paramDeviceSN = arr[1].substring(6);
            console.log("paramDeviceSN:"+paramDeviceSN);
            var paramDate = dateFormat(arr[0]);
            console.log("paramDate:"+paramDate);
            var deviceType = arr[1].substring(2, 4);
            console.log("deviceType:"+deviceType);
            var indoor = arr[1].substring(4, 6);
            console.log("indoor:"+indoor);
            var date = arr[0].substr(0, 8);
            console.log("date:"+date);

            // writeLog(date, paramData);

            Device.getDeviceInfo(paramDeviceSN, function(err, info) {
                // indoor, BuildingType, version 정보 얻어옴
                if (err) {
                  console.error("데이터 추가 중 오류 발생 :" + err.stack);
                  result =
                  "NO|" +
                  paramDate +                                
                  "|!=";
                  socket.write(result);
                  result = null;
                  //res.statusCode = 200;
                  //res.setHeader("Content-Type", "text/plain");
                  //res.end(result);
                  return;
                }      
                
                if (info) {
                  console.log("info.indoor:"+info.indoor);
                  //global.filename = info.firmware;
                  if (info.indoor) {
                    //  스마트 에어콕 트리플콤보 실내형
                    if (deviceType == 5 || deviceType == 6 || deviceType == 7) {
                      // 트리플콤보
                      console.log("deviceType == 5 || deviceType == 6 || deviceType == 7 콤보 에진입");
                      var paramPM10 = arr[3];
                      var paramPM25 = arr[4];
                      var paramCO2 = arr[5];
                      var paramHCHO = arr[8];
                      var paramVOC = arr[6];
                      var paramTemperature = (Number(arr[9]) - 1000) / 10;
                      var paramHumidity = Number(arr[10]) / 10;
                      var paramNoise = arr[7];
                      var paramCo = arr[11];  
                    } 
                  } else {
                    // 스마트 에어콕 트리플콤보 실외형
                    console.log(" 스마트 에어콕 실외형 기타에 진입");
                    var paramCO2 = null;
                    var paramHCHO = null;
                    var paramVOC = null;
                    var paramNoise = null;
                    var paramCo = null;
                    var paramPM10 = arr[3];
                    var paramPM25 = arr[4];
                    var paramTemperature = (Number(arr[9]) - 1000) / 10;
                    var paramHumidity = Number(arr[10]) / 10;
                  }
                  console.log(
                    paramPM10,
                    paramPM25,
                    paramCO2,
                    paramHCHO,
                    paramVOC,
                    paramTemperature,
                    paramHumidity,
                    paramNoise,
                    paramCo
                  );
                  
          
                  if (info.buildingType) {
                    // 빌딩의 타입에 따른 지수 계산
                    var status = {};
                    var totalScore = {};
                    status.pm10 = E3Core.getSensorIndex(PM10, Number(paramPM10));
                    status.pm25 = E3Core.getSensorIndex(PM25, Number(paramPM25));
                    status.co2 = E3Core.getSensorIndex(CO2, Number(paramCO2));
                    status.hcho = E3Core.getSensorIndex(HCHO, Number(paramHCHO));
                    status.voc = E3Core.getSensorIndex(VOC, Number(paramVOC));
                    status.noise = E3Core.getSensorIndex(NOISE, Number(paramNoise));
                    status.co =  E3Core.getSensorIndex(CO, Number(paramCo));
                    status.temperature = E3Core.getTempIndex(
                      info.isPublicBuilding,
                       paramTemperature
                    );
                    status.humidity = E3Core.getHumidityIndex(
                      info.isPublicBuilding,
                      paramHumidity
                    );
                    totalScore = E3Core.calTotalIndex(
                      info.buildingType,
                      status.pm10.score,
                      status.pm25.score,
                      status.co2.score,
                      status.hcho.score,
                      status.voc.score,
                      status.temperature.score,
                      status.humidity.score,
                      status.noise.score,
                      status.co.score
                    );
                    if ( paramDate != "999999999999" ) {
                        RecentData.updateRecentData(
                          status.pm10,
                          status.pm25,
                          status.co2,
                          status.hcho,
                          status.voc,
                          status.temperature,
                          status.humidity,
                          status.noise,
                          status.co,
                          totalScore,
                          paramDate,
                          paramDeviceSN,
                          function(err, success) {
                            if (err) {
                              console.error("최신 데이터 수정 중 오류 발생 :" + err.stack);
                              return;
                            }
                            if (success) {
                              console.log("최신 데이터 수정 완료 ");
                            }
                          }
                        );
                    }  
                    if ( paramDate != "999999999999" ) {  
                      Data.addData(
                        status.pm10,
                        status.pm25,
                        status.co2,
                        status.hcho,
                        status.voc,
                        status.temperature,
                        status.humidity,
                        status.noise,
                        status.co,
                        totalScore,
                        paramDate,
                        paramDeviceSN,
                        info,
                        function(err, addedData) {
                          if (err) {
                            console.error("콤보 디바이스의 로그 추가 중 오류 발생 :"+paramDeviceSN+":" + err.stack);                      
                            result =
                            "NO|" +
                            paramDate +                                
                            "|!=";  
                            socket.write(result);
                            result = null; 
                            //res.statusCode = 200;
                            //res.setHeader("Content-Type", "text/plain");
                            //res.end(result);
                            return;
                          }
                          //var urlInfo = "smart.aircok.com:13704";
                          //결과 객체 있으면 성공 응답 전송
                          if (addedData) {                      
                              // 버젼 체크
                              if (deviceType == 5 || deviceType == 6 || deviceType == 7 ) {  // 트리플 콤보                          
                                    console.log("콤보 디바이스의 로그 수신:"+paramDate+":"+paramDeviceSN);                              
                                      result =
                                      "OK|" +
                                      paramDate +                                
                                      "|!=";                         
                              }                      
                          }
                          socket.write(result);
                          result = null;
                          //res.statusCode = 200;
                          //res.setHeader("Content-Type", "text/plain");
                          //res.end(result);
                        }
                      );
                    }else{  //else start
                      console.log(" 디바이스 정보 요청 수신:"+paramDate+":"+paramDeviceSN);
                          result =
                          "0|" +
                          info.send_period +
                          "|" +
                          info.version +
                          "|" +
                          info.filesize +
                          "|" +
                          info.ip +
                          "|" +
                          info.upload_url +
                          "|" +
                          info.ethernet_ip +
                          "|" +
                          info.subnet +
                          "|" +
                          info.gateway +
                          "|" +
                          info.dns +  
                          "|" +
                          info.dhcp +  
                          "|!=";
                          socket.write(result);
                          result = null;
                          //res.statusCode = 200;
                          //res.setHeader("Content-Type", "text/plain");
                          //res.end(result);                
                    } // else end 
                  }
                } else {
                  // indoor, BuildingType, version 정보를 못 가지고 오는 경우
                  result =
                  "NO|" +
                  paramDate +                                
                  "|!="; 
                  socket.write(result);
                  result = null;
                  //res.statusCode = 200;
                  //res.setHeader("Content-Type", "text/plain");
                  //res.end(result);
                }      
            });
        }
        // 여기까지
    });

    socket.on('error',function(error){
        console.log('Error : ' + error);
    });

    socket.on('end',function(data){
        console.log('Socket ended from other end!');
        // console.log('End data : ' + data);
    });

    socket.on('close',function(error){
        if(error){
            console.log('Socket was closed coz of transmission error');
        }
    });

});

// emits when any error occurs -> calls closed event immediately after this.
server.on('error',function(error){
    console.log('Error: ' + error);
});

//emits when server is bound with server.listen
server.on('listening',function(){
    console.log('Server is listening!');
});

server.maxConnections = 10000;

//static port allocation
// server.listen(8110);
server.listen(11115, function() {
    console.log('Server listening for connections');
});
