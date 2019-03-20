import { all } from "redux-saga/effects";
import authSagas from "./Auth";
import buildingSagas from "./Building";
import positionSagas from "./Position";
import deviceSagas from "./Device";
import userSagas from "./User";
import productSagas from "./Product";
import systemSagas from "./System";
import sensorSagas from "./Sensor";

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    buildingSagas(),
    positionSagas(),
    deviceSagas(),
    userSagas(),
    productSagas(),
    systemSagas(),
    sensorSagas()
  ]);
}
