// import {
//   BUILDING_LIST_SUCCESS,
//   BUILDING_ADD_SUCCESS,
//   BUILDING_DELETE_SUCCESS
// } from "constants/ActionTypes";

const INIT_STATE = {
  selectedNode: {}
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SELECT_TREE_NODE": {
      return {
        ...state,
        selectedNode: action.payload
      };
    }
    default:
      return state;
  }
};
