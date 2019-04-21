import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  OUTDOOR_DUST_DATA_REQUEST,
  OUTDOOR_DUST_DATA_SUCCESS,
  OUTDOOR_WEATHER_DATA_REQUEST,
  OUTDOOR_WEATHER_DATA_SUCCESS,
  USER_PHONE_REQUEST,
  USER_PHONE_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";
import {
  allRecentDataSuccess,
  monitoringRecentDataSuccess,
  outdoorDustDataSuccess
} from "actions/RecentData";
import { hideAuthLoader } from "actions/Auth";
import api from "api";
import _ from "lodash";

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

// 기상청 온도, 습도 조회 URL 생성
function getWeatherUrl(nx, ny, serviceKey) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();

  if (minutes < 30) {
    // 30분보다 작으면 한시간 전 값
    hours = hours - 1;
    if (hours < 0) {
      // 자정 이전은 전날로 계산
      today.setDate(today.getDate() - 1);
      dd = today.getDate();
      mm = today.getMonth() + 1;
      yyyy = today.getFullYear();
      hours = 23;
    }
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0" + dd;
  }

  var _nx = nx,
    _ny = ny,
    apikey = serviceKey,
    today = yyyy + "" + mm + "" + dd,
    basetime = hours + "00",
    fileName =
      "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastTimeData";
  fileName += "?ServiceKey=" + apikey;
  fileName += "&base_date=" + today;
  fileName += "&base_time=" + basetime;
  fileName += "&nx=" + _nx + "&ny=" + _ny;
  fileName += "&pageNo=1&numOfRows=100";
  fileName += "&_type=json";

  return fileName;
}

const getAllRecentDataRequest = async positionList =>
  await api
    .post("recentData/getRecentDataByPositionId", {
      positionID: positionList
    })
    .then(allRecentData => allRecentData)
    .catch(error => error);

const getMonitoringRecentDataRequest = async deviceList =>
  await api
    .post("recentData/getRecentDataByDeviceSN", {
      deviceSN: deviceList
    })
    .then(allRecentData => allRecentData)
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

const getOutdoorWeatherDataRequest = async url =>
  await api
    .get("proxy/?url=" + url)
    .then(outdoorWeatherData => outdoorWeatherData)
    .catch(error => error);

// const getUserPhoneRequest = async (serialNumber, positionID) =>
//     await api
//       .post("user/getUserPhoneByDeviceSN", {
//         deviceSN: deviceList
//         positionID: positionID
//       })
//       .then(userPhone => userPhone)
//       .catch(error => error);

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

