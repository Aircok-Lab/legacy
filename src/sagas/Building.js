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
  BUILDING_LOCATION_REQUEST,
  BUILDING_LOCATION_SUCCESS,
  USER_GET_BY_ID_REQUEST
} from "constants/ActionTypes";
import { userSignInSuccess } from "actions/Auth";
import responseDataProcess from "util/responseDataProcess";

import api from "api";

function* buildingListWorker(action) {
  try {
    const res = yield api.post(`building/getBuildingById`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({ type: BUILDING_LIST_SUCCESS, payload: res.data.data });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* buildingListWatcher() {
  yield takeEvery(BUILDING_LIST_REQUEST, buildingListWorker);
}

function* buildingAddWorker(action) {
  try {
    let res = yield api.post(`building/addBuilding`, action.payload);
    if (responseDataProcess(res.data)) {
      localStorage.setItem("user_id", JSON.stringify(res.data.data));
      yield put(userSignInSuccess(res.data.data));
      yield put({
        type: BUILDING_LIST_REQUEST,
        payload: { id: res.data.data.buildingList }
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

export function* buildingAddWatcher() {
  yield takeEvery(BUILDING_ADD_REQUEST, buildingAddWorker);
}

function* buildingUpdateWorker(action) {
  try {
    let res = yield api.put(`building/updateBuilding`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({ type: BUILDING_UPDATE_SUCCESS, payload: res.data.data });
      yield put({
        type: BUILDING_LIST_REQUEST,
        payload: { id: action.payload.buildingList }
      });
    }
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
    res = yield api.delete(
      `building/deleteBuilding?id=${action.payload.id}&userID=${
        action.payload.userID
      }`
    );
    if (responseDataProcess(res.data)) {
      localStorage.setItem("user_id", JSON.stringify(res.data.data));
      yield put(userSignInSuccess(res.data.data));
      yield put({
        type: BUILDING_LIST_REQUEST,
        payload: { id: res.data.data.buildingList }
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* buildingDeleteWatcher() {
  yield takeEvery(BUILDING_DELETE_REQUEST, buildingDeleteWorker);
}

function* buildingLocationWorker(action) {
  const res = yield fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAGuzyxaRGQvhdMnjtxjdImEWO4zWOYKAE&language=ko&region=KR&address=${
      action.payload
    }`
  ).then(response => response.json());
  yield put({
    type: BUILDING_LOCATION_SUCCESS,
    payload: res.results[0]
  });
  try {
  } catch (e) {
    console.log("Error at fetching googlemaps location.");
    return;
  }
}
export function* buildingLocationWatcher() {
  yield takeEvery(BUILDING_LOCATION_REQUEST, buildingLocationWorker);
}

export default function* rootSaga() {
  yield all([fork(buildingListWatcher)]);
  yield all([fork(buildingAddWatcher)]);
  yield all([fork(buildingUpdateWatcher)]);
  yield all([fork(buildingDeleteWatcher)]);
  yield all([fork(buildingLocationWatcher)]);
}
