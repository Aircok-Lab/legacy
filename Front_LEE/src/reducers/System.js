import { SYSTEM_LIST_SUCCESS } from "constants/ActionTypes";

const INIT_STATE = {
  data: [],
  items :[],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SYSTEM_LIST_SUCCESS: {
      return {
        ...state,
        data: action.payload[0]
      };
    }
    default:
      return state;
  }
};
