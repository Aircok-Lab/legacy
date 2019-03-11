import { all } from "redux-saga/effects";
import authSagas from "./Auth";
import buildingSagas from "./Building";
import positionSagas from "./Position";
import deviceSagas from "./Device";
import alarmReferenceSagas from "./AlarmReference";
import recentDataSagas from "./RecentData";

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    buildingSagas(),
    positionSagas(),
    deviceSagas(),
    alarmReferenceSagas(),
    recentDataSagas()
  ]);
}
