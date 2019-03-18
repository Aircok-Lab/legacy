import { HCHO } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getHCHOScore = () => {
  console.log("getHCHOScore 호출됨.");

  IndexTable.getIndexTableBySensorType(HCHO, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      global.sensorTable.hcho = sensorIndexInfo;
    } else {
      console.error("HCHO : sensorIndexInfo 정보없음");
    }
  });
};

export const setHCHOScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
  IndexTable.updateIndexTable(HCHO, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.hcho[grade - 1].min = min;
      global.sensorTable.hcho[grade - 1].max = max;
    } else {
      console.error("HCHO : sensorIndexInfo 정보없음");
    }
  });
};

export const getHCHOAlarm = () => {
  console.log("getHCHOAlarm 호출됨.");

  AlarmTable.getAlarmBySensorType(HCHO, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      global.alarm.hcho = sensorAlarmInfo;
    } else {
      console.error("HCHO : sensorAlarmInfo 정보없음");
    }
  });
};

export const setHCHOAlarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(HCHO, value, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.hcho = value;
    } else {
      console.error("HCHO : sensorAlarmInfo 정보없음");
    }
  });
};
