/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin De Guzman <kevde@realtyview.com>
 */

import React, { Component } from "react";
import { Tag } from "rsuite";
import { users } from "../../../data/user.json";
import { TagPicker } from 'rsuite';
import _ from "lodash";


class PersonListField extends Component {
  get userOptions() {
    return _.map(users, (user) => ({
      label: `${user.firstname} ${user.lastname}`,
      value: user.id,
    }))
  }

  renderOption(value, index) {
    const selectedTask = _.find(this.userOptions, (option) => option.value === value);
    return (
      <Tag key={index} color="blue">
        {selectedTask && selectedTask.label}
      </Tag>
    )
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <TagPicker
        data={this.userOptions}
        value={value}
        onChange={onChange}
        size="lg"
        placeholder="Add assignee"
        className="tagPickerStyle"
        renderValue={(values) => {
          return values.map((taskId, index) => this.renderOption(taskId, index));
        }}
      />
    );
  }
}

export default PersonListField;