import { CO2 } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getCO2Score = () => {
  console.log("getCO2Score 호출됨.");

  IndexTable.getIndexTableBySensorType(CO2, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      //console.dir(sensorIndexInfo);

      global.sensorTable.co2 = sensorIndexInfo;
    } else {
      console.error("CO2 : sensorIndexInfo 정보없음");
    }
  });
};

export const setCO2Score = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
  IndexTable.updateIndexTable(CO2, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      //console.dir(sensorIndexInfo);
      global.sensorTable.co2[grade - 1].Min = min;
      global.sensorTable.co2[grade - 1].Max = max;
      console.error(
        "global.sensorTable.co2[grade-1].Min: " +
          global.sensorTable.co2[grade - 1].Min
      );
    } else {
      console.error("CO2 : sensorIndexInfo 정보없음");
    }
  });
};

export const getCO2Alarm = () => {
  console.log("getCO2Alarm 호출됨.");

  AlarmTable.getAlarmBySensorType(CO2, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      //console.log(sensorAlarmInfo);

      global.alarm.co2 = sensorAlarmInfo;
    } else {
      console.error("CO2 : sensorAlarmInfo 정보없음");
    }
  });
};

export const setCO2Alarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(CO2, value, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.co2 = value;
      console.log("global.alarm.co2: " + global.alarm.co2);
    } else {
      console.error("CO2 : sensorAlarmInfo 정보없음");
    }
  });
};
