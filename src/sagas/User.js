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
import { userSignInSuccess } from "actions/Auth";
import responseDataProcess from "util/responseDataProcess";

function* userListByBuildingIdWorker(action) {
  try {
    const res = yield api.post(`user/getUserByBuildingId`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: USER_LIST_BY_BUILDING_ID_SUCCESS,
        payload: res.data.data
      });
    }
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
    if (responseDataProcess(res.data)) {
      yield put({
        type: USER_LIST_BY_POSITION_ID_SUCCESS,
        payload: res.data.data
      });
    }
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
    if (responseDataProcess(res.data)) {
      yield put({
        type: USER_LIST_BY_POSITION_ID_REQUEST,
        payload: { positionID: action.payload.positionList }
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
export function* userAddWatcher() {
  yield takeEvery(USER_ADD_REQUEST, userAddWorker);
}

function* userUpdateWorker(action) {
  try {
    const res = yield api.put(`user/updateUser`, action.payload);
    if (responseDataProcess(res.data)) {
      console.log("userUpdateWorker res.data.data", res.data.data);
      localStorage.setItem("user_id", JSON.stringify(res.data.data));
      yield put(userSignInSuccess(res.data.data));
      yield put({
        type: "SET_VIEW_MODE",
        payload: "list"
      });
      // yield put({
      //   type: USER_LIST_BY_POSITION_ID_REQUEST,
      //   payload: { positionID: action.payload.positionList }
      // });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userUpdateWatcher() {
  yield takeEvery(USER_UPDATE_REQUEST, userUpdateWorker);
}

function* userDeleteWorker(action) {
  try {
    const res = yield api.delete(`user/deleteUser?id=${action.payload.ids}`);
    if (responseDataProcess(res.data)) {
      if (action.payload.node.buildingID) {
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
      yield put({
        type: "SET_VIEW_MODE",
        payload: "list"
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
  yield all([fork(userUpdateWatcher)]);
  yield all([fork(userDeleteWatcher)]);
}
