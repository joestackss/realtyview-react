/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin De Guzman <kevde@realtyview.com>
 */

import React, { Component } from "react";
import { Tag, InputPicker } from "rsuite";
import priorityData from "../../../data/priorities.json";
import _ from "lodash";

class PriorityField extends Component {
  state = {};

  render() {
    const { value, onChange } = this.props;

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
      <InputPicker
        data={priorityData}
        size="lg"
        className="tagPickerStyle"
        value={value}
        onChange={onChange}
        renderMenuItem={(label) => {
          return <Tag color={priorityColor(label)}>{label}</Tag>;
        }}
        renderValue={(value) => {
          return <Tag color={priorityColor(value)}>{value}</Tag>;
        }}
      />
    );
  }
}

export default PriorityField;
