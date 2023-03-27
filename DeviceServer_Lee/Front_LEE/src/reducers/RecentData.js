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
  RECENT_DATA_FAIL,
  GET_TOTAL_COMMENT
} from "constants/ActionTypes";

const INIT_STATE = {
  allRecentData: [],
  allTimeRecentData: [],
  outdoorDustData: [],
  outdoorWeatherData: [],
  chartData: [],
  deviceData:[],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ALL_RECENT_DATA_SUCCESS: {
      return {
        ...state,
        allRecentData: action.payload
      };
    }
    case ALL_TIME_RECENT_DATA_SUCCESS: {
      return {
        ...state,
        allTimeRecentData: action.payload
      };
    }
    case MONITORING_RECENT_DATA_SUCCESS: {
      return {
        ...state,
        allRecentData: action.payload
      };
    }
    case TIME_MONITORING_RECENT_DATA_SUCCESS: {
      return {
        ...state,
        allTimeRecentData: action.payload
      };
    }
    case OUTDOOR_DUST_DATA_SUCCESS: {
      return {
        ...state,
        outdoorDustData: action.payload
      };
    }
    case OUTDOOR_WEATHER_DATA_SUCCESS: {
      return {
        ...state,
        outdoorWeatherData: action.payload
      };
    }
    case CHART_DATA_SUCCESS: {
      return {
        ...state,
        chartData: action.payload
      };
    }
    case GET_TOTAL_COMMENT: {
      return {
        ...state,
        deviceData: action.payload
      };
    }
    default:
      return state;
  }
};
