import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  OUTDOOR_DATA_REQUEST,
  OUTDOOR_DATA_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";
import {
  allRecentDataSuccess,
  monitoringRecentDataSuccess,
  outdoorDataSuccess
} from "actions/RecentData";
import { hideAuthLoader } from "actions/Auth";
import api from "api";
proj4.defs(
  "EPSG:5181",
  "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
);
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

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

const getOutdoorDataRequest = async (latitude, longitude) =>
  await api
    .post("recentData/getRecentDataByDeviceSN", {
      deviceSN: deviceList
    })
    .then(allRecentData => allRecentData)
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

function* getOutdoorDataWorker(payload) {
  console.dir(payload);
  const { latitude, longitude } = payload;
  try {
    //const res = yield call(getOutdoorDataRequest, latitude, longitude);
    console.log("latitude : " + latitude);
    console.log("longitude : " + longitude);
    let coords = proj4("EPSG:4326", "EPSG:5181", [latitude, longitude]);
    console.log("coordX : " + coords[0]);
    console.log("coordY : " + coords[1]);
    const kmaGrid = dfsXyConv("toXY", latitude, longitude); // 위도, 경도를 기상청 grid 로 변환
    console.log("kmaGrid.nx : " + kmaGrid.nx);
    console.log("kmaGrid.ny : " + kmaGrid.ny);
    //yield put(outdoorDataSuccess(res.data.data));
    //yield put(hideAuthLoader());
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

export function* getOutdoorDataWatcher() {
  yield takeEvery(OUTDOOR_DATA_REQUEST, getOutdoorDataWorker);
}

export default function* rootSaga() {
  yield all([
    fork(getAllRecentDataWatcher),
    fork(getMonitoringRecentDataWatcher),
    fork(getOutdoorDataWatcher)
  ]);
}
