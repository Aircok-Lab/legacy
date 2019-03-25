import { SELECT_TREE_NODE, TOGGLE_TREE_NODE } from "constants/ActionTypes";

const INIT_STATE = {
  selectedNode: {},
  expandedNodes: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SELECT_TREE_NODE: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }
    case TOGGLE_TREE_NODE: {
      return {
        ...state,
        expandedNodes: action.payload
      };
    }
    default:
      return state;
  }
};
