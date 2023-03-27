import {
  DEVICE_LIST_BY_BUILDING_ID_REQUEST,
  DEVICE_LIST_BY_POSITION_ID_REQUEST,
  DEVICE_LIST_BY_POSITION_ID_REQUEST1,
  DEVICE_LIST_SET,
  DEVICE_ADD_REQUEST,
  DEVICE_UPDATE_REQUEST,
  DEVICE_DELETE_REQUEST,
  DEVICE_SET_ITEM,
  DEVICE_GET_ALL_BY_POSITION_ID_REQUEST,
  GET_DEVICE_YUL_BY_SERAILNUMBER,
  DEVICE_ADD_REQUEST1 
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

export const getBuildingListByVer12 = payload => {
  return {
    type: DEVICE_LIST_BY_POSITION_ID_REQUEST1,
    payload
  };
};

export const deviceListSet = payload => {
  return {
    type: DEVICE_LIST_SET,
    payload
  };
};

export const deviceAddRequest = payload => {
  return {
    type: DEVICE_ADD_REQUEST,
    payload
  };
};

export const deviceAddRequest1 = payload => {
  return {
    type: DEVICE_ADD_REQUEST1,
    payload
  };
};

export const deviceUpdateRequest = payload => {
  return {
    type: DEVICE_UPDATE_REQUEST,
    payload
  };
};


export const deviceDeleteRequest = payload => {
  return {
    type: DEVICE_DELETE_REQUEST,
    payload
  };
};

export const deviceSetItem = payload => {
  return {
    type: DEVICE_SET_ITEM,
    payload
  };
};

export const deviceGetAllByPositionIdRequest = payload => {
  return {
    type: DEVICE_GET_ALL_BY_POSITION_ID_REQUEST,
    payload
  };
};

export const getDeviceYulBySerailNumber = payload => {
  return {
    type: GET_DEVICE_YUL_BY_SERAILNUMBER,
    payload
  };
};