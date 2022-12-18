/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import classNames from 'classnames';
import { Button } from 'rsuite';

import '../../styles/shared/RVButton.scss';

// Button Palette
// 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'outline'

class RVButton extends React.Component {
  render() {
    const { 
      className, 
      palette,
      type,
      active,
      block,
      disabled,
      href,
      loading,
      size,
      onClick,
      children,
    } = this.props;
    const buttonProps = {
      type,
      active,
      block,
      disabled,
      href,
      loading,
      size,
      onClick,
      children,
    };
    const classes = [className, 'rv-btn'];
    if (palette) classes.push(`rv-btn-${palette}`);
    return <Button {...buttonProps} className={classNames(classes)}/>;
  }
}

export default RVButton;