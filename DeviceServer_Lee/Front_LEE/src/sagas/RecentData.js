import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  ALL_TIME_RECENT_DATA_REQUEST,
  ALL_TIME_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  TIME_MONITORING_RECENT_DATA_REQUEST,
  TIME_MONITORING_RECENT_DATA_SUCCESS,
  OUTDOOR_DUST_DATA_REQUEST,
  OUTDOOR_DUST_DATA_SUCCESS,
  OUTDOOR_WEATHER_DATA_REQUEST,
  OUTDOOR_WEATHER_DATA_SUCCESS,
  CHART_DATA_REQUEST,
  CHART_DATA_SUCCESS,
  TIME_MONITORING_RECENT_DATA_SUCCESS1,
  TIME_MONITORING_RECENT_DATA_REQUEST1,
  RECENT_DATA_FAIL,
  SYSTEM_LIST_SUCCESS
} from "constants/ActionTypes";
import responseDataProcess from "util/responseDataProcess";
import {
  allRecentDataSuccess,
  allTimeRecentDataSuccess,
  monitoringRecentDataSuccess,
  timeMonitoringRecentDataSuccess,
  outdoorDustDataSuccess,
  outdoorWeatherDataSuccess,
  chartDataSuccess,
  getTotalCommentSuccess
} from "actions/RecentData";
import { hideAuthLoader } from "actions/Auth";
import moment from "moment-timezone";
import api from "api";
import _ from "lodash";
import { GET_TOTAL_COMMENT } from "../constants/ActionTypes";

proj4.defs(
  "EPSG:5181",
  "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
);
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

// 위경도를 기상청 grid x,y 로 변경 - http://werty.co.kr/blog/3011
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
function dfsXyConv(code, v1, v2) {
  // LCC DFS 좌표변환을 위한 기초 자료
  //
  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)

  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["nx"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["ny"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs["nx"] = v1;
    rs["ny"] = v2;
    var xn = v1 - XO;
    var yn = ro - v2 + YO;
    ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) -ra;
    var alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) -theta;
      } else theta = Math.atan2(xn, yn);
    }
    var alon = theta / sn + olon;
    rs["lat"] = alat * RADDEG;
    rs["lng"] = alon * RADDEG;
  }
  return rs;
}

const getAllRecentDataRequest = async positionList =>
  await api
    .post("recentData/getRecentDataByPositionId", {
      positionID: positionList,
    })
    .then(allRecentData => allRecentData)
    .catch(error => error);
    
const getTimeAllRecentDataRequest = async buildingList =>
  await api
    .post("device/getDeviceFaultListByBuildingId", {
      buildingList: buildingList,
    })
    .then(allTimeRecentData => allTimeRecentData)
    .catch(error => error); //리스트

const getTotalCommentRequest = async deviceData =>
    await api
      .post("report/getTotalComment", {
        deviceData: deviceData,
      })
      .then(deviceData => deviceData)
      .catch(error => error);

const getMonitoringRecentDataRequest = async deviceList =>
  await api
    .post("recentData/getRecentDataByDeviceSN", {
      deviceSN: deviceList
    })
    .then(allRecentData => allRecentData)
    .catch(error => error);

const getTimeMonitoringRecentDataRequest = async buildingId =>
  await api
    .post("device/getBuildingListByVer12", {
      buildingId: buildingId
    })
    .then(allTimeRecentData => allTimeRecentData)
    .catch(error => error);


const getTimeMonitoringRecentDataRequest1 = async serialNumber =>
  await api
    .post("setting/getIrSettingBySn?serialNumber=123456789000001", {serialNumber: serialNumber})
    .then(allTimeRecentData => allTimeRecentData)
    .catch(error => error);


const getOutdoorStationRequest = async (coordX, coordY) =>
  await api
    .post("proxy/getStation", { latitude: coordX, longitude: coordY })
    .then(stationList => stationList)
    .catch(error => error);

const getOutdoorDustRequest = async stationName =>
  await api
    .post("proxy/getDust", { stationName: stationName })
    .then(dustList => dustList)
    .catch(error => error);

const getOutdoorWeatherDataRequest = async (nx, ny) =>
  await api
    .post("proxy/getWeather", { nx: nx, ny: ny })
    .then(outdoorWeatherData => outdoorWeatherData)
    .catch(error => error);

