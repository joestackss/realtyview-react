import React, { Component } from "react";
import "../../../styles/TaskManagement.scss";
import { Icon, Radio, RadioGroup } from "rsuite";
import * as TaskTypes from "../constants/task-types";
// import _ from "lodash";

class TaskTypeField extends Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <RadioGroup
        inline
        appearance="picker"
        value={value}
        onChange={onChange}
        className="marginTopS"
        style={{ border: "none", outline: "none" }}
      >
        <Radio className="outlined" value={TaskTypes.GENERIC}>
          <Icon icon={TaskTypes.ICONS[TaskTypes.GENERIC]} />
        </Radio>
        <Radio className="outlined" value={TaskTypes.CALL}>
          <Icon icon={TaskTypes.ICONS[TaskTypes.CALL]} />
        </Radio>
        <Radio className="outlined" value={TaskTypes.PEOPLE}>
          <Icon icon={TaskTypes.ICONS[TaskTypes.PEOPLE]} />
        </Radio>
        <Radio className="outlined" value={TaskTypes.TOUR_DEMO}>
          <Icon icon={TaskTypes.ICONS[TaskTypes.TOUR_DEMO]} />
        </Radio>
      </RadioGroup>
    );
  }
}

export default TaskTypeField;
