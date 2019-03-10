import { all } from "redux-saga/effects";
import authSagas from "./Auth";
import buildingSagas from "./Building";
import positionSagas from "./Position";
import deviceSagas from "./Device";
import userSagas from "./User";
import productSagas from "./Product";

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    buildingSagas(),
    positionSagas(),
    deviceSagas(),
    userSagas(),
    productSagas()
  ]);
}
