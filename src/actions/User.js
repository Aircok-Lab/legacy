import {
  USER_LIST_BY_BUILDING_ID_REQUEST,
  USER_LIST_BY_POSITION_ID_REQUEST,
  USER_ADD_REQUEST,
  USER_UPDATE_REQUEST,
  USER_DELETE_REQUEST,
  USER_SET_ITEM
} from "constants/ActionTypes";

export const userListByBuildingIdRequest = payload => {
  return {
    type: USER_LIST_BY_BUILDING_ID_REQUEST,
    payload
  };
};

export const userListByPositionIdRequest = payload => {
  return {
    type: USER_LIST_BY_POSITION_ID_REQUEST,
    payload
  };
};

export const userAddRequest = payload => {
  return {
    type: USER_ADD_REQUEST,
    payload
  };
};

export const userUpdateRequest = (payload, authUser, pkey) => {
  return {
    type: USER_UPDATE_REQUEST,
    payload,
    authUser,
    pkey
  };
};

export const userDeleteRequest = payload => {
  return {
    type: USER_DELETE_REQUEST,
    payload
  };
};

export const userSetItem = payload => {
  return {
    type: USER_SET_ITEM,
    payload
  };
};
