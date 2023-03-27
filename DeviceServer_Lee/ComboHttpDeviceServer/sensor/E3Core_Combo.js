/* import {
  GOOD,
  NORMAL,
  UNHEALTHY_FOR_SENSITIVE_GROUP1,
  UNHEALTHY_FOR_SENSITIVE_GROUP2,
  VERY_UNHEALTHY,
  HAZARDOUS,
  PM10,
  PM25,
  CO2,
  HCHO,
  VOC,
  NOISE,
  CO,
  NEW_KINDERGARTEN,
  KINDERGARTEN,
  NEW_POSTPARTUM,
  POSTPARTUM,
  NEW_OFFICE,
  OFFICE,
  NEW_HOUSE,
  HOUSE
} from "../public/javascripts/defined";
var global = require("../global"); */

const GOOD = 1;
const NORMAL = 2;
const UNHEALTHY_FOR_SENSITIVE_GROUP1 = 3;
const UNHEALTHY_FOR_SENSITIVE_GROUP2 = 4;
const VERY_UNHEALTHY = 5;
const HAZARDOUS = 6;
const PM10 = "pm10";
const PM25 = "pm25";
const CO2 = "co2";
const HCHO = "hcho";
const VOC = "voc";
const NOISE = "noise";
const CO = "co";
const NEW_KINDERGARTEN = "NewKindergarten";
const KINDERGARTEN = "Kindergarten";
const NEW_POSTPARTUM = "NewPostpartum";
const POSTPARTUM = "Postpartum";
const NEW_OFFICE = "NewOffice";
const OFFICE = "Office";
const NEW_HOUSE = "NewHouse";
const HOUSE = "House";

