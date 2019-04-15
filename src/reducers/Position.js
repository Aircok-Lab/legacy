import {
  POSITION_LIST_REQUEST,
  POSITION_LIST_SUCCESS,
  POSITION_LIST_FAIL,
  POSITION_LIST_BY_BUILDING_ID_SUCCESS,
  POSITION_CLEAR_CHECKED,
  POSITION_TOGGLE_CHECKED
} from "constants/ActionTypes";

const INIT_STATE = {
  // loader: false,
  // alertMessage: '',
  // showMessage: false,
  // initURL: '',
  // authUser: localStorage.getItem('user_id'),
  // pkey:''
  list: [],
  listByBuildingId: [],
  checked: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case POSITION_CLEAR_CHECKED: {
      return {
        ...state,
        checked: []
      };
    }

    case POSITION_TOGGLE_CHECKED: {
      // const list = action.payload.map(item => {
      //   return {
      //     ...item,
      //     nodeId: "" + item.buildingID + "-" + item.id
      //   };
      // });
      //arr: state.arr.concat(action.newItem)
      const found = state.checked.filter(p => p.id === action.payload.id);
      let checked = null;
      if (found.length) {
        checked = state.checked.filter(p => p.id !== action.payload.id);
      } else {
        checked = state.checked.concat(action.payload);
      }
      console.log("33", found.length, checked);
      return {
        ...state,
        checked
      };
    }

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
