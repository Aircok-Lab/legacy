import { SYSTEM_ITEM_SUCCESS } from "constants/ActionTypes";

const INIT_STATE = {
  data: {}
};

export default (state = INIT_STATE, action) => {
  console.log("action", action);
  switch (action.type) {
    case SYSTEM_ITEM_SUCCESS: {
      return {
        ...state,
        data: action.payload[0]
      };
    }
    default:
      return state;
  }
};
