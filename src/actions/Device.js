import {
  DEVICE_LIST_BY_BUILDING_ID_REQUEST,
  DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_REQUEST,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS
} from "constants/ActionTypes";

export const deviceListByBuildingIdRequest = payload => {
  return {
    type: DEVICE_LIST_BY_BUILDING_ID_REQUEST,
    payload
  };
};

export const deviceListByPositionIdRequest = payload => {
  return {
    type: DEVICE_LIST_BY_POSITION_ID_REQUEST,
    payload
  };
};
