var Global = {
  sensorTable: {
    score: [],
    pm10: [],
    pm25: [],
    co2: [],
    hcho: [],
    voc: [],
    co: [],
    temperature: [],
    humidity: [],
    temperaturePublic: [],
    humidityPublic: [],
    noise: [],
  },
  alarm: {
    pm10: 0,
    pm25: 0,
    co2: 0,
    hcho: 0,
    voc: 0,
    co: 0,
    temperature: 0,
    humidity: 0,
    temperaturePublic: 0,
    humidityPublic: 0,
    noise: 0,
  },
  setting: {},
  smsToken: ""
};
module.exports = Global;
