import {
  BUILDING_LIST_REQUEST,
  BUILDING_ADD_REQUEST,
  BUILDING_UPDATE_REQUEST,
  BUILDING_DELETE_REQUEST,
  BUILDING_LOCATION_REQUEST,
  BUILDING_LOCATION_RESET
} from "constants/ActionTypes";

export const buildingListRequest = payload => {
  return {
    type: BUILDING_LIST_REQUEST,
    payload
  };
};

export const buildingAddRequest = payload => {
  return {
    type: BUILDING_ADD_REQUEST,
    payload
  };
};

export const buildingUpdateRequest = payload => {
  return {
    type: BUILDING_UPDATE_REQUEST,
    payload
  };
};

export const buildingDeleteRequest = payload => {
  return {
    type: BUILDING_DELETE_REQUEST,
    payload
  };
};

export const buildingLocationRequest = payload => {
  return {
    type: BUILDING_LOCATION_REQUEST,
    payload
  };
};

export const buildingLocationReset = payload => {
  return {
    type: BUILDING_LOCATION_RESET,
    payload
  };
};
