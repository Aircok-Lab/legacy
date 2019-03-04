import { USER_GET_BY_ID_REQUEST } from "constants/ActionTypes";

export const userGetByIdRequest = payload => {
  return {
    type: USER_GET_BY_ID_REQUEST,
    payload
  };
};
