
import {
  PM10,
  PM25,
  CO2,
  HCHO,
  VOC,
  CO,
  NOISE
} from "../public/javascripts/defined";
import { isNull, isNullOrUndefined } from "util";
import { Console } from "console";

var express = require("express");
var router = express.Router();
var Data = require("../models/Data");
var Alarm = require("../models/Alarm");
var Device = require("../models/Device");
var RecentData = require("../models/RecentData");
var E3Core = require("../sensor/E3Core");
var global = require("../global");
const fs = require("fs");
var os = require("os");


/* Serial Number */
var deviceVersion = "v3.1.3";
var serialNum = "20IEADT119";


function dateFormat(dateStr) {
  var year = dateStr.substr(0, 4);
  var mon = dateStr.substr(4, 2);
  var day = dateStr.substr(6, 2);
  var hh = dateStr.substr(8, 2);
  var mm = dateStr.substr(10, 2);
  var result = year + "-" + mon + "-" + day + " " + hh + ":" + mm + ":00";
  return result;
}

function writeLog(date, log) {
  var filename = "/aircok/log_4com/" + date;
  fs.open(filename, "a", function(err, fileId) {
    if (err) throw err;
    fs.write(fileId, log + os.EOL, null, "utf8", (err, length) => {
      if (err) throw err;
      console.log(log);
      fs.close(fileId, () => {
        console.log("file is updated'");
      });
    });
  });
}

function isEmptyObject(param) {
  return Object.keys(param).length === 0 && param.constructor === Object;
}

function nvl(str, defaultStr){         
  if(typeof str == "undefined" || str == null || str == "")
      str = defaultStr ;   
  return str ;
}


