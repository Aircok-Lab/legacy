import {
  SYSTEM_LIST_REQUEST,
  SYSTEM_UPDATE_REQUEST
} from "constants/ActionTypes";

export const systemListRequest = payload => {
  return {
    type: SYSTEM_LIST_REQUEST,
    payload
  };
};

export const systemUpdateRequest = payload => {
  return {
    type: SYSTEM_UPDATE_REQUEST,
    payload
  };
};
