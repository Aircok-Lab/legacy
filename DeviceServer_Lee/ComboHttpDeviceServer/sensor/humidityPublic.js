import { HUMI_PUBLIC } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getHUMIScore = () => {
  console.log("getHUMIScore 호출됨.");

  IndexTable.getIndexTableBySensorType(HUMI_PUBLIC, function(
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
      global.sensorTable.humidityPublic = sensorIndexInfo;
    } else {
      console.error("HUMI_PUBLIC : sensorIndexInfo 정보없음");
    }
  });
};

export const setHUMIScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);

  if (grade > 4) {
    console.log("Humidity max grade is 4");
    return;
  }

  IndexTable.updateIndexTable(HUMI_PUBLIC, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.humidityPublic[grade - 1].min = min;
      global.sensorTable.humidityPublic[grade - 1].max = max;
    } else {
      console.error("HUMI_PUBLIC : sensorIndexInfo 정보없음");
    }
  });
};

export const getHUMIAlarm = () => {
  console.log("getHUMIAlarm 호출됨.");

  AlarmTable.getAlarmBySensorType(HUMI_PUBLIC, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      global.alarm.humidityPublic = sensorAlarmInfo;
      // console.dir(global);
    } else {
      console.error("HUMI_PUBLIC : sensorAlarmInfo 정보없음");
    }
  });
};

export const setHUMIAlarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(HUMI_PUBLIC, value, function(
    err,
    sensorAlarmInfo
  ) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.humidityPublic = value;
      console.log(
        "global.alarm.humidityPublic: " + global.alarm.humidityPublic
      );
    } else {
      console.error("HUMI_PUBLIC : sensorAlarmInfo 정보없음");
    }
  });
};
