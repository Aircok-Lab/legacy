import {
  ALARM_REFERENCE_VALUE_REQUEST,
  ALARM_REFERENCE_VALUE_SUCCESS,
  ALARM_REFERENCE_VALUE_FAIL
} from "constants/ActionTypes";

export const alarmReferenceValueRequest = () => {
  return {
    type: ALARM_REFERENCE_VALUE_REQUEST
  };
};

export const alarmReferenceValueSuccess = alarmReferenceValue => {
  return {
    type: ALARM_REFERENCE_VALUE_SUCCESS,
    payload: alarmReferenceValue
  };
};
