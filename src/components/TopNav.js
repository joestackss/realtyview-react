/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, Badge, Button, Icon, Popover, Whisper, ButtonToolbar, IconButton } from "rsuite";
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import * as actionCreators from '../actions/actionCreators';
import * as CommonAction from '../actions/commonAction';
import RelationshipTypeSelectModal from './RelationshipTypeSelectModal';
import { ReactComponent as SettingsIcon } from '../images/icons/settings-icon.svg';
import { ReactComponent as NotificationIcon } from '../images/icons/notification-icon.svg';
import { ReactComponent as RelationshipsIcon } from '../images/icons/relationships-icon.svg';
import { ReactComponent as HomeIcon } from '../images/icons/home-icon.svg';
import { ReactComponent as OfferIcon } from '../images/icons/offer-icon.svg';
import { ReactComponent as SuitcaseIcon } from '../images/icons/suitcase-icon.svg';
import { ReactComponent as TaskIcon } from "../images/icons/task-icon.svg";
import { ReactComponent as PadlockIcon } from '../images/icons/padlock-icon.svg';
import { ReactComponent as HelpSupportIcon } from '../images/icons/help-support-icon.svg';
import { ReactComponent as ChatIcon } from '../images/icons/chat-icon.svg';
import { ReactComponent as SignoutIcon } from '../images/icons/signout-icon.svg';
import { ReactComponent as MoreAppsIcon } from '../images/icons/more-apps-icon.svg';
import { ReactComponent as MailIcon } from "../images/icons/mail-icon.svg";
import { ReactComponent as CalendarIcon } from '../images/icons/calendar-icon.svg';
import { ReactComponent as CalculatorIcon } from '../images/icons/calculator-icon.svg';
import { ReactComponent as MenuIcon } from '../images/icons/menu-icon.svg';
import { ReactComponent as FileIcon } from "../images/icons/file-icon.svg";
import SampleProfileImg from '../images/sample-profile-picture.png';

import RVButton from './shared/RVButton';

import '../styles/TopNav.scss';
import withStyles from "react-jss";
import { Link } from 'react-router-dom';

