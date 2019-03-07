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
  //     const signInUser = yield call(signInUserWithEmailPasswordRequest, email, newpw);

  try {
    let res = yield api.post(`position/addBuilding`, action.payload);
    yield delay(1000);
    yield put({
      type: USER_GET_BY_ID_REQUEST,
      payload: { id: action.payload.user_id }
    });
    yield put({ type: POSITION_ADD_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionAddWatcher() {
  yield takeEvery(POSITION_UPDATE_REQUEST, positionAddWorker);
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
    if (action.payload.id) {
      res = yield api.delete(`position/deleteBuilding?id=${action.payload.id}`);
      yield delay(1000);
      yield put({
        type: USER_GET_BY_ID_REQUEST,
        payload: { id: action.payload.user_id }
      });
    }
    yield put({ type: POSITION_DELETE_SUCCESS, payload: res.data.data });
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
