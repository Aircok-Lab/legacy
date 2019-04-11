import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { SMS_TOKEN_REQUEST, SEND_SMS, SEND_LMS } from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* smsTokenWorker(action) {
  try {
    const res = yield api.post(`proxy/getToken`);
    if (responseDataProcess(res.data)) {
      console.log("[SUCCESS#####]");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* sendSMSWorker(action) {
  try {
    api.header;
    const res = yield api.post(`proxy/sendSMS`);
    if (responseDataProcess(res.data)) {
      toaster("SMS를 전송하였습니다.", 3000, "bg-success");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* sendLMSWorker(action) {
  try {
    const res = yield api.post(`proxy/sendLMS`);
    if (responseDataProcess(res.data)) {
      toaster("SMS를 전송하였습니다.", 3000, "bg-success");
    }
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
