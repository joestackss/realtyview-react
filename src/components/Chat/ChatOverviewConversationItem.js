import React from 'react';
import classNames from 'classnames';
import { Avatar, Dropdown, IconButton, Popover, Whisper } from 'rsuite';

import { ReactComponent as BlockIcon } from '../../images/icons/block-icon.svg';
import { ReactComponent as HideIcon } from '../../images/icons/hide-icon.svg';
import { ReactComponent as MoreIcon } from '../../images/icons/more-icon.svg';
import { ReactComponent as NotificationsOffIcon } from '../../images/icons/notifications-off-icon.svg';
import { ReactComponent as StarIcon } from '../../images/icons/star-icon.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/trash-icon.svg';
import { ReactComponent as UnreadIcon } from '../../images/icons/unread-icon.svg';
import { humanizedDatetime } from '../../utils/common';

import '../../styles/Chat/ChatOverviewConversationItem.scss';

const OptionsDropdown = ({ className, onSelect, isFavorite, ...props }) => {
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
        <Dropdown.Item className="chat-dropdown-item" icon={<BlockIcon width="12" height="12" />}>Block</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item" icon={<HideIcon width="12" height="12" />}>Hide conversation</Dropdown.Item>
        <Dropdown.Item className="chat-dropdown-item" icon={<TrashIcon width="12" height="12" />}>Delete conversation</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  )
}

class ChatOverviewConversationItem extends React.Component {
  constructor(props) {
    super(props);
    this.optionsTriggerRef = React.createRef();
  }

  handleOptionsSelect = () => {
    this.optionsTriggerRef.current.hide();
  }

  render() {
    const { conversation, user, isMobile } = this.props;
    const others = conversation.members.filter(m => m.id !== user.id)
    const name = others.length === 0 ? user.name : (others.length === 1 ? others[0].name : `${others[0].name}, ${others.length - 1}+`);
    const initials = (others.length === 0 ? user.name : others[0].name).split(' ').slice(0, 2).map(v => v[0]).join('');
    const avatar = others.length === 0 ? user.avatar : others[0].avatar;

    const recentMessage = conversation.recentMessage;
    const dateString = humanizedDatetime(recentMessage.created);
    const messagePreview = (
      <span>
        {recentMessage.sender_id === user.id && 'You: '}
        {recentMessage.message_content ? recentMessage.message_content : (
          recentMessage.message_attachment ? (
            <i>{recentMessage.message_attachment.alt || recentMessage.message_attachment.src.split('/').pop().trim()}</i> 
          ) : (
            <i>Empty message</i>
          )
        )}
      </span>
    );
    // Just count all messages the user hasn't replied to as unread for now.
    const unread = recentMessage.sender_id !== user.id; 
    return (
      <div className={classNames(
        'chat-overview-conversation-item', 
        isMobile ? 'chat-overview-conversation-item-mobile' : 'chat-overview-conversation-item-full',
      )}>
        {avatar ? (
          <Avatar className="chat-overview-conversation-item-avatar" circle src={avatar} alt={initials}/>
        ) : (
          <Avatar className="chat-overview-conversation-item-avatar" circle>{initials}</Avatar>
        )}
        <div className="chat-overview-conversation-item-content">
          <div className="chat-overview-conversation-item-header">
            <div className="chat-overview-conversation-item-name">{name}</div>
            <div className="chat-overview-conversation-item-date">{dateString}</div>
          </div>
          <div className="chat-overview-conversation-item-body">
            <div className={classNames(
              'chat-overview-conversation-item-message',
              unread && 'chat-overview-conversation-item-message-unread', 
            )}>{messagePreview}</div>
            {unread && <div className="chat-overview-conversation-item-unread-marker"></div>}
            <div className="chat-overview-conversation-item-options">
              <Whisper
                placement={isMobile ? 'autoVerticalEnd' : 'autoVerticalStart'}
                trigger="click"
                triggerRef={this.optionsTriggerRef}
                preventOverflow
                speaker={<OptionsDropdown isFavorite={conversation.is_favorite} onSelect={this.handleOptionsSelect} />}
              >
                <IconButton appearance="subtle" circle icon={<MoreIcon width="16" height="16" />} onClick={e => e.stopPropagation()}/>
              </Whisper>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ChatOverviewConversationItem;