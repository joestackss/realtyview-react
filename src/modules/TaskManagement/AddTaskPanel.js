import React, { Children, Component, createRef } from "react";
import { connect } from "react-redux";
import FroalaEditorComponent from "react-froala-wysiwyg";
import * as TaskAction from "../../actions/task";
import "../../styles/TaskManagement.scss";
import { Form, Field, FormSpy } from "react-final-form";
import Dropzone from "react-dropzone";
import arrayMutators from "final-form-arrays";
import {
  Grid,
  Row,
  Col,
  FlexboxGrid,
  Button,
  Tag,
  Icon,
  Avatar,
  Drawer,
  InputGroup,
  Input,
  Panel,
  IconButton,
  ButtonGroup,
  DatePicker,
  TagPicker,
  InputPicker,
  Uploader,
} from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import priorityData from "../../data/priorities.json";
import taskData from "../../data/taskData.json";
import _ from "lodash";
import TaskTypeField from "./widgets/TaskTypeField";
import "../../styles/Task/AddTaskPanel.scss";
import { FieldArray } from "react-final-form-arrays";
import SubTaskField from "./widgets/SubTaskField";
import PersonListField from "./widgets/PersonListField";
import AttachmentField from "./widgets/AttachmenField";
import PriorityField from "./widgets/PriorityField";

const style1 = {
  height: 45,
  fontSize: 16,
  fontWeight: 600,
  "background-color": "#727cf5",
  borderRadius: 3,
  color: "white",
};

const style2 = {
  height: 45,
  fontSize: 16,
  fontWeight: 600,
  backgroundColor: "#eef2f7",
  borderRadius: 3,
  color: "grey",
};

const ranges = [
  {
    label: "Now",
    value: new Date(),
  },
];

class AddTaskPanel extends Component {
  state = {
    files: [],
  };

  onDrop = (files) => {
    this.setState({ files });
  };

  handleKeyDown = (event, callback) => {
    const isEnterPressed = event.key === "Enter" && event.shiftKey === false;
    if (isEnterPressed) {
      event.preventDefault();
    }

    if (event.target.name !== "" && isEnterPressed) {
      callback(event);
    }
  };

  handleSubmit = (task) => {
    const { createTask, updateTask } = this.props;
    if (task.id) {
      return updateTask(task);
    }
    return createTask(task);
  };

