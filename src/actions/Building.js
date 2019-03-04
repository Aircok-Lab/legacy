import {
  BUILDING_LIST_REQUEST,
  BUILDING_LIST_SUCCESS,
  BUILDING_LIST_FAIL
} from "constants/ActionTypes";

export const buildingListRequest = payload => {
  return {
    type: BUILDING_LIST_REQUEST,
    payload
  };
};
