import {
  SENSOR_LIST_REQUEST,
  SENSOR_UPDATE_REQUEST
} from "constants/ActionTypes";

export const sensorListRequest = payload => {
  return {
    type: SENSOR_LIST_REQUEST,
    payload
  };
};

export const sensorUpdateRequest = payload => {
  return {
    type: SENSOR_UPDATE_REQUEST,
    payload
  };
};
