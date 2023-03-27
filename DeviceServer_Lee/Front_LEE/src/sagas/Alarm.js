import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  ALARM_LIST_REQUEST,
  ALARM_LIST_SUCCESS,
  ALARM_UPDATE_REQUEST,
  ALARM_UPDATE_SUCCESS
} from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* alarmListWorker(action) {
  try {
    const res = yield api.post(`alarmtable/getAlarmValue`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: ALARM_LIST_SUCCESS,
        payload: res.data.data
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* alarmListWatcher() {
  yield takeEvery(ALARM_LIST_REQUEST, alarmListWorker);
}

function* alarmUpdateWorker(action) {
  try {
    const res = yield api.put(`alarmTable/updateAlarmValue`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* alarmUpdateWatcher() {
  yield takeEvery(ALARM_UPDATE_REQUEST, alarmUpdateWorker);
}

export default function* rootSaga() {
  yield all([fork(alarmListWatcher)]);
  yield all([fork(alarmUpdateWatcher)]);
}
