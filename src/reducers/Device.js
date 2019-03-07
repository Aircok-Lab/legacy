import {
  DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS,
  DEVICE_ADD_SUCCESS
} from "constants/ActionTypes";

const INIT_STATE = {
  list: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case DEVICE_LIST_BY_BUILDING_ID_SUCCESS:
    case DEVICE_LIST_BY_POSITION_ID_SUCCESS: {
      console.log("get device list......");
      const list = action.payload.map(device => {
        return {
          ...device,
          isChecked: false
        };
      });

      return {
        ...state,
        list
      };
    }
    case DEVICE_ADD_SUCCESS: {
      console.log("DEVICE_ADD_SUCCESS......");
      return {
        ...state,
        loader: false
      };
    }
    default:
      return state;
  }
};
