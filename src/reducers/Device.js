import {
  DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS,
  DEVICE_ADD_SUCCESS,
  DEVICE_SET_ITEM
} from "constants/ActionTypes";

const INIT_STATE = {
  list: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case DEVICE_LIST_BY_BUILDING_ID_SUCCESS:
    case DEVICE_LIST_BY_POSITION_ID_SUCCESS: {
      const list = action.payload.map(item => {
        return {
          ...item,
          isChecked: false
        };
      });
      return {
        ...state,
        list
      };
    }
    case DEVICE_ADD_SUCCESS: {
      return {
        ...state,
        loader: false
      };
    }
    case DEVICE_SET_ITEM: {
      return {
        ...state,
        item: action.payload
      };
    }
    default:
      return state;
  }
};
