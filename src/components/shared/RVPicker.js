/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import classNames from 'classnames';
import { InputPicker, TagPicker } from 'rsuite';

import '../../styles/shared/RVPicker.scss';

class RVPicker extends React.Component {
  constructor() {
    super();
    this.menuContainerRef = React.createRef();
  }
  render() {
    const { className, menuClassName, subtle, multi, inPopover, ...props } = this.props;
    const Picker = multi ? TagPicker : InputPicker;
    return <React.Fragment>
      <Picker
        container={inPopover ? (() => this.menuContainerRef.current) : null}
        placement="bottomStart"
        className={classNames(className, 'rv-picker', (subtle && 'rv-picker-subtle'))}
        menuClassName={classNames(menuClassName, 'rv-picker-menu')}
        maxHeight={200}
        {...props}
      />
      {inPopover && <div className="rv-picker-menu-container" ref={this.menuContainerRef}></div>}
    </React.Fragment>
  }
}

export default RVPicker;