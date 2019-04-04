import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  OUTDOOR_DATA_REQUEST,
  OUTDOOR_DATA_SUCCESS,
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

export const outdoorDataRequest = address => {
  return {
    type: OUTDOOR_DATA_REQUEST,
    address: address
  };
};

export const outdoorDataSuccess = outdoorData => {
  return {
    type: OUTDOOR_DATA_SUCCESS,
    payload: outdoorData
  };
};
