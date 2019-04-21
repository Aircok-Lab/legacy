import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  OUTDOOR_DUST_DATA_REQUEST,
  OUTDOOR_DUST_DATA_SUCCESS,
  OUTDOOR_WEATHER_DATA_REQUEST,
  OUTDOOR_WEATHER_DATA_SUCCESS,
  USER_PHONE_REQUEST,
  USER_PHONE_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";

export const allRecentDataRequest = positionList => {
  return {
    type: ALL_RECENT_DATA_REQUEST,
    positionList: positionList
  };
};

export const allRecentDataSuccess = allRecentData => {
  return {
    type: ALL_RECENT_DATA_SUCCESS,
    payload: allRecentData
  };
};

export const monitoringRecentDataRequest = deviceList => {
  return {
    type: MONITORING_RECENT_DATA_REQUEST,
    deviceList: deviceList
  };
};

export const monitoringRecentDataSuccess = allRecentData => {
  return {
    type: MONITORING_RECENT_DATA_SUCCESS,
    payload: allRecentData
  };
};

export const outdoorDustDataRequest = address => {
  return {
    type: OUTDOOR_DUST_DATA_REQUEST,
    address: address
  };
};

export const outdoorDustDataSuccess = outdoorDustData => {
  return {
    type: OUTDOOR_DUST_DATA_SUCCESS,
    payload: outdoorDustData
  };
};

export const outdoorWeatherDataRequest = address => {
  return {
    type: OUTDOOR_WEATHER_DATA_REQUEST,
    address: address
  };
};

export const outdoorWeatherDataSuccess = outdoorWeatherData => {
  return {
    type: OUTDOOR_WEATHER_DATA_SUCCESS,
    payload: outdoorWeatherData
  };
};

export const userPhoneRequest = deviceInfo => {
  return {
    type: USER_PHONE_REQUEST,
    deviceInfo: deviceInfo
  };
};

export const userPhoneSuccess = userPhone => {
  return {
    type: USER_PHONE_SUCCESS,
    payload: userPhone
  };
};