router.post("/", function(req, res, next) {
  console.log("/ 호출됨.......");
  if ( isEmptyObject(req.body) && isEmptyObject(req.query)) {
      var result = "";
       result =
        "$$aircok:s$$NO|" +
        //paramDate +                                
        "전송데이터가없습니다." +
        "$$aircok:e$$"; 
        //"|!="; 
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(result); 
        return; 
  }
  var paramData = req.body || req.query || null;
  //var paramData = req.body || req.query || "";
  //var paramData = req.body || req.query;
  
  //if ((isNull(paramData)) || paramData.length == 0 )

   //var paramData = "202007170936|200600356170062263570|0001|0005|0005|00100|00365|1258|543|0020|00060|v5.1.2|!=";   --- v1
  //  var paramData = "202008121621|200600123456789000001|0001|0026|0019|00904|00030|00026|00108|1244|619|0000|00060|v1.2   -- v2 co 추가
  
  //console.log("##################:"+paramData);
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
        //console.log("#################:1");
        console.error("데이터 추가 중 오류 발생 :" + err.stack);
        result =
        "$$aircok:s$$NO|" +
        paramDate +                                
        "$$aircok:e$$"; 
        // "|!="; 
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(result);
        return;
      }      
      
      //console.log("#################:11111");

      if (info) {
        //console.log("#################:2");
        //console.log("info.indoor:"+info.indoor);
        //global.filename = info.firmware;
        if (info.indoor) {
          //  스마트 에어콕 트리플콤보 실내형
          if (deviceType == 5 || deviceType == 6 || deviceType == 7) {
            //트리플콤보
            console.log("deviceType == 5 || deviceType == 6 || deviceType == 7 콤보 에진입");
            if(arr[3] == 9999) var paramPM10 = null;
            else var paramPM10 = arr[3];
            if(arr[4] == 9999) var paramPM25 = null;
            else var paramPM25 = arr[4];
            if(arr[5] == 99999) var paramCO2 = null;
            else var paramCO2 = arr[5];
            if(arr[6] == 99999) var paramVOC = null;
            else var paramVOC = arr[6];
            if(arr[7] == 99999) var paramNoise = null;
            else var paramNoise = arr[7];
            if(arr[8] == 99999) var paramHCHO = null;
            else var paramHCHO = arr[8];
            if(arr[9] == 9999) var paramTemperature = null;
            else var paramTemperature = (Number(arr[9]) - 1000) / 10;
            if(arr[10] == 999) var paramHumidity = null;
            else var paramHumidity = Number(arr[10]) / 10;
            if(arr[11] == 9999) var paramCo = null;
            else var paramCo = arr[11];            
          } 
        }else {
          // 스마트 에어콕 트리플콤보 실외형
          console.log(" 스마트 에어콕 실외형 기타에 진입");
          var paramCO2 = null;
          var paramHCHO = null;
          var paramVOC = null;
          var paramNoise = null;
          var paramCo = null;
          if(arr[3] == 9999) var paramPM10 = null;
          else var paramPM10 = arr[3];
          if(arr[4] == 9999) var paramPM25 = null;
          else var paramPM25 = arr[4];
          if(arr[9] == 9999) var paramTemperature = null;
          else var paramTemperature = (Number(arr[9]) - 1000) / 10;
          if(arr[10] == 999) var paramHumidity = null;
          else var paramHumidity = Number(arr[10]) / 10;
        }
        
        Device.getDeviceYul(paramDeviceSN, function(err, yulinfos){

            var paramCO2_origin = paramCO2;
            var paramHCHO_origin = paramHCHO;
            var paramVOC_origin = paramVOC;
            var paramNoise_origin = paramNoise;
            var paramCo_origin = paramCo;
            var paramPM10_origin = paramPM10;
            var paramPM25_origin = paramPM25;
            var paramTemperature_origin = paramTemperature;
            var paramHumidity_origin = paramHumidity;

          // 배율이 있을때 처리 start
          if ( yulinfos && yulinfos.length > 0 && ( paramDate != "9999-99-99 99:99:00") ) {                    
            console.log("###############["+ paramDeviceSN + "] 배율적용 처리한다.");

          //  console.log(yulinfos);

            const yulinfo_pm10 = yulinfos.filter(yulinfo => yulinfo.sensorType === 'pm10' &&  paramPM10 >= yulinfo.min && paramPM10 <= yulinfo.max );
            const yulinfo_pm25 = yulinfos.filter(yulinfo => yulinfo.sensorType === 'pm25' &&  paramPM25 >= yulinfo.min && paramPM25 <= yulinfo.max );
            const yulinfo_co2 = yulinfos.filter(yulinfo => yulinfo.sensorType === 'co2' &&  paramCO2 >= yulinfo.min && paramCO2 <= yulinfo.max );
            const yulinfo_hcho = yulinfos.filter(yulinfo => yulinfo.sensorType === 'hcho' &&  paramHCHO >= yulinfo.min && paramHCHO <= yulinfo.max);
            const yulinfo_voc = yulinfos.filter(yulinfo => yulinfo.sensorType === 'voc' &&  paramVOC >= yulinfo.min && paramVOC <= yulinfo.max );
            const yulinfo_temperature = yulinfos.filter(yulinfo => yulinfo.sensorType === 'temperature' &&  paramTemperature >= yulinfo.min && paramTemperature <= yulinfo.max);
            const yulinfo_humidity = yulinfos.filter(yulinfo => yulinfo.sensorType === 'humidity' &&  paramHumidity >= yulinfo.min && paramHumidity <= yulinfo.max);
            const yulinfo_noise = yulinfos.filter(yulinfo => yulinfo.sensorType === 'noise' &&  paramNoise >= yulinfo.min && paramNoise <= yulinfo.max );
            const yulinfo_co = yulinfos.filter(yulinfo => yulinfo.sensorType === 'co' &&  paramCo >= yulinfo.min && paramCo <= yulinfo.max ); 

            /* console.log(yulinfo_pm10);            
            console.log(yulinfo_pm25);            
            console.log(yulinfo_co2);            
            console.log(yulinfo_hcho);            
            console.log(yulinfo_voc);            
            console.log(yulinfo_temperature);            
            console.log(yulinfo_humidity);            
            console.log(yulinfo_noise);            
            console.log(yulinfo_co);   */
                    
            paramPM10 = yulinfo_pm10[0] ? eval(Number(paramPM10) + " " + yulinfo_pm10[0].calc) : paramPM10 ;
            paramPM25 = yulinfo_pm25[0] ? eval(Number(paramPM25) + " " + yulinfo_pm25[0].calc) : paramPM25;
            paramCO2 =  yulinfo_co2[0] ? eval(Number(paramCO2) + " " + yulinfo_co2[0].calc) : paramCO2;
            paramHCHO = yulinfo_hcho[0] ? eval(Number(paramHCHO) + " " + yulinfo_hcho[0].calc) : paramHCHO;
            paramVOC =  yulinfo_voc[0] ? eval(Number(paramVOC) + " " + yulinfo_voc[0].calc) : paramVOC;
            paramTemperature =  yulinfo_temperature[0] ? eval(Number(paramTemperature) + " " + yulinfo_temperature[0].calc) : paramTemperature;
            paramHumidity =  yulinfo_humidity[0] ? eval(Number(paramHumidity) + " " + yulinfo_humidity[0].calc) : paramHumidity;
            paramNoise =  yulinfo_noise[0] ? eval(Number(paramNoise) + " " + yulinfo_noise[0].calc) : paramNoise ;
            paramCo =  yulinfo_co[0] ? eval(Number(paramCo) + " " + yulinfo_co[0].calc) : paramCo;
          }  
          // 배율이 있을때 처리 end

          // 배유처리 상관없이 이부분에 넣는다 start
          //========================================
          ///////////////////////////////////////////여기부터
          /* console.log( "최종수집값:",
            paramPM10,
            paramPM25,
            paramCO2,
            paramHCHO,
            paramVOC,
            paramTemperature,
            paramHumidity,
            paramNoise,
            paramCo
          ); */
          ///////////////////////////////////////////여기까지

          if (info.buildingType) {
            // 빌딩의 타입에 따른 지수 계산
          // console.log("#################:3");
            var status = {};
            var totalScore = {};
            status.pm10 = E3Core.getSensorIndex(PM10, Number(paramPM10));
            status.pm25 = E3Core.getSensorIndex(PM25, Number(paramPM25));
            status.co2 = E3Core.getSensorIndex(CO2, Number(paramCO2));
            status.hcho = E3Core.getSensorIndex(HCHO, Number(paramHCHO));
            status.voc = E3Core.getSensorIndex(VOC, Number(paramVOC));
            status.noise = E3Core.getSensorIndex(NOISE, Number(paramNoise));
            status.co = E3Core.getSensorIndex(CO, Number(paramCo));
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
            if ( paramDate != "9999-99-99 99:99:00" ) {
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
            if ( paramDate != "9999-99-99 99:99:00" ) {  
              //console.log("#######################:"+paramPM10_origin);
              //console.log("#######################:"+paramPM25_origin);
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
                paramCO2_origin,   // 여기부터, 배율적용으로 인한 추가 
                paramHCHO_origin,
                paramVOC_origin,
                paramNoise_origin,
                paramCo_origin,
                paramPM10_origin,
                paramPM25_origin,
                paramTemperature_origin,
                paramHumidity_origin,  // 여기까지 , 배율적용으로 인한 추가 
                function(err, addedData) {
                  if (err) {
                    console.error("콤보 디바이스의 로그 추가 중 오류 발생 :"+paramDeviceSN+":" + err.stack);                      
                    result =
                    "$$aircok:s$$NO|" +
                    paramDate +                                
                    "$$aircok:e$$";   
                    //"|!=";   
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end(result);
                    return;
                  }
                  //var urlInfo = "smart.aircok.com:13704";
                  //결과 객체 있으면 성공 응답 전송
                  if (addedData) {                      
                      // 버젼 체크
                      if (deviceType == 5 || deviceType == 6 || deviceType == 7 ) {  // 트리플 콤보                          
                            console.log("콤보 디바이스의 로그 수신:"+paramDate+":"+paramDeviceSN);                              
                              result =
                              "$$aircok:s$$OK|" +
                              paramDate +                      
                              "$$aircok:e$$";                                   
                              //"|!=";                         
                      }                      
                  }
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "text/plain");
                  res.end(result);
                }
              );
            }else{  //else start
              console.log(" 디바이스 정보 요청 수신:"+paramDate+":"+paramDeviceSN);
              // $$aircok:s$$0|00060|v1.1.0|700000|smart.aircok.com:12345|smart.aircok.com:12345|0.0.0.0|0.0.0.0|0.0.0.0|0.0.0.0|1$$aircok:e$$ 
              // $$aircok:s$$0|60|v5.1.2|285391|null|smart.aircok.com:11116|0.0.0.0|0.0.0.0|0.0.0.0|0.0.0.0|1|123.123.123.123:11116|123.123.123.123:11116|1|0$$aircok:e$$              
              // 공기청정기, 에어콘 가동 구분               
                  
                  var ir_pm10 = 0;
                  var ir_pm25 = 0;
                  var ir_temp = 0;                
                  var ir_co2  = 0;                
          
                  if (info.serialNumber) {
                    // console.log("비교진입");
                    if (paramPM10 >= info.pm10_gang_start && paramPM10 <= info.pm10_gang_end) {                    
                      ir_pm10 = 3;
                    }else if (paramPM10 >= info.pm10_jung_start && paramPM10 <= info.pm10_jung_end) {                    
                      ir_pm10 = 2; 
                    }else if (paramPM10 >= info.pm10_yag_start && paramPM10 <= info.pm10_yag_end) {                    
                      ir_pm10 = 1;
                    }else {                   
                      ir_pm10 = 0;
                    }                   

                    if (paramPM25 >= info.pm25_gang_start && paramPM25 <= info.pm25_gang_end) {
                      ir_pm25 = 3; 
                    }else if (paramPM25 >= info.pm25_jung_start && paramPM25 <= info.pm25_jung_end) {
                      ir_pm25 = 2;
                    }else if (paramPM25 >= info.pm25_yag_start && paramPM25 <= info.pm25_yag_end) {
                      ir_pm25 = 1;
                    }else {
                      ir_pm25 = 0;
                    }
                    // var max = Math.max(ir_pm10, ir_pm25); 
                    paramTemperature >= info.temperature_ir ? ir_temp = 1 : ir_temp = 0;

                    paramCO2 >= info.co2_ir ? ir_co2 = 1 : ir_co2 = 0;
                    
                  }

                  result =                  
                  //"$$aircok:s$$" +
                  info.reset_info +
                  "|" +
                  info.send_period +
                  "|" +
                  nvl(info.version,"null") +
                  "|" +
                  info.filesize +
                  "|" +
                  //info.ip +
                  nvl(info.fota_url,"null") +
                  "|" +
                  nvl(info.upload_url,"null") +
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
                  "|" +
                  nvl(info.checksum,"null") +
                  "|" +
                  nvl(info.upload_ip,"null") +
                  "|" +
                  nvl(info.fota_ip,"null") +
                  "|" +
                  Math.max(ir_pm10, ir_pm25, ir_co2) +
                  "|" +
                  ir_temp; // +
                  //"$$aircok:e$$";     
                  // console.log("info.version + "+ info.version);             
                  console.log("result + "+ result);
                  if ( info.reset_info === "1") {  // 리셋정보 원복 시킨다.                  
                      console.error("디바이스 H/W Reset 루틴 진입 :");
                      Device.updateDeviceResetInfo(
                        paramDeviceSN,
                        function(err, success) {
                          if (err) {
                            console.error("디바이스 H/W Reset 정보 수정 중 오류 발생 :" + err.stack);                            
                          }                    
                        }
                      ); 
                  }

                  // console.log("최종전송 디바이스 정보 값 :"+result); 
                  var assci_value = 0;
                  for (var idx = 0; idx <= result.length - 1 ; idx++ ){
                      //  console.log ("assci + " + result.substr(idx,1), result.substr(idx,1).charCodeAt());

                       assci_value = assci_value + result.substr(idx,1).charCodeAt();
                  }
                  
                  console.log("최종전송 디바이스 정보 값5 :"+assci_value); 

                  var hexString = "0x"+assci_value.toString(16);

                  console.log("hexString :"+"0x"+hexString); 
                  // console.log("yourNumber :"+parseInt(hexString, 16));   
                  // 09IWA13620
                  //if (paramDeviceSN == "09IWA12520" || paramDeviceSN == "09IWA13020" || paramDeviceSN == "09IWA11520" || paramDeviceSN == "09IWA12220" || paramDeviceSN == "09IWA13620" || paramDeviceSN == "09IWA13520" ) {
                  //  result = "$$aircok:s$$"+result+"$$aircok:e$$";
                  //} else {
                  //  result = "$$aircok:s$$"+result+"|"+result.length+"|"+hexString+"$$aircok:e$$";
                  //}

                  result = "$$aircok:s$$"+result+"|"+result.length+"|"+hexString+"$$aircok:e$$";
                  console.log("최종전송 디바이스 정보 값 1111111:"+result.length); 
                  console.log("최종전송 디바이스 정보 값 :"+result); 

                  res.statusCode = 200;
                  res.setHeader("Content-Type", "text/plain");
                  res.end(result);                   
            } // else end 
          }
          //-=======================================
          // 배유처리 상관없이 이부분에 넣는다 end
        });               
      } else {
        console.log("#################:4");
        // indoor, BuildingType, version 정보를 못 가지고 오는 경우
        result =
        "$$aircok:s$$NO|" +
        paramDate +                                
        "$$aircok:e$$"; 
        // "|!="; 
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(result);
      }      
    });
  } 
});

module.exports = router;