const CreateNewDropdownMenu = ({ className, closeMenu, onCreateRelationship, onCreateListing, onCreateOffer, ...props }) => {
  const handleSelect = (onSelect) => () => {
    onSelect();
    closeMenu();
  }

  return (
    <Popover {...props} className={classNames(className, 'create-new-shortcut-dropdown')}>
      <Dropdown.Menu>
        <Dropdown.Item onSelect={handleSelect(onCreateRelationship)}>
          <RelationshipsIcon width="15" height="15"/>
          New relationship
        </Dropdown.Item>
        <Dropdown.Item onSelect={handleSelect(onCreateListing)}>
          <HomeIcon width="15" height="15"/>
          New listing
        </Dropdown.Item>
        <Dropdown.Item onSelect={handleSelect(onCreateOffer)}>
          <OfferIcon width="15" height="15"/>
          Submit an offer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
}

const MoreAppsDropdownMenu = ({ className, closeMenu, ...props }) => {
  return (
    <Popover {...props} className={classNames(className, 'more-apps-dropdown')}>
      <div className="more-apps-dropdown-wrapper">
        <div className="row">
          <div className="col-md-4 center">
            <Link to="/calendar" className="more-apps-dropdown-item">
              <CalendarIcon width="25" height="25"/>
              <p>Calendar</p>
            </Link>
          </div>
          <div className="col-md-4 center">
            <Link to="/task-management" className="more-apps-dropdown-item">
              <TaskIcon width="25" height="25"/>
              <p>Task</p>
            </Link>
          </div>
          <div className="col-md-4 center">
            <Link to="/chat" className="more-apps-dropdown-item">
              <ChatIcon width="25" height="25"/>
              <p>Chat</p>
            </Link>
          </div>
        </div>

        <div className="row mt-lg">
          <div className="col-md-4 center">
            <Link to="/email" className="more-apps-dropdown-item">
              <MailIcon width="25" height="25"/>
              <p>Email</p>
            </Link>
          </div>
          <div className="col-md-4 center">
            <Link to="/mortgage-calculator" className="more-apps-dropdown-item">
              <CalculatorIcon width="25" height="25"/>
              <p>Mortgage <br /> Calculator</p>
            </Link>
          </div>
          <div className="col-md-4 center">
            <Link to="/file-management" className="more-apps-dropdown-item">
              <FileIcon width="25" height="25"/>
              <p>File Manager</p>
            </Link>
          </div>
        </div>
      </div>
    </Popover>
  );
}

const UserOptionsDropdownMenu = ({ 
  className, 
  closeMenu, 
  onGoToAccount, 
  onGoToSettings,
  onLockScreen,
  onGoToSupport,
  onSignout,
  ...props 
}) => {
  const handleSelect = (onSelect) => () => {
    onSelect();
    closeMenu();
  }

  return (
    <Popover {...props} className={classNames(className, 'user-options-dropdown')}>
      <Dropdown.Menu>
        <Dropdown.Item onSelect={handleSelect(onGoToAccount)}>
          <SuitcaseIcon width="15" height="15"/>
          My Account
        </Dropdown.Item>
        <Dropdown.Item onSelect={handleSelect(onGoToSettings)}>
          <SettingsIcon width="15" height="15"/>
          Settings
        </Dropdown.Item>
        <Dropdown.Item onSelect={handleSelect(onLockScreen)}>
          <PadlockIcon width="15" height="15"/>
          Lock Screen
        </Dropdown.Item>
        <Dropdown.Item onSelect={handleSelect(onGoToSupport)}>
          <HelpSupportIcon width="15" height="15"/>
          Support
        </Dropdown.Item>
        <Dropdown.Item onSelect={handleSelect(onSignout)}>
          <SignoutIcon width="15" height="15"/>
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
}

const SampleMessagesDropdownMenu = ({ className, closeMenu, ...props }) => {
  return (
    <Popover {...props} className={classNames(className, 'messages-dropdown-menu')}>
      <Dropdown.Menu>
        <label>Messages</label>
        <Dropdown.Item onSelect={closeMenu}>
          <img src={SampleProfileImg} className="messages-dropdown-item-avatar" />
          <div className="messages-dropdown-item-details">
            <div className="inline-group">
              <div className="messages-dropdown-item-name">Margaret D. Evans</div>
              <div className="messages-dropdown-item-time-elapsed">1h ago</div>
            </div>

            <div className="inline-group">
              <div className="messages-dropdown-item-msg">Viverra tincidunt gravida mattis...</div>
              <div className="unread-dot"></div>
            </div>
          </div>
        </Dropdown.Item>

        <Dropdown.Item onSelect={closeMenu}>
          <img src={SampleProfileImg} className="messages-dropdown-item-avatar" />
          <div className="messages-dropdown-item-details">
            <div className="inline-group">
              <div className="messages-dropdown-item-name">Margaret D. Evans</div>
              <div className="messages-dropdown-item-time-elapsed">1h ago</div>
            </div>

            <div className="inline-group">
              <div className="messages-dropdown-item-msg">Viverra tincidunt gravida mattis...</div>
              <div className="unread-dot"></div>
            </div>
          </div>
        </Dropdown.Item>

        <Dropdown.Item onSelect={closeMenu}>
          <img src={SampleProfileImg} className="messages-dropdown-item-avatar" />
          <div className="messages-dropdown-item-details">
            <div className="inline-group">
              <div className="messages-dropdown-item-name">Margaret D. Evans</div>
              <div className="messages-dropdown-item-time-elapsed">1h ago</div>
            </div>

            <div className="inline-group">
              <div className="messages-dropdown-item-msg">Viverra tincidunt gravida mattis...</div>
              <div className="unread-dot"></div>
            </div>
          </div>
        </Dropdown.Item>

        <a href="#" className="messages-dropdown-view-all">View All</a>
      </Dropdown.Menu>
    </Popover>
  );
}

const SampleNotificationsDropdownMenu = ({ className, closeMenu, ...props }) => {
  return (
    <Popover {...props} className={classNames(className, 'notifications-dropdown-menu')}>
      <Dropdown.Menu>
        <label>Notifcations</label>
        <Dropdown.Item onSelect={closeMenu}>
          <img src={SampleProfileImg} className="notifications-dropdown-item-avatar" />
          <div className="notification-dropdown-item-details">
            <div className="inline-group">
              <p className="notifcations-dropdown-item-msg">Caleb Flakalar commented on 97 Oliver Ave</p>
              <div className="unread-dot"></div>
            </div>

            <p className="notifications-dropdown-item-time-elapsed">1 min ago</p>
          </div>
        </Dropdown.Item>

        <Dropdown.Item onSelect={closeMenu}>
          <img src={SampleProfileImg} className="notifications-dropdown-item-avatar" />
          <div className="notification-dropdown-item-details">
            <div className="inline-group">
              <p className="notifcations-dropdown-item-msg">Caleb Flakalar commented on 97 Oliver Ave</p>
              <div className="unread-dot"></div>
            </div>

            <p className="notifications-dropdown-item-time-elapsed">1 min ago</p>
          </div>
        </Dropdown.Item>

        <Dropdown.Item onSelect={closeMenu}>
          <img src={SampleProfileImg} className="notifications-dropdown-item-avatar" />
          <div className="notification-dropdown-item-details">
            <div className="inline-group">
              <p className="notifcations-dropdown-item-msg">Caleb Flakalar commented on 97 Oliver Ave</p>
              <div className="unread-dot"></div>
            </div>

            <p className="notifications-dropdown-item-time-elapsed">1 min ago</p>
          </div>
        </Dropdown.Item>

        <a href="#" className="notifications-dropdown-view-all">View All</a>
      </Dropdown.Menu>
    </Popover>
  )
}

class TopNavTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
  }

  closeMenu = () => {
    this.triggerRef.close();
  }

  render() {
    const { button, speaker, placement, ...props } = this.props;
    const sp = React.cloneElement(speaker, { closeMenu: this.closeMenu });
    return (
      <Whisper
        {...props}
        trigger="click"
        placement={placement || 'bottomStart'}
        speaker={sp}
        preventOverflow
        ref={(ref) => { this.triggerRef = ref }}
      >{button}</Whisper>
    );
  }
}

