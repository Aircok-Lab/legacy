import {
  RECENT_DATA_REQUEST,
  RECENT_DATA_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";

export const recentDataRequest = payload => {
  return {
    type: RECENT_DATA_REQUEST,
    payload
  };
};
