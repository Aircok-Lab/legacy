import {
  POSITION_LIST_REQUEST,
  POSITION_ADD_REQUEST,
  POSITION_UPDATE_REQUEST,
  POSITION_DELETE_REQUEST
} from "constants/ActionTypes";

export const positionListRequest = payload => {
  return {
    type: POSITION_LIST_REQUEST,
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
    type: POSITION_ADD_REQUEST,
    payload
  };
};

export const positionDeleteRequest = payload => {
  return {
    type: POSITION_DELETE_REQUEST,
    payload
  };
};
