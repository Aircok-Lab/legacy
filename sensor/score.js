import { SCORE } from "../public/javascripts/defined";

var IndexTable = require("../models/IndexTable");
var global = require("../global");

export const getSCOREScore = () => {
  console.log("getSCOREScore 호출됨.");

  IndexTable.getIndexTableBySensorType(SCORE, function(err, sensorIndexInfo) {
    if (err) {
      console.error(
        "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
      );
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (sensorIndexInfo) {
      global.sensorTable.score = sensorIndexInfo;
    } else {
      console.error("SCORE : sensorIndexInfo 정보없음");
    }
  });
};

export const setSCOREScore = (grade, min, max) => {
  console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
  AlarmTable.updateAlarmValue(SCORE, grade, min, max, function(
    err,
    sensorIndexInfo
  ) {
    if (err) {
      console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
      return;
    }

    if (sensorIndexInfo) {
      global.sensorTable.score[grade - 1].Min = min;
      global.sensorTable.score[grade - 1].Max = max;
    } else {
      console.error("SCORE : sensorIndexInfo 정보없음");
    }
  });
};
