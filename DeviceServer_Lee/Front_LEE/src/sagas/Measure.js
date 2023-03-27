import { push } from "react-router-redux";
import {
  all,
  call,
  fork,
  put,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import {
  LIST_MEASURE_43,
  LIST_MEASURE_43_SUCCESS,
  LIST_MEASURE_43_2,
  LIST_MEASURE_43_2_SUCCESS,
  LIST_MEASURE_43_3,
  LIST_MEASURE_43_3_SUCCESS,
  LIST_MEASURE_DEVICE_BASIC,
  LIST_MEASURE_DEVICE_BASIC_SUCCESS,
  LIST_MEASURE_ALARM,
  LIST_MEASURE_ALARM_SUCCESS,
  LIST_MEASURE_BASIC,
  LIST_MEASURE_BASIC_SUCCESS,
  LIST_MEASURE_DEVICESTATUS,
  LIST_MEASURE_DEVICESTATUS_SUCCESS,
  LIST_MEASURE_HISTORY,
  LIST_MEASURE_HISTORY_SUCCESS,
  LIST_MEASURE,
  LIST_MEASURE_SUCCESS,
  VIEW_MEASURE,
  VIEW_MEASURE_SUCCESS,
  DELETE_MEASURE,
  DELETE_MEASURE_SUCCESS,
  SAVE_MEASURE,
  SAVE_MEASURE_SUCCESS,
  GET_KMA_DATA,
  GET_KMA_DATA_SUCCESS,
  GET_AIRKOREA_DATA,
  GET_AIRKOREA_DATA_SUCCESS
} from "constants/ActionTypes";
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

function* listMeasure43Worker(action) {
  try {
    const res = yield api.get(
      `https://smart.aircok.com:11104/device_data/research.txt`
    );
    yield put({ type: LIST_MEASURE_43_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasure43Watcher() {
  yield takeLatest(LIST_MEASURE_43, listMeasure43Worker);
}

function* listMeasure432Worker(action) {
  try {
    const res = yield api.get(
      `https://smart.aircok.com:11104/device_data/research2.txt`
    );
    yield put({ type: LIST_MEASURE_43_2_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasure432Watcher() {
  yield takeLatest(LIST_MEASURE_43_2, listMeasure432Worker);
}

function* listMeasure433Worker(action) {
  try {
    const res = yield api.get(
      `https://smart.aircok.com:11104/device_data/research3.txt`
    );
    yield put({ type: LIST_MEASURE_43_3_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasure433Watcher() {
  yield takeLatest(LIST_MEASURE_43_3, listMeasure433Worker);
}

function* listMeasureDeviceBasicWorker(action) {
  try {
    let res = yield api.get(
      `eco/device/${action.payload.deviceId}/measure/data/basic`
    );
    yield put({ type: LIST_MEASURE_DEVICE_BASIC_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasureDeviceBasicWatcher() {
  yield takeLatest(LIST_MEASURE_DEVICE_BASIC, listMeasureDeviceBasicWorker);
}

function* listMeasureAlarmWorker(action) {
  try {
    const res = yield api.get(`eco/branch/58/measure/data/alarm-data`);
    yield put({ type: LIST_MEASURE_ALARM_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasureAlarmWatcher() {
  yield takeLatest(LIST_MEASURE_ALARM, listMeasureAlarmWorker);
}

function* listMeasureBasicWorker(action) {
  try {
    if (action.payload.branchId > 0) {
      const res = yield api.get(
        `eco/branch/0/measure/data/basic?branch_ids=0,${
          action.payload.branchId
        }`
      );
      yield put({ type: LIST_MEASURE_BASIC_SUCCESS, payload: res.data });
    } else {
      if (action.payload.isMaster) {
        const res = yield api.get(`eco/branch/0/measure/data/basic`);
        yield put({ type: LIST_MEASURE_BASIC_SUCCESS, payload: res.data });
      } else {
        const res = yield api.get(
          `eco/branch/0/measure/data/basic?branch_ids=0,${
            action.payload.branch_ids
          }`
        );
        yield put({ type: LIST_MEASURE_BASIC_SUCCESS, payload: res.data });
      }
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasureBasicWatcher() {
  yield takeLatest(LIST_MEASURE_BASIC, listMeasureBasicWorker);
}

function* listMeasureHistoryWorker(action) {
  try {
    // const res = yield api.get(
    //   `eco/device/0/measure/data/device-meascd?device_ids=0,${
    //     action.payload.mngDeviceIds
    //   }&interval=${action.payload.measureCycle}&start_date=${
    //     action.payload.start_date
    //   }&end_date=${action.payload.end_date}`
    // );

    const res = yield api.get(
      `eco/device/0/measure/data/device-meascd?device_ids=${
        action.payload.excelDeviceId
      }&start_date=${action.payload.start_date}&end_date=${
        action.payload.end_date
      }`
    );
    // const res = yield api.get(
    //   `https://smart.aircok.com:11104/eco/device/0/measure/data/device-meascd?device_ids=67&start_date=2018-11-01&end_date=2018-12-01`
    // );
    yield put({
      type: LIST_MEASURE_HISTORY_SUCCESS,
      payload: res.data,
      startDate: action.payload.start_date,
      endDate: action.payload.end_date,
      measureCycle: action.payload.measureCycle,
      deviceName: action.payload.deviceName
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasureHistoryWatcher() {
  yield takeLatest(LIST_MEASURE_HISTORY, listMeasureHistoryWorker);
}

function* listMeasureDeviceStatusWorker(action) {
  try {
    // const res = yield api.get(
    //   `eco/branch/0/measure/data/meas-dvc-status?branch_ids=${
    //     action.payload.branch_ids
    //   }`
    // );
    // yield put({ type: LIST_MEASURE_DEVICESTATUS_SUCCESS, payload: res.data });

    if (action.payload.branchId > 0) {
      // const res = yield api.get(
      //   `eco/branch/0/measure/data/basic?branch_ids=0,${
      //     action.payload.branchId
      //   }`
      // );
      // yield put({ type: LIST_MEASURE_BASIC_SUCCESS, payload: res.data });

      const res = yield api.get(
        `eco/branch/0/measure/data/meas-dvc-status?branch_ids=0,${
          action.payload.branchId
        }`
      );
      yield put({ type: LIST_MEASURE_DEVICESTATUS_SUCCESS, payload: res.data });
    } else {
      if (action.payload.isMaster) {
        const res = yield api.get(`eco/branch/0/measure/data/meas-dvc-status`);
        yield put({
          type: LIST_MEASURE_DEVICESTATUS_SUCCESS,
          payload: res.data
        });
      } else {
        const res = yield api.get(
          `eco/branch/0/measure/data/meas-dvc-status?branch_ids=0,${
            action.payload.branch_ids
          }`
        );
        yield put({
          type: LIST_MEASURE_DEVICESTATUS_SUCCESS,
          payload: res.data
        });
      }
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasureDeviceStatusWatcher() {
  yield takeLatest(LIST_MEASURE_DEVICESTATUS, listMeasureDeviceStatusWorker);
}

function* listMeasureWorker(action) {
  try {
    const res = yield api.get(`eco/measure`);
    yield put({ type: LIST_MEASURE_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* listMeasureWatcher() {
  yield takeEvery(LIST_MEASURE, listMeasureWorker);
}

function* viewMeasureWorker(action) {
  try {
    const res = yield api.get(
      `eco/measure/${action.payload}?branch_id=1&index=1&limit=10`
    );
    yield put({ type: VIEW_MEASURE_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* viewMeasureWatcher() {
  yield takeEvery(VIEW_MEASURE, viewMeasureWorker);
}

function* deleteMeasureWorker(action) {
  try {
    const res = yield api.delete(`eco/measure/${action.payload}`);
    yield put({ type: DELETE_MEASURE_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deleteMeasureWatcher() {
  yield takeEvery(DELETE_MEASURE, deleteMeasureWorker);
}

function* saveMeasureWorker(action) {
  try {
    if (action.payload.id === 0) {
      const res = yield api.put(`eco/measure`, action.payload);
      yield put({
        type: SAVE_MEASURE_SUCCESS,
        payload: res.data.data
      });
    } else {
      const res = yield api.post(`eco/measure`, action.payload);
      yield put({
        type: SAVE_MEASURE_SUCCESS,
        payload: res.data.data
      });
    }
    const res = yield api.get(`eco/measure`);
    yield put({ type: LIST_MEASURE_SUCCESS, payload: res.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* saveMeasureWatcher() {
  yield takeEvery(SAVE_MEASURE, saveMeasureWorker);
}

function* getKmaDataWorker(action) {
  try {
    let proxyURL = "https://smart.aircok.com/proxy";
    let serviceKey =
      "gv%2BRtk1AAsF%2FoktFHHGyBtBVdDD2gkRmrOFBRT%2BW07julujIwZQyjF0O%2FNtNqoWJ6LQq0GwDv%2BNSiUhhT07SRA%3D%3D";
    let kmaGrid = dfsXyConv(
      "toXY",
      action.payload.coordX,
      action.payload.coordY
    ); // 위도, 경도를 기상청 grid 로 변환
    let url =
      proxyURL +
      "?url=" +
      encodeURIComponent(getWeatherUrl(kmaGrid.nx, kmaGrid.ny, serviceKey));
    let res = yield api.get(url);

    if (res.data.response.body && res.data.response.body.items.item.length) {
      yield put({
        type: GET_KMA_DATA_SUCCESS,
        payload: { data: { item: res.data.response.body.items.item } }
      });
    } else {
      // yield put({ type: GET_KMA_DATA_SUCCESS, payload: {data: {}} });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* getKmaDataWatcher() {
  yield takeLatest(GET_KMA_DATA, getKmaDataWorker);
}

function* getAirkoreaDataWorker(action) {
  try {
    let proxyURL = "https://smart.aircok.com/proxy";
    let coords = proj4("EPSG:4326", "EPSG:5181", [
      action.payload.coordY,
      action.payload.coordX
    ]);
    let serviceKey =
      "2swHUoM3iFAky78x2Ljh%2BZBtTvcoy%2Fe7fxxtAYd8Mwa6Lc85ITizobiNA3zVg78ZIbubA2W3Eu%2FWnGxvGQz22g%3D%3D";
    let convertedCoordX = coords[0];
    let convertedCoordY = coords[1];

    let url =
      proxyURL +
      "?url=" +
      encodeURIComponent(
        "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=" +
          convertedCoordX +
          "&tmY=" +
          convertedCoordY +
          "&pageNo=1&numOfRows=10&ServiceKey=" +
          serviceKey +
          "&_returnType=json"
      );
    let res = yield api.get(url);

    if (res.data.list && res.data.list.length) {
      let stationName = res.data.list[0].stationName;
      let url2 =
        proxyURL +
        "?url=" +
        encodeURIComponent(
          "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=" +
            stationName +
            "&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=" +
            serviceKey +
            "&ver=1.3&_returnType=json"
        );
      let res2 = yield api.get(url2);

      // res2.data.list 배열에서 pm10Value 또는 pm25Value 가 - 인 것을 제외한 것 중에서 첫 번째를 return
      let filteredList = _.filter(res2.data.list, function(item) {
        return item.pm10Value !== '-' && item.pm25Value !== '-';
      });

      yield put({
        type: GET_AIRKOREA_DATA_SUCCESS,
        payload: { data: filteredList[0] }
      });
    } else {
      // yield put({ type: GET_AIRKOREA_DATA_SUCCESS, payload: {data: {}} });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* getAirkoreaDataWatcher() {
  yield takeLatest(GET_AIRKOREA_DATA, getAirkoreaDataWorker);
}

export default function* rootSaga() {
  yield all([fork(listMeasure43Watcher)]);
  yield all([fork(listMeasure432Watcher)]);
  yield all([fork(listMeasure433Watcher)]);
  yield all([fork(listMeasureDeviceBasicWatcher)]);
  yield all([fork(listMeasureBasicWatcher)]);
  yield all([fork(listMeasureDeviceStatusWatcher)]);
  yield all([fork(listMeasureHistoryWatcher)]);
  yield all([fork(listMeasureWatcher)]);
  yield all([fork(viewMeasureWatcher)]);
  yield all([fork(deleteMeasureWatcher)]);
  yield all([fork(saveMeasureWatcher)]);
  yield all([fork(getKmaDataWatcher)]);
  yield all([fork(getAirkoreaDataWatcher)]);
}
