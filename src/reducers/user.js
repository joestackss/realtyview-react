/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import { SET_USER, UNSET_USER } from '../constants/actionTypes';

function user(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.user
      }
    case UNSET_USER:
      return {};
    default:
      return state;
  }
}

export default user;
