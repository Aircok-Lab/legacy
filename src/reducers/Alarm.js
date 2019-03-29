import { ALARM_LIST_SUCCESS } from "constants/ActionTypes";

const INIT_STATE = {
  data: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ALARM_LIST_SUCCESS: {
      return {
        ...state,
        data: action.payload
      };
    }
    default:
      return state;
  }
};
