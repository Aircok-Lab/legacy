import {
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
  NEW_KINDERGARTEN,
  KINDERGARTEN,
  NEW_POSTPARTUM,
  POSTPARTUM,
  NEW_OFFICE,
  OFFICE,
  NEW_HOUSE,
  HOUSE
} from "../public/javascripts/defined";
var global = require("../global");

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

    if (sensorValue == null) return result;

    score = global.sensorTable.score;
    if (sensorType === PM10) {
      data = global.sensorTable.pm10;
      alarm = global.alarm.pm10;
    } else if (sensorType === PM25) {
      data = global.sensorTable.pm25;
      alarm = global.alarm.pm25;
    } else if (sensorType === CO2) {
      data = global.sensorTable.co2;
      alarm = global.alarm.co2;
    } else if (sensorType === HCHO) {
      data = global.sensorTable.hcho;
      alarm = global.alarm.hcho;
    } else if (sensorType === VOC) {
      data = global.sensorTable.voc;
      alarm = global.alarm.voc;
    } else if (sensorType === NOISE) {
      data = global.sensorTable.noise;
      alarm = global.alarm.noise;
    } else {
      console.log("error sensor type");
    }

    if (sensorValue < data[1].Min) {
      cMax = data[0].Max;
      cMin = data[0].Min;
      sMax = score[1].Min - 0.1;
      sMin = score[0].Min;
      result.index = GOOD;
    } else if (sensorValue < data[2].Min) {
      cMax = data[1].Max;
      cMin = data[1].Min;
      sMax = score[2].Min - 0.1;
      sMin = score[1].Min;
      result.index = NORMAL;
    } else if (sensorValue < data[3].Min) {
      cMax = data[2].Max;
      cMin = data[2].Min;
      sMax = score[3].Min - 0.1;
      sMin = score[2].Min;
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (sensorValue < data[4].Min) {
      cMax = data[3].Max;
      cMin = data[3].Min;
      sMax = score[4].Min - 0.1;
      sMin = score[3].Min;
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (sensorValue < data[5].Min) {
      cMax = data[4].Max;
      cMin = data[4].Min;
      sMax = score[5].Min - 0.1;
      sMin = score[4].Min;
      result.index = VERY_UNHEALTHY;
    } else {
      cMax = data[5].Max;
      cMin = data[5].Min;
      sMax = score[5].Max;
      sMin = score[5].Min;
      result.index = HAZARDOUS;
    }

    result.score =
      ((sMax - sMin) / (cMax - cMin)) * (sensorValue - cMin) + sMin;

    if (sensorValue > alarm) result.alarm = true;

    return result;
  },
  getTempIndex: function(temp) {
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

    if (temp == null) return result;

    var data = global.sensorTable.temperature;
    var alarm = global.alarm.temperature;
    var score = global.sensorTable.score;

    if (month > 2 && month < 6) {
      cMin = data[0].Min;
      cMax = data[0].Max;
    } else if (month > 5 && month < 9) {
      cMin = data[1].Min;
      cMax = data[1].Max;
    } else if (month > 8 && month < 12) {
      cMin = data[2].Min;
      cMax = data[2].Max;
    } else {
      cMin = data[3].Min;
      cMax = data[3].Max;
    }
    cOpt = (cMin + cMax) / 2;
    result.score = 100 * (Math.abs(temp - cOpt) / (cMax - cMin)) * 2;

    if (result.score < score[1].Min) {
      result.index = GOOD;
    } else if (result.score < score[2].Min) {
      result.index = NORMAL;
    } else if (result.score < score[3].Min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (result.score < score[4].Min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (result.score < score[5].Min) {
      result.index = VERY_UNHEALTHY;
    } else {
      result.index = HAZARDOUS;
    }

    if (alarm - 2 >= temp || temp >= alarm + 2) result.alarm = true;

    return result;
  },
  getHumidityIndex: function(humidity) {
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

    if (humidity == null) return result;

    var data = global.sensorTable.humidity;
    var alarm = global.alarm.humidity;
    var score = global.sensorTable.score;

    if (month > 2 && month < 6) {
      cMin = data[0].Min;
      cMax = data[0].Max;
    } else if (month > 5 && month < 9) {
      cMin = data[1].Min;
      cMax = data[1].Max;
    } else if (month > 8 && month < 12) {
      cMin = data[2].Min;
      cMax = data[2].Max;
    } else {
      cMin = data[3].Min;
      cMax = data[3].Max;
    }

    cOpt = (cMin + cMax) / 2;
    result.score = 100 * (Math.abs(humidity - cOpt) / (cMax - cMin)) * 2;

    if (result.score < score[1].Min) {
      result.index = GOOD;
    } else if (result.score < score[2].Min) {
      result.index = NORMAL;
    } else if (result.score < score[3].Min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (result.score < score[4].Min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (result.score < score[5].Min) {
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
    humi
  ) {
    var d = new Date();
    var month = d.getMonth() + 1;
    var score = global.sensorTable.score;
    var result = {
      index: 0,
      score: 0
    };

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
    result.score = Math.floor(result.score);

    if (result.score < score[1].Min) {
      result.index = GOOD;
    } else if (result.score < score[2].Min) {
      result.index = NORMAL;
    } else if (result.score < score[3].Min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP1;
    } else if (result.score < score[4].Min) {
      result.index = UNHEALTHY_FOR_SENSITIVE_GROUP2;
    } else if (result.score < score[5].Min) {
      result.index = VERY_UNHEALTHY;
    } else {
      result.index = HAZARDOUS;
    }

    return result;
  }
};

module.exports = E3Core;
