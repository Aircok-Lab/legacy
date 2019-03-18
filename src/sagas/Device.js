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
  DEVICE_DELETE_REQUEST,
  DEVICE_GET_ALL_BY_POSITION_ID_REQUEST,
  DEVICE_GET_ALL_BY_POSITION_ID_SUCCESS
} from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";

function* deviceListByBuildingIdWorker(action) {
  try {
    const res = yield api.post(`device/getDeviceByBuildingId`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
        payload: res.data.data
      });
    }
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
    if (responseDataProcess(res.data)) {
      yield put({
        type: DEVICE_LIST_BY_POSITION_ID_SUCCESS,
        payload: res.data.data
      });
    }
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
    if (responseDataProcess(res.data)) {
      yield put({
        type: DEVICE_LIST_BY_POSITION_ID_REQUEST,
        payload: { id: action.payload.positionID }
      });
      yield put({
        type: "SET_VIEW_MODE",
        payload: "list"
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceAddWatcher() {
  yield takeEvery(DEVICE_ADD_REQUEST, deviceAddWorker);
}

function* deviceUpdateWorker(action) {
  try {
    const res = yield api.put(`device/updateDevice`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: DEVICE_LIST_BY_POSITION_ID_REQUEST,
        payload: { id: action.payload.positionID }
      });
      yield put({
        type: "SET_VIEW_MODE",
        payload: "list"
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceUpdateWatcher() {
  yield takeEvery(DEVICE_UPDATE_REQUEST, deviceUpdateWorker);
}

function* deviceDeleteWorker(action) {
  try {
    const res = yield api.delete(
      `device/deleteDevice?serialNumber=${action.payload.ids}`
    );
    if (responseDataProcess(res.data)) {
      if (action.payload.node.buildingID) {
        yield put({
          type: "DEVICE_LIST_BY_POSITION_ID_REQUEST",
          payload: { id: action.payload.node.id }
        });
      } else {
        yield put({
          type: "DEVICE_LIST_BY_BUILDING_ID_REQUEST",
          payload: { id: action.payload.node.id }
        });
      }
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceDeleteWatcher() {
  yield takeEvery(DEVICE_DELETE_REQUEST, deviceDeleteWorker);
}

function* deviceGetAllByPositionIdWorker(action) {
  try {
    const res = yield api.get(
      `device/getAllDeviceByPositionId?positionID=${action.payload.id}`
    );
    console.log("sagas... action: ", action);
    if (responseDataProcess(res.data)) {
      yield put({
        type: "DEVICE_GET_ALL_BY_POSITION_ID_SUCCESS",
        payload: res.data.data,
        devices: action.payload.devices
      });

      // if (action.payload.node.buildingID) {
      //   yield put({
      //     type: "DEVICE_LIST_BY_POSITION_ID_REQUEST",
      //     payload: { id: action.payload.node.id }
      //   });
      // } else {
      //   yield put({
      //     type: "DEVICE_LIST_BY_BUILDING_ID_REQUEST",
      //     payload: { id: action.payload.node.id }
      //   });
      // }
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* deviceGetAllByPositionIdWatcher() {
  yield takeEvery(
    DEVICE_GET_ALL_BY_POSITION_ID_REQUEST,
    deviceGetAllByPositionIdWorker
  );
}

export default function* rootSaga() {
  yield all([fork(deviceListByBuildingIdWatcher)]);
  yield all([fork(deviceListByPositionIdWatcher)]);
  yield all([fork(deviceAddWatcher)]);
  yield all([fork(deviceUpdateWatcher)]);
  yield all([fork(deviceDeleteWatcher)]);
  yield all([fork(deviceGetAllByPositionIdWatcher)]);
}
