/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import {
  SET_SIDEBAR_OPEN,
  TOGGLE_SIDE_MENU,
  TOGGLE_DESKTOP_MODE,
} from '../constants/actionTypes';

const defaultState = {
  isSideMenuOpen: true
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case TOGGLE_SIDE_MENU:
      return {
        ...state,
        isSideMenuOpen: !state.isSideMenuOpen
      };
    case TOGGLE_DESKTOP_MODE:
      return {
        ...state,
        isDesktop: action.isDesktop
      }
    case SET_SIDEBAR_OPEN:
      return {
        ...state,
        isSideMenuOpen: action.isOpen,
      }
    default:
      return state;
  }
}

