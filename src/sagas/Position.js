import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_BY_BUILDING_ID_REQUEST,
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
import api from "api";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* positionListWorker(action) {
  try {
    const res = yield api.post(`position/getPositionById`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({ type: POSITION_LIST_SUCCESS, payload: res.data.data });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionListWatcher() {
  yield takeEvery(POSITION_LIST_REQUEST, positionListWorker);
}

//http://115.178.65.141:13701/position/getPositionByBuildingId
function* positionListByBuildingIdWorker(action) {
  console.log("1111");
  try {
    const res = yield api.post(
      `position/getPositionByBuildingId`,
      action.payload
    );
    console.log("AAAA res: ", res);
    if (responseDataProcess(res.data)) {
      yield put({ type: POSITION_LIST_SUCCESS, payload: res.data.data });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionListByBuildingIdWatcher() {
  yield takeEvery(
    POSITION_LIST_BY_BUILDING_ID_REQUEST,
    positionListByBuildingIdWorker
  );
}

function* positionAddWorker(action) {
  try {
    let res = yield api.post(`position/addPosition`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      localStorage.setItem("user_id", JSON.stringify(res.data.data));
      yield put(userSignInSuccess(res.data.data));
      yield put({
        type: "POSITION_LIST_REQUEST",
        payload: { id: res.data.data.positionList }
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* positionAddWatcher() {
  yield takeEvery(POSITION_ADD_REQUEST, positionAddWorker);
}

function* positionUpdateWorker(action) {
  try {
    let res = yield api.put(`position/updatePosition`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({ type: POSITION_UPDATE_SUCCESS, payload: res.data.data });
      yield put({
        type: "POSITION_LIST_REQUEST",
        payload: { id: action.payload.positionList }
      });
    }
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
      toaster("적용하였습니다.", 3000, "bg-success");
      localStorage.setItem("user_id", JSON.stringify(res.data.data));
      yield put(userSignInSuccess(res.data.data));
      yield put({
        type: "POSITION_LIST_REQUEST",
        payload: { id: res.data.data.positionList }
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
  yield all([fork(positionListByBuildingIdWatcher)]);
  yield all([fork(positionAddWatcher)]);
  yield all([fork(positionUpdateWatcher)]);
  yield all([fork(positionDeleteWatcher)]);
}
