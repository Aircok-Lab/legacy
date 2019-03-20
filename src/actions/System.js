import {
  SYSTEM_ITEM_REQUEST,
  SYSTEM_UPDATE_REQUEST
} from "constants/ActionTypes";

export const systemItemRequest = payload => {
  return {
    type: SYSTEM_ITEM_REQUEST,
    payload
  };
};

export const systemUpdateRequest = payload => {
  return {
    type: SYSTEM_UPDATE_REQUEST,
    payload
  };
};