function* getOutdoorDustDataWorker(payload) {
  console.dir(payload);
  const { latitude, longitude } = payload.address;
  try {
    let coords = proj4("EPSG:4326", "EPSG:5181", [latitude, longitude]);
    const coordX = coords[0];
    const coordY = coords[1];

    const stationList = yield call(getOutdoorStationRequest, coordX, coordY);
    console.dir(stationList);
    const dustList = yield call(
      getOutdoorDustRequest,
      stationList.data.list[0].stationName
    );
    console.dir(dustList);
    // res.data.data[0].publicAirData.pm10Value = "";
    //   res.data.data[0].publicAirData.pm25Value = "";

    //yield put(outdoorDustDataSuccess(dustList.data.list));
    //yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getOutdoorWeatherDataWorker(payload) {
  console.dir(payload);
  const { latitude, longitude } = payload.address;
  try {
    const kmaGrid = dfsXyConv("toXY", longitude, latitude); // 위도, 경도를 기상청 grid 로 변환
    const weatherList = yield call(
      getOutdoorWeatherDataRequest,
      kmaGrid.nx,
      kmaGrid.ny
    );
    console.log(weatherList);

    // // 응답할 데이터에 공공데이터 온도, 습도, 날씨 추가
    // res.data.data[0].publicWeatherData = {};
    // if (
    //   kmaRes.data.response.body &&
    //   kmaRes.data.response.body.items.item.length
    // ) {
    //   res.data.data[0].publicWeatherData.temperature = _.find(
    //     kmaRes.data.response.body.items.item,
    //     {
    //       category: "T1H"
    //     }
    //   ).fcstValue;
    //   res.data.data[0].publicWeatherData.humidity = _.find(
    //     kmaRes.data.response.body.items.item,
    //     {
    //       category: "REH"
    //     }
    //   ).fcstValue;
    //   res.data.data[0].publicWeatherData.sky = _.find(
    //     kmaRes.data.response.body.items.item,
    //     {
    //       category: "SKY"
    //     }
    //   ).fcstValue;
    //   res.data.data[0].publicWeatherData.pty = _.find(
    //     kmaRes.data.response.body.items.item,
    //     {
    //       category: "PTY"
    //     }
    //   ).fcstValue;
    // } else {
    //   res.data.data[0].publicWeatherData.temperature = "";
    //   res.data.data[0].publicWeatherData.humidity = "";
    //   res.data.data[0].publicWeatherData.sky = "";
    //   res.data.data[0].publicWeatherData.pty = "";
    // }
    // // 날씨
    // if (res.data.data[0].publicWeatherData.pty == 3) {
    //   res.data.data[0].publicWeatherData.weather = "snow"; // 눈
    // } else if (res.data.data[0].publicWeatherData.pty == 2) {
    //   res.data.data[0].publicWeatherData.weather = "rain_snow"; // 비/눈
    // } else if (res.data.data[0].publicWeatherData.pty == 1) {
    //   res.data.data[0].publicWeatherData.weather = "rain"; // 비
    // } else if (res.data.data[0].publicWeatherData.sky == 4) {
    //   res.data.data[0].publicWeatherData.weather = "blur"; // 흐림
    // } else if (res.data.data[0].publicWeatherData.sky == 3) {
    //   res.data.data[0].publicWeatherData.weather = "cloudy2"; // 구름많음
    // } else if (res.data.data[0].publicWeatherData.sky == 2) {
    //   res.data.data[0].publicWeatherData.weather = "cloudy1"; // 구름조금
    // } else if (res.data.data[0].publicWeatherData.sky == 1) {
    //   res.data.data[0].publicWeatherData.weather = "sunny"; // 맑음
    // }

    // yield put({ type: LIST_MEASURE_DEVICE_BASIC_SUCCESS, payload: res.data });

    //yield put(outdoorWeatherDataSuccess(res.data.data));
    //yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getUserPhoneWorker(payload) {
  console.dir(payload);
  const { serialNumber, positionID } = payload;
  try {
    //const res = yield call(getUserPhoneRequest, latitude, longitude);
    yield put(userPhoneSuccess(res.data.data));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

export function* getAllRecentDataWatcher() {
  yield takeEvery(ALL_RECENT_DATA_REQUEST, getAllRecentDataWorker);
}

export function* getMonitoringRecentDataWatcher() {
  yield takeEvery(
    MONITORING_RECENT_DATA_REQUEST,
    getMonitoringRecentDataWorker
  );
}

export function* getOutdoorDustDataWorker() {
  yield takeEvery(OUTDOOR_DUST_DATA_REQUEST, getOutdoorDustDataWorker);
}

export function* getOutdoorWeatherDataWatcher() {
  yield takeEvery(OUTDOOR_WEATHER_DATA_REQUEST, getOutdoorWeatherDataWorker);
}

export function* getUserPhoneWatcher() {
  yield takeEvery(USER_PHONE_REQUEST, getUserPhoneWorker);
}

export default function* rootSaga() {
  yield all([
    fork(getAllRecentDataWatcher),
    fork(getMonitoringRecentDataWatcher),
    fork(getOutdoorDustDataWorker),
    fork(getOutdoorWeatherDataWatcher),
    fork(getUserPhoneWatcher)
  ]);
}
