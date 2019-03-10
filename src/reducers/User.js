import {
  USER_LIST_BY_BUILDING_ID_SUCCESS,
  USER_LIST_BY_POSITION_ID_SUCCESS,
  USER_ADD_SUCCESS
} from "constants/ActionTypes";

const INIT_STATE = {
  list: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case USER_LIST_BY_BUILDING_ID_SUCCESS:
    case USER_LIST_BY_POSITION_ID_SUCCESS: {
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
    case USER_ADD_SUCCESS: {
      return {
        ...state,
        loader: false
      };
    }
    default:
      return state;
  }
};
