import {
  LIST_MEASURE,
  VIEW_MEASURE,
  DELETE_MEASURE,
  SAVE_MEASURE,
  LIST_MEASURE_DEVICE_BASIC,
  LIST_MEASURE_ALARM,
  LIST_MEASURE_BASIC,
  LIST_MEASURE_43,
  LIST_MEASURE_43_2,
  LIST_MEASURE_43_3,
  LIST_MEASURE_HISTORY,
  RESET_MEASURE_HISTORY,
  LIST_MEASURE_DEVICESTATUS,
  GET_KMA_DATA,
  GET_AIRKOREA_DATA
} from "constants/ActionTypes";

export const listMeasure = payload => {
  return {
    type: LIST_MEASURE,
    payload
  };
};

export const listMeasureAlarm = payload => {
  return {
    type: LIST_MEASURE_ALARM,
    payload
  };
};

export const listMeasure43 = payload => {
  return {
    type: LIST_MEASURE_43,
    payload
  };
};

export const listMeasure432 = payload => {
  return {
    type: LIST_MEASURE_43_2,
    payload
  };
};

export const listMeasure433 = payload => {
  return {
    type: LIST_MEASURE_43_3,
    payload
  };
};

export const viewMeasure = payload => {
  return {
    type: VIEW_MEASURE,
    payload
  };
};

export const deleteMeasure = payload => {
  return {
    type: DELETE_MEASURE,
    payload
  };
};

export const saveMeasure = payload => {
  return {
    type: SAVE_MEASURE,
    payload
  };
};

export const resetMeasureHistory = payload => {
  return {
    type: RESET_MEASURE_HISTORY,
    payload
  };
};

export const listMeasureHistory = payload => {
  return {
    type: LIST_MEASURE_HISTORY,
    payload
  };
};

export const listMeasureBasic = payload => {
  return {
    type: LIST_MEASURE_BASIC,
    payload
  };
};

export const listMeasureDeviceBasic = payload => {
  return {
    type: LIST_MEASURE_DEVICE_BASIC,
    payload
  };
};

export const listMeasureDeviceStatus = payload => {
  return {
    type: LIST_MEASURE_DEVICESTATUS,
    payload
  };
};

export const getKmaData = payload => {
  return {
    type: GET_KMA_DATA,
    payload
  };
};

export const getAirkoreaData = payload => {
  return {
    type: GET_AIRKOREA_DATA,
    payload
  };
};
