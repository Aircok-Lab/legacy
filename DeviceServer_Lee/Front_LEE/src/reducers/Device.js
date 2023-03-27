import {
  DEVICE_LIST_BY_BUILDING_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS,
  DEVICE_LIST_BY_POSITION_ID_SUCCESS1,
  DEVICE_LIST_SET,
  DEVICE_ADD_SUCCESS,
  DEVICE_SET_ITEM,
  DEVICE_GET_ALL_BY_POSITION_ID_SUCCESS,
  DEVICE_GET_ALL_BY_POSITION_ID_SUCCESS1,
  GETIR_SETTINGBY_SN,
  GET_DEVICE_YUL_BY_SERAILNUMBER
} from "constants/ActionTypes";

const INIT_STATE = {
  list: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case DEVICE_LIST_BY_BUILDING_ID_SUCCESS:
    case DEVICE_LIST_BY_POSITION_ID_SUCCESS:
    case DEVICE_LIST_BY_POSITION_ID_SUCCESS1:
       {
      const list = action.payload.map(item => {
        return {
          ...item,
          isChecked: false
        };
      });
      return {
        ...state,
        list
      };
    }
    case DEVICE_LIST_SET: {
      const list = action.payload
        ? action.payload.map(item => {
            return {
              ...item,
              isChecked: false
            };
          })
        : [];
      return {
        ...state,
        list
      };
    }
    case DEVICE_GET_ALL_BY_POSITION_ID_SUCCESS: {
      const list = action.payload.map(item => {
        const checked =
          action.deviceList.indexOf(item.serialNumber) > -1 ? true : false;
        return {
          ...item,
          isChecked: checked
        };
      });
      return {
        ...state,
        list
      };
    }
    case DEVICE_GET_ALL_BY_POSITION_ID_SUCCESS1: {
      const list = action.payload.map(item => {
        const checked =
          action.deviceList.indexOf(item.serialNumber) > -1 ? true : false;
        return {
          ...item,
          isChecked: checked
        };
      });
      return {
        ...state,
        list
      };
    }
    case DEVICE_ADD_SUCCESS: {
      return {
        ...state,
        loader: false
      };
    }
    case GETIR_SETTINGBY_SN: {
          return {
            ...state,
            data: action.payload
          };
        }
    case GET_DEVICE_YUL_BY_SERAILNUMBER: {
      return {
        ...state,
        list: action.payload, // 돌아온 데이터(categoryList)를 lists라는 초기값에 넣음.
    }
        }


    case DEVICE_SET_ITEM: {
      return {
        ...state,
        item: action.payload
      };
    }
    
    default:
      return state;
  }
};
