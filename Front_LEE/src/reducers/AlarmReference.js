import {
  ALARM_REFERENCE_VALUE_REQUEST,
  ALARM_REFERENCE_VALUE_SUCCESS,
  ALARM_REFERENCE_VALUE_FAIL
} from "constants/ActionTypes";

const INIT_STATE = {
  alarmReferenceValue: {}
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ALARM_REFERENCE_VALUE_SUCCESS: {
      return {
        ...state,
        alarmReferenceValue: action.payload
      };
    }
    default:
      return state;
  }
};
