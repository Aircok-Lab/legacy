import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  SMS_TOKEN_REQUEST,
  SMS_TOKEN_SUCCESS,
  SEND_SMS,
  SEND_LMS
} from "constants/ActionTypes";
// import forge from "node-forge";
import api from "apiSMS";
// import { userSignInSuccess } from "actions/SMS";
// import { setShowModal } from "actions/Setting";
// import responseDataProcess from "util/responseDataProcess";
// import toaster from "util/toaster";

function* smsTokenWorker(action) {
  try {
    const res = yield api.post(`oauth/token`, {
      grant_type: "client_credentials"
    });
    if (responseDataProcess(res.data)) {
      console.dir(res.data);
    }
    //yield put(smsTokenSuccess("/login"));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* sendSMSWorker(action) {
  try {
    api.header;
    const res = yield api.post(`user/findUser`, action.payload);
    if (responseDataProcess(res.data)) {
      alert("로그인아이디 : " + res.data.data[0].loginID);
    }
    yield put(push("/login"));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* sendLMSWorker(action) {
  try {
    const res = yield api.post(`user/findUser`, action.payload);
    if (responseDataProcess(res.data)) {
      alert("로그인아이디 : " + res.data.data[0].loginID);
    }
    yield put(push("/login"));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

export function* smsTokenWatcher() {
  yield takeEvery(SMS_TOKEN_REQUEST, smsTokenWorker);
}

export function* sendSMSWatcher() {
  yield takeEvery(SEND_SMS, sendSMSWorker);
}

export function* sendLMSWatcher() {
  yield takeEvery(SEND_LMS, sendLMSWorker);
}

export default function* rootSaga() {
  yield all([fork(smsTokenWatcher)]);
  yield all([fork(sendSMSWatcher)]);
  yield all([fork(sendLMSWatcher)]);
}