var Global_combo = {
  sensorTable: {
    score: [{ id: 1, sensorType: 'score', grade: 1, min: 0, max: 20 },
    { id: 2, sensorType: 'score', grade: 2, min: 21, max: 40 },
    { id: 3, sensorType: 'score', grade: 3, min: 41, max: 55 },
    { id: 4, sensorType: 'score', grade: 4, min: 56, max: 65 },
    { id: 5, sensorType: 'score', grade: 5, min: 66, max: 85 },
    { id: 6, sensorType: 'score', grade: 6, min: 86, max: 100 },
    { id: 70, sensorType: 'score', grade: 1, min: 0, max: 20 },
    { id: 71, sensorType: 'score', grade: 1, min: 0, max: 20 },
    { id: 72, sensorType: 'score', grade: 1, min: 0, max: 20 },
    { id: 73, sensorType: 'score', grade: 1, min: 0, max: 20 } ],
    pm10: [{ id: 7, sensorType: 'pm10', grade: 1, min: 0, max: 29 },
    { id: 8, sensorType: 'pm10', grade: 2, min: 30, max: 50 },
    { id: 9, sensorType: 'pm10', grade: 3, min: 51, max: 79 },
    { id: 10, sensorType: 'pm10', grade: 4, min: 80, max: 100 },
    { id: 11, sensorType: 'pm10', grade: 5, min: 101, max: 239 },
    { id: 12, sensorType: 'pm10', grade: 6, min: 240, max: 500 }],
    pm25: [ { id: 13, sensorType: 'pm25', grade: 1, min: 0, max: 15 },
    { id: 14, sensorType: 'pm25', grade: 2, min: 16, max: 30 },
    { id: 15, sensorType: 'pm25', grade: 3, min: 31, max: 40 },
    { id: 16, sensorType: 'pm25', grade: 4, min: 41, max: 70 },
    { id: 17, sensorType: 'pm25', grade: 5, min: 71, max: 149 },
    { id: 18, sensorType: 'pm25', grade: 6, min: 150, max: 300 }],
    co2: [{ id: 19, sensorType: 'co2', grade: 1, min: 0, max: 250 },
    { id: 20, sensorType: 'co2', grade: 2, min: 251, max: 699 },
    { id: 21, sensorType: 'co2', grade: 3, min: 700, max: 850 },
    { id: 22, sensorType: 'co2', grade: 4, min: 851, max: 1000 },
    { id: 23, sensorType: 'co2', grade: 5, min: 1001, max: 2000 },
    { id: 24, sensorType: 'co2', grade: 6, min: 2001, max: 5000 }],
    hcho: [{ id: 25, sensorType: 'hcho', grade: 1, min: 0, max: 30 },
    { id: 26, sensorType: 'hcho', grade: 2, min: 31, max: 45 },
    { id: 27, sensorType: 'hcho', grade: 3, min: 46, max: 60 },
    { id: 28, sensorType: 'hcho', grade: 4, min: 61, max: 100 },
    { id: 29, sensorType: 'hcho', grade: 5, min: 101, max: 400 },
    { id: 30, sensorType: 'hcho', grade: 6, min: 401, max: 3000 } ],
    voc: [ { id: 31, sensorType: 'voc', grade: 1, min: 0, max: 200 },
    { id: 32, sensorType: 'voc', grade: 2, min: 201, max: 350 },
    { id: 33, sensorType: 'voc', grade: 3, min: 351, max: 400 },
    { id: 34, sensorType: 'voc', grade: 4, min: 401, max: 500 },
    { id: 35, sensorType: 'voc', grade: 5, min: 501, max: 1000 },
    { id: 36, sensorType: 'voc', grade: 6, min: 1001, max: 10000 } ],
    temperature: [{ id: 37, sensorType: 'temperature', grade: 1, min: 13, max: 30 },
    { id: 38, sensorType: 'temperature', grade: 2, min: 16, max: 32 },
    { id: 39, sensorType: 'temperature', grade: 3, min: 13, max: 30 },
    { id: 40, sensorType: 'temperature', grade: 4, min: 12, max: 28 }],
    humidity: [ { id: 41, sensorType: 'humidity', grade: 1, min: 20, max: 70 },
    { id: 42, sensorType: 'humidity', grade: 2, min: 25, max: 75 },
    { id: 43, sensorType: 'humidity', grade: 3, min: 20, max: 70 },
    { id: 44, sensorType: 'humidity', grade: 4, min: 15, max: 65 } ],
    temperaturePublic: [{ id: 55, sensorType: 'temperaturePublic', grade: 1, min: 12, max: 28 },
    { id: 56, sensorType: 'temperaturePublic', grade: 2, min: 18,max: 34 },
    { id: 57, sensorType: 'temperaturePublic', grade: 3, min: 12,max: 28 },
    { id: 58, sensorType: 'temperaturePublic', grade: 4, min: 12,max: 32 }],
    humidityPublic: [ { id: 59,sensorType: 'humidityPublic', grade: 1, min: 15, max: 55 },
    { id: 60, sensorType: 'humidityPublic',    grade: 2, min: 20, max: 60 },
    { id: 61, sensorType: 'humidityPublic',    grade: 3, min: 15, max: 55 },
    { id: 62, sensorType: 'humidityPublic',    grade: 4, min: 10, max: 50 } ],
    noise: [{ id: 48, sensorType: 'noise', grade: 1, min: 32, max: 37 },
    { id: 49, sensorType: 'noise', grade: 2, min: 38, max: 43 },
    { id: 50, sensorType: 'noise', grade: 3, min: 44, max: 49 },
    { id: 51, sensorType: 'noise', grade: 4, min: 50, max: 55 },
    { id: 52, sensorType: 'noise', grade: 5, min: 56, max: 61 },
    { id: 53, sensorType: 'noise', grade: 6, min: 62, max: 80 } ],
    co: [{ id: 63, sensorType: 'co', grade: 1, min: 0, max: 2 },
    { id: 64, sensorType: 'co', grade: 2, min: 3, max: 4 },
    { id: 65, sensorType: 'co', grade: 3, min: 5, max: 6 },
    { id: 66, sensorType: 'co', grade: 4, min: 7, max: 8 },
    { id: 67, sensorType: 'co', grade: 5, min: 9, max: 10 },
    { id: 68, sensorType: 'co', grade: 6, min: 11, max: 12 } ]
  },
  alarm: {
    pm10: 150,
    pm25: 70,
    co2: 1000,
    hcho: 100,
    voc: 500,
    temperature: 18,
    humidity: 50,
    temperaturePublic: 24,
    humidityPublic: 33,
    noise: 55,
    co: 9
  },
  setting: {},
  filename: "eco_data.txt"
};

