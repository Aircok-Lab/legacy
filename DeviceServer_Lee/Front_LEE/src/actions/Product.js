import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_ADD_REQUEST,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_DELETE_REQUEST,
  DEVICE_YUL_LIST_REQUEST,
  DEVICE_YUL_UPDATE_REQUEST,
  DEVICE_YUL_DELETE_REQUEST,
  DEVICE_YUL_ADD_REQUEST,
  DEVICE_IR_ADD_REQUEST,
  DEVICE_IR_DELETE_REQUEST
} from "constants/ActionTypes";

export const productListRequest = payload => {
  return {
    type: PRODUCT_LIST_REQUEST,
    payload
  };
};

export const deviceYulListRequest = payload => {
  return {
    type: DEVICE_YUL_LIST_REQUEST,
    payload
  };
};

export const productAddRequest = payload => {
  return {
    type: PRODUCT_ADD_REQUEST,
    payload
  };
};

export const deviceYulAddRequest = payload => {
  return {
    type: DEVICE_YUL_ADD_REQUEST,
    payload
  };
};



export const productUpdateRequest = payload => {
  return {
    type: PRODUCT_UPDATE_REQUEST,
    payload
  };
};

export const deviceYulUpdateRequest = payload => {
  return {
    type: DEVICE_YUL_UPDATE_REQUEST,
    payload
  };
};

export const productDeleteRequest = payload => {
  return {
    type: PRODUCT_DELETE_REQUEST,
    payload
  };
};

export const deviceYulDeleteRequest = payload => {
  return {
    type: DEVICE_YUL_DELETE_REQUEST,
    payload
  };
};

export const deviceIrDeleteRequest = payload => {
  return {
    type: DEVICE_IR_DELETE_REQUEST,
    payload
  };
};
