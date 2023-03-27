import {
  SWITCH_LANGUAGE,
  TOGGLE_COLLAPSED_NAV,
  WINDOW_WIDTH,
  SET_VIEW_MODE,
  SET_SHOW_MODAL
} from "../constants/ActionTypes";

export function toggleCollapsedNav(isNavCollapsed) {
  return { type: TOGGLE_COLLAPSED_NAV, isNavCollapsed };
}

export function updateWindowWidth(width) {
  return { type: WINDOW_WIDTH, width };
}

export function switchLanguage(locale) {
  return {
    type: SWITCH_LANGUAGE,
    payload: locale
  };
}

export function setViewMode(viewMode, selectedItem) {
  return {
    type: SET_VIEW_MODE,
    payload: viewMode,
    selectedItem: selectedItem
  };
}

export const setShowModal = payload => {
  return {
    type: SET_SHOW_MODAL,
    payload
  };
};