var E3Core = {
  getSensorIndex: function(sensorType, sensorValue) {
    var cMax = 0,
      cMin = 0,
      sMax = 0,
      sMin = 0,
      score = 0;
    var data = 0,
      alarm = 0;
    var result = {
      index: 0,
      alarm: false,
      score: 0,
      value: sensorValue
    };

    if (sensorValue === null) return result;

    score = Global_combo.sensorTable.score;
    if (sensorType === PM10) {
      data = Global_combo.sensorTable.pm10;
      alarm = Global_combo.alarm.pm10;
    } else if (sensorType === PM25) {
      data = Global_combo.sensorTable.pm25;
      alarm = Global_combo.alarm.pm25;
    } else if (sensorType === CO2) {
      data = Global_combo.sensorTable.co2;
      alarm = Global_combo.alarm.co2;
    } else if (sensorType === HCHO) {
      data = Global_combo.sensorTable.hcho;
      alarm = Global_combo.alarm.hcho;
    } else if (sensorType === VOC) {
      data = Global_combo.sensorTable.voc;
      alarm = Global_combo.alarm.voc;
    } else if (sensorType === NOISE) {
      data = Global_combo.sensorTable.noise;
      alarm = Global_combo.alarm.noise;
    } else if (sensorType === CO) {
      data = Global_combo.sensorTable.co;
      alarm = Global_combo.alarm.co;
    } else {
      console.log("error sensor type");
    }

    if (sensorValue < data[1].min) {
      cMax = data[0].max;
      cMin = data[0].min;
      sMax = score[1].min - 0.1;
      sMin = score[0].min;
      result.index = GOOD;
    } else if (sensorValue < data[2].min) {
      cMax = data[1].max;
      cMin = data[1].min;
      sMax = score[2].min - 0.1;
      sMin = score[1].min;
      result.index = NORMAL;
    } else if (sensorValue < data[3].min) {
      cMax = data[2].max;
      cMin = data[2].min;
      sMax = score[3].min - 0.1;
      sMin = score[2].min;
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (sensorValue < data[4].min) {
      cMax = data[3].max;
      cMin = data[3].min;
      sMax = score[4].min - 0.1;
      sMin = score[3].min;
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (sensorValue < data[5].min) {
      cMax = data[4].max;
      cMin = data[4].min;
      sMax = score[5].min - 0.1;
      sMin = score[4].min;
      result.index = VERY_UNHEALTHY;
    } else {
      cMax = data[5].max;
      cMin = data[5].min;
      sMax = score[5].max;
      sMin = score[5].min;
      result.index = HAZARDOUS;
    }

    result.score =
      ((sMax - sMin) / (cMax - cMin)) * (sensorValue - cMin) + sMin;

    result.score = Math.floor(result.score);

    if (sensorValue > alarm) result.alarm = true;

    return result;
  },
  getTempIndex: function(isPublicBuilding, temp) {
    var d = new Date();
    var month = d.getMonth() + 1;
    var cMax = 0,
      cMin = 0,
      cOpt = 0;
    var result = {
      index: 0,
      alarm: false,
      score: 0,
      value: temp
    };
    var data = 0,
      alarm = 0,
      score = 0;

    if (temp == null) return result;

    if (isPublicBuilding) {
      data = Global_combo.sensorTable.temperaturePublic;
      alarm = Global_combo.alarm.temperaturePublic;
      score = Global_combo.sensorTable.score;
    } else {
      data = Global_combo.sensorTable.temperature;
      alarm = Global_combo.alarm.temperature;
      score = Global_combo.sensorTable.score;
    }

    if (month > 2 && month < 6) {
      cMin = data[0].min;
      cMax = data[0].max;
    } else if (month > 5 && month < 9) {
      cMin = data[1].min;
      cMax = data[1].max;
    } else if (month > 8 && month < 12) {
      cMin = data[2].min;
      cMax = data[2].max;
    } else {
      cMin = data[3].min;
      cMax = data[3].max;
    }
    cOpt = (cMin + cMax) / 2;
    result.score = 100 * (Math.abs(temp - cOpt) / (cMax - cMin)) * 2;
    result.score = Math.floor(result.score);

    if (result.score < score[1].min) {
      result.index = GOOD;
    } else if (result.score < score[2].min) {
      result.index = NORMAL;
    } else if (result.score < score[3].min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (result.score < score[4].min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (result.score < score[5].min) {
      result.index = VERY_UNHEALTHY;
    } else {
      result.index = HAZARDOUS;
    }

    if (alarm - 2 >= temp || temp >= alarm + 2) result.alarm = true;

    return result;
  },
  getHumidityIndex: function(isPublicBuilding, humidity) {
    var d = new Date();
    var month = d.getMonth() + 1;
    var cMax = 0,
      cMin = 0,
      cOpt = 0;
    var result = {
      index: 0,
      alarm: false,
      score: 0,
      value: humidity
    };
    var data = 0,
      alarm = 0,
      score = 0;

    if (humidity == null) return result;

    if (isPublicBuilding) {
      data = Global_combo.sensorTable.humidityPublic;
      alarm = Global_combo.alarm.humidityPublic;
      score = Global_combo.sensorTable.score;
    } else {
      data = Global_combo.sensorTable.humidity;
      alarm = Global_combo.alarm.humidity;
      score = Global_combo.sensorTable.score;
    }

    if (month > 2 && month < 6) {
      cMin = data[0].min;
      cMax = data[0].max;
    } else if (month > 5 && month < 9) {
      cMin = data[1].min;
      cMax = data[1].max;
    } else if (month > 8 && month < 12) {
      cMin = data[2].min;
      cMax = data[2].max;
    } else {
      cMin = data[3].min;
      cMax = data[3].max;
    }

    cOpt = (cMin + cMax) / 2;
    result.score = Math.floor(result.score);

    if (result.score < score[1].min) {
      result.index = GOOD;
    } else if (result.score < score[2].min) {
      result.index = NORMAL;
    } else if (result.score < score[3].min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (result.score < score[4].min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (result.score < score[5].min) {
      result.index = VERY_UNHEALTHY;
    } else {
      result.index = HAZARDOUS;
    }

    if (alarm - 10 >= humidity || humidity >= alarm + 10) result.alarm = true;

    return result;
  },
  calTotalIndex: function(
    buildingType,
    pm10,
    pm25,
    co2,
    hcho,
    voc,
    temp,
    humi,
    noise,
    co
  ) {
    var d = new Date();
    var month = d.getMonth() + 1;
    var score = Global_combo.sensorTable.score;
    var result = {
      index: 0,
      score: 0
    };
    console.log("buildingType : " + buildingType);
    console.log(
      "pm10 : " +
        pm10 +
        " pm25 : " +
        pm25 +
        " co2 : " +
        co2 +
        " hcho : " +
        hcho +
        " voc : " +
        voc +
        " temp : " +
        temp +
        " humi : " +
        humi
    );
    switch (buildingType) {
      case NEW_KINDERGARTEN:
        result.score =
          0.1 * pm10 +
          0.1 * pm25 +
          0.3 * voc +
          0.2 * hcho +
          0.1 * co2 +
          (0.1 * temp + 0.1 * humi);
        break;
      case KINDERGARTEN:
        result.score =
          0.2 * pm10 +
          0.3 * pm25 +
          0.1 * voc +
          0.1 * hcho +
          0.1 * co2 +
          (0.1 * temp + 0.1 * humi);
        break;
      case NEW_POSTPARTUM:
        result.score =
          0.1 * pm10 +
          0.1 * pm25 +
          0.3 * voc +
          0.1 * hcho +
          (0.2 * co2 + 0.1 * temp + 0.1 * humi);
        break;
      case POSTPARTUM:
        result.score =
          0.15 * pm10 +
          0.25 * pm25 +
          0.1 * voc +
          0.1 * hcho +
          (0.2 * co2 + 0.1 * temp + 0.1 * humi);
        break;
      case NEW_OFFICE:
        if (month > 2 && month < 6) {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.1 * voc +
            0.1 * hcho +
            (0.4 * co2 + 0.1 * temp + 0.1 * humi);
        } else if (month > 5 && month < 9) {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.05 * voc +
            0.05 * hcho +
            (0.4 * co2 + 0.15 * temp + 0.15 * humi);
        } else if (month > 8 && month < 12) {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.1 * voc +
            0.1 * hcho +
            (0.4 * co2 + 0.1 * temp + 0.1 * humi);
        } else {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.05 * voc +
            0.05 * hcho +
            (0.4 * co2 + 0.15 * temp + 0.15 * humi);
        }
        break;
      case OFFICE:
        if (month > 2 && month < 6) {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.15 * voc +
            0.15 * hcho +
            (0.4 * co2 + 0.05 * temp + 0.05 * humi);
        } else if (month > 5 && month < 9) {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.1 * voc +
            0.1 * hcho +
            (0.4 * co2 + 0.1 * temp + 0.1 * humi);
        } else if (month > 8 && month < 12) {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.15 * voc +
            0.15 * hcho +
            (0.4 * co2 + 0.05 * temp + 0.05 * humi);
        } else {
          result.score =
            0.1 * pm10 +
            0.1 * pm25 +
            0.1 * voc +
            0.1 * hcho +
            (0.4 * co2 + 0.1 * temp + 0.1 * humi);
        }
        break;
      case NEW_HOUSE:
        result.score =
          0.1 * pm10 +
          0.3 * pm25 +
          0.2 * voc +
          0.1 * hcho +
          (0.1 * co2 + 0.1 * temp + 0.1 * humi);
        break;
      case HOUSE:
        result.score =
          0.1 * pm10 +
          0.3 * pm25 +
          0.2 * voc +
          0.1 * hcho +
          (0.1 * co2 + 0.1 * temp + 0.1 * humi);
        break;
      default:
        result.score = 0;
        break;
    }
    console.log("score : " + result.score);
    result.score = Math.floor(result.score);
    console.log("score : " + result.score);

    if (result.score < score[1].min) {
      result.index = GOOD;
    } else if (result.score < score[2].min) {
      result.index = NORMAL;
    } else if (result.score < score[3].min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (result.score < score[4].min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (result.score < score[5].min) {
      result.index = VERY_UNHEALTHY;
    } else {
      result.index = HAZARDOUS;
    }
    console.log("index : " + result.index);
    return result;
  }
};

module.exports = E3Core;
