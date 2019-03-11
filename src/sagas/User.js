import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  USER_LIST_BY_BUILDING_ID_REQUEST,
  USER_LIST_BY_BUILDING_ID_SUCCESS,
  USER_LIST_BY_POSITION_ID_REQUEST,
  USER_LIST_BY_POSITION_ID_SUCCESS,
  USER_ADD_REQUEST,
  USER_ADD_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_DELETE_REQUEST
} from "constants/ActionTypes";
import api from "api";

function* userListByBuildingIdWorker(action) {
  try {
    const res = yield api.post(`user/getUserByBuildingId`, action.payload);
    yield put({
      type: USER_LIST_BY_BUILDING_ID_SUCCESS,
      payload: res.data.data
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userListByBuildingIdWatcher() {
  yield takeEvery(USER_LIST_BY_BUILDING_ID_REQUEST, userListByBuildingIdWorker);
}

function* userListByPositionIdWorker(action) {
  try {
    const res = yield api.post(`user/getUserByPositionId`, action.payload);
    yield put({
      type: USER_LIST_BY_POSITION_ID_SUCCESS,
      payload: res.data.data
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userListByPositionIdWatcher() {
  yield takeEvery(USER_LIST_BY_POSITION_ID_REQUEST, userListByPositionIdWorker);
}

function* userAddWorker(action) {
  try {
    const res = yield api.post(`user/addUser`, action.payload);
    yield put({
      type: USER_LIST_BY_POSITION_ID_REQUEST,
      // payload: { positionID: action.payload.positionID }
      payload: { positionID: action.payload.positionList }
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userAddWatcher() {
  yield takeEvery(USER_ADD_REQUEST, userAddWorker);
}

function* userDeleteWorker(action) {
  try {
    const res = yield api.delete(`user/deleteUser?id=${action.payload.ids}`);
    console.log("user delete - action.payload :", action.payload);
    if (action.payload.node.BuildingID) {
      yield put({
        type: "USER_LIST_BY_POSITION_ID_REQUEST",
        payload: { positionID: "" + action.payload.node.id }
      });
    } else {
      yield put({
        type: "USER_LIST_BY_BUILDING_ID_REQUEST",
        payload: { buildingID: "" + action.payload.node.id }
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userDeleteWatcher() {
  yield takeEvery(USER_DELETE_REQUEST, userDeleteWorker);
}

export default function* rootSaga() {
  yield all([fork(userListByBuildingIdWatcher)]);
  yield all([fork(userListByPositionIdWatcher)]);
  yield all([fork(userAddWatcher)]);
  yield all([fork(userDeleteWatcher)]);
}
