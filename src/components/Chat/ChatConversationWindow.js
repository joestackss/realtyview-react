import React from 'react';
import classNames from 'classnames';
import { 
  format as dateFormat,
  isSameDay,
  isSameYear,
  differenceInCalendarDays,
} from 'date-fns';
import { Avatar, Icon, IconButton } from 'rsuite';

import ChatContext from './ChatContext';

import '../../styles/Chat/ChatConversationWindow.scss';

const DateMarker = ({ date, refDate }) => {
  let dateString = '';
  if (isSameDay(refDate, date)) {
    dateString = 'Today';
  } else if (Math.abs(differenceInCalendarDays(refDate, date)) <= 3) {
    dateString = dateFormat(date, 'eee h:mm a')
  } else if (isSameYear(refDate, date)){
    dateString = dateFormat(date, 'MM/dd h:mm a')
  } else {
    dateString = dateFormat(date, 'MM/dd/yyyy h:mm a')
  }
  return (
    <div className="chat-conversation-date-marker">{dateString}</div>
  );
}

const TextBubble = ({ text }) => {
  return (
    <div className="chat-conversation-message-bubble chat-conversation-text-bubble">
      {text}
    </div>
  );
}

const PhotoBubble = ({ image }) => {
  return (
    <div className="chat-conversation-message-bubble chat-conversation-photo-bubble">
      <img src={image.src} alt={image.alt || ''} />
    </div>
  );
}

const FileBubble = ({ attachment, ext }) => {
  const filename = attachment.src.split('/').pop().trim();
  return (
    <div className="chat-conversation-message-bubble chat-conversation-file-bubble">
      <Avatar className="chat-conversation-file-avatar" size="md">.{ext}</Avatar>
      <div className="chat-conversation-file-meta">
        <div className="chat-conversation-file-name">{filename}</div>
        {attachment.size && <div className="chat-conversation-file-size">{attachment.size}</div>}
      </div>
      <IconButton appearance="subtle" circle icon={<Icon icon="download" width={14} height={14}/>} />
    </div>
  );
}

const PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const FILE_EXTENSIONS = ['csv', 'zip', 'xlsx', 'docx', 'pdf'];

const ChatMessageBubble = ({ message }) => {
  if (message.message_attachment) {
    const ext = message.message_attachment.src.split('.').pop().trim().toLowerCase();
    if (PHOTO_EXTENSIONS.indexOf(ext) !== -1) {
      return <PhotoBubble image={message.message_attachment} />;
    } else if (FILE_EXTENSIONS.indexOf(ext) !== -1){
      return <FileBubble attachment={message.message_attachment} ext={ext} />;
    } else {
      return <TextBubble text={<i>Unsupported file</i>} />
    }
  }
  return <TextBubble text={message.message_content} />;
}

const ChatMessage = ({ message, me, condensed }) => {
  const name = me ? 'Me' : message.sender.name;
  const senderInitials = message.sender.name.split(' ').slice(0, 2).map(v => v[0]).join('');
  return (
    <div className={classNames(
      'chat-conversation-message',
      me && 'chat-conversation-message-me',
      condensed && 'chat-conversation-message-condensed',
    )}>
      {message.sender.avatar ? (
        <Avatar size="sm" className="chat-conversation-message-avatar" circle src={message.sender.avatar} alt={senderInitials}/>
      ) : (
        <Avatar size="sm" className="chat-conversation-message-avatar" circle>{senderInitials}</Avatar>
      )}
      <div className="chat-conversation-message-body">
        <div className="chat-conversation-message-name">{name}</div>
        <ChatMessageBubble message={message} />
      </div>
      <div className="chat-conversation-message-time">
        {dateFormat(message.created, 'h:mmaaaaa')}
      </div>
      {!condensed && <div className="chat-conversation-message-spacer"></div>}
    </div>
  )
}

class ChatConversationWindow extends React.Component {
  static contextType = ChatContext;

  renderConversation(sortedMessages, userId, condensed) {
    const renderedElements = [];
    const refDate = new Date();
    let trackedDate = null;

    for (const index in sortedMessages) {
      const message = sortedMessages[index];
      if (trackedDate == null || !isSameDay(trackedDate, message.created)) {
        trackedDate = message.created;
        renderedElements.push(
          <DateMarker 
            key={`chat-conversation-date-marker-${index}`}
            date={trackedDate} 
            refDate={refDate} 
          />
        );
      }
      renderedElements.push(
        <ChatMessage 
          key={`chat-conversation-message-${index}`} 
          message={message} 
          me={message.sender_id === userId}
          condensed={condensed} 
        />
      );
    }
    return renderedElements;
  }
  
  render() {
    const { messages } = this.props;
    const { user, isMobile } = this.context;
    return (
      <div className="chat-conversation-window">
        <div className="chat-conversation-window-spacer"></div>
        <div className="chat-conversation-messages">
          {this.renderConversation(messages, user.id, isMobile)}
        </div>
      </div>
    );
  }
}

export default ChatConversationWindow;