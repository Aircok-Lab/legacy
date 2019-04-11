// import { CO } from "../public/javascripts/defined";

// var IndexTable = require("../models/IndexTable");
// var AlarmTable = require("../models/AlarmTable");
// var global = require("../global");

// export const getCOScore = () => {
//   console.log("getCOScore 호출됨.");

//   IndexTable.getIndexTableBySensorType(CO, function(err, sensorIndexInfo) {
//     if (err) {
//       console.error(
//         "getIndexTableBySensorType 처리 중 오류 발생 :" + err.stack
//       );
//       return;
//     }

//     //결과 객체 있으면 성공 응답 전송
//     if (sensorIndexInfo) {
//       global.sensorTable.co = sensorIndexInfo;
//     } else {
//       console.error("CO : sensorIndexInfo 정보없음");
//     }
//   });
// };

// export const setCOScore = (grade, min, max) => {
//   console.log("setScore 호출됨 : " + grade + "," + min + "," + max);
//   IndexTable.updateIndexTable(CO, grade, min, max, function(
//     err,
//     sensorIndexInfo
//   ) {
//     if (err) {
//       console.error("updateIndexTable 처리 중 오류 발생 :" + err.stack);
//       return;
//     }

//     if (sensorIndexInfo) {
//       global.sensorTable.co[grade - 1].min = min;
//       global.sensorTable.co[grade - 1].max = max;
//     } else {
//       console.error("CO : sensorIndexInfo 정보없음");
//     }
//   });
// };

// export const getCOAlarm = () => {
//   console.log("getCOAlarm 호출됨.");

//   AlarmTable.getAlarmBySensorType(CO, function(err, sensorAlarmInfo) {
//     if (err) {
//       console.error("getAlarmBySensorType 처리 중 오류 발생 :" + err.stack);
//       return;
//     }

//     //결과 객체 있으면 성공 응답 전송
//     if (sensorAlarmInfo) {
//       global.alarm.co = sensorAlarmInfo;
//     } else {
//       console.error("CO : sensorAlarmInfo 정보없음");
//     }
//   });
// };

// export const setCOAlarm = value => {
//   console.log("setScore 호출됨 : " + value);
//   AlarmTable.updateAlarmValue(CO, value, function(err, sensorAlarmInfo) {
//     if (err) {
//       console.error("updateAlarmTable 처리 중 오류 발생 :" + err.stack);
//       return;
//     }

//     if (sensorAlarmInfo) {
//       global.alarm.co = value;
//     } else {
//       console.error("CO : sensorAlarmInfo 정보없음");
//     }
//   });
// };

var _0x2550 = [
  "getIndexTableBySensorType",
  "error",
  "getIndexTableBySensorType\x20처리\x20중\x20오류\x20발생\x20:",
  "stack",
  "sensorTable",
  "log",
  "setScore\x20호출됨\x20:\x20",
  "updateIndexTable",
  "updateIndexTable\x20처리\x20중\x20오류\x20발생\x20:",
  "min",
  "max",
  "CO\x20:\x20sensorIndexInfo\x20정보없음",
  "getAlarmBySensorType",
  "getAlarmBySensorType\x20처리\x20중\x20오류\x20발생\x20:",
  "alarm",
  "CO\x20:\x20sensorAlarmInfo\x20정보없음",
  "updateAlarmValue",
  "updateAlarmTable\x20처리\x20중\x20오류\x20발생\x20:",
  "../models/IndexTable",
  "../models/AlarmTable",
  "../global",
  "getCOScore\x20호출됨."
];
(function(_0x2db105, _0x3bfe9f) {
  var _0x4ac8ed = function(_0x338faa) {
    while (--_0x338faa) {
      _0x2db105["push"](_0x2db105["shift"]());
    }
  };
  _0x4ac8ed(++_0x3bfe9f);
})(_0x2550, 0x1e0);
var _0x6f75 = function(_0x236ad5, _0x36380e) {
  _0x236ad5 = _0x236ad5 - 0x0;
  var _0x28c70c = _0x2550[_0x236ad5];
  return _0x28c70c;
};
import { CO } from "../public/javascripts/defined";
var IndexTable = require(_0x6f75("0x0"));
var AlarmTable = require(_0x6f75("0x1"));
var global = require(_0x6f75("0x2"));
export const getCOScore = () => {
  console["log"](_0x6f75("0x3"));
  IndexTable[_0x6f75("0x4")](CO, function(_0x5193fd, _0x3b78f5) {
    if (_0x5193fd) {
      console[_0x6f75("0x5")](_0x6f75("0x6") + _0x5193fd[_0x6f75("0x7")]);
      return;
    }
    if (_0x3b78f5) {
      global[_0x6f75("0x8")]["co"] = _0x3b78f5;
    } else {
      console[_0x6f75("0x5")]("CO\x20:\x20sensorIndexInfo\x20정보없음");
    }
  });
};
export const setCOScore = (_0x39b8f8, _0x3a2f12, _0x1c171e) => {
  console[_0x6f75("0x9")](
    _0x6f75("0xa") + _0x39b8f8 + "," + _0x3a2f12 + "," + _0x1c171e
  );
  IndexTable[_0x6f75("0xb")](CO, _0x39b8f8, _0x3a2f12, _0x1c171e, function(
    _0x27ae2d,
    _0x30170c
  ) {
    if (_0x27ae2d) {
      console[_0x6f75("0x5")](_0x6f75("0xc") + _0x27ae2d[_0x6f75("0x7")]);
      return;
    }
    if (_0x30170c) {
      global[_0x6f75("0x8")]["co"][_0x39b8f8 - 0x1][_0x6f75("0xd")] = _0x3a2f12;
      global["sensorTable"]["co"][_0x39b8f8 - 0x1][_0x6f75("0xe")] = _0x1c171e;
    } else {
      console[_0x6f75("0x5")](_0x6f75("0xf"));
    }
  });
};
export const getCOAlarm = () => {
  console[_0x6f75("0x9")]("getCOAlarm\x20호출됨.");
  AlarmTable[_0x6f75("0x10")](CO, function(_0x56ce77, _0x5e739b) {
    if (_0x56ce77) {
      console[_0x6f75("0x5")](_0x6f75("0x11") + _0x56ce77[_0x6f75("0x7")]);
      return;
    }
    if (_0x5e739b) {
      global[_0x6f75("0x12")]["co"] = _0x5e739b;
    } else {
      console[_0x6f75("0x5")](_0x6f75("0x13"));
    }
  });
};
export const setCOAlarm = _0x41d7a6 => {
  console[_0x6f75("0x9")]("setScore\x20호출됨\x20:\x20" + _0x41d7a6);
  AlarmTable[_0x6f75("0x14")](CO, _0x41d7a6, function(_0x1247d6, _0x3b3f42) {
    if (_0x1247d6) {
      console[_0x6f75("0x5")](_0x6f75("0x15") + _0x1247d6[_0x6f75("0x7")]);
      return;
    }
    if (_0x3b3f42) {
      global[_0x6f75("0x12")]["co"] = _0x41d7a6;
    } else {
      console[_0x6f75("0x5")](_0x6f75("0x13"));
    }
  });
};
