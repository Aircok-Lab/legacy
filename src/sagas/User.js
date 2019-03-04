import { push } from "react-router-redux";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  USER_GET_BY_ID_REQUEST,
  USER_GET_BY_ID_SUCCESS
} from "constants/ActionTypes";
import { userSignInSuccess } from "actions/Auth";

import api from "api";

function* userGetByIdWorker(action) {
  try {
    const res = yield api.get(`users/getUserById?id=${action.payload.id}`);
    yield put({ type: USER_GET_BY_ID_SUCCESS, payload: res.data.data });
    localStorage.setItem("user_id", JSON.stringify(res.data.data));
    yield put(userSignInSuccess(res.data.data));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userGetByIdWatcher() {
  yield takeEvery(USER_GET_BY_ID_REQUEST, userGetByIdWorker);
}

export default function* rootSaga() {
  yield all([fork(userGetByIdWatcher)]);
}