const getChartDataRequest = async (serialNumber, startDate, endDate) =>
  await api
    .post("report/getChartDataByDate", {
      serialNumber: serialNumber,
      startDate: startDate,
      endDate: endDate
    })
    .then(chartData => chartData)
    .catch(error => error);

function* getAllRecentDataWorker(payload) {
  console.dir(payload);
  const { positionList } = payload;
  try {
    const res = yield call(getAllRecentDataRequest, positionList);
    console.dir(res);
    yield put(allRecentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getTimeAllRecentDataWorker(payload) {
  console.dir(payload);
  const { buildingList } = payload;
  try {
    const res = yield call(getTimeAllRecentDataRequest, buildingList);
    yield put(allTimeRecentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getMonitoringRecentDataWorker(payload) {
  console.dir(payload);
  const { deviceList } = payload;
  try {
    const res = yield call(getMonitoringRecentDataRequest, deviceList);
    console.dir(res);
    yield put(monitoringRecentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}


function* getTotalCommentWorker(payload) {
  console.dir(payload);
  const { deviceData } = payload;
  try {
    const res = yield call(getTotalCommentRequest, deviceData);
    yield put(getTotalCommentSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}



function* getTimeMonitoringRecentDataWorker(payload) {
  console.dir(payload);
  const { buildingId } = payload;
  try {
    const res = yield call(getTimeMonitoringRecentDataRequest, buildingId);
    yield put(timeMonitoringRecentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}


function* getTimeMonitoringRecentDataWorker1(payload) {
  console.dir(payload);
  const { serialNumber } = payload;
  try {
    const res = yield call(getTimeMonitoringRecentDataRequest1, serialNumber);
    console.dir(res);
    yield put(timeMonitoringRecentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getOutdoorDustDataWorker(payload) {
  console.dir(payload);
  const { latitude, longitude } = payload.address;
  try {
    let coords = proj4("EPSG:4326", "EPSG:5181", [longitude, latitude]);
    const coordX = coords[0];
    const coordY = coords[1];
    const stationList = yield call(getOutdoorStationRequest, coordX, coordY);
    if (stationList.data.data && stationList.data.data.length) {
      const dustList = yield call(
        getOutdoorDustRequest,
        stationList.data.data[0].stationName
      );
      // dustList 배열에서 pm10Value 또는 pm25Value 가 - 인 것을 제외한 것 중에서 첫 번째를 return
      let outdoorDustData = dustList.data.data.find(function(item) {
        return item.pm10Value !== "-" && item.pm25Value !== "-";
      });
      if (outdoorDustData) {
        if (outdoorDustData.pm10Grade === "1") {
          outdoorDustData.pm10GradeStr = "좋음";
          outdoorDustData.pm10ImageName = "good";
          outdoorDustData.pm10Color = "#32a1ff";
        } else if (outdoorDustData.pm10Grade === "2") {
          outdoorDustData.pm10GradeStr = "보통";
          outdoorDustData.pm10ImageName = "normal";
          outdoorDustData.pm10Color = "#00c73c";
        } else if (outdoorDustData.pm10Grade === "3") {
          outdoorDustData.pm10GradeStr = "나쁨";
          outdoorDustData.pm10ImageName = "bad";
          outdoorDustData.pm10Color = "#fda60e";
        } else if (outdoorDustData.pm10Grade === "4") {
          outdoorDustData.pm10GradeStr = "매우나쁨";
          outdoorDustData.pm10ImageName = "vert_bad";
          outdoorDustData.pm10Color = "#e64747";
        }

        if (outdoorDustData.pm25Grade === "1") {
          outdoorDustData.pm25GradeStr = "좋음";
          outdoorDustData.pm25ImageName = "good";
          outdoorDustData.pm25Color = "#32a1ff";
        } else if (outdoorDustData.pm25Grade === "2") {
          outdoorDustData.pm25GradeStr = "보통";
          outdoorDustData.pm25ImageName = "normal";
          outdoorDustData.pm25Color = "#00c73c";
        } else if (outdoorDustData.pm25Grade === "3") {
          outdoorDustData.pm25GradeStr = "나쁨";
          outdoorDustData.pm25ImageName = "bad";
          outdoorDustData.pm25Color = "#fda60e";
        } else if (outdoorDustData.pm25Grade === "4") {
          outdoorDustData.pm25GradeStr = "매우나쁨";
          outdoorDustData.pm25ImageName = "vert_bad";
          outdoorDustData.pm25Color = "#e64747";
        }
      }

      yield put(outdoorDustDataSuccess(outdoorDustData));
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getOutdoorWeatherDataWorker(payload) {
  console.dir(payload);
  const { latitude, longitude } = payload.address;
  try {
    const kmaGrid = dfsXyConv("toXY", latitude, longitude); // 위도, 경도를 기상청 grid 로 변환
    const weatherList = yield call(
      getOutdoorWeatherDataRequest,
      kmaGrid.nx,
      kmaGrid.ny
    );
    var kmaData = {};
    if (weatherList.data.data && weatherList.data.data.item) {
      var list = weatherList.data.data.item;

      kmaData.temperature = list.find(function(item) {
        return item.category === "T1H";
      });
      kmaData.humidity = list.find(function(item) {
        return item.category === "REH";
      });
      kmaData.sky = list.find(function(item) {
        return item.category === "SKY";
      });
      kmaData.pty = list.find(function(item) {
        return item.category === "PTY";
      });

      if (kmaData.pty.fcstValue == 3) {
        kmaData.weather = "snow"; // 눈
      } else if (kmaData.pty.fcstValue == 2) {
        kmaData.weather = "rain_snow"; // 비/눈
      } else if (kmaData.pty.fcstValue == 1) {
        kmaData.weather = "rain"; // 비
      } else if (kmaData.sky.fcstValue == 4) {
        kmaData.weather = "blur"; // 흐림
      } else if (kmaData.sky.fcstValue == 3) {
        kmaData.weather = "cloudy2"; // 구름많음
      } else if (kmaData.sky.fcstValue == 2) {
        kmaData.weather = "cloudy1"; // 구름조금
      } else if (kmaData.sky.fcstValue == 1) {
        kmaData.weather = "sunny"; // 맑음
      }
    }

    yield put(outdoorWeatherDataSuccess(kmaData));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getChartDataWorker(payload) {
  const { deviceInfo } = payload;
  var startDate = moment(deviceInfo.date)
    .tz("Asia/Seoul")
    .format("YYYY-MM-DD");
  var endDate = moment(deviceInfo.date)
    .add(1, "days")
    .tz("Asia/Seoul")
    .format("YYYY-MM-DD");

  try {
    const chartData = yield call(
      getChartDataRequest,
      deviceInfo.serialNumber,
      startDate,
      endDate
    );
    var sensorData = {
      labels: [],
      e3Score: [],
      e3ScoreIndex: [0, 0, 0, 0, 0, 0],
      pm10: [],
      pm10Index: [0, 0, 0, 0, 0, 0],
      pm10Alarm: 0,
      pm25: [],
      pm25Index: [0, 0, 0, 0, 0, 0],
      pm25Alarm: 0,
      co2: [],
      co2Index: [0, 0, 0, 0, 0, 0],
      co2Alarm: 0,
      hcho: [],
      hchoIndex: [0, 0, 0, 0, 0, 0],
      hchoAlarm: 0,
      voc: [],
      vocIndex: [0, 0, 0, 0, 0, 0],
      vocAlarm: 0,
      temperature: [],
      temperatureIndex: [0, 0, 0, 0, 0, 0],
      temperatureAlarm: 0,
      humidity: [],
      humidityIndex: [0, 0, 0, 0, 0, 0],
      humidityAlarm: 0,
      noise: [],
      noiseIndex: [0, 0, 0, 0, 0, 0],
      noiseAlarm: 0,
      co: [],
      coIndex: [0, 0, 0, 0, 0, 0],
      coAlarm: 0
    };
    chartData.data.data.forEach(function(data, index) {
      var date = moment(data.date)
        .tz("Asia/Seoul")
        .format("HH:mm");
      sensorData.labels[index] = date; //data.Date; //data.Date.substr(11, 5);
      if (data.e3Score !== null) {
        sensorData.e3Score[index] = data.e3Score;
        sensorData.e3ScoreIndex[data.e3Index - 1]++;
      }
      if (data.pm10 !== null) {
        sensorData.pm10[index] = data.pm10;
        sensorData.pm10Index[data.pm10Index - 1]++;
        if (data.pm10Alarm) sensorData.pm10Alarm++;
      }
      if (data.pm25 !== null) {
        sensorData.pm25[index] = data.pm25;
        sensorData.pm25Index[data.pm25Index - 1]++;
        if (data.pm25Alarm) sensorData.pm25Alarm++;
      }
      if (data.co2 !== null) {
        sensorData.co2[index] = data.co2;
        sensorData.co2Index[data.co2Index - 1]++;
        if (data.co2Alarm) sensorData.co2Alarm++;
      }
      if (data.hcho !== null) {
        sensorData.hcho[index] = data.hcho;
        sensorData.hchoIndex[data.hchoIndex - 1]++;
        if (data.hchoAlarm) sensorData.hchoAlarm++;
      }
      if (data.voc !== null) {
        sensorData.voc[index] = data.voc;
        sensorData.vocIndex[data.vocIndex - 1]++;
        if (data.vocAlarm) sensorData.vocAlarm++;
      }
      if (data.temperature !== null) {
        sensorData.temperature[index] = data.temperature;
        sensorData.temperatureIndex[data.temperatureIndex - 1]++;
        if (data.temperatureAlarm) sensorData.temperatureAlarm++;
      }
      if (data.humidity !== null) {
        sensorData.humidity[index] = data.humidity;
        sensorData.humidityIndex[data.humidityIndex - 1]++;
        if (data.humidityAlarm) sensorData.humidityAlarm++;
      }
      if (data.noise !== null) {
        sensorData.noise[index] = data.noise;
        sensorData.noiseIndex[data.noiseIndex - 1]++;
        if (data.noiseAlarm) sensorData.noiseAlarm++;
      }
      if (data.co !== null) {
        sensorData.co[index] = data.co;
        sensorData.coIndex[data.coIndex - 1]++;
        if (data.coAlarm) sensorData.coAlarm++;
      }
    });

    yield put(chartDataSuccess(sensorData));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

export function* getAllRecentDataWatcher() {
  yield takeEvery(ALL_RECENT_DATA_REQUEST, getAllRecentDataWorker);
}

export function* getTimeAllRecentDataWatcher() {
  yield takeEvery(
    ALL_TIME_RECENT_DATA_REQUEST,
    getTimeAllRecentDataWorker
  );
}

export function* getMonitoringRecentDataWatcher() {
  yield takeEvery(
    MONITORING_RECENT_DATA_REQUEST,
    getMonitoringRecentDataWorker
  );
}
export function* getTimeMonitoringRecentDataWatcher() {
  yield takeEvery(
    TIME_MONITORING_RECENT_DATA_REQUEST,
    getTimeMonitoringRecentDataWorker
  );
}

export function* getTimeMonitoringRecentDataWatcher1() {
  yield takeEvery(
    TIME_MONITORING_RECENT_DATA_REQUEST1,
    getTimeMonitoringRecentDataWorker1,
  );
}

export function* getTotalCommentWatcher() {
  yield takeEvery(GET_TOTAL_COMMENT,getTotalCommentWorker);
}




export function* getOutdoorDustDataWatcher() {
  yield takeEvery(OUTDOOR_DUST_DATA_REQUEST, getOutdoorDustDataWorker);
}

export function* getOutdoorWeatherDataWatcher() {
  yield takeEvery(OUTDOOR_WEATHER_DATA_REQUEST, getOutdoorWeatherDataWorker);
}

export function* getChartDataWatcher() {
  yield takeEvery(CHART_DATA_REQUEST, getChartDataWorker);
}

export default function* rootSaga() {
  yield all([
    fork(getAllRecentDataWatcher),
    fork(getTimeAllRecentDataWatcher),
    fork(getMonitoringRecentDataWatcher),
    fork(getTimeMonitoringRecentDataWatcher),
    fork(getOutdoorDustDataWatcher),
    fork(getOutdoorWeatherDataWatcher),
    fork(getChartDataWatcher),
    fork(getTimeMonitoringRecentDataWatcher1),
    fork(getTotalCommentWatcher)
  ]);
}
