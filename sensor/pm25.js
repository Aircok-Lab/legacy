import {
    PM25
} from "../public/javascripts/defined";

var IndexTable = require('../models/IndexTable');
var AlarmTable = require('../models/AlarmTable');
var global = require('../global');

export const getPM25Score = () => {
    console.log('getPM25Score 호출됨.');

    IndexTable.getIndexTableBySensorType(PM25, function(err, sensorIndexInfo){
        if(err){
            console.error('getIndexTableBySensorType 처리 중 오류 발생 :' + err.stack);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(sensorIndexInfo){
            console.dir(sensorIndexInfo);

            global.sensorTable.pm25 = sensorIndexInfo;
        } else {
            console.error('PM25 : sensorIndexInfo 정보없음');
        }
    })
}

export const setPM25Score = (grade, min, max) => {
    console.log('setScore 호출됨 : ' + grade + ',' + min + ',' + max);
    IndexTable.updateIndexTable(PM25, grade, min, max, function(err, sensorIndexInfo){
        if(err){
            console.error('updateIndexTable 처리 중 오류 발생 :' + err.stack);
            return;
        }

        if(sensorIndexInfo){
            console.dir(sensorIndexInfo);
            global.sensorTable.pm25[grade-1].Min = min;
            global.sensorTable.pm25[grade-1].Max = max;
            console.error('global.sensorTable.pm25[grade-1].Min: ' + global.sensorTable.pm25[grade-1].Min);
        } else {
            console.error('PM25 : sensorIndexInfo 정보없음');
        }
    });
    
}

export const getPM25Alarm = () => {
    console.log('getPM25Alarm 호출됨.');

    AlarmTable.getAlarmBySensorType(PM25, function(err, sensorAlarmInfo){
        if(err){
            console.error('getAlarmBySensorType 처리 중 오류 발생 :' + err.stack);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(sensorAlarmInfo){
            console.log(sensorAlarmInfo);

            global.alarm.pm25 = sensorAlarmInfo;
        } else {
            console.error('PM25 : sensorAlarmInfo 정보없음');
        }
    });
}

export const setPM25Alarm = (value) => {
    console.log('setScore 호출됨 : ' + value);
    IndexTable.updateAlarmTable(PM25, value, function(err, sensorAlarmInfo){
        if(err){
            console.error('updateAlarmTable 처리 중 오류 발생 :' + err.stack);
            return;
        }

        if(sensorAlarmInfo){
            global.alarm.pm25 = value;
            console.log('global.alarm.pm25: ' + global.alarm.pm25);
        } else {
            console.error('PM25 : sensorAlarmInfo 정보없음');
        }
    });
}