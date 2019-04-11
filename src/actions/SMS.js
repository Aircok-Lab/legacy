import { SMS_TOKEN_REQUEST, SEND_SMS, SEND_LMS } from "constants/ActionTypes";

export const smsTokenRequest = () => {
  return {
    type: SMS_TOKEN_REQUEST
  };
};

export const sendSMS = payload => {
  return {
    type: SEND_SMS,
    payload
  };
};

export const sendLMS = payload => {
  return {
    type: SEND_LMS,
    payload
  };
};
