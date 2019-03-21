import {
  RECENT_DATA_REQUEST,
  RECENT_DATA_SUCCESS,
  RECENT_DATA_FAIL
} from "constants/ActionTypes";

const INIT_STATE = {
  contactData: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case RECENT_DATA_SUCCESS: {
      return {
        ...state,
        contactData: action.payload
      };
    }
    default:
      return state;
  }
};
