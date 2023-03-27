import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_DELETE_REQUEST,
  DEVICE_YUL_LIST_REQUEST,
  DEVICE_YUL_UPDATE_REQUEST,
  DEVICE_YUL_DELETE_REQUEST,
  DEVICE_YUL_ADD_REQUEST ,
  ADD_IR_SETTING,
  GET_IR_SETTINGS,
  DEVICE_IR_DELETE_REQUEST,
  SET_VIEW_MODE
} from "constants/ActionTypes";
import api from "api";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* productListWorker(action) {
  try {
    const res = yield api.get(`product/allProduct`, action.payload);
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
function* deviceYulListWorker(action) {
  try {
    const res = yield api.get(`device/getDeviceYulBySerailNumber`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: PRODUCT_LIST_SUCCESS,
        payload: res.data.data,
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}


export function* productListWatcher() {
  yield takeEvery(PRODUCT_LIST_REQUEST, productListWorker);
}
export function* deviceYulListWatcher() {
  yield takeEvery(DEVICE_YUL_LIST_REQUEST, deviceYulListWorker);
}

function* productAddWorker(action) {
  try {
    const formData = new FormData();
    if (action.payload.file) {
      formData.append("firmware", action.payload.file);
      const fileResult = yield api.post(`file/upload`, formData);
      console.log("fileResult.data", fileResult.data);
      action.payload.firmware = fileResult.data.data.filename;
      action.payload.filesize = fileResult.data.data.size;
    }
    const res = yield api.post(`product/addProduct`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: PRODUCT_LIST_REQUEST,
        payload: { positionID: action.payload.positionList }
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

function* deviceYulAddWorker(action) {
  try {
    const res = yield api.post(`device/addDeviceYul`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: DEVICE_YUL_LIST_REQUEST,
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
export function* productAddWatcher() {
  yield takeEvery(PRODUCT_ADD_REQUEST, productAddWorker);
}

export function* deviceYulAddWatcher() {
  yield takeEvery(DEVICE_YUL_ADD_REQUEST, deviceYulAddWorker);
}


function* productUpdateWorker(action) {
  try {
    const formData = new FormData();
    if (action.payload.file) {
      formData.append("firmware", action.payload.file);
      const fileResult = yield api.post(`file/upload`, formData);
      action.payload.firmware = fileResult.data.data.filename;
      action.payload.filesize = fileResult.data.data.size;
    }
    const res = yield api.put(`product/updateProduct`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: PRODUCT_LIST_REQUEST,
        payload: { positionID: action.payload.positionList }
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
function* deviceYulUpdateWorker(action) {
  try {
    const res = yield api.put(`device/updateDeviceYul`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: DEVICE_YUL_LIST_REQUEST,
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
export function* productUpdateWatcher() {
  yield takeEvery(PRODUCT_UPDATE_REQUEST, productUpdateWorker);
}
export function* deviceYulUpdateWatcher() {
  yield takeEvery(DEVICE_YUL_UPDATE_REQUEST, deviceYulUpdateWorker);
}

function* productDeleteWorker(action) {
  try {
    const res = yield api.delete(
      `product/deleteProduct?id=${action.payload.ids} `
    );
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: "PRODUCT_LIST_REQUEST",
        payload: { buildingID: "" + action.payload.node.id }
      });
      // yield put({
      //   type: SET_V0IEW_MODE,
      //   payload: "list"
      // });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

function* deviceYulDeleteWorker(action) {
  try {
    const res = yield api.delete(
      `device/deleteDeviceYul?id=${action.payload.ids}`
    );
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: "DEVICE_YUL_LIST_REQUEST",
        payload: { serialNumber: null}
      });
       
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}


function* deviceIrDeleteWorker(action) {
  try {
    const res = yield api.delete(
      `device/deleteIrDevice?id=${action.payload.ids}`
    );
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: "GET_IR_SETTINGS",
        payload: { serialNumber: null}
      });
       
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}

export function* deviceYulDeleteWatcher() {
  yield takeEvery(DEVICE_YUL_DELETE_REQUEST, deviceYulDeleteWorker);
}

export function* deviceIrDeleteWatcher() {
  yield takeEvery(DEVICE_IR_DELETE_REQUEST, deviceIrDeleteWorker);
}



export function* productDeleteWatcher() {
  yield takeEvery(PRODUCT_DELETE_REQUEST, productDeleteWorker);
}

export default function* rootSaga() {
  yield all([fork(productListWatcher)]);
  yield all([fork(productAddWatcher)]);
  yield all([fork(productUpdateWatcher)]);
  yield all([fork(productDeleteWatcher)]);
  yield all([fork(deviceYulListWatcher)]);
  yield all([fork(deviceYulUpdateWatcher)]);
  yield all([fork(deviceYulAddWatcher)]);
  yield all([fork(deviceYulDeleteWatcher)]);
  yield all([fork(deviceIrDeleteWatcher)]);
}
