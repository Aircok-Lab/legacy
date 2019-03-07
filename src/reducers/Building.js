import {
  BUILDING_LIST_SUCCESS,
  BUILDING_ADD_SUCCESS,
  BUILDING_DELETE_SUCCESS
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
    case BUILDING_LIST_SUCCESS: {
      return {
        ...state,
        loader: false,
        list: action.payload
      };
    }
    case BUILDING_ADD_SUCCESS: {
      return {
        ...state,
        loader: false
        // list: action.payload
      };
    }
    case BUILDING_DELETE_SUCCESS: {
      return {
        ...state,
        loader: false
        // list: action.payload
      };
    }
    default:
      return state;
  }
};
