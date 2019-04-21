import { SMS_TOKEN_REQUEST, SEND_SMS, SEND_LMS } from "constants/ActionTypes";

export const smsTokenRequest = () => {
  return {
    type: SMS_TOKEN_REQUEST
  };
};

export const sendSMS = (deviceSN, positionID) => {
  return {
    type: SEND_SMS,
    deviceSN,
    positionID
  };
};

export const sendLMS = (deviceSN, positionID) => {
  return {
    type: SEND_LMS,
    deviceSN,
    positionID
  };
};
