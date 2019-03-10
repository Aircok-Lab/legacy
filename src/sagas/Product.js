import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_DELETE_REQUEST
} from "constants/ActionTypes";
import api from "api";

function* productListWorker(action) {
  try {
    const res = yield api.get(`product/allProduct`, action.payload);
    yield put({
      type: PRODUCT_LIST_SUCCESS,
      payload: res.data.data
    });
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
    yield put({
      type: PRODUCT_LIST_REQUEST,
      // payload: { positionID: action.payload.positionID }
      payload: { positionID: action.payload.positionlist }
    });
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* productAddWatcher() {
  yield takeEvery(PRODUCT_ADD_REQUEST, productAddWorker);
}

function* productDeleteWorker(action) {
  try {
    const res = yield api.delete(
      `product/deleteProduct?id=${action.payload.ids}`
    );
    console.log("product delete - action.payload :", action.payload);
    yield put({
      type: "PRODUCT_LIST_REQUEST",
      payload: { buildingID: "" + action.payload.node.id }
    });
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
  yield all([fork(productDeleteWatcher)]);
}
