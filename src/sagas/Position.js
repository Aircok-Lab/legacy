import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_SUCCESS,
  POSITION_ADD_REQUEST,
  POSITION_ADD_SUCCESS,
  POSITION_UPDATE_REQUEST,
  POSITION_UPDATE_SUCCESS,
  POSITION_DELETE_REQUEST,
  POSITION_DELETE_SUCCESS,
  USER_GET_BY_ID_REQUEST
} from "constants/ActionTypes";
import { userSignInSuccess } from "actions/Auth";
import responseDataProcess from "util/responseDataProcess";

import api from "api";

function* positionListWorker(action) {
  try {
    const res = yield api.post(`position/getPositionById`, action.payload);
    yield put({ type: POSITION_LIST_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionListWatcher() {
  yield takeEvery(POSITION_LIST_REQUEST, positionListWorker);
}

function* positionAddWorker(action) {
  try {
    let res = yield api.post(`position/addPosition`, action.payload);
    localStorage.setItem("user_id", JSON.stringify(res.data.data));
    yield put(userSignInSuccess(res.data.data));
    yield put({
      type: "POSITION_LIST_REQUEST",
      payload: { id: res.data.data.PositionList }
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionAddWatcher() {
  yield takeEvery(POSITION_ADD_REQUEST, positionAddWorker);
}

function* positionUpdateWorker(action) {
  try {
    let res = yield api.put(`position/updateBuilding`, action.payload);
    yield put({ type: POSITION_UPDATE_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionUpdateWatcher() {
  yield takeEvery(POSITION_UPDATE_REQUEST, positionUpdateWorker);
}

function* positionDeleteWorker(action) {
  let res = null;
  try {
    res = yield api.delete(
      `position/deletePosition?id=${action.payload.id}&userID=${
        action.payload.userID
      }`
    );

    if (responseDataProcess(res.data)) {
      localStorage.setItem("user_id", JSON.stringify(res.data.data));
      yield put(userSignInSuccess(res.data.data));
      yield put({
        type: "POSITION_LIST_REQUEST",
        payload: { id: res.data.data.PositionList }
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionDeleteWatcher() {
  yield takeEvery(POSITION_DELETE_REQUEST, positionDeleteWorker);
}

export default function* rootSaga() {
  yield all([fork(positionListWatcher)]);
  yield all([fork(positionAddWatcher)]);
  yield all([fork(positionUpdateWatcher)]);
  yield all([fork(positionDeleteWatcher)]);
}
