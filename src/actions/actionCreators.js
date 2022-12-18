/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */
import axios from 'axios';


/**
 * Set a logged in user to allow the user to access authorized routes
 * @param {*} user
 */
export function setUser(user) {
  return {
    type: 'SET_USER',
    user
  }
}

/**
 * Unsets a logged in user
 */
export function unsetUser() {
  return function(dispatch) {
    return new Promise((reject, resolve) => {
      axios
      .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/user/logout`, {
        withCredentials: true
      })
      .then((response) => {
        dispatch({ type: 'UNSET_USER' });
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
}
