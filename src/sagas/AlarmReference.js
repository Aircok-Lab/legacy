import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  ALARM_REFERENCE_VALUE_REQUEST,
  ALARM_REFERENCE_VALUE_SUCCESS,
  ALARM_REFERENCE_VALUE_FAIL
} from "constants/ActionTypes";
import { alarmReferenceValueSuccess } from "actions/AlarmReference";
import api from "api";

const getAlarmReferenceValueRequest = async () =>
  await api
    .post("AlarmTable/getAlarmValue")
    .then(alarmValue => alarmValue)
    .catch(error => error);

function* getAlarmReferenceValueWorker() {
  try {
    const res = yield call(getAlarmReferenceValueRequest);
    yield put(alarmReferenceValueSuccess(res.data.data));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* getAlarmReferenceValueWatcher() {
  yield takeEvery(ALARM_REFERENCE_VALUE_REQUEST, getAlarmReferenceValueWorker);
}

export default function* rootSaga() {
  yield all([fork(getAlarmReferenceValueWatcher)]);
}
