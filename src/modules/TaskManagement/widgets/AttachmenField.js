/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin De Guzman <kevde@realtyview.com>
 */

import React, { Component } from "react";
import { Field } from "react-final-form";
import { FlexboxGrid, Button, IconButton, Icon, Input, Uploader } from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import { Checkbox } from "rsuite";

class AttachmentField extends Component {
  state = {};

  handleAddAttachment = () => {
    const { fields } = this.props;
    fields.insert(fields.length, {});
  };

  renderAttachment(field, index) {
    return (
      <FlexboxGridItem colspan={7}>
        <Field
          name={`${field}.fileName`}
          render={(fieldProps) => (
            // <Input className="attachmentField" {...fieldProps.input} />
            <Uploader
              listType="picture-text"
              action="//jsonplaceholder.typicode.com/posts/"
              {...fieldProps.Uploader}
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
        />
      </FlexboxGridItem>
    );
  }

  render() {
    const { fields } = this.props;
    return (
      <React.Fragment>
        <FlexboxGrid justify="space-between">
          <FlexboxGridItem colspan={2}>
            <div className="smallBoldLabel">Attachments</div>
          </FlexboxGridItem>
          <FlexboxGridItem colspan={4}>
            <Button
              appearance="primary"
              style={{ width: "100%" }}
              onClick={this.handleAddAttachment}
            >
              Add Files
            </Button>
          </FlexboxGridItem>
        </FlexboxGrid>
        <FlexboxGrid justify="space-around">
          {fields.length > 0 &&
            fields.map((field, index) => this.renderAttachment(field, index))}
          {fields.length === 0 && (
            <FlexboxGridItem colspan={24}>
              <div className="center">There’s no attachments</div>
            </FlexboxGridItem>
          )}
        </FlexboxGrid>
      </React.Fragment>
    );
  }
}

export default AttachmentField;