class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.state = {
      isRelationshipSelectorModalOpen: false
    };
  }

  handleSignOut() {
    this
      .props
      .unsetUser()
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.log("Could not log out");
      });
  }

  get fullname() {
    const { user } = this.props;
    const firstName = _.get(user, 'first_name');
    const lastName = _.get(user, 'last_name');
    return [firstName, lastName].join(' ');
  }

  render() {
    const { isDesktop, toggleSidebarOpen } = this.props;
    const buttonSize = isDesktop ? 'lg' : 'md';
    const buttonIconSize = isDesktop ? '20' : '18';
    return (
      <div className={classNames('top-nav', !isDesktop && 'top-nav-mobile')}>
        <div className="container-fluid">
          <div className="top-nav-controls">
            {!isDesktop && <IconButton
              appearance="subtle"
              circle
              icon={<MenuIcon width={buttonIconSize} height={buttonIconSize} />}
              size={buttonSize}
              className="top-nav-sidebar-btn"
              onClick={toggleSidebarOpen}
            />}
            <TopNavTrigger
              button={
                <RVButton
                  className="create-new-shortcut-btn"
                  palette="primary"
                  size="md"
                >
                  {isDesktop ? 'Create New' : 'Create'}&nbsp;
                  <Icon icon="chevron-down" />
                </RVButton>
              }
              speaker={
                <CreateNewDropdownMenu
                  onCreateRelationship={() => {
                    this.setState({ isRelationshipSelectorModalOpen: true });
                  }}
                  onCreateListing={() => {}}
                  onCreateOffer={() => {
                    this.props.history.push("/create-offer");
                  }}
                />
              }
              placement="bottomStart"
            />
          </div>
          <div className="top-nav-controls">
            <ButtonToolbar className="top-nav-btn-toolbar">
              <TopNavTrigger
                button={
                  <IconButton
                    appearance="subtle"
                    circle
                    icon={<MoreAppsIcon width={buttonIconSize} height={buttonIconSize} />}
                    size={buttonSize}
                  />
                }
                speaker={<MoreAppsDropdownMenu />}
                placement="bottomEnd"
              />
              <TopNavTrigger
                button={
                  <IconButton
                    appearance="subtle"
                    circle
                    icon={<ChatIcon width={buttonIconSize} height={buttonIconSize} />}
                    size={buttonSize}
                  />
                }
                speaker={<SampleMessagesDropdownMenu />}
                placement="bottomEnd"
              />
              <TopNavTrigger
                button={
                  <IconButton
                    appearance="subtle"
                    circle
                    icon={<NotificationIcon width={buttonIconSize} height={buttonIconSize} />}
                    size={buttonSize}
                  />
                }
                speaker={<SampleNotificationsDropdownMenu />}
                placement="bottomEnd"
              />
            </ButtonToolbar>
            <TopNavTrigger
              button={
                <RVButton
                  palette={isDesktop ? 'link-light' : 'light'}
                  className="user-options-btn"
                >
                  <div className="user-options-btn-avatar"></div>
                  {isDesktop && <div className="user-options-btn-name">{this.fullname && 'Guest'}</div>}
                </RVButton>
              }
              speaker={
                <UserOptionsDropdownMenu
                  onGoToAccount={() => {}}
                  onGoToSettings={() => {}}
                  onGoToSupport={() => {}}
                  onLockScreen={() => {}}
                  onSignout={this.handleSignOut}
                />
              }
              placement="bottomEnd"
            />
          </div>
        </div>

        <RelationshipTypeSelectModal show={this.state.isRelationshipSelectorModalOpen} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isSideMenuOpen: state.common.isSideMenuOpen,
  isDesktop: state.common.isDesktop,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(actionCreators, dispatch),
  toggleSidebarOpen: () => {
    dispatch(CommonAction.toggleSidebarOpen())
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopNav));
