import {
  SMS_TOKEN_REQUEST,
  SMS_TOKEN_SUCCESS,
  SEND_SMS,
  SEND_LMS
} from "constants/ActionTypes";

const INIT_STATE = {
  access_token: ""
};
console.log("INIT_STATE", INIT_STATE);

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SMS_TOKEN_SUCCESS: {
      return {
        ...state,
        access_token: action.payload
      };
    }
    default:
      return state;
  }
};
