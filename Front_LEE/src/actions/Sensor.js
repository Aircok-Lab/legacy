import {
  SENSOR_LIST_REQUEST,
  SENSOR_LIST_REQUEST1,
  SENSOR_MIN_UPDATE_REQUEST,
  SENSOR_MAX_UPDATE_REQUEST
} from "constants/ActionTypes";

export const sensorListRequest = payload => {
  return {
    type: SENSOR_LIST_REQUEST,
    payload
  };
};
export const sensorListRequest1 = payload => {
  return {
    type: SENSOR_LIST_REQUEST1,
    payload
  };
};

export const sensorMinUpdateRequest = payload => {
  return {
    type: SENSOR_MIN_UPDATE_REQUEST,
    payload
  };
};

export const sensorMaxUpdateRequest = payload => {
  return {
    type: SENSOR_MAX_UPDATE_REQUEST,
    payload
  };
};
