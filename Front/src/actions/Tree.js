import { SELECT_TREE_NODE, TOGGLE_TREE_NODE } from "constants/ActionTypes";

export const selectTreeNode = payload => {
  return {
    type: SELECT_TREE_NODE,
    payload
  };
};

export const toggleTreeNode = payload => {
  return {
    type: TOGGLE_TREE_NODE,
    payload
  };
};
