/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from "react";
import classNames from "classnames";
import { Container } from "rsuite";

import TopNav from "../TopNav";
import RVSidebar from "../sidebar/index";
import { connect } from 'react-redux';
import { TOGGLE_SIDE_MENU } from '../../constants/actionTypes';

class MainLayout extends React.Component {
  render() {
    const { 
      children,
      isDesktop,
      isSideMenuOpen,
      layoutClassName,
    } = this.props;
    return (
      <div className={layoutClassName}>
        <main>
          <Container>
            <div className="rs-sidebar-wrapper fixed">
              <RVSidebar />
            </div>
            <Container
              className={classNames({
                "page-context": true,
                "isOpen": isSideMenuOpen,
                "isDesktop": isDesktop,
                "isMobile": !isDesktop,
              })}
            >
              <TopNav
                user={this.props.user}
                onToggleOpen={this.drawerToggleClickerHandler} />
              {children}
            </Container>
          </Container>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isSideMenuOpen: state.common.isSideMenuOpen,
  isDesktop: state.common.isDesktop
});

const mapDispatchToProps = (dispatch) => ({
  toggleSidebar: () => {
    dispatch({ type: TOGGLE_SIDE_MENU })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

