import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  SYSTEM_ITEM_REQUEST,
  SYSTEM_ITEM_SUCCESS,
  SYSTEM_UPDATE_REQUEST,
  SYSTEM_UPDATE_SUCCESS
} from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";

function* systemItemWorker(action) {
  try {
    const res = yield api.post(`setting/getSettingById`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: SYSTEM_ITEM_SUCCESS,
        payload: res.data.data
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* systemItemWatcher() {
  yield takeEvery(SYSTEM_ITEM_REQUEST, systemItemWorker);
}

function* systemUpdateWorker(action) {
  try {
    const res = yield api.put(`setting/updateSetting`, action.payload);
    if (responseDataProcess(res.data)) {
      // yield put({
      //   type: SYSTEM_UPDATE_SUCCESS,
      //   payload: res.data.data
      // });
      alert("변경사항을 저장하였습니다.");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* systemUpdateWatcher() {
  yield takeEvery(SYSTEM_UPDATE_REQUEST, systemUpdateWorker);
}

export default function* rootSaga() {
  yield all([fork(systemItemWatcher)]);
  yield all([fork(systemUpdateWatcher)]);
}
