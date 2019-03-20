import { SENSOR_ITEM_SUCCESS } from "constants/ActionTypes";

const INIT_STATE = {
  data: {}
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SENSOR_ITEM_SUCCESS: {
      return {
        ...state,
        data: action.payload
      };
    }
    default:
      return state;
  }
};
