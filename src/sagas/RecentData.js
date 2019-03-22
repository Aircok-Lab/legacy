import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";
import {
  allRecentDataSuccess,
  monitoringRecentDataSuccess
} from "actions/RecentData";
import { hideAuthLoader } from "actions/Auth";
import api from "api";

const getAllRecentDataRequest = async positionList =>
  await api
    .post("recentData/getRecentDataByPositionId", {
      positionID: positionList
    })
    .then(allRecentData => allRecentData)
    .catch(error => error);

const getMonitoringRecentDataRequest = async deviceList =>
  await api
    .post("recentData/getRecentDataByDeviceSN", {
      deviceSN: deviceList
    })
    .then(allRecentData => allRecentData)
    .catch(error => error);

function* getAllRecentDataWorker(payload) {
  console.dir(payload);
  const { positionList } = payload;
  try {
    const res = yield call(getAllRecentDataRequest, positionList);
    console.dir(res);
    yield put(allRecentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* getMonitoringRecentDataWorker(payload) {
  console.dir(payload);
  const { deviceList } = payload;
  try {
    const res = yield call(getMonitoringRecentDataRequest, deviceList);
    console.dir(res);
    yield put(monitoringRecentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

export function* getAllRecentDataWatcher() {
  yield takeEvery(ALL_RECENT_DATA_REQUEST, getAllRecentDataWorker);
}

export function* getMonitoringRecentDataWatcher() {
  yield takeEvery(
    MONITORING_RECENT_DATA_REQUEST,
    getMonitoringRecentDataWorker
  );
}

export default function* rootSaga() {
  yield all([
    fork(getAllRecentDataWatcher),
    fork(getMonitoringRecentDataWatcher)
  ]);
}
