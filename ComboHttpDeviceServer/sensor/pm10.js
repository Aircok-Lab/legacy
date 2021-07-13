import { PM10 } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getPM10Score = () => {
  console.log("getPM10Score 호출됨.");

  IndexTable.getIndexTableBySensorType(PM10, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      global.sensorTable.pm10 = sensorIndexInfo;
    } else {
      console.error("PM10 : sensorIndexInfo 정보없음");
    }
  });
};

export const setPM10Score = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
  IndexTable.updateIndexTable(PM10, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.pm10[grade - 1].min = min;
      global.sensorTable.pm10[grade - 1].max = max;
    } else {
      console.error("PM10 : sensorIndexInfo 정보없음");
    }
  });
};

export const getPM10Alarm = () => {
  console.log("getPM10Alarm 호출됨.");

  AlarmTable.getAlarmBySensorType(PM10, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      global.alarm.pm10 = sensorAlarmInfo;
    } else {
      console.error("PM10 : sensorAlarmInfo 정보없음");
    }
  });
};

export const setPM10Alarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(PM10, value, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.pm10 = value;
    } else {
      console.error("PM10 : sensorAlarmInfo 정보없음");
    }
  });
};
