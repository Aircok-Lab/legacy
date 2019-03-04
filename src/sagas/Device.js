import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  DEVICE_LIST_BY_BUILDING_ID_REQUEST,
  DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_REQUEST,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS
} from "constants/ActionTypes";
import api from "api";

function* deviceListByBuildingIdWorker(action) {
  try {
    const res = yield api.post(`device/getDeviceByBuildingId`, action.payload);
    console.log("TODO: delay for test");
    yield delay(10);
    yield put({
      type: DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
      payload: res.data.data
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceListByBuildingIdWatcher() {
  yield takeEvery(
    DEVICE_LIST_BY_BUILDING_ID_REQUEST,
    deviceListByBuildingIdWorker
  );
}

function* deviceListByPositionIdWorker(action) {
  try {
    const res = yield api.post(`device/getDeviceByPositionId`, action.payload);
    console.log("TODO: 1000ms delay for test");
    yield delay(1000);
    yield put({
      type: DEVICE_LIST_BY_POSITION_ID_SUCCESS,
      payload: res.data.data
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceListByPositionIdWatcher() {
  yield takeEvery(
    DEVICE_LIST_BY_POSITION_ID_REQUEST,
    deviceListByPositionIdWorker
  );
}

export default function* rootSaga() {
  yield all([fork(deviceListByBuildingIdWatcher)]);
  yield all([fork(deviceListByPositionIdWatcher)]);
}
