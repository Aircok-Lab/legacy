import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Building from "./Building";
import Position from "./Position";
import Device from "./Device";
import AlarmReference from "./AlarmReference";
import RecentData from "./RecentData";

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  building: Building,
  position: Position,
  device: Device,
  alarmReference: AlarmReference,
  recentData: RecentData
});

export default reducers;
