import {
  DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS
} from "constants/ActionTypes";

const INIT_STATE = {
  list: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case DEVICE_LIST_BY_BUILDING_ID_SUCCESS: {
      return {
        ...state,
        list: action.payload
      };
    }
    case DEVICE_LIST_BY_POSITION_ID_SUCCESS: {
      return {
        ...state,
        list: action.payload
      };
    }
    default:
      return state;
  }
};
