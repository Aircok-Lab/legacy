import {
  SYSTEM_LIST_REQUEST,
  SYSTEM_UPDATE_REQUEST,
  UPDATE_IR_SETTING,
  ADD_IR_SETTING,
  GET_IR_SETTINGS
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


// ------------------
export const updateIrSetting = payload => {
  return {
    type: UPDATE_IR_SETTING,
    payload
  };
};

export const getIrSettings = (payload) => {
  return {
    type: GET_IR_SETTINGS,
    payload,
  };
};

export const addIrSetting = payload => {
  return {
    type: ADD_IR_SETTING,
    payload
  };
};
// ------------------
