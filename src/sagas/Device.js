import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery, delay } from "redux-saga/effects";
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
