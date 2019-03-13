import {
    HUMI
} from "../public/javascripts/defined";

var IndexTable = require('../models/IndexTable');
var AlarmTable = require('../models/AlarmTable');
var global = require('../global');

export const getHUMIScore = () => {
    console.log('getHUMIScore 호출됨.');

    IndexTable.getIndexTableBySensorType(HUMI, function(err, sensorIndexInfo){
        if(err){
            console.error('getIndexTableBySensorType 처리 중 오류 발생 :' + err.stack);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(sensorIndexInfo){
            //console.dir(sensorIndexInfo);

            global.sensorTable.humidity = sensorIndexInfo;
        } else {
            console.error('HUMI : sensorIndexInfo 정보없음');
        }
    });
}

export const setHUMIScore = (grade, min, max) => {
    console.log('setScore 호출됨 : ' + grade + ',' + min + ',' + max);

    if(grade > 4){
        console.log("Humidity max grade is 4");
        return;
    }
        
    IndexTable.updateIndexTable(HUMI, grade, min, max, function(err, sensorIndexInfo){
        if(err){
            console.error('updateIndexTable 처리 중 오류 발생 :' + err.stack);
            return;
        }

        if(sensorIndexInfo){
            //console.dir(sensorIndexInfo);
            global.sensorTable.humidity[grade-1].Min = min;
            global.sensorTable.humidity[grade-1].Max = max;
            console.error('global.sensorTable.humidity[grade-1].Min: ' + global.sensorTable.humidity[grade-1].Min);
        } else {
            console.error('HUMI : sensorIndexInfo 정보없음');
        }
    });
}

export const getHUMIAlarm = () => {
    console.log('getHUMIAlarm 호출됨.');

    AlarmTable.getAlarmBySensorType(HUMI, function(err, sensorAlarmInfo){
        if(err){
            console.error('getAlarmBySensorType 처리 중 오류 발생 :' + err.stack);
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(sensorAlarmInfo){
            //console.log(sensorAlarmInfo);

            global.alarm.humidity = sensorAlarmInfo;
            console.dir(global);
        } else {
            console.error('HUMI : sensorAlarmInfo 정보없음');
        }
    });
}

export const setHUMIAlarm = (value) => {
    console.log('setScore 호출됨 : ' + value);
    AlarmTable.updateAlarmValue(HUMI, value, function(err, sensorAlarmInfo){
        if(err){
            console.error('updateAlarmTable 처리 중 오류 발생 :' + err.stack);
            return;
        }

        if(sensorAlarmInfo){
            global.alarm.humidity = value;
            console.log('global.alarm.humidity: ' + global.alarm.humidity);
        } else {
            console.error('HUMI : sensorAlarmInfo 정보없음');
        }
    });
}