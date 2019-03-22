import {
  BUILDING_LIST_SUCCESS,
  BUILDING_ADD_SUCCESS,
  BUILDING_DELETE_SUCCESS,
  BUILDING_LOCATION_SUCCESS,
  BUILDING_LOCATION_RESET
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
      const list = action.payload.map(item => {
        return {
          ...item,
          nodeId: "" + item.id
        };
      });

      return {
        ...state,
        loader: false,
        list: list
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

    case BUILDING_LOCATION_SUCCESS: {
      return {
        ...state,
        location: action.payload.geometry.location,
        address: action.payload.formatted_address
      };
    }

    case BUILDING_LOCATION_RESET: {
      return {
        ...state,
        location: {},
        address: ""
      };
    }

    default:
      return state;
  }
};
