import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_ADD_REQUEST,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_DELETE_REQUEST
} from "constants/ActionTypes";

export const productListRequest = payload => {
  return {
    type: PRODUCT_LIST_REQUEST,
    payload
  };
};

export const productAddRequest = payload => {
  return {
    type: PRODUCT_ADD_REQUEST,
    payload
  };
};

export const productUpdateRequest = payload => {
  return {
    type: PRODUCT_UPDATE_REQUEST,
    payload
  };
};

export const productDeleteRequest = payload => {
  return {
    type: PRODUCT_DELETE_REQUEST,
    payload
  };
};
