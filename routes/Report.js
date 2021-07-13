import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var _ = require('lodash');
var iconvLite = require('iconv-lite');
var report = require("../models/Report");
var Product = require("../models/Product");
function getDownloadFilename(req, filename) {
  var header = req.headers['user-agent'];

  if (header.includes("MSIE") || header.includes("Trident")) { 
      return encodeURIComponent(filename).replace(/\\+/gi, "%20");
  } else if (header.includes("Chrome")) {
      return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
  } else if (header.includes("Opera")) {
      return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
  } else if (header.includes("Firefox")) {
      return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
  }

  return filename;
}

router.post("/getAVGe3ScoreByDate", function(req, res, next) {
  console.log("/getAVGe3ScoreByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  report.getAVGe3ScoreByDate(
    paramSerialNumber,
    paramStartDate,
    paramEndDate,
    function(err, addedAverage) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

      if (err) {
        console.error("스코어 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (addedAverage) {
        console.dir(addedAverage);
        console.log("추가된 레코드의 아이디 : " + addedAverage);
        result.statusCode = OK;
        result.message = "성공";
        result.data = addedAverage;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.post("/getCountE3Index", function(req, res, next) {
  console.log("/getCountE3Index 호출됨.");
  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var paramE3Index = req.body.e3Index || req.query.e3Index;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate +
      "," +
      paramE3Index
  );

  report.getCountE3Index(
    paramSerialNumber,
    paramStartDate,
    paramEndDate,
    paramE3Index,
    function(err, countedIndex) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

      if (err) {
        console.error("인덱스 카운트 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (countedIndex) {
        console.dir(countedIndex);
        console.log("추가된 레코드의 아이디 : " + countedIndex);
        result.statusCode = OK;
        result.message = "성공";
        result.data = countedIndex;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.post("/getChartDataByDate", function(req, res, next) {
  console.log("/getChartDataByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  report.getChartDataByDate(
    paramSerialNumber,
    paramStartDate,
    paramEndDate,
    function(err, chartData) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

      if (err) {
        console.error("데이터 로드중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (chartData) {
        result.statusCode = OK;
        result.message = "성공";
        result.data = chartData;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.get("/getChartDataByDateByGet", function(req, res, next) {
  console.log("/getChartDataByDateByGet 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  Product.getProductBySerialNumber(paramSerialNumber, function(
    err,
    productInfo
  ) {
    if (err) {
      console.error("Data table 추가 중 오류 발생 :" + err.stack);
      return;
    }
    if (productInfo) {

          report.getChartDataByDateByGet(
            productInfo,
            paramSerialNumber,
            paramStartDate,
            paramEndDate,
            function(err, chartData) {
              // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

              if (err) {
                console.error("데이터 로드중 오류 발생 :" + err.stack);
                result.statusCode = FAIL;
                result.message = "오류 발생";
                res.send(result);
                return;
              }
              //결과 객체 있으면 성공 응답 전송
              if (chartData) {
                //result.statusCode = OK;
                //result.message = "성공";
                //result.data = chartData;
                //res.send(result);
                var contentArr = [],
                        keys = _.keys(chartData[0]),
                        len = chartData.length,
                        resultObj = {
                            datetime: []
                        };

                    contentArr.push(keys);

                    for (var i = 0; i < len; i++) {
                        var arr = [];
                        _.forEach(keys, function(key) {
                            arr.push(chartData[i][key]);
                        });
                        
                        contentArr.push(arr);
                    }
                    
                    var deviceName = paramSerialNumber || '',
                        filename = isNaN(deviceName) ? deviceName + "_데이터_" + Date.now() + '.csv' : "데이터_" + Date.now() + '.csv';
                    
                    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                    res.setHeader("Content-Disposition", "attachment; filename=" + getDownloadFilename(req, filename));
                
                    res.send(contentArr.join("\n"));

              } else {
                result.statusCode = FAIL;
                result.message = "실패";
                res.send(result);
              }
            }
          );
    } else {
      console.log("Product 정보가 없음");
      result.statusCode = FAIL;
      result.message = "Product 정보가 없음";
      res.send(result);
    }
  });        
});

router.post("/getChartDataByDate2", function(req, res, next) {
  console.log("/getChartDataByDate2 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  Product.getProductBySerialNumber(paramSerialNumber, function(
    err,
    productInfo
  ) {
    if (err) {
      console.error("Data table 추가 중 오류 발생 :" + err.stack);
      return;
    }
    if (productInfo) {
      report.getChartDataByDate2(
        productInfo,
        paramSerialNumber,
        paramStartDate,
        paramEndDate,
        function(err, chartData) {
          // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
    
          if (err) {
            console.error("데이터 로드중 오류 발생 :" + err.stack);
            result.statusCode = FAIL;
            result.message = "오류 발생";
            res.send(result);
            return;
          }
    
          //결과 객체 있으면 성공 응답 전송
          if (chartData) {
            result.statusCode = OK;
            result.message = "성공";
            result.data = chartData;
            res.send(result);
          } else {
            result.statusCode = FAIL;
            result.message = "실패";
            res.send(result);
          }
        }
      );
    } else {
      console.log("Product 정보가 없음");
      result.statusCode = FAIL;
      result.message = "Product 정보가 없음";
      res.send(result);
    }
  });  
});

router.post("/get5minDataByDate", function(req, res, next) {
  console.log("/get5minDataByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  Product.getProductBySerialNumber(paramSerialNumber, function(
    err,
    productInfo
  ) {
    if (err) {
      console.error("Data table 추가 중 오류 발생 :" + err.stack);
      return;
    }
    if (productInfo) {
      report.get5minDataByDate(
        productInfo,
        paramSerialNumber,
        paramStartDate,
        paramEndDate,
        function(err, data) {
          if (err) {
            console.error("Data table 추가 중 오류 발생 :" + err.stack);
            return;
          }
          if (data) {
            console.log("Data 성공");
            result.statusCode = OK;
            result.message = "성공";
            result.data = data;
            res.send(result);
          } else {
            console.log("data 정보가 없음");
            result.statusCode = FAIL;
            result.message = "data 정보가 없음";
            res.send(result);
          }
        }
      );
    } else {
      console.log("Product 정보가 없음");
      result.statusCode = FAIL;
      result.message = "Product 정보가 없음";
      res.send(result);
    }
  });
});

router.post("/getHourDataByDate", function(req, res, next) {
  console.log("/getHourDataByDate 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  var paramStartDate = req.body.startDate || req.query.startDate;
  var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber +
      "," +
      paramStartDate +
      "," +
      paramEndDate
  );

  Product.getProductBySerialNumber(paramSerialNumber, function(
    err,
    productInfo
  ) {
    if (err) {
      console.error("Data table 추가 중 오류 발생 :" + err.stack);
      return;
    }
    if (productInfo) {
      report.getHourDataByDate(
        productInfo,
        paramSerialNumber,
        paramStartDate,
        paramEndDate,
        function(err, data) {
          if (err) {
            console.error("Data table 추가 중 오류 발생 :" + err.stack);
            return;
          }
          if (data) {
            console.log("Data 성공");
            result.statusCode = OK;
            result.message = "성공";
            result.data = data;
            res.send(result);
          } else {
            console.log("data 정보가 없음");
            result.statusCode = FAIL;
            result.message = "data 정보가 없음";
            res.send(result);
          }
        }
      );
    } else {
      console.log("Product 정보가 없음");
      result.statusCode = FAIL;
      result.message = "Product 정보가 없음";
      res.send(result);
    }
  });
});

router.post("/getTotalComment", function(req, res, next) {
  console.log("/getTotalComment 호출됨.");

  //console.log(req);

  var paramDeviceData = req.body.deviceData || req.query.deviceData || null;
  var result = { statusCode: null, message: null, data: null };
  if (!paramDeviceData) {
    console.log("deviceData 정보가 없음");
    result.statusCode = FAIL;
    result.message = "deviceData 정보가 없음";
    res.send(result);
    return;
  }
  
  console.log("요청 파라미터 : " + paramDeviceData);
  console.log("1111##########################");
  
  var properties = paramDeviceData.split(', ');
  var obj = {};
  properties.forEach(function(property) {
    var tup = property.split(': ');
    obj[tup[0]] = tup[1];
  });

  
  var v_temperatureIndex = obj.temperatureIndex;
  var v_humidityIndex = obj.humidityIndex;
  var v_pm25Index = obj.pm25Index;
  var v_pm10Index = obj.pm10Index;
  var v_co2Index = obj.co2Index;
  var v_hchoIndex = obj.hchoIndex;
  var v_vocIndex = obj.vocIndex;
  var v_e3Index = obj.e3Index;

   
  console.log(v_temperatureIndex);
  console.log(v_humidityIndex);
  console.log(v_pm25Index);
  console.log(v_pm10Index);
  console.log(v_co2Index);
  console.log(v_hchoIndex);
  console.log(v_vocIndex);
  console.log(v_e3Index); 


  var device = {
    //e3Index: paramDeviceData.e3Index,
    e3Index: v_e3Index,
    data: [
      {
        name: "온도",
        // index: paramDeviceData.temperatureIndex,
        index: v_temperatureIndex,
        advice: "냉/난방기를 "
      },
      {
        name: "습도",
        //index: paramDeviceData.humidityIndex,
        index: v_humidityIndex,
        advice: "가습/제습 장치를 "
      },
      {
        name: "PM25",
        //index: paramDeviceData.pm25Index,
        index: v_pm25Index,
        advice: "공기청정기를 "
      },
      {
        name: "PM10",
        //index: paramDeviceData.pm10Index,
        index: v_pm10Index,
        advice: "공기청정기를 "
      },
      {
        name: "CO2",
        // index: paramDeviceData.co2Index,
        index: v_co2Index,
        advice: "환기장치를 "
      },
      {
        name: "HCHO",
        // index: paramDeviceData.hchoIndex,
        index: v_hchoIndex,
        advice: "환기장치를 "
      },
      {
        name: "VOC",
        //index: paramDeviceData.vocIndex,
        index: v_vocIndex,
        advice: "환기장치를 "
      } //,
      // {
      //   name: "noise",
      //   index: paramDeviceData.noiseIndex
      // }
    ]
  };

  //console.log("####전#### :"+device.data);

  device.data.sort(function(a, b) {
      //console.log("####배열처리전#### :"+a.name);
      //console.log("####배열처리전#### :"+a.index);
    return a.index < b.index ? 1 : a.index > b.index ? -1 : 0;
  });

  //console.log("####후#### :"+device.data);

  let adviceStr1 = "",
    adviceStr2 = "",
    adviceStr3 = "",
    adviceStr4 = "";
  let cnt = 0;

  if (device.e3Index == 1 || device.e3Index == 2) {
    if (device.e3Index == 1)
      adviceStr1 += "실내공간 공기질이 쾌적한 상태가 유지되고 있습니다.";
    else if (device.e3Index == 2)
      adviceStr1 += "실내공간 공기질이 전반적으로 쾌적한 상태입니다.";

    device.data.map(sensor => {
      //console.log("####배열처리#### :"+sensor.name);
      //console.log("####배열처리#### :"+sensor.index);
      if (sensor.index > 3) {
        adviceStr2 += sensor.name + ",";
        cnt++;
        if (cnt == 1) {
          adviceStr3 =
            sensor.name +
            " 관리를 위하여 " +
            sensor.advice +
            "작동시켜 주세요.";
        }
        if (cnt == 2) {
          adviceStr4 =
            sensor.name +
            " 관리를 위하여 " +
            sensor.advice +
            "작동시켜 주세요.";
        }
      }
    });
    let temp = adviceStr2.slice(0, -1);
    if (cnt > 0) adviceStr2 = temp + " 관리가 필요합니다.";
  } else {
    device.data.map(sensor => {
      if (sensor.index > 3) {
        adviceStr1 += sensor.name + ",";
        cnt++;
      }
    });
    adviceStr1 = adviceStr1.slice(0, -1) + "가 좋지 않습니다.";
    if (cnt > 2) adviceStr2 = "특히 ";
    adviceStr2 +=
      device.data[0].name + ", " + device.data[1].name + " 관리가 필요합니다.";
    adviceStr3 =
      device.data[0].name +
      " 관리를 위하여 " +
      device.data[0].advice +
      "작동시켜 주세요.";
    adviceStr4 =
      device.data[1].name +
      " 관리를 위하여 " +
      device.data[1].advice +
      "작동시켜 주세요.";
  }
  result.statusCode = OK;
  result.message = "성공";
  result.data = adviceStr1 + "</br>" + adviceStr2 + "</br>" + adviceStr3 + "</br>" + adviceStr4;
  res.send(result);
});

router.post("/getSensorComment", function(req, res, next) {
  console.log("/getSensorComment 호출됨.");

  var paramSensorType = req.body.sensorType || req.query.sensorType || null;
  var paramIndex = req.body.index || req.query.index || null;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSensorType + paramIndex);

  if (!paramSensorType || !paramIndex) {
    console.log("sensorData 정보가 없음");
    result.statusCode = FAIL;
    result.message = "sensorData 정보가 없음";
    res.send(result);
    return;
  }

  var data = {};
  if (paramSensorType === "temperature") {
    data = {
      name: "온도",
      index: paramIndex,
      advice: "냉/난방기를 "
    };
  } else if (paramSensorType === "humidity") {
    data = {
      name: "습도",
      index: paramIndex,
      advice: "가습/제습 장치를 "
    };
  } else if (paramSensorType === "pm25") {
    data = {
      name: "PM25",
      index: paramIndex,
      advice: "공기청정기를 "
    };
  } else if (paramSensorType === "pm10") {
    data = {
      name: "PM10",
      index: paramIndex,
      advice: "공기청정기를 "
    };
  } else if (paramSensorType === "co2") {
    data = {
      name: "CO2",
      index: paramIndex,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "hcho") {
    data = {
      name: "HCHO",
      index: paramIndex,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "voc") {
    data = {
      name: "VOC",
      index: paramIndex,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "co") {
    data = {
      name: "CO",
      index: paramIndex,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "noise") {
    data = {
      name: "소음",
      index: paramIndex,
      advice: "볼륨을 "
    };
  }

  let adviceStr = "";

  if (data.index == 1) {
    adviceStr = data.name + " 상태가 좋게 유지되고 있습니다.";
  } else if (data.index == 2) {
    adviceStr = data.name + " 상태가 보통으로 유지되고 있습니다.";
  } else if (data.index == 3) {
    adviceStr =
      data.name +
      " 상태가 약간나쁨으로 유지되고 있습니다." +
      data.name +
      " 관리가 필요합니다.";
  } else if (data.index == 4) {
    adviceStr =
      data.name +
      " 상태가 나쁨으로 유지되고 있습니다." +
      data.name +
      " 관리가 필요합니다. " +
      data.name +
      " 관리를 위하여 " +
      data.advice +
      "작동시켜 주세요.";
  } else if (data.index == 5) {
    adviceStr =
      data.name +
      " 상태가 매우나쁨으로 유지되고 있습니다." +
      data.name +
      " 관리가 필요합니다. " +
      data.name +
      " 관리를 위하여 " +
      data.advice +
      "작동시켜 주세요.";
  } else if (data.index == 6) {
    adviceStr =
      data.name +
      " 상태가 최악으로 유지되고 있습니다." +
      data.name +
      " 관리가 필요합니다. " +
      data.name +
      " 관리를 위하여 " +
      data.advice +
      "작동시켜 주세요.";
  }

  result.statusCode = OK;
  result.message = "성공";
  result.data = adviceStr;
  res.send(result);
});

router.post("/getSensorAlert", function(req, res, next) {
  console.log("/getSensorAlert 호출됨.");

  var paramSensorType = req.body.sensorType || req.query.sensorType || null;
  var paramAlarm = req.body.alarm || req.query.alarm || null;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramSensorType + paramAlarm);

  if (!paramSensorType) {
    console.log("sensorData 정보가 없음");
    result.statusCode = FAIL;
    result.message = "sensorData 정보가 없음";
    res.send(result);
    return;
  }

  var data = {};
  if (paramSensorType === "temperature") {
    data = {
      name: "온도",
      alarm: paramAlarm,
      advice: "냉/난방기를 "
    };
  } else if (paramSensorType === "humidity") {
    data = {
      name: "습도",
      alarm: paramAlarm,
      advice: "가습/제습 장치를 "
    };
  } else if (paramSensorType === "pm25") {
    data = {
      name: "PM25",
      alarm: paramAlarm,
      advice: "공기청정기를 "
    };
  } else if (paramSensorType === "pm10") {
    data = {
      name: "PM10",
      alarm: paramAlarm,
      advice: "공기청정기를 "
    };
  } else if (paramSensorType === "co2") {
    data = {
      name: "CO2",
      alarm: paramAlarm,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "hcho") {
    data = {
      name: "HCHO",
      alarm: paramAlarm,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "voc") {
    data = {
      name: "VOC",
      alarm: paramAlarm,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "co") {
    data = {
      name: "CO",
      alarm: paramAlarm,
      advice: "환기장치를 "
    };
  } else if (paramSensorType === "noise") {
    data = {
      name: "소음",
      alarm: paramAlarm,
      advice: "볼륨을 "
    };
  }

  let adviceStr = "";

  if (data.alarm == 1) {
    adviceStr =
      data.name + " 수치가 높습니다. " + data.advice + "작동시켜 주세요.";
  } else if (data.alarm == 0) {
    adviceStr = data.name + " 수치가 낮아지고 있어요.";
  }

  result.statusCode = OK;
  result.message = "성공";
  result.data = adviceStr;
  res.send(result);
});

router.post("/getChartDataByDate3", function(req, res, next) {
  console.log("/getChartDataByDate3 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;  
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramSerialNumber 
  );

  Product.getProductBySerialNumber(paramSerialNumber, function(
    err,
    productInfo
  ) {
    if (err) {
      console.error("Data table 추가 중 오류 발생 :" + err.stack);
      return;
    }
    if (productInfo) {
      report.getChartDataByDate3(
        productInfo,
        paramSerialNumber,        
        function(err, chartData) {
          // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
    
          if (err) {
            console.error("데이터 로드중 오류 발생 :" + err.stack);
            result.statusCode = FAIL;
            result.message = "오류 발생";
            res.send(result);
            return;
          }
    
          //결과 객체 있으면 성공 응답 전송
          if (chartData) {
            result.statusCode = OK;
            result.message = "성공";
            result.data = chartData;
            res.send(result);
          } else {
            result.statusCode = FAIL;
            result.message = "실패";
            res.send(result);
          }
        }
      );
    } else {
      console.log("Product 정보가 없음");
      result.statusCode = FAIL;
      result.message = "Product 정보가 없음";
      res.send(result);
    }
  });  
});

router.post("/getWqPredDataBySerial", function(req, res, next) {
  console.log("/getWqPredDataBySerial 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  //var paramStartDate = req.body.startDate || req.query.startDate;
  //var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
   "요청 파라미터 : " +
     paramSerialNumber
  );

  report.getWqPredDataBySerial(
    paramSerialNumber,
    //paramStartDate,
    //paramEndDate,
    function(err, predData) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

      if (err) {
        console.error("데이터 로드중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (predData) {
        result.statusCode = OK;
        result.message = "성공";
        result.data = predData;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.post("/getPredDataBySerial", function(req, res, next) {
  console.log("/getPredDataBySerial 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  //var paramStartDate = req.body.startDate || req.query.startDate;
  //var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
   "요청 파라미터 : " +
     paramSerialNumber
  );

  report.getPredDataBySerial(
    paramSerialNumber,
    //paramStartDate,
    //paramEndDate,
    function(err, predData) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

      if (err) {
        console.error("데이터 로드중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (predData) {
        result.statusCode = OK;
        result.message = "성공";
        result.data = predData;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.post("/getDevice10min", function(req, res, next) {
  console.log("/getDevice10min 호출됨.");

  var paramSerialNumber = req.body.serialNumber || req.query.serialNumber;
  //var paramStartDate = req.body.startDate || req.query.startDate;
  //var paramEndDate = req.body.endDate || req.query.endDate;
  var result = { statusCode: null, message: null, data: null };

  console.log(
   "요청 파라미터 : " +
     paramSerialNumber
  );

  report.getDevice10min(
    paramSerialNumber,
    //paramStartDate,
    //paramEndDate,
    function(err, minData) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송

      if (err) {
        console.error("데이터 로드중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (minData) {
        result.statusCode = OK;
        result.message = "성공";
        result.data = minData;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

router.post("/getActComment", function(req, res, next) {
  console.log("/getActComment 호출됨.");

  var paramDeviceData = req.body.deviceData || req.query.deviceData || null;
  var result = { statusCode: null, message: null, data: null };
  if (!paramDeviceData) {
    console.log("deviceData 정보가 없음");
    result.statusCode = FAIL;
    result.message = "deviceData 정보가 없음";
    res.send(result);
    return;
  }
  console.log("요청 파라미터 : " + paramDeviceData);
  var properties = paramDeviceData.split(', ');
  var obj = {};
  
  properties.forEach(function(property) {
    var tup = property.split(': ');
    obj[tup[0]] = tup[1];
  }); 

  
  var v_temperature = obj.temperature;
  var v_humidity = obj.humidity;
  var v_pm25 = obj.pm25;
  var v_pm10 = obj.pm10;
  var v_co2 = obj.co2;
  var v_hcho = obj.hcho;
  var v_voc = obj.voc;
  var v_date = obj.date;
  var v_temperatureIndex = obj.temperatureIndex;
  var v_humidityIndex = obj.humidityIndex;
  var v_jisuGubun = obj.jisuGubun;
  var v_deviceName = obj.deviceName;

  if(v_jisuGubun == 'total') {
    var v_pm25Index = obj.pm25Index;
    var v_pm10Index = obj.pm10Index;  
    var v_co2Index = obj.co2Index;
    var v_hchoIndex = obj.hchoIndex;
    var v_vocIndex = obj.vocIndex;
    var v_e3Index = obj.e3Index;

    
    console.log("v_temperatureIndex"+v_temperatureIndex);
    console.log("v_humidityIndex"+v_humidityIndex);
    console.log("v_pm25Index"+v_pm25Index);
    console.log("v_pm10Index"+v_pm10Index);
    console.log("v_co2Index"+v_co2Index);
    console.log("v_hchoIndex"+v_hchoIndex);
    console.log("v_vocIndex"+v_vocIndex);
    console.log("v_e3Index"+v_e3Index); 


    var device = {
      //e3Index: paramDeviceData.e3Index,
      e3Index: v_e3Index,
      data: [
        {
          name: "온도",
          // index: paramDeviceData.temperatureIndex,
          index: v_temperatureIndex,
          advice: "냉/난방기를 "
        },
        {
          name: "습도",
          //index: paramDeviceData.humidityIndex,
          index: v_humidityIndex,
          advice: "가습/제습 장치를 "
        },
        {
          name: "PM25",
          //index: paramDeviceData.pm25Index,
          index: v_pm25Index,
          advice: "공기청정기를 "
        },
        {
          name: "PM10",
          //index: paramDeviceData.pm10Index,
          index: v_pm10Index,
          advice: "공기청정기를 "
        },
        {
          name: "CO2",
          // index: paramDeviceData.co2Index,
          index: v_co2Index,
          advice: "환기장치를 "
        },
        {
          name: "HCHO",
          // index: paramDeviceData.hchoIndex,
          index: v_hchoIndex,
          advice: "환기장치를 "
        },
        {
          name: "VOC",
          //index: paramDeviceData.vocIndex,
          index: v_vocIndex,
          advice: "환기장치를 "
        } //,
        // {
        //   name: "noise",
        //   index: paramDeviceData.noiseIndex
        // }
      ]
    };

    //console.log("####전#### :"+device.data);

    device.data.sort(function(a, b) {
        //console.log("####배열처리전#### :"+a.name);
        //console.log("####배열처리전#### :"+a.index);
      return a.index < b.index ? 1 : a.index > b.index ? -1 : 0;
    });

    //console.log("####후#### :"+device.data);

    let adviceStr1 = "",
      adviceStr2 = "",
      adviceStr3 = "",
      adviceStr4 = "";
    let cnt = 0;

    if (device.e3Index == 1 || device.e3Index == 2) {
      if (device.e3Index == 1)
        adviceStr1 += "실내공간 공기질이 쾌적한 상태가 유지되고 있습니다.";
      else if (device.e3Index == 2)
        adviceStr1 += "실내공간 공기질이 전반적으로 쾌적한 상태입니다.";

      device.data.map(sensor => {
        //console.log("####배열처리#### :"+sensor.name);
        //console.log("####배열처리#### :"+sensor.index);
        if (sensor.index > 3) {
          adviceStr2 += sensor.name + ",";
          cnt++;
          if (cnt == 1) {
            adviceStr3 =
              sensor.name +
              " 관리를 위하여 " +
              sensor.advice +
              "작동시켜 주세요.";
          }
          if (cnt == 2) {
            adviceStr4 =
              sensor.name +
              " 관리를 위하여 " +
              sensor.advice +
              "작동시켜 주세요.";
          }
        }
      });
      let temp = adviceStr2.slice(0, -1);
      if (cnt > 0) adviceStr2 = temp + " 관리가 필요합니다.";
    } else {
      device.data.map(sensor => {
        if (sensor.index > 3) {
          adviceStr1 += sensor.name + ",";
          cnt++;
        }
      });
      adviceStr1 = adviceStr1.slice(0, -1) + "가 좋지 않습니다.";
      if (cnt > 2) adviceStr2 = "특히 ";
      adviceStr2 +=
        device.data[0].name + ", " + device.data[1].name + " 관리가 필요합니다.";
      adviceStr3 =
        device.data[0].name +
        " 관리를 위하여 " +
        device.data[0].advice +
        "작동시켜 주세요.";
      adviceStr4 =
        device.data[1].name +
        " 관리를 위하여 " +
        device.data[1].advice +
        "작동시켜 주세요.";
    }
    result.statusCode = OK;
    result.message = "성공";
    result.data = adviceStr1 + '/n' + adviceStr2 + '/n' + adviceStr3 + '/n' + adviceStr4;
    res.send(result);
  } else {
    console.log("v_temperature:"+v_temperature);
    console.log("v_humidity:"+v_humidity);
    console.log("v_pm25:"+v_pm25);
    console.log("v_pm10:"+v_pm10);
    console.log("v_co2:"+v_co2);
    console.log("v_hcho:"+v_hcho);
    console.log("v_voc:"+v_voc);
    console.log("v_date:" + v_date);
    console.log("v_temperatureIndex:"+v_temperatureIndex);
    console.log("v_humidityIndex:" + v_humidityIndex);
    console.log("v_jisuGubun:" + v_jisuGubun);
    console.log("v_deviceName:" + v_deviceName);
    report.getActComment(
      v_temperature,
      v_pm25,
      v_pm10,
      v_co2,
      v_hcho,
      v_voc,
      v_date,
      v_humidity,
      v_temperatureIndex,
      v_humidityIndex,
      v_jisuGubun,
      v_deviceName,
      function(err,actComment) {
        if (err) {
          result.statusCode = FAIL;
          result.message = "오류 발생1";
          res.send(result);
          return;
        }
        //결과 객체 있으면 성공 응답 전송
        if (actComment) {
          result.statusCode = OK;
          result.message = "성공";
          result.data = actComment 
          res.send(result);
        } else {
          result.statusCode = FAIL;
          result.message = "실패";
          res.send(result);
        }
      });
  }


 
  });


module.exports = router