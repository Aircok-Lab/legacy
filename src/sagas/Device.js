import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  DEVICE_LIST_BY_BUILDING_ID_REQUEST,
  DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_REQUEST,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS,
  DEVICE_ADD_REQUEST,
  DEVICE_ADD_SUCCESS,
  DEVICE_UPDATE_REQUEST,
  DEVICE_DELETE_REQUEST
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

function* deviceAddWorker(action) {
  try {
    const res = yield api.post(`device/addDevice`, action.payload);
    yield put({
      type: DEVICE_LIST_BY_POSITION_ID_REQUEST,
      payload: { id: action.payload.positionID }
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceAddWatcher() {
  yield takeEvery(DEVICE_ADD_REQUEST, deviceAddWorker);
}

function* deviceDeleteWorker(action) {
  try {
    const res = yield api.delete(
      `device/deleteDevice?serialNumber=${action.payload.ids}`
    );
    yield put({
      type: DEVICE_LIST_BY_POSITION_ID_REQUEST,
      payload: { id: action.payload.positionID }
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceDeleteWatcher() {
  yield takeEvery(DEVICE_DELETE_REQUEST, deviceDeleteWorker);
}

export default function* rootSaga() {
  yield all([fork(deviceListByBuildingIdWatcher)]);
  yield all([fork(deviceListByPositionIdWatcher)]);
  yield all([fork(deviceAddWatcher)]);
  yield all([fork(deviceDeleteWatcher)]);
}
