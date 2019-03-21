import {
  RECENT_DATA_REQUEST,
  RECENT_DATA_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";

export const recentDataRequest = positionList => {
  return {
    type: RECENT_DATA_REQUEST,
    positionList: positionList
  };
};

export const recentDataSuccess = recentData => {
  return {
    type: RECENT_DATA_SUCCESS,
    payload: recentData
  };
};
