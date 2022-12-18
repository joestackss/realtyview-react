/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */
import React from 'react';
import { Link } from 'react-router-dom';
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";
import { connect } from 'react-redux';
import {
  Sidebar,
  Sidenav,
  Nav,
  Icon } from 'rsuite';

import { TOGGLE_SIDE_MENU } from '../../constants/actionTypes';
import logoLight from '../../images/logo-light.svg';
import { ReactComponent as DashboardIcon } from '../../images/icons/dashboard-icon.svg';
import { ReactComponent as RelationshipsIcon } from '../../images/icons/relationships-icon.svg';
import { ReactComponent as ManageOffersIcon } from '../../images/icons/manage-offers-icon.svg';
import { ReactComponent as OfferInboxIcon } from '../../images/icons/offer-inbox-icon.svg';
import { ReactComponent as HelpSupportIcon } from '../../images/icons/help-support-icon.svg';
import { ReactComponent as SettingsIcon } from '../../images/icons/settings-icon.svg';
import { ReactComponent as CalendarIcon } from '../../images/icons/calendar-icon.svg';
import { ReactComponent as ChatIcon } from '../../images/icons/chat-icon.svg';
import { ReactComponent as MailIcon } from '../../images/icons/mail-icon.svg';
import { ReactComponent as TaskIcon } from '../../images/icons/task-icon.svg';
import { ReactComponent as FileIcon } from '../../images/icons/file-icon.svg';


const renderMenuItems = (expand) => {
  return (
    <>
          <Link to ="/" className="logo-wrap">
            <img src={expand ? logoLight : 'icon.png'} alt="logo" />
          </Link>
          <Sidenav
            expanded={expand}
            defaultOpenKeys={['3']}
            appearance="subtle"
          >
            <Sidenav.Body>
              { expand && (
                <label>Navigation</label>
              )}
              { !expand && (
                <hr />
              )}
              <Nav>
                <Nav.Item eventKey="1" href="/" active icon={<DashboardIcon className="sidebar-custom-icon dashboard-icon" width="16" height="16" />}>
                  Dashboard
                </Nav.Item>

                <Nav.Item eventKey="2" href="/relationships" icon={<RelationshipsIcon className="sidebar-custom-icon relationships-icon" width="16" height="16" />}>
                  Relationships
                </Nav.Item>

                <Nav.Item eventKey="3" href="/offer-management" icon={<ManageOffersIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Manage Offers
                </Nav.Item>

                <Nav.Item eventKey="4" icon={<OfferInboxIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Offer Inbox
                </Nav.Item>

                <Nav.Item eventKey="5" icon={<SettingsIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Settings
                </Nav.Item>
              </Nav>

              { expand && (
                <label className="mt-lg">Apps</label>
              )}
              { !expand && (
                <hr />
              )}
              <Nav>
                <Nav.Item eventKey="6" href="/" icon={<CalendarIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Calendar
                </Nav.Item>

                <Nav.Item eventKey="7" href="/relationships" icon={<ChatIcon className="sidebar-custom-icon relationships-icon" width="16" height="16" />}>
                  Chat
                </Nav.Item>

                <Nav.Item eventKey="8" icon={<MailIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Email
                </Nav.Item>

                <Nav.Item eventKey="9" href="/offer-manager" icon={<TaskIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Task
                </Nav.Item>

                <Nav.Item eventKey="10" icon={<FileIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  File Manager
                </Nav.Item>

                <Nav.Item eventKey="11" icon={<HelpSupportIcon className="sidebar-custom-icon" width="16" height="16" />}>
                  Support
                </Nav.Item>
              </Nav>


            </Sidenav.Body>
          </Sidenav>
    </>
  );
};

const RV_Sidebar = ({ isSideMenuOpen, toggleSidebar }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const Layout = isMobile ? MobileLayout : DesktopLayout;

  return (
    <Layout>
      {renderMenuItems(isSideMenuOpen)}
    </Layout>
  );
};

RV_Sidebar.propTypes = {
  isMobile: PropTypes.bool,
  isOpen: PropTypes.bool,
  onToggleOpen: PropTypes.bool,
};

const mapStateToProps = state => ({
  isSideMenuOpen: state.common.isSideMenuOpen
});

const mapDispatchToProps = (dispatch) => ({
  toggleSidebar: () => {
    dispatch({ type: TOGGLE_SIDE_MENU })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RV_Sidebar);
