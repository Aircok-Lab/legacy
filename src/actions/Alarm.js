import {
  ALARM_LIST_REQUEST,
  ALARM_UPDATE_REQUEST
} from "constants/ActionTypes";

export const alarmListRequest = payload => {
  return {
    type: ALARM_LIST_REQUEST,
    payload
  };
};

export const alarmUpdateRequest = payload => {
  return {
    type: ALARM_UPDATE_REQUEST,
    payload
  };
};
