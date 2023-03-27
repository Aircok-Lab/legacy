import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_SUCCESS,
  POSITION_LIST_BY_BUILDING_ID_REQUEST,
  POSITION_ADD_REQUEST,
  POSITION_UPDATE_REQUEST,
  POSITION_DELETE_REQUEST,
  POSITION_CLEAR_CHECKED,
  POSITION_TOGGLE_CHECKED
} from "constants/ActionTypes";

export const positionClearChecked = payload => {
  return {
    type: POSITION_CLEAR_CHECKED,
    payload
  };
};

export const positionToggleChecked = payload => {
  return {
    type: POSITION_TOGGLE_CHECKED,
    payload
  };
};

export const positionListRequest = payload => {
  return {
    type: POSITION_LIST_REQUEST,
    payload
  };
};

export const positionListSuccess = payload => {
  return {
    type: POSITION_LIST_SUCCESS,
    payload
  };
};

export const positionListByBuildingIdRequest = payload => {
  return {
    type: POSITION_LIST_BY_BUILDING_ID_REQUEST,
    payload
  };
};

export const positionAddRequest = payload => {
  return {
    type: POSITION_ADD_REQUEST,
    payload
  };
};

export const positionUpdateRequest = payload => {
  return {
    type: POSITION_UPDATE_REQUEST,
    payload
  };
};

export const positionDeleteRequest = payload => {
  return {
    type: POSITION_DELETE_REQUEST,
    payload
  };
};
