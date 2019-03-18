import { VOC } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var AlarmTable = require("../models/AlarmTable");
var global = require("../global");

export const getVOCScore = () => {
  console.log("getVOCScore 호출됨.");

  IndexTable.getIndexTableBySensorType(VOC, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      global.sensorTable.voc = sensorIndexInfo;
    } else {
      console.error("VOC : sensorIndexInfo 정보없음");
    }
  });
};

export const setVOCScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
  IndexTable.updateIndexTable(VOC, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.voc[grade - 1].min = min;
      global.sensorTable.voc[grade - 1].max = max;
    } else {
      console.error("VOC : sensorIndexInfo 정보없음");
    }
  });
};

export const getVOCAlarm = () => {
  console.log("getVOCAlarm 호출됨.");

  AlarmTable.getAlarmBySensorType(VOC, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorAlarmInfo) {
      global.alarm.voc = sensorAlarmInfo;
    } else {
      console.error("VOC : sensorAlarmInfo 정보없음");
    }
  });
};

export const setVOCAlarm = value => {
  console.log("setScore 호출됨 : " + value);
  AlarmTable.updateAlarmValue(VOC, value, function(err, sensorAlarmInfo) {
    if (err) {
      console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorAlarmInfo) {
      global.alarm.voc = value;
    } else {
      console.error("VOC : sensorAlarmInfo 정보없음");
    }
  });
};
