import {
  ALARM_REFERENCE_VALUE_REQUEST,
  ALARM_REFERENCE_VALUE_SUCCESS,
  ALARM_REFERENCE_VALUE_FAIL
} from "constants/ActionTypes";

export const alarmReferenceValueRequest = payload => {
  return {
    type: ALARM_REFERENCE_VALUE_REQUEST,
    payload
  };
};
