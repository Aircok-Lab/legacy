import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  OUTDOOR_DATA_REQUEST,
  OUTDOOR_DATA_SUCCESS,
  USER_PHONE_REQUEST,
  USER_PHONE_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";

const INIT_STATE = {
  allRecentData: [],
  outdoorData: [],
  userPhone: []
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
    case OUTDOOR_DATA_SUCCESS: {
      return {
        ...state,
        outdoorData: action.payload
      };
    }
    case USER_PHONE_SUCCESS: {
      return {
        ...state,
        userPhone: action.payload
      };
    }
    default:
      return state;
  }
};
