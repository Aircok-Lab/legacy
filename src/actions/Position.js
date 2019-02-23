import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_SUCCESS,
  POSITION_LIST_FAIL
} from "constants/ActionTypes";

export const positionListRequest = payload => {
  return {
    type: POSITION_LIST_REQUEST,
    payload
  };
};
