import {
  ALL_RECENT_DATA_REQUEST,
  ALL_RECENT_DATA_SUCCESS,
  ALL_TIME_RECENT_DATA_REQUEST,
  ALL_TIME_RECENT_DATA_SUCCESS,
  MONITORING_RECENT_DATA_REQUEST,
  MONITORING_RECENT_DATA_SUCCESS,
  TIME_MONITORING_RECENT_DATA_REQUEST,
  TIME_MONITORING_RECENT_DATA_SUCCESS,
  OUTDOOR_DUST_DATA_REQUEST,
  OUTDOOR_DUST_DATA_SUCCESS,
  OUTDOOR_WEATHER_DATA_REQUEST,
  OUTDOOR_WEATHER_DATA_SUCCESS,
  CHART_DATA_REQUEST,
  CHART_DATA_SUCCESS,
  TIME_MONITORING_RECENT_DATA_REQUEST1,
  TIME_MONITORING_RECENT_DATA_SUCCESS1,
  RECENT_DATA_FAIL,
  GET_TOTAL_COMMENT,
  GET_TOTAL_COMMENT_SUCCESS
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
export const allTimeRecentDataRequest = buildingList => {
  return {
    type: ALL_TIME_RECENT_DATA_REQUEST,
    buildingList: buildingList
  };
};
export const allTimeRecentDataSuccess = allTimeRecentData => {
  return {
    type: ALL_TIME_RECENT_DATA_SUCCESS,
    payload: allTimeRecentData
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
///
export const timeMonitoringRecentDataRequest = buildingId => {
  return {
    type: TIME_MONITORING_RECENT_DATA_REQUEST,
    buildingId: buildingId
  };
};
export const timeMonitoringRecentDataSuccess = allTimeRecentData => {
  return {
    type: TIME_MONITORING_RECENT_DATA_SUCCESS,
    payload: allTimeRecentData
  };
};
export const getTotalCommentSuccess = deviceData => {
  return {
    type: GET_TOTAL_COMMENT_SUCCESS,
    payload: deviceData
  };
};
// -----------------------
export const timeMonitoringRecentDataRequest1 = serialNumber => {
  return {
    type: TIME_MONITORING_RECENT_DATA_REQUEST1,
    serialNumber: serialNumber
  };
};
export const timeMonitoringRecentDataSuccess1 = allTimeRecentData => {
  return {
    type: TIME_MONITORING_RECENT_DATA_SUCCESS1,
    payload: allTimeRecentData
  };
};
// -----------------------
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

export const chartDataRequest = deviceInfo => {
  return {
    type: CHART_DATA_REQUEST,
    deviceInfo: deviceInfo
  };
};

export const chartDataSuccess = chartData => {
  return {
    type: CHART_DATA_SUCCESS,
    payload: chartData
  };
};

export const getTotalComment = deviceData => {
  return {
    type: GET_TOTAL_COMMENT,
    deviceData: deviceData
  };
};

