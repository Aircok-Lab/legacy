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
export function* productListWatcher() {
  yield takeEvery(PRODUCT_LIST_REQUEST, productListWorker);
}

function* productAddWorker(action) {
  try {
    const res = yield api.post(`product/addProduct`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: PRODUCT_LIST_REQUEST,
        // payload: { positionID: action.payload.positionID }
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
export function* productAddWatcher() {
  yield takeEvery(PRODUCT_ADD_REQUEST, productAddWorker);
}

function* productUpdateWorker(action) {
  try {
    const res = yield api.put(`product/updateProduct`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: PRODUCT_LIST_REQUEST,
        // payload: { positionID: action.payload.positionID }
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
export function* productUpdateWatcher() {
  yield takeEvery(PRODUCT_UPDATE_REQUEST, productUpdateWorker);
}

function* productDeleteWorker(action) {
  try {
    const res = yield api.delete(
      `product/deleteProduct?id=${action.payload.ids}`
    );
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: "PRODUCT_LIST_REQUEST",
        payload: { buildingID: "" + action.payload.node.id }
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* productDeleteWatcher() {
  yield takeEvery(PRODUCT_DELETE_REQUEST, productDeleteWorker);
}

export default function* rootSaga() {
  yield all([fork(productListWatcher)]);
  yield all([fork(productAddWatcher)]);
  yield all([fork(productUpdateWatcher)]);
  yield all([fork(productDeleteWatcher)]);
}
