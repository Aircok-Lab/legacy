import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  BUILDING_LIST_REQUEST,
  BUILDING_LIST_SUCCESS,
  BUILDING_ADD_REQUEST,
  BUILDING_ADD_SUCCESS,
  BUILDING_UPDATE_REQUEST,
  BUILDING_UPDATE_SUCCESS,
  BUILDING_DELETE_REQUEST,
  BUILDING_DELETE_SUCCESS,
  USER_GET_BY_ID_REQUEST
} from "constants/ActionTypes";
import api from "api";

function* buildingListWorker(action) {
  try {
    const res = yield api.post(`building/getBuildingById`, action.payload);
    yield put({ type: BUILDING_LIST_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* buildingListWatcher() {
  yield takeEvery(BUILDING_LIST_REQUEST, buildingListWorker);
}

function* buildingAddWorker(action) {
  //     const signInUser = yield call(signInUserWithEmailPasswordRequest, email, newpw);

  try {
    let res = yield api.post(`building/addBuilding`, action.payload);
    yield delay(1000);
    yield put({
      type: USER_GET_BY_ID_REQUEST,
      payload: { id: action.payload.user_id }
    });
    yield put({ type: BUILDING_ADD_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* buildingAddWatcher() {
  yield takeEvery(BUILDING_UPDATE_REQUEST, buildingAddWorker);
}

function* buildingUpdateWorker(action) {
  try {
    let res = yield api.put(`building/updateBuilding`, action.payload);
    yield put({ type: BUILDING_UPDATE_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* buildingUpdateWatcher() {
  yield takeEvery(BUILDING_UPDATE_REQUEST, buildingUpdateWorker);
}

function* buildingDeleteWorker(action) {
  let res = null;
  try {
    if (action.payload.id) {
      res = yield api.delete(`building/deleteBuilding?id=${action.payload.id}`);
      yield delay(1000);
      yield put({
        type: USER_GET_BY_ID_REQUEST,
        payload: { id: action.payload.user_id }
      });
    }
    yield put({ type: BUILDING_DELETE_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* buildingDeleteWatcher() {
  yield takeEvery(BUILDING_DELETE_REQUEST, buildingDeleteWorker);
}

export default function* rootSaga() {
  yield all([fork(buildingListWatcher)]);
  yield all([fork(buildingAddWatcher)]);
  yield all([fork(buildingDeleteWatcher)]);
}
