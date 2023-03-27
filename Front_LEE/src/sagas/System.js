import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  SYSTEM_LIST_REQUEST,
  SYSTEM_LIST_SUCCESS,
  SYSTEM_UPDATE_REQUEST, 
  UPDATE_IR_SETTING,
  GET_IR_SETTINGS,
  SET_VIEW_MODE,
  ADD_IR_SETTING,
  PRODUCT_LIST_SUCCESS 
} from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* systemItemWorker(action) {
  try {
    const res = yield api.post(`setting/getSettingById`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: SYSTEM_LIST_SUCCESS,
        payload: res.data.data
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* systemItemWatcher() {
  yield takeEvery(SYSTEM_LIST_REQUEST, systemItemWorker);
}

function* systemUpdateWorker(action) {
  try {
    const res = yield api.put(`setting/updateSetting`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
function* updateIrSettingBySnWorker(action) {
  try {
    const res = yield api.put(`setting/updateIrSetting`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: GET_IR_SETTINGS,
        payload: { serialNumber: action.payload.serialNumber }
      });
      yield put({
        type: SET_VIEW_MODE,
        payload: "list"
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
function* getIrSettingBySnWorker(action) {
  try {
    const res = yield api.get(`setting/getIrSettings`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: PRODUCT_LIST_SUCCESS,
        payload: res.data.data
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* deviceIRAddWorker(action) {
  try {
    const res = yield api.post(`setting/addIrSetting`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: GET_IR_SETTINGS,
        payload: { serialNumber: action.payload.serialNumber }
      });
      yield put({
        type: SET_VIEW_MODE,
        payload: "list"
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

export function* getIrSettingBySnWatcher() {
  yield takeEvery(GET_IR_SETTINGS, getIrSettingBySnWorker);
}


export function* addIrSettingWatcher() {
  yield takeEvery(ADD_IR_SETTING, deviceIRAddWorker);
}

export function* systemUpdateWatcher() {
  yield takeEvery(SYSTEM_UPDATE_REQUEST, systemUpdateWorker);
}

export function* updateIrSettingBySnWatcher() {
  yield takeEvery(UPDATE_IR_SETTING, updateIrSettingBySnWorker);
}

export default function* rootSaga() {
  yield all([fork(systemItemWatcher)]);
  yield all([fork(systemUpdateWatcher)]);
  yield all([fork(getIrSettingBySnWatcher)]);
  yield all([fork(updateIrSettingBySnWatcher)]);
  yield all([fork(addIrSettingWatcher)]);
}
