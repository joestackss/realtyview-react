/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import classNames from 'classnames';
import { DatePicker } from 'rsuite';

import '../../styles/shared/RVDatePicker.scss';

class RVDatePicker extends React.Component {
  constructor() {
    super();
    this.menuContainerRef = React.createRef();
  }
  render() {
    const { className, menuClassName, subtle, inPopover, ...props } = this.props;
    return <React.Fragment>
      <DatePicker
        cleanable={false}
        container={inPopover ? (() => this.menuContainerRef.current) : null}
        format="MMM D, YYYY"
        placement="bottomStart"
        ranges={[]}
        className={classNames(className, 'rv-date-picker', (subtle && 'rv-date-picker-subtle'))}
        menuClassName={classNames(menuClassName, 'rv-date-picker-menu')}
        {...props}
      />
      {inPopover && <div className="rv-date-picker-menu-container" ref={this.menuContainerRef}></div>}
    </React.Fragment>
  }
}

export default RVDatePicker;