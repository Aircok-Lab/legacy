import {
  COLLAPSED_DRAWER,
  INSIDE_THE_HEADER,
  SWITCH_LANGUAGE,
  TOGGLE_COLLAPSED_NAV,
  VERTICAL_NAVIGATION,
  WINDOW_WIDTH,
  SET_VIEW_MODE,
  SET_SHOW_MODAL
} from "constants/ActionTypes";

const rltLocale = ["ar"];
const initialSettings = {
  navCollapsed: false,
  drawerType: COLLAPSED_DRAWER,
  width: window.innerWidth,
  isDirectionRTL: false,
  navigationStyle: VERTICAL_NAVIGATION,
  horizontalNavPosition: INSIDE_THE_HEADER,
  viewMode: "list",
  locale: {
    languageId: "english",
    locale: "en",
    name: "English",
    icon: "us"
  }
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case "@@router/LOCATION_CHANGE":
      return {
        ...state,
        navCollapsed: false
      };
    case TOGGLE_COLLAPSED_NAV:
      return {
        ...state,
        navCollapsed: action.isNavCollapsed
      };
    case WINDOW_WIDTH:
      return {
        ...state,
        width: action.width
      };
    case SWITCH_LANGUAGE:
      return {
        ...state,
        locale: action.payload,
        isDirectionRTL: rltLocale.includes(action.payload.locale)
      };
    case SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
        selectedItem: action.selectedItem
      };
    case SET_SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload
      };
    default:
      return state;
  }
};

export default settings;
