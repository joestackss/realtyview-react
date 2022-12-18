/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin de Guzman <kevin@realtyview.com>
 */

import * as TaskConstants from "../constants/task";
import { tasks } from "../data/tasks.json";
import _ from "lodash";

const defaultState = {
  addTaskPanel: true,
  isDetails: true,
  taskStorage: tasks,
  currentTask: { id: 1, taskName: "Task 1" },
  sortCriteria: { sortColumn: "taskName", sortType: "" },
  isTableLoading: false,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case TaskConstants.SET_CURRENT_TASK:
      return { ...state, currentTask: _.cloneDeep(action.currentTask) };

    case TaskConstants.DELETE_ALL_TASK:
      // const emptyTask = [];
      return { ...state, taskStorage: [] };

    case TaskConstants.CREATE_TASK:
      const newId =
        (_.max(_.map(state.taskStorage, (task) => task.id)) || 0) + 1;
      state.taskStorage.push({ id: newId, ...action.task });
      return _.cloneDeep({ ...state });

    case TaskConstants.UPDATE_TASK:
      const index = _.findIndex(
        state.taskStorage,
        (task) => task.id === action.task.id
      );
      if (index >= 0) {
        state.taskStorage[index] = action.task;
      }
      return _.cloneDeep({ ...state });

    case TaskConstants.TOGGLE_ADD_TASK_PANEL:
      return { ...state, isOpen: action.isOpen };

    case TaskConstants.TOGGLE_MODAL_DISPLAY:
      return { ...state, isDetails: action.isDetails };

    case TaskConstants.RADIO_TASK_TYPE:
      const currentTask = state.currentTask;
      currentTask.taskType = action.taskType;
      return { ...state, currentTask };

    case TaskConstants.SORT_TASK_NAME:
      const sortCriteria = { ...state.sortCriteria, sortType: action.sortType };
      return { ...state, sortCriteria };

    case TaskConstants.TABLE_LOADING:
      return { ...state, isTableLoading: action.isTableLoading };

    default:
      return state;
  }
}
