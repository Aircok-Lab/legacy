import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_SUCCESS,
  POSITION_LIST_FAIL
} from "constants/ActionTypes";

const INIT_STATE = {
  // loader: false,
  // alertMessage: '',
  // showMessage: false,
  // initURL: '',
  // authUser: localStorage.getItem('user_id'),
  // pkey:''
  list: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case POSITION_LIST_REQUEST: {
      // alert("REQUEST");
      return {
        ...state
        // loader: false,
        // authUser: action.payload
      };
    }
    case POSITION_LIST_SUCCESS: {
      // alert("SUCCESS");
      console.log("SUCCESS", action.payload);
      return {
        ...state,
        loader: false,
        list: action.payload
      };
    }
    case POSITION_LIST_FAIL: {
      return {
        ...state,
        initURL: action.payload
      };
    }
    default:
      return state;
  }
};
