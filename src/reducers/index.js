/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import { combineReducers } from "redux";

import common from "./common";
import calendar from "./calendar";
import user from "./user";
import task from "./task";

export default combineReducers({
  common,
  calendar,
  user,
  task,
});
