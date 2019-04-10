import {
  SMS_TOKEN_REQUEST,
  SMS_TOKEN_SUCCESS,
  SEND_SMS,
  SEND_LMS
} from "constants/ActionTypes";

export const smsTokenRequest = () => {
  return {
    type: SMS_TOKEN_REQUEST
  };
};

export const smsTokenSuccess = payload => {
  return {
    type: SMS_TOKEN_SUCCESS,
    payload
  };
};

export const sendSMS = payload => {
  return {
    type: SEND_SMS,
    payload
  };
};

export const sndLMS = payload => {
  return {
    type: SEND_LMS,
    payload
  };
};
