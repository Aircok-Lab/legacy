import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";

const INIT_STATE = {
  allRecentData: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ALL_RECENT_DATA_SUCCESS: {
      return {
        ...state,
        allRecentData: action.payload
      };
    }
    case MONITORING_RECENT_DATA_SUCCESS: {
      return {
        ...state,
        allRecentData: action.payload
      };
    }
    default:
      return state;
  }
};
