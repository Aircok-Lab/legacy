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
  USER_PROFILE_REQUEST,
  USER_DELETE_REQUEST,
  SET_VIEW_MODE,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_FIND_USER_REQUEST,
  USER_FIND_PASSWORD_REQUEST,
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS
} from "constants/ActionTypes";
import forge from "node-forge";
import api from "api";
import { userSignInSuccess } from "actions/Auth";
import { setShowModal } from "actions/Setting";
import responseDataProcess from "util/responseDataProcess";
import toaster from "util/toaster";
import { setViewMode } from "actions/Setting";

function* userListByBuildingIdWorker(action) {
  try {
    // console.log("action.payload : ", action.payload);
    let res;
    if (action.payload.buildingID === "null") {
      res = yield api.get(`user/etcUser`);
    } else {
      res = yield api.post(`user/getUserByBuildingId`, action.payload);
    }
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

// 다른 사용자정보 변경
function* userUpdateWorker(action) {
  try {
    const postData = JSON.parse(JSON.stringify(action.payload));
    delete postData.plainTextPassword;
    delete postData.oldPassword;
    delete postData.newPassword;
    delete postData.newPasswordConfirm;

    const res = yield api.put(`user/modifyUser`, postData);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      delete postData.password;
      // console.log("userUpdate postData zzzzz", postData, action);
      if (action.isAuthUser) {
        localStorage.setItem("user_id", JSON.stringify(postData));
        yield put(userSignInSuccess(postData));
      }
      // localStorage.setItem("user_id", JSON.stringify(postData));
      // yield put(userSignInSuccess(postData));

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

// 내정보 변경
function* userProfileWorker(action) {
  try {
    const postData = JSON.parse(JSON.stringify(action.payload));
    delete postData.plainTextPassword;
    delete postData.oldPassword;
    delete postData.newPassword;
    delete postData.newPasswordConfirm;

    const res = yield api.put(`user/updateUser`, postData);
    if (responseDataProcess(res.data)) {
      toaster("적용하였습니다.", 3000, "bg-success");
      delete postData.password;
      if (postData.id === action.authUser.id) {
        localStorage.setItem("user_id", JSON.stringify(postData));
        yield put(userSignInSuccess(postData));
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
export function* userProfileWatcher() {
  yield takeEvery(USER_PROFILE_REQUEST, userProfileWorker);
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

function* userFindUserWorker(action) {
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
export function* userFindUserWatcher() {
  yield takeEvery(USER_FIND_USER_REQUEST, userFindUserWorker);
}

function* userFindPasswordWorker(action) {
  try {
    const res = yield api.post(`user/findPassword`, action.payload);
    if (responseDataProcess(res.data)) {
      alert(res.data.message);
    }
    yield put(push("/login"));
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userFindPasswordWatcher() {
  yield takeEvery(USER_FIND_PASSWORD_REQUEST, userFindPasswordWorker);
}

function* userInfoWorker(action) {
  try {
    const res = yield api.get(`user/getUserInfo?id=${action.payload}`);
    if (responseDataProcess(res.data)) {
      // yield put(setViewMode("update", res.data.data));
      yield put({
        type: USER_INFO_SUCCESS,
        payload: res.data.data.positionList
      });
    }
  } catch (error) {
    console.log("[ERROR#####]", error);
  }
}
export function* userInfoWatcher() {
  yield takeEvery(USER_INFO_REQUEST, userInfoWorker);
}

export default function* rootSaga() {
  yield all([fork(userListByBuildingIdWatcher)]);
  yield all([fork(userListByPositionIdWatcher)]);
  yield all([fork(userAddWatcher)]);
  yield all([fork(userUpdateWatcher)]);
  yield all([fork(userProfileWatcher)]);
  yield all([fork(userDeleteWatcher)]);
  yield all([fork(userChangePasswordWatcher)]);
  yield all([fork(userFindUserWatcher)]);
  yield all([fork(userFindPasswordWatcher)]);
  yield all([fork(userInfoWatcher)]);
}
