import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  USER_LIST_BY_BUILDING_ID_REQUEST,
  USER_LIST_BY_BUILDING_ID_SUCCESS,
  USER_LIST_BY_POSITION_ID_REQUEST,
  USER_LIST_BY_POSITION_ID_SUCCESS,
  USER_ADD_REQUEST,
  USER_ADD_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_DELETE_REQUEST,
  SET_VIEW_MODE,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS
} from "constants/ActionTypes";
import forge from "node-forge";
import api from "api";
import { userSignInSuccess } from "actions/Auth";
import { setShowModal } from "actions/Setting";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";

function* userListByBuildingIdWorker(action) {
  try {
    const res = yield api.post(`user/getUserByBuildingId`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: USER_LIST_BY_BUILDING_ID_SUCCESS,
        payload: res.data.data
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userListByBuildingIdWatcher() {
  yield takeEvery(USER_LIST_BY_BUILDING_ID_REQUEST, userListByBuildingIdWorker);
}

function* userListByPositionIdWorker(action) {
  try {
    const res = yield api.post(`user/getUserByPositionId`, action.payload);
    if (responseDataProcess(res.data)) {
      yield put({
        type: USER_LIST_BY_POSITION_ID_SUCCESS,
        payload: res.data.data
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userListByPositionIdWatcher() {
  yield takeEvery(USER_LIST_BY_POSITION_ID_REQUEST, userListByPositionIdWorker);
}

function* userAddWorker(action) {
  try {
    const res = yield api.post(`user/addUser`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put({
        type: USER_LIST_BY_POSITION_ID_REQUEST,
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
export function* userAddWatcher() {
  yield takeEvery(USER_ADD_REQUEST, userAddWorker);
}

function* userUpdateWorker(action) {
  try {
    console.log("action newpw: ", action.payload);
    let publicKey = forge.pki.publicKeyFromPem(
      forge.util.encodeUtf8(action.pkey)
    );
    let newpw = forge.util.encode64(
      publicKey.encrypt(
        forge.util.encodeUtf8(action.payload.password),
        "RSA-OAEP"
      )
    );

    action.payload.password = newpw;

    const res = yield api.put(`user/updateUser`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      if (action.payload.id === action.authUser.id) {
        localStorage.setItem("user_id", JSON.stringify(action.payload));
        yield put(userSignInSuccess(action.payload));
      }
      yield put({
        type: SET_VIEW_MODE,
        payload: "list"
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userUpdateWatcher() {
  yield takeEvery(USER_UPDATE_REQUEST, userUpdateWorker);
}

function* userDeleteWorker(action) {
  try {
    const res = yield api.delete(`user/deleteUser?id=${action.payload.ids}`);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      if (action.payload.node.buildingID) {
        yield put({
          type: "USER_LIST_BY_POSITION_ID_REQUEST",
          payload: { positionID: "" + action.payload.node.id }
        });
      } else {
        yield put({
          type: "USER_LIST_BY_BUILDING_ID_REQUEST",
          payload: { buildingID: "" + action.payload.node.id }
        });
      }
      yield put({
        type: SET_VIEW_MODE,
        payload: "list"
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userDeleteWatcher() {
  yield takeEvery(USER_DELETE_REQUEST, userDeleteWorker);
}

function* userChangePasswordWorker(action) {
  console.log("action.payload", action.payload);

  try {
    let oldPublicKey = forge.pki.publicKeyFromPem(
      forge.util.encodeUtf8(action.payload.pkey)
    );
    let oldPassword = forge.util.encode64(
      oldPublicKey.encrypt(
        forge.util.encodeUtf8(action.payload.oldPassword),
        "RSA-OAEP"
      )
    );
    action.payload.oldPassword = oldPassword;

    const newPasswordInput = action.payload.newPassword;

    let newPublicKey = forge.pki.publicKeyFromPem(
      forge.util.encodeUtf8(action.payload.pkey)
    );
    let newPassword = forge.util.encode64(
      newPublicKey.encrypt(
        forge.util.encodeUtf8(action.payload.newPassword),
        "RSA-OAEP"
      )
    );
    action.payload.newPassword = newPassword;

    const res = yield api.put(`user/changePassword`, action.payload);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      yield put(setShowModal(false));
      yield put({
        type: USER_CHANGE_PASSWORD_SUCCESS,
        payload: newPasswordInput
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userChangePasswordWatcher() {
  yield takeEvery(USER_CHANGE_PASSWORD_REQUEST, userChangePasswordWorker);
}

export default function* rootSaga() {
  yield all([fork(userListByBuildingIdWatcher)]);
  yield all([fork(userListByPositionIdWatcher)]);
  yield all([fork(userAddWatcher)]);
  yield all([fork(userUpdateWatcher)]);
  yield all([fork(userDeleteWatcher)]);
  yield all([fork(userChangePasswordWatcher)]);
}
