import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  RECENT_DATA_REQUEST,
  RECENT_DATA_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";
import { recentDataSuccess } from "actions/RecentData";
import { hideAuthLoader } from "actions/Auth";
import api from "api";

const getRecentDataRequest = async positionList =>
  await api
    .post("recentData/getRecentDataByPositionId", {
      positionID: positionList
    })
    .then(recentData => recentData)
    .catch(error => error);

function* getRecentDataWorker(payload) {
  console.dir(payload);
  const { positionList } = payload;
  try {
    const res = yield call(getRecentDataRequest, positionList);
    console.dir(res);
    yield put(recentDataSuccess(res.data.data));
    yield put(hideAuthLoader());
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* getRecentDataWatcher() {
  yield takeEvery(RECENT_DATA_REQUEST, getRecentDataWorker);
}

export default function* rootSaga() {
  yield all([fork(getRecentDataWatcher)]);
}
