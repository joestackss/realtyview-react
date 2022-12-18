import { Notification } from "rsuite";
import * as TaskConstants from "../constants/task";

const open = (functionName, title, description) => {
  Notification[functionName]({
    title,
    description,
  });
};

export function toggleAddTaskOpen(isOpen) {
  return async (dispatch) => {
    dispatch({
      type: TaskConstants.TOGGLE_ADD_TASK_PANEL,
      isOpen,
    });
    dispatch({
      type: TaskConstants.SET_CURRENT_TASK,
      currentTask: {},
    });
  };
}

export function toggleModalDisplay(isDetails) {
  return async (dispatch) => {
    dispatch({
      type: TaskConstants.TOGGLE_MODAL_DISPLAY,
      isDetails,
    });
  };
}

export function toggleSortTaskName(sortType) {
  return async (dispatch) => {
    dispatch({
      type: TaskConstants.TABLE_LOADING,
      isTableLoading: true,
    });

    setTimeout(() => {
      dispatch({
        type: TaskConstants.SORT_TASK_NAME,
        sortType,
      });
      dispatch({
        type: TaskConstants.TABLE_LOADING,
        isTableLoading: false,
      });
    }, 500);
  };
}

export function createTask(task) {
  return async (dispatch) => {
    dispatch({
      type: TaskConstants.CREATE_TASK,
      task,
    });
    open("success", "Task was successfuly created");
    dispatch({
      type: TaskConstants.TOGGLE_ADD_TASK_PANEL,
      isOpen: false,
    });
  };
}

export function updateTask(task) {
  return async (dispatch) => {
    dispatch({
      type: TaskConstants.UPDATE_TASK,
      task,
    });
    open("success", "Task was successfuly updated");
    dispatch({
      type: TaskConstants.TOGGLE_ADD_TASK_PANEL,
      isOpen: false,
    });
  };
}

export function setCurrentTask(currentTask) {
  return async (dispatch) => {
    dispatch({
      type: TaskConstants.SET_CURRENT_TASK,
      currentTask,
    });
    dispatch({
      type: TaskConstants.TOGGLE_ADD_TASK_PANEL,
      isOpen: true,
    });
  };
}

export function deleteAllTask() {
  return async (dispatch) => {
    dispatch({
      //pang delete ng lahat ng task pwedeng tanggalin
      type: TaskConstants.DELETE_ALL_TASK,
      task: [],
    });
  };
}
