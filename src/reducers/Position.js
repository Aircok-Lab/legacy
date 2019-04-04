import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_SUCCESS,
  POSITION_LIST_FAIL,
  POSITION_LIST_BY_BUILDING_ID_SUCCESS
} from "constants/ActionTypes";

const INIT_STATE = {
  // loader: false,
  // alertMessage: '',
  // showMessage: false,
  // initURL: '',
  // authUser: localStorage.getItem('user_id'),
  // pkey:''
  list: [],
  listByBuildingId: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case POSITION_LIST_SUCCESS: {
      const list = action.payload.map(item => {
        return {
          ...item,
          nodeId: "" + item.buildingID + "-" + item.id
        };
      });
      return {
        ...state,
        loader: false,
        list: list
      };
    }
    //
    case POSITION_LIST_BY_BUILDING_ID_SUCCESS: {
      return {
        ...state,
        loader: false,
        positionListByBuildingId: action.payload
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
