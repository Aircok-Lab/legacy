import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_SUCCESS,
  POSITION_LIST_FAIL
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

export default function* rootSaga() {
  yield all([fork(positionListWatcher)]);
}
