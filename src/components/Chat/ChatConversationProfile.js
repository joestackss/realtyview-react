import React from 'react';
import classNames from 'classnames';
import { Avatar, ButtonToolbar, Col, Divider, Dropdown, Grid, Row, Popover, Whisper } from 'rsuite'

import { ReactComponent as BlockIcon } from '../../images/icons/block-icon.svg';
import { ReactComponent as ContactsIcon } from '../../images/icons/contacts-icon.svg';
import { ReactComponent as HideIcon } from '../../images/icons/hide-icon.svg';
import { ReactComponent as MailIcon } from '../../images/icons/mail-icon.svg';
import { ReactComponent as NotificationsOffIcon } from '../../images/icons/notifications-off-icon.svg';
import { ReactComponent as MoreIcon } from '../../images/icons/more-icon.svg';
import { ReactComponent as ProfileIcon } from '../../images/icons/profile-icon.svg';
import { ReactComponent as ProfileHiddenIcon } from '../../images/icons/profile-hidden-icon.svg';
import { ReactComponent as StarIcon } from '../../images/icons/star-icon.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/trash-icon.svg';
import { ReactComponent as UnreadIcon } from '../../images/icons/unread-icon.svg';
import RVButton from '../shared/RVButton';

import ChatContext from './ChatContext';

import '../../styles/Chat/ChatConversationProfile.scss';

const SettingsDropdown = ({ className, isFavorite, onSelect, ...props }) => {
  return (
    <Popover 
      {...props} 
      className={classNames(className, 'chat-dropdown')} 
      full
    >
      <Dropdown.Menu onSelect={onSelect}>
        {isFavorite ? (
          <Dropdown.Item className="chat-dropdown-item chat-dropdown-item-favorited" icon={<StarIcon width="12" height="12" />}>Remove from favorites</Dropdown.Item>
          ) : ( 
          <Dropdown.Item className="chat-dropdown-item" icon={<StarIcon width="12" height="12" />}>Add to favorites</Dropdown.Item>
        )}
        <Dropdown.Item divider/>
        <Dropdown.Item className="chat-dropdown-item" icon={<UnreadIcon width="12" height="12" />}>Mark as unread</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item" icon={<NotificationsOffIcon width="12" height="12" />}>Turn off notifications</Dropdown.Item>
        <Dropdown.Item divider/>
        <Dropdown.Item className="chat-dropdown-item" icon={<MailIcon width="12" height="12" />}>Send e-mail</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item" icon={<ContactsIcon width="12" height="12" />}>View in contacts</Dropdown.Item>
        <Dropdown.Item divider/>
        <Dropdown.Item className="chat-dropdown-item" icon={<BlockIcon width="12" height="12" />}>Block</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item" icon={<HideIcon width="12" height="12" />}>Hide conversation</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item" icon={<TrashIcon width="12" height="12" />}>Delete conversation</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  )
}

class ChatConversationProfile extends React.Component {
  static contextType = ChatContext;
  constructor(props) {
    super(props);
    this.state = {
      isProfileDetailOpen: false,
    };
    this.settingsTriggerRef = React.createRef();
  }

  getConversationName(otherUsers, limit = 4) {
    let name = otherUsers.slice(0, limit).map(u => u.name).join(', ');
    if (otherUsers.length > limit) {
      name = `${name}, ${otherUsers.length - limit}+`;
    }
    return name;
  }

  getConversationActive(otherUsers) {
    if (otherUsers.length === 1) {
      return otherUsers[0].status;
    }
    return otherUsers.some(u => u.status === 'active') ? 'active' : 'offline';
  }

  handleSettingsSelect = () => {
    this.settingsTriggerRef.current.hide();
  }

  toggleProfileOpened = () => {
    this.setState({ isProfileDetailOpen: !this.state.isProfileDetailOpen });
  }

  render() {
    const { conversation } = this.props;
    const { user, isMobile } = this.context;
    const { isProfileDetailOpen } = this.state;
    const others = conversation.members.filter(m => m.id !== user.id)
    const name = others.length === 0 ? user.name : this.getConversationName(others);
    const initials = (others.length === 0 ? user.name : others[0].name).split(' ').slice(0, 2).map(v => v[0]).join('');
    const avatar = others.length === 0 ? user.avatar : others[0].avatar;
    const status = others.length === 0 ? user.status : this.getConversationActive(others);

    return (
      <div className="chat-conversation-profile">
        <div className="chat-conversation-profile-header">
          {avatar ? (
            <Avatar size="sm" className="chat-conversation-profile-avatar" circle src={avatar} alt={initials}/>
          ) : (
            <Avatar size="sm" className="chat-conversation-profile-avatar" circle>{initials}</Avatar>
          )}
          <div className="chat-conversation-profile-header-content">
            <div className="chat-conversation-profile-name">{name}</div>
            <div className="chat-conversation-profile-status">
              <div className={classNames(
                'chat-status-marker', 
                `chat-status-marker-${status === 'invisible' ? 'offline' : status}`
              )}></div> 
              {status}
            </div>
          </div>
          <ButtonToolbar className="chat-conversation-profile-controls">
            {isMobile ? (
              <Whisper
                placement="bottomEnd"
                trigger="click"
                triggerRef={this.settingsTriggerRef}
                preventOverflow
                speaker={<SettingsDropdown isFavorite={conversation.is_favorite} onSelect={this.handleStatusSelect} />}
              >
              <RVButton className="chat-conversation-profile-control-btn" palette="light">
                <MoreIcon width="12" height="12"/>
              </RVButton> 
              </Whisper>           
            ) : (
              <>
                <RVButton className="chat-conversation-profile-control-btn" palette="success">
                  <MailIcon width="12" height="12"/>
                </RVButton>
                <RVButton className="chat-conversation-profile-control-btn" palette="primary">
                  <ContactsIcon width="12" height="12"/>
                </RVButton>
              </>
            )}
            {others.length === 1 && <RVButton className="chat-conversation-profile-control-btn" palette="primary" onClick={this.toggleProfileOpened}>
              {isProfileDetailOpen ? <ProfileHiddenIcon width="12" height="12"/> : <ProfileIcon width="12" height="12"/>}
            </RVButton>}
          </ButtonToolbar>
        </div>
        {others.length === 1 && <div className={classNames(
          'chat-conversation-profile-detail-container', 
          isProfileDetailOpen && 'chat-conversation-profile-detail-container-open'
        )}>
          <Grid className="chat-conversation-profile-detail" fluid>
            <Row>
              <Col className="chat-conversation-profile-detail-item" lg={8} md={24} sm={24} xs={24}>
                <div className="chat-conversation-profile-detail-name">Email:</div>
                <div className="chat-conversation-profile-detail-content">{others[0].email}</div>
              </Col>
              {others[0].location && <Col className="chat-conversation-profile-detail-item" lg={8} md={12} sm={12} xs={24}>
                <div className="chat-conversation-profile-detail-name">Location:</div>
                <div className="chat-conversation-profile-detail-content">{others[0].location}</div>
              </Col>}
              {others[0].phone && <Col className="chat-conversation-profile-detail-item" lg={8} md={12} sm={12} xs={24}>
                <div className="chat-conversation-profile-detail-name">Phone:</div>
                <div className="chat-conversation-profile-detail-content">{others[0].phone}</div>
              </Col>}
            </Row>
          </Grid>
        </div>}
        <Divider />
      </div>
    );
  }
}

export default ChatConversationProfile;