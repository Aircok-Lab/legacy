import { CO } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getCOScore = () => {
  console.log("getCOScore 호출됨.");

  IndexTable.getIndexTableBySensorType(CO, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      global.sensorTable.co = sensorIndexInfo;
    } else {
      console.error("CO : sensorIndexInfo 정보없음");
    }
  });
};

export const setCOScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
  IndexTable.updateIndexTable(CO, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.co[grade - 1].min = min;
      global.sensorTable.co[grade - 1].max = max;
    } else {
      console.error("CO : sensorIndexInfo 정보없음");
    }
  });
};

export const getCOAlarm = () => {
  console.log("getCOAlarm 호출됨.");

  AlarmTable.getAlarmBySensorType(CO, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      global.alarm.co = sensorAlarmInfo;
    } else {
      console.error("CO : sensorAlarmInfo 정보없음");
    }
  });
};

export const setCOAlarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(CO, value, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.co = value;
    } else {
      console.error("CO : sensorAlarmInfo 정보없음");
    }
  });
};
