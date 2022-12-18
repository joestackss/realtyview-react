/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin De Guzman <kevde@realtyview.com>
 */

import React, { Component } from "react";
import _ from "lodash";
import { Table, Checkbox, Tag, Icon, Avatar, FlexboxGrid } from "rsuite";
import * as TaskTypes from "../constants/task-types";
import { users } from "../../../data/user.json";
import "../../../styles/TaskManagement.scss";
import * as TaskAction from "../../../actions/task";
import { connect } from "react-redux";
import moment from "moment";
import { convertFromRaw } from "draft-js";
const { Column, HeaderCell, Cell } = Table;

const TaskNameCell = ({
  rowData,
  onChange,
  checkedKeys,
  dataKey,
  ...props
}) => {
  return (
    <Cell
      {...props}
      style={{ display: "flex", justifyContent: "space-between", padding: 5 }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox style={{ marginLeft: 0 }} value={rowData[dataKey]} inline />
        <Icon
          style={{ marginRight: 15, color: "#727cf5" }}
          icon={TaskTypes.ICONS[rowData.taskType]}
        />
        <div>{rowData[dataKey]}</div>
      </div>
      <div>
        <Icon
          style={{ marginRight: 15, paddingTop: 12 }}
          icon={rowData.attachments}
        />
      </div>
    </Cell>
  );
};

const SubTaskCell = ({ rowData, dataKey, ...rest }) => {
  const subTasks = _.get(rowData, `${dataKey}`, []) || [];
  return (
    <Cell {...rest}>
      <div style={{ display: subTasks.length === 0 ? "none" : "flex" }}>
        <div className="paddingLeft">
          <Icon icon="task" />
        </div>
        <div className="paddingLeft">
          <span>{subTasks.length}</span>
        </div>
      </div>
    </Cell>
  );
};

const AsigneeCell = ({ rowData, dataKey, ...rest }) => {
  const assignees = _.filter(users, (user) =>
    _.includes(rowData[dataKey], user.id)
  );
  return (
    <Cell {...rest}>
      {assignees.map((assignee) => (
        <Avatar circle src={assignee.photo} style={{ width: 20, height: 20 }}>
          {`${_.head(assignee.firstname)}${_.head(
            assignee.lastname
          )}`.toUpperCase()}
        </Avatar>
      ))}
    </Cell>
  );
};

const PriorityCell = ({ rowData, dataKey, ...rest }) => {
  const priority = rowData[dataKey];

  const priorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "blue";
      case "Medium":
        return "yellow";
      case "High":
        return "red";
      default:
        return "";
    }
  };

  return (
    <Cell {...rest}>
      <div style={{ display: priority === "" ? "none" : "block" }}>
        <Tag className="tagPriorityCell" color={priorityColor(priority)}>
          {priority}
        </Tag>
      </div>
    </Cell>
  );
};

const DateCell = ({ rowData, dataKey, ...rest }) => {
  const rawDate = rowData[dataKey];
  const date = moment(rawDate).calendar();
  const dateColor = (rawDate) => {
    const color = moment(rawDate).isBefore(new Date(), "day")
      ? "red"
      : moment(rawDate).isSame(new Date(), "day")
      ? "#08cf97"
      : "";
    return color;
  };

  return (
    <Cell {...rest}>
      <div style={{ color: dateColor(rawDate) }}>{date}</div>
    </Cell>
  );
};

class TaskTable extends Component {
  state = {
    sortColumn: "taskName",
  };

  getData() {
    const { tasks, taskSortCriteria } = this.props;
    const { sortColumn, sortType } = taskSortCriteria;

    if (sortColumn && sortType) {
      return tasks.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return tasks;
  }

  get FilteredTasks() {
    const { keyword, tasks } = this.props;
    return _.filter(tasks, (task) => _.includes(task.taskName, keyword));
  }

  handleSortColumn = (sortColumn, sortType) => {
    setTimeout(() => {
      this.setState({
        sortColumn,
        sortType,
        loading: false,
      });
    }, 500);

    this.props.toggleSortTaskName(sortType);
  };

  handleOnTaskClick = (task, event) => {
    const instance = event._targetInst;
    const { onTaskClicked } = this.props;
    if (instance.memoizedProps.className !== "rs-checkbox-wrapper") {
      onTaskClicked(task);
    }
  };

  render() {
    const { taskSortCriteria, isTableLoading } = this.props;
    const { sortColumn, sortType } = taskSortCriteria;

    return (
      <Table
        data={this.getData()}
        height={435}
        headerHeight={54}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={this.handleSortColumn}
        loading={isTableLoading}
        onRowClick={this.handleOnTaskClick}
      >
        <Column width={689} sortable={true}>
          <HeaderCell>
            <div className="bigBoldLabel" style={{ display: "inline-block" }}>
              Task Name
            </div>
          </HeaderCell>
          <TaskNameCell dataKey="taskName" />
        </Column>

        <Column width={198}>
          <HeaderCell>
            <div className="bigBoldLabel">Sub-tasks</div>
          </HeaderCell>

          <SubTaskCell dataKey="subTasks" />
        </Column>

        <Column width={340}>
          <HeaderCell className="bigBoldLabel">
            <div className="bigBoldLabel">Due date</div>
          </HeaderCell>
          <DateCell dataKey="dueDate" />
        </Column>

        <Column width={207}>
          <HeaderCell>
            <div className="bigBoldLabel">Asignee</div>
          </HeaderCell>
          <AsigneeCell dataKey="assignees" />
        </Column>

        <Column width={156}>
          <HeaderCell>
            <div className="bigBoldLabel">Priority</div>
          </HeaderCell>
          <PriorityCell dataKey="priority" />
        </Column>
      </Table>
    );
  }
}

const mapStateToProps = (state) => ({
  taskSortCriteria: state.task.sortCriteria,
  isTableLoading: state.task.isTableLoading,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSortTaskName: (sortType) =>
    dispatch(TaskAction.toggleSortTaskName(sortType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskTable);