  renderHeader(formProps) {
    return (
      <FlexboxGrid align="middle">
        <FlexboxGridItem colspan={2}>
          <IconButton
            className="saveButton"
            icon={<Icon className="saveButtonIcon" icon="check-circle-o" />}
            circle
            onClick={formProps.form.submit}
          />
        </FlexboxGridItem>
        <FlexboxGridItem colspan={20}>
          <Field
            name="taskName"
            render={(fieldProps) => (
              <Input
                {...fieldProps.input}
                className="taskTitle"
                placeholder="Add task title"
              />
            )}
          />
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  }

  renderForm(formProps) {
    const { handleSubmit } = formProps;
    const { isDetails, toggleModalDisplay } = this.props;

    const dropzoneRef = createRef();
    const openDialog = () => {
      // Note that the ref is set async,
      // so it might be null at some point
      if (dropzoneRef.current) {
        dropzoneRef.current.open();
      }
    };

    const files = this.state.files.map((file) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <React.Fragment>
        <Panel className="add-task-panel">
          <form
            id="addTaskForm"
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              this.handleKeyDown(e, handleSubmit);
            }}
          >
            <Grid fluid>
              <Row>
                <Col className="noPaddingSides">
                  <FlexboxGrid justify="space-between" className="marginBottom">
                    <FlexboxGridItem colspan={18}>
                      {this.renderHeader(formProps)}
                    </FlexboxGridItem>
                    <FlexboxGridItem colspan={4}>
                      <Button
                        style={{ width: "100%", height: "100%" }}
                        appearance="primary"
                      >
                        Add to Calendar
                      </Button>
                    </FlexboxGridItem>
                  </FlexboxGrid>
                </Col>
              </Row>
              <Row>
                <Col className="noPaddingSides" xs={24}>
                  <Field
                    name="modalDisplay"
                    render={() => (
                      <ButtonGroup className="marginBottom" justified>
                        <Button
                          style={isDetails === true ? style1 : style2}
                          onClick={() => toggleModalDisplay(true)}
                        >
                          Details
                        </Button>
                        <Button
                          style={isDetails === false ? style1 : style2}
                          onClick={() => toggleModalDisplay(false)}
                        >
                          Timeline
                        </Button>
                      </ButtonGroup>
                    )}
                  />
                </Col>
              </Row>
              {isDetails === true && (
                <>
                  <Row gutter={36}>
                    <Col className="colContainer" md={7} sm={15}>
                      <div className="smallBoldLabel">Task Type</div>
                      <Field
                        name="taskType"
                        render={(fieldProps) => (
                          <TaskTypeField
                            value={fieldProps.input.value}
                            onChange={fieldProps.input.onChange}
                          />
                        )}
                      />
                    </Col>
                    <Col className="colContainer" md={5} sm={9}>
                      <div className="smallBoldLabel">Priority</div>
                      <Field
                        name="priority"
                        allowNull
                        defaultValue={null}
                        render={(fieldProps) => (
                          <PriorityField
                            value={fieldProps.input.value}
                            onChange={fieldProps.input.onChange}
                          />
                        )}
                      />
                    </Col>
                    <Col className="colContainer" md={6} sm={12}>
                      <div className="smallBoldLabel">Due Date</div>
                      <Field
                        name="dueDate"
                        render={(fieldProps) => (
                          <DatePicker
                            oneTap
                            format="MM/DD/YYYY"
                            className="marginTopS"
                            {...fieldProps.input}
                          />
                        )}
                      />
                    </Col>
                    <Col className="colContainer" md={6} sm={12}>
                      <div className="smallBoldLabel">Time</div>
                      <Field
                        name="dueDate"
                        render={(fieldProps) => (
                          <DatePicker
                            format="hh:mm A"
                            placement="auto"
                            showMeridian
                            ranges={ranges}
                            className="marginTopS"
                            style={{ width: "100%", borderRadius: 4 }}
                            {...fieldProps.input}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="colContainer" xs={24}>
                      <div className="smallBoldLabel">Task Title</div>
                      <Field
                        name="taskName"
                        render={(fieldProps) => (
                          <Input
                            {...fieldProps.input}
                            className="marginTopS"
                            placeholder="Add task description"
                            style={{ borderRadius: 4 }}
                          />
                        )}
                      />
                    </Col>
                    <Col className="colContainer" xs={24}>
                      <div className="smallBoldLabel">Task Description</div>
                      <FroalaEditorComponent />
                    </Col>
                    <Col xs={24}>
                      <Row gutter={24}>
                        <Col className="colContainer" md={12} sm={24}>
                          <div className="smallBoldLabel">Owner</div>
                          {/* <Field
                          name="ownerInput"
                          render={(fieldProps) => (
                            <Input
                              {...fieldProps.input}
                              className="marginTopS"
                              style={{ borderRadius: 4 }}
                            />
                          )}
                        /> */}
                          <InputPicker
                            data={taskData}
                            size="lg"
                            className="tagPickerStyle"
                            placeholder="Add owner"
                            defaultValue={["Dominic Keller"]}
                            renderMenuItem={(label) => {
                              return <Tag color="green">{label}</Tag>;
                            }}
                            renderValue={(value) => {
                              return <Tag color="green">{value}</Tag>;
                            }}
                          />
                        </Col>
                        <Col className="colContainer" md={12} sm={24}>
                          <div className="smallBoldLabel">Relationship</div>
                          {/* <Field
                          name="ralationshipInput"
                          render={(fieldProps) => (
                            <Input
                              {...fieldProps.input}
                              placeholder="Add relationship"
                              className="marginTopS"
                              style={{ borderRadius: 4 }}
                            />
                          )}
                        /> */}
                          <TagPicker
                            data={taskData}
                            size="lg"
                            placeholder="Add relationship"
                            className="tagPickerStyle"
                            renderValue={(values) => {
                              return values.map((tag, index) => (
                                <Tag key={index} color="blue">
                                  {tag}
                                </Tag>
                              ));
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className="colContainer" xs={24}>
                      <div className="smallBoldLabel">Offer or Listing</div>
                      <Field
                        name="offerListingInput"
                        render={(fieldProps) => (
                          <Input
                            {...fieldProps.input}
                            placeholder="Add offer or listing"
                            className="marginTopS"
                            style={{ borderRadius: 4 }}
                          />
                        )}
                      />
                    </Col>
                    <Col className="colContainer" xs={24}>
                      <div className="smallBoldLabel">Assigned to</div>
                      <Field
                        name="assignees"
                        render={(fieldProps) => (
                          <PersonListField
                            value={fieldProps.input.value}
                            onChange={fieldProps.input.onChange}
                          />
                        )}
                      />
                    </Col>
                    <Col className="colContainer" xs={24}>
                      <FieldArray
                        name="subTasks"
                        render={(fieldProps) => (
                          <SubTaskField {...fieldProps} />
                        )}
                      />
                    </Col>
                    <Col className="colContainer" xs={24}>
                      {/* <FlexboxGrid justify="space-between">
                      <FlexboxGridItem colspan={2}>
                        <div className="smallBoldLabel">Attachments</div>
                      </FlexboxGridItem>
                      <FlexboxGridItem colspan={22}> */}
                      {/* <Button appearance="primary" style={{ width: "100%" }}>
                          Add Files
                        </Button> */}
                      {/* <Field
                          name="attachments"
                          render={(fieldProps) => (
                            // <Input className="attachmentField" {...fieldProps.input} />
                            <Uploader
                              listType="picture-text"
                              action="//jsonplaceholder.typicode.com/posts/"
                              toggleComponentClass={Button}
                              {...fieldProps.input}
                              renderFileInfo={(file, fileElement) => {
                                return (
                                  <div>
                                    <span>File Name: {file.name}</span>
                                    <p>File URL: {file.url}</p>
                                  </div>
                                );
                              }}
                            />
                          )}
                        /> */}
                      {/* </FlexboxGridItem>
                    </FlexboxGrid> */}
                      {/* <div className="center">There’s no attachments</div> */}

                      {/* <Uploader
                        listType="picture-text"
                        multiple
                        action="//jsonplaceholder.typicode.com/posts/"
                        toggleComponentClass={Button}
                        renderFileInfo={(file, fileElement) => {
                          return (
                            <div>
                              <span style={{ fontSize: 14 }}>{file.name}</span>
                              <p style={{ fontSize: 14 }}>{file.size}</p>
                            </div>
                          );
                        }}
                      >
                        <React.Fragment>
                          <div>Attachments</div>
                          <Button
                            style={{
                              borderRadius: 3,
                              backgroundColor: "#727cf5",
                              color: "white",
                            }}
                          >
                            Add file
                          </Button>
                        </React.Fragment>
                      </Uploader> */}

                      <Dropzone onDrop={this.onDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps({ className: "" })}>
                              <input {...getInputProps()} />
                              <div>Attachments</div>
                              <button
                                type="button"
                                className="primaryButton"
                                onClick={openDialog}
                              >
                                Add Files
                              </button>
                            </div>
                            <aside>
                              <ul>{files}</ul>
                            </aside>
                          </section>
                        )}
                      </Dropzone>
                    </Col>
                  </Row>
                </>
              )}
              {isDetails === false && (
                <>
                  <Row>
                    <Col className="colContainerS" xs={24}>
                      <Avatar circle>
                        <Icon icon="user" />
                      </Avatar>
                      <div className="userInfoContainer">
                        <div>Dominic Keller added 3 sub-tasks.</div>
                        <div className="smallText">Today, 9:02a</div>
                      </div>
                    </Col>
                    <Col className="colContainerS" xs={24}>
                      <Avatar circle>
                        <Icon icon="user" />
                      </Avatar>
                      <div className="userInfoContainer">
                        <div>
                          Risa Pearson linked 1650 N 16th St. SW APT 101
                          Chicago, IL 6014.
                        </div>
                        <div className="smallText">Today, 8:25a</div>
                      </div>
                    </Col>
                    <Col className="colContainerS" xs={24}>
                      <Avatar circle>
                        <Icon icon="user" />
                      </Avatar>
                      <div className="userInfoContainer">
                        <div>
                          Bryan J. Luellen uploaded sales-assets.zip,
                          Admin-bug-report-mp4 and draft-for-release-note.docx.
                        </div>
                        <div className="smallText">Today, 8:05a</div>
                      </div>
                    </Col>
                    <Col className="colContainerS" xs={24}>
                      <Avatar circle>
                        <Icon icon="user" />
                      </Avatar>
                      <div className="userInfoContainer">
                        <div>Created by Dominic Keller</div>
                        <div className="smallText">Yesterday, 11:00a</div>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Grid>
          </form>
        </Panel>
        <FormSpy onChange={(formObj) => console.log(formObj.values)} />
      </React.Fragment>
    );
  }

  render() {
    const {
      backdrop,
      currentTask,
      isOpen,
      toggleAddTaskOpen,
      toggleModalDisplay,
    } = this.props;
    return (
      <Drawer
        size="lg"
        backdrop={backdrop}
        show={isOpen}
        onHide={() => {
          toggleAddTaskOpen(false);
          toggleModalDisplay(true);
        }}
      >
        <IconButton
          className="exitButton"
          icon={<Icon className="exitButtonIcon" icon="times-circle" />}
          circle
          onClick={() => {
            toggleAddTaskOpen(false);
            toggleModalDisplay(true);
          }}
        />
        <Drawer.Body>
          <Form
            initialValues={currentTask}
            onSubmit={this.handleSubmit}
            mutators={{ ...arrayMutators }}
            render={(formProps) => this.renderForm(formProps)}
          />
        </Drawer.Body>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => ({
  isOpen: state.task.isOpen,
  isDetails: state.task.isDetails,
  currentTask: state.task.currentTask,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAddTaskOpen: (isOpen) => {
    dispatch(TaskAction.toggleAddTaskOpen(isOpen));
  },
  toggleModalDisplay: (isDetails) => {
    dispatch(TaskAction.toggleModalDisplay(isDetails));
  },
  createTask: (task) => {
    dispatch(TaskAction.createTask(task));
  },
  updateTask: (task) => {
    dispatch(TaskAction.updateTask(task));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskPanel);
