/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Dropdown,
  Icon } from 'rsuite';

import * as actionCreators from '../actions/actionCreators';
import '../styles/Header.scss';


class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut() {
    this.props.unsetUser();
    window.location.href = "/";
  }

  render() {
    return (
      <div className="rv-header">
        <div className="container-fluid">
          <Link to="/" className="logo">
            realtyview
          </Link>

          <div className="right-header">
            <Dropdown icon={<Icon icon="gear" />}>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Explore</Dropdown.Item>
              <Dropdown.Item>Integrations</Dropdown.Item>
              <Dropdown.Item>Help</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item onClick={this.handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown>

            <Avatar style={{ background: 'rgb(121, 76, 255)' }} circle>JS</Avatar>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actionCreators, dispatch);
};

export default connect(null, mapDispatchToProps)(Header);
