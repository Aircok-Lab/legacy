import { USER_GET_BY_ID_SUCCESS } from "constants/ActionTypes";

const INIT_STATE = {
  list: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case USER_GET_BY_ID_SUCCESS: {
      console.log("action", action);
      return {
        ...state,
        loader: false,
        user: action.payload
      };
    }
    default:
      return state;
  }
};
