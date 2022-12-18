/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin De Guzman <kevde@realtyview.com>
 */

import React, { Component } from "react";
import { Field } from "react-final-form";
import { FlexboxGrid, Button, IconButton, Icon, Input } from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import { Checkbox } from "rsuite";

class SubTaskField extends Component {
  handleAddSubTask = () => {
    const { fields } = this.props;
    fields.insert(fields.length, {});
  };

  handleSubTaskToggle = (onChange) => {
    return (value, checked) => {
      onChange(checked);
    };
  };

  renderSubTask(field, index) {
    return (
      <FlexboxGrid align="middle">
        <FlexboxGridItem>
          <Field
            name={`${field}.enabled`}
            render={(fieldProps) => (
              <Checkbox
                style={{ marginLeft: 0 }}
                checked={fieldProps.input.value}
                value={true}
                onChange={this.handleSubTaskToggle(fieldProps.input.onChange)}
                inline
              />
            )}
          />
        </FlexboxGridItem>
        <FlexboxGridItem colspan={22}>
          <Field
            name={`${field}.taskName`}
            render={(fieldProps) => (
              <Input className="subTaskName" {...fieldProps.input} />
            )}
          />
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  }

  render() {
    const { fields } = this.props;
    return (
      <React.Fragment>
        <FlexboxGrid justify="space-between">
          <FlexboxGridItem colspan={2}>
            <div className="smallBoldLabel">Sub-tasks</div>
          </FlexboxGridItem>
          <FlexboxGridItem colspan={4}>
            <Button
              appearance="primary"
              style={{ width: "100%" }}
              onClick={this.handleAddSubTask}
            >
              Add Sub-tasks
            </Button>
          </FlexboxGridItem>
        </FlexboxGrid>
        {fields.length > 0 &&
          fields.map((field, index) => this.renderSubTask(field, index))}
        {fields.length === 0 && (
          <div className="center">There’s no sub-tasks</div>
        )}
      </React.Fragment>
    );
  }
}

export default SubTaskField;
