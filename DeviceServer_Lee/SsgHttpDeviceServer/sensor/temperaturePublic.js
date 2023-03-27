import { TEMP_PUBLIC } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getTEMPScore = () => {
  console.log("getTEMPScore 호출됨.");

  IndexTable.getIndexTableBySensorType(TEMP_PUBLIC, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      global.sensorTable.temperaturePublic = sensorIndexInfo;
    } else {
      console.error("TEMP_PUBLIC : sensorIndexInfo 정보없음");
    }
  });
};

export const setTEMPScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);

  if (grade > 4) {
    console.log("Temperature max grade is 4");
    return;
  }

  IndexTable.updateIndexTable(TEMP_PUBLIC, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.temperaturePublic[grade - 1].min = min;
      global.sensorTable.temperaturePublic[grade - 1].max = max;
    } else {
      console.error("TEMP_PUBLIC : sensorIndexInfo 정보없음");
    }
  });
};

export const getTEMPAlarm = () => {
  console.log("getTEMPAlarm 호출됨.");

  AlarmTable.getAlarmBySensorType(TEMP_PUBLIC, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      global.alarm.temperaturePublic = sensorAlarmInfo;
    } else {
      console.error("TEMP_PUBLIC : sensorAlarmInfo 정보없음");
    }
  });
};

export const setTEMPAlarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(TEMP_PUBLIC, value, function(
    err,
    sensorAlarmInfo
  ) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.temperaturePublic = value;
    } else {
      console.error("TEMP_PUBLIC : sensorAlarmInfo 정보없음");
    }
  });
};
