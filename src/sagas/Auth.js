import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  SIGNIN_USER,
  SIGNOUT_USER,
  SIGNUP_USER,
  PUBLICKEY_REQUEST
} from "constants/ActionTypes";
import {
  showAuthMessage,
  userSignInSuccess,
  userSignOutSuccess,
  userSignUpSuccess,
  setInitUrl,
  publicKeySuccess
} from "actions/Auth";
import { alarmReferenceValueRequest } from "actions/AlarmReference";
import api from "api/index";
import forge from "node-forge";
import responseDataProcess from "util/responseDataProcess";
// const createUserWithEmailPasswordRequest = async (email, password) =>
//   await  auth.createUserWithEmailAndPassword(email, password)
//     .then(authUser => authUser)
//     .catch(error => error);

const signInUserWithEmailPasswordRequest = async (email, password) =>
  await api
    .post("user/login", {
      loginId: email,
      password: password
    })
    .then(authUser => authUser)
    .catch(error => error);

const signOutRequest = async () =>
  await api
    .get("user/logout")
    .then(authUser => authUser)
    .catch(error => error);

const publicKeyRequest = async () =>
  await api
    .get("user/pkey")
    .then(pkey => pkey)
    .catch(error => error);

// function* createUserWithEmailPassword({payload}) {
//   const {email, password} = payload;
//   try {
//     const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password);
//     if (signUpUser.message) {
//       yield put(showAuthMessage(signUpUser.message));
//     } else {
//       localStorage.setItem('user_id', signUpUser.user.uid);
//       yield put(userSignUpSuccess(signUpUser.user.uid));
//     }
//   } catch (error) {
//     yield put(showAuthMessage(error));
//   }
// }

function* signInUserWithEmailPassword({ payload }) {
  const { email, password, pkey } = payload;
  try {
    let publicKey = forge.pki.publicKeyFromPem(forge.util.encodeUtf8(pkey));
    let newpw = forge.util.encode64(
      publicKey.encrypt(forge.util.encodeUtf8(password), "RSA-OAEP")
    );
    const signInUser = yield call(
      signInUserWithEmailPasswordRequest,
      email,
      newpw
    );
    if (signInUser.message) {
      yield put(showAuthMessage(signInUser.message));
    } else {
      yield put(userSignInSuccess(signInUser.data.data));
      yield put(setInitUrl("/app/monitoring"));
      localStorage.setItem("user_id", JSON.stringify(signInUser.data.data));
      yield put(alarmReferenceValueRequest());
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser.data && signOutUser.data.statusCode === "OK") {
      localStorage.removeItem("user_id");
      yield put(userSignOutSuccess(signOutUser));
    } else {
      yield put(showAuthMessage(signOutUser.message));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* publicKey() {
  try {
    const pkey = yield call(publicKeyRequest);
    if (pkey.message) {
      yield put(showAuthMessage(pkey.message));
    } else {
      yield put(publicKeySuccess(pkey.data));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  //yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export function* getPublicKey() {
  yield takeEvery(PUBLICKEY_REQUEST, publicKey);
}

export default function* rootSaga() {
  yield all([
    fork(signInUser),
    fork(createUserAccount),
    fork(signOutUser),
    fork(getPublicKey)
  ]);
}
