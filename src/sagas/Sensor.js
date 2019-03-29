import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  SENSOR_LIST_REQUEST,
  SENSOR_LIST_SUCCESS,
  SENSOR_MIN_UPDATE_REQUEST,
  SENSOR_MAX_UPDATE_REQUEST
} from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* sensorListWorker(action) {
  try {
    const res = yield api.post(`indextable/allIndexTable`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: SENSOR_LIST_SUCCESS,
        payload: res.data.data
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* sensorListWatcher() {
  yield takeEvery(SENSOR_LIST_REQUEST, sensorListWorker);
}

function* sensorMinUpdateWorker(action) {
  try {
    const res = yield api.put(`indexTable/updateMinIndexTable`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* sensorMinUpdateWatcher() {
  yield takeEvery(SENSOR_MIN_UPDATE_REQUEST, sensorMinUpdateWorker);
}

function* sensorMaxUpdateWorker(action) {
  try {
    const res = yield api.put(`indexTable/updateMaxIndexTable`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* sensorMaxUpdateWatcher() {
  yield takeEvery(SENSOR_MAX_UPDATE_REQUEST, sensorMaxUpdateWorker);
}

export default function* rootSaga() {
  yield all([fork(sensorListWatcher)]);
  yield all([fork(sensorMinUpdateWatcher)]);
  yield all([fork(sensorMaxUpdateWatcher)]);
}
