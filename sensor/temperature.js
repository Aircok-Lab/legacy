import { TEMP } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getTEMPScore = () => {
  console.log("getTEMPScore 호출됨.");

  IndexTable.getIndexTableBySensorType(TEMP, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      //console.dir(sensorIndexInfo);

      global.sensorTable.temperature = sensorIndexInfo;
    } else {
      console.error("TEMP : sensorIndexInfo 정보없음");
    }
  });
};

export const setTEMPScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);

  if (grade > 4) {
    console.log("Temperature max grade is 4");
    return;
  }

  IndexTable.updateIndexTable(TEMP, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      //console.dir(sensorIndexInfo);
      global.sensorTable.temperature[grade - 1].Min = min;
      global.sensorTable.temperature[grade - 1].Max = max;
      console.error(
        "global.sensorTable.temperature[grade-1].Min: " +
          global.sensorTable.temperature[grade - 1].Min
      );
    } else {
      console.error("TEMP : sensorIndexInfo 정보없음");
    }
  });
};

export const getTEMPAlarm = () => {
  console.log("getTEMPAlarm 호출됨.");

  AlarmTable.getAlarmBySensorType(TEMP, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      //console.log(sensorAlarmInfo);

      global.alarm.temperature = sensorAlarmInfo;
    } else {
      console.error("TEMP : sensorAlarmInfo 정보없음");
    }
  });
};

export const setTEMPAlarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(TEMP, value, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.temperature = value;
      console.log("global.alarm.temperature: " + global.alarm.temperature);
    } else {
      console.error("TEMP : sensorAlarmInfo 정보없음");
    }
  });
};
