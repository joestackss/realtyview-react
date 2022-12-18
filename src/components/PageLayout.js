/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Container } from 'rsuite';

import TopNav from './TopNav';
import RV_Sidebar from './RV_Sidebar';
import '../styles/PageLayout.scss';


class PageLayout extends React.Component {
  render() {
    const { children, className, title } = this.props;
    return (
      <div className={classNames(className, 'layout')}>
        <main>
          <Container>
            <div className="rs-sidebar-wrapper fixed">
              <RV_Sidebar />
            </div>

            <Container className={classNames({
              "page-context": true,
              "stretched": this.props.isSideMenuOpen === false
            })}>
              <TopNav user={this.props.user} />
              <h2 className="page-context-title">{title}</h2>
              {children}
            </Container>
          </Container>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    isSideMenuOpen: state.common.isSideMenuOpen
  };
}

export default connect(mapStateToProps, null)(PageLayout);
