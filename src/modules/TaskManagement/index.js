/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin De Guzman <kevde@realtyview.com>
 */

import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FlexboxGrid,
  Button,
  Panel,
  Icon,
  InputGroup,
  Input,
  IconButton,
} from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import { connect } from "react-redux";
import withStyles from "react-jss";
import "../../styles/TaskManagement.scss";
import AddTaskPanel from "./AddTaskPanel";
import * as TaskAction from "../../actions/task";
import TaskTable from "./widgets/TaskTable";

const styles = {
  pageTitle: {
    lineHeight: "40px",
  },
};

class TaskManagement extends Component {
  state = {
    backdrop: true,
  };

  handleSortButtonClick = () => {
    const sortType = this.props.sortType === "asc" ? "desc" : "asc";

    this.props.toggleSortTaskName(sortType);
  };

  handleTaskClicked = (task) => {
    const { setCurrentTask } = this.props;
    setCurrentTask(task);
  };

  render() {
    const { toggleAddTaskOpen, taskStorage } = this.props;
    const { backdrop } = this.state;

    console.log("this is storage", taskStorage);
    return (
      <React.Fragment>
        <FlexboxGrid>
          <FlexboxGridItem order={1} componentClass={Col} colspan={24}>
            <Grid fluid>
              <Row className="marginBottom">
                <Col md={10} xs={24}>
                  <h5 className="pageTitle">Task</h5>
                </Col>
                <Col md={14} xs={24}>
                  <Row gutter={16}>
                    <Col xs={4}>
                      <Button
                        className="mainpagebutton"
                        color="green"
                        onClick={() => toggleAddTaskOpen(true)}
                      >
                        Add task
                      </Button>
                      <AddTaskPanel backdrop={backdrop} />
                    </Col>
                    <Col xs={4}>
                      <IconButton
                        className="mainpagebutton"
                        icon={
                          <Icon
                            style={{
                              height: "100%",
                              lineHeight: 1.7,
                              background: "white",
                            }}
                            icon="check-circle-o"
                          />
                        }
                      >
                        Show tasks
                      </IconButton>
                    </Col>
                    <Col xs={3}>
                      <IconButton
                        className="mainpagebutton"
                        icon={
                          <Icon
                            style={{
                              height: "100%",
                              lineHeight: 1.7,
                              backgroundColor: "white",
                            }}
                            icon="filter"
                          />
                        }
                      >
                        Filter
                      </IconButton>
                    </Col>
                    <Col xs={3}>
                      <IconButton
                        className="mainpagebutton"
                        onClick={this.handleSortButtonClick}
                        icon={
                          <Icon
                            style={{
                              height: "100%",
                              lineHeight: 1.7,
                              backgroundColor: "white",
                            }}
                            icon="sort"
                          />
                        }
                      >
                        Sort
                      </IconButton>
                      {/* <Button
                        className="mainpagebutton"
                        onClick={() => deleteAllTask()}
                      >
                        Delete all task
                      </Button> */}
                    </Col>
                    <Col xs={10}>
                      {/* <Button className="mainpagebutton">Search</Button> */}
                      <InputGroup inside>
                        <InputGroup.Addon>
                          <Icon icon="search" />
                        </InputGroup.Addon>
                        <Input
                          className="mainPageSearch"
                          placeholder="Search..."
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </FlexboxGridItem>
          <FlexboxGridItem order={2} componentClass={Col} colspan={24}>
            <Panel shaded>
              <TaskTable
                tasks={taskStorage}
                onTaskClicked={this.handleTaskClicked}
              />
            </Panel>
          </FlexboxGridItem>
        </FlexboxGrid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  taskStorage: state.task.taskStorage,
  sortType: state.task.sortCriteria.sortType,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAddTaskOpen: (isOpen) => dispatch(TaskAction.toggleAddTaskOpen(isOpen)),
  toggleSortTaskName: (sortType) =>
    dispatch(TaskAction.toggleSortTaskName(sortType)),
  deleteAllTask: () => dispatch(TaskAction.deleteAllTask()),
  setCurrentTask: (task) => dispatch(TaskAction.setCurrentTask(task)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TaskManagement));
