/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Sidebar, Sidenav, Nav, Icon } from "rsuite";

import { TOGGLE_SIDE_MENU } from "../constants/actionTypes";
import logoLight from "../images/logo-light.svg";
import { ReactComponent as DashboardIcon } from "../images/icons/dashboard-icon.svg";
import { ReactComponent as RelationshipsIcon } from "../images/icons/relationships-icon.svg";
import { ReactComponent as ManageOffersIcon } from "../images/icons/manage-offers-icon.svg";
import { ReactComponent as OfferInboxIcon } from "../images/icons/offer-inbox-icon.svg";
import { ReactComponent as HelpSupportIcon } from "../images/icons/help-support-icon.svg";
import { ReactComponent as SettingsIcon } from "../images/icons/settings-icon.svg";
import { ReactComponent as CalendarIcon } from "../images/icons/calendar-icon.svg";
import { ReactComponent as ChatIcon } from "../images/icons/chat-icon.svg";
import { ReactComponent as MailIcon } from "../images/icons/mail-icon.svg";
import { ReactComponent as TaskIcon } from "../images/icons/task-icon.svg";
import { ReactComponent as FileIcon } from "../images/icons/file-icon.svg";
import "../styles/RV_Sidebar.scss";

class RV_Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState(
      {
        expand: !this.state.expand,
      },
      () => {
        this.props.toggleSidebar();
      }
    );
  }

  render() {
    const { expand } = this.state;

    return (
      <div className="rv-sidebar">
        <Sidebar
          style={{
            display: "flex",
            flexDirection: "column",
            transition: "width 1s",
          }}
          width={expand ? 258 : 60}
          collapsible
        >
          <Link to="/" className="logo-wrap">
            <img src={logoLight} alt="logo" />
          </Link>
          <Sidenav
            expanded={expand}
            defaultOpenKeys={["3"]}
            appearance="subtle"
          >
            <Sidenav.Body>
              <label>Navigation</label>
              <Nav>
                <Nav.Item
                  eventKey="1"
                  href="/"
                  active
                  icon={
                    <DashboardIcon
                      className="sidebar-custom-icon dashboard-icon"
                      width="16"
                      height="16"
                    />
                  }
                >
                  Dashboard
                </Nav.Item>

                <Nav.Item
                  eventKey="2"
                  href="/relationships"
                  icon={
                    <RelationshipsIcon
                      className="sidebar-custom-icon relationships-icon"
                      width="16"
                      height="16"
                    />
                  }
                >
                  Relationships
                </Nav.Item>

                <Nav.Item eventKey="3" href="/offer-management" icon={<ManageOffersIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Manage Offers
                </Nav.Item>

                <Nav.Item eventKey="4" href="/offer-inbox" icon={<OfferInboxIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Offer Inbox
                </Nav.Item>

                <Nav.Item
                  eventKey="5"
                  icon={
                    <SettingsIcon
                      className="sidebar-custom-icon"
                      width="16"
                      height="16"
                    />
                  }
                >
                  Settings
                </Nav.Item>
                <Nav.Item
                  eventKey="11"
                  icon={
                    <HelpSupportIcon
                      className="sidebar-custom-icon"
                      width="16"
                      height="16"
                    />
                  }
                >
                  Support
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>

          {/* <Nav pullRight className="sidebar-toggle-btn-wrap">
            <Nav.Item onClick={this.handleToggle} style={{ width: 56, textAlign: 'center' }}>
              <Icon icon={expand ? 'angle-left' : 'angle-right'} />
            </Nav.Item>
          </Nav> */}
        </Sidebar>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleSidebar: () => {
    dispatch({ type: TOGGLE_SIDE_MENU });
  },
});

export default connect(null, mapDispatchToProps)(RV_Sidebar);
