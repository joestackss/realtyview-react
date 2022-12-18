import * as CommonConstants from '../constants/actionTypes';
/**
 * Unsets a logged in user
 */
export function toggleSidebarOpen() {
  return async (dispatch) => {
    dispatch({
      type: CommonConstants.TOGGLE_SIDE_MENU,
    });
  }
}

export function setDesktopMode(isDesktop) {
  return async (dispatch) => {
    dispatch({
      type: CommonConstants.TOGGLE_DESKTOP_MODE,
      isDesktop: isDesktop,
    });
  }
}

export function setSidebarOpen(isOpen) {
  return async (dispatch) => {
    dispatch({
      type: CommonConstants.SET_SIDEBAR_OPEN,
      isOpen,
    });
  }
}