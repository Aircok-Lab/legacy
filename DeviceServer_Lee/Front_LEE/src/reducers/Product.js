import {
  PRODUCT_LIST_SUCCESS,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_LIST_SUCCESS1
} from "constants/ActionTypes";

const INIT_STATE = {
  list: [],
  posts:[]
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case PRODUCT_LIST_SUCCESS:
    case PRODUCT_LIST_SUCCESS1:  
    {
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
    case PRODUCT_ADD_SUCCESS: {
      return {
        ...state,
        loader: false
      };
    }
    default:
      return state;
  }
};
