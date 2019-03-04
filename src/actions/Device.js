import {
  DEVICE_LIST_BY_BUILDING_ID_REQUEST,
  DEVICE_LIST_BY_POSITION_ID_REQUEST,
  DEVICE_ADD_REQUEST,
  DEVICE_UPDATE_REQUEST,
  DEVICE_DELETE_REQUEST
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

export const deviceAddRequest = payload => {
  return {
    type: DEVICE_ADD_REQUEST,
    payload
  };
};

export const deviceUpdateRequest = payload => {
  return {
    type: DEVICE_ADD_REQUEST,
    payload
  };
};

export const deviceDeleteRequest = payload => {
  return {
    type: DEVICE_DELETE_REQUEST,
    payload
  };
};
