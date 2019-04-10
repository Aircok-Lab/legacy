import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Building from "./Building";
import Position from "./Position";
import Device from "./Device";
import User from "./User";
import Tree from "./Tree";
import Product from "./Product";
import System from "./System";
import Sensor from "./Sensor";
import Alarm from "./Alarm";
import AlarmReference from "./AlarmReference";
import RecentData from "./RecentData";
import SMS from "./SMS";

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  building: Building,
  position: Position,
  device: Device,
  user: User,
  tree: Tree,
  product: Product,
  system: System,
  sensor: Sensor,
  alarm: Alarm,
  alarmReference: AlarmReference,
  recentData: RecentData,
  sms: SMS
});

export default reducers;
