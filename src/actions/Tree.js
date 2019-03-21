// import {
//   BUILDING_LIST_REQUEST,
//   BUILDING_ADD_REQUEST,
//   BUILDING_UPDATE_REQUEST,
//   BUILDING_DELETE_REQUEST
// } from "constants/ActionTypes";

export const selectTreeNode = payload => {
  return {
    type: "SELECT_TREE_NODE",
    payload
  };
};
