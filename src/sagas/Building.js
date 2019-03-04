import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  BUILDING_LIST_REQUEST,
  BUILDING_LIST_SUCCESS,
  BUILDING_LIST_FAIL
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

export default function* rootSaga() {
  yield all([fork(buildingListWatcher)]);
}
