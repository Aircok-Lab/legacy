import {
  SENSOR_ITEM_REQUEST,
  SENSOR_UPDATE_REQUEST
} from "constants/ActionTypes";

export const sensorItemRequest = payload => {
  return {
    type: SENSOR_ITEM_REQUEST,
    payload
  };
};

export const sensorUpdateRequest = payload => {
  return {
    type: SENSOR_UPDATE_REQUEST,
    payload
  };
};
