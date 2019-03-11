import { all } from "redux-saga/effects";
import authSagas from "./Auth";
import buildingSagas from "./Building";
import positionSagas from "./Position";
import deviceSagas from "./Device";
import alarmReferenceSagas from "./AlarmReference";

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    buildingSagas(),
    positionSagas(),
    deviceSagas(),
    alarmReferenceSagas()
  ]);
}
