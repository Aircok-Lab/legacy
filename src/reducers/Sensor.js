import { SENSOR_LIST_SUCCESS } from "constants/ActionTypes";

const INIT_STATE = {
  data: null
};

export default (state = INIT_STATE, action) => {
  console.log("Sensor reducer", action.payload);
  switch (action.type) {
    case SENSOR_LIST_SUCCESS: {
      return {
        ...state,
        data: action.payload
      };
    }
    default:
      return state;
  }
};
