import {
  BUILDING_LIST_SUCCESS,
  BUILDING_ADD_SUCCESS,
  BUILDING_DELETE_SUCCESS,
  BUILDING_LOCATION_SUCCESS,
  BUILDING_LOCATION_RESET,
  BUILDING_SELECT
} from "constants/ActionTypes";

const INIT_STATE = {
  list: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case BUILDING_LIST_SUCCESS: {
      console.log("state &&&& ", state);
      return {
        ...state,
        list: [
          ...action.payload,
          { id: "null", buildingId: "null", name: "기타폴더" }
        ]
        // list: [...state.list, action.newItem]
      };
    }
    case BUILDING_ADD_SUCCESS: {
      return {
        ...state,
        loader: false
      };
    }
    case BUILDING_DELETE_SUCCESS: {
      return {
        ...state,
        loader: false
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

    case BUILDING_SELECT: {
      return {
        ...state,
        selectedBuilding: action.payload
      };
    }
    //
    default:
      return state;
  }
};
