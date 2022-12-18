import React from 'react';
import classNames from 'classnames';
import { Avatar, Divider, Dropdown, IconButton, Input, InputGroup, List, Popover, Whisper } from 'rsuite';

import { ReactComponent as NewMessageIcon } from '../../images/icons/new-message-icon.svg';
import { ReactComponent as SearchIcon } from '../../images/icons/search-icon.svg';
import { ReactComponent as SettingsIcon } from '../../images/icons/settings-icon-2.svg';

import ChatContext from './ChatContext';
import ChatOverviewConversationItem from './ChatOverviewConversationItem';

import '../../styles/Chat/ChatOverview.scss';
import RVButton from '../shared/RVButton';

const CHAT_STATUSES = ['active', 'busy', 'invisible'];

const StatusDropdown = ({ className, onSelect, ...props }) => {
  return (
    <Popover 
      {...props} 
      className={classNames(className, 'chat-dropdown', 'chat-overview-profile-status-dropdown')} 
      full
    >
      <Dropdown.Menu onSelect={onSelect}>
        {CHAT_STATUSES.map(status => (
          <Dropdown.Item key={`chat-dropdown-item-${status}`} className="chat-dropdown-item" eventKey={status}>
            <div className={classNames(
              'chat-status-marker', 
              `chat-status-marker-${status === 'invisible' ? 'offline' : status}`
            )}></div> 
            {status}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Popover>
  )
}

const SettingsDropdown = ({ className, onSelect, ...props }) => {
  return (
    <Popover 
      {...props} 
      className={classNames(className, 'chat-dropdown')} 
      full
    >
      <Dropdown.Menu onSelect={onSelect}>
        <Dropdown.Item className="chat-dropdown-item">Enable sounds</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item">Enable notifications</Dropdown.Item>
        <Dropdown.Item divider/>
        <Dropdown.Item className="chat-dropdown-item">Hidden chats</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item">Unread chats</Dropdown.Item>
        <Dropdown.Item divider/>
        <Dropdown.Item className="chat-dropdown-item">Help</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  )
}

class ChatOverview extends React.Component {
  static contextType = ChatContext;
  constructor(props) {
    super(props);
    this.state = {
      // NOTE: This is should be part of the user payload.
      // Implemented here to simulate switching.
      status: 'active',
    }
    this.statusTriggerRef = React.createRef();
    this.settingsTriggerRef = React.createRef();
  }

  componentDidMount() {
    const { user } = this.context;
    if (user.status) this.setState({ status: user.status });
  }
  
  handleStatusSelect = (status) => {
    this.setState({ status });
    this.statusTriggerRef.current.hide();
  }

  handleSettingsSelect = () => {
    this.settingsTriggerRef.current.hide();
  }

  render() {
    const { user, favoriteConversations, conversations, onConversationSelect, isMobile } = this.context;
    const { status } = this.state;
    const initials = user.name.split(' ').slice(0, 2).map(v => v[0]).join('');

    return (
      <div className="chat-overview">
        <div className="chat-overview-profile">
          {user.avatar ? (
            <Avatar className="chat-overview-profile-avatar" circle src={user.avatar} alt={initials}/>
          ) : (
            <Avatar className="chat-overview-profile-avatar" circle>{initials}</Avatar>
          )}
          <div className="chat-overview-profile-content">
            <div className="chat-overview-profile-row">
              <div className="chat-overview-profile-name">{user.name}</div>
              <div className="chat-overview-profile-btn">
                {/* 
                  NOTE: We're using Whispers instead of rsuite's Dropdown because they have better support for responsiveness.
                */}
                <Whisper
                  placement={isMobile ? 'bottomEnd' : 'bottomStart'}
                  trigger="click"
                  triggerRef={this.settingsTriggerRef}
                  preventOverflow
                  speaker={<SettingsDropdown onSelect={this.handleSettingsSelect} />}
                >
                  <IconButton appearance="subtle" circle icon={<SettingsIcon width="16" height="16" />} />
                </Whisper>
              </div>
            </div>
            <div className="chat-overview-profile-row">
              <div className="chat-overview-profile-status">
                <Whisper
                  placement="bottomStart"
                  trigger="click"
                  triggerRef={this.statusTriggerRef}
                  preventOverflow
                  speaker={<StatusDropdown onSelect={this.handleStatusSelect} />}
                >
                  <RVButton className="chat-overview-profile-status-btn" palette="light">
                    <div className={classNames(
                      'chat-status-marker', 
                      `chat-status-marker-${status === 'invisible' ? 'offline' : status}`
                    )}></div> 
                    {status}
                  </RVButton>
                </Whisper>
              </div>
              <div className="chat-overview-profile-btn">
                <IconButton 
                  appearance="subtle" 
                  circle 
                  icon={<NewMessageIcon width="16" height="16" />} 
                  onClick={() => onConversationSelect(null)}
                />
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <InputGroup className="chat-overview-search">
          <InputGroup.Addon>
            <SearchIcon width="16" height="16"/>
          </InputGroup.Addon>
          <Input placeholder="Search..." />
        </InputGroup>
        <div className="chat-overview-scrollable">
          {favoriteConversations.length > 0 && (
            <div className="chat-overview-conversation-list">
              <h6 className="chat-overview-conversation-list-title">Favorites</h6>
              <List hover>
                {favoriteConversations.map(conversation => (
                  <List.Item key={`chat-overview-conversation-list-item-${conversation.id}`} onClick={() => onConversationSelect(conversation.id)}>
                    <ChatOverviewConversationItem conversation={conversation} user={user} isMobile={isMobile}/>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
          {conversations.length > 0 && (
            <div className="chat-overview-conversation-list">
              <h6 className="chat-overview-conversation-list-title">Chat</h6>
              <List hover>
                {conversations.map(conversation => (
                  <List.Item key={`chat-overview-conversation-list-item-${conversation.id}`} onClick={() => onConversationSelect(conversation.id)}>
                    <ChatOverviewConversationItem conversation={conversation} user={user} isMobile={isMobile}/>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ChatOverview;
