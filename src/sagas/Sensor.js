import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  SENSOR_LIST_REQUEST,
  SENSOR_LIST_SUCCESS,
  SENSOR_UPDATE_REQUEST,
  SENSOR_UPDATE_SUCCESS
} from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* sensorItemWorker(action) {
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
export function* sensorItemWatcher() {
  yield takeEvery(SENSOR_LIST_REQUEST, sensorItemWorker);
}

function* sensorUpdateWorker(action) {
  try {
    const res = yield api.put(`setting/updateSetting`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* sensorUpdateWatcher() {
  yield takeEvery(SENSOR_UPDATE_REQUEST, sensorUpdateWorker);
}

export default function* rootSaga() {
  yield all([fork(sensorItemWatcher)]);
  yield all([fork(sensorUpdateWatcher)]);
}
