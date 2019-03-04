import {
  BUILDING_LIST_REQUEST,
  BUILDING_ADD_REQUEST,
  BUILDING_UPDATE_REQUEST,
  BUILDING_DELETE_REQUEST
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
    type: BUILDING_ADD_REQUEST,
    payload
  };
};

export const buildingDeleteRequest = payload => {
  return {
    type: BUILDING_DELETE_REQUEST,
    payload
  };
};
