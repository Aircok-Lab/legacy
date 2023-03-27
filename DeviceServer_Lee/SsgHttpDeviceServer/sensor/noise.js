import { NOISE } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getNOISEScore = () => {
  console.log("getNOISEScore 호출됨.");

  IndexTable.getIndexTableBySensorType(NOISE, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      global.sensorTable.noise = sensorIndexInfo;
    } else {
      console.error("NOISE : sensorIndexInfo 정보없음");
    }
  });
};

export const setNOISEScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
  IndexTable.updateIndexTable(NOISE, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.noise[grade - 1].min = min;
      global.sensorTable.noise[grade - 1].max = max;
    } else {
      console.error("NOISE : sensorIndexInfo 정보없음");
    }
  });
};

export const getNOISEAlarm = () => {
  console.log("getNOISEAlarm 호출됨.");

  AlarmTable.getAlarmBySensorType(NOISE, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      global.alarm.noise = sensorAlarmInfo;
    } else {
      console.error("NOISE : sensorAlarmInfo 정보없음");
    }
  });
};

export const setNOISEAlarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(NOISE, value, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.noise = value;
    } else {
      console.error("noise : sensorAlarmInfo 정보없음");
    }
  });
};
